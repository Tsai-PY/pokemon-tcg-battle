// public/js/standaloneEngine.js
// Client-side PTCG Standalone Engine & LocalStorage Service
// Enables 100% offline & static deployment (e.g. Netlify Drop, GitHub Pages, Vercel)

(function () {
  const STORAGE_USERS = 'ptcg_standalone_users';
  const STORAGE_DECKS = 'ptcg_standalone_decks';
  const STORAGE_GAMES = 'ptcg_standalone_games';
  const CLOUD_USERS_ID = 'ff808181a09d98f701a1c5ac8f147e52';

  // 1. Initial Default Admin and Shared Decks
  const DEFAULT_ADMIN = {
    phone: '0988229731',
    birthday: '19710607',
    name: '系統管理員',
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString()
  };

  const DEFAULT_SHARED_DECKS = [
    {
      id: 'deck_1',
      slot: 1,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_2',
      slot: 2,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_3',
      slot: 3,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_4',
      slot: 4,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_5',
      slot: 5,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_6',
      slot: 6,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_7',
      slot: 7,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_8',
      slot: 8,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_9',
      slot: 9,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'deck_10',
      slot: 10,
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
      ],
      totalCards: 60,
      valid: true,
      updatedAt: new Date().toISOString()
    }
  ];

  function getLocalUsers() {
    try {
      const u = JSON.parse(localStorage.getItem(STORAGE_USERS));
      if (Array.isArray(u) && u.length > 0) {
        if (!u.some(x => x.phone === DEFAULT_ADMIN.phone)) u.unshift(DEFAULT_ADMIN);
        return u;
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_USERS, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }

  function saveLocalUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    // Asynchronously push to cloud store so other devices (iPad, Laptop) get updated immediately!
    try {
      fetch('https://api.restful-api.dev/objects/' + CLOUD_USERS_ID, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'ptcg_users_store_v1', data: { users } })
      }).catch(e => console.warn('Cloud user sync error:', e));
    } catch (e) {}
  }

  async function syncFromCloud() {
    try {
      const res = await originalFetch('https://api.restful-api.dev/objects/' + CLOUD_USERS_ID);
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.users)) {
        const cloudUsers = data.data.users;
        const local = getLocalUsers();
        // Merge cloud users with local users
        for (const cu of cloudUsers) {
          const idx = local.findIndex(x => x.phone === cu.phone);
          if (idx !== -1) {
            local[idx] = cu;
          } else {
            local.push(cu);
          }
        }
        localStorage.setItem(STORAGE_USERS, JSON.stringify(local));
      }
    } catch (e) {
      console.warn('Sync from cloud failed, using local cache:', e);
    }
  }

  // Initial cloud sync
  setTimeout(() => syncFromCloud(), 100);

  function getLocalDecks() {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_DECKS));
      if (Array.isArray(d) && d.length === 10) return d;
    } catch (e) {}
    localStorage.setItem(STORAGE_DECKS, JSON.stringify(DEFAULT_SHARED_DECKS));
    return DEFAULT_SHARED_DECKS;
  }

  function saveLocalDecks(decks) {
    localStorage.setItem(STORAGE_DECKS, JSON.stringify(decks));
  }

  // Active in-browser games
  const localActiveGames = new Map();

  // 2. Intelligent Card Recognizer & Synthesizer for Browser
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

  function recognizeCard(rawName) {
    const clean = normalizeCardName(rawName);
    const found = findCardByName(clean);
    if (found) {
      return JSON.parse(JSON.stringify(found));
    }

    // Fallback synthesizer if card is not in CARD_DATABASE
    const isEx = /ex$| ex$| ex |v$| v$|vstar|vmax/i.test(clean);
    const isAceSpec = /ace\s*spec|王牌|至尊/i.test(clean);

    // Energy
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
      const isBasic = /基本|basic/i.test(clean) || (!/特殊|special/i.test(clean));

      return {
        id: `card_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: clean,
        supertype: 'energy',
        subtypes: isBasic ? ['Basic Energy'] : ['Special Energy'],
        energyType
      };
    }

    // Supporter
    if (/研究|博士|指令|老大|奇樹|派帕|阿克羅瑪|赤日|希羅娜|莉莉艾|瑪俐|裁判|米可利|真菰/i.test(clean)) {
      let supporterText = '支援者卡：在自己回合主要階段使用，每回合限 1 張，先攻首回合不可使用。';
      if (clean.includes('博士')) supporterText = '將自己的所有手牌全部丟棄，然後從牌庫抽取 7 張卡片。';
      else if (clean.includes('老大')) supporterText = '選擇對手的 1 隻備戰寶可夢，強制與其戰鬥場上的寶可夢互換。';
      else if (clean.includes('奇樹')) supporterText = '雙方將手牌洗回牌庫下方，各自依自己剩餘獎賞卡張數抽卡。';
      else if (clean.includes('派帕')) supporterText = '從牌庫選擇 1 張物品卡與 1 張寶可夢道具卡加入手牌。';
      else if (clean.includes('裁判')) supporterText = '雙方玩家各自將手牌洗回牌庫，各自抽 4 張卡。';
      else if (clean.includes('米可利')) supporterText = '從牌庫抽 3 張卡；若戰鬥寶可夢為水屬性則改為抽 4 張。';
      else if (clean.includes('真菰')) supporterText = '將自己所有寶可夢各恢復 40 點 HP。';
      else if (clean.includes('莉莉艾')) supporterText = '手牌洗回牌庫抽 6 張卡（若剩餘 6 張獎賞卡則改為抽 8 張）。';
      return {
        id: `card_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: clean,
        supertype: 'trainer',
        subtypes: ['Supporter'],
        effect: clean.includes('博士') ? 'discard_hand_draw_7' : clean.includes('老大') ? 'boss_orders_switch' : 'custom_supporter_draw',
        text: supporterText
      };
    }

    // Item / Tool
    if (/球|傷藥|交替|交換|繩|棒|器|筒|指針|糖果|護符|護身符|滑板|捕獲|釣竿|灰|演進|平板/i.test(clean) || isAceSpec) {
      const subtypes = isAceSpec ? ['Item', 'ACE SPEC'] : (/護符|護身符|滑板|演進/i.test(clean) ? ['Tool'] : ['Item']);
      let itemText = '物品卡：在自己回合的主要階段可使用任意張數。';
      if (isAceSpec || clean.includes('至尊')) itemText = '【ACE SPEC】選擇對手 1 隻備戰寶可夢與戰鬥場互換，接著自己也進行戰鬥寶可夢與備戰互換。';
      else if (clean.includes('希望護身符')) itemText = '【ACE SPEC】昏厥時從牌庫任意選擇最多 3 張卡加入手牌。';
      else if (clean.includes('高級球')) itemText = '丟棄 2 張手牌，從牌庫搜尋任意 1 隻寶可夢加入手牌，重洗牌庫。';
      else if (clean.includes('巢穴球')) itemText = '從自己的牌庫選擇 1 隻基礎寶可夢放置於備戰區，重洗牌庫。';
      else if (clean.includes('糖果')) itemText = '選擇場上 1 隻基礎寶可夢，直接進化為手牌對應的 2 階進化寶可夢！';
      else if (clean.includes('交替') || clean.includes('交換')) itemText = '將自己的戰鬥寶可夢與備戰區的 1 隻寶可夢互換。';
      else if (clean.includes('棒') || clean.includes('回收') || clean.includes('釣竿')) itemText = '從棄牌區選擇寶可夢與基本能量合計最多 3 張洗回牌庫。';
      else if (clean.includes('灰')) itemText = '從棄牌區選擇最多 5 張寶可夢卡洗回牌庫。';
      else if (clean.includes('平板')) itemText = '從牌庫選擇 1 張非規則寶可夢加入手牌。';
      else if (clean.includes('演進')) itemText = '【寶可夢道具】使備戰區最多 2 隻寶可夢直接進化。';
      else if (clean.includes('器')) itemText = '丟棄 1 張手牌，從牌庫搜尋最多 2 張基本能量卡加入手牌。';
      else if (clean.includes('傷藥')) itemText = '選擇自己的 1 隻寶可夢，恢復其 30 點 HP。';
      else if (clean.includes('護符')) itemText = '【寶可夢道具】附有這張卡的基礎寶可夢最大 HP +50 點。';
      else if (clean.includes('捕獲')) itemText = '當自己剩餘獎賞卡比對手多時才可使用，將對手 1 隻備戰寶可夢拉上戰鬥場。';
      return {
        id: `card_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: clean,
        supertype: 'trainer',
        subtypes,
        isAceSpec,
        effect: isAceSpec ? 'prime_catcher_double_switch' : clean.includes('傷藥') ? 'heal_30' : (clean.includes('交替') || clean.includes('交換')) ? 'switch_active_bench' : 'search_basic_bench',
        text: itemText
      };
    }

    // Pokemon
    let stage = 'Basic';
    if (/二階|2階|stage 2|噴火龍|大比鳥|戟脊龍|多龍巴魯托|沙奈朵|始祖大鳥|魔幻假面喵|耿鬼/i.test(clean)) stage = 'Stage 2';
    else if (/一階|1階|stage 1|火恐龍|比比鳥|雷丘|凍脊龍|多龍奇|奇魯莉安|蒂蕾喵|天然鳥|vstar|雪妖女|麻花犬/i.test(clean)) stage = 'Stage 1';

    let pType = 'Colorless';
    if (/火/i.test(clean)) pType = 'Fire';
    else if (/水|冰/i.test(clean)) pType = 'Water';
    else if (/雷|電/i.test(clean)) pType = 'Lightning';
    else if (/草|葉/i.test(clean)) pType = 'Grass';
    else if (/超|妖/i.test(clean)) pType = 'Psychic';
    else if (/鬥|石/i.test(clean)) pType = 'Fighting';
    else if (/惡|暗/i.test(clean)) pType = 'Darkness';
    else if (/鋼|鐵/i.test(clean)) pType = 'Metal';
    else if (/龍/i.test(clean)) pType = 'Dragon';

    const defaultHp = isEx ? (stage === 'Stage 2' ? 330 : stage === 'Stage 1' ? 270 : 220) : (stage === 'Stage 2' ? 160 : stage === 'Stage 1' ? 100 : 70);
    const baseDmg = isEx ? (stage === 'Stage 2' ? 180 : 120) : (stage === 'Stage 2' ? 120 : stage === 'Stage 1' ? 60 : 30);

    return {
      id: `card_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: clean,
      supertype: 'pokemon',
      subtypes: isEx ? [stage, 'ex'] : [stage],
      hp: defaultHp,
      types: [pType],
      isEx,
      attacks: [
        {
          name: `${clean} 突擊`,
          cost: [pType === 'Colorless' ? 'Colorless' : pType],
          damage: Math.round(baseDmg * 0.4),
          text: ''
        },
        {
          name: isEx ? `${clean} 極限爆發` : `${clean} 衝擊波`,
          cost: [pType === 'Colorless' ? 'Colorless' : pType, 'Colorless'],
          damage: baseDmg,
          text: ''
        }
      ],
      weakness: { type: pType === 'Fire' ? 'Water' : pType === 'Water' ? 'Lightning' : 'Fighting', value: 'x2' },
      retreatCost: 1
    };
  }

  // 3. Deck Validator
  function validateDeck(cardEntries) {
    const errors = [];
    const nameCounts = new Map();
    let totalCards = 0;
    let aceSpecCount = 0;
    let basicPokemonCount = 0;

    for (const entry of cardEntries) {
      const count = parseInt(entry.count, 10) || 0;
      if (count <= 0) continue;
      const card = recognizeCard(entry.name);
      totalCards += count;

      nameCounts.set(card.name, (nameCounts.get(card.name) || 0) + count);
      if (card.isAceSpec || (card.subtypes && card.subtypes.includes('ACE SPEC'))) {
        aceSpecCount += count;
      }
      if (card.supertype === 'pokemon' && card.subtypes && card.subtypes.includes('Basic')) {
        basicPokemonCount += count;
      }
    }

    if (totalCards !== 60) {
      errors.push(`【牌數限制】一副正式牌庫必須剛好 60 張卡牌（目前：${totalCards} 張，${totalCards > 60 ? '超出 ' + (totalCards - 60) : '還差 ' + (60 - totalCards)} 張）`);
    }

    for (const [name, count] of nameCounts.entries()) {
      const isBasicEnergy = /^基本.*能量$/.test(name) || name.includes('Basic Energy');
      if (!isBasicEnergy && count > 4) {
        errors.push(`【同名卡限制】「${name}」在牌庫中放入了 ${count} 張（超過上限 4 張限制）`);
      }
    }

    if (aceSpecCount > 1) {
      errors.push(`【特殊卡牌限制】ACE SPEC（王牌卡）全牌庫最多只能放入 1 張（目前共有 ${aceSpecCount} 張）`);
    }

    if (basicPokemonCount === 0) {
      errors.push('【基礎寶可夢限制】牌庫中必須至少包含 1 張「基礎寶可夢」！');
    }

    return {
      valid: errors.length === 0,
      totalCards,
      errors,
      aceSpecCount,
      basicPokemonCount
    };
  }

  function parseDeckText(text) {
    if (!text) return [];
    const lines = text.split(/\r?\n/);
    const cardMap = new Map();

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
        cardMap.set(cardName, (cardMap.get(cardName) || 0) + count);
      }
    }

    const entries = [];
    for (const [name, count] of cardMap.entries()) {
      entries.push({ name, count });
    }
    return entries;
  }

  // 4. Standalone PTCG Game Engine
  class StandaloneGame {
    constructor(id, p1Deck, p2Deck, isAi = true) {
      this.id = id;
      this.status = 'active';
      this.turnNumber = 1;
      this.activePlayerIndex = Math.random() < 0.5 ? 0 : 1;
      this.firstPlayerIndex = this.activePlayerIndex;
      this.winner = null;
      this.winReason = '';
      this.logs = [];

      this.players = [
        this._initPlayer(0, '訓練家小明', p1Deck, false),
        this._initPlayer(1, isAi ? '電腦AI (訓練家)' : '玩家 2', p2Deck, isAi)
      ];

      this.log(`===== 寶可夢紙牌對戰開始 =====`);
      this.log(`玩家 1: ${this.players[0].name} vs 玩家 2: ${this.players[1].name}`);
      this.startSetup();
    }

    log(msg) {
      this.logs.push({ timestamp: Date.now(), turn: this.turnNumber, message: msg });
    }

    _initPlayer(idx, name, deck, isAi) {
      const flattened = [];
      let count = 0;
      for (const entry of deck.cardEntries) {
        const c = parseInt(entry.count, 10) || 1;
        const cardObj = recognizeCard(entry.name);
        for (let i = 0; i < c; i++) {
          count++;
          flattened.push({
            ...cardObj,
            instanceId: `p${idx}_c${count}_${Math.random().toString(36).substring(7)}`,
            attachedEnergy: [],
            attachedTool: null,
            damage: 0,
            turnPlayed: 0
          });
        }
      }

      // Shuffle
      for (let i = flattened.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flattened[i], flattened[j]] = [flattened[j], flattened[i]];
      }

      return {
        index: idx,
        name,
        isAi,
        deck: flattened,
        hand: [],
        active: null,
        bench: [],
        prizes: [],
        discard: [],
        turnFlags: { energyAttached: false, supporterPlayed: false, retreated: false }
      };
    }

    _hasBasicPokemon(hand) {
      return (hand || []).some(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
    }

    _shuffle(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    startSetup() {
      // 抽 7 張起手手牌
      for (const p of this.players) {
        p.hand = p.deck.splice(0, 7);
      }

      // 檢查起手基礎寶可夢：如果一開始任何一方都沒有可以放上戰鬥場的寶可夢，則直接幫雙方重新抽牌開始新的一局
      let attempts = 0;
      while (attempts < 50) {
        const p0HasBasic = this._hasBasicPokemon(this.players[0].hand);
        const p1HasBasic = this._hasBasicPokemon(this.players[1].hand);

        if (p0HasBasic && p1HasBasic) {
          break;
        }

        attempts++;
        if (!p0HasBasic && !p1HasBasic) {
          this.log(`【重新抽牌開局】雙方（${this.players[0].name} 與 ${this.players[1].name}）起手皆無可放上戰鬥場的基礎寶可夢！依規則直接為雙方重新洗牌抽牌，開始新的一局。`);
        } else if (!p0HasBasic) {
          this.log(`【重新抽牌開局】${this.players[0].name} 起手無可放上戰鬥場的基礎寶可夢！依規則直接為雙方重新洗牌抽牌，開始新的一局。`);
        } else {
          this.log(`【重新抽牌開局】${this.players[1].name} 起手無可放上戰鬥場的基礎寶可夢！依規則直接為雙方重新洗牌抽牌，開始新的一局。`);
        }

        // 雙方將手牌洗回牌庫並重新洗牌抽 7 張
        for (const p of this.players) {
          p.deck.push(...p.hand);
          p.hand = [];
          p.deck = this._shuffle(p.deck);
          p.hand = p.deck.splice(0, 7);
        }
      }

      // 放置戰鬥寶可夢與備戰寶可夢
      for (const p of this.players) {
        const basics = p.hand.filter(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
        if (basics.length > 0) {
          const act = basics[0];
          p.hand = p.hand.filter(c => c.instanceId !== act.instanceId);
          p.active = act;
          for (let i = 1; i < Math.min(basics.length, 3); i++) {
            const b = basics[i];
            p.hand = p.hand.filter(c => c.instanceId !== b.instanceId);
            p.bench.push(b);
          }
        }
        // 設置 6 張獎賞卡
        p.prizes = p.deck.splice(0, 6);
      }

      this.log(`【先後攻】硬幣判定由 ${this.players[this.activePlayerIndex].name} 先攻！`);
      this.log(`【獎賞卡】雙方各設置了 6 張獎賞卡，對戰正式開始！`);
      this.log(`★ 規則限制：先攻第一回合「不能抽牌」、「不能使出招式」、「不能使用支援者卡」、「不能進化」。`);

      // 若硬幣判定由電腦AI先攻，自動於 1.2 秒後啟動電腦第一回合行動
      if (this.players[this.activePlayerIndex].isAi) {
        setTimeout(() => this.runAiTurn(), 1200);
      }
    }

    nextTurn() {
      if (this.status === 'finished') return;
      this.turnNumber++;
      this.activePlayerIndex = 1 - this.activePlayerIndex;
      const cur = this.players[this.activePlayerIndex];
      cur.turnFlags = { energyAttached: false, supporterPlayed: false, retreated: false };

      this.log(`----------------------------------------`);
      this.log(`【第 ${this.turnNumber} 回合】輪到 ${cur.name}！`);

      if (cur.deck.length === 0) {
        this.status = 'finished';
        this.winner = 1 - this.activePlayerIndex;
        this.winReason = `對手 ${cur.name} 牌庫已無牌可抽（抽牌失敗）！`;
        if (window.renderGameState) window.renderGameState(this.getState(0));
        return;
      }
      cur.hand.push(cur.deck.shift());
      this.log(`${cur.name} 抽了 1 張卡牌（剩餘牌庫：${cur.deck.length} 張）。`);

      // 即時重新渲染畫面
      if (window.renderGameState) {
        window.renderGameState(this.getState(0));
      }

      if (cur.isAi) {
        setTimeout(() => this.runAiTurn(), 1200);
      }
    }

    playBasic(pIdx, cardId) {
      const p = this.players[pIdx];
      if (p.bench.length >= 5) return { success: false, message: '備戰區已滿' };
      const idx = p.hand.findIndex(c => c.instanceId === cardId);
      if (idx === -1) return { success: false, message: '找不到卡牌' };
      const c = p.hand.splice(idx, 1)[0];
      c.turnPlayed = this.turnNumber;
      p.bench.push(c);
      this.log(`${p.name} 將「${c.name}」放置到了備戰區。`);
      return { success: true };
    }

    attachEnergy(pIdx, cardId, targetSlot) {
      const p = this.players[pIdx];
      if (p.turnFlags.energyAttached) return { success: false, message: '每回合限附加 1 張能量' };
      const idx = p.hand.findIndex(c => c.instanceId === cardId);
      if (idx === -1) return { success: false, message: '找不到卡牌' };
      const c = p.hand.splice(idx, 1)[0];
      const target = targetSlot === 'active' ? p.active : p.bench[targetSlot];
      if (!target) return { success: false, message: '找不到目標' };
      target.attachedEnergy = target.attachedEnergy || [];
      target.attachedEnergy.push(c);
      p.turnFlags.energyAttached = true;
      this.log(`${p.name} 將「${c.name}」附加到了「${target.name}」身上。`);
      return { success: true };
    }

    evolve(pIdx, cardId, targetSlot) {
      const p = this.players[pIdx];
      if (this.turnNumber <= 2) return { success: false, message: '前兩回合不可進化' };
      const idx = p.hand.findIndex(c => c.instanceId === cardId);
      if (idx === -1) return { success: false, message: '找不到卡牌' };
      const evoCard = p.hand.splice(idx, 1)[0];
      const target = targetSlot === 'active' ? p.active : p.bench[targetSlot];
      if (!target) return { success: false, message: '找不到目標' };
      const prevName = target.name;
      const evolved = {
        ...evoCard,
        attachedEnergy: target.attachedEnergy || [],
        attachedTool: target.attachedTool || null,
        damage: target.damage || 0,
        turnPlayed: this.turnNumber
      };
      if (targetSlot === 'active') p.active = evolved;
      else p.bench[targetSlot] = evolved;
      this.log(`✨ 進化！${p.name} 的「${prevName}」成功進化為「${evoCard.name}」！`);
      return { success: true };
    }

    playItem(pIdx, cardId, params = {}) {
      const p = this.players[pIdx];
      const opp = this.players[1 - pIdx];
      const idx = p.hand.findIndex(c => c.instanceId === cardId);
      if (idx === -1) return { success: false, message: '找不到卡牌' };
      const item = p.hand.splice(idx, 1)[0];
      p.discard.push(item);

      if (item.name.includes('高級球') || item.id === 'ultra_ball' || item.effect === 'ultra_ball_search') {
        const discardIds = (params && params.discardCardIds) || [];
        const discardedNames = [];
        discardIds.forEach(dId => {
          const dIdx = p.hand.findIndex(c => c.instanceId === dId);
          if (dIdx !== -1) {
            const disc = p.hand.splice(dIdx, 1)[0];
            p.discard.push(disc);
            discardedNames.push(disc.name);
          }
        });
        // 若為電腦AI或手牌未提供足額棄牌：自動從手牌丟至滿2張
        while (discardedNames.length < 2 && p.hand.length > 0) {
          const disc = p.hand.pop();
          p.discard.push(disc);
          discardedNames.push(disc.name);
        }

        let targetPokemon = null;
        if (params && params.targetCardId) {
          const tIdx = p.deck.findIndex(c => c.instanceId === params.targetCardId && c.supertype === 'pokemon');
          if (tIdx !== -1) {
            targetPokemon = p.deck.splice(tIdx, 1)[0];
            p.hand.push(targetPokemon);
          }
        }
        if (!targetPokemon && (!params || !params.targetCardId || p.isAi)) {
          const autoIdx = p.deck.findIndex(c => c.supertype === 'pokemon');
          if (autoIdx !== -1) {
            targetPokemon = p.deck.splice(autoIdx, 1)[0];
            p.hand.push(targetPokemon);
          }
        }

        p.deck = p.deck.sort(() => Math.random() - 0.5);

        const discardStr = discardedNames.length > 0 ? `丟棄了「${discardedNames.join('」與「')}」` : '丟棄了 2 張手牌';
        if (targetPokemon) {
          this.log(`🟡「高級球」：${p.name} ${discardStr}，從牌庫挑選了「${targetPokemon.name}」加入手牌，並重洗牌庫！`);
        } else {
          this.log(`🟡「高級球」：${p.name} ${discardStr}，檢索牌庫後未選擇寶可夢，重洗牌庫。`);
        }
      } else if (item.name.includes('巢穴球') || item.id === 'nest_ball' || item.effect === 'search_basic_bench') {
        if (p.bench.length >= 5) {
          this.log(`⚾「巢穴球」：${p.name} 備戰區已滿（上限 5 隻），無法放置！`);
        } else {
          let basicInDeck = null;
          if (params && params.targetCardId) {
            const bIdx = p.deck.findIndex(c => c.instanceId === params.targetCardId && c.supertype === 'pokemon' && (c.subtypes || []).includes('Basic'));
            if (bIdx !== -1) {
              basicInDeck = p.deck.splice(bIdx, 1)[0];
            }
          }
          if (!basicInDeck) {
            const bIdx = p.deck.findIndex(c => c.supertype === 'pokemon' && (c.subtypes || []).includes('Basic'));
            if (bIdx !== -1) {
              basicInDeck = p.deck.splice(bIdx, 1)[0];
            }
          }
          if (basicInDeck) {
            p.bench.push({
              ...basicInDeck,
              attachedEnergy: [],
              attachedTool: null,
              damage: 0,
              turnPlayed: this.turnNumber
            });
            p.deck = p.deck.sort(() => Math.random() - 0.5);
            this.log(`⚾「巢穴球」：${p.name} 從牌庫檢索了基礎寶可夢「${basicInDeck.name}」直接放置於備戰區，並重洗牌庫！`);
          } else {
            p.deck = p.deck.sort(() => Math.random() - 0.5);
            this.log(`⚾「巢穴球」：${p.name} 牌庫中沒有基礎寶可夢。`);
          }
        }
      } else if (item.name.includes('傷藥') && p.active && p.active.damage > 0) {
        p.active.damage = Math.max(0, p.active.damage - 30);
        this.log(`💊「傷藥」：為「${p.active.name}」恢復了 30 點 HP。`);
      } else if (item.name.includes('交替') && p.bench.length > 0) {
        const tmp = p.active;
        p.active = p.bench[0];
        p.bench[0] = tmp;
        this.log(`🔄「寶可夢交替」：將「${tmp.name}」與備戰區「${p.active.name}」互換！`);
      } else if (item.isAceSpec && opp.bench.length > 0) {
        const oppTmp = opp.active;
        opp.active = opp.bench[0];
        opp.bench[0] = oppTmp;
        this.log(`👑【ACE SPEC 王牌】至尊捕捉器！強行拉出對手的「${opp.active.name}」！`);
      } else {
        this.log(`${p.name} 使用了物品卡「${item.name}」。`);
      }
      return { success: true };
    }

    playSupporter(pIdx, cardId) {
      const p = this.players[pIdx];
      if (this.turnNumber === 1) return { success: false, message: '先攻首回合不可使用支援者卡' };
      if (p.turnFlags.supporterPlayed) return { success: false, message: '每回合限用 1 張支援者卡' };
      const idx = p.hand.findIndex(c => c.instanceId === cardId);
      if (idx === -1) return { success: false, message: '找不到卡牌' };
      const supp = p.hand.splice(idx, 1)[0];
      p.discard.push(supp);
      p.turnFlags.supporterPlayed = true;

      if (supp.name.includes('博士')) {
        p.discard.push(...p.hand);
        p.hand = p.deck.splice(0, Math.min(7, p.deck.length));
        this.log(`🔬「博士的研究」：${p.name} 丟棄手牌並重抽 7 張！`);
      } else {
        const draw = p.deck.splice(0, Math.min(3, p.deck.length));
        p.hand.push(...draw);
        this.log(`👤「${supp.name}」：${p.name} 從牌庫抽了 ${draw.length} 張卡牌！`);
      }
      return { success: true };
    }

    retreat(pIdx, benchIdx) {
      const p = this.players[pIdx];
      if (p.turnFlags.retreated) return { success: false, message: '每回合限撤退 1 次' };
      if (!p.active || !p.bench[benchIdx]) return { success: false, message: '找不到寶可夢' };
      const cost = p.active.retreatCost || 1;
      if ((p.active.attachedEnergy || []).length < cost) return { success: false, message: `能量不足 (需 ${cost} 個)` };
      p.active.attachedEnergy.splice(0, cost);
      const old = p.active;
      p.active = p.bench[benchIdx];
      p.bench[benchIdx] = old;
      p.turnFlags.retreated = true;
      this.log(`🏃 撤退：${p.name} 將「${old.name}」撤退，換上「${p.active.name}」！`);
      return { success: true };
    }

    attack(pIdx, attackIdx = 0) {
      const p = this.players[pIdx];
      const opp = this.players[1 - pIdx];
      if (this.turnNumber === 1) return { success: false, message: '先攻首回合不可攻擊' };
      if (!p.active) return { success: false, message: '無戰鬥寶可夢' };

      const at = (p.active.attacks || [])[attackIdx] || { name: '撞擊', damage: 30 };
      this.log(`⚔️【攻擊】${p.name} 的「${p.active.name}」使出【${at.name}】！`);

      let dmg = typeof at.damage === 'number' ? at.damage : 30;
      if (p.active.name.includes('噴火龍') && at.name.includes('狂暴')) {
        dmg = 180 + (6 - opp.prizes.length) * 30;
      }
      if (at.name === '狂暴粉碎') {
        dmg = 999;
        p.active.damage = (p.active.damage || 0) + 200;
        this.log(`💥「狂暴粉碎」：自身承受 200 點反作用力傷害！`);
      }

      if (opp.active) {
        // 弱點與抵抗力計算
        const attackerTypes = p.active.types || ['Colorless'];
        if (opp.active.weakness && attackerTypes.includes(opp.active.weakness.type) && dmg > 0) {
          dmg *= 2;
          this.log(`🎯【擊中弱點！】受到對手「${opp.active.name}」的【${opp.active.weakness.type}】屬性弱點影響，傷害翻倍為 ${dmg} 點！`);
        }
        if (opp.active.resistance && attackerTypes.includes(opp.active.resistance.type) && dmg > 0) {
          dmg = Math.max(0, dmg - 30);
          this.log(`🛡️【抵抗力防禦】對手抵抗力減免 30 點傷害，剩餘 ${dmg} 點！`);
        }

        opp.active.damage = (opp.active.damage || 0) + dmg;
        const curHp = Math.max(0, opp.active.hp - opp.active.damage);
        this.log(`💥 對「${opp.active.name}」造成 ${dmg} 點傷害！（剩餘 HP: ${curHp} / ${opp.active.hp}）`);

        if (curHp <= 0) {
          this.log(`💀【昏厥！】對手的「${opp.active.name}」倒下了！`);
          const knockedOut = opp.active;
          opp.discard.push(knockedOut, ...(knockedOut.attachedEnergy || []));
          opp.active = null;
          const prizesToTake = knockedOut.isEx ? 2 : 1;
          const taken = p.prizes.splice(0, prizesToTake);
          p.hand.push(...taken);
          this.log(`🏆 ${p.name} 獲得了 ${taken.length} 張獎賞卡（剩餘目標：${p.prizes.length} 張）！`);

          if (p.prizes.length === 0) {
            this.status = 'finished';
            this.winner = pIdx;
            this.winReason = `${p.name} 拿完了所有的 6 張獎賞卡！`;
            return { success: true };
          }

          if (opp.bench.length > 0) {
            opp.active = opp.bench.shift();
            this.log(`🔄 對手替補：將備戰區的「${opp.active.name}」推上戰鬥場！`);
          } else {
            this.status = 'finished';
            this.winner = pIdx;
            this.winReason = `對手場上已無任何寶可夢可替換！`;
            return { success: true };
          }
        }
      }

      this.nextTurn();
      return { success: true };
    }

    runAiTurn() {
      if (this.status === 'finished') return;
      if (this.activePlayerIndex !== 1) return;
      const ai = this.players[1];

      // 1. 放置基礎寶可夢到備戰區
      const bInHand = ai.hand.find(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
      if (bInHand && ai.bench.length < 5) this.playBasic(1, bInHand.instanceId);

      // 2. 附加能量卡
      if (!ai.turnFlags.energyAttached) {
        const e = ai.hand.find(c => c.supertype === 'energy');
        if (e && ai.active) this.attachEnergy(1, e.instanceId, 'active');
      }

      // 3. 攻擊或結束回合（第一回合先攻依規則不可使出招式，直接結束回合換玩家回合）
      if (this.turnNumber > 1 && ai.active) {
        const attacks = ai.active.attacks || [];
        let bestIdx = 0;
        let maxDmg = -1;
        attacks.forEach((at, idx) => {
          const d = typeof at.damage === 'number' ? at.damage : 0;
          if (d > maxDmg) {
            maxDmg = d;
            bestIdx = idx;
          }
        });
        this.attack(1, bestIdx);
      } else {
        this.nextTurn();
      }

      // 即時重新渲染戰鬥盤畫面
      if (window.renderGameState) {
        window.renderGameState(this.getState(0));
      }
    }

    getState(viewerIndex = 0) {
      return {
        id: this.id,
        status: this.status,
        winner: this.winner,
        winReason: this.winReason,
        turnNumber: this.turnNumber,
        activePlayerIndex: this.activePlayerIndex,
        firstPlayerIndex: this.firstPlayerIndex,
        logs: this.logs.slice(-30),
        players: this.players.map((p, idx) => ({
          index: p.index,
          name: p.name,
          isAi: p.isAi,
          deckCount: p.deck.length,
          deckCards: idx === viewerIndex ? p.deck.map(c => ({ ...c })) : [],
          prizeCount: p.prizes.length,
          discardCount: p.discard.length,
          discard: p.discard,
          active: p.active ? {
            ...p.active,
            attachedEnergy: p.active.attachedEnergy || [],
            currentHp: Math.max(0, p.active.hp - (p.active.damage || 0)),
            maxHp: p.active.hp
          } : null,
          bench: p.bench.map(b => ({
            ...b,
            attachedEnergy: b.attachedEnergy || [],
            currentHp: Math.max(0, b.hp - (b.damage || 0)),
            maxHp: b.hp
          })),
          hand: idx === viewerIndex ? p.hand : p.hand.map(() => ({ hidden: true })),
          handCount: p.hand.length,
          turnFlags: p.turnFlags
        }))
      };
    }
  }

  // 5. Intercept Fetch API for Standalone Mode
  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    // If it's not an API call or starts with http://remote, pass through
    if (typeof url !== 'string' || !url.startsWith('/api/')) {
      return originalFetch.apply(this, arguments);
    }

    // If running on a static host (GitHub Pages, Netlify Drop, or file://), NEVER send to static host!
    const isStaticHost = window.location.hostname.includes('github.io') ||
                         window.location.hostname.includes('netlify.app') ||
                         window.location.protocol === 'file:';

    if (!isStaticHost) {
      try {
        const res = await originalFetch.apply(this, arguments);
        const contentType = res.headers.get('content-type') || '';
        // Only return if it's a real JSON API response from a live backend!
        if (contentType.includes('application/json')) {
          return res;
        }
      } catch (e) {
        // Server not reachable (offline/static host without backend), proceed to standalone mock
      }
    }

    // Standalone Mock REST Server!
    const method = (options.method || 'GET').toUpperCase();
    let body = {};
    try {
      if (options.body) body = JSON.parse(options.body);
    } catch (e) {}

    const authHeader = (options.headers && options.headers['Authorization']) || '';
    const token = authHeader.replace('Bearer ', '').trim();

    // Route 1: POST /api/auth/login
    if (url === '/api/auth/login' && method === 'POST') {
      let users = getLocalUsers();
      let u = users.find(x => x.phone === body.phone);
      if (!u || (u.role !== 'admin' && u.status !== 'approved')) {
        await syncFromCloud();
        users = getLocalUsers();
        u = users.find(x => x.phone === body.phone);
      }
      if (!u) {
        return new Response(JSON.stringify({ success: false, message: '帳號不存在，請先點選「申請會員」' }), { status: 400 });
      }
      if (u.birthday !== body.birthday) {
        return new Response(JSON.stringify({ success: false, message: '密碼錯誤（西元生日8碼）' }), { status: 400 });
      }
      if (u.role !== 'admin' && u.status !== 'approved') {
        return new Response(JSON.stringify({ success: false, message: '您的會員資格尚在等待系統管理員審核中！' }), { status: 400 });
      }
      const fakeToken = `standalone_token_${u.phone}`;
      return new Response(JSON.stringify({ success: true, message: '登入成功', token: fakeToken, user: u }), { status: 200 });
    }

    // Route 2: POST /api/auth/register
    if (url === '/api/auth/register' && method === 'POST') {
      await syncFromCloud();
      const users = getLocalUsers();
      if (users.some(x => x.phone === body.phone)) {
        return new Response(JSON.stringify({ success: false, message: '此行動電話號碼已被註冊過！' }), { status: 400 });
      }
      const newU = {
        phone: body.phone,
        birthday: body.birthday,
        name: body.name || `訓練家_${body.phone.slice(-4)}`,
        role: 'member',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      users.push(newU);
      saveLocalUsers(users);
      return new Response(JSON.stringify({ success: true, message: '註冊申請成功！請等待系統管理員審核通過後即可登入對戰。', user: newU }), { status: 200 });
    }

    // Route 3: GET /api/auth/me
    if (url === '/api/auth/me' && method === 'GET') {
      const users = getLocalUsers();
      const phone = token ? token.replace('standalone_token_', '') : null;
      const u = users.find(x => x.phone === phone);
      if (u) return new Response(JSON.stringify({ success: true, user: u }), { status: 200 });
      return new Response(JSON.stringify({ success: false, message: '憑證無效' }), { status: 401 });
    }

    // Route 4: GET /api/admin/members
    if (url === '/api/admin/members' && method === 'GET') {
      await syncFromCloud();
      return new Response(JSON.stringify({ success: true, users: getLocalUsers() }), { status: 200 });
    }

    // Route 5: POST /api/admin/members/status
    if (url === '/api/admin/members/status' && method === 'POST') {
      const users = getLocalUsers();
      const target = users.find(x => x.phone === body.phone);
      if (target) {
        target.status = body.status;
        saveLocalUsers(users);
        return new Response(JSON.stringify({ success: true, message: `會員 ${body.phone} 審核狀態已更新！` }), { status: 200 });
      }
      return new Response(JSON.stringify({ success: false, message: '找不到會員' }), { status: 400 });
    }

    // Route 6: POST /api/admin/members/delete
    if (url === '/api/admin/members/delete' && method === 'POST') {
      let users = getLocalUsers();
      users = users.filter(x => x.phone !== body.phone);
      saveLocalUsers(users);
      return new Response(JSON.stringify({ success: true, message: `會員 ${body.phone} 已刪除` }), { status: 200 });
    }

    // Route 7: GET /api/decks
    if (url === '/api/decks' && method === 'GET') {
      return new Response(JSON.stringify({ success: true, decks: getLocalDecks() }), { status: 200 });
    }

    // Route 8: POST /api/decks/parse
    if (url === '/api/decks/parse' && method === 'POST') {
      const cardEntries = parseDeckText(body.text);
      const validation = validateDeck(cardEntries);
      return new Response(JSON.stringify({ success: true, validation, cardEntries }), { status: 200 });
    }

    // Route 9: POST /api/decks/upload
    if (url === '/api/decks/upload' && method === 'POST') {
      const cardEntries = parseDeckText(body.rawText);
      const validation = validateDeck(cardEntries);
      if (!validation.valid) {
        return new Response(JSON.stringify({ success: false, message: validation.errors.join('\n') }), { status: 400 });
      }
      const decks = getLocalDecks();
      const slot = body.slot || 1;
      decks[slot - 1] = {
        id: `custom_deck_${slot}_${Date.now()}`,
        slot,
        name: body.name,
        author: '訓練家',
        description: body.description || '',
        cardEntries,
        totalCards: 60,
        valid: true,
        updatedAt: new Date().toISOString()
      };
      saveLocalDecks(decks);
      return new Response(JSON.stringify({ success: true, message: '牌組上傳成功！' }), { status: 200 });
    }

    // Route 10: POST /api/games/create
    if (url === '/api/games/create' && method === 'POST') {
      const decks = getLocalDecks();
      const d1 = decks.find(d => d.slot === (body.deckSlot || 1)) || decks[0];
      const d2 = decks.find(d => d.slot === (body.oppDeckSlot || 2)) || decks[1];
      const gameId = `local_game_${Date.now()}`;
      const g = new StandaloneGame(gameId, d1, d2, body.mode !== 'hotseat');
      localActiveGames.set(gameId, g);
      return new Response(JSON.stringify({ success: true, gameId, state: g.getState(0) }), { status: 200 });
    }

    // Route 10b: GET /api/games/:id
    if (url.startsWith('/api/games/') && !url.includes('/action') && method === 'GET') {
      const parts = url.split('/');
      const gameId = parts[3];
      const g = localActiveGames.get(gameId);
      if (!g) return new Response(JSON.stringify({ success: false, message: '對戰不存在' }), { status: 404 });
      return new Response(JSON.stringify({ success: true, state: g.getState(0) }), { status: 200 });
    }

    // Route 11: POST /api/games/:id/action
    if (url.startsWith('/api/games/') && url.endsWith('/action') && method === 'POST') {
      const parts = url.split('/');
      const gameId = parts[3];
      const g = localActiveGames.get(gameId);
      if (!g) return new Response(JSON.stringify({ success: false, message: '對戰不存在' }), { status: 404 });

      const pIdx = typeof body.playerIndex === 'number' ? body.playerIndex : 0;
      let res = { success: false, message: '未知操作' };
      if (body.action === 'bench') res = g.playBasic(pIdx, body.cardInstanceId);
      else if (body.action === 'attach_energy') res = g.attachEnergy(pIdx, body.cardInstanceId, body.targetSlot);
      else if (body.action === 'evolve') res = g.evolve(pIdx, body.cardInstanceId, body.targetSlot);
      else if (body.action === 'play_item') res = g.playItem(pIdx, body.cardInstanceId, body.params || body);
      else if (body.action === 'play_supporter') res = g.playSupporter(pIdx, body.cardInstanceId);
      else if (body.action === 'retreat') res = g.retreat(pIdx, body.benchIndex);
      else if (body.action === 'attack') res = g.attack(pIdx, body.attackIndex || 0);
      else if (body.action === 'end_turn') { g.nextTurn(); res = { success: true }; }

      return new Response(JSON.stringify({ success: res.success, message: res.message, state: g.getState(pIdx) }), { status: res.success ? 200 : 400 });
    }

    // Route 12: Online Rooms (Standalone fallback)
    if (url === '/api/rooms/create' && method === 'POST') {
      const roomCode = String(Math.floor(1000 + Math.random() * 9000));
      const rooms = JSON.parse(localStorage.getItem('ptcg_standalone_rooms') || '[]');
      const r = { roomCode, hostDeckSlot: body.deckSlot || 1, status: 'waiting', createdAt: Date.now() };
      rooms.push(r);
      localStorage.setItem('ptcg_standalone_rooms', JSON.stringify(rooms));
      return new Response(JSON.stringify({ success: true, roomCode, message: '房間已建立' }), { status: 200 });
    }

    if (url === '/api/rooms' && method === 'GET') {
      const rooms = JSON.parse(localStorage.getItem('ptcg_standalone_rooms') || '[]');
      return new Response(JSON.stringify({ success: true, rooms: rooms.filter(x => x.status === 'waiting') }), { status: 200 });
    }

    if (url === '/api/rooms/join' && method === 'POST') {
      const roomCode = String(body.roomCode || '').trim();
      const rooms = JSON.parse(localStorage.getItem('ptcg_standalone_rooms') || '[]');
      const r = rooms.find(x => x.roomCode === roomCode);
      const decks = getLocalDecks();
      const d1 = decks.find(d => d.slot === (r ? r.hostDeckSlot : 1)) || decks[0];
      const d2 = decks.find(d => d.slot === (body.deckSlot || 2)) || decks[1];
      const gameId = `local_room_${roomCode}_${Date.now()}`;
      const g = new StandaloneGame(gameId, d1, d2, false);
      localActiveGames.set(gameId, g);
      if (r) {
        r.status = 'playing';
        r.gameId = gameId;
        localStorage.setItem('ptcg_standalone_rooms', JSON.stringify(rooms));
      }
      return new Response(JSON.stringify({ success: true, gameId, playerIndex: 1, state: g.getState(1) }), { status: 200 });
    }

    if (url.startsWith('/api/rooms/status/') && method === 'GET') {
      const code = url.split('/')[4];
      const rooms = JSON.parse(localStorage.getItem('ptcg_standalone_rooms') || '[]');
      const r = rooms.find(x => x.roomCode === code);
      if (r && r.status === 'playing') {
        return new Response(JSON.stringify({ success: true, status: 'playing', gameId: r.gameId, playerIndex: 0 }), { status: 200 });
      }
      return new Response(JSON.stringify({ success: true, status: 'waiting' }), { status: 200 });
    }

    if (isStaticHost) {
      // Safe fallback on static host to prevent 405 error
      return new Response(JSON.stringify({ success: false, message: '此操作在靜態端無對應路由' }), { status: 404 });
    }

    return originalFetch.apply(this, arguments);
  };

  // Expose to window for WebRTC P2P multi-device play
  window.StandaloneGame = StandaloneGame;
  window.getLocalDecks = getLocalDecks;
  window.saveLocalDecks = saveLocalDecks;
  window.getLocalUsers = getLocalUsers;
  window.saveLocalUsers = saveLocalUsers;
  window.syncCloudUsers = syncFromCloud;
  window.CARD_DATABASE = CARD_DATABASE;
  window.findCardByName = findCardByName;
  window.normalizeCardName = normalizeCardName;
  window.recognizeCard = recognizeCard;
})();
