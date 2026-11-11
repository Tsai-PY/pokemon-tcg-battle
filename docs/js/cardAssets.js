// public/js/cardAssets.js
// Visual Card Presentation and Generator for PTCG

const TYPE_EMOJIS = {
  Fire: '🔥',
  Water: '💧',
  Lightning: '⚡',
  Grass: '🌿',
  Psychic: '🔮',
  Fighting: '🥊',
  Darkness: '🌙',
  Metal: '⚙️',
  Dragon: '🐉',
  Colorless: '⚪'
};

const POKEMON_ART_EMOJIS = {
  '小火龍': '🦎',
  '火恐龍': '🦖',
  '噴火龍ex': '🐲',
  '皮卡丘': '⚡',
  '皮卡丘ex': '⚡👑',
  '雷丘': '🐭',
  '密勒頓ex': '🦎⚡',
  '古劍豹ex': '🐆❄️',
  '涼脊龍': '❄️',
  '凍脊龍': '🧊',
  '戟脊龍': '🦕❄️',
  '光輝甲賀忍蛙': '🐸',
  '波波': '🐦',
  '比比鳥': '🦅',
  '大比鳥ex': '🦅👑',
  '轟鳴月ex': '🦇🌙',
  '鐵臂膀ex': '🦾',
  '多龍巴魯托ex': '🐲🚀',
  '多龍梅西亞': '👻',
  '多龍奇': '👻🚀',
  '光輝胡地': '🧙',
  '天然鳥': '🦜',
  '天然雀': '🐤',
  '沙奈朵ex': '💃🔮',
  '奇魯莉安': '🩰',
  '拉魯拉絲': '👶',
  '吼叫尾': '🎀',
  '洛奇亞VSTAR': '🌊👑',
  '洛奇亞V': '🌊',
  '始祖大鳥': '🪶',
  '卡比獸': '💤',
  '厄鬼椪ex': '🎭🌿',
  '魔幻假面喵ex': '🐱🎭',
  '新葉喵': '🐱',
  '蒂蕾喵': '🐈',
  '超夢ex': '🧬🔮',
  '耿鬼': '😈',
  // Trainers
  '博士的研究': '🔬',
  '老大的指令': '👔',
  '奇樹': '⚡👧',
  '派帕': '🥪',
  '巢穴球': '⚾',
  '高級球': '🟡',
  '神奇糖果': '🍬',
  '寶可夢交替': '🔄',
  '傷藥': '💊',
  '大地之器': '🏺',
  '至尊捕捉器': '👑',
  '勇氣護符': '🛡️',
  '超級能量回收棒': '🎣'
};

function getCardArtEmoji(card) {
  if (POKEMON_ART_EMOJIS[card.name]) {
    return POKEMON_ART_EMOJIS[card.name];
  }
  if (card.supertype === 'energy') {
    return TYPE_EMOJIS[card.energyType] || '⚡';
  }
  if (card.supertype === 'trainer') {
    if (card.subtypes && card.subtypes.includes('Supporter')) return '👤';
    if (card.isAceSpec) return '👑';
    return '🎒';
  }
  const type = (card.types && card.types[0]) || 'Colorless';
  return TYPE_EMOJIS[type] || '🐾';
}

function renderCardHtml(card, options = {}) {
  if (!card) return '';
  if (card.hidden) {
    return `<div class="ptcg-card ptcg-card-back"></div>`;
  }

  const isPokemon = card.supertype === 'pokemon';
  const isTrainer = card.supertype === 'trainer';
  const isEnergy = card.supertype === 'energy';
  const isEx = card.isEx || (card.subtypes && card.subtypes.includes('ex'));
  const isAceSpec = card.isAceSpec || (card.subtypes && card.subtypes.includes('ACE SPEC'));

  const currentHp = typeof card.currentHp === 'number' ? card.currentHp : (card.hp || 0);
  const maxHp = card.maxHp || card.hp || 0;
  const damage = card.damage || 0;

  // Attached energies
  let energyDotsHtml = '';
  if (card.attachedEnergy && card.attachedEnergy.length > 0) {
    energyDotsHtml = `<div class="energy-attached-strip">` + 
      card.attachedEnergy.map(e => {
        const t = e.energyType || 'Colorless';
        return `<span class="energy-dot energy-${t}">${t[0]}</span>`;
      }).join('') + `</div>`;
  }

  // Damage counter badge
  let damageBadgeHtml = '';
  if (damage > 0) {
    damageBadgeHtml = `<div class="damage-counter-badge">-${damage}</div>`;
  }

  // Tool badge
  let toolBadgeHtml = '';
  if (card.attachedTool) {
    toolBadgeHtml = `<div class="tool-badge" title="${card.attachedTool.name}">🪖 ${card.attachedTool.name}</div>`;
  }

  // Attack preview
  let attackHtml = '';
  if (isPokemon && card.attacks && card.attacks.length > 0) {
    const at = card.attacks[0];
    attackHtml = `
      <div class="card-attack-line">
        <span class="card-attack-name">${at.name}</span>
        <span class="card-attack-dmg">${at.damage || ''}</span>
      </div>
    `;
  } else if (isTrainer) {
    attackHtml = `
      <div class="card-attack-line">
        <span style="font-size: 0.6rem; color: #475569;">${card.subtypes ? card.subtypes.join('/') : '訓練家'}</span>
      </div>
    `;
  } else if (isEnergy) {
    attackHtml = `
      <div class="card-attack-line">
        <span style="font-size: 0.6rem; color: #475569;">能量卡</span>
      </div>
    `;
  }

  const borderStyle = isAceSpec ? 'border-color: #ec4899; box-shadow: 0 0 8px #ec4899;' : (isEx ? 'border-color: #eab308;' : '');
  const emoji = getCardArtEmoji(card);

  return `
    <div class="ptcg-card" data-instance-id="${card.instanceId || ''}" style="${borderStyle}">
      ${damageBadgeHtml}
      ${toolBadgeHtml}
      <div class="card-header">
        <span style="font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 60px;">${card.name}</span>
        ${isPokemon ? `<span class="card-hp">HP ${currentHp}/${maxHp}</span>` : ''}
        ${isAceSpec ? `<span class="card-type-tag" style="background:#ec4899;color:#fff;">ACE</span>` : ''}
      </div>
      <div class="card-artwork">
        <span class="card-emoji-art">${emoji}</span>
      </div>
      <div class="card-footer">
        ${attackHtml}
      </div>
      ${energyDotsHtml}
    </div>
  `;
}

// Sound Synthesizer via Web Audio API (Zero External Asset Dependencies)
class SoundFx {
  constructor() {
    this.ctx = null;
  }
  _init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playCard() {
    try {
      this._init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }
  playAttack() {
    try {
      this._init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
  playKnockOut() {
    try {
      this._init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (e) {}
  }
  playFanfare() {
    try {
      this._init();
      if (!this.ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.12);
        osc.stop(this.ctx.currentTime + i * 0.12 + 0.35);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFx();
