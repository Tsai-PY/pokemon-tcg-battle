// public/js/cardLibrary.js
// PTCG 全部牌組庫 (遊戲全卡牌圖鑑與收錄管理中心)

let currentLibraryCategoryFilter = 'all';
let currentLibrarySearchTerm = '';
let pendingNewCardPhotoBase64 = '';

/**
 * 取得本遊戲收錄之所有卡牌清單（包含預設官方卡牌與玩家自訂收錄卡牌）
 */
function getAllLibraryCards() {
  const cardsMap = new Map();

  // 1. 從 POPULAR_CARDS_CATALOG 收集
  if (typeof POPULAR_CARDS_CATALOG !== 'undefined') {
    POPULAR_CARDS_CATALOG.forEach(group => {
      const catLabel = group.category || '';
      let cat = 'pokemon';
      if (/支援者/i.test(catLabel)) cat = 'supporter';
      else if (/物品|道具/i.test(catLabel)) cat = 'item';
      else if (/能量/i.test(catLabel)) cat = 'energy';

      (group.cards || []).forEach(name => {
        const cleanName = name.trim();
        if (!cleanName) return;
        const isAce = /至尊|王牌|ace spec|希望護身符/i.test(cleanName);
        cardsMap.set(cleanName, {
          name: cleanName,
          category: isAce ? 'acespec' : cat,
          categoryLabel: isAce ? '👑 ACE SPEC' : (cat === 'pokemon' ? '🐾 寶可夢' : (cat === 'supporter' ? '👤 支援者' : (cat === 'energy' ? '⚡ 能量' : '🎒 物品/道具'))),
          isCustom: false
        });
      });
    });
  }

  // 2. 從 OFFICIAL_CARD_IMAGES 收集
  if (typeof OFFICIAL_CARD_IMAGES !== 'undefined') {
    Object.keys(OFFICIAL_CARD_IMAGES).forEach(name => {
      const cleanName = name.trim();
      if (!cleanName || cardsMap.has(cleanName)) return;

      const recognized = window.recognizeCard ? window.recognizeCard(cleanName) : null;
      let cat = recognized ? recognized.category : 'pokemon';
      const isAce = /至尊|王牌|ace spec|希望護身符/i.test(cleanName);

      cardsMap.set(cleanName, {
        name: cleanName,
        category: isAce ? 'acespec' : (cat || 'pokemon'),
        categoryLabel: isAce ? '👑 ACE SPEC' : (cat === 'supporter' ? '👤 支援者' : (cat === 'energy' ? '⚡ 能量' : (cat === 'item' ? '🎒 物品/道具' : '🐾 寶可夢'))),
        isCustom: false
      });
    });
  }

  // 3. 從本地玩家自訂收錄資料庫中載入
  try {
    const customStored = localStorage.getItem('ptcg_custom_library_cards');
    if (customStored) {
      const customList = JSON.parse(customStored);
      if (Array.isArray(customList)) {
        customList.forEach(item => {
          if (item && item.name) {
            cardsMap.set(item.name, {
              ...item,
              isCustom: true
            });
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to load custom library cards:', e);
  }

  // 轉換為陣列並補全圖片與說明
  return Array.from(cardsMap.values()).map(card => {
    const imageUrl = window.getCardImageUrl ? window.getCardImageUrl(card.name) : null;
    const artEmoji = window.getCardArtEmoji ? window.getCardArtEmoji(card.name) : '🎴';
    const guide = window.getCardUsageGuide ? window.getCardUsageGuide(card) : null;

    return {
      ...card,
      imageUrl,
      artEmoji,
      guide
    };
  });
}

/**
 * 載入並渲染「全部牌組庫」卡片網格
 */
function loadAllCardsLibrary() {
  const container = document.getElementById('card-library-grid-container');
  if (!container) return;

  const allCards = getAllLibraryCards();

  // 更新各類別計數器
  const countAll = allCards.length;
  const countPokemon = allCards.filter(c => c.category === 'pokemon').length;
  const countSupporter = allCards.filter(c => c.category === 'supporter').length;
  const countItem = allCards.filter(c => c.category === 'item' || c.category === 'acespec').length;
  const countEnergy = allCards.filter(c => c.category === 'energy').length;

  const setElText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setElText('lib-count-all', countAll);
  setElText('lib-count-pokemon', countPokemon);
  setElText('lib-count-supporter', countSupporter);
  setElText('lib-count-item', countItem);
  setElText('lib-count-energy', countEnergy);

  // 篩選
  const filtered = allCards.filter(card => {
    // 類別篩選
    if (currentLibraryCategoryFilter !== 'all') {
      if (currentLibraryCategoryFilter === 'item') {
        if (card.category !== 'item' && card.category !== 'acespec') return false;
      } else if (card.category !== currentLibraryCategoryFilter) {
        return false;
      }
    }

    // 搜尋詞篩選
    if (currentLibrarySearchTerm) {
      const term = currentLibrarySearchTerm.toLowerCase();
      const inName = card.name.toLowerCase().includes(term);
      const inGuide = card.guide ? (
        (card.guide.effectText || '').toLowerCase().includes(term) ||
        (card.guide.tacticsTip || '').toLowerCase().includes(term)
      ) : false;
      if (!inName && !inGuide) return false;
    }

    return true;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #94a3b8;">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🔍</div>
        <p>沒有找到符合「${currentLibrarySearchTerm}」的卡牌。</p>
        <button class="btn btn-accent btn-sm" onclick="openAddCardToLibraryModal()" style="margin-top: 10px;">
          ➕ 立即上傳收錄這張新卡牌
        </button>
      </div>
    `;
    return;
  }

  filtered.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'library-card-item';
    cardEl.onclick = () => showCardDetailGuideModal(card.name);

    let badgeClass = 'badge-pokemon';
    if (card.category === 'supporter') badgeClass = 'badge-trainer';
    else if (card.category === 'item') badgeClass = 'badge-trainer';
    else if (card.category === 'acespec') badgeClass = 'badge-acespec';
    else if (card.category === 'energy') badgeClass = 'badge-energy';

    cardEl.innerHTML = `
      <div class="library-card-img-wrap">
        ${card.imageUrl ? `
          <img src="${card.imageUrl}" alt="${card.name}" class="library-card-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
          <span style="display: none; font-size: 2.5rem;">${card.artEmoji}</span>
        ` : `
          <span style="font-size: 2.5rem;">${card.artEmoji}</span>
        `}
      </div>
      <div class="library-card-title">${card.name}</div>
      <span class="library-card-cat-badge ${badgeClass}">${card.categoryLabel}</span>
      ${card.isCustom ? `<span style="font-size: 0.7rem; color: #38bdf8; margin-bottom: 4px;">★ 玩家自訂收錄</span>` : ''}
      <div style="margin-top: auto; display: flex; gap: 6px; width: 100%; justify-content: center; padding-top: 6px;">
        <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 3px 8px;" onclick="event.stopPropagation(); showCardDetailGuideModal('${card.name}')">🔍 詳情</button>
        <button type="button" class="btn btn-accent btn-sm" style="font-size: 0.75rem; padding: 3px 8px;" onclick="event.stopPropagation(); openCardPhotoModalForCard('${card.name}')">📷 換圖</button>
      </div>
    `;

    container.appendChild(cardEl);
  });
}

/**
 * 類別標籤切換
 */
function filterCardLibraryCategory(category) {
  currentLibraryCategoryFilter = category;
  document.querySelectorAll('.filter-pills .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
  });
  loadAllCardsLibrary();
}

/**
 * 搜尋框輸入過濾
 */
function filterCardLibrary() {
  const input = document.getElementById('card-library-search-input');
  currentLibrarySearchTerm = (input ? input.value : '').trim();
  loadAllCardsLibrary();
}

/**
 * 開啟「上傳/收錄新卡牌」彈窗
 */
function openAddCardToLibraryModal() {
  const modal = document.getElementById('add-card-library-modal');
  if (!modal) return;
  document.getElementById('new-card-name').value = '';
  document.getElementById('new-card-effect').value = '';
  document.getElementById('new-card-hp').value = '120';
  document.getElementById('new-card-category').value = 'pokemon';
  const previewWrap = document.getElementById('new-card-photo-preview-wrap');
  if (previewWrap) previewWrap.style.display = 'none';
  pendingNewCardPhotoBase64 = '';

  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeAddCardToLibraryModal() {
  const modal = document.getElementById('add-card-library-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

/**
 * 新卡牌相片檔案選取預覽
 */
function previewNewCardPhotoFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    pendingNewCardPhotoBase64 = e.target.result;
    const img = document.getElementById('new-card-photo-preview');
    const wrap = document.getElementById('new-card-photo-preview-wrap');
    if (img && wrap) {
      img.src = pendingNewCardPhotoBase64;
      wrap.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

/**
 * 儲存新卡牌至「全部牌組庫」
 */
function saveNewCardToLibrary() {
  const nameInput = document.getElementById('new-card-name');
  const catInput = document.getElementById('new-card-category');
  const hpInput = document.getElementById('new-card-hp');
  const effectInput = document.getElementById('new-card-effect');

  const name = (nameInput ? nameInput.value : '').trim();
  if (!name) {
    alert('請輸入卡牌名稱！');
    return;
  }

  const cat = catInput ? catInput.value : 'pokemon';
  const hp = hpInput ? parseInt(hpInput.value, 10) || 100 : 100;
  const effect = effectInput ? effectInput.value.trim() : '';

  const catLabels = {
    pokemon: '🐾 寶可夢',
    supporter: '👤 支援者',
    item: '🎒 物品/道具',
    acespec: '👑 ACE SPEC',
    energy: '⚡ 能量'
  };

  const newCard = {
    name,
    category: cat,
    categoryLabel: catLabels[cat] || '🐾 寶可夢',
    hp: cat === 'pokemon' ? hp : null,
    description: effect,
    isCustom: true
  };

  // 存入 localStorage
  try {
    const customStored = localStorage.getItem('ptcg_custom_library_cards');
    let customList = customStored ? JSON.parse(customStored) : [];
    if (!Array.isArray(customList)) customList = [];

    // 若已有同名卡，更新它
    const idx = customList.findIndex(c => c.name === name);
    if (idx >= 0) {
      customList[idx] = newCard;
    } else {
      customList.push(newCard);
    }
    localStorage.setItem('ptcg_custom_library_cards', JSON.stringify(customList));
  } catch (e) {
    console.error('Failed to save custom card:', e);
  }

  // 若有上傳照片，存入照片庫
  if (pendingNewCardPhotoBase64 && window.saveCustomCardImage) {
    window.saveCustomCardImage(name, pendingNewCardPhotoBase64);
  }

  // 同步更新 POPULAR_CARDS_CATALOG 供牌組建置器使用
  if (typeof POPULAR_CARDS_CATALOG !== 'undefined') {
    let targetGroup = POPULAR_CARDS_CATALOG[0];
    if (cat === 'supporter') targetGroup = POPULAR_CARDS_CATALOG[1];
    else if (cat === 'item' || cat === 'acespec') targetGroup = POPULAR_CARDS_CATALOG[2];
    else if (cat === 'energy') targetGroup = POPULAR_CARDS_CATALOG[3];

    if (targetGroup && targetGroup.cards && !targetGroup.cards.includes(name)) {
      targetGroup.cards.unshift(name);
    }
  }

  closeAddCardToLibraryModal();
  loadAllCardsLibrary();

  // 若牌組編輯器存在，更新下拉選單
  if (typeof populateCardSelectDropdowns === 'function') {
    populateCardSelectDropdowns();
  }

  alert(`🎉 恭喜！卡牌【${name}】已成功收錄至「全部牌組庫」！\n您可隨時在「上傳共同牌組」中挑選此卡放入 60 張牌組！`);
}

/**
 * 拍照/上傳卡牌照片自動辨識並收錄到牌庫
 */
async function handleLibraryCardPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileName = file.name || '';
  const reader = new FileReader();

  reader.onload = async (e) => {
    const base64Data = e.target.result;

    // 智能辨識卡名
    let recognizedName = '';
    if (typeof autoRecognizeCardFromInput === 'function') {
      recognizedName = autoRecognizeCardFromInput(fileName, base64Data);
    }

    if (!recognizedName) {
      recognizedName = prompt('📷 系統正在收錄您的卡片相片！\n請輸入這張卡牌的中文名稱（例如：小火龍、噴火龍ex、水君V、奇樹）：', fileName.replace(/\.[^.]+$/, '').trim());
    }

    if (!recognizedName || !recognizedName.trim()) {
      alert('已取消收錄。');
      event.target.value = '';
      return;
    }

    recognizedName = recognizedName.trim();

    // 1. 儲存卡片相片
    if (window.saveCustomCardImage) {
      window.saveCustomCardImage(recognizedName, base64Data);
    }

    // 2. 自動判斷分類並收錄到全部牌組庫
    const recognized = window.recognizeCard ? window.recognizeCard(recognizedName) : null;
    const cat = recognized ? recognized.category : 'pokemon';
    const isAce = /至尊|王牌|ace spec|希望護身符/i.test(recognizedName);

    const catLabels = {
      pokemon: '🐾 寶可夢',
      supporter: '👤 支援者',
      item: '🎒 物品/道具',
      acespec: '👑 ACE SPEC',
      energy: '⚡ 能量'
    };

    const newCard = {
      name: recognizedName,
      category: isAce ? 'acespec' : (cat || 'pokemon'),
      categoryLabel: isAce ? '👑 ACE SPEC' : (catLabels[cat] || '🐾 寶可夢'),
      isCustom: true
    };

    try {
      const customStored = localStorage.getItem('ptcg_custom_library_cards');
      let customList = customStored ? JSON.parse(customStored) : [];
      if (!Array.isArray(customList)) customList = [];
      const idx = customList.findIndex(c => c.name === recognizedName);
      if (idx >= 0) {
        customList[idx] = newCard;
      } else {
        customList.push(newCard);
      }
      localStorage.setItem('ptcg_custom_library_cards', JSON.stringify(customList));
    } catch (err) {
      console.error(err);
    }

    // 3. 同步至熱門卡單
    if (typeof POPULAR_CARDS_CATALOG !== 'undefined') {
      let targetGroup = POPULAR_CARDS_CATALOG[0];
      if (cat === 'supporter') targetGroup = POPULAR_CARDS_CATALOG[1];
      else if (cat === 'item' || isAce) targetGroup = POPULAR_CARDS_CATALOG[2];
      else if (cat === 'energy') targetGroup = POPULAR_CARDS_CATALOG[3];
      if (targetGroup && targetGroup.cards && !targetGroup.cards.includes(recognizedName)) {
        targetGroup.cards.unshift(recognizedName);
      }
    }

    // 重設 input
    event.target.value = '';

    // 重新載入牌組庫與下拉選單
    loadAllCardsLibrary();
    if (typeof populateCardSelectDropdowns === 'function') {
      populateCardSelectDropdowns();
    }

    alert(`🎉 辨識成功！卡牌【${recognizedName}】與實體相片已成功收錄至「全部牌組庫」！\n已即時套用於全系統！`);
  };

  reader.readAsDataURL(file);
}

/**
 * 點選卡片開啟「卡片出牌教學與招式詳情」彈窗
 */
function showCardDetailGuideModal(cardName) {
  const allCards = typeof collectAllLibraryCards === 'function' ? collectAllLibraryCards() : [];
  const foundCard = allCards.find(c => c.name === cardName);
  const guide = (foundCard && foundCard.guide) ? foundCard.guide : (window.getCardUsageGuide ? window.getCardUsageGuide(foundCard || cardName) : null);
  const imageUrl = window.getCardImageUrl ? window.getCardImageUrl(cardName) : null;
  const artEmoji = window.getCardArtEmoji ? window.getCardArtEmoji(cardName) : '🎴';

  // 嘗試使用共用的 card-detail-modal
  let modal = document.getElementById('card-usage-guide-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'card-usage-guide-modal';
    modal.style.zIndex = '2300';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h3 class="modal-title">📖 【${cardName}】卡牌詳情與出牌指南</h3>
        <button class="modal-close" onclick="document.getElementById('card-usage-guide-modal').classList.remove('active'); document.getElementById('card-usage-guide-modal').style.display='none';">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 14px;">
          <div style="width: 130px; height: 182px; border-radius: 6px; overflow: hidden; background: #1e293b; border: 1px solid #475569; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${imageUrl ? `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';" />` : `<span style="font-size: 3rem;">${artEmoji}</span>`}
          </div>
          <div style="flex: 1; font-size: 0.9rem;">
            <div style="font-size: 1.2rem; font-weight: 800; color: #ffcb05; margin-bottom: 6px;">${cardName}</div>
            <div style="margin-bottom: 8px;">
              <span class="status-badge status-approved">${guide ? guide.categoryBadge : '標準卡牌'}</span>
              <span class="status-badge" style="background: rgba(14, 165, 233, 0.2); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.4); margin-left: 4px;">
                ${guide ? guide.timingBadge : '隨時可用'}
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.5; background: #0f172a; padding: 8px 10px; border-radius: 6px; border: 1px solid #334155;">
              <strong>效果說明：</strong><br>${guide ? guide.effectText : '標準 PTCG 卡牌招式或卡片效果。'}
            </div>
          </div>
        </div>

        <div style="background: rgba(30, 41, 59, 0.7); border-radius: 8px; padding: 12px; border: 1px solid #334155; font-size: 0.85rem; line-height: 1.6; color: #cbd5e1;">
          <div style="color: #38bdf8; font-weight: bold; margin-bottom: 4px;">💡 最佳出牌時機與戰術：</div>
          <div>${guide ? guide.timingText : '依對戰局勢適時打出。'}</div>
          ${guide && guide.tacticsTip ? `<div style="margin-top: 6px; color: #f59e0b;">★ 實戰建議：${guide.tacticsTip}</div>` : ''}
        </div>
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <button type="button" class="btn btn-accent btn-sm" onclick="document.getElementById('card-usage-guide-modal').classList.remove('active'); document.getElementById('card-usage-guide-modal').style.display='none'; openCardPhotoModalForCard('${cardName}')">
          📷 更換此卡相片
        </button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('card-usage-guide-modal').classList.remove('active'); document.getElementById('card-usage-guide-modal').style.display='none';">
          關閉
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.style.display = 'flex';
}

// 註冊全域函數
window.getAllLibraryCards = getAllLibraryCards;
window.loadAllCardsLibrary = loadAllCardsLibrary;
window.filterCardLibraryCategory = filterCardLibraryCategory;
window.filterCardLibrary = filterCardLibrary;
window.openAddCardToLibraryModal = openAddCardToLibraryModal;
window.closeAddCardToLibraryModal = closeAddCardToLibraryModal;
window.previewNewCardPhotoFile = previewNewCardPhotoFile;
window.saveNewCardToLibrary = saveNewCardToLibrary;
window.handleLibraryCardPhotoUpload = handleLibraryCardPhotoUpload;
window.showCardDetailGuideModal = showCardDetailGuideModal;
