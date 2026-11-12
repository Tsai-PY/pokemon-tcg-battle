// lib/cardDb.js
// Comprehensive PTCG Card Database & Intelligent Card Recognizer

const CARD_DATABASE = [
  // ================= 噴火龍 / 火屬性 =================
  {
    id: 'charizard_ex',
    name: '噴火龍ex',
    supertype: 'pokemon',
    subtypes: ['Stage 2', 'ex'],
    hp: 330,
    types: ['Darkness'], // 惡太晶噴火龍ex (經典賽場配置)
    evolvesFrom: '火恐龍',
    isEx: true,
    ability: {
      name: '煉獄支配',
      text: '在自己的回合中，從手牌使出這張卡並進化時可使用1次。從自己的牌庫選擇最多3張「基本火能量」卡，以任意方式附於自己的寶可夢身上。重洗牌庫。'
    },
    attacks: [
      {
        name: '狂暴燃燒',
        cost: ['Fire', 'Fire'],
        damage: 180,
        text: '增加對手已經獲得的獎賞卡張數×30點傷害。'
      }
    ],
    weakness: { type: 'Grass', value: 'x2' },
    resistance: null,
    retreatCost: 2,
    rarity: 'Double Rare'
  },
  {
    id: 'charmander',
    name: '小火龍',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 70,
    types: ['Fire'],
    attacks: [
      {
        name: '火苗',
        cost: ['Fire'],
        damage: 10,
        text: ''
      },
      {
        name: '爪擊',
        cost: ['Colorless', 'Colorless'],
        damage: 20,
        text: ''
      }
    ],
    weakness: { type: 'Water', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'charmeleon',
    name: '火恐龍',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 90,
    types: ['Fire'],
    evolvesFrom: '小火龍',
    attacks: [
      {
        name: '火焰爪',
        cost: ['Fire', 'Fire'],
        damage: 50,
        text: ''
      }
    ],
    weakness: { type: 'Water', value: 'x2' },
    resistance: null,
    retreatCost: 2
  },
  {
    id: 'pidgeot_ex',
    name: '大比鳥ex',
    supertype: 'pokemon',
    subtypes: ['Stage 2', 'ex'],
    hp: 280,
    types: ['Colorless'],
    evolvesFrom: '比比鳥',
    isEx: true,
    ability: {
      name: '快速搜尋',
      text: '在自己的回合中可使用1次。從自己的牌庫任意選擇1張卡加入手牌。重洗牌庫。'
    },
    attacks: [
      {
        name: '吹飛',
        cost: ['Colorless', 'Colorless'],
        damage: 120,
        text: '若希望，可將場上的競技場卡丟棄。'
      }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 0
  },
  {
    id: 'pidgey',
    name: '波波',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 60,
    types: ['Colorless'],
    attacks: [
      {
        name: '呼朋引伴',
        cost: ['Colorless'],
        damage: 0,
        text: '從自己的牌庫選擇最多1隻「基礎寶可夢」放置於備戰區。'
      }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'pidgeotto',
    name: '比比鳥',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 80,
    types: ['Colorless'],
    evolvesFrom: '波波',
    attacks: [
      {
        name: '翅膀攻擊',
        cost: ['Colorless', 'Colorless'],
        damage: 40,
        text: ''
      }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },

  // ================= 皮卡丘 / 電屬性 =================
  {
    id: 'pikachu_ex',
    name: '皮卡丘ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 200,
    types: ['Lightning'],
    isEx: true,
    ability: {
      name: '頑強韌性',
      text: '當這隻寶可夢受到招式的傷害而氣絕時，若剩餘HP全滿，擲1次硬幣，若為正面，則這隻寶可夢不會氣絕，剩餘HP變為10。'
    },
    attacks: [
      {
        name: '黃玉伏特',
        cost: ['Grass', 'Lightning', 'Metal'],
        damage: 300,
        text: '將這隻寶可夢身上的所有能量卡丟棄。'
      },
      {
        name: '電光一閃',
        cost: ['Lightning'],
        damage: 30,
        text: ''
      }
    ],
    weakness: { type: 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'pikachu',
    name: '皮卡丘',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 70,
    types: ['Lightning'],
    attacks: [
      {
        name: '蓄電',
        cost: ['Lightning'],
        damage: 0,
        text: '從自己的牌庫選擇1張「基本電能量」附於這隻寶可夢身上。'
      },
      {
        name: '十萬伏特',
        cost: ['Lightning', 'Lightning', 'Colorless'],
        damage: 80,
        text: ''
      }
    ],
    weakness: { type: 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'raichu',
    name: '雷丘',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 120,
    types: ['Lightning'],
    evolvesFrom: '皮卡丘',
    attacks: [
      {
        name: '伏特攻擊',
        cost: ['Lightning', 'Colorless'],
        damage: 50,
        text: ''
      },
      {
        name: '百萬伏特雷轟',
        cost: ['Lightning', 'Lightning', 'Colorless'],
        damage: 130,
        text: ''
      }
    ],
    weakness: { type: 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'miraidon_ex',
    name: '密勒頓ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 220,
    types: ['Lightning'],
    isEx: true,
    ability: {
      name: '串聯驅動',
      text: '在自己的回合中可使用1次。從自己的牌庫選擇最多2隻雷屬性的「基礎寶可夢」放置於備戰區。'
    },
    attacks: [
      {
        name: '光子雷射',
        cost: ['Lightning', 'Lightning', 'Colorless'],
        damage: 220,
        text: '在下個自己的回合，這隻寶可夢無法使出招式。'
      }
    ],
    weakness: { type: 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'iron_hands_ex',
    name: '鐵臂膀ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 230,
    types: ['Lightning'],
    isEx: true,
    attacks: [
      {
        name: '手臂推擠',
        cost: ['Lightning', 'Lightning', 'Colorless'],
        damage: 120,
        text: ''
      },
      {
        name: '感謝增幅',
        cost: ['Lightning', 'Colorless', 'Colorless', 'Colorless'],
        damage: 120,
        text: '若對手的寶可夢因這個招式的傷害而氣絕，則多拿1張獎賞卡。'
      }
    ],
    weakness: { type: 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: 4
  },

  // ================= 帕歐 / 水屬性 =================
  {
    id: 'chien_pao_ex',
    name: '古劍豹ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 220,
    types: ['Water'],
    isEx: true,
    ability: {
      name: '顫慄之寒',
      text: '若這隻寶可夢在戰鬥場上，在自己的回合中可使用1次。從自己的牌庫選擇最多2張「基本水能量」卡加入手牌。'
    },
    attacks: [
      {
        name: '冰霜劍刃',
        cost: ['Water', 'Water'],
        damage: 60,
        text: '將這隻寶可夢身上的任意張數水能量丟棄，造成丟棄張數×60點傷害。'
      }
    ],
    weakness: { type: 'Metal', value: 'x2' },
    resistance: null,
    retreatCost: 2
  },
  {
    id: 'frigibax',
    name: '涼脊龍',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 70,
    types: ['Water'],
    attacks: [
      {
        name: '撞擊',
        cost: ['Water'],
        damage: 10,
        text: ''
      }
    ],
    weakness: { type: 'Metal', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'arctibax',
    name: '凍脊龍',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 90,
    types: ['Water'],
    evolvesFrom: '涼脊龍',
    attacks: [
      {
        name: '冰息',
        cost: ['Water', 'Colorless'],
        damage: 40,
        text: ''
      }
    ],
    weakness: { type: 'Metal', value: 'x2' },
    resistance: null,
    retreatCost: 2
  },
  {
    id: 'baxcalibur',
    name: '戟脊龍',
    supertype: 'pokemon',
    subtypes: ['Stage 2'],
    hp: 160,
    types: ['Water'],
    evolvesFrom: '凍脊龍',
    ability: {
      name: '極低溫',
      text: '在自己的回合中，不限次數可使用。從自己的手牌選擇1張「基本水能量」卡，附於自己的寶可夢身上。'
    },
    attacks: [
      {
        name: '破壞光線',
        cost: ['Water', 'Water', 'Colorless'],
        damage: 130,
        text: ''
      }
    ],
    weakness: { type: 'Metal', value: 'x2' },
    resistance: null,
    retreatCost: 2
  },
  {
    id: 'radiant_greninja',
    name: '光輝甲賀忍蛙',
    supertype: 'pokemon',
    subtypes: ['Basic', 'Radiant'],
    hp: 130,
    types: ['Water'],
    ability: {
      name: '隱密手牌',
      text: '在自己的回合中，從手牌丟棄1張能量卡即可使用1次。從自己的牌庫抽2張卡。'
    },
    attacks: [
      {
        name: '月光手裏劍',
        cost: ['Water', 'Water', 'Colorless'],
        damage: 90,
        text: '將這隻寶可夢身上的2個能量丟棄，對手的2隻寶可夢各受到90點傷害。'
      }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },

  // ================= 轟鳴月 / 惡屬性 =================
  {
    id: 'roaring_moon_ex',
    name: '轟鳴月ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 230,
    types: ['Darkness'],
    isEx: true,
    attacks: [
      {
        name: '狂暴粉碎',
        cost: ['Darkness', 'Darkness', 'Colorless'],
        damage: 999, // 昏厥效果
        text: '將對手的戰鬥寶可夢氣絕。這隻寶可夢受到200點傷害。'
      },
      {
        name: '災禍旋風',
        cost: ['Darkness', 'Darkness', 'Colorless'],
        damage: 100,
        text: '若丟棄場上的競技場卡，則增加120點傷害。'
      }
    ],
    weakness: { type: 'Grass', value: 'x2' },
    resistance: null,
    retreatCost: 2
  },

  // ================= 多龍巴魯托 / 龍屬性 =================
  {
    id: 'dragapult_ex',
    name: '多龍巴魯托ex',
    supertype: 'pokemon',
    subtypes: ['Stage 2', 'ex'],
    hp: 320,
    types: ['Dragon'],
    evolvesFrom: '多龍奇',
    isEx: true,
    attacks: [
      {
        name: '幻影奇襲',
        cost: ['Fire', 'Psychic'],
        damage: 200,
        text: '在對手的備戰寶可夢身上放置6個傷害指示物。'
      }
    ],
    weakness: null,
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'dreepy',
    name: '多龍梅西亞',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 70,
    types: ['Psychic'],
    attacks: [
      { name: '撞擊', cost: ['Psychic'], damage: 10, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'drakloak',
    name: '多龍奇',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 90,
    types: ['Dragon'],
    evolvesFrom: '多龍梅西亞',
    attacks: [
      { name: '龍之脈衝', cost: ['Fire', 'Psychic'], damage: 70, text: '' }
    ],
    weakness: null,
    resistance: null,
    retreatCost: 1
  },

  // ================= 沙奈朵 / 超屬性 =================
  {
    id: 'gardevoir_ex',
    name: '沙奈朵ex',
    supertype: 'pokemon',
    subtypes: ['Stage 2', 'ex'],
    hp: 310,
    types: ['Psychic'],
    evolvesFrom: '奇魯莉安',
    isEx: true,
    ability: {
      name: '精神擁抱',
      text: '在自己的回合中，不限次數可使用。從自己的棄牌區選擇1張「基本超能量」卡，附於自己的超寶可夢身上。'
    },
    attacks: [
      {
        name: '奇蹟之力',
        cost: ['Psychic', 'Psychic', 'Colorless'],
        damage: 190,
        text: '消除這隻寶可夢身上的所有特殊狀態。'
      }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 2
  },
  {
    id: 'ralts',
    name: '拉魯拉絲',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 70,
    types: ['Psychic'],
    attacks: [
      { name: '念力', cost: ['Psychic'], damage: 10, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'kirlia',
    name: '奇魯莉安',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 90,
    types: ['Psychic'],
    evolvesFrom: '拉魯拉絲',
    attacks: [
      { name: '精神強念', cost: ['Psychic', 'Colorless'], damage: 30, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'scream_tail',
    name: '吼叫尾',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 90,
    types: ['Psychic'],
    attacks: [
      { name: '狂暴歡叫', cost: ['Psychic', 'Colorless'], damage: 100, text: '對手備戰1隻受到傷害。' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },

  // ================= 洛奇亞 / 無色 =================
  {
    id: 'lugia_vstar',
    name: '洛奇亞VSTAR',
    supertype: 'pokemon',
    subtypes: ['VSTAR', 'ex'],
    hp: 280,
    types: ['Colorless'],
    evolvesFrom: '洛奇亞V',
    isEx: true,
    ability: {
      name: '召集之星',
      text: '在自己的回合中可使用1次。從自己的棄牌區選擇最多2隻無色寶可夢，放置於備戰區。'
    },
    attacks: [
      {
        name: '暴風雨潛水',
        cost: ['Colorless', 'Colorless', 'Colorless', 'Colorless'],
        damage: 220,
        text: '若希望，可將場上的競技場卡丟棄。'
      }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 2
  },
  {
    id: 'lugia_v',
    name: '洛奇亞V',
    supertype: 'pokemon',
    subtypes: ['Basic', 'V'],
    hp: 220,
    types: ['Colorless'],
    isEx: true,
    attacks: [
      { name: '烈風', cost: ['Colorless'], damage: 40, text: '' },
      { name: '氣旋俯衝', cost: ['Colorless', 'Colorless', 'Colorless'], damage: 130, text: '' }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 2
  },
  {
    id: 'archeops',
    name: '始祖大鳥',
    supertype: 'pokemon',
    subtypes: ['Stage 2'],
    hp: 150,
    types: ['Colorless'],
    attacks: [
      { name: '疾速之翼', cost: ['Colorless', 'Colorless', 'Colorless'], damage: 120, text: '' }
    ],
    weakness: { type: 'Lightning', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'snorlax',
    name: '卡比獸',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 150,
    types: ['Colorless'],
    attacks: [
      { name: '重壓', cost: ['Colorless', 'Colorless', 'Colorless'], damage: 80, text: '' }
    ],
    weakness: { type: 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: 4
  },

  // ================= 厄鬼椪 & 草屬性 =================
  {
    id: 'ogerpon_ex',
    name: '厄鬼椪ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 210,
    types: ['Grass'],
    isEx: true,
    ability: {
      name: '碧之假面',
      text: '在自己的回合中可使用1次。從手牌附1張基本草能量並抽1張卡。'
    },
    attacks: [
      {
        name: '草葉迴旋',
        cost: ['Grass', 'Grass', 'Grass'],
        damage: 140,
        text: '增加雙方戰鬥寶可夢身上附加能量×20點傷害。'
      }
    ],
    weakness: { type: 'Fire', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'meowscarada_ex',
    name: '魔幻假面喵ex',
    supertype: 'pokemon',
    subtypes: ['Stage 2', 'ex'],
    hp: 310,
    types: ['Grass'],
    evolvesFrom: '蒂蕾喵',
    isEx: true,
    attacks: [
      {
        name: '花漾炸彈',
        cost: ['Colorless', 'Colorless'],
        damage: 100,
        text: '對手備戰寶可夢若已有傷害，額外造成120點傷害。'
      }
    ],
    weakness: { type: 'Fire', value: 'x2' },
    resistance: null,
    retreatCost: 2
  },
  {
    id: 'sprigatito',
    name: '新葉喵',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 70,
    types: ['Grass'],
    attacks: [
      { name: '樹葉', cost: ['Grass'], damage: 10, text: '' }
    ],
    weakness: { type: 'Fire', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },
  {
    id: 'floragato',
    name: '蒂蕾喵',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 90,
    types: ['Grass'],
    evolvesFrom: '新葉喵',
    attacks: [
      { name: '飛葉快刀', cost: ['Grass', 'Colorless'], damage: 40, text: '' }
    ],
    weakness: { type: 'Fire', value: 'x2' },
    resistance: null,
    retreatCost: 1
  },

  // ================= 超夢 & 超能 =================
  {
    id: 'mewtwo_ex',
    name: '超夢ex',
    supertype: 'pokemon',
    subtypes: ['Basic', 'ex'],
    hp: 220,
    types: ['Psychic'],
    isEx: true,
    attacks: [
      {
        name: '超能脈衝',
        cost: ['Psychic', 'Psychic', 'Colorless'],
        damage: 200,
        text: '將這隻寶可夢身上的2張超能量卡丟棄。'
      }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 2
  },
  {
    id: 'natu',
    name: '天然雀',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 50,
    types: ['Psychic'],
    attacks: [
      { name: '啄', cost: ['Psychic'], damage: 10, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'xatu',
    name: '天然鳥',
    supertype: 'pokemon',
    subtypes: ['Stage 1'],
    hp: 100,
    types: ['Psychic'],
    evolvesFrom: '天然雀',
    ability: {
      name: '神清氣爽',
      text: '在自己的回合中可使用1次。從手牌附1張基本超能量並抽2張卡。'
    },
    attacks: [
      { name: '超能球', cost: ['Psychic', 'Colorless'], damage: 60, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'gengar',
    name: '耿鬼',
    supertype: 'pokemon',
    subtypes: ['Stage 2'],
    hp: 130,
    types: ['Psychic'],
    attacks: [
      { name: '暗影球', cost: ['Psychic', 'Colorless'], damage: 90, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'radiant_alakazam',
    name: '光輝胡地',
    supertype: 'pokemon',
    subtypes: ['Basic', 'Radiant'],
    hp: 130,
    types: ['Psychic'],
    attacks: [
      { name: '念力轉移', cost: ['Psychic', 'Colorless'], damage: 60, text: '' }
    ],
    weakness: { type: 'Darkness', value: 'x2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },

  // ================= 支援者卡 (Supporter) =================
  {
    id: 'professors_research',
    name: '博士的研究',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'discard_hand_draw_7',
    text: '將自己的手牌全部丟棄，從牌庫抽7張卡。'
  },
  {
    id: 'boss_orders',
    name: '老大的指令',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'boss_orders_switch',
    text: '選擇對手的1隻備戰寶可夢，與戰鬥寶可夢互換。'
  },
  {
    id: 'iono',
    name: '奇樹',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'iono_shuffle_hand',
    text: '雙方玩家各自將手牌重洗並放回牌庫下方。之後，各自從牌庫抽與自己剩餘獎賞卡張數相同張數的卡。'
  },
  {
    id: 'arven',
    name: '派帕',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'arven_search_item_tool',
    text: '從自己的牌庫選擇最多1張物品卡與最多1張寶可夢道具卡，加入手牌。重洗牌庫。'
  },

  // ================= 物品卡 (Item) =================
  {
    id: 'nest_ball',
    name: '巢穴球',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'search_basic_bench',
    text: '從自己的牌庫選擇1隻「基礎寶可夢」放置於備戰區。重洗牌庫。'
  },
  {
    id: 'ultra_ball',
    name: '高級球',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'ultra_ball_search',
    text: '這張卡必須將自己的2張手牌丟棄才可使用。從自己的牌庫選擇1隻任意寶可夢加入手牌。重洗牌庫。'
  },
  {
    id: 'rare_candy',
    name: '神奇糖果',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'rare_candy_evolve',
    text: '從自己的手牌選擇1張二階進化卡，放置於場上符合條件的基礎寶可夢身上進行進化。'
  },
  {
    id: 'switch_card',
    name: '寶可夢交替',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'switch_active_bench',
    text: '將自己的戰鬥寶可夢與備戰寶可夢互換。'
  },
  {
    id: 'super_rod',
    name: '超級能量回收棒',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'super_rod_recovery',
    text: '從自己的棄牌區選擇寶可夢卡與基本能量卡合計最多3張，重洗回牌庫。'
  },
  {
    id: 'earthen_vessel',
    name: '大地之器',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'earthen_vessel_search_energy',
    text: '這張卡必須將自己的1張手牌丟棄才可使用。從自己的牌庫選擇最多2張基本能量卡加入手牌。'
  },
  {
    id: 'potion',
    name: '傷藥',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'heal_30',
    text: '選擇自己的1隻寶可夢，恢復其30點HP。'
  },
  {
    id: 'counter_catcher',
    name: '反擊捕獲器',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'counter_catcher_switch',
    text: '只有在自己的剩餘獎賞卡張數比對手多時才可使用。選擇對手的1隻備戰寶可夢，與戰鬥寶可夢互換。'
  },

  // ================= 道具卡 (Pokemon Tool) =================
  {
    id: 'bravery_charm',
    name: '勇氣護符',
    supertype: 'trainer',
    subtypes: ['Tool'],
    effect: 'hp_boost_50',
    text: '附有這張卡的基礎寶可夢的最大HP增加50。'
  },

  // ================= ACE SPEC (王牌卡 - 每牌庫限1張) =================
  {
    id: 'prime_catcher',
    name: '至尊捕捉器',
    supertype: 'trainer',
    subtypes: ['Item', 'ACE SPEC'],
    isAceSpec: true,
    effect: 'prime_catcher_double_switch',
    text: '【ACE SPEC】選擇對手的1隻備戰寶可夢與戰鬥寶可夢互換。之後，將自己的戰鬥寶可夢與備戰寶可夢互換。'
  },

  // ================= 基本能量卡 (Basic Energy - 無4張限制) =================
  {
    id: 'fire_energy',
    name: '基本火能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Fire'
  },
  {
    id: 'water_energy',
    name: '基本水能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Water'
  },
  {
    id: 'lightning_energy',
    name: '基本電能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Lightning'
  },
  {
    id: 'grass_energy',
    name: '基本草能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Grass'
  },
  {
    id: 'psychic_energy',
    name: '基本超能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Psychic'
  },
  {
    id: 'fighting_energy',
    name: '基本鬥能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Fighting'
  },
  {
    id: 'darkness_energy',
    name: '基本惡能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Darkness'
  },
  {
    id: 'metal_energy',
    name: '基本鋼能量',
    supertype: 'energy',
    subtypes: ['Basic Energy'],
    energyType: 'Metal'
  },
  {
    id: 'amulet_of_hope',
    name: '希望護身符',
    supertype: 'trainer',
    subtypes: ['Tool', 'ACE SPEC'],
    isAceSpec: true,
    effect: 'amulet_of_hope_search',
    text: '【ACE SPEC】附有這張卡的寶可夢，受到對手的寶可夢招式的傷害而【昏厥】時，從自己的牌庫任意選擇最多3張卡加入手牌。重洗牌庫。'
  },
  {
    id: 'team_rockets_chingling',
    name: '火箭隊的鈴鐺響',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 30,
    types: ['Psychic'],
    attacks: [
      {
        name: '鈴鈴吵鬧',
        cost: ['Colorless'],
        damage: 0,
        text: '在不看正面的情況下，從對手的手牌選擇1張，將其丟棄。'
      }
    ],
    weakness: { type: 'Darkness', value: '×2' },
    resistance: { type: 'Fighting', value: '-30' },
    retreatCost: 1
  },
  {
    id: 'pokemon_switch_alt',
    name: '寶可夢交換',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'switch_active_bench',
    text: '將自己的戰鬥寶可夢與備戰寶可夢互換。'
  },
  {
    id: 'sacred_ash',
    name: '聖灰',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'sacred_ash_recycle',
    text: '從自己的棄牌區選擇最多5張寶可夢卡，給對手看過後放回牌庫並重洗。'
  },
  {
    id: 'wallace',
    name: '米可利',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'wallace_draw',
    text: '從自己的牌庫抽3張卡。若自己的戰鬥寶可夢為水屬性，則改為抽4張卡。'
  },
  {
    id: 'lillies_determination',
    name: '莉莉艾的決意',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'lillie_determination_draw',
    text: '將自己的手牌全部放回牌庫並重洗。然後，從牌庫抽出6張卡。若自己剩餘獎賞卡的張數為6張，則改為抽出8張卡。'
  },
  {
    id: 'super_rod_alt',
    name: '厲害釣竿',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'super_rod_recovery',
    text: '從自己的棄牌區選擇寶可夢卡與基本能量卡合計最多3張，在給對手看過後放回牌庫並重洗。'
  },
  {
    id: 'tm_evolution',
    name: '招式學習演進',
    supertype: 'trainer',
    subtypes: ['Tool'],
    effect: 'tm_evolution_attach',
    text: '附有這張卡的寶可夢可以使用招式【演進】（無色能量）：從牌庫選擇最多2隻備戰寶可夢各自進化。在自己的回合結束時丟棄此卡。'
  },
  {
    id: 'snorunt',
    name: '雪童子',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 60,
    types: ['Water'],
    attacks: [
      {
        name: '驚嚇',
        cost: ['Water'],
        damage: 20,
        text: '在不看正面的情況下，從對手手牌隨機選1張查看後洗回對手牌庫。'
      }
    ],
    weakness: { type: 'Metal', value: '×2' },
    retreatCost: 1
  },
  {
    id: 'jet_energy',
    name: '噴射能量',
    supertype: 'energy',
    subtypes: ['Special Energy'],
    energyType: 'Colorless',
    text: '提供1個無色能量。當從手牌附於「備戰寶可夢」身上時，將該備戰寶可夢與戰鬥場寶可夢互換。'
  },
  {
    id: 'suicune_v',
    name: '水君V',
    supertype: 'pokemon',
    subtypes: ['Basic', 'V'],
    hp: 210,
    types: ['Water'],
    ability: {
      name: '瞬步',
      text: '若這隻寶可夢在戰鬥場上，在自己的回合可使用1次。從自己的牌庫抽1張卡。'
    },
    attacks: [
      {
        name: '暴雪迴旋曲',
        cost: ['Water', 'Colorless'],
        damage: 20,
        text: '增加雙方備戰寶可夢的數量×20點傷害。'
      }
    ],
    weakness: { type: 'Lightning', value: '×2' },
    retreatCost: 2
  },
  {
    id: 'judge',
    name: '裁判',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'judge_both_draw_4',
    text: '雙方玩家各自將手牌全部洗回牌庫。接著，雙方玩家各自從牌庫抽出4張卡。'
  },
  {
    id: 'poke_tablet',
    name: '寶可夢平板',
    supertype: 'trainer',
    subtypes: ['Item'],
    effect: 'poke_tablet_search',
    text: '從自己的牌庫選擇1張「非規則寶可夢」（非ex、非V）加入手牌，重洗牌庫。'
  },
  {
    id: 'dachsbun_ex',
    name: '麻花犬EX',
    supertype: 'pokemon',
    subtypes: ['Stage 1', 'ex'],
    evolvesFrom: '狗仔包',
    hp: 250,
    types: ['Psychic'],
    ability: {
      name: '飽腹時間',
      text: '從手牌進化登場時可使用1次。將自己所有進化寶可夢的HP完全恢復，並將恢復寶可夢身上的能量全部丟棄。'
    },
    attacks: [
      {
        name: '奇跡閃耀',
        cost: ['Colorless', 'Colorless'],
        damage: 130,
        text: '使對手的戰鬥寶可夢陷入混亂狀態。'
      }
    ],
    weakness: { type: 'Metal', value: '×2' },
    retreatCost: 1
  },
  {
    id: 'dachsbun_ex_lower',
    name: '麻花犬ex',
    supertype: 'pokemon',
    subtypes: ['Stage 1', 'ex'],
    evolvesFrom: '狗仔包',
    hp: 250,
    types: ['Psychic'],
    ability: {
      name: '飽腹時間',
      text: '從手牌進化登場時可使用1次。將自己所有進化寶可夢的HP完全恢復，並將恢復寶可夢身上的能量全部丟棄。'
    },
    attacks: [
      {
        name: '奇跡閃耀',
        cost: ['Colorless', 'Colorless'],
        damage: 130,
        text: '使對手的戰鬥寶可夢陷入混亂狀態。'
      }
    ],
    weakness: { type: 'Metal', value: '×2' },
    retreatCost: 1
  },
  {
    id: 'fidough',
    name: '狗仔包',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 60,
    types: ['Psychic'],
    attacks: [
      {
        name: '香味',
        cost: ['Psychic'],
        damage: 0,
        text: '從自己的牌庫選擇1張基礎寶可夢卡放置於備戰區，重洗牌庫。'
      }
    ],
    weakness: { type: 'Metal', value: '×2' },
    retreatCost: 1
  },
  {
    id: 'team_rockets_mimikyu',
    name: '火箭隊的謎擬Q',
    supertype: 'pokemon',
    subtypes: ['Basic'],
    hp: 60,
    types: ['Psychic'],
    attacks: [
      {
        name: '扮晶晶酒',
        cost: ['Psychic', 'Colorless'],
        damage: 30,
        text: '選擇對手戰鬥場上太晶寶可夢的1個招式，作為這個招式使用。'
      }
    ],
    weakness: { type: 'Metal', value: '×2' },
    retreatCost: 1
  },
  {
    id: 'fennel',
    name: '真菰',
    supertype: 'trainer',
    subtypes: ['Supporter'],
    effect: 'fennel_heal_all_40',
    text: '將自己的所有寶可夢各恢復40點HP。'
  },
  {
    id: 'mega_froslass_ex',
    name: '超級雪妖女ex',
    supertype: 'pokemon',
    subtypes: ['Stage 1', 'ex'],
    evolvesFrom: '雪童子',
    hp: 310,
    types: ['Water'],
    attacks: [
      {
        name: '怨言',
        cost: ['Water', 'Colorless'],
        damage: 50,
        text: '造成對手手牌張數×50點傷害。'
      },
      {
        name: '純粹雪',
        cost: ['Water', 'Water', 'Colorless'],
        damage: 150,
        text: '使對手的戰鬥寶可夢陷入睡眠狀態。'
      }
    ],
    weakness: { type: 'Metal', value: '×2' },
    retreatCost: 1
  }
];

// Helper: Normalize name for matching
function normalizeCardName(name) {
  if (!name) return '';
  return name
    .trim()
    .replace(/[（\(].*?[）\)]/g, '') // remove parenthesized set info
    .replace(/\s+/g, ' ')
    .trim();
}

// Find card in static DB
function findCardByName(rawName) {
  if (!rawName) return null;
  const clean = normalizeCardName(rawName);
  const norm = clean.toLowerCase();
  const stripped = norm.replace(/[\s\-_]/g, '');

  // 1. Exact match on clean, lowercase, or stripped
  const match = CARD_DATABASE.find(c => {
    const cNorm = c.name.toLowerCase();
    const cStripped = cNorm.replace(/[\s\-_]/g, '');
    return cNorm === norm || cStripped === stripped || c.id === norm || c.id === stripped;
  });
  if (match) return JSON.parse(JSON.stringify(match));

  // 2. Comprehensive bilingual alias map (all keys stripped of spaces & dashes)
  const aliasMap = {
    // Lugia line (Slot 8)
    'lugiavstar': '洛奇亞VSTAR',
    '洛奇亞vstar': '洛奇亞VSTAR',
    '白銀狂風洛奇亞': '洛奇亞VSTAR',
    'lugiav': '洛奇亞V',
    '洛奇亞v': '洛奇亞V',
    'lugia': '洛奇亞V',
    '洛奇亞': '洛奇亞V',
    'archeops': '始祖大鳥',
    '始祖大鳥': '始祖大鳥',
    'snorlax': '卡比獸',
    '卡比獸': '卡比獸',

    // Charizard line (Slot 1)
    'charizardex': '噴火龍ex',
    '噴火龍ex': '噴火龍ex',
    '惡太晶噴火龍': '噴火龍ex',
    '噴火龍': '噴火龍ex',
    'charizard': '噴火龍ex',
    'charmeleon': '火恐龍',
    '火恐龍': '火恐龍',
    'charmander': '小火龍',
    '小火龍': '小火龍',
    '小恐龍': '小火龍',

    // Pidgeot line
    'pidgeotex': '大比鳥ex',
    '大比鳥ex': '大比鳥ex',
    '大比鳥': '大比鳥ex',
    'pidgeot': '大比鳥ex',
    'pidgeotto': '比比鳥',
    '比比鳥': '比比鳥',
    'pidgey': '波波',
    '波波': '波波',

    // Pikachu / Miraidon line (Slot 2 & 5)
    'pikachuex': '皮卡丘ex',
    '皮卡丘ex': '皮卡丘ex',
    'pikachu': '皮卡丘',
    '皮卡丘': '皮卡丘',
    'raichu': '雷丘',
    '雷丘': '雷丘',
    'miraidonex': '密勒頓ex',
    '密勒頓ex': '密勒頓ex',
    'miraidon': '密勒頓ex',
    '密勒頓': '密勒頓ex',
    'ironhandsex': '鐵臂膀ex',
    'ironhands': '鐵臂膀ex',
    '鐵臂膀ex': '鐵臂膀ex',
    '鐵臂膀': '鐵臂膀ex',

    // Chien-Pao / Water line (Slot 3)
    'chienpaoex': '古劍豹ex',
    'chienpao': '古劍豹ex',
    '古劍豹ex': '古劍豹ex',
    '古劍豹': '古劍豹ex',
    'frigibax': '涼脊龍',
    '涼脊龍': '涼脊龍',
    'arctibax': '凍脊龍',
    '凍脊龍': '凍脊龍',
    'baxcalibur': '戟脊龍',
    '戟脊龍': '戟脊龍',
    'radiantgreninja': '光輝甲賀忍蛙',
    'greninja': '光輝甲賀忍蛙',
    '光輝甲賀忍蛙': '光輝甲賀忍蛙',
    '甲賀忍蛙': '光輝甲賀忍蛙',
    '忍蛙': '光輝甲賀忍蛙',
    'suicunev': '水君V',
    'suicune': '水君V',
    '水君v': '水君V',
    '水君': '水君V',
    'snorunt': '雪童子',
    '雪童子': '雪童子',
    'megafroslassex': '超級雪妖女ex',
    'froslassex': '超級雪妖女ex',
    '超級雪妖女ex': '超級雪妖女ex',
    '雪妖女': '超級雪妖女ex',

    // Roaring Moon / Darkness line (Slot 4)
    'roaringmoonex': '轟鳴月ex',
    'roaringmoon': '轟鳴月ex',
    '轟鳴月ex': '轟鳴月ex',
    '轟鳴月': '轟鳴月ex',

    // Dragapult / Dragon line (Slot 6)
    'dragapultex': '多龍巴魯托ex',
    'dragapult': '多龍巴魯托ex',
    '多龍巴魯托ex': '多龍巴魯托ex',
    '多龍巴魯托': '多龍巴魯托ex',
    '多龍': '多龍巴魯托ex',
    'drakloak': '多龍奇',
    '多龍奇': '多龍奇',
    'dreepy': '多龍梅西亞',
    '多龍梅西亞': '多龍梅西亞',

    // Gardevoir / Psychic line (Slot 7 & 10)
    'gardevoirex': '沙奈朵ex',
    'gardevoir': '沙奈朵ex',
    '沙奈朵ex': '沙奈朵ex',
    '沙奈朵': '沙奈朵ex',
    'kirlia': '奇魯莉安',
    '奇魯莉安': '奇魯莉安',
    'ralts': '拉魯拉絲',
    '拉魯拉絲': '拉魯拉絲',
    'screamtail': '吼叫尾',
    '吼叫尾': '吼叫尾',
    'alakazam': '光輝胡地',
    'radiantalakazam': '光輝胡地',
    '光輝胡地': '光輝胡地',
    '胡地': '光輝胡地',
    'mewtwoex': '超夢ex',
    'mewtwo': '超夢ex',
    '超夢ex': '超夢ex',
    '超夢': '超夢ex',
    'xatu': '天然鳥',
    '天然鳥': '天然鳥',
    'natu': '天然雀',
    '天然雀': '天然雀',
    'gengar': '耿鬼',
    '耿鬼': '耿鬼',
    'mimikyu': '火箭隊的謎擬Q',
    '謎擬q': '火箭隊的謎擬Q',
    'chimecho': '火箭隊的鈴鐺響',
    '鈴鐺響': '火箭隊的鈴鐺響',
    'fidough': '狗仔包',
    '狗仔包': '狗仔包',
    'dachsbunex': '麻花犬EX',
    'dachsbun': '麻花犬EX',
    '麻花犬ex': '麻花犬EX',
    '麻花犬': '麻花犬EX',

    // Ogerpon / Grass line (Slot 9)
    'ogerponex': '厄鬼椪ex',
    'ogerpon': '厄鬼椪ex',
    '厄鬼椪ex': '厄鬼椪ex',
    '厄鬼椪': '厄鬼椪ex',
    'meowscaradaex': '魔幻假面喵ex',
    'meowscarada': '魔幻假面喵ex',
    '魔幻假面喵ex': '魔幻假面喵ex',
    '魔幻假面喵': '魔幻假面喵ex',
    'floragato': '蒂蕾喵',
    '蒂蕾喵': '蒂蕾喵',
    'sprigatito': '新葉喵',
    '新葉喵': '新葉喵',

    // Trainers - Items
    'ultraball': '高級球',
    '高級球': '高級球',
    'nestball': '巢穴球',
    '巢穴球': '巢穴球',
    'rarecandy': '神奇糖果',
    '神奇糖果': '神奇糖果',
    '糖果': '神奇糖果',
    'switch': '寶可夢交替',
    '寶可夢交替': '寶可夢交替',
    '交替': '寶可夢交替',
    '交換': '寶可夢交換',
    '寶可夢交換': '寶可夢交換',
    'superrod': '超級能量回收棒',
    '超級能量回收棒': '超級能量回收棒',
    '回收棒': '超級能量回收棒',
    'earthenvessel': '大地之器',
    '大地之器': '大地之器',
    'potion': '傷藥',
    '傷藥': '傷藥',
    'countercatcher': '反擊捕獲器',
    '反擊捕獲器': '反擊捕獲器',
    'primecatcher': '至尊捕捉器',
    '至尊捕捉器': '至尊捕捉器',
    '至尊捕手': '至尊捕捉器',
    'braverycharm': '勇氣護符',
    '勇氣護符': '勇氣護符',
    'hopeamulet': '希望護身符',
    '希望護身符': '希望護身符',
    '厲害釣竿': '厲害釣竿',
    '釣竿': '厲害釣竿',
    'sacredash': '聖灰',
    '聖灰': '聖灰',
    'technicalmachineevolution': '招式學習演進',
    '招式學習演進': '招式學習演進',
    'evolution': '招式學習演進',
    'pokemontablet': '寶可夢平板',
    '寶可夢平板': '寶可夢平板',

    // Trainers - Supporters
    'professorsresearch': '博士的研究',
    '博士的研究': '博士的研究',
    '博士': '博士的研究',
    'research': '博士的研究',
    'bossorders': '老大的指令',
    '老大的指令': '老大的指令',
    '老大': '老大的指令',
    'boss': '老大的指令',
    'iono': '奇樹',
    '奇樹': '奇樹',
    'arven': '派帕',
    '派帕': '派帕',
    'judge': '裁判',
    '裁判': '裁判',
    'wallace': '米可利',
    '米可利': '米可利',
    'fennel': '真菰',
    '真菰': '真菰',
    'lilliefulldetermination': '莉莉艾的決意',
    '莉莉艾的決意': '莉莉艾的決意',
    '莉莉艾': '莉莉艾的決意',

    // Energies
    'fireenergy': '基本火能量',
    '基本火能量': '基本火能量',
    '火能量': '基本火能量',
    'waterenergy': '基本水能量',
    '基本水能量': '基本水能量',
    '水能量': '基本水能量',
    'lightningenergy': '基本電能量',
    '基本電能量': '基本電能量',
    '電能量': '基本電能量',
    '雷能量': '基本電能量',
    'grassenergy': '基本草能量',
    '基本草能量': '基本草能量',
    '草能量': '基本草能量',
    'psychicenergy': '基本超能量',
    '基本超能量': '基本超能量',
    '超能量': '基本超能量',
    'fightingenergy': '基本鬥能量',
    '基本鬥能量': '基本鬥能量',
    '鬥能量': '基本鬥能量',
    'darknessenergy': '基本惡能量',
    '基本惡能量': '基本惡能量',
    '惡能量': '基本惡能量',
    'metalenergy': '基本鋼能量',
    '基本鋼能量': '基本鋼能量',
    '鋼能量': '基本鋼能量',
    'jetenergy': '噴射能量',
    '噴射能量': '噴射能量'
  };

  // Check alias map exact match first (using stripped)
  if (aliasMap[stripped]) {
    const realName = aliasMap[stripped];
    const found = CARD_DATABASE.find(c => c.name === realName);
    if (found) return JSON.parse(JSON.stringify(found));
  }

  // Check alias map substring match (sorted longest key first so 'vstar' matches before 'v')
  const sortedAliases = Object.keys(aliasMap).sort((a, b) => b.length - a.length);
  for (const alias of sortedAliases) {
    if (stripped.includes(alias)) {
      const realName = aliasMap[alias];
      const found = CARD_DATABASE.find(c => c.name === realName);
      if (found) return JSON.parse(JSON.stringify(found));
    }
  }

  return null;
}

// Intelligent Card Recognizer & Synthesizer
// If a card name uploaded by a user is not in standard DB, auto-construct its game stats!
function recognizeOrSynthesizeCard(rawName) {
  const clean = normalizeCardName(rawName);
  const found = findCardByName(clean);
  if (found) return found;

  const lower = clean.toLowerCase();
  const isEx = /ex$| ex$| ex |v$| v$|vstar|vmax/i.test(clean);
  const isAceSpec = /ace\s*spec|王牌|至尊/i.test(clean);

  // Check Energy
  if (/能量|energy/i.test(clean)) {
    let energyType = 'Colorless';
    if (/火/i.test(clean)) energyType = 'Fire';
    else if (/水/i.test(clean)) energyType = 'Water';
    else if (/雷|電/i.test(clean)) energyType = 'Lightning';
    else if (/草/i.test(clean)) energyType = 'Grass';
    else if (/超/i.test(clean)) energyType = 'Psychic';
    else if (/鬥/i.test(clean)) energyType = 'Fighting';
    else if (/惡|暗/i.test(clean)) energyType = 'Darkness';
    else if (/鋼/i.test(clean)) energyType = 'Metal';

    const isBasicEnergy = /基本|basic/i.test(clean) || (!/特殊|special/i.test(clean));

    return {
      id: `custom_energy_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: clean,
      supertype: 'energy',
      subtypes: isBasicEnergy ? ['Basic Energy'] : ['Special Energy'],
      energyType,
      isCustom: true
    };
  }

  // Check Trainer: Supporter
  if (/研究|博士|指令|老大|奇樹|派帕|阿克羅瑪|赤日|希羅娜|莉莉艾|瑪俐|小剛|小霞/i.test(clean)) {
    return {
      id: `custom_supporter_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: clean,
      supertype: 'trainer',
      subtypes: ['Supporter'],
      effect: 'custom_supporter_draw',
      text: '支援者卡：從牌庫抽3張卡。',
      isCustom: true
    };
  }

  // Check Trainer: Item / Tool / ACE SPEC
  if (/球|傷藥|交替|繩|棒|器|筒|指針|糖果|護符|滑板|捕獲|釣竿|腰帶|頭巾/i.test(clean) || isAceSpec) {
    const subtypes = isAceSpec ? ['Item', 'ACE SPEC'] : (/護符|滑板|腰帶|頭巾/i.test(clean) ? ['Tool'] : ['Item']);
    let itemText = '物品卡：在自己回合的主要階段可使用任意張數。';
    if (isAceSpec || clean.includes('至尊')) itemText = '【ACE SPEC】選擇對手 1 隻備戰寶可夢與戰鬥場互換，接著自己也進行戰鬥寶可夢與備戰互換。';
    else if (clean.includes('高級球')) itemText = '丟棄 2 張手牌，從牌庫搜尋任意 1 隻寶可夢加入手牌，重洗牌庫。';
    else if (clean.includes('巢穴球')) itemText = '從自己的牌庫選擇 1 隻基礎寶可夢放置於備戰區，重洗牌庫。';
    else if (clean.includes('糖果')) itemText = '選擇場上 1 隻基礎寶可夢，直接進化為手牌對應的 2 階進化寶可夢！';
    else if (clean.includes('交替')) itemText = '將自己的戰鬥寶可夢與備戰區的 1 隻寶可夢互換。';
    else if (clean.includes('棒') || clean.includes('回收')) itemText = '從棄牌區選擇寶可夢與基本能量合計最多 3 張洗回牌庫。';
    else if (clean.includes('器')) itemText = '丟棄 1 張手牌，從牌庫搜尋最多 2 張基本能量卡加入手牌。';
    else if (clean.includes('傷藥')) itemText = '選擇自己的 1 隻寶可夢，恢復其 30 點 HP。';
    else if (clean.includes('護符')) itemText = '【寶可夢道具】附有這張卡的基礎寶可夢最大 HP +50 點。';
    else if (clean.includes('捕獲')) itemText = '當自己剩餘獎賞卡比對手多時才可使用，將對手 1 隻備戰寶可夢拉上戰鬥場。';
    return {
      id: `custom_item_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: clean,
      supertype: 'trainer',
      subtypes,
      isAceSpec: isAceSpec,
      effect: isAceSpec ? 'custom_ace_spec' : 'heal_30',
      text: itemText,
      isCustom: true
    };
  }

  // Otherwise, default to Pokémon!
  let stage = 'Basic';
  if (/二階|2階|stage 2/i.test(clean)) stage = 'Stage 2';
  else if (/一階|1階|stage 1/i.test(clean)) stage = 'Stage 1';

  let pType = 'Colorless';
  if (/火/i.test(clean)) pType = 'Fire';
  else if (/水|冰/i.test(clean)) pType = 'Water';
  else if (/雷|電/i.test(clean)) pType = 'Lightning';
  else if (/草|葉/i.test(clean)) pType = 'Grass';
  else if (/超|妖/i.test(clean)) pType = 'Psychic';
  else if (/鬥|石|岩/i.test(clean)) pType = 'Fighting';
  else if (/惡|暗|毒/i.test(clean)) pType = 'Darkness';
  else if (/鋼|鐵/i.test(clean)) pType = 'Metal';
  else if (/龍/i.test(clean)) pType = 'Dragon';

  const defaultHp = isEx ? (stage === 'Stage 2' ? 330 : stage === 'Stage 1' ? 270 : 220) : (stage === 'Stage 2' ? 160 : stage === 'Stage 1' ? 100 : 70);
  const baseDmg = isEx ? (stage === 'Stage 2' ? 180 : 120) : (stage === 'Stage 2' ? 120 : stage === 'Stage 1' ? 60 : 30);

  return {
    id: `custom_poke_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    name: clean,
    supertype: 'pokemon',
    subtypes: isEx ? [stage, 'ex'] : [stage],
    hp: defaultHp,
    types: [pType],
    isEx,
    attacks: [
      {
        name: '猛擊',
        cost: [pType === 'Colorless' ? 'Colorless' : pType],
        damage: Math.round(baseDmg * 0.4),
        text: ''
      },
      {
        name: isEx ? '必殺突擊' : '全力一擊',
        cost: [pType === 'Colorless' ? 'Colorless' : pType, 'Colorless'],
        damage: baseDmg,
        text: ''
      }
    ],
    weakness: { type: pType === 'Fire' ? 'Water' : pType === 'Water' ? 'Lightning' : 'Fighting', value: 'x2' },
    resistance: null,
    retreatCost: stage === 'Basic' ? 1 : 2,
    isCustom: true
  };
}

module.exports = {
  CARD_DATABASE,
  findCardByName,
  recognizeOrSynthesizeCard,
  normalizeCardName
};
