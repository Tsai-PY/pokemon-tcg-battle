// lib/initDecks.js
const fs = require('fs');
const path = require('path');
const { validateDeck } = require('./deckValidator');

const DECKS_FILE = path.join(__dirname, '..', 'data', 'shared_decks.json');

const DEFAULT_DECKS = [
  {
    id: 'deck_1',
    name: '惡太晶噴火龍ex 狂暴燃燒牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '經典雙重打手配置！由小火龍進化為噴火龍ex，擁有特性「煉獄支配」爆發附能，並由大比鳥ex「快速搜尋」精準檢索。',
    cardEntries: [
      { name: '小火龍', count: 4 },
      { name: '火恐龍', count: 1 },
      { name: '噴火龍ex', count: 3 },
      { name: '波波', count: 2 },
      { name: '比比鳥', count: 1 },
      { name: '大比鳥ex', count: 2 },
      { name: '光輝甲賀忍蛙', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 4 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 4 },
      { name: '寶可夢交替', count: 2 },
      { name: '大地之器', count: 2 },
      { name: '超級能量回收棒', count: 1 },
      { name: '勇氣護符', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本火能量', count: 8 },
      { name: '基本惡能量', count: 4 }
    ]
  },
  {
    id: 'deck_2',
    name: '密勒頓ex 迅雷極速牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '起手串聯驅動展開！迅速鋪出場上雷系基礎寶可夢，搭配鐵臂膀ex「感謝增幅」多拿獎賞卡，擊潰對手！',
    cardEntries: [
      { name: '密勒頓ex', count: 3 },
      { name: '鐵臂膀ex', count: 2 },
      { name: '皮卡丘', count: 4 },
      { name: '雷丘', count: 3 },
      { name: '皮卡丘ex', count: 2 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 4 },
      { name: '派帕', count: 2 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '寶可夢交替', count: 3 },
      { name: '大地之器', count: 2 },
      { name: '傷藥', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '超級能量回收棒', count: 1 },
      { name: '基本電能量', count: 14 }
    ]
  },
  {
    id: 'deck_3',
    name: '古劍豹ex 冰霜十字水牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '水系無限充能！古劍豹ex抓水能量，戟脊龍「極低溫」單回合無限貼能，冰霜劍刃爆發單發破百傷害！',
    cardEntries: [
      { name: '古劍豹ex', count: 3 },
      { name: '涼脊龍', count: 4 },
      { name: '凍脊龍', count: 1 },
      { name: '戟脊龍', count: 3 },
      { name: '光輝甲賀忍蛙', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 4 },
      { name: '寶可夢交替', count: 3 },
      { name: '超級能量回收棒', count: 2 },
      { name: '大地之器', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本水能量', count: 15 }
    ]
  },
  {
    id: 'deck_4',
    name: '轟鳴月ex 古代暴走惡牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '古代悖謬的終極力量！「狂暴粉碎」直接強行氣絕任何巨大HP的防禦對手，配合災禍旋風強力進攻！',
    cardEntries: [
      { name: '轟鳴月ex', count: 4 },
      { name: '波波', count: 3 },
      { name: '比比鳥', count: 1 },
      { name: '大比鳥ex', count: 2 },
      { name: '光輝甲賀忍蛙', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 3 },
      { name: '大地之器', count: 3 },
      { name: '寶可夢交替', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '超級能量回收棒', count: 1 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本惡能量', count: 16 }
    ]
  },
  {
    id: 'deck_5',
    name: '皮卡丘ex 頑強電光經典牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '電屬性高抗性強攻！皮卡丘ex特性「頑強韌性」死裡逃生，黃玉伏特單發高達300點傷害，毀滅級打擊！',
    cardEntries: [
      { name: '皮卡丘ex', count: 3 },
      { name: '皮卡丘', count: 4 },
      { name: '雷丘', count: 3 },
      { name: '密勒頓ex', count: 2 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '寶可夢交替', count: 3 },
      { name: '傷藥', count: 3 },
      { name: '大地之器', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本電能量', count: 12 },
      { name: '基本草能量', count: 2 },
      { name: '基本鋼能量', count: 2 }
    ]
  },
  {
    id: 'deck_6',
    name: '多龍巴魯托ex 幻影奇襲龍牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '二階龍系狙擊神卡！多龍巴魯托ex「幻影奇襲」前台爆發200傷害，並在備戰區任意放置6個傷害指示物，精準收割！',
    cardEntries: [
      { name: '多龍巴魯托ex', count: 3 },
      { name: '多龍梅西亞', count: 4 },
      { name: '多龍奇', count: 3 },
      { name: '光輝胡地', count: 1 },
      { name: '天然鳥', count: 2 },
      { name: '天然雀', count: 2 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 4 },
      { name: '寶可夢交替', count: 2 },
      { name: '大地之器', count: 2 },
      { name: '超級能量回收棒', count: 1 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本超能量', count: 8 },
      { name: '基本火能量', count: 6 }
    ]
  },
  {
    id: 'deck_7',
    name: '沙奈朵ex 精神擁抱超能牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '超能系永動機！沙奈朵ex特性「精神擁抱」一回合自墓地無上限狂貼超能量，吼叫尾超長程狙擊轟沉對手！',
    cardEntries: [
      { name: '沙奈朵ex', count: 3 },
      { name: '奇魯莉安', count: 4 },
      { name: '拉魯拉絲', count: 4 },
      { name: '吼叫尾', count: 2 },
      { name: '光輝甲賀忍蛙', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 4 },
      { name: '派帕', count: 2 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 3 },
      { name: '寶可夢交替', count: 2 },
      { name: '大地之器', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '超級能量回收棒', count: 1 },
      { name: '基本超能量', count: 14 }
    ]
  },
  {
    id: 'deck_8',
    name: '洛奇亞VSTAR 白銀狂風無色牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: 'VSTAR力量狂嘯！洛奇亞VSTAR「召集之星」直接自棄牌區特召2隻始祖大鳥，瞬間填滿能量、一擊必殺！',
    cardEntries: [
      { name: '洛奇亞VSTAR', count: 3 },
      { name: '洛奇亞V', count: 4 },
      { name: '始祖大鳥', count: 4 },
      { name: '卡比獸', count: 2 },
      { name: '光輝甲賀忍蛙', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '高級球', count: 4 },
      { name: '巢穴球', count: 4 },
      { name: '寶可夢交替', count: 3 },
      { name: '大地之器', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '傷藥', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本電能量', count: 5 },
      { name: '基本火能量', count: 5 },
      { name: '基本水能量', count: 5 }
    ]
  },
  {
    id: 'deck_9',
    name: '厄鬼椪ex 碧之假面草牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '草屬性極限爆發！厄鬼椪 碧之假面ex特性自手牌附能抽牌，搭配魔幻假面喵ex「花漾炸彈」雙線重創！',
    cardEntries: [
      { name: '厄鬼椪ex', count: 4 },
      { name: '新葉喵', count: 4 },
      { name: '蒂蕾喵', count: 2 },
      { name: '魔幻假面喵ex', count: 3 },
      { name: '光輝甲賀忍蛙', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 3 },
      { name: '大地之器', count: 2 },
      { name: '寶可夢交替', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '超級能量回收棒', count: 1 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本草能量', count: 14 }
    ]
  },
  {
    id: 'deck_10',
    name: '超夢ex 精神強念超能極致牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '初代神獸降臨！超夢ex超能爆發單體高傷害，搭配天然鳥特性「神清氣爽」雙充能抽牌，運轉極度流暢穩定！',
    cardEntries: [
      { name: '超夢ex', count: 4 },
      { name: '天然雀', count: 4 },
      { name: '天然鳥', count: 4 },
      { name: '耿鬼', count: 2 },
      { name: '光輝胡地', count: 1 },
      { name: '博士的研究', count: 4 },
      { name: '老大的指令', count: 3 },
      { name: '奇樹', count: 3 },
      { name: '派帕', count: 3 },
      { name: '巢穴球', count: 4 },
      { name: '高級球', count: 4 },
      { name: '寶可夢交替', count: 3 },
      { name: '大地之器', count: 2 },
      { name: '勇氣護符', count: 2 },
      { name: '傷藥', count: 2 },
      { name: '至尊捕捉器', count: 1 },
      { name: '基本超能量', count: 14 }
    ]
  }
];

function initSharedDecks() {
  const dir = path.dirname(DECKS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let decks = [];
  if (fs.existsSync(DECKS_FILE)) {
    try {
      decks = JSON.parse(fs.readFileSync(DECKS_FILE, 'utf8'));
    } catch (e) {
      decks = [];
    }
  }

  // If empty or less than 10, fill with defaults
  if (!Array.isArray(decks) || decks.length < 10) {
    decks = DEFAULT_DECKS.map((d, idx) => {
      const v = validateDeck(d.cardEntries);
      return {
        ...d,
        slot: idx + 1,
        totalCards: v.totalCards,
        valid: v.valid,
        updatedAt: new Date().toISOString()
      };
    });
    fs.writeFileSync(DECKS_FILE, JSON.stringify(decks, null, 2), 'utf8');
  }

  return decks;
}

function getSharedDecks() {
  return initSharedDecks();
}

function saveSharedDecks(decks) {
  fs.writeFileSync(DECKS_FILE, JSON.stringify(decks, null, 2), 'utf8');
}

/**
 * Upload or replace a shared deck slot (1 to 10).
 * Enforces maximum 10 shared decks total!
 */
function uploadSharedDeck(slotIndex, name, authorPhone, authorName, cardEntries, description = '') {
  const validation = validateDeck(cardEntries);
  if (!validation.valid) {
    return {
      success: false,
      message: '牌組未符合 PTCG 規範：\n' + validation.errors.join('\n'),
      errors: validation.errors
    };
  }

  const decks = getSharedDecks();
  const targetSlot = parseInt(slotIndex, 10);

  if (targetSlot < 1 || targetSlot > 10) {
    return { success: false, message: '牌組槽位必須為 1 到 10' };
  }

  const newDeck = {
    id: `shared_deck_${targetSlot}_${Date.now()}`,
    slot: targetSlot,
    name: name || `共同牌組 ${targetSlot}`,
    author: authorName || '訓練家',
    authorPhone: authorPhone,
    description: description || `由 ${authorName || authorPhone} 上傳的60張對戰牌組`,
    cardEntries: cardEntries.map(e => ({ name: e.name, count: e.count })),
    totalCards: validation.totalCards,
    valid: true,
    updatedAt: new Date().toISOString()
  };

  // Replace or set at targetSlot - 1
  while (decks.length < 10) {
    decks.push(null);
  }
  decks[targetSlot - 1] = newDeck;

  // Filter nulls if any, but ensure slot positions
  const cleanDecks = decks.filter(Boolean).slice(0, 10);
  cleanDecks.forEach((d, idx) => d.slot = idx + 1);

  saveSharedDecks(cleanDecks);

  return {
    success: true,
    message: `牌組「${newDeck.name}」已成功儲存至共同牌組第 ${targetSlot} 組！`,
    deck: newDeck
  };
}

module.exports = {
  initSharedDecks,
  getSharedDecks,
  uploadSharedDeck,
  DEFAULT_DECKS
};
