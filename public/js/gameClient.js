// public/js/gameClient.js
// PTCG Battle Field Controller & WebSocket / REST Synchronization

let currentGameId = null;
let currentGameState = null;
let currentPlayerIndex = 0; // 0 (player 1) or 1 (player 2)
let socket = null;
let selectedHandCard = null;

// Start a game from Matchmaking screen
async function startGame() {
  const token = localStorage.getItem('ptcg_token');
  const modeCard = document.querySelector('.mode-card.selected');
  const mode = modeCard ? modeCard.getAttribute('data-mode') : 'pve';

  const deckSlot = parseInt(document.getElementById('match-player-deck-select').value, 10) || 1;
  const oppDeckSlot = parseInt(document.getElementById('match-opp-deck-select').value, 10) || 2;

  try {
    const res = await fetch('/api/games/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ mode, deckSlot, oppDeckSlot })
    });
    const data = await res.json();

    if (!data.success) {
      alert('建立對戰失敗：' + data.message);
      return;
    }

    currentGameId = data.gameId;
    currentPlayerIndex = 0;
    currentGameState = data.state;

    switchView('view-battle');
    initGameWebSocket(currentGameId);
    renderGameState(currentGameState);

    sfx.playFanfare();
  } catch (err) {
    console.error('startGame error:', err);
    alert('啟動對戰發生錯誤');
  }
}

// WebSocket Connection
function initGameWebSocket(gameId) {
  if (socket) {
    try { socket.close(); } catch (e) {}
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/`;

  try {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'join',
        gameId,
        playerIndex: currentPlayerIndex
      }));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'state') {
          currentGameState = msg.state;
          renderGameState(currentGameState);
        } else if (msg.type === 'error') {
          alert('操作無效：' + msg.message);
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    socket.onerror = (err) => {
      console.warn('WS error, using REST fallback', err);
    };
  } catch (e) {
    console.warn('WS init failed, using REST fallback', e);
  }
}

// Send Action to Engine (WS with REST fallback)
async function sendGameAction(actionType, payload = {}) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: actionType,
      gameId: currentGameId,
      playerIndex: currentPlayerIndex,
      payload
    }));
    return;
  }

  // Fallback to REST
  try {
    const res = await fetch(`/api/games/${currentGameId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: actionType,
        playerIndex: currentPlayerIndex,
        ...payload
      })
    });
    const data = await res.json();
    if (data.success && data.state) {
      currentGameState = data.state;
      renderGameState(currentGameState);
    } else if (!data.success) {
      alert('操作提示：' + data.message);
    }
  } catch (err) {
    console.error('sendGameAction REST fallback error:', err);
  }
}

