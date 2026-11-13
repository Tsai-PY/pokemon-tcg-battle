
// ==================== PTCG 招式能量啟動條件判定 ====================
function getEnergyType(card) {
  if (!card) return 'Colorless';
  if (card.energyType) return card.energyType;
  const name = card.name || '';
  if (/草/i.test(name)) return 'Grass';
  if (/電|雷/i.test(name)) return 'Lightning';
  if (/鋼|鐵/i.test(name)) return 'Metal';
  if (/火/i.test(name)) return 'Fire';
  if (/水|冰/i.test(name)) return 'Water';
  if (/超|妖/i.test(name)) return 'Psychic';
  if (/鬥|石/i.test(name)) return 'Fighting';
  if (/惡|暗/i.test(name)) return 'Darkness';
  return 'Colorless';
}

function formatEnergyType(type) {
  const map = {
    'Grass': '草',
    'Lightning': '電',
    'Metal': '鋼',
    'Fire': '火',
    'Water': '水',
    'Psychic': '超',
    'Fighting': '鬥',
    'Darkness': '惡',
    'Dragon': '龍',
    'Colorless': '無色'
  };
  return map[type] || type;
}

function checkEnergyCost(attackCost = [], attachedEnergies = []) {
  if (!attackCost || attackCost.length === 0) return { canPay: true, missing: [] };

  const available = (attachedEnergies || []).map(e => getEnergyType(e));
  const specificCosts = attackCost.filter(c => c !== 'Colorless');
  const colorlessCostCount = attackCost.filter(c => c === 'Colorless').length;

  const missing = [];
  const pool = [...available];

  // 1. 優先匹配指定屬性能量
  for (const costType of specificCosts) {
    const idx = pool.indexOf(costType);
    if (idx !== -1) {
      pool.splice(idx, 1);
    } else {
      missing.push(costType);
    }
  }

  // 2. 剩餘任意屬性能量皆可用於抵扣「無色(Colorless)」能量
  const remainingColorlessNeeded = Math.max(0, colorlessCostCount - pool.length);
  for (let i = 0; i < remainingColorlessNeeded; i++) {
    missing.push('Colorless');
  }

  return {
    canPay: missing.length === 0,
    missing,
    attachedCount: attachedEnergies ? attachedEnergies.length : 0,
    requiredCount: attackCost.length
  };
}


// lib/gameEngine.js
// Complete PTCG Battle Simulation & Rule Engine

class PTCGGame {
  constructor(id, player1Config, player2Config) {
    this.id = id;
    this.createdAt = new Date().toISOString();
    this.status = 'setup'; // 'setup', 'mulligan', 'active', 'finished'
    this.winner = null;
    this.winReason = '';
    this.turnNumber = 0;
    this.activePlayerIndex = 0; // 0 or 1
    this.firstPlayerIndex = 0; // Who went first
    this.logs = [];

    // Player state structure:
    // { id, name, isAi, deckCards, hand, active, bench, prizes, discard, turnFlags: { energyAttached, supporterPlayed, retreated } }
    this.players = [
      this._initPlayer(player1Config, 0),
      this._initPlayer(player2Config, 1)
    ];

    this.log(`===== 寶可夢紙牌對戰開始 =====`);
    this.log(`玩家 1: ${this.players[0].name} vs 玩家 2: ${this.players[1].name}`);
  }

  log(msg) {
    const entry = {
      timestamp: Date.now(),
      turn: this.turnNumber,
      message: msg
    };
    this.logs.push(entry);
    return entry;
  }

  _initPlayer(config, idx) {
    // Flatten 60-card deck
    const flattened = [];
    let count = 0;
    for (const entry of (config.deck.cardEntries || [])) {
      const cardData = entry.card || require('./cardDb').recognizeOrSynthesizeCard(entry.name);
      const c = parseInt(entry.count, 10) || 1;
      for (let i = 0; i < c; i++) {
        count++;
        flattened.push({
          ...cardData,
          instanceId: `p${idx}_c${count}_${Math.random().toString(36).substring(7)}`,
          attachedEnergy: [],
          attachedTool: null,
          damage: 0,
          turnPlayed: 0
        });
      }
    }

    // Ensure 60 cards
    return {
      index: idx,
      id: config.id || `p_${idx}`,
      name: config.name || `訓練家 ${idx + 1}`,
      isAi: !!config.isAi,
      deck: this._shuffle(flattened),
      hand: [],
      active: null, // { card, attachedEnergy: [], attachedTool: null, damage: 0, turnPlayed: 0 }
      bench: [], // array of up to 5 pokemon
      prizes: [], // 6 prize cards face down
      discard: [], // discard pile
      turnFlags: {
        energyAttached: false,
        supporterPlayed: false,
        retreated: false,
        attacked: false
      }
    };
  }

