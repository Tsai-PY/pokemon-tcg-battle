// lib/initDecks.js
const fs = require('fs');
const path = require('path');
const { validateDeck } = require('./deckValidator');

const DECKS_FILE = path.join(__dirname, '..', 'data', 'shared_decks.json');

const DEFAULT_DECKS = [
  {
    id: 'deck_1',
    name: '超級噴火龍Xex 烈獄狂火牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '官方超級進化戰術牌組！由小火龍進化為超級噴火龍Xex（HP 360），搭配花舞鳥ex特性「激動渦輪」爆發填能，使出「烈獄狂火X」丟棄場上火能量打出無上限毀滅傷害！',
    cardEntries: [
      { name: '小火龍', count: 4 },
      { name: '火恐龍', count: 3 },
      { name: '超級噴火龍Xex', count: 3 },
      { name: '比克提尼', count: 1 },
      { name: '熔蟻獸', count: 2 },
      { name: '萊希拉姆', count: 1 },
      { name: '花舞鳥ex', count: 2 },
      { name: '吉雉雞ex', count: 1 },
      { name: '能量回收', count: 2 },
      { name: '能量回收器', count: 1 },
      { name: '特殊紅牌', count: 1 },
      { name: '高級球', count: 2 },
      { name: '神奇糖果', count: 2 },
      { name: '貴重手推車', count: 1 },
      { name: '寶可平板', count: 4 },
      { name: '寶可夢交替', count: 1 },
      { name: '夜間擔架', count: 2 },
      { name: '氣球', count: 2 },
      { name: '艾莉絲的鬥志', count: 2 },
      { name: '小光', count: 3 },
      { name: '吹火人', count: 2 },
      { name: '老大的指令', count: 2 },
      { name: '莉莉艾的決意', count: 4 },
      { name: '基本火能量', count: 12 }
    ]
  },
  {
    id: 'deck_2',
    name: '超級沙奈朵ex 超級交響樂牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '官方超級進化戰術牌組！利用超級沙奈朵ex「盈溢祈願」大量填能，搭配莉莉艾的皮皮ex、胖嘟嘟ex、超級蒂安希ex靈活輪換，以「超級交響樂」席捲全場！',
    cardEntries: [
      { name: '莉莉艾的皮皮ex', count: 1 },
      { name: '拉魯拉絲', count: 4 },
      { name: '奇魯莉安', count: 2 },
      { name: '超級沙奈朵ex', count: 2 },
      { name: '拉帝亞斯ex', count: 1 },
      { name: '輕飄飄', count: 2 },
      { name: '胖嘟嘟ex', count: 1 },
      { name: '超級蒂安希ex', count: 1 },
      { name: '米立龍', count: 1 },
      { name: '喵喵ex', count: 1 },
      { name: '特殊紅牌', count: 1 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 3 },
      { name: '寶可平板', count: 4 },
      { name: '夜間擔架', count: 1 },
      { name: '奇跡修正檔', count: 4 },
      { name: '英雄斗篷', count: 1 },
      { name: '氣球', count: 2 },
      { name: '艾莉絲的鬥志', count: 3 },
      { name: '鬥子', count: 2 },
      { name: '老大的指令', count: 2 },
      { name: '莉莉艾的決意', count: 4 },
      { name: '感應超能量', count: 4 },
      { name: '基本超能量', count: 9 }
    ]
  },
  {
    id: 'deck_3',
    name: '超級巨牙鯊ex 飢渴惡潮牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '官方超級進化戰術牌組！由利牙魚進化為超級巨牙鯊ex（HP 330），搭配顫弦蠑螈「惡魔奏樂」與願增猿「腎上腺腦力」控傷附能，以「飢渴下巴」狂咬 270 點高傷！',
    cardEntries: [
      { name: '願增猿', count: 2 },
      { name: '利牙魚', count: 4 },
      { name: '超級巨牙鯊ex', count: 3 },
      { name: '飯匙蛇', count: 2 },
      { name: '毒電嬰', count: 3 },
      { name: '顫弦蠑螈', count: 3 },
      { name: '吉雉雞ex', count: 1 },
      { name: '桃歹郎ex', count: 1 },
      { name: '特殊紅牌', count: 1 },
      { name: '好友寶芬', count: 4 },
      { name: '高級球', count: 4 },
      { name: '頂尖捕捉器', count: 1 },
      { name: '寶可平板', count: 4 },
      { name: '夜間擔架', count: 1 },
      { name: '龐克頭盔', count: 2 },
      { name: '氣球', count: 2 },
      { name: '艾莉絲的鬥志', count: 2 },
      { name: '鬥子', count: 2 },
      { name: '老大的指令', count: 2 },
      { name: '莉莉艾的決意', count: 4 },
      { name: '基本惡能量', count: 12 }
    ]
  },
  {
    id: 'deck_4',
    name: '超級快龍ex 天空搬運龍牌組',
    author: '系統預設',
    authorPhone: '0988229731',
    description: '官方超級進化戰術牌組！由迷你龍→哈克龍進化為超級快龍ex（HP 370），搭配麻麻鰻「電氣發電機」與特性「天空搬運」靈活調度，使出「龍之滑翔」打出 330 點毀滅傷害！',
    cardEntries: [
      { name: '凱路迪歐ex', count: 1 },
      { name: '電飛鼠', count: 1 },
      { name: '麻麻小魚', count: 3 },
      { name: '麻麻鰻', count: 3 },
      { name: '捷拉奧拉', count: 1 },
      { name: '迷你龍', count: 4 },
      { name: '哈克龍', count: 3 },
      { name: '超級快龍ex', count: 2 },
      { name: '米立龍', count: 1 },
      { name: '喵喵ex', count: 1 },
      { name: '超級袋獸ex', count: 1 },
      { name: '特殊紅牌', count: 1 },
      { name: '好友寶芬', count: 2 },
      { name: '高級球', count: 4 },
      { name: '神奇糖果', count: 2 },
      { name: '寶可平板', count: 4 },
      { name: '氣球', count: 2 },
      { name: '極限腰帶', count: 1 },
      { name: '艾莉絲的鬥志', count: 2 },
      { name: '空手道王的演練', count: 1 },
      { name: '琵魯', count: 2 },
      { name: '老大的指令', count: 2 },
      { name: '莉莉艾的決意', count: 4 },
      { name: '基本水能量', count: 5 },
      { name: '基本電能量', count: 7 }
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