// Render complete battle field matching photo S__12115980.jpg
function renderGameState(state) {
  if (!state) return;

  const player = state.players[currentPlayerIndex];
  const opponent = state.players[1 - currentPlayerIndex];
  const isMyTurn = state.activePlayerIndex === currentPlayerIndex;

  // Turn Header & Status
  const turnLabel = document.getElementById('battle-turn-label');
  const activeLabel = document.getElementById('battle-current-player-label');
  const endTurnBtn = document.getElementById('btn-action-end-turn');
  const attackBtn = document.getElementById('btn-action-attack');

  if (turnLabel) turnLabel.textContent = `第 ${state.turnNumber} 回合`;
  if (activeLabel) {
    const activePlayerName = state.players[state.activePlayerIndex].name;
    activeLabel.textContent = `輪到：${activePlayerName} ${isMyTurn ? '（您的回合）' : '（思考中...）'}`;
    activeLabel.style.color = isMyTurn ? '#34d399' : '#f59e0b';
  }

  if (endTurnBtn) {
    endTurnBtn.disabled = !isMyTurn;
    endTurnBtn.style.opacity = isMyTurn ? '1' : '0.5';
  }
  if (attackBtn) {
    attackBtn.disabled = !isMyTurn || state.turnNumber === 1;
    attackBtn.style.opacity = (!isMyTurn || state.turnNumber === 1) ? '0.5' : '1';
  }

  // 1. OPPONENT FIELD (TOP)
  // Top-Left: 弃牌区
  const oppDiscardContent = document.getElementById('opp-discard-content');
  if (oppDiscardContent) {
    const oppLastDiscard = opponent.discard && opponent.discard.length > 0 ? opponent.discard[opponent.discard.length - 1] : null;
    oppDiscardContent.innerHTML = oppLastDiscard ? renderCardHtml(oppLastDiscard) : '';
  }

  // Mid-Left: 牌库
  const oppDeckCount = document.getElementById('opp-deck-count');
  if (oppDeckCount) oppDeckCount.textContent = opponent.deckCount;

  // Top-Center: 备战区 (5 Bench Slots)
  const oppBenchRow = document.getElementById('opp-bench-row');
  if (oppBenchRow) {
    const slots = oppBenchRow.querySelectorAll('.bench-card-slot');
    slots.forEach((slotEl, idx) => {
      const bPokemon = opponent.bench[idx];
      slotEl.innerHTML = bPokemon ? renderCardHtml(bPokemon) : `<span class="mat-slot-label">备战区</span>`;
      if (bPokemon) {
        slotEl.onclick = () => inspectCard(bPokemon, 'opp_bench', idx);
      } else {
        slotEl.onclick = null;
      }
    });
  }

  // Center-Top: 战斗场 (Active)
  const oppActiveZone = document.getElementById('opp-active-zone');
  if (oppActiveZone) {
    oppActiveZone.innerHTML = opponent.active ? renderCardHtml(opponent.active) : `<span class="mat-slot-label">战斗场</span>`;
    if (opponent.active) {
      oppActiveZone.onclick = () => inspectCard(opponent.active, 'opp_active');
    }
  }

  // Top-Right: 奖赏卡 (6 Prize Cards)
  const oppPrizeZone = document.getElementById('opp-prize-zone');
  if (oppPrizeZone) {
    let prizeHtml = `<span class="mat-slot-label" style="top: -20px; font-size: 0.75rem;">奖赏卡 (${opponent.prizeCount}/6)</span>`;
    for (let i = 0; i < opponent.prizeCount; i++) {
      prizeHtml += `<div class="ptcg-card ptcg-card-back prize-card"></div>`;
    }
    oppPrizeZone.innerHTML = prizeHtml;
  }

  // 2. PLAYER FIELD (BOTTOM)
  // Bottom-Left: 奖赏卡 (6 Prize Cards)
  const playerPrizeZone = document.getElementById('player-prize-zone');
  if (playerPrizeZone) {
    let prizeHtml = `<span class="mat-slot-label" style="top: -20px; font-size: 0.75rem;">奖赏卡 (${player.prizeCount}/6)</span>`;
    for (let i = 0; i < player.prizeCount; i++) {
      prizeHtml += `<div class="ptcg-card ptcg-card-back prize-card"></div>`;
    }
    playerPrizeZone.innerHTML = prizeHtml;
  }

  // Center-Front: 战斗场 (Active)
  const playerActiveZone = document.getElementById('player-active-zone');
  if (playerActiveZone) {
    playerActiveZone.innerHTML = player.active ? renderCardHtml(player.active) : `<span class="mat-slot-label">战斗场</span>`;
    if (player.active) {
      playerActiveZone.onclick = () => inspectCard(player.active, 'self_active');
    }
  }

  // Center-Back: 备战区 (5 Bench Slots)
  const playerBenchRow = document.getElementById('player-bench-row');
  if (playerBenchRow) {
    const slots = playerBenchRow.querySelectorAll('.bench-card-slot');
    slots.forEach((slotEl, idx) => {
      const bPokemon = player.bench[idx];
      slotEl.innerHTML = bPokemon ? renderCardHtml(bPokemon) : `<span class="mat-slot-label">备战区</span>`;
      if (bPokemon) {
        slotEl.onclick = () => inspectCard(bPokemon, 'self_bench', idx);
      } else {
        slotEl.onclick = null;
      }
    });
  }

  // Mid-Right: 牌库
  const playerDeckCount = document.getElementById('player-deck-count');
  if (playerDeckCount) playerDeckCount.textContent = player.deckCount;

  // Bottom-Right: 弃牌区
  const playerDiscardContent = document.getElementById('player-discard-content');
  if (playerDiscardContent) {
    const playerLastDiscard = player.discard && player.discard.length > 0 ? player.discard[player.discard.length - 1] : null;
    playerDiscardContent.innerHTML = playerLastDiscard ? renderCardHtml(playerLastDiscard) : '';
  }

  // 3. DOCKED HAND BAR
  const handContainer = document.getElementById('player-hand-container');
  if (handContainer) {
    handContainer.innerHTML = '';
    (player.hand || []).forEach(card => {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'hand-card-item';
      cardWrapper.innerHTML = renderCardHtml(card);
      cardWrapper.onclick = () => inspectCard(card, 'hand');
      handContainer.appendChild(cardWrapper);
    });
  }

  // 4. COMBAT LOGS
  const logBox = document.getElementById('combat-log-box');
  const logCount = document.getElementById('log-count');
  if (logBox && state.logs) {
    if (logCount) logCount.textContent = `${state.logs.length} 條記錄`;
    logBox.innerHTML = '';
    state.logs.forEach(log => {
      const logDiv = document.createElement('div');
      let typeClass = '';
      if (log.message.includes('回合') || log.message.includes('=====') || log.message.includes('先攻')) {
        typeClass = 'turn-header';
      } else if (log.message.includes('攻擊') || log.message.includes('傷害') || log.message.includes('⚔️')) {
        typeClass = 'attack';
      } else if (log.message.includes('昏厥') || log.message.includes('獎賞卡') || log.message.includes('🏆') || log.message.includes('勝利')) {
        typeClass = 'ko';
      }
      logDiv.className = `log-entry ${typeClass}`;
      logDiv.textContent = log.message;
      logBox.appendChild(logDiv);
    });
    logBox.scrollTop = logBox.scrollHeight;
  }

  // 5. GAME OVER CHECK
  if (state.status === 'finished') {
    showGameOverModal(state);
  }
}