  _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * STEP 1: 對戰準備 (Setup)
   * 1. 洗牌與抽 7 張手牌
   * 2. 檢驗基礎寶可夢 (Mulligan 調度檢查)
   * 3. 放置戰鬥寶可夢與備戰寶可夢
   * 4. 設置 6 張獎賞卡
   * 5. 翻開寶可夢，決定先後攻
   */
  startSetup() {
    this.status = 'setup';

    // 抽7張手牌
    for (const player of this.players) {
      this._dealInitialHand(player);
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
        this.log(`【重新抽牌開局】雙方（${this.players[0].name} 與 ${this.players[1].name}）起手手牌中皆沒有可放上戰鬥場的「基礎寶可夢」！依規則直接為雙方重新洗牌並抽 7 張牌，開始新的一局。`);
      } else if (!p0HasBasic) {
        this.log(`【重新抽牌開局】${this.players[0].name} 起手手牌中沒有可放上戰鬥場的「基礎寶可夢」！依規則直接為雙方重新洗牌並抽 7 張牌，開始新的一局。`);
      } else {
        this.log(`【重新抽牌開局】${this.players[1].name} 起手手牌中沒有可放上戰鬥場的「基礎寶可夢」！依規則直接為雙方重新洗牌並抽 7 張牌，開始新的一局。`);
      }

      // 雙方將手牌洗回牌庫並重新抽 7 張手牌
      for (const player of this.players) {
        player.deck.push(...player.hand);
        player.hand = [];
        player.deck = this._shuffle(player.deck);
        this._dealInitialHand(player);
      }
    }

    // 自動或引導設置初始寶可夢
    for (const player of this.players) {
      const basics = player.hand.filter(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
      if (basics.length > 0) {
        // First basic goes to Active
        const activeCard = basics[0];
        player.hand = player.hand.filter(c => c.instanceId !== activeCard.instanceId);
        activeCard.turnPlayed = 0;
        player.active = {
          ...activeCard,
          attachedEnergy: [],
          attachedTool: null,
          damage: 0,
          turnPlayed: 0
        };

        // Up to 2 other basics go to Bench automatically for smooth setup
        for (let i = 1; i < Math.min(basics.length, 3); i++) {
          const benchCard = basics[i];
          player.hand = player.hand.filter(c => c.instanceId !== benchCard.instanceId);
          benchCard.turnPlayed = 0;
          player.bench.push({
            ...benchCard,
            attachedEnergy: [],
            attachedTool: null,
            damage: 0,
            turnPlayed: 0
          });
        }
      }

      // 設置 6 張獎賞卡 (從牌庫上方覆蓋抽6張)
      player.prizes = player.deck.splice(0, 6);
    }

    // 決定先後攻 (猜拳 / 擲硬幣)
    const coinFlip = Math.random() < 0.5 ? 0 : 1;
    this.firstPlayerIndex = coinFlip;
    this.activePlayerIndex = coinFlip;
    this.turnNumber = 1;
    this.status = 'active';

    this.log(`【先後攻判定】擲硬幣結果：由 ${this.players[coinFlip].name} 獲得【先攻】！`);
    this.log(`【翻開寶可夢】雙方將場上的寶可夢翻開為正面！`);
    this.log(`雙方各設置了 6 張獎賞卡，對戰正式開始！`);

    // Reset turn flags
    this._resetTurnFlags(this.players[this.activePlayerIndex]);

    // Rule: First player CANNOT draw a card on Turn 1 (先攻玩家第一回合不能抽牌)
    this.log(`【第 1 回合 - ${this.players[this.activePlayerIndex].name}（先攻）】`);
    this.log(`★ 規則限制：先攻第一回合「不能抽牌」、「不能使出招式」、「不能使用支援者卡」、「不能進化」。`);

    return this.getState();
  }

  _dealInitialHand(player) {
    player.hand = player.deck.splice(0, 7);
  }

