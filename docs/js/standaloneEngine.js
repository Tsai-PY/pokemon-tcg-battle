// public/js/standaloneEngine.js
// Client-side PTCG Standalone Engine & LocalStorage Service
// Enables 100% offline & static deployment (e.g. Netlify Drop, GitHub Pages, Vercel)

(function () {
  const STORAGE_USERS = 'ptcg_standalone_users';
  const STORAGE_DECKS = 'ptcg_standalone_decks';
  const STORAGE_GAMES = 'ptcg_standalone_games';

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
  }

  function getLocalDecks() {
    try {
      const d = JSON.parse(localStorage.getItem(STORAGE_DECKS));
      if (Array.isArray(d) && d.length === 5) return d;
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
  function recognizeCard(rawName) {
    const clean = (rawName || '').trim();
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
    if (/研究|博士|指令|老大|奇樹|派帕|阿克羅瑪|赤日|希羅娜|莉莉艾|瑪俐/i.test(clean)) {
      return {
        id: `card_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: clean,
        supertype: 'trainer',
        subtypes: ['Supporter'],
        effect: clean.includes('博士') ? 'discard_hand_draw_7' : clean.includes('老大') ? 'boss_orders_switch' : 'custom_supporter_draw',
        text: '支援者卡效果。'
      };
    }

    // Item / Tool
    if (/球|傷藥|交替|繩|棒|器|筒|指針|糖果|護符|滑板|捕獲/i.test(clean) || isAceSpec) {
      const subtypes = isAceSpec ? ['Item', 'ACE SPEC'] : (/護符|滑板/i.test(clean) ? ['Tool'] : ['Item']);
      return {
        id: `card_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name: clean,
        supertype: 'trainer',
        subtypes,
        isAceSpec,
        effect: isAceSpec ? 'prime_catcher_double_switch' : clean.includes('傷藥') ? 'heal_30' : clean.includes('交替') ? 'switch_active_bench' : 'search_basic_bench',
        text: isAceSpec ? '【ACE SPEC】王牌道具。' : '物品卡效果。'
      };
    }

    // Pokemon
    let stage = 'Basic';
    if (/二階|2階|stage 2/i.test(clean)) stage = 'Stage 2';
    else if (/一階|1階|stage 1/i.test(clean)) stage = 'Stage 1';

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

    startSetup() {
      for (const p of this.players) {
        p.hand = p.deck.splice(0, 7);
        // Ensure basic
        const basics = p.hand.filter(c => c.supertype === 'pokemon' && c.subtypes.includes('Basic'));
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
        p.prizes = p.deck.splice(0, 6);
      }

      this.log(`【先後攻】硬幣判定由 ${this.players[this.activePlayerIndex].name} 先攻！`);
      this.log(`★ 規則限制：先攻第一回合「不能抽牌」、「不能使出招式」、「不能使用支援者卡」、「不能進化」。`);
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
        return;
      }
      cur.hand.push(cur.deck.shift());
      this.log(`${cur.name} 抽了 1 張卡牌（剩餘牌庫：${cur.deck.length} 張）。`);

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

    playItem(pIdx, cardId) {
      const p = this.players[pIdx];
      const opp = this.players[1 - pIdx];
      const idx = p.hand.findIndex(c => c.instanceId === cardId);
      if (idx === -1) return { success: false, message: '找不到卡牌' };
      const item = p.hand.splice(idx, 1)[0];
      p.discard.push(item);

      if (item.name.includes('傷藥') && p.active && p.active.damage > 0) {
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

      let dmg = at.damage || 30;
      if (p.active.name.includes('噴火龍') && at.name.includes('狂暴')) {
        dmg = 180 + (6 - opp.prizes.length) * 30;
      }

      if (opp.active) {
        opp.active.damage = (opp.active.damage || 0) + dmg;
        const curHp = Math.max(0, opp.active.hp - opp.active.damage);
        this.log(`💥 對「${opp.active.name}」造成 ${dmg} 點傷害！（剩餘 HP: ${curHp} / ${opp.active.hp}）`);

        if (curHp <= 0) {
          this.log(`💀【昏厥！】對手的「${opp.active.name}」倒下了！`);
          opp.discard.push(opp.active, ...(opp.active.attachedEnergy || []));
          opp.active = null;
          const prizesToTake = opp.active && opp.active.isEx ? 2 : 1;
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
      const ai = this.players[1];
      // 1. Bench
      const bInHand = ai.hand.find(c => c.supertype === 'pokemon' && c.subtypes.includes('Basic'));
      if (bInHand && ai.bench.length < 5) this.playBasic(1, bInHand.instanceId);

      // 2. Attach energy
      if (!ai.turnFlags.energyAttached) {
        const e = ai.hand.find(c => c.supertype === 'energy');
        if (e && ai.active) this.attachEnergy(1, e.instanceId, 'active');
      }

      // 3. Attack
      if (this.turnNumber > 1 && ai.active) {
        this.attack(1, 0);
      } else {
        this.nextTurn();
      }

      // Re-render
      if (window.renderGameState) window.renderGameState(this.getState());
    }

    getState() {
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
          hand: idx === 0 ? p.hand : p.hand.map(() => ({ hidden: true })),
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

    // Try server first if we are on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        const res = await originalFetch.apply(this, arguments);
        if (res.status !== 404 && res.status !== 502) return res;
      } catch (e) {
        // Fall through to standalone interceptor
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
      const users = getLocalUsers();
      const u = users.find(x => x.phone === body.phone);
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
      return new Response(JSON.stringify({ success: true, gameId, state: g.getState() }), { status: 200 });
    }

    // Route 11: POST /api/games/:id/action
    if (url.startsWith('/api/games/') && url.endsWith('/action') && method === 'POST') {
      const parts = url.split('/');
      const gameId = parts[3];
      const g = localActiveGames.get(gameId);
      if (!g) return new Response(JSON.stringify({ success: false, message: '對戰不存在' }), { status: 404 });

      let res = { success: false, message: '未知操作' };
      if (body.action === 'bench') res = g.playBasic(0, body.cardInstanceId);
      else if (body.action === 'attach_energy') res = g.attachEnergy(0, body.cardInstanceId, body.targetSlot);
      else if (body.action === 'evolve') res = g.evolve(0, body.cardInstanceId, body.targetSlot);
      else if (body.action === 'play_item') res = g.playItem(0, body.cardInstanceId);
      else if (body.action === 'play_supporter') res = g.playSupporter(0, body.cardInstanceId);
      else if (body.action === 'retreat') res = g.retreat(0, body.benchIndex);
      else if (body.action === 'attack') res = g.attack(0, body.attackIndex || 0);
      else if (body.action === 'end_turn') { g.nextTurn(); res = { success: true }; }

      return new Response(JSON.stringify({ success: res.success, message: res.message, state: g.getState() }), { status: res.success ? 200 : 400 });
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
      return new Response(JSON.stringify({ success: true, gameId, playerIndex: 1, state: g.getState() }), { status: 200 });
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

    return originalFetch.apply(this, arguments);
  };
})();
