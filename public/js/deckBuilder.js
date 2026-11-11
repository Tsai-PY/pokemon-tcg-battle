// public/js/deckBuilder.js
// 10-Slot Shared Decks Management & PTCG 60-Card Validator

let currentSharedDecks = [];

async function loadSharedDecks() {
  const container = document.getElementById('decks-grid-container');
  const matchP1Select = document.getElementById('match-player-deck-select');
  const matchP2Select = document.getElementById('match-opp-deck-select');
  if (!container) return;

  try {
    const res = await fetch('/api/decks');
    const data = await res.json();
    if (!data.success) return;

    currentSharedDecks = data.decks || [];
    container.innerHTML = '';

    if (matchP1Select) matchP1Select.innerHTML = '';
    if (matchP2Select) matchP2Select.innerHTML = '';

    for (let slot = 1; slot <= 10; slot++) {
      const deck = currentSharedDecks.find(d => d.slot === slot);
      const cardEl = document.createElement('div');
      cardEl.className = 'deck-slot-card';

      if (deck) {
        // Tally categories
        const pokemonCount = (deck.cardEntries || []).reduce((acc, c) => acc + (c.count || 1), 0);
        
        cardEl.innerHTML = `
          <div class="deck-slot-badge">槽位 ${slot} / 10</div>
          <h3 class="deck-title">${deck.name}</h3>
          <div class="deck-meta">作者：${deck.author} | 更新時間：${new Date(deck.updatedAt).toLocaleDateString()}</div>
          <p class="deck-description">${deck.description || '標準 60 張 PTCG 對戰牌組'}</p>
          <div class="deck-stats">
            <div class="deck-stat-item">🎴 <strong>${deck.totalCards || 60}</strong> 張卡牌</div>
            <div class="deck-stat-item">👑 <strong>1</strong> 張 ACE SPEC</div>
            <div class="deck-stat-item" style="color: #34d399;">✓ 符合官方規範</div>
          </div>
          <div class="deck-actions">
            <button class="btn btn-secondary btn-sm" onclick="editDeckInSlot(${slot})">✏️ 替換/編輯</button>
            <button class="btn btn-primary btn-sm" onclick="quickBattleWithDeck(${slot})">⚔️ 使用此牌組對戰</button>
          </div>
        `;

        if (matchP1Select) {
          const opt = document.createElement('option');
          opt.value = slot;
          opt.textContent = `【槽位 ${slot}】${deck.name}`;
          matchP1Select.appendChild(opt);
        }
        if (matchP2Select) {
          const opt = document.createElement('option');
          opt.value = slot;
          opt.textContent = `【槽位 ${slot}】${deck.name}`;
          matchP2Select.appendChild(opt);
        }
      } else {
        cardEl.innerHTML = `
          <div class="deck-slot-badge">槽位 ${slot} / 10</div>
          <h3 class="deck-title" style="color: #94a3b8;">空槽位</h3>
          <p class="deck-description" style="color: #64748b;">尚未上傳牌組。任何會員皆可上傳牌組至此共同槽位！</p>
          <div class="deck-actions" style="margin-top: auto;">
            <button class="btn btn-accent btn-sm" onclick="editDeckInSlot(${slot})">📤 上傳新牌組</button>
          </div>
        `;
      }

      container.appendChild(cardEl);
    }

    if (matchP2Select && matchP2Select.options.length > 1) {
      matchP2Select.selectedIndex = 1; // Default opponent to deck 2
    }
  } catch (err) {
    console.error('loadSharedDecks error:', err);
  }
}