  _hasBasicPokemon(hand) {
    return hand.some(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
  }

  _resetTurnFlags(player) {
    player.turnFlags = {
      energyAttached: false,
      supporterPlayed: false,
      retreated: false,
      attacked: false
    };
  }

  /**
   * Start a new turn
   */
  nextTurn() {
    if (this.status === 'finished') return;

    this.turnNumber++;
    this.activePlayerIndex = 1 - this.activePlayerIndex;
    const current = this.players[this.activePlayerIndex];
    this._resetTurnFlags(current);

    this.log(`----------------------------------------`);
    this.log(`【第 ${this.turnNumber} 回合】輪到 ${current.name} 的回合！`);

    // Draw 1 card from deck
    if (current.deck.length === 0) {
      // 勝負條件 4: 回合開始時牌庫已無牌可抽
      this.finishGame(1 - this.activePlayerIndex, `對手 ${current.name} 在回合開始時牌庫已無牌可抽（抽牌失敗），判決敗北！`);
      return;
    }

    const drawn = current.deck.shift();
    current.hand.push(drawn);
    this.log(`${current.name} 從牌庫抽了 1 張卡牌（剩餘牌庫：${current.deck.length} 張）。`);
  }

  /**
   * Action: Play Basic Pokémon to Bench (上限 5 隻)
   */
  playBasicToBench(playerIndex, cardInstanceId) {
    const player = this.players[playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };
    if (player.bench.length >= 5) return { success: false, message: '備戰區已滿（上限 5 隻）！' };

    const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIdx === -1) return { success: false, message: '手牌中找不到該卡牌' };

    const card = player.hand[cardIdx];
    if (card.supertype !== 'pokemon' || !card.subtypes || !card.subtypes.includes('Basic')) {
      return { success: false, message: '只有「基礎寶可夢」可以直接放置於備戰區！' };
    }

    player.hand.splice(cardIdx, 1);
    const benchPokemon = {
      ...card,
      attachedEnergy: [],
      attachedTool: null,
      damage: 0,
      turnPlayed: this.turnNumber
    };
    player.bench.push(benchPokemon);

    this.log(`${player.name} 將「${card.name}」放置到了備戰區（目前備戰區：${player.bench.length}/5）。`);
    return { success: true };
  }

  /**
   * Action: Evolve Pokémon
   * Rule: Cannot evolve on Turn 1 (both players), and cannot evolve on the turn the Pokémon was put into play.
   */
  evolvePokemon(playerIndex, cardInstanceId, targetSlot) {
    const player = this.players[playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };

    // Cannot evolve on Turn 1 of the game
    if (this.turnNumber <= 2) {
      return { success: false, message: '對戰前兩回合（雙方第一回合）皆不可進行寶可夢進化！' };
    }

    const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIdx === -1) return { success: false, message: '手牌中找不到該卡牌' };

    const evoCard = player.hand[cardIdx];
    if (evoCard.supertype !== 'pokemon' || (!evoCard.subtypes.includes('Stage 1') && !evoCard.subtypes.includes('Stage 2'))) {
      return { success: false, message: '該卡牌不是進化寶可夢！' };
    }

    // Find target in Active or Bench
    let target = null;
    let isBench = false;
    let benchIdx = -1;

    if (targetSlot === 'active') {
      target = player.active;
    } else if (typeof targetSlot === 'number' && player.bench[targetSlot]) {
      target = player.bench[targetSlot];
      isBench = true;
      benchIdx = targetSlot;
    }

    if (!target) return { success: false, message: '找不到目標寶可夢' };

    // Check if target was played this turn
    if (target.turnPlayed === this.turnNumber) {
      return { success: false, message: `剛下場的寶可夢「${target.name}」當回合不可進化！` };
    }

    // Check evolution matching
    if (evoCard.evolvesFrom && target.name !== evoCard.evolvesFrom) {
      return { success: false, message: `「${evoCard.name}」需要由「${evoCard.evolvesFrom}」進化，無法疊在「${target.name}」上！` };
    }

    // Execute evolution: Retain damage, energy, tool
    player.hand.splice(cardIdx, 1);
    const prevName = target.name;
    const evolvedObj = {
      ...evoCard,
      attachedEnergy: target.attachedEnergy || [],
      attachedTool: target.attachedTool || null,
      damage: target.damage || 0,
      turnPlayed: this.turnNumber,
      underlyingCards: [...(target.underlyingCards || []), target]
    };

    if (isBench) {
      player.bench[benchIdx] = evolvedObj;
    } else {
      player.active = evolvedObj;
    }

    this.log(`✨ 進化成功！${player.name} 的「${prevName}」成功進化為「${evoCard.name}」！（HP: ${evoCard.hp}）`);

    // Check Evolution Abilities (e.g. 噴火龍ex 煉獄支配)
    if (evoCard.id === 'charizard_ex') {
      // Find up to 3 fire energy from deck and attach
      const fireEnergies = player.deck.filter(c => c.supertype === 'energy' && c.energyType === 'Fire').slice(0, 3);
      if (fireEnergies.length > 0) {
        for (const e of fireEnergies) {
          player.deck = player.deck.filter(c => c.instanceId !== e.instanceId);
          evolvedObj.attachedEnergy.push(e);
        }
        this.log(`🔥【特性：煉獄支配】「噴火龍ex」發動特性！從牌庫檢索了 ${fireEnergies.length} 張基本火能量附著於自身！`);
      }
    }