// Card Action Modal Popup
function inspectCard(card, location, slotIndex = null) {
  if (!card) return;
  selectedHandCard = { card, location, slotIndex };

  const modal = document.getElementById('card-action-popup');
  const content = document.getElementById('card-action-content');
  if (!modal || !content) return;

  const player = currentGameState.players[currentPlayerIndex];
  const isMyTurn = currentGameState.activePlayerIndex === currentPlayerIndex;

  let actionsHtml = '';

  if (location === 'hand' && isMyTurn) {
    // 1. Play Basic Pokemon to Bench
    if (card.supertype === 'pokemon' && card.subtypes && card.subtypes.includes('Basic')) {
      if (player.bench.length < 5) {
        actionsHtml += `<button class="btn btn-primary" onclick="doPlayBasicToBench('${card.instanceId}')">🐾 放置到備戰區（目前 ${player.bench.length}/5）</button>`;
      }
    }

    // 2. Evolve Pokemon (Active or Bench)
    if (card.supertype === 'pokemon' && (card.subtypes.includes('Stage 1') || card.subtypes.includes('Stage 2'))) {
      if (currentGameState.turnNumber > 2) {
        if (player.active && player.active.name === card.evolvesFrom && player.active.turnPlayed < currentGameState.turnNumber) {
          actionsHtml += `<button class="btn btn-accent" onclick="doEvolvePokemon('${card.instanceId}', 'active')">✨ 進化戰鬥場的「${player.active.name}」</button>`;
        }
        player.bench.forEach((b, bIdx) => {
          if (b.name === card.evolvesFrom && b.turnPlayed < currentGameState.turnNumber) {
            actionsHtml += `<button class="btn btn-accent" onclick="doEvolvePokemon('${card.instanceId}', ${bIdx})">✨ 進化備戰區的「${b.name}」</button>`;
          }
        });
      }
    }

    // 3. Attach Energy (Max 1 per turn)
    if (card.supertype === 'energy' && !player.turnFlags.energyAttached) {
      if (player.active) {
        actionsHtml += `<button class="btn btn-success" onclick="doAttachEnergy('${card.instanceId}', 'active')">⚡ 附加至戰鬥場「${player.active.name}」</button>`;
      }
      player.bench.forEach((b, bIdx) => {
        actionsHtml += `<button class="btn btn-success" onclick="doAttachEnergy('${card.instanceId}', ${bIdx})">⚡ 附加至備戰區「${b.name}」</button>`;
      });
    }

    // 4. Attach Tool
    if (card.supertype === 'trainer' && card.subtypes && card.subtypes.includes('Tool')) {
      if (player.active && !player.active.attachedTool) {
        actionsHtml += `<button class="btn btn-secondary" onclick="doAttachTool('${card.instanceId}', 'active')">🛡️ 貼在戰鬥場「${player.active.name}」</button>`;
      }
      player.bench.forEach((b, bIdx) => {
        if (!b.attachedTool) {
          actionsHtml += `<button class="btn btn-secondary" onclick="doAttachTool('${card.instanceId}', ${bIdx})">🛡️ 貼在備戰區「${b.name}」</button>`;
        }
      });
    }

    // 5. Play Item Card
    if (card.supertype === 'trainer' && card.subtypes && card.subtypes.includes('Item')) {
      actionsHtml += `<button class="btn btn-primary" onclick="doPlayItem('${card.instanceId}')">🎒 使用此物品卡</button>`;
    }

    // 6. Play Supporter Card (Max 1 per turn, not Turn 1)
    if (card.supertype === 'trainer' && card.subtypes && card.subtypes.includes('Supporter')) {
      if (!player.turnFlags.supporterPlayed && currentGameState.turnNumber > 1) {
        actionsHtml += `<button class="btn btn-primary" onclick="doPlaySupporter('${card.instanceId}')">👤 使用此支援者卡</button>`;
      } else if (currentGameState.turnNumber === 1) {
        actionsHtml += `<div class="form-hint" style="color: #f87171;">⚠️ 先攻第一回合不可使用支援者卡</div>`;
      }
    }
  } else if (location === 'self_active' && isMyTurn) {
    // Active actions: Attacks & Retreat
    if (currentGameState.turnNumber > 1) {
      actionsHtml += `<button class="btn btn-accent" onclick="openAttackChoiceModal()">⚔️ 選擇招式進行攻擊</button>`;
    }
    if (!player.turnFlags.retreated && player.bench.length > 0) {
      actionsHtml += `<button class="btn btn-secondary" onclick="openRetreatChoiceModal()">🏃 撤退至備戰區</button>`;
    }
  }

  // Card stats formatting
  let attacksListHtml = '';
  if (card.attacks && card.attacks.length > 0) {
    attacksListHtml = `
      <div style="background: #0f172a; padding: 10px; border-radius: 8px;">
        <strong style="color: #38bdf8; font-size: 0.9rem;">招式技能：</strong>
        ${card.attacks.map(at => `
          <div style="margin-top: 6px; border-top: 1px dashed #334155; padding-top: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <strong>${at.name} [${(at.cost || []).join('、')}]</strong>
              <span style="color: #ef4444; font-weight: bold;">${at.damage || 0} 點</span>
            </div>
            ${at.text ? `<div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">${at.text}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  let abilityHtml = '';
  if (card.ability) {
    abilityHtml = `
      <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); padding: 8px; border-radius: 8px; font-size: 0.8rem;">
        <strong style="color: #eab308;">【特性：${card.ability.name}】</strong>
        <p style="color: #cbd5e1; margin-top: 2px;">${card.ability.text}</p>
      </div>
    `;
  }

  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 10px;">
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffcb05;">${card.name}</h3>
      <span style="font-size: 0.85rem; color: #94a3b8;">${card.subtypes ? card.subtypes.join(' / ') : ''}</span>
    </div>

    ${card.hp ? `<div style="font-size: 0.95rem; font-weight: bold; color: #ef4444;">當前 HP: ${card.currentHp || card.hp} / ${card.maxHp || card.hp} (傷害: ${card.damage || 0})</div>` : ''}

    ${card.text ? `<div style="font-size: 0.85rem; color: #cbd5e1; background: #0f172a; padding: 8px; border-radius: 6px;">${card.text}</div>` : ''}

    ${abilityHtml}
    ${attacksListHtml}

    <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
      ${actionsHtml}
      <button class="btn btn-secondary" onclick="closeCardActionModal()">關閉</button>
    </div>
  `;

  modal.classList.add('active');
}

function closeCardActionModal() {
  const modal = document.getElementById('card-action-popup');
  if (modal) modal.classList.remove('active');
}

// Action Handlers
function doPlayBasicToBench(cardInstanceId) {
  closeCardActionModal();
  sfx.playCard();
  sendGameAction('bench', { cardInstanceId });
}

function doEvolvePokemon(cardInstanceId, targetSlot) {
  closeCardActionModal();
  sfx.playFanfare();
  sendGameAction('evolve', { cardInstanceId, targetSlot });
}

function doAttachEnergy(cardInstanceId, targetSlot) {
  closeCardActionModal();
  sfx.playCard();
  sendGameAction('attach_energy', { cardInstanceId, targetSlot });
}

function doAttachTool(cardInstanceId, targetSlot) {
  closeCardActionModal();
  sfx.playCard();
  sendGameAction('attach_tool', { cardInstanceId, targetSlot });
}

function doPlayItem(cardInstanceId) {
  closeCardActionModal();
  sfx.playCard();
  sendGameAction('play_item', { cardInstanceId });
}

function doPlaySupporter(cardInstanceId) {
  closeCardActionModal();
  sfx.playCard();
  sendGameAction('play_supporter', { cardInstanceId });
}

// Attacks Modal
function openAttackChoiceModal() {
  closeCardActionModal();
  const player = currentGameState.players[currentPlayerIndex];
  if (!player.active) return;

  const attacks = player.active.attacks || [];
  const listEl = document.getElementById('attack-choices-list');
  const modal = document.getElementById('attack-modal');
  if (!listEl || !modal) return;

  listEl.innerHTML = '';
  attacks.forEach((at, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-accent';
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.style.display = 'flex';
    btn.style.justifyContent = 'space-between';
    btn.innerHTML = `
      <span><strong>${at.name}</strong> [${(at.cost || []).join('、')}]</span>
      <span style="font-weight: 800; color: #dc2626;">${at.damage || 0} 點傷害</span>
    `;
    btn.onclick = () => {
      modal.classList.remove('active');
      sfx.playAttack();
      sendGameAction('attack', { attackIndex: idx });
    };
    listEl.appendChild(btn);
  });

  modal.classList.add('active');
}

// Retreat Modal
function openRetreatChoiceModal() {
  closeCardActionModal();
  const player = currentGameState.players[currentPlayerIndex];
  if (player.bench.length === 0) {
    alert('備戰區沒有寶可夢可以替換！');
    return;
  }

  const retreatCost = player.active.retreatCost || 0;
  const attachedCount = (player.active.attachedEnergy || []).length;
  if (attachedCount < retreatCost) {
    alert(`撤退需要 ${retreatCost} 個能量，目前只有 ${attachedCount} 個能量！`);
    return;
  }

  let promptMsg = `請選擇要換上戰鬥場的備戰寶可夢編號（0 到 ${player.bench.length - 1}）：\n`;
  player.bench.forEach((b, i) => {
    promptMsg += `[${i}] ${b.name} (HP: ${b.currentHp}/${b.maxHp})\n`;
  });

  const choice = prompt(promptMsg, '0');
  if (choice !== null) {
    const benchIndex = parseInt(choice, 10);
    if (!isNaN(benchIndex) && benchIndex >= 0 && benchIndex < player.bench.length) {
      sendGameAction('retreat', { benchIndex });
    }
  }
}

// Game Over Modal
function showGameOverModal(state) {
  const modal = document.getElementById('game-over-modal');
  const title = document.getElementById('game-over-title');
  const reason = document.getElementById('game-over-reason');
  const icon = document.getElementById('game-over-icon');
  if (!modal) return;

  const isWinner = state.winner === currentPlayerIndex;
  if (title) title.textContent = isWinner ? '🎉 對戰獲勝！' : '💀 對戰敗北';
  if (title) title.style.color = isWinner ? '#34d399' : '#f87171';
  if (icon) icon.textContent = isWinner ? '🏆' : '💀';
  if (reason) reason.textContent = state.winReason || (isWinner ? '您贏得了這場比賽！' : '很遺憾，對手獲得了勝利。');

  modal.classList.add('active');
  if (isWinner) sfx.playFanfare();
}

// Event Bindings
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) startBtn.addEventListener('click', startGame);

  const endTurnBtn = document.getElementById('btn-action-end-turn');
  if (endTurnBtn) endTurnBtn.addEventListener('click', () => {
    sfx.playCard();
    sendGameAction('end_turn');
  });

  const attackBtn = document.getElementById('btn-action-attack');
  if (attackBtn) attackBtn.addEventListener('click', openAttackChoiceModal);

  const retreatBtn = document.getElementById('btn-action-retreat');
  if (retreatBtn) retreatBtn.addEventListener('click', openRetreatChoiceModal);

  const toggleMatBgBtn = document.getElementById('toggle-mat-bg-btn');
  if (toggleMatBgBtn) {
    toggleMatBgBtn.addEventListener('click', () => {
      const mat = document.getElementById('ptcg-mat');
      if (mat) {
        mat.classList.toggle('photo-mode');
        const isPhoto = mat.classList.contains('photo-mode');
        toggleMatBgBtn.textContent = isPhoto ? '🎨 切換數位風格墊' : '🖼️ 切換實體照片墊';
      }
    });
  }
  const rulesBtn = document.getElementById('btn-action-rules');
  const rulesModal = document.getElementById('rules-modal');
  const closeRulesBtn = document.getElementById('close-rules-modal-btn');
  if (rulesBtn) rulesBtn.addEventListener('click', () => rulesModal.classList.add('active'));
  if (closeRulesBtn) closeRulesBtn.addEventListener('click', () => rulesModal.classList.remove('active'));

  const closeAttackBtn = document.getElementById('close-attack-modal-btn');
  if (closeAttackBtn) closeAttackBtn.addEventListener('click', () => {
    document.getElementById('attack-modal').classList.remove('active');
  });

  const surrenderBtn = document.getElementById('surrender-btn');
  if (surrenderBtn) surrenderBtn.addEventListener('click', () => {
    if (confirm('確定要離開並退出當前對戰嗎？')) {
      switchView('view-decks');
    }
  });

  const gameOverBackBtn = document.getElementById('game-over-back-btn');
  if (gameOverBackBtn) gameOverBackBtn.addEventListener('click', () => {
    document.getElementById('game-over-modal').classList.remove('active');
    switchView('view-decks');
  });

  // Mode Selection Cards & Online Room Handlers
