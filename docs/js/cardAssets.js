// public/js/cardAssets.js
// Visual Card Presentation and Generator for PTCG with Authentic Card Artwork

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
  '小恐龍': '🦎',
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

// Official Authentic PTCG Card Images Directory
const OFFICIAL_CARD_IMAGES = {
  // Charmander / 小火龍 / 小恐龍 (Exact user uploaded authentic Traditional Chinese card)
  '小火龍': 'assets/cards/charmander.png',
  '小恐龍': 'assets/cards/charmander.png',

  // Fire / Charizard line
  '火恐龍': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/OBF/OBF_025_R_EN_MD.png',
  '噴火龍ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/OBF/OBF_125_R_EN_MD.png',
  '波波': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/OBF/OBF_162_R_EN_MD.png',
  '比比鳥': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/OBF/OBF_163_R_EN_MD.png',
  '大比鳥ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/OBF/OBF_164_R_EN_MD.png',
  '光輝甲賀忍蛙': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/ASR/ASR_046_R_EN_MD.png',

  // Lightning / Miraidon line
  '密勒頓ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_081_R_EN_MD.png',
  '鐵臂膀ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_070_R_EN_MD.png',
  '皮卡丘': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SSP/SSP_056_R_EN_MD.png',
  '雷丘': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_062_R_EN_MD.png',
  '皮卡丘ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SSP/SSP_057_R_EN_MD.png',

  // Water / Chien-Pao line
  '古劍豹ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_061_R_EN_MD.png',
  '涼脊龍': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_058_R_EN_MD.png',
  '凍脊龍': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_059_R_EN_MD.png',
  '戟脊龍': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_060_R_EN_MD.png',

  // Darkness / Roaring Moon
  '轟鳴月ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_124_R_EN_MD.png',

  // Dragon / Dragapult line
  '多龍巴魯托ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TWM/TWM_130_R_EN_MD.png',
  '多龍梅西亞': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TWM/TWM_128_R_EN_MD.png',
  '多龍奇': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TWM/TWM_129_R_EN_MD.png',
  '光輝胡地': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SIT/SIT_059_R_EN_MD.png',
  '天然鳥': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_078_R_EN_MD.png',
  '天然雀': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_077_R_EN_MD.png',

  // Psychic / Gardevoir line
  '沙奈朵ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_086_R_EN_MD.png',
  '奇魯莉安': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_085_R_EN_MD.png',
  '拉魯拉絲': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_084_R_EN_MD.png',
  '吼叫尾': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_086_R_EN_MD.png',

  // Colorless / Lugia line
  '洛奇亞VSTAR': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SIT/SIT_139_R_EN_MD.png',
  '洛奇亞V': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SIT/SIT_138_R_EN_MD.png',
  '始祖大鳥': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SIT/SIT_147_R_EN_MD.png',
  '卡比獸': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/LOR/LOR_143_R_EN_MD.png',

  // Grass / Ogerpon & Meowscarada line
  '厄鬼椪ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TWM/TWM_025_R_EN_MD.png',
  '新葉喵': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_013_R_EN_MD.png',
  '蒂蕾喵': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_014_R_EN_MD.png',
  '魔幻假面喵ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_015_R_EN_MD.png',

  // Classic / Mewtwo & Gengar
  '超夢ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/MEW/MEW_052_R_EN_MD.png',
  '耿鬼': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TEF/TEF_104_R_EN_MD.png',

  // Trainers
  '博士的研究': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_189_R_EN_MD.png',
  '老大的指令': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_172_R_EN_MD.png',
  '奇樹': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_185_R_EN_MD.png',
  '派帕': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_166_R_EN_MD.png',
  '巢穴球': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_181_R_EN_MD.png',
  '高級球': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_196_R_EN_MD.png',
  '神奇糖果': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_191_R_EN_MD.png',
  '寶可夢交替': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_194_R_EN_MD.png',
  '大地之器': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_163_R_EN_MD.png',
  '超級能量回收棒': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_188_R_EN_MD.png',
  '勇氣護符': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_173_R_EN_MD.png',
  '至尊捕捉器': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TEF/TEF_157_R_EN_MD.png',
  '傷藥': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_188_R_EN_MD.png',

  // Basic Energies
  '基本火能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_002_R_EN_MD.png',
  '基本水能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_003_R_EN_MD.png',
  '基本電能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_004_R_EN_MD.png',
  '基本超能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_005_R_EN_MD.png',
  '基本草能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_001_R_EN_MD.png',
  '基本惡能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_007_R_EN_MD.png',
  '基本鋼能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_008_R_EN_MD.png'
};