function editDeckInSlot(slot) {
  const modal = document.getElementById('deck-modal');
  const slotSelect = document.getElementById('upload-slot-select');
  const nameInput = document.getElementById('upload-deck-name');
  const descInput = document.getElementById('upload-deck-desc');
  const textInput = document.getElementById('upload-deck-text');

  slotSelect.value = slot;
  const existing = currentSharedDecks.find(d => d.slot === slot);

  if (existing) {
    nameInput.value = existing.name;
    descInput.value = existing.description || '';
    // Format card entries to text
    textInput.value = existing.cardEntries.map(e => `${e.count} ${e.name}`).join('\n');
  } else {
    nameInput.value = `訓練家自訂牌組 ${slot}`;
    descInput.value = '';
    textInput.value = '';
  }

  modal.classList.add('active');
  parseAndValidateDeckText();
}

function quickBattleWithDeck(slot) {
  const p1Select = document.getElementById('match-player-deck-select');
  if (p1Select) p1Select.value = slot;
  switchView('view-match');
}

async function parseAndValidateDeckText() {
  const text = document.getElementById('upload-deck-text').value;
  const validationBox = document.getElementById('deck-validation-box');
  const badge = document.getElementById('deck-validation-badge');
  const list = document.getElementById('deck-validation-list');
  const confirmBtn = document.getElementById('confirm-upload-btn');

  if (!text.trim()) {
    validationBox.style.display = 'none';
    return;
  }

  validationBox.style.display = 'block';

  try {
    const res = await fetch('/api/decks/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    const v = data.validation;

    list.innerHTML = '';

    // Rule 1: 剛好 60 張卡牌
    const r1Pass = v.totalCards === 60;
    const r1Li = document.createElement('li');
    r1Li.className = r1Pass ? 'pass' : 'fail';
    r1Li.innerHTML = `${r1Pass ? '✅' : '❌'} <strong>牌數限制</strong>：一副正式牌組必須剛好 60 張（目前：<strong>${v.totalCards} / 60</strong> 張）`;
    list.appendChild(r1Li);

    // Rule 2: 同名卡限制 (除基本能量最多4張)
    const sameNameErrors = v.errors.filter(e => e.includes('同名卡限制'));
    const r2Pass = sameNameErrors.length === 0;
    const r2Li = document.createElement('li');
    r2Li.className = r2Pass ? 'pass' : 'fail';
    r2Li.innerHTML = `${r2Pass ? '✅' : '❌'} <strong>同名卡限制</strong>：除基本能量外，同名卡最多 4 張 ${r2Pass ? '(通過)' : '（' + sameNameErrors.join('；') + '）'}`;
    list.appendChild(r2Li);

    // Rule 3: 特殊卡牌限制 (ACE SPEC 最多 1 張)
    const r3Pass = v.aceSpecCount <= 1;
    const r3Li = document.createElement('li');
    r3Li.className = r3Pass ? 'pass' : 'fail';
    r3Li.innerHTML = `${r3Pass ? '✅' : '❌'} <strong>特殊卡牌限制</strong>：ACE SPEC（王牌卡）全牌庫最多 1 張（目前：${v.aceSpecCount} 張）`;
    list.appendChild(r3Li);

    // Rule 4: 基礎寶可夢限制
    const r4Pass = v.basicPokemonCount > 0;
    const r4Li = document.createElement('li');
    r4Li.className = r4Pass ? 'pass' : 'fail';
    r4Li.innerHTML = `${r4Pass ? '✅' : '❌'} <strong>基礎寶可夢</strong>：牌庫必須包含基礎寶可夢（目前：${v.basicPokemonCount} 隻）`;
    list.appendChild(r4Li);

    if (v.valid) {
      badge.className = 'status-badge status-approved';
      badge.textContent = '符合 PTCG 規範';
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
    } else {
      badge.className = 'status-badge status-rejected';
      badge.textContent = '未達 60 張規範';
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
    }
  } catch (err) {
    console.error('parseAndValidateDeckText error:', err);
  }
}

async function submitDeckUpload() {
  const token = localStorage.getItem('ptcg_token');
  const slot = parseInt(document.getElementById('upload-slot-select').value, 10);
  const name = document.getElementById('upload-deck-name').value.trim();
  const desc = document.getElementById('upload-deck-desc').value.trim();
  const rawText = document.getElementById('upload-deck-text').value.trim();

  if (!name) {
    alert('請輸入牌組名稱！');
    return;
  }
  if (!rawText) {
    alert('請輸入卡牌清單！');
    return;
  }

  try {
    const res = await fetch('/api/decks/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ slot, name, description: desc, rawText })
    });
    const data = await res.json();

    if (!data.success) {
      alert('上傳失敗：\n' + data.message);
      return;
    }

    alert(`🎉 恭喜！牌組「${name}」已成功儲存至共同牌庫第 ${slot} 組！\n對戰雙方皆可立即選用進行對戰！`);
    document.getElementById('deck-modal').classList.remove('active');
    loadSharedDecks();
  } catch (err) {
    console.error('submitDeckUpload error:', err);
    alert('上傳發生錯誤，請稍後再試！');
  }
}