let currentHostedRoomCode = null;
let roomWaitPollingTimer = null;

async function createOnlineRoom() {
  const token = localStorage.getItem('ptcg_token');
  const deckSlot = parseInt(document.getElementById('match-player-deck-select').value, 10) || 1;
  const btn = document.getElementById('btn-do-create-room');
  const infoBox = document.getElementById('room-created-info');
  const displayCode = document.getElementById('display-room-code');
  const qrImg = document.getElementById('room-qr-img');

  btn.disabled = true;
  btn.textContent = '建立房間中...';

  try {
    const res = await fetch('/api/rooms/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ deckSlot })
    });
    const data = await res.json();

    if (!data.success) {
      alert('建立房間失敗：' + data.message);
      btn.disabled = false;
      btn.textContent = '⚡ 建立對戰房間並產生代號與 QR 碼';
      return;
    }

    currentHostedRoomCode = data.roomCode;
    displayCode.textContent = data.roomCode;

    // Direct Join Link (works on same wifi / internet)
    const joinUrl = `${window.location.origin}${window.location.pathname}?room=${data.roomCode}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(joinUrl)}`;

    infoBox.style.display = 'block';
    btn.style.display = 'none';

    // Connect WebSocket to wait
    initRoomWait(data.roomCode);
  } catch (err) {
    console.error('createOnlineRoom error:', err);
    alert('建立房間發生錯誤');
    btn.disabled = false;
    btn.textContent = '⚡ 建立對戰房間並產生代號與 QR 碼';
  }
}