    return { success: true };
  }

  /**
   * Action: Attach 1 Energy per turn from hand to a Pokémon
   */
  attachEnergy(playerIndex, cardInstanceId, targetSlot) {
    const player = this.players[playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };
    if (player.turnFlags.energyAttached) {
      return { success: false, message: '每回合只能手動附加 1 張能量卡！' };
    }

    const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIdx === -1) return { success: false, message: '手牌中找不到該卡牌' };

    const energyCard = player.hand[cardIdx];
    if (energyCard.supertype !== 'energy') {
      return { success: false, message: '該卡牌不是能量卡！' };
    }

    let target = null;
    if (targetSlot === 'active') {
      target = player.active;
    } else if (typeof targetSlot === 'number' && player.bench[targetSlot]) {
      target = player.bench[targetSlot];
    }

    if (!target) return { success: false, message: '找不到目標寶可夢' };

    player.hand.splice(cardIdx, 1);
    target.attachedEnergy.push(energyCard);
    player.turnFlags.energyAttached = true;

    this.log(`${player.name} 將「${energyCard.name}」附加到了「${target.name}」身上（目前已有 ${target.attachedEnergy.length} 個能量）。`);
    return { success: true };
  }

  /**
   * Action: Attach Pokémon Tool (每隻寶可夢限貼 1 張)
   */
  attachTool(playerIndex, cardInstanceId, targetSlot) {
    const player = this.players[playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };

    const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIdx === -1) return { success: false, message: '手牌中找不到該卡牌' };

    const toolCard = player.hand[cardIdx];
    const isTool = (toolCard.subtypes && toolCard.subtypes.includes('Tool')) ||
                   toolCard.supertype === 'tool' ||
                   (toolCard.name && (toolCard.name.includes('護符') || toolCard.name.includes('鈴鐺響') || toolCard.name.includes('演進') || toolCard.name.includes('道具')));
    if (!isTool) {
      return { success: false, message: '該卡牌不是寶可夢道具卡！' };
    }

    let target = targetSlot === 'active' ? player.active : player.bench[targetSlot];
    if (!target) return { success: false, message: '找不到目標寶可夢' };
    if (target.attachedTool) return { success: false, message: `「${target.name}」身上已經貼有道具卡「${target.attachedTool.name}」，每隻寶可夢限貼 1 張道具！` };

    player.hand.splice(cardIdx, 1);
    target.attachedTool = toolCard;

    // Apply immediate tool buffs (e.g. 勇氣護符 +50 HP)
    const isBasic = (target.subtypes && target.subtypes.includes('Basic')) || target.stage === 'Basic' || !target.stage;
    if ((toolCard.id === 'bravery_charm' || (toolCard.name && toolCard.name.includes('勇氣護符'))) && isBasic) {
      target.maxHpBonus = (target.maxHpBonus || 0) + 50;
      this.log(`🛡️「勇氣護符」生效！基礎寶可夢「${target.name}」的最大 HP 提升 50！`);
    }

    this.log(`${player.name} 為「${target.name}」貼上了寶可夢道具「${toolCard.name}」。`);
    return { success: true };
  }

  /**
   * Action: Play Item Card (每回合不限張數)
   */
  playItem(playerIndex, cardInstanceId, params = {}) {
    const player = this.players[playerIndex];
    const opponent = this.players[1 - playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };

    const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIdx === -1) return { success: false, message: '手牌中找不到該卡牌' };

    const itemCard = player.hand[cardIdx];
    if (itemCard.supertype !== 'trainer' || !itemCard.subtypes.includes('Item')) {
      return { success: false, message: '該卡牌不是物品卡！' };
    }

    // Execute Item effect
    player.hand.splice(cardIdx, 1);
    player.discard.push(itemCard);

    if (itemCard.id === 'nest_ball' || itemCard.effect === 'search_basic_bench' || itemCard.name.includes('巢穴球')) {
      // Find basic pokemon in deck and bench it
      if (player.bench.length >= 5) {
        this.log(`${player.name} 使用了「巢穴球」，但備戰區已滿，無法放置！`);
      } else {
        let basicInDeck = null;
        if (params.targetCardId) {
          const tIdx = player.deck.findIndex(c => c.instanceId === params.targetCardId && c.supertype === 'pokemon' && (c.subtypes || []).includes('Basic'));
          if (tIdx !== -1) {
            basicInDeck = player.deck.splice(tIdx, 1)[0];
          }
        }
        if (!basicInDeck) {
          const autoIdx = player.deck.findIndex(c => c.supertype === 'pokemon' && (c.subtypes || []).includes('Basic'));
          if (autoIdx !== -1) {
            basicInDeck = player.deck.splice(autoIdx, 1)[0];
          }
        }
        if (basicInDeck) {
          player.bench.push({
            ...basicInDeck,
            attachedEnergy: [],
            attachedTool: null,
            damage: 0,
            turnPlayed: this.turnNumber
          });
          player.deck = this._shuffle(player.deck);
          this.log(`⚾「巢穴球」：${player.name} 從牌庫檢索了基礎寶可夢「${basicInDeck.name}」並直接放置於備戰區，重洗牌庫！`);
        } else {
          player.deck = this._shuffle(player.deck);
          this.log(`⚾「巢穴球」：${player.name} 的牌庫中沒有基礎寶可夢。`);
        }
      }
    } else if (itemCard.id === 'potion' || itemCard.effect === 'heal_30') {
      // Heal 30 damage from active or target
      const target = player.active;
      if (target && target.damage > 0) {
        const heal = Math.min(target.damage, 30);
        target.damage -= heal;
        this.log(`💊「傷藥」：為「${target.name}」恢復了 ${heal} 點 HP（當前傷害計數：${target.damage}）。`);
      } else {
        this.log(`💊「傷藥」：戰鬥寶可夢身上無傷害，恢復了 0 點 HP。`);
      }
    } else if (itemCard.id === 'switch_card' || itemCard.effect === 'switch_active_bench') {
      // Switch active with benched
      if (player.bench.length === 0) {
        this.log(`🔄「寶可夢交替」：備戰區無寶可夢可替換！`);
      } else {
        const benchIndex = typeof params.benchIndex === 'number' ? params.benchIndex : 0;
        const temp = player.active;
        player.active = player.bench[benchIndex];
        player.bench[benchIndex] = temp;
        this.log(`🔄「寶可夢交替」：${player.name} 將戰鬥場的「${temp.name}」與備戰區的「${player.active.name}」互換！`);
      }
    } else if (itemCard.id === 'ultra_ball' || itemCard.effect === 'ultra_ball_search' || itemCard.name.includes('高級球')) {
      // 1. Discard 2 selected cards
      const discardIds = params.discardCardIds || [];
      const discardedNames = [];
      discardIds.forEach(dId => {
        const dIdx = player.hand.findIndex(c => c.instanceId === dId);
        if (dIdx !== -1) {
          const disc = player.hand.splice(dIdx, 1)[0];
          player.discard.push(disc);
          discardedNames.push(disc.name);
        }
      });
      // Fallback if AI or discard not provided
      while (discardedNames.length < 2 && player.hand.length > 0) {
        const disc = player.hand.pop();
        player.discard.push(disc);
        discardedNames.push(disc.name);
      }

      // 2. Search any pokemon
      let targetPokemon = null;
      if (params.targetCardId) {
        const tIdx = player.deck.findIndex(c => c.instanceId === params.targetCardId && c.supertype === 'pokemon');
        if (tIdx !== -1) {
          targetPokemon = player.deck.splice(tIdx, 1)[0];
          player.hand.push(targetPokemon);
        }
      }
      if (!targetPokemon && (!params.targetCardId || player.isAi)) {
        const autoIdx = player.deck.findIndex(c => c.supertype === 'pokemon');
        if (autoIdx !== -1) {
          targetPokemon = player.deck.splice(autoIdx, 1)[0];
          player.hand.push(targetPokemon);
        }
      }

      // 3. Shuffle deck
      player.deck = this._shuffle(player.deck);

      const discardStr = discardedNames.length > 0 ? `丟棄了「${discardedNames.join('」與「')}」` : '丟棄了 2 張手牌';
      if (targetPokemon) {
        this.log(`🟡「高級球」：${player.name} ${discardStr}，從牌庫檢索了「${targetPokemon.name}」加入手牌，並重洗牌庫！`);
      } else {
        this.log(`🟡「高級球」：${player.name} ${discardStr}，檢索牌庫後未選擇寶可夢，重洗牌庫。`);
      }
    } else if (itemCard.id === 'prime_catcher' || itemCard.isAceSpec) {
      // ACE SPEC: Switch opponent's active with bench, then switch own
      if (opponent.bench.length > 0) {
        const oppBenchIdx = typeof params.oppBenchIndex === 'number' ? params.oppBenchIndex : 0;
        const oppTemp = opponent.active;
        opponent.active = opponent.bench[oppBenchIdx];
        opponent.bench[oppBenchIdx] = oppTemp;
        this.log(`👑【ACE SPEC 王牌卡】至尊捕捉器！強行將對手的「${oppTemp.name}」換下，拉出備戰區的「${opponent.active.name}」！`);
      }
      if (player.bench.length > 0) {
        const ownBenchIdx = typeof params.ownBenchIndex === 'number' ? params.ownBenchIndex : 0;
        const ownTemp = player.active;
        player.active = player.bench[ownBenchIdx];
        player.bench[ownBenchIdx] = ownTemp;
        this.log(`👑【至尊捕捉器】同時將自己的「${ownTemp.name}」與備戰區的「${player.active.name}」互換！`);
      }
    } else {
      this.log(`${player.name} 使用了物品卡「${itemCard.name}」。`);
    }

    return { success: true };
  }

  /**
   * Action: Play Supporter Card (每回合限 1 次，先攻第一回合不能使用)
   */
  playSupporter(playerIndex, cardInstanceId, params = {}) {
    const player = this.players[playerIndex];
    const opponent = this.players[1 - playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };

    // Rule: First player cannot use Supporter on Turn 1 (先攻玩家第一回合不能使用支援者卡)
    if (this.turnNumber === 1) {
      return { success: false, message: '先攻玩家的第一回合不能使用「支援者卡」！' };
    }

    if (player.turnFlags.supporterPlayed) {
      return { success: false, message: '每回合只能使用 1 張支援者卡！' };
    }

    const cardIdx = player.hand.findIndex(c => c.instanceId === cardInstanceId);
    if (cardIdx === -1) return { success: false, message: '手牌中找不到該卡牌' };

    const suppCard = player.hand[cardIdx];
    if (suppCard.supertype !== 'trainer' || !suppCard.subtypes.includes('Supporter')) {
      return { success: false, message: '該卡牌不是支援者卡！' };
    }

    player.hand.splice(cardIdx, 1);
    player.discard.push(suppCard);
    player.turnFlags.supporterPlayed = true;

    // Supporter effects
    if (suppCard.id === 'professors_research' || suppCard.effect === 'discard_hand_draw_7') {
      // Discard entire hand and draw 7
      player.discard.push(...player.hand);
      player.hand = [];
      const drawCount = Math.min(player.deck.length, 7);
      player.hand.push(...player.deck.splice(0, drawCount));
      this.log(`🔬「博士的研究」：${player.name} 丟棄了所有手牌，並從牌庫抽取了 ${drawCount} 張卡牌！`);
    } else if (suppCard.id === 'boss_orders' || suppCard.effect === 'boss_orders_switch') {
      // Switch opponent bench with active
      if (opponent.bench.length > 0) {
        const oppBenchIdx = typeof params.oppBenchIndex === 'number' ? params.oppBenchIndex : 0;
        const temp = opponent.active;
        opponent.active = opponent.bench[oppBenchIdx];
        opponent.bench[oppBenchIdx] = temp;
        this.log(`📢「老大的指令」：${player.name} 強制將對手的備戰寶可夢「${opponent.active.name}」換上戰鬥場！`);
      } else {
        this.log(`📢「老大的指令」：對手備戰區無寶可夢可替換。`);
      }
    } else if (suppCard.id === 'iono' || suppCard.effect === 'iono_shuffle_hand') {
      // Both players shuffle hand to bottom of deck, draw equal to remaining prize cards
      for (const p of [player, opponent]) {
        p.deck.push(...p.hand);
        p.hand = [];
        const prizeCount = Math.max(1, p.prizes.length);
        const drawCount = Math.min(p.deck.length, prizeCount);
        p.hand.push(...p.deck.splice(0, drawCount));
      }
      this.log(`⚡「奇樹」：雙方將手牌洗回牌庫下方，各自抽出與剩餘獎賞卡相同的張數（${player.name}: ${player.prizes.length} 張 / ${opponent.name}: ${opponent.prizes.length} 張）！`);
    } else {
      // General custom supporter: draw 3 cards
      const drawCount = Math.min(player.deck.length, 3);
      player.hand.push(...player.deck.splice(0, drawCount));
      this.log(`👤「${suppCard.name}」：${player.name} 發動支援者效果，從牌庫抽了 ${drawCount} 張卡牌！`);
    }

    return { success: true };
  }

  /**
   * Action: Retreat Active Pokémon (撤退戰鬥寶可夢)
   * Rule: Discard required retreat energy cost; swap Active and Bench; max once per turn.
   */
  retreatActive(playerIndex, benchIndex, energyIndicesToDiscard = []) {
    const player = this.players[playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };
    if (player.turnFlags.retreated) return { success: false, message: '每回合只能撤退 1 次！' };
    if (!player.active) return { success: false, message: '戰鬥場上沒有寶可夢' };
    if (!player.bench[benchIndex]) return { success: false, message: '備戰區找不到指定的替換寶可夢' };

    const retreatCost = player.active.retreatCost || 0;
    const attached = player.active.attachedEnergy || [];

    if (attached.length < retreatCost) {
      return { success: false, message: `撤退需要支付 ${retreatCost} 個能量，目前只有 ${attached.length} 個能量！` };
    }

    // Discard retreat energy
    const discarded = player.active.attachedEnergy.splice(0, retreatCost);
    player.discard.push(...discarded);

    // Swap active and bench
    const oldActive = player.active;
    player.active = player.bench[benchIndex];
    player.bench[benchIndex] = oldActive;
    player.turnFlags.retreated = true;

    this.log(`🏃【撤退】${player.name} 支付了 ${retreatCost} 個能量，將「${oldActive.name}」撤退至備戰區，換上「${player.active.name}」！`);
    return { success: true };
  }

  /**
   * Action: Attack Phase (攻擊階段)
   * 1. Check energy sufficiency
   * 2. Cannot attack on Turn 1 for First player
   * 3. Damage calculation: Base DMG -> Attack effects -> Weakness (x2) -> Resistance -> Defending effects
   * 4. Apply damage and check Knock Out (昏厥)
   * 5. Take Prize cards (1 for normal, 2 for ex/V)
   * 6. Check Win conditions
   * 7. End turn automatically after attack!
   */
  attack(playerIndex, attackIndex = 0) {
    if (this.status === 'finished') return { success: false, message: '對戰已結束！' };
    const player = this.players[playerIndex];
    const opponent = this.players[1 - playerIndex];
    if (this.activePlayerIndex !== playerIndex) return { success: false, message: '非您的回合！' };
    if (player.turnFlags && player.turnFlags.attacked) {
      return { success: false, message: '每回合只能使出 1 次招式，使出招式後回合即結束！' };
    }

    // Rule: First player cannot attack on Turn 1 (先攻玩家第一回合不能使出招式)
    if (this.turnNumber === 1) {
      return { success: false, message: '先攻玩家的第一回合不能使出招式攻擊！' };
    }

    const active = player.active;
    if (!active) return { success: false, message: '戰鬥場上無寶可夢！' };
    const attacks = active.attacks || [];
    const attack = attacks[attackIndex];
    if (!attack) return { success: false, message: '找不到該招式！' };

    // Check energy cost
    const costCheck = checkEnergyCost(attack.cost, active.attachedEnergy);
    if (!costCheck.canPay) {
      const costZh = (attack.cost || []).map(formatEnergyType).join('、');
      const missZh = (costCheck.missing || []).map(formatEnergyType).join('、');
      return {
        success: false,
        message: `招式「${attack.name}」尚未滿足啟動條件！（需要：${costZh}，缺少：${missZh}）`
      };
    }

    if (player.turnFlags) player.turnFlags.attacked = true;
    this.log(`⚔️【攻擊宣言】${player.name} 的「${active.name}」使出了招式【${attack.name}】！`);

    // Calculate damage
    let baseDamage = attack.damage || 0;

    // Special effects
    // 噴火龍ex 狂暴燃燒: 180 + 30 * opponent taken prizes
    if (active.id === 'charizard_ex' && attack.name === '狂暴燃燒') {
      const oppTakenPrizes = 6 - opponent.prizes.length;
      baseDamage = 180 + oppTakenPrizes * 30;
      this.log(`🔥「狂暴燃燒」增幅：對手已獲得 ${oppTakenPrizes} 張獎賞卡，傷害增加 ${oppTakenPrizes * 30} 點（總計 ${baseDamage} 點傷害）！`);
    }

    // 轟鳴月ex 狂暴粉碎 (Instant KO to opponent, 200 dmg to self)
    if (active.id === 'roaring_moon_ex' && attack.name === '狂暴粉碎') {
      baseDamage = 999;
      active.damage = (active.damage || 0) + 200;
      this.log(`💥「狂暴粉碎」：犧牲自身承受 200 點反作用力傷害，直接重創對手！`);
    }

    let finalDamage = baseDamage;
    const oppActive = opponent.active;

    if (oppActive && finalDamage > 0) {
      const attackerTypes = active.types || ['Colorless'];
      // Weakness: x2
      if (oppActive.weakness && attackerTypes.includes(oppActive.weakness.type)) {
        finalDamage *= 2;
        this.log(`🎯【擊中弱點！】受到對手「${oppActive.name}」的【${oppActive.weakness.type}】屬性弱點影響，傷害翻倍為 ${finalDamage} 點！`);
      }
      // Resistance: -30
      if (oppActive.resistance && attackerTypes.includes(oppActive.resistance.type)) {
        finalDamage = Math.max(0, finalDamage - 30);
        this.log(`🛡️【抵抗力防禦】對手抵抗力減免 30 點傷害，剩餘 ${finalDamage} 點！`);
      }

      oppActive.damage = (oppActive.damage || 0) + finalDamage;
      const effectiveMaxHp = oppActive.hp + (oppActive.maxHpBonus || 0);
      const remainingHp = Math.max(0, effectiveMaxHp - oppActive.damage);
      this.log(`💥 對「${oppActive.name}」造成了 ${finalDamage} 點傷害！（剩餘 HP: ${remainingHp} / ${effectiveMaxHp}）`);

      // Check Knock Out (昏厥)
      if (remainingHp <= 0) {
        this._handleKnockOut(opponent, player, oppActive);
      }
    }

    // Check if attacker fainted (e.g. Roaring Moon recoil)
    if (active) {
      const selfEffectiveHp = active.hp + (active.maxHpBonus || 0);
      if (active.damage >= selfEffectiveHp) {
        this._handleKnockOut(player, opponent, active);
      }
    }

    // Attack completes turn! Pass to next turn.
    if (this.status !== 'finished') {
      this.nextTurn();
    }

    return { success: true };
  }

  _handleKnockOut(faintedPlayer, attackerPlayer, faintedPokemon) {
    this.log(`💀【昏厥（氣絕）！】${faintedPlayer.name} 的「${faintedPokemon.name}」倒下了！`);

    // Move fainted Pokemon and attached cards to discard
    faintedPlayer.discard.push(faintedPokemon, ...(faintedPokemon.attachedEnergy || []));
    if (faintedPokemon.attachedTool) faintedPlayer.discard.push(faintedPokemon.attachedTool);

    // Remove from active
    if (faintedPlayer.active && faintedPlayer.active.instanceId === faintedPokemon.instanceId) {
      faintedPlayer.active = null;
    }

    // Attacker takes prize cards (1 for normal, 2 for ex/V)
    const isEx = faintedPokemon.isEx || (faintedPokemon.subtypes && faintedPokemon.subtypes.includes('ex'));
    const prizeCountToTake = isEx ? 2 : 1;
    const takenPrizes = attackerPlayer.prizes.splice(0, Math.min(attackerPlayer.prizes.length, prizeCountToTake));
    attackerPlayer.hand.push(...takenPrizes);

    this.log(`🏆【獲取獎賞卡】「${faintedPokemon.name}」是 ${isEx ? '寶可夢ex（獲得 2 張）' : '普通寶可夢（獲得 1 張）'}！${attackerPlayer.name} 取得了 ${takenPrizes.length} 張獎賞卡（剩餘目標：${attackerPlayer.prizes.length} 張）！`);

    // WIN CONDITION 1: 勝負條件 2: 拿完所有獎賞卡 (一般對戰為 6 張)
    if (attackerPlayer.prizes.length === 0) {
      this.finishGame(attackerPlayer.index, `【對戰勝利！】${attackerPlayer.name} 率先拿完了所有的 6 張獎賞卡，贏得對戰榮耀！`);
      return;
    }

    // Check if faintedPlayer has any Pokémon left
    // WIN CONDITION 2: 勝負條件 3: 對手場上（戰鬥區＋備戰區）沒有任何寶可夢可替補上戰鬥區
    if (faintedPlayer.bench.length === 0 && !faintedPlayer.active) {
      this.finishGame(attackerPlayer.index, `【對戰勝利！】${faintedPlayer.name} 場上與備戰區皆無任何寶可夢可替換，由 ${attackerPlayer.name} 獲勝！`);
      return;
    }

    // Promote new active from bench
    if (!faintedPlayer.active && faintedPlayer.bench.length > 0) {
      const newActive = faintedPlayer.bench.shift();
      faintedPlayer.active = newActive;
      this.log(`🔄 備戰替補：${faintedPlayer.name} 將備戰區的「${newActive.name}」替換推上戰鬥場！`);
    }
  }

  finishGame(winnerIndex, reason) {
    this.status = 'finished';
    this.winner = winnerIndex;
    this.winReason = reason;
    this.log(`========================================`);
    this.log(`🎉 對戰結束！獲勝者：${this.players[winnerIndex].name}！`);
    this.log(`勝利原因：${reason}`);
    this.log(`========================================`);
  }

  /**
   * Return client-safe state view
   */
  getState(forPlayerIndex = null) {
    return {
      id: this.id,
      status: this.status,
      winner: this.winner,
      winReason: this.winReason,
      turnNumber: this.turnNumber,
      activePlayerIndex: this.activePlayerIndex,
      firstPlayerIndex: this.firstPlayerIndex,
      logs: this.logs.slice(-30), // last 30 logs
      players: this.players.map((p, idx) => {
        const isSelf = forPlayerIndex === null || forPlayerIndex === idx;
        return {
          index: p.index,
          name: p.name,
          isAi: p.isAi,
          deckCount: p.deck.length,
          deckCards: isSelf ? p.deck.map(c => ({ ...c })) : [],
          prizeCount: p.prizes.length,
          discardCount: p.discard.length,
          discard: p.discard,
          active: p.active ? {
            ...p.active,
            attachedEnergyCount: (p.active.attachedEnergy || []).length,
            attachedEnergy: p.active.attachedEnergy || [],
            attachedTool: p.active.attachedTool,
            currentHp: Math.max(0, (p.active.hp + (p.active.maxHpBonus || 0)) - (p.active.damage || 0)),
            maxHp: p.active.hp + (p.active.maxHpBonus || 0)
          } : null,
          bench: p.bench.map(b => ({
            ...b,
            attachedEnergyCount: (b.attachedEnergy || []).length,
            attachedEnergy: b.attachedEnergy || [],
            attachedTool: b.attachedTool,
            currentHp: Math.max(0, (b.hp + (b.maxHpBonus || 0)) - (b.damage || 0)),
            maxHp: b.hp + (b.maxHpBonus || 0)
          })),
          // Reveal hand only to self or spectator
          hand: isSelf ? p.hand : p.hand.map(() => ({ hidden: true })),
          handCount: p.hand.length,
          turnFlags: p.turnFlags
        };
      })
    };
  }
}

module.exports = {
  PTCGGame
};
