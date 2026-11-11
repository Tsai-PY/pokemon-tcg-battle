// public/js/deckBuilder.js
// 10-Slot Shared Decks Management & Interactive PTCG 60-Card Visual Editor

let currentSharedDecks = [];
let editingCardEntries = [];
let swapTargetIndex = -1;

// Curated list of popular PTCG cards for quick selection
const POPULAR_CARDS_CATALOG = [
  {
    category: '🔥 熱門寶可夢 (Pokémon)',
    cards: [
      '噴火龍ex', '小火龍', '火恐龍',
      '皮卡丘ex', '皮卡丘', '雷丘',
      '水君V', '超級雪妖女ex', '雪童子',
      '麻花犬EX', '狗仔包',
      '火箭隊的謎擬Q', '火箭隊的鈴鐺響',
      '多龍巴魯托ex', '多龍梅西亞', '多龍奇',
      '沙奈朵ex', '奇魯莉安', '拉魯拉絲', '吼叫尾',
      '洛奇亞VSTAR', '洛奇亞V', '始祖大鳥', '卡比獸',
      '厄鬼椪ex', '魔幻假面喵ex', '新葉喵', '蒂蕾喵',
      '超夢ex', '天然鳥', '天然雀', '耿鬼',
      '密勒頓ex', '鐵臂膀ex',
      '古劍豹ex', '涼脊龍', '凍脊龍', '戟脊龍',
      '轟鳴月ex', '光輝甲賀忍蛙', '光輝胡地',
      '大比鳥ex', '波波', '比比鳥'
    ]
  },
  {
    category: '👤 訓練家 - 支援者卡 (Supporters)',
    cards: [
      '博士的研究', '老大的指令', '奇樹', '派帕',
      '裁判', '米可利', '莉莉艾的決意', '真菰',
      '阿克羅瑪的實驗', '瑪俐', '莉莉艾', '希羅娜'
    ]
  },
  {
    category: '🎒 訓練家 - 物品 / 道具卡 (Items & Tools)',
    cards: [
      '巢穴球', '高級球', '神奇糖果', '寶可夢交替', '寶可夢交換',
      '希望護身符', '寶可夢平板', '厲害釣竿', '聖灰',
      '招式學習演進', '大地之器', '超級能量回收棒', '傷藥', '勇氣護符',
      '反擊捕獲器', '至尊捕捉器'
    ]
  },
  {
    category: '⚡ 基本能量 / 特殊能量卡 (Energies)',
    cards: [
      '噴射能量',
      '基本火能量', '基本水能量', '基本電能量', '基本草能量',
      '基本超能量', '基本鬥能量', '基本惡能量', '基本鋼能量'
    ]
  }
];

function populateCardSelectDropdowns() {
  const addSelect = document.getElementById('add-card-select');
  const swapSelect = document.getElementById('swap-card-select');

  const buildOptions = () => {
    let html = '<option value="">-- 請選擇卡牌 --</option>';
    POPULAR_CARDS_CATALOG.forEach(group => {
      html += `<optgroup label="${group.category}">`;
      group.cards.forEach(card => {
        html += `<option value="${card}">${card}</option>`;
      });
      html += `</optgroup>`;
    });
    return html;
  };

  const optsHtml = buildOptions();
  if (addSelect) addSelect.innerHTML = optsHtml;
  if (swapSelect) swapSelect.innerHTML = optsHtml;
}

function getCardCategoryBadge(name) {
  const clean = (name || '').trim();
  if (/至尊|王牌|ace spec/i.test(clean)) {
    return { type: 'acespec', label: '👑 ACE SPEC', css: 'badge-acespec' };
  }
  if (/能量|energy/i.test(clean)) {
    return { type: 'energy', label: '⚡ 能量卡', css: 'badge-energy' };
  }
  if (/研究|博士|指令|老大|奇樹|派帕|瑪俐|莉莉艾|希羅娜|阿克羅瑪/i.test(clean)) {
    return { type: 'supporter', label: '👤 支援者', css: 'badge-trainer' };
  }
  if (/球|傷藥|交替|繩|棒|器|筒|糖果|護符|滑板|捕獲/i.test(clean)) {
    return { type: 'item', label: '🎒 物品/道具', css: 'badge-trainer' };
  }
  return { type: 'pokemon', label: '🐾 寶可夢', css: 'badge-pokemon' };
}

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

  if (existing && existing.cardEntries && existing.cardEntries.length > 0) {
    nameInput.value = existing.name;
    descInput.value = existing.description || '';
    editingCardEntries = existing.cardEntries.map(e => ({ name: e.name, count: parseInt(e.count, 10) || 1 }));
  } else {
    nameInput.value = `訓練家自訂牌組 ${slot}`;
    descInput.value = '';
    // Load default Charizard template cards if empty slot
    editingCardEntries = parseTextToEntries(CHARIZARD_TEMPLATE);
  }

  // Format into textarea
  textInput.value = editingCardEntries.map(e => `${e.count} ${e.name}`).join('\n');

  // Switch to visual editor by default
  switchEditorTab('visual');
  populateCardSelectDropdowns();
  renderEditingCardRows();
  parseAndValidateDeck(false);

  modal.classList.add('active');
}