function initRoomWait(roomCode) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'wait_room', roomCode }));
  }

  // Also poll /api/rooms/status/:code as fallback
  if (roomWaitPollingTimer) clearInterval(roomWaitPollingTimer);
  roomWaitPollingTimer = setInterval(async () => {
    try {
      const res = await fetch(`/api/rooms/status/${roomCode}`);
      const data = await res.json();
      if (data.success && data.status === 'playing' && data.gameId) {
        clearInterval(roomWaitPollingTimer);
        roomWaitPollingTimer = null;
        onRoomGameStart(data.gameId, 0); // Host is Player 1
      }
    } catch (e) {}
  }, 1500);
}

async function joinOnlineRoom(codeToJoin = null) {
  const token = localStorage.getItem('ptcg_token');
  const roomCode = String(codeToJoin || document.getElementById('input-join-room-code').value || '').trim();
  const deckSlot = parseInt(document.getElementById('match-player-deck-select').value, 10) || 1;

  if (!roomCode) {
    alert('請輸入 4 位數房間代號！');
    return;
  }

  try {
    const res = await fetch('/api/rooms/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ roomCode, deckSlot })
    });
    const data = await res.json();

    if (!data.success) {
      alert('無法加入房間：\n' + data.message);
      return;
    }

    onRoomGameStart(data.gameId, 1, data.state); // Client is Player 2
  } catch (err) {
    console.error('joinOnlineRoom error:', err);
    alert('加入房間發生錯誤，請稍後再試！');
  }
}

