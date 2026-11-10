// lib/websocket.js
// Lightweight RFC 6455 WebSocket Server Implementation (Zero External Dependencies)
const crypto = require('crypto');
const EventEmitter = require('events');

const WS_MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class SimpleWebSocketServer extends EventEmitter {
  constructor(options = {}) {
    super();
    this.clients = new Set();
    if (options.server) {
      options.server.on('upgrade', (req, socket, head) => {
        this.handleUpgrade(req, socket, head);
      });
    }
  }

  handleUpgrade(req, socket, head) {
    const key = req.headers['sec-websocket-key'];
    if (!key) {
      socket.destroy();
      return;
    }

    const acceptKey = crypto
      .createHash('sha1')
      .update(key + WS_MAGIC_STRING)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`
    ];

    socket.write(headers.join('\r\n') + '\r\n\r\n');

    const ws = new SimpleWebSocket(socket);
    this.clients.add(ws);

    ws.on('close', () => {
      this.clients.delete(ws);
    });

    this.emit('connection', ws, req);
  }

  broadcast(data, filterFn = null) {
    for (const client of this.clients) {
      if (!filterFn || filterFn(client)) {
        client.send(data);
      }
    }
  }
}

class SimpleWebSocket extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this.readyState = 1; // 1 = OPEN
    this.buffer = Buffer.alloc(0);

    socket.on('data', (chunk) => this._onData(chunk));
    socket.on('close', () => this._onClose());
    socket.on('error', (err) => {
      this.emit('error', err);
      this._onClose();
    });
  }

  _onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    this._parseFrames();
  }

  _parseFrames() {
    while (this.buffer.length >= 2) {
      const firstByte = this.buffer[0];
      const secondByte = this.buffer[1];

      const fin = (firstByte & 0x80) === 0x80;
      const opcode = firstByte & 0x0F;
      const masked = (secondByte & 0x80) === 0x80;
      let payloadLength = secondByte & 0x7F;

      let offset = 2;
      if (payloadLength === 126) {
        if (this.buffer.length < offset + 2) return;
        payloadLength = this.buffer.readUInt16BE(offset);
        offset += 2;
      } else if (payloadLength === 127) {
        if (this.buffer.length < offset + 8) return;
        payloadLength = Number(this.buffer.readBigUInt64BE(offset));
        offset += 8;
      }

      let maskKey = null;
      if (masked) {
        if (this.buffer.length < offset + 4) return;
        maskKey = this.buffer.subarray(offset, offset + 4);
        offset += 4;
      }

      if (this.buffer.length < offset + payloadLength) return;

      let payload = this.buffer.subarray(offset, offset + payloadLength);
      this.buffer = this.buffer.subarray(offset + payloadLength);

      if (masked && maskKey) {
        const unmasked = Buffer.alloc(payload.length);
        for (let i = 0; i < payload.length; i++) {
          unmasked[i] = payload[i] ^ maskKey[i % 4];
        }
        payload = unmasked;
      }

      if (opcode === 0x8) {
        // Close frame
        this.close();
        return;
      } else if (opcode === 0x9) {
        // Ping -> Pong
        this._sendFrame(0xA, payload);
      } else if (opcode === 0x1) {
        // Text frame
        const text = payload.toString('utf8');
        this.emit('message', text);
      }
    }
  }

  _sendFrame(opcode, payloadBuffer) {
    if (this.readyState !== 1 || this.socket.destroyed) return;
    const length = payloadBuffer.length;
    let header;

    if (length < 126) {
      header = Buffer.alloc(2);
      header[0] = 0x80 | opcode;
      header[1] = length;
    } else if (length <= 0xFFFF) {
      header = Buffer.alloc(4);
      header[0] = 0x80 | opcode;
      header[1] = 126;
      header.writeUInt16BE(length, 2);
    } else {
      header = Buffer.alloc(10);
      header[0] = 0x80 | opcode;
      header[1] = 127;
      header.writeBigUInt64BE(BigInt(length), 2);
    }

    try {
      this.socket.write(Buffer.concat([header, payloadBuffer]));
    } catch (e) {
      this._onClose();
    }
  }

  send(data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    this._sendFrame(0x1, Buffer.from(data, 'utf8'));
  }

  close() {
    if (this.readyState !== 1) return;
    this.readyState = 2; // CLOSING
    this._sendFrame(0x8, Buffer.alloc(0));
    this.socket.end();
    this._onClose();
  }

  _onClose() {
    if (this.readyState === 3) return;
    this.readyState = 3; // CLOSED
    this.emit('close');
  }
}

module.exports = { SimpleWebSocketServer, SimpleWebSocket };