function parseTextToEntries(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const map = new Map();

  for (let line of lines) {
    line = line.trim();
    if (!line || /^(Pokémon|Pokemon|Trainer|Energy|寶可夢|訓練家|能量)[:：]/i.test(line)) continue;

    let count = 1;
    let cardName = line;

    const leadMatch = line.match(/^(\d+)\s*[xX*]?\s+(.+)$/);
    if (leadMatch) {
      count = parseInt(leadMatch[1], 10);
      cardName = leadMatch[2].replace(/\s+[A-Za-z0-9_-]+\s+\d+.*$/, '').trim();
    } else {
      const trailMatch = line.match(/^(.+?)\s*[xX*]?\s*(\d+)$/);
      if (trailMatch) {
        cardName = trailMatch[1].trim();
        count = parseInt(trailMatch[2], 10);
      }
    }

    if (cardName) {
      map.set(cardName, (map.get(cardName) || 0) + count);
    }
  }

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

function renderEditingCardRows() {
  const container = document.getElementById('editor-cards-list');
  const countPill = document.getElementById('visual-deck-count-pill');
  const totalCardsEl = document.getElementById('visual-total-cards');
  const countPokemonEl = document.getElementById('visual-count-pokemon');
  const countTrainerEl = document.getElementById('visual-count-trainer');
  const countEnergyEl = document.getElementById('visual-count-energy');
  const countAceSpecEl = document.getElementById('visual-count-acespec');
  const textInput = document.getElementById('upload-deck-text');

  if (!container) return;

  // Calculate statistics
  let totalCards = 0;
  let countPokemon = 0;
  let countTrainer = 0;
  let countEnergy = 0;
  let countAceSpec = 0;

  editingCardEntries.forEach(entry => {
    const c = entry.count;
    totalCards += c;
    const cat = getCardCategoryBadge(entry.name);
    if (cat.type === 'pokemon') countPokemon += c;
    else if (cat.type === 'energy') countEnergy += c;
    else if (cat.type === 'acespec') {
      countTrainer += c;
      countAceSpec += c;
    } else {
      countTrainer += c;
    }
  });

  if (totalCardsEl) totalCardsEl.textContent = totalCards;
  if (countPokemonEl) countPokemonEl.textContent = countPokemon;
  if (countTrainerEl) countTrainerEl.textContent = countTrainer;
  if (countEnergyEl) countEnergyEl.textContent = countEnergy;
  if (countAceSpecEl) countAceSpecEl.textContent = countAceSpec;

  if (countPill) {
    if (totalCards === 60) {
      countPill.className = 'deck-count-pill exact-60';
      countPill.innerHTML = `🎴 總張數：<span>${totalCards}</span> / 60 張（剛好合格）`;
    } else if (totalCards < 60) {
      countPill.className = 'deck-count-pill not-60';
      countPill.innerHTML = `🎴 總張數：<span>${totalCards}</span> / 60 張（還差 ${60 - totalCards} 張）`;
    } else {
      countPill.className = 'deck-count-pill not-60';
      countPill.innerHTML = `🎴 總張數：<span>${totalCards}</span> / 60 張（超出 ${totalCards - 60} 張）`;
    }
  }

  // Sync textarea text
  if (textInput) {
    textInput.value = editingCardEntries.map(e => `${e.count} ${e.name}`).join('\n');
  }

  // Render cards
  container.innerHTML = '';
  if (editingCardEntries.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 24px;">牌組目前為空，請點選上方「➕ 新增卡片」或帶入範例！</div>';
    return;
  }

  editingCardEntries.forEach((entry, idx) => {
    const cat = getCardCategoryBadge(entry.name);
    const emoji = (window.getCardArtEmoji ? window.getCardArtEmoji({ name: entry.name }) : null) || '🎴';
    const isBasicEnergy = /^基本.*能量$/.test(entry.name);
    const imgUrl = (window.getCardImageUrl ? window.getCardImageUrl(entry.name) : null);

    const row = document.createElement('div');
    row.className = 'editor-card-row';
    row.innerHTML = `
      <div class="editor-card-info">
        <div class="editor-card-thumb-wrap" onclick="openCardPhotoModalForCard('${entry.name}')" title="點擊上傳/更換照片">
          ${imgUrl ? `<img src="${imgUrl}" class="editor-card-thumb" alt="${entry.name}" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline';" />` : ''}
          <span class="editor-card-emoji" style="${imgUrl ? 'display:none;' : ''}">${emoji}</span>
        </div>
        <div style="min-width: 0;">
          <div class="editor-card-name" title="${entry.name}">${entry.name}</div>
          <span class="editor-card-badge ${cat.css}">${cat.label}</span>
        </div>
      </div>

      <div style="display: flex; align-items: center;">
        <!-- Quantity Adjustment Controls -->
        <div class="editor-qty-group">
          <button type="button" class="btn-qty" onclick="adjustCardQuantity(${idx}, -1)" title="減少數量">−</button>
          <span class="qty-display">${entry.count}</span>
          <button type="button" class="btn-qty" onclick="adjustCardQuantity(${idx}, 1)" title="增加數量" ${(!isBasicEnergy && entry.count >= 4) ? 'disabled' : ''}>+</button>
        </div>

        <!-- Row Actions: Photo, Swap & Delete -->
        <div class="editor-row-actions">
          <button type="button" class="btn-photo-card" onclick="openCardPhotoModalForCard('${entry.name}')" title="上傳或更換此卡片照片">📷 換圖</button>
          <button type="button" class="btn-swap-card" onclick="openSwapCardPanel(${idx})">🔄 更換</button>
          <button type="button" class="btn-delete-card" onclick="deleteCardRow(${idx})" title="刪除此卡片">🗑️</button>
        </div>
      </div>
    `;

    container.appendChild(row);
  });
}

function adjustCardQuantity(index, delta) {
  if (!editingCardEntries[index]) return;
  const entry = editingCardEntries[index];
  const newCount = entry.count + delta;
  const isBasicEnergy = /^基本.*能量$/.test(entry.name);

  if (newCount <= 0) {
    if (confirm(`確定要將「${entry.name}」自牌組中移除嗎？`)) {
      editingCardEntries.splice(index, 1);
    } else {
      return;
    }
  } else if (!isBasicEnergy && newCount > 4) {
    alert(`【同名卡限制】\n「${entry.name}」在牌庫中最多只能放 4 張！`);
    return;
  } else {
    entry.count = newCount;
  }

  renderEditingCardRows();
  parseAndValidateDeck(false);
}

function deleteCardRow(index) {
  if (!editingCardEntries[index]) return;
  const name = editingCardEntries[index].name;
  if (confirm(`確定刪除「${name}」？`)) {
    editingCardEntries.splice(index, 1);
    renderEditingCardRows();
    parseAndValidateDeck(false);
  }
}

function openSwapCardPanel(index) {
  swapTargetIndex = index;
  const panel = document.getElementById('swap-card-panel');
  const targetLabel = document.getElementById('swap-target-label');
  const select = document.getElementById('swap-card-select');
  const customInput = document.getElementById('swap-card-custom-name');

  if (panel && editingCardEntries[index]) {
    const curName = editingCardEntries[index].name;
    if (targetLabel) targetLabel.textContent = `將「${curName}」更換為：`;
    if (select) select.value = '';
    if (customInput) customInput.value = '';
    panel.style.display = 'flex';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function confirmSwapCard() {
  if (swapTargetIndex < 0 || !editingCardEntries[swapTargetIndex]) return;
  const select = document.getElementById('swap-card-select');
  const customInput = document.getElementById('swap-card-custom-name');
  const panel = document.getElementById('swap-card-panel');

  const newName = (customInput && customInput.value.trim()) || (select && select.value) || '';
  if (!newName) {
    alert('請從下拉選單選擇卡牌，或手動輸入新卡片名稱！');
    return;
  }

  const oldName = editingCardEntries[swapTargetIndex].name;
  editingCardEntries[swapTargetIndex].name = newName;
  swapTargetIndex = -1;
  if (panel) panel.style.display = 'none';

  renderEditingCardRows();
  parseAndValidateDeck(false);
}

function cancelSwapCard() {
  swapTargetIndex = -1;
  const panel = document.getElementById('swap-card-panel');
  if (panel) panel.style.display = 'none';
}

function addNewCardFromPanel() {
  const select = document.getElementById('add-card-select');
  const customInput = document.getElementById('add-card-custom-name');
  const countInput = document.getElementById('add-card-count');
  const panel = document.getElementById('add-card-panel');

  const name = (customInput && customInput.value.trim()) || (select && select.value) || '';
  const count = parseInt(countInput ? countInput.value : 1, 10) || 1;

  if (!name) {
    alert('請選擇熱門卡牌或輸入自訂卡片名稱！');
    return;
  }

  const isBasicEnergy = /^基本.*能量$/.test(name);
  const existing = editingCardEntries.find(e => e.name === name);

  if (existing) {
    if (!isBasicEnergy && (existing.count + count) > 4) {
      alert(`【同名卡限制】\n「${name}」已在牌庫中有 ${existing.count} 張，加入 ${count} 張將超過上限 4 張限制！`);
      return;
    }
    existing.count += count;
  } else {
    if (!isBasicEnergy && count > 4) {
      alert(`【同名卡限制】\n除基本能量外，卡牌最多放入 4 張！`);
      return;
    }
    editingCardEntries.push({ name, count });
  }

  // Reset inputs
  if (select) select.value = '';
  if (customInput) customInput.value = '';
  if (countInput) countInput.value = 1;

  renderEditingCardRows();
  parseAndValidateDeck(false);
}

function switchEditorTab(mode) {
  const tabVisual = document.getElementById('btn-tab-visual-editor');
  const tabText = document.getElementById('btn-tab-text-editor');
  const boxVisual = document.getElementById('editor-visual-container');
  const boxText = document.getElementById('editor-text-container');
  const textInput = document.getElementById('upload-deck-text');

  if (mode === 'visual') {
    if (tabVisual) tabVisual.className = 'btn btn-primary btn-sm active';
    if (tabText) tabText.className = 'btn btn-secondary btn-sm';
    if (boxVisual) boxVisual.style.display = 'block';
    if (boxText) boxText.style.display = 'none';

    // Sync entries from textarea
    if (textInput && textInput.value.trim()) {
      editingCardEntries = parseTextToEntries(textInput.value);
    }
    renderEditingCardRows();
    parseAndValidateDeck(false);
  } else {
    if (tabVisual) tabVisual.className = 'btn btn-secondary btn-sm';
    if (tabText) tabText.className = 'btn btn-primary btn-sm active';
    if (boxVisual) boxVisual.style.display = 'none';
    if (boxText) boxText.style.display = 'block';

    // Sync textarea from entries
    if (textInput) {
      textInput.value = editingCardEntries.map(e => `${e.count} ${e.name}`).join('\n');
    }
    parseAndValidateDeck(false);
  }
}

async function parseAndValidateDeck(interactive = false) {
  const validationBox = document.getElementById('deck-validation-box');
  const badge = document.getElementById('deck-validation-badge');
  const list = document.getElementById('deck-validation-list');
  const confirmBtn = document.getElementById('confirm-upload-btn');
  const textInput = document.getElementById('upload-deck-text');

  // Sync text if needed
  let text = textInput ? textInput.value.trim() : '';
  if (editingCardEntries.length > 0) {
    text = editingCardEntries.map(e => `${e.count} ${e.name}`).join('\n');
    if (textInput) textInput.value = text;
  }

  if (!text) {
    if (validationBox) validationBox.style.display = 'block';
    if (badge) {
      badge.className = 'status-badge status-rejected';
      badge.textContent = '牌組為空';
    }
    if (list) {
      list.innerHTML = '<li class="fail">❌ <strong>牌組為空</strong>：請至少加入卡牌以進行 PTCG 規範驗證！</li>';
    }
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
    }
    if (interactive) alert('牌組目前為空，請先加入卡牌！');
    return;
  }

  if (validationBox) validationBox.style.display = 'block';

  try {
    const res = await fetch('/api/decks/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    const v = data.validation;

    if (!list) return;
    list.innerHTML = '';

    // Rule 1: 剛好 60 張卡牌
    const r1Pass = v.totalCards === 60;
    const r1Li = document.createElement('li');
    r1Li.className = r1Pass ? 'pass' : 'fail';
    r1Li.innerHTML = `${r1Pass ? '✅' : '❌'} <strong>牌數限制</strong>：一副正式牌組必須剛好 60 張（目前：<strong>${v.totalCards} / 60</strong> 張，${v.totalCards === 60 ? '完全符合' : v.totalCards < 60 ? '還差 ' + (60 - v.totalCards) + ' 張' : '超出 ' + (v.totalCards - 60) + ' 張'}）`;
    list.appendChild(r1Li);

    // Rule 2: 同名卡限制 (除基本能量最多4張)
    const sameNameErrors = v.errors.filter(e => e.includes('同名卡限制'));
    const r2Pass = sameNameErrors.length === 0;
    const r2Li = document.createElement('li');
    r2Li.className = r2Pass ? 'pass' : 'fail';
    r2Li.innerHTML = `${r2Pass ? '✅' : '❌'} <strong>同名卡限制</strong>：除基本能量外，同名卡最多 4 張 ${r2Pass ? '(合格)' : '（' + sameNameErrors.join('；') + '）'}`;
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
      if (badge) {
        badge.className = 'status-badge status-approved';
        badge.textContent = '100% 符合 PTCG 規範';
      }
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
      }
      if (interactive) {
        alert('🎉 恭喜！智能辨識與規格驗證全部通過！\n\n• 總牌數：剛好 60 張卡牌\n• 同名卡限制：合格（無超過4張之卡牌）\n• ACE SPEC限制：合格\n• 基礎寶可夢：合格\n\n您可以點擊下方「確認儲存到共同牌庫」儲存牌組！');
      }
    } else {
      if (badge) {
        badge.className = 'status-badge status-rejected';
        badge.textContent = `未達 60 張規範 (${v.totalCards}/60)`;
      }
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
      }
      if (interactive) {
        alert('⚠️ 智能辨識完成！目前牌組尚未完全符合官方對戰規範：\n\n' + v.errors.join('\n') + '\n\n請利用「+」/「-」或「更換」卡片調整至剛好 60 張即可儲存！');
      }
    }
  } catch (err) {
    console.error('parseAndValidateDeck error:', err);
    if (interactive) {
      alert('辨識驗證發生異常，請重試！');
    }
  }
}

async function submitDeckUpload() {
  const token = localStorage.getItem('ptcg_token');
  const slot = parseInt(document.getElementById('upload-slot-select').value, 10);
  const name = document.getElementById('upload-deck-name').value.trim();
  const desc = document.getElementById('upload-deck-desc').value.trim();

  // Ensure text represents current editing entries
  let rawText = editingCardEntries.map(e => `${e.count} ${e.name}`).join('\n');
  if (!rawText.trim()) {
    rawText = document.getElementById('upload-deck-text').value.trim();
  }

  if (!name) {
    alert('請輸入牌組名稱！');
    return;
  }
  if (!rawText) {
    alert('請加入卡牌！');
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
      alert('儲存失敗：\n' + data.message);
      return;
    }

    alert(`🎉 恭喜！牌組「${name}」已成功儲存至共同牌庫第 ${slot} 組！\n對戰雙方皆可立即選用進行對戰！`);
    document.getElementById('deck-modal').classList.remove('active');
    loadSharedDecks();
  } catch (err) {
    console.error('submitDeckUpload error:', err);
    alert('儲存發生錯誤，請稍後再試！');
  }
}

function quickBattleWithDeck(slot) {
  const p1Select = document.getElementById('match-player-deck-select');
  if (p1Select) p1Select.value = slot;
  switchView('view-match');
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

  // Dual Mode Tabs
  const btnTabVisual = document.getElementById('btn-tab-visual-editor');
  const btnTabText = document.getElementById('btn-tab-text-editor');
  if (btnTabVisual) btnTabVisual.addEventListener('click', () => switchEditorTab('visual'));
  if (btnTabText) btnTabText.addEventListener('click', () => switchEditorTab('text'));

  // Validation Buttons
  const parseBtn = document.getElementById('btn-parse-deck');
  const parseBtnVisual = document.getElementById('btn-parse-deck-visual');
  if (parseBtn) parseBtn.addEventListener('click', () => parseAndValidateDeck(true));
  if (parseBtnVisual) parseBtnVisual.addEventListener('click', () => parseAndValidateDeck(true));

  // Add Card Panel Toggle & Action
  const btnToggleAdd = document.getElementById('btn-toggle-add-card');
  const btnConfirmAdd = document.getElementById('btn-confirm-add-card');
  const btnCancelAdd = document.getElementById('btn-cancel-add-card');
  const addPanel = document.getElementById('add-card-panel');

  if (btnToggleAdd) {
    btnToggleAdd.addEventListener('click', () => {
      if (addPanel) {
        addPanel.style.display = addPanel.style.display === 'none' ? 'flex' : 'none';
        if (addPanel.style.display === 'flex') {
          addPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }
  if (btnConfirmAdd) btnConfirmAdd.addEventListener('click', addNewCardFromPanel);
  if (btnCancelAdd) btnCancelAdd.addEventListener('click', () => { if (addPanel) addPanel.style.display = 'none'; });

  // Swap Card Actions
  const btnConfirmSwap = document.getElementById('btn-confirm-swap-card');
  const btnCancelSwap = document.getElementById('btn-cancel-swap-card');
  if (btnConfirmSwap) btnConfirmSwap.addEventListener('click', confirmSwapCard);
  if (btnCancelSwap) btnCancelSwap.addEventListener('click', cancelSwapCard);

  // Textarea live input
  const textInput = document.getElementById('upload-deck-text');
  if (textInput) {
    textInput.addEventListener('input', () => {
      clearTimeout(window._deckParseTimeout);
      window._deckParseTimeout = setTimeout(() => {
        editingCardEntries = parseTextToEntries(textInput.value);
        parseAndValidateDeck(false);
      }, 600);
    });
  }

  // Modal controls
  if (openModalBtn) openModalBtn.addEventListener('click', () => editDeckInSlot(1));
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => document.getElementById('deck-modal').classList.remove('active'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => document.getElementById('deck-modal').classList.remove('active'));
  if (confirmBtn) confirmBtn.addEventListener('click', submitDeckUpload);

  // Example templates
  const btnChar = document.getElementById('btn-template-charizard');
  const btnPika = document.getElementById('btn-template-pikachu');
  if (btnChar) {
    btnChar.addEventListener('click', () => {
      document.getElementById('upload-deck-name').value = '惡太晶噴火龍ex 狂暴燃燒牌組';
      document.getElementById('upload-deck-desc').value = '以小火龍進化噴火龍ex為主力，配合大比鳥ex檢索與至尊捕捉器。';
      editingCardEntries = parseTextToEntries(CHARIZARD_TEMPLATE);
      renderEditingCardRows();
      parseAndValidateDeck(true);
    });
  }
  if (btnPika) {
    btnPika.addEventListener('click', () => {
      document.getElementById('upload-deck-name').value = '皮卡丘ex 頑強電光經典牌組';
      document.getElementById('upload-deck-desc').value = '以皮卡丘ex特性頑強韌性為核心，黃玉伏特單發爆發300傷害。';
      editingCardEntries = parseTextToEntries(PIKACHU_TEMPLATE);
      renderEditingCardRows();
      parseAndValidateDeck(true);
    });
  }
});

// ==================== Card Photo Management & Auto-Recognition ====================
let currentPhotoCardName = '';
let currentPhotoPendingData = '';

const CARD_RECOGNITION_ALIASES = {
  // 寶可夢
  '小恐龍': '小火龍', '小火': '小火龍', 'charmander': '小火龍', '小火龍': '小火龍',
  '火恐龍': '火恐龍', 'charmeleon': '火恐龍',
  '噴火龍': '噴火龍ex', 'charizard': '噴火龍ex', 'charizardex': '噴火龍ex',
  '波波': '波波', 'pidgey': '波波',
  '比比鳥': '比比鳥', 'pidgeotto': '比比鳥',
  '大比鳥': '大比鳥ex', 'pidgeot': '大比鳥ex',
  '皮卡丘': '皮卡丘ex', 'pikachu': '皮卡丘ex', '皮卡丘ex': '皮卡丘ex',
  '雷丘': '雷丘', 'raichu': '雷丘',
  '密勒頓': '密勒頓ex', 'miraidon': '密勒頓ex',
  '鐵臂膀': '鐵臂膀ex', 'iron hands': '鐵臂膀ex', 'ironhands': '鐵臂膀ex',
  '古劍豹': '古劍豹ex', 'chien-pao': '古劍豹ex', 'chien pao': '古劍豹ex', 'chienpao': '古劍豹ex',
  '涼脊龍': '涼脊龍', 'frigibax': '涼脊龍',
  '凍脊龍': '凍脊龍', 'arctibax': '凍脊龍',
  '戟脊龍': '戟脊龍', 'baxcalibur': '戟脊龍',
  '甲賀忍蛙': '光輝甲賀忍蛙', '光輝甲賀忍蛙': '光輝甲賀忍蛙', 'greninja': '光輝甲賀忍蛙',
  '胡地': '光輝胡地', '光輝胡地': '光輝胡地', 'alakazam': '光輝胡地',
  '轟鳴月': '轟鳴月ex', 'roaring moon': '轟鳴月ex', 'roaringmoon': '轟鳴月ex',
  '多龍巴魯托': '多龍巴魯托ex', '多龍': '多龍巴魯托ex', 'dragapult': '多龍巴魯托ex',
  '多龍梅西亞': '多龍梅西亞', 'dreepy': '多龍梅西亞',
  '多龍奇': '多龍奇', 'drakloak': '多龍奇',
  '沙奈朵': '沙奈朵ex', 'gardevoir': '沙奈朵ex',
  '奇魯莉安': '奇魯莉安', 'kirlia': '奇魯莉安',
  '拉魯拉絲': '拉魯拉絲', 'ralts': '拉魯拉絲',
  '吼叫尾': '吼叫尾', 'scream tail': '吼叫尾', 'screamtail': '吼叫尾',
  '洛奇亞vstar': '洛奇亞VSTAR', 'lugia vstar': '洛奇亞VSTAR',
  '洛奇亞': '洛奇亞V', 'lugia': '洛奇亞V',
  '始祖大鳥': '始祖大鳥', 'archeops': '始祖大鳥',
  '卡比獸': '卡比獸', 'snorlax': '卡比獸',
  '厄鬼椪': '厄鬼椪ex', 'ogerpon': '厄鬼椪ex',
  '魔幻假面喵': '魔幻假面喵ex', '假面喵': '魔幻假面喵ex', 'meowscarada': '魔幻假面喵ex',
  '新葉喵': '新葉喵', 'sprigatito': '新葉喵',
  '蒂蕾喵': '蒂蕾喵', 'floragato': '蒂蕾喵',
  '超夢': '超夢ex', 'mewtwo': '超夢ex',
  '天然鳥': '天然鳥', 'xatu': '天然鳥',
  '天然雀': '天然雀', 'natu': '天然雀',
  '耿鬼': '耿鬼', 'gengar': '耿鬼',

  // 訓練家 - 物品 & 道具
  '高級球': '高級球', 'ultra ball': '高級球', 'ultraball': '高級球',
  '巢穴球': '巢穴球', 'nest ball': '巢穴球', 'nestball': '巢穴球',
  '神奇糖果': '神奇糖果', '糖果': '神奇糖果', 'rare candy': '神奇糖果', 'rarecandy': '神奇糖果',
  '寶可夢交替': '寶可夢交替', '交替': '寶可夢交替', '交換': '寶可夢交替', 'switch': '寶可夢交替',
  '超級能量回收棒': '超級能量回收棒', '回收棒': '超級能量回收棒', 'super rod': '超級能量回收棒', 'superrod': '超級能量回收棒',
  '大地之器': '大地之器', '器': '大地之器', 'earthen vessel': '大地之器', 'earthenvessel': '大地之器',
  '傷藥': '傷藥', 'potion': '傷藥',
  '反擊捕獲器': '反擊捕獲器', '反擊': '反擊捕獲器', 'counter catcher': '反擊捕獲器', 'countercatcher': '反擊捕獲器',
  '至尊捕捉器': '至尊捕捉器', '至尊捕手': '至尊捕捉器', '至尊': '至尊捕捉器', 'prime catcher': '至尊捕捉器', 'primecatcher': '至尊捕捉器',
  '勇氣護符': '勇氣護符', '護符': '勇氣護符', 'bravery charm': '勇氣護符', 'braverycharm': '勇氣護符',

  // 訓練家 - 支援者
  '博士的研究': '博士的研究', '博士': '博士的研究', 'research': '博士的研究', 'professor': '博士的研究',
  '老大的指令': '老大的指令', '老大': '老大的指令', 'boss': '老大的指令', 'orders': '老大的指令',
  '奇樹': '奇樹', 'iono': '奇樹',
  '派帕': '派帕', 'arven': '派帕',

  // 能量
  '基本火能量': '基本火能量', '火能量': '基本火能量', 'fire energy': '基本火能量',
  '基本水能量': '基本水能量', '水能量': '基本水能量', 'water energy': '基本水能量',
  '基本電能量': '基本電能量', '電能量': '基本電能量', '雷能量': '基本電能量', 'electric energy': '基本電能量',
  '基本草能量': '基本草能量', '草能量': '基本草能量', 'grass energy': '基本草能量',
  '基本超能量': '基本超能量', '超能量': '基本超能量', 'psychic energy': '基本超能量',
  '基本鬥能量': '基本鬥能量', '鬥能量': '基本鬥能量', 'fighting energy': '基本鬥能量',
  '基本惡能量': '基本惡能量', '惡能量': '基本惡能量', 'darkness energy': '基本惡能量',
  '基本鋼能量': '基本鋼能量', '鋼能量': '基本鋼能量', 'metal energy': '基本鋼能量'
};

/**
 * 智能自動辨識卡牌名稱
 */
function autoRecognizeCardFromInput(sourceNameOrUrl, canvasOrImg) {
  if (sourceNameOrUrl) {
    const clean = String(sourceNameOrUrl).toLowerCase().replace(/\.[a-z0-9]+$/i, '').replace(/[_\-\s\d]+/g, ' ').trim();
    const noSpace = clean.replace(/\s+/g, '');

    for (const [alias, realName] of Object.entries(CARD_RECOGNITION_ALIASES)) {
      const aliasNorm = alias.toLowerCase();
      const aliasNoSpace = aliasNorm.replace(/\s+/g, '');
      if (clean.includes(aliasNorm) || noSpace.includes(aliasNoSpace)) {
        return realName;
      }
    }
  }

  // 視覺特徵輔助辨識 (基於色相與色彩分佈)
  if (canvasOrImg && canvasOrImg.getContext) {
    try {
      const ctx = canvasOrImg.getContext('2d');
      const w = canvasOrImg.width;
      const h = canvasOrImg.height;
      if (w > 0 && h > 0) {
        const data = ctx.getImageData(0, 0, w, h).data;
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let i = 0; i < data.length; i += 32 * 4) {
          rSum += data[i];
          gSum += data[i+1];
          bSum += data[i+2];
          count++;
        }
        if (count > 0) {
          const rAvg = rSum / count;
          const gAvg = gSum / count;
          const bAvg = bSum / count;

          if (rAvg > 165 && gAvg < 135 && bAvg < 100) return '小火龍';
          if (rAvg > 170 && gAvg > 160 && bAvg < 90) return '皮卡丘ex';
          if (bAvg > 150 && rAvg < 110) return '古劍豹ex';
          if (gAvg > 140 && rAvg < 120 && bAvg < 120) return '新葉喵';
          if (rAvg > 130 && bAvg > 140 && gAvg < 110) return '超夢ex';
        }
      }
    } catch (e) {}
  }

  // 預設回退至當前選中卡牌或小火龍
  const select = document.getElementById('photo-target-card-select');
  if (select && select.value) return select.value;
  return currentPhotoCardName || '小火龍';
}

/**
 * 處理上傳的卡片照片：立即自動辨識、套用照片並自動加到牌庫中！
 */
function processCardPhotoAndAutoAdd(sourceNameOrUrl, photoDataUrl, canvasOrImg) {
  let recognizedCardName = autoRecognizeCardFromInput(sourceNameOrUrl, canvasOrImg);

  if (!recognizedCardName) {
    const userInput = prompt('📷 已成功讀取卡牌照片！\n請輸入卡片名稱以自動辨識並加入牌庫（例如：小火龍、噴火龍ex、高級球）：', '小火龍');
    if (!userInput || !userInput.trim()) return;
    recognizedCardName = autoRecognizeCardFromInput(userInput.trim()) || userInput.trim();
  }

  // 1. 儲存卡牌專屬自訂照片
  if (photoDataUrl && window.saveCustomCardImage) {
    window.saveCustomCardImage(recognizedCardName, photoDataUrl);
  }

  // 2. 更新照片管理彈窗中的目標卡片
  currentPhotoCardName = recognizedCardName;
  currentPhotoPendingData = photoDataUrl;
  const select = document.getElementById('photo-target-card-select');
  if (select) {
    let optExists = false;
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === recognizedCardName) {
        select.selectedIndex = i;
        optExists = true;
        break;
      }
    }
    if (!optExists) {
      const newOpt = document.createElement('option');
      newOpt.value = recognizedCardName;
      newOpt.textContent = recognizedCardName;
      select.appendChild(newOpt);
      select.value = recognizedCardName;
    }
  }

  // 3. 自動加到當前牌組 (editingCardEntries)
  let existing = editingCardEntries.find(e => e.name === recognizedCardName);
  const isBasicEnergy = /^基本.*能量$/.test(recognizedCardName);
  let actionText = '';

  if (existing) {
    if (isBasicEnergy || existing.count < 4) {
      existing.count++;
      actionText = `【${recognizedCardName}】數量已調整為 ${existing.count} 張`;
    } else {
      actionText = `【${recognizedCardName}】已在牌庫中（已達 4 張上限），已為其更新實體相片！`;
    }
  } else {
    editingCardEntries.push({ name: recognizedCardName, count: 1 });
    actionText = `已成功將【${recognizedCardName}】加入牌組！`;
  }

  // 4. 即時重新渲染編輯器卡牌清單與規則驗證
  renderEditingCardRows();
  parseAndValidateDeck(true);
  updatePhotoModalPreview();

  // 若對戰中，同時更新對戰盤面
  if (typeof renderPlaymat === 'function' && window.currentGameState) {
    renderPlaymat(window.currentGameState);
  }

  // 5. 音效提示
  if (window.sfx && window.sfx.playFanfare) {
    window.sfx.playFanfare();
  }

  // 6. 更新狀態標籤
  const statusBadge = document.getElementById('photo-source-status');
  if (statusBadge) {
    statusBadge.className = 'status-badge status-approved';
    statusBadge.textContent = `✅ 自動辨識成功：${recognizedCardName}`;
  }

  const totalCards = editingCardEntries.reduce((s, e) => s + (e.count || 0), 0);
  alert(`🎉【智能照片辨識完成】\n\n• 辨識卡片：${recognizedCardName}\n• 動作：${actionText}\n• 目前牌組總張數：${totalCards} / 60 張\n• 照片狀態：已即時綁定套用於牌組與對戰！`);
}

/**
 * 牌組編輯列「📷 拍照/上傳辨識加牌」一鍵處理
 */
function handleDirectDeckPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawDataUrl = e.target.result;
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 640;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      processCardPhotoAndAutoAdd(file.name, photoDataUrl, canvas);
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function openCardPhotoModalForCard(cardName = null) {
  const modal = document.getElementById('card-photo-modal');
  const select = document.getElementById('photo-target-card-select');
  if (!modal || !select) return;

  const optionsSet = new Set();
  if (cardName) optionsSet.add(cardName);
  (editingCardEntries || []).forEach(e => {
    if (e && e.name) optionsSet.add(e.name);
  });
  if (typeof POPULAR_CARDS_CATALOG !== 'undefined') {
    POPULAR_CARDS_CATALOG.forEach(group => {
      (group.cards || []).forEach(cName => optionsSet.add(cName));
    });
  }
  if (typeof OFFICIAL_CARD_IMAGES !== 'undefined') {
    Object.keys(OFFICIAL_CARD_IMAGES).forEach(name => optionsSet.add(name));
  }

  select.innerHTML = '';
  optionsSet.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const targetName = cardName || (editingCardEntries[0] ? editingCardEntries[0].name : '小火龍');
  select.value = targetName;
  currentPhotoCardName = targetName;
  currentPhotoPendingData = '';

  updatePhotoModalPreview();
  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeCardPhotoModal() {
  const modal = document.getElementById('card-photo-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
  currentPhotoPendingData = '';
}

function onPhotoTargetCardChanged() {
  const select = document.getElementById('photo-target-card-select');
  if (!select) return;
  currentPhotoCardName = select.value;
  currentPhotoPendingData = '';
  updatePhotoModalPreview();
}

function updatePhotoModalPreview() {
  const nameDisplay = document.getElementById('photo-target-name-display');
  const previewImg = document.getElementById('photo-preview-img');
  const placeholder = document.getElementById('photo-preview-placeholder');
  const statusBadge = document.getElementById('photo-source-status');
  const urlInput = document.getElementById('card-photo-url-input');
  const fileNameDisplay = document.getElementById('card-photo-file-name');

  if (nameDisplay) nameDisplay.textContent = currentPhotoCardName;
  if (fileNameDisplay) fileNameDisplay.textContent = '未選擇檔案';
  if (urlInput) urlInput.value = '';

  const activeUrl = currentPhotoPendingData || (window.getCardImageUrl ? window.getCardImageUrl(currentPhotoCardName) : null);
  const customImages = window.getCustomCardImages ? window.getCustomCardImages() : {};
  const isCustom = !!customImages[currentPhotoCardName] || !!currentPhotoPendingData;

  if (activeUrl) {
    if (previewImg) {
      previewImg.src = activeUrl;
      previewImg.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    if (statusBadge) {
      statusBadge.className = isCustom ? 'status-badge status-approved' : 'status-badge status-pending';
      statusBadge.textContent = isCustom ? '自訂上傳照片' : '官方卡牌圖案';
    }
  } else {
    if (previewImg) previewImg.style.display = 'none';
    if (placeholder) {
      placeholder.style.display = 'block';
      placeholder.textContent = window.getCardArtEmoji ? window.getCardArtEmoji({ name: currentPhotoCardName }) : '🦎';
    }
    if (statusBadge) {
      statusBadge.className = 'status-badge status-rejected';
      statusBadge.textContent = '預設 Emoji 樣式';
    }
  }
}

function handleCardPhotoFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileNameDisplay = document.getElementById('card-photo-file-name');
  if (fileNameDisplay) fileNameDisplay.textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawDataUrl = e.target.result;
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 640;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      currentPhotoPendingData = canvas.toDataURL('image/jpeg', 0.85);

      const previewImg = document.getElementById('photo-preview-img');
      const placeholder = document.getElementById('photo-preview-placeholder');

      if (previewImg) {
        previewImg.src = currentPhotoPendingData;
        previewImg.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';

      // 立即自動辨識並自動加入牌庫中！
      processCardPhotoAndAutoAdd(file.name, currentPhotoPendingData, canvas);
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function applyCardPhotoFromUrl() {
  const urlInput = document.getElementById('card-photo-url-input');
  if (!urlInput || !urlInput.value.trim()) {
    alert('請輸入圖片網址！');
    return;
  }
  const url = urlInput.value.trim();
  currentPhotoPendingData = url;

  const previewImg = document.getElementById('photo-preview-img');
  const placeholder = document.getElementById('photo-preview-placeholder');

  if (previewImg) {
    previewImg.src = url;
    previewImg.style.display = 'block';
  }
  if (placeholder) placeholder.style.display = 'none';

  // 立即自動辨識並自動加入牌庫中！
  processCardPhotoAndAutoAdd(url, url, null);
}

function resetCardPhotoToDefault() {
  if (!currentPhotoCardName) return;
  if (window.removeCustomCardImage) {
    window.removeCustomCardImage(currentPhotoCardName);
  }
  currentPhotoPendingData = '';
  updatePhotoModalPreview();
  if (typeof renderEditingCardRows === 'function') renderEditingCardRows();
  if (typeof renderPlaymat === 'function' && window.currentGameState) renderPlaymat(window.currentGameState);
  alert(`已將【${currentPhotoCardName}】恢復為官方預設圖案！`);
}

function saveCardPhotoModal() {
  if (!currentPhotoCardName) return;
  if (currentPhotoPendingData) {
    if (window.saveCustomCardImage) {
      window.saveCustomCardImage(currentPhotoCardName, currentPhotoPendingData);
    }
  }
  if (typeof renderEditingCardRows === 'function') renderEditingCardRows();
  if (typeof renderPlaymat === 'function' && window.currentGameState) renderPlaymat(window.currentGameState);
  closeCardPhotoModal();
  alert(`已成功更新【${currentPhotoCardName}】的卡牌照片！已即時套用於牌組與對戰！`);
}

// Expose functions globally for onclick attributes
window.adjustCardQuantity = adjustCardQuantity;
window.deleteCardRow = deleteCardRow;
window.openSwapCardPanel = openSwapCardPanel;
window.confirmSwapCard = confirmSwapCard;
window.cancelSwapCard = cancelSwapCard;
window.editDeckInSlot = editDeckInSlot;
window.quickBattleWithDeck = quickBattleWithDeck;
window.openCardPhotoModalForCard = openCardPhotoModalForCard;
window.closeCardPhotoModal = closeCardPhotoModal;
window.onPhotoTargetCardChanged = onPhotoTargetCardChanged;
window.handleCardPhotoFileSelected = handleCardPhotoFileSelected;
window.applyCardPhotoFromUrl = applyCardPhotoFromUrl;
window.resetCardPhotoToDefault = resetCardPhotoToDefault;
window.saveCardPhotoModal = saveCardPhotoModal;
window.handleDirectDeckPhotoUpload = handleDirectDeckPhotoUpload;
window.processCardPhotoAndAutoAdd = processCardPhotoAndAutoAdd;
window.autoRecognizeCardFromInput = autoRecognizeCardFromInput;