// Retrieve custom card images uploaded by user (persisted in localStorage)
function getCustomCardImages() {
  try {
    return JSON.parse(localStorage.getItem('ptcg_custom_card_images') || '{}');
  } catch (e) {
    return {};
  }
}

function saveCustomCardImage(cardName, imageUrlOrDataUrl) {
  if (!cardName) return false;
  try {
    const images = getCustomCardImages();
    images[cardName.trim()] = imageUrlOrDataUrl;
    localStorage.setItem('ptcg_custom_card_images', JSON.stringify(images));
    return true;
  } catch (e) {
    console.error('saveCustomCardImage error:', e);
    return false;
  }
}

function removeCustomCardImage(cardName) {
  if (!cardName) return false;
  try {
    const images = getCustomCardImages();
    delete images[cardName.trim()];
    localStorage.setItem('ptcg_custom_card_images', JSON.stringify(images));
    return true;
  } catch (e) {
    return false;
  }
}

// Get the best matching image URL for a card (Custom upload > Card instance > Official mapping)
function getCardImageUrl(cardName, cardObj = null) {
  const name = (cardName || cardObj?.name || '').trim();
  if (!name) return null;

  // 1. User custom upload from localStorage
  const customImages = getCustomCardImages();
  if (customImages[name]) {
    return customImages[name];
  }

  // 2. Direct property on card object
  if (cardObj && cardObj.imageUrl) {
    return cardObj.imageUrl;
  }

  // 3. User authentic Charmander card (local asset)
  if (name === '小火龍' || name === '小恐龍') {
    return 'assets/cards/charmander.png';
  }

  // 4. Exact match in official dictionary
  if (OFFICIAL_CARD_IMAGES[name]) {
    return OFFICIAL_CARD_IMAGES[name];
  }

  // 5. Partial match (e.g. "噴火龍" matches "噴火龍ex")
  for (const [key, url] of Object.entries(OFFICIAL_CARD_IMAGES)) {
    if (name.includes(key) || key.includes(name)) {
      return url;
    }
  }

  return null;
}

function getCardArtEmoji(card) {
  if (!card) return '🐾';
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
  const imgUrl = getCardImageUrl(card.name, card);

  // If real card image exists, render image with interactive battle overlays and graceful fallback
  if (imgUrl) {
    return `
      <div class="ptcg-card ptcg-card-real" data-instance-id="${card.instanceId || ''}" style="${borderStyle}">
        <img class="ptcg-card-img" src="${imgUrl}" alt="${card.name}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
        
        <!-- Graceful fallback container if image fails to load -->
        <div class="ptcg-card-inner-fallback" style="display: none; width: 100%; height: 100%; flex-direction: column;">
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
        </div>

        <!-- Overlaid Game Indicators -->
        <div class="card-image-overlay-info">
          <span class="card-overlay-name">${card.name}</span>
          ${isPokemon ? `<span class="card-overlay-hp">HP ${currentHp}/${maxHp}</span>` : ''}
        </div>
        ${damageBadgeHtml}
        ${toolBadgeHtml}
        ${energyDotsHtml}
      </div>
    `;
  }

  // Classic stylized CSS card layout
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

// Global exports for browser window
if (typeof window !== 'undefined') {
  window.getCardImageUrl = getCardImageUrl;
  window.getCustomCardImages = getCustomCardImages;
  window.saveCustomCardImage = saveCustomCardImage;
  window.removeCustomCardImage = removeCustomCardImage;
  window.OFFICIAL_CARD_IMAGES = OFFICIAL_CARD_IMAGES;
  window.getCardArtEmoji = getCardArtEmoji;
  window.renderCardHtml = renderCardHtml;
  window.sfx = sfx;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCardImageUrl,
    getCustomCardImages,
    saveCustomCardImage,
    removeCustomCardImage,
    OFFICIAL_CARD_IMAGES,
    getCardArtEmoji,
    renderCardHtml
  };
}
