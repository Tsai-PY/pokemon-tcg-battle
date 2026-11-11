// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { SimpleWebSocketServer } = require('./lib/websocket');
const auth = require('./lib/auth');
const cardDb = require('./lib/cardDb');
const { validateDeck, parseDeckText } = require('./lib/deckValidator');
const { initSharedDecks, getSharedDecks, uploadSharedDeck } = require('./lib/initDecks');
const { PTCGGame } = require('./lib/gameEngine');
const { playAiTurn } = require('./lib/aiPlayer');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialize users and shared decks
auth.initUsersDb();
initSharedDecks();

// In-memory games and rooms store
const activeGames = new Map();
const activeRooms = new Map(); // roomCode -> { roomCode, gameId, hostUser, hostDeckSlot, clientUser, clientDeckSlot, status: 'waiting' | 'playing' }

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        // 5MB limit
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body) return resolve({});
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        resolve({ rawText: body });
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function extractToken(req) {
  const header = req.headers['authorization'];
  if (!header) return null;
  const parts = header.split(' ');
  return parts.length === 2 ? parts[1] : parts[0];
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  // ================= API ROUTES =================

  // 1. Auth: Register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = await parseRequestBody(req);
    const result = auth.registerUser(body.phone, body.birthday, body.name);
    return sendJson(res, result.success ? 200 : 400, result);
  }

  // 2. Auth: Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = await parseRequestBody(req);
    const result = auth.loginUser(body.phone, body.birthday);
    return sendJson(res, result.success ? 200 : 401, result);
  }

  // 3. Auth: Current user info
  if (pathname === '/api/auth/me' && method === 'GET') {
    const token = extractToken(req);
    const user = auth.verifyToken(token);
    if (!user) return sendJson(res, 401, { success: false, message: '未登入或憑證無效' });
    return sendJson(res, 200, { success: true, user });
  }

  // 4. Admin: Member management
  if (pathname === '/api/admin/members' && method === 'GET') {
    const token = extractToken(req);
    const result = auth.getMemberList(token);
    return sendJson(res, result.success ? 200 : 403, result);
  }

  if (pathname === '/api/admin/members/status' && method === 'POST') {
    const token = extractToken(req);
    const body = await parseRequestBody(req);
    const result = auth.updateMemberStatus(token, body.phone, body.status);
    return sendJson(res, result.success ? 200 : 400, result);
  }

  if (pathname === '/api/admin/members/delete' && method === 'POST') {
    const token = extractToken(req);
    const body = await parseRequestBody(req);
    const result = auth.deleteMember(token, body.phone);
    return sendJson(res, result.success ? 200 : 400, result);
  }

  // 5. Decks: Get 5 shared decks
  if (pathname === '/api/decks' && method === 'GET') {
    const decks = getSharedDecks();
    return sendJson(res, 200, { success: true, decks });
  }

  // 6. Decks: Parse & Validate preview
  if (pathname === '/api/decks/parse' && method === 'POST') {
    const body = await parseRequestBody(req);
    let cardEntries = body.cardEntries;
    if (!cardEntries && body.text) {
      cardEntries = parseDeckText(body.text);
    }
    const validation = validateDeck(cardEntries || []);
    return sendJson(res, 200, { success: true, validation, cardEntries });
  }

  // 7. Decks: Upload / Save into 10-slot shared deck
  if (pathname === '/api/decks/upload' && method === 'POST') {
    const token = extractToken(req);
    const user = auth.verifyToken(token);
    if (!user) return sendJson(res, 401, { success: false, message: '請先登入後再上傳牌組！' });

    const body = await parseRequestBody(req);
    let cardEntries = body.cardEntries;
    if (!cardEntries && body.rawText) {
      cardEntries = parseDeckText(body.rawText);
    }

    const result = uploadSharedDeck(
      body.slot || 1,
      body.name,
      user.phone,
      user.name,
      cardEntries || [],
      body.description || ''
    );
    return sendJson(res, result.success ? 200 : 400, result);
  }

  // 8. Cards: Lookup DB
  if (pathname === '/api/cards' && method === 'GET') {
    return sendJson(res, 200, { success: true, cards: cardDb.CARD_DATABASE });
  }

  // 8.1 Rooms: Create Online Room (for Laptop vs iPad)
  if (pathname === '/api/rooms/create' && method === 'POST') {
    const token = extractToken(req);
    const user = auth.verifyToken(token);
    if (!user) return sendJson(res, 401, { success: false, message: '請先登入！' });

    const body = await parseRequestBody(req);
    const roomCode = String(Math.floor(1000 + Math.random() * 9000));
    const deckSlot = parseInt(body.deckSlot, 10) || 1;

    activeRooms.set(roomCode, {
      roomCode,
      gameId: null,
      hostUser: user,
      hostDeckSlot: deckSlot,
      clientUser: null,
      clientDeckSlot: null,
      status: 'waiting',
      createdAt: Date.now()
    });

    return sendJson(res, 200, { success: true, roomCode, message: '房間建立成功，等待對手加入！' });
  }

  // 8.2 Rooms: List Open Rooms
  if (pathname === '/api/rooms' && method === 'GET') {
    const rooms = [];
    for (const [code, r] of activeRooms.entries()) {
      if (r.status === 'waiting') {
        rooms.push({
          roomCode: r.roomCode,
          hostName: r.hostUser.name || r.hostUser.phone,
          hostPhone: r.hostUser.phone,
          hostDeckSlot: r.hostDeckSlot,
          createdAt: r.createdAt
        });
      }
    }
    return sendJson(res, 200, { success: true, rooms });
  }

  // 8.3 Rooms: Join Online Room
  if (pathname === '/api/rooms/join' && method === 'POST') {
    const token = extractToken(req);
    const user = auth.verifyToken(token);
    if (!user) return sendJson(res, 401, { success: false, message: '請先登入！' });

    const body = await parseRequestBody(req);
    const roomCode = String(body.roomCode || '').trim();
    const room = activeRooms.get(roomCode);

    if (!room) return sendJson(res, 404, { success: false, message: '找不到此房間代號，請確認輸入是否正確！' });
    if (room.status !== 'waiting') return sendJson(res, 400, { success: false, message: '此房間已在對戰中或已結束！' });

    room.clientUser = user;
    room.clientDeckSlot = parseInt(body.deckSlot, 10) || 2;
    room.status = 'playing';

    // Start PTCG Game with Host (P1) vs Client (P2)
    const decks = getSharedDecks();
    const deck1 = decks.find(d => d.slot === room.hostDeckSlot) || decks[0];
    const deck2 = decks.find(d => d.slot === room.clientDeckSlot) || decks[1] || decks[0];

    const gameId = `room_game_${roomCode}_${Date.now()}`;
    room.gameId = gameId;

    const p1Config = {
      id: room.hostUser.phone,
      name: room.hostUser.name || room.hostUser.phone,
      isAi: false,
      deck: deck1
    };

    const p2Config = {
      id: room.clientUser.phone,
      name: room.clientUser.name || room.clientUser.phone,
      isAi: false,
      deck: deck2
    };

    const game = new PTCGGame(gameId, p1Config, p2Config);
    game.startSetup();
    activeGames.set(gameId, game);

    // Notify any waiting websocket
    broadcastRoomUpdate(roomCode, { type: 'game_start', gameId, roomCode });

    return sendJson(res, 200, {
      success: true,
      gameId,
      playerIndex: 1, // Client is Player 2
      state: game.getState(1)
    });
  }

  // 8.4 Rooms: Check Status (Polling fallback for Host)
  if (pathname.startsWith('/api/rooms/status/') && method === 'GET') {
    const code = pathname.split('/')[4];
    const room = activeRooms.get(code);
    if (!room) return sendJson(res, 404, { success: false, message: '找不到房間' });
    return sendJson(res, 200, {
      success: true,
      status: room.status,
      gameId: room.gameId,
      playerIndex: 0 // Host is Player 1
    });
  }

  // 9. Games: Create Game
  if (pathname === '/api/games/create' && method === 'POST') {
    const token = extractToken(req);
    const user = auth.verifyToken(token);
    if (!user) return sendJson(res, 401, { success: false, message: '請先登入！' });

    const body = await parseRequestBody(req);
    const mode = body.mode || 'pve'; // 'pve', 'pvp', 'hotseat'
    const decks = getSharedDecks();

    const deck1 = decks.find(d => d.slot === (parseInt(body.deckSlot, 10) || 1)) || decks[0];
    const deck2 = decks.find(d => d.slot === (parseInt(body.oppDeckSlot, 10) || 2)) || decks[1] || decks[0];

    const gameId = `game_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const player1Config = {
      id: user.phone,
      name: user.name || user.phone,
      isAi: false,
      deck: deck1
    };

    const player2Config = {
      id: mode === 'pve' ? 'computer_ai' : (mode === 'hotseat' ? `${user.phone}_p2` : (body.oppPhone || 'player2')),
      name: mode === 'pve' ? '電腦訓練家 (AI)' : (mode === 'hotseat' ? '玩家 2 (熱座模式)' : '玩家 2'),
      isAi: mode === 'pve',
      deck: deck2
    };

    const game = new PTCGGame(gameId, player1Config, player2Config);
    game.startSetup();
    activeGames.set(gameId, game);

    // If first turn player is AI, trigger turn
    if (game.status === 'active' && game.players[game.activePlayerIndex].isAi) {
      setTimeout(() => {
        playAiTurn(game, game.activePlayerIndex);
        broadcastGameState(game);
      }, 1200);
    }

    return sendJson(res, 200, { success: true, gameId, state: game.getState() });
  }

  // 10. Games: Get State
  if (pathname.startsWith('/api/games/') && method === 'GET') {
    const parts = pathname.split('/');
    const gameId = parts[3];
    const game = activeGames.get(gameId);
    if (!game) return sendJson(res, 404, { success: false, message: '找不到此對戰房間' });
    return sendJson(res, 200, { success: true, state: game.getState() });
  }

  // 11. Games: Perform Action via REST (fallback)
  if (pathname.startsWith('/api/games/') && pathname.endsWith('/action') && method === 'POST') {
    const parts = pathname.split('/');
    const gameId = parts[3];
    const game = activeGames.get(gameId);
    if (!game) return sendJson(res, 404, { success: false, message: '找不到此對戰房間' });

    const body = await parseRequestBody(req);
    const pIdx = typeof body.playerIndex === 'number' ? body.playerIndex : game.activePlayerIndex;
    let actionRes = { success: false, message: '未知操作' };

    switch (body.action) {
      case 'bench':
        actionRes = game.playBasicToBench(pIdx, body.cardInstanceId);
        break;
      case 'evolve':
        actionRes = game.evolvePokemon(pIdx, body.cardInstanceId, body.targetSlot);
        break;
      case 'attach_energy':
        actionRes = game.attachEnergy(pIdx, body.cardInstanceId, body.targetSlot);
        break;
      case 'attach_tool':
        actionRes = game.attachTool(pIdx, body.cardInstanceId, body.targetSlot);
        break;
      case 'play_item':
        actionRes = game.playItem(pIdx, body.cardInstanceId, body.params);
        break;
      case 'play_supporter':
        actionRes = game.playSupporter(pIdx, body.cardInstanceId, body.params);
        break;
      case 'retreat':
        actionRes = game.retreatActive(pIdx, body.benchIndex);
        break;
      case 'attack':
        actionRes = game.attack(pIdx, body.attackIndex || 0);
        break;
      case 'end_turn':
        game.nextTurn();
        actionRes = { success: true };
        break;
    }

    // Trigger AI if it's now AI's turn
    if (game.status === 'active' && game.players[game.activePlayerIndex].isAi) {
      setTimeout(() => {
        playAiTurn(game, game.activePlayerIndex);
        broadcastGameState(game);
      }, 1200);
    }

    broadcastGameState(game);
    return sendJson(res, actionRes.success ? 200 : 400, { ...actionRes, state: game.getState() });
  }

  // ================= STATIC FILES =================
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Serve original playmat image from root if requested
  if (pathname === '/playmat.jpg' || pathname === '/S__12115980.jpg') {
    const matPath = path.join(__dirname, 'S__12115980.jpg');
    if (fs.existsSync(matPath)) {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      fs.createReadStream(matPath).pipe(res);
      return;
    }
  }

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

// Setup WebSocket Server
const wss = new SimpleWebSocketServer({ server });
const roomClients = new Map(); // gameId -> Set of ws
const waitingRoomClients = new Map(); // roomCode -> Set of ws

function broadcastRoomUpdate(roomCode, data) {
  const clients = waitingRoomClients.get(roomCode);
  if (!clients) return;
  const msg = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

wss.on('connection', (ws) => {
  let currentGameId = null;
  let currentRoomCode = null;

  ws.on('message', (msgStr) => {
    try {
      const data = JSON.parse(msgStr);
      const { type, gameId, roomCode, playerIndex, payload } = data;

      if (type === 'wait_room') {
        currentRoomCode = roomCode;
        if (!waitingRoomClients.has(roomCode)) {
          waitingRoomClients.set(roomCode, new Set());
        }
        waitingRoomClients.get(roomCode).add(ws);
        return;
      }

      if (type === 'join') {
        currentGameId = gameId;
        ws.playerIndex = typeof playerIndex === 'number' ? playerIndex : 0;
        ws.gameId = gameId;

        if (!roomClients.has(gameId)) {
          roomClients.set(gameId, new Set());
        }
        roomClients.get(gameId).add(ws);

        const game = activeGames.get(gameId);
        if (game) {
          ws.send(JSON.stringify({
            type: 'state',
            playerIndex: ws.playerIndex,
            state: game.getState(ws.playerIndex)
          }));
        }
        return;
      }

      if (currentGameId && activeGames.has(currentGameId)) {
        const game = activeGames.get(currentGameId);
        const pIdx = typeof ws.playerIndex === 'number' ? ws.playerIndex : (typeof playerIndex === 'number' ? playerIndex : game.activePlayerIndex);
        let actionRes = { success: false, message: '未知操作' };

        switch (type) {
          case 'bench':
            actionRes = game.playBasicToBench(pIdx, payload.cardInstanceId);
            break;
          case 'evolve':
            actionRes = game.evolvePokemon(pIdx, payload.cardInstanceId, payload.targetSlot);
            break;
          case 'attach_energy':
            actionRes = game.attachEnergy(pIdx, payload.cardInstanceId, payload.targetSlot);
            break;
          case 'attach_tool':
            actionRes = game.attachTool(pIdx, payload.cardInstanceId, payload.targetSlot);
            break;
          case 'play_item':
            actionRes = game.playItem(pIdx, payload.cardInstanceId, payload.params);
            break;
          case 'play_supporter':
            actionRes = game.playSupporter(pIdx, payload.cardInstanceId, payload.params);
            break;
          case 'retreat':
            actionRes = game.retreatActive(pIdx, payload.benchIndex);
            break;
          case 'attack':
            actionRes = game.attack(pIdx, payload.attackIndex || 0);
            break;
          case 'end_turn':
            game.nextTurn();
            actionRes = { success: true };
            break;
        }

        if (!actionRes.success) {
          ws.send(JSON.stringify({ type: 'error', message: actionRes.message }));
        } else {
          broadcastGameState(game);

          // If next is AI
          if (game.status === 'active' && game.players[game.activePlayerIndex].isAi) {
            setTimeout(() => {
              playAiTurn(game, game.activePlayerIndex);
              broadcastGameState(game);
            }, 1200);
          }
        }
      }
    } catch (e) {
      console.error('WS Error:', e);
    }
  });

  ws.on('close', () => {
    if (currentGameId && roomClients.has(currentGameId)) {
      roomClients.get(currentGameId).delete(ws);
    }
    if (currentRoomCode && waitingRoomClients.has(currentRoomCode)) {
      waitingRoomClients.get(currentRoomCode).delete(ws);
    }
  });
});

function broadcastGameState(game) {
  const clients = roomClients.get(game.id);
  if (!clients) return;
  for (const client of clients) {
    if (client.readyState === 1) {
      const pIdx = typeof client.playerIndex === 'number' ? client.playerIndex : null;
      client.send(JSON.stringify({
        type: 'state',
        playerIndex: pIdx,
        state: game.getState(pIdx)
      }));
    }
  }
}

function getLocalIp() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`====================================================`);
  console.log(`⚡ 寶可夢紙牌（PTCG）對戰系統伺服器已啟動！`);
  console.log(`💻 筆記型電腦 (本機): http://localhost:${PORT}`);
  console.log(`📱 iPad / 手機 (區網連線): http://${localIp}:${PORT}`);
  console.log(`👑 預設管理員帳號: 0988229731 / 密碼: 19710607`);
  console.log(`====================================================`);
});
