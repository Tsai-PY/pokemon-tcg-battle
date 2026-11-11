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
  }
];

// Helper: Normalize name for matching
function normalizeCardName(name) {
  if (!name) return '';
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[（\(].*?[）\)]/g, '') // remove parenthesized set info
    .trim();
}

// Find card in static DB
function findCardByName(rawName) {
  const norm = normalizeCardName(rawName).toLowerCase();
  // Exact or contains match
  const match = CARD_DATABASE.find(c => {
    const cNorm = c.name.toLowerCase();
    return cNorm === norm || c.id === norm;
  });
  if (match) return JSON.parse(JSON.stringify(match));

  // Fuzzy check for common aliases
  const aliasMap = {
    '噴火龍': '噴火龍ex',
    '皮卡丘': '皮卡丘',
    '密勒頓': '密勒頓ex',
    '古劍豹': '古劍豹ex',
    '大比鳥': '大比鳥ex',
    '火能量': '基本火能量',
    '水能量': '基本水能量',
    '電能量': '基本電能量',
    '草能量': '基本草能量',
    '超能量': '基本超能量',
    '鬥能量': '基本鬥能量',
    '惡能量': '基本惡能量',
    '鋼能量': '基本鋼能量',
    'boss': '老大的指令',
    '老大': '老大的指令',
    '博士': '博士的研究',
    '至尊捕手': '至尊捕捉器',
    '糖果': '神奇糖果'
  };

  for (const [alias, realName] of Object.entries(aliasMap)) {
    if (norm.includes(alias.toLowerCase())) {
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
    return {
      id: `custom_item_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: clean,
      supertype: 'trainer',
      subtypes,
      isAceSpec: isAceSpec,
      effect: isAceSpec ? 'custom_ace_spec' : 'heal_30',
      text: isAceSpec ? '【ACE SPEC】強大王牌道具效果。' : '物品卡效果。',
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