async function loadOpenRoomsList() {
  const listEl = document.getElementById('open-rooms-list');
  if (!listEl) return;

  try {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    if (!data.success) return;

    listEl.innerHTML = '';
    if (!data.rooms || data.rooms.length === 0) {
      listEl.innerHTML = '<span style="font-size: 0.8rem; color: #64748b;">目前尚無等待中的房間，請在上方輸入代號或建立新房間。</span>';
      return;
    }

    data.rooms.forEach(r => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.padding = '8px 12px';
      item.style.background = '#1e293b';
      item.style.borderRadius = '6px';
      item.style.border = '1px solid #334155';

      item.innerHTML = `
        <div>
          <strong style="color: #ffcb05;">房間 #${r.roomCode}</strong>
          <span style="font-size: 0.8rem; color: #94a3b8; margin-left: 8px;">房主：${r.hostName}</span>
        </div>
        <button class="btn btn-success btn-sm" onclick="joinOnlineRoom('${r.roomCode}')">加入對戰</button>
      `;
      listEl.appendChild(item);
    });
  } catch (e) {}
}

function onRoomGameStart(gameId, playerIndex, initialState = null) {
  if (roomWaitPollingTimer) {
    clearInterval(roomWaitPollingTimer);
    roomWaitPollingTimer = null;
  }

  currentGameId = gameId;
  currentPlayerIndex = playerIndex;
  currentGameState = initialState;

  switchView('view-battle');
  initGameWebSocket(currentGameId);

  if (initialState) {
    renderGameState(initialState);
  } else {
    // Fetch initial state
    fetch(`/api/games/${gameId}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          currentGameState = d.state;
          renderGameState(d.state);
        }
      });
  }

  sfx.playFanfare();
}

  // Hook up mode selector and online room buttons
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const mode = card.getAttribute('data-mode');
      const onlineSec = document.getElementById('online-room-section');
      const pveGroup = document.getElementById('pve-opp-deck-group');

      if (mode === 'online') {
        if (onlineSec) onlineSec.style.display = 'block';
        if (pveGroup) pveGroup.style.display = 'none';
        loadOpenRoomsList();
      } else {
        if (onlineSec) onlineSec.style.display = 'none';
        if (pveGroup) pveGroup.style.display = 'block';
      }
    });
  });

  const tabCreate = document.getElementById('btn-tab-create-room');
  const tabJoin = document.getElementById('btn-tab-join-room');
  const boxCreate = document.getElementById('box-create-room');
  const boxJoin = document.getElementById('box-join-room');

  if (tabCreate && tabJoin) {
    tabCreate.addEventListener('click', () => {
      tabCreate.className = 'btn btn-primary btn-sm';
      tabJoin.className = 'btn btn-secondary btn-sm';
      boxCreate.style.display = 'block';
      boxJoin.style.display = 'none';
    });
    tabJoin.addEventListener('click', () => {
      tabJoin.className = 'btn btn-primary btn-sm';
      tabCreate.className = 'btn btn-secondary btn-sm';
      boxCreate.style.display = 'none';
      boxJoin.style.display = 'block';
      loadOpenRoomsList();
    });
  }

  const btnDoCreate = document.getElementById('btn-do-create-room');
  if (btnDoCreate) btnDoCreate.addEventListener('click', createOnlineRoom);

  const btnDoJoin = document.getElementById('btn-do-join-room');
  if (btnDoJoin) btnDoJoin.addEventListener('click', () => joinOnlineRoom());

  // Check URL params e.g. ?room=5832
  const urlParams = new URLSearchParams(window.location.search);
  const paramRoom = urlParams.get('room');
  if (paramRoom) {
    const onlineCard = document.querySelector('.mode-card[data-mode="online"]');
    if (onlineCard) onlineCard.click();
    if (tabJoin) tabJoin.click();
    const inputCode = document.getElementById('input-join-room-code');
    if (inputCode) inputCode.value = paramRoom;
  }
});