// Preset templates for user convenience
const CHARIZARD_TEMPLATE = `4 小火龍
1 火恐龍
3 噴火龍ex
2 波波
1 比比鳥
2 大比鳥ex
1 光輝甲賀忍蛙
4 博士的研究
3 老大的指令
3 奇樹
4 派帕
4 巢穴球
4 高級球
4 神奇糖果
2 寶可夢交替
2 大地之器
1 超級能量回收棒
2 勇氣護符
1 至尊捕捉器
8 基本火能量
4 基本惡能量`;

const PIKACHU_TEMPLATE = `3 皮卡丘ex
4 皮卡丘
3 雷丘
2 密勒頓ex
4 博士的研究
3 老大的指令
3 奇樹
3 派帕
4 巢穴球
4 高級球
3 寶可夢交替
3 傷藥
2 大地之器
2 勇氣護符
1 至尊捕捉器
12 基本電能量
2 基本草能量
2 基本鋼能量`;

document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn = document.getElementById('open-upload-modal-btn');
  const closeModalBtn = document.getElementById('close-deck-modal-btn');
  const cancelBtn = document.getElementById('cancel-upload-btn');
  const confirmBtn = document.getElementById('confirm-upload-btn');
  const parseBtn = document.getElementById('btn-parse-deck');
  const textInput = document.getElementById('upload-deck-text');

  if (openModalBtn) openModalBtn.addEventListener('click', () => editDeckInSlot(1));
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => document.getElementById('deck-modal').classList.remove('active'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => document.getElementById('deck-modal').classList.remove('active'));
  if (confirmBtn) confirmBtn.addEventListener('click', submitDeckUpload);
  if (parseBtn) parseBtn.addEventListener('click', parseAndValidateDeckText);
  if (textInput) textInput.addEventListener('input', () => {
    clearTimeout(window._deckParseTimeout);
    window._deckParseTimeout = setTimeout(parseAndValidateDeckText, 600);
  });

  const btnChar = document.getElementById('btn-template-charizard');
  const btnPika = document.getElementById('btn-template-pikachu');
  if (btnChar) btnChar.addEventListener('click', () => {
    document.getElementById('upload-deck-name').value = '惡太晶噴火龍ex 狂暴燃燒牌組';
    document.getElementById('upload-deck-desc').value = '以小火龍進化噴火龍ex為主力，配合大比鳥ex檢索與至尊捕捉器。';
    document.getElementById('upload-deck-text').value = CHARIZARD_TEMPLATE;
    parseAndValidateDeckText();
  });
  if (btnPika) btnPika.addEventListener('click', () => {
    document.getElementById('upload-deck-name').value = '皮卡丘ex 頑強電光經典牌組';
    document.getElementById('upload-deck-desc').value = '以皮卡丘ex特性頑強韌性為核心，黃玉伏特單發爆發300傷害。';
    document.getElementById('upload-deck-text').value = PIKACHU_TEMPLATE;
    parseAndValidateDeckText();
  });
});
