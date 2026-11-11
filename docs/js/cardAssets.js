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
  '超級能量回收棒': '🎣',
  '希望護身符': '⭐🛡️',
  '火箭隊的鈴鐺響': '🔔🚀',
  '寶可夢交換': '🔄',
  '聖灰': '🏺✨',
  '米可利': '🌊👑',
  '莉莉艾的決意': '🌸',
  '厲害釣竿': '🎣',
  '招式學習演進': '📜⚡',
  '雪童子': '❄️',
  '噴射能量': '🌀⚡',
  '水君V': '💧🐺',
  '裁判': '⚖️',
  '寶可夢平板': '📱',
  '麻花犬EX': '🍞🐾',
  '麻花犬ex': '🍞🐾',
  '狗仔包': '🥖',
  '火箭隊的謎擬Q': '👻🚀',
  '真菰': '👩‍🔬',
  '超級雪妖女ex': '❄️👘'
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
  '基本鋼能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVE/SVE_008_R_EN_MD.png',

  // Newly Added Cards
  '希望護身符': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SSP/SSP_162_R_EN_MD.png',
  '火箭隊的鈴鐺響': 'https://asia.pokemon-card.com/tw/card-img/tw00010995.png',
  '寶可夢交換': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_194_R_EN_MD.png',
  '聖灰': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/FLF/FLF_096_R_EN_MD.png',
  '米可利': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SIT/SIT_166_R_EN_MD.png',
  '莉莉艾的決意': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/CEC/CEC_196_R_EN_MD.png',
  '厲害釣竿': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_188_R_EN_MD.png',
  '招式學習演進': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_178_R_EN_MD.png',
  '雪童子': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAR/PAR_037_R_EN_MD.png',
  '噴射能量': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PAL/PAL_190_R_EN_MD.png',
  '水君V': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/EVS/EVS_031_R_EN_MD.png',
  '裁判': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_176_R_EN_MD.png',
  '寶可夢平板': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SSP/SSP_170_R_EN_MD.png',
  '麻花犬EX': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SCR/SCR_067_R_EN_MD.png',
  '麻花犬ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SCR/SCR_067_R_EN_MD.png',
  '狗仔包': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/SVI/SVI_098_R_EN_MD.png',
  '火箭隊的謎擬Q': 'https://asia.pokemon-card.com/tw/card-img/tw00010996.png',
  '真菰': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/BLW/BLW_097_R_EN_MD.png',
  '超級雪妖女ex': 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/TWM/TWM_054_R_EN_MD.png'
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

// ==========================================
// PTCG Card Usage Guides & Battle Manual (繁體中文詳細使用說明與對戰指南)
// ==========================================
const CARD_USAGE_GUIDES = {
  '高級球': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '主要階段 · 不限次數',
    timingClass: 'guide-badge-timing',
    effectText: '必須將自己的 2 張手牌丟棄才可使用。從自己的牌庫選擇 1 隻任意寶可夢卡（無論基礎、進化型或 ex 皆可），給對手看後加入手牌，重洗牌庫。',
    timingText: '在自己的回合【主要階段】可以使用任意數量的物品卡。使用後立即送入棄牌區。',
    tacticsTip: '全環境核心檢索牌！精準抓取 2 階進化主力（如噴火龍ex、大比鳥ex）或關鍵基礎怪。丟棄基本能量還能配合回收棒或特性再度利用！'
  },
  '巢穴球': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '主要階段 · 備戰區有空位',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的牌庫選擇 1 隻「基礎寶可夢」，直接放置於備戰區，重洗牌庫。',
    timingText: '在自己的回合【主要階段】使用，備戰區必須未滿 5 隻才可使用。使用後送入棄牌區。',
    tacticsTip: '最泛用的開局鋪場神器！零代價直接將小火龍、波波或密勒頓ex拉上備戰區。注意：此卡直接召喚至備戰區，不會觸發「從手牌登場時」的特性。'
  },
  '神奇糖果': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '跳階極速進化',
    timingClass: 'guide-badge-timing',
    effectText: '選擇自己場上 1 隻在場的基礎寶可夢，從手牌選擇能由該寶可夢進化的「2 階進化寶可夢」，跳過 1 階直接進化！',
    timingText: '基礎寶可夢剛放下的第 1 回合不可使用；先攻玩家的第 1 回合不可使用。',
    tacticsTip: '2 階牌組（噴火龍ex、多龍巴魯托ex、大比鳥ex）的極速成型引擎！省去 1 階進化卡卡手的風險，第 2 回合即可直接成型出擊。'
  },
  '寶可夢交替': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '解除異常 · 戰鬥換位',
    timingClass: 'guide-badge-timing',
    effectText: '將自己的戰鬥寶可夢與備戰區的 1 隻寶可夢互換位置。',
    timingText: '在自己的回合【主要階段】使用，備戰區必須至少有 1 隻寶可夢。',
    tacticsTip: '0 撤退費用換位神卡！能瞬間解除麻痺、混亂、睡眠、中毒等所有戰鬥異常狀態，或將殘血主力撤至後排由備用打手上陣。'
  },
  '超級能量回收棒': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '資源循環 · 洗回牌庫',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的棄牌區選擇「寶可夢卡」與「基本能量卡」合計最多 3 張，給對手看後洗回自己的牌庫。',
    timingText: '在自己的回合【主要階段】使用，棄牌區有目標卡片時使用。',
    tacticsTip: '中後期資源續航關鍵！將被擊倒的王牌主力或消耗的能量洗回牌庫，配合大比鳥ex或高級球再次抓出，防止牌庫抽空。'
  },
  '大地之器': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '精準濾能 · 棄牌聯動',
    timingClass: 'guide-badge-timing',
    effectText: '必須丟棄 1 張手牌才可使用。從自己的牌庫選擇最多 2 張「基本能量卡」，給對手看後加入手牌，重洗牌庫。',
    timingText: '在自己的回合【主要階段】使用，丟棄 1 張手牌作為代價。',
    tacticsTip: '壓縮牌庫與穩定手動填能的王牌！檢索 2 張能量後，可確保本回合填能並為後續招式提供充足能量儲備。'
  },
  '傷藥': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '即時回血 · 破壞斬殺',
    timingClass: 'guide-badge-timing',
    effectText: '選擇自己的 1 隻寶可夢（戰鬥場或備戰區皆可），恢復其 30 點 HP。',
    timingText: '在自己的回合【主要階段】隨時使用，目標寶可夢身上有傷害指示物時最有效。',
    tacticsTip: '微妙改變對手的斬殺線計算！有時僅差 10~30 點傷害就能使主力在對手下一輪猛攻中奇蹟存活。'
  },
  '反擊捕獲器': {
    categoryBadge: '🎒 物品卡 (逆轉專用)',
    categoryClass: 'guide-badge-item',
    timingBadge: '落後局勢 · 免耗支援者',
    timingClass: 'guide-badge-timing',
    effectText: '【逆境限定】只有在自己的剩餘獎賞卡張數「多於」對手時才可使用。選擇對手的 1 隻備戰寶可夢強制拉上戰鬥場！',
    timingText: '當自己獎賞卡比對手多（處於落後狀態）時，在【主要階段】使用。',
    tacticsTip: '超級逆轉神卡！在不消耗每回合唯一 1 張支援者次數的情況下，發動老大的指令效果，本回合還能同時使用博士或奇樹強勢反撲！'
  },
  '勇氣護符': {
    categoryBadge: '🛡️ 寶可夢道具卡',
    categoryClass: 'guide-badge-tool',
    timingBadge: '每隻寶可夢限攜帶1張',
    timingClass: 'guide-badge-timing',
    effectText: '附有這張卡的「基礎寶可夢」，其最大 HP 增加 50 點。',
    timingText: '在自己的回合【主要階段】附在自己的基礎寶可夢身上。每隻寶可夢同一時間只能附上 1 張道具，不可隨意拆卸更換。',
    tacticsTip: '讓轟鳴月ex、密勒頓ex或古劍豹ex等基礎打手血量直接提升至 270~280，完美避開對手常見的 220 點一擊斬殺線！'
  },
  '至尊捕捉器': {
    categoryBadge: '⭐ 【ACE SPEC】王牌道具',
    categoryClass: 'guide-badge-acespec',
    timingBadge: '牌組限放1張 · 雙向換位',
    timingClass: 'guide-badge-acespec',
    effectText: '選擇對手的 1 隻備戰寶可夢強制與其戰鬥寶可夢互換；接著將自己的戰鬥寶可夢與備戰寶可夢互換。',
    timingText: '在自己的回合【主要階段】使用。全牌組僅限放入 1 張 ACE SPEC 卡片。',
    tacticsTip: '集合「老大的指令」與「寶可夢交替」於一身的終極戰略卡！既能抓殺對手核心，又能讓自己充好能量的後排主力無痛登場直接宣告攻擊！'
  },
  '博士的研究': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '每回合限用1張 · 先攻首回不可',
    timingClass: 'guide-badge-timing',
    effectText: '將自己的所有手牌全部丟棄，然後從牌庫抽取 7 張卡片。',
    timingText: '在自己的回合【主要階段】使用。每回合全場限用 1 張支援者卡，【先攻第 1 回合不可使用】。使用後進入棄牌區。',
    tacticsTip: '全遊戲最強大的暴抽補牌手牌！在手牌消耗完畢或卡手時使用，瞬間將手牌補滿至 7 張，極大幅度推進戰略展開。'
  },
  '老大的指令': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '每回合限用1張 · 先攻首回不可',
    timingClass: 'guide-badge-timing',
    effectText: '選擇對手的 1 隻備戰寶可夢，強制與其戰鬥場上的寶可夢互換。',
    timingText: '在自己的回合【主要階段】使用。每回合限用 1 張支援者卡，【先攻第 1 回合不可使用】。使用後進入棄牌區。',
    tacticsTip: '最致命的收頭與干擾卡！拉出對手殘血的高分寶可夢ex完成斬殺奪取獎賞卡，或拉出對手高撤退費用的輔助怪拖延對手進攻節奏。'
  },
  '奇樹': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '雙向洗牌 · 殘局干擾',
    timingClass: 'guide-badge-timing',
    effectText: '雙方玩家各自將全部手牌洗牌後放回牌庫下方。之後，雙方各自依自己「剩餘的獎賞卡張數」從牌庫上方抽取卡片。',
    timingText: '在自己的回合【主要階段】使用。每回合限用 1 張支援者卡，【先攻第 1 回合不可使用】。使用後進入棄牌區。',
    tacticsTip: 'PTCG最強的逆轉洗手牌神卡！落後時發動，對手可能只剩 1~2 張獎賞卡，會被強制縮減為 1~2 張手牌，極易造成對手斷資源而翻盤！'
  },
  '派帕': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '雙重檢索 · 穩定展開',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的牌庫選擇 1 張「物品卡」與 1 張「寶可夢道具卡」，給對手看後加入手牌，重洗牌庫。',
    timingText: '在自己的回合【主要階段】使用。每回合限用 1 張支援者卡，【先攻第 1 回合不可使用】。使用後進入棄牌區。',
    tacticsTip: '精準調度大師！一張牌直接找齊「神奇糖果」+「勇氣護符」或「高級球」+「封印石/輕石」，完美保證進化鏈與防禦裝備一次到位。'
  },
  '基本火能量': {
    categoryBadge: '🔥 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點火屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '可配合噴火龍ex特性【煉獄支配】直接從牌庫抓取附加，極速蓄能！'
  },
  '基本水能量': {
    categoryBadge: '💧 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點水屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '配合戟脊龍特性【極冰之心】可在一回合內從手牌無限次附加，為古劍豹ex蓄積毀天滅地的爆發能量！'
  },
  '基本電能量': {
    categoryBadge: '⚡ 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點電屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '密勒頓ex與鐵臂膀ex的核心能源，配合充能裝備迅速達到【增幅重拳】所需費用。'
  },
  '基本草能量': {
    categoryBadge: '🌿 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點草屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '配合厄鬼椪ex【青翠之舞】每回合可多填 1 張並抽 1 張牌，維持流暢節奏。'
  },
  '基本超能量': {
    categoryBadge: '🔮 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點超屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '配合沙奈朵ex特性【靈魂超心理學】，可直接從棄牌堆無限回填至超能寶可夢身上！'
  },
  '基本鬥能量': {
    categoryBadge: '🥊 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點鬥屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '克制雷屬性與惡屬性的天然利器，為格鬥主力提供強悍打擊威力。'
  },
  '基本惡能量': {
    categoryBadge: '🌑 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點惡屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '轟鳴月ex的核心能量，配合古代加速道具快速發動一擊必殺技【狂怒粉碎】。'
  },
  '基本鋼能量': {
    categoryBadge: '⚙️ 基本能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '每回合手動貼1張',
    timingClass: 'guide-badge-timing',
    effectText: '提供 1 點鋼屬性能量，供寶可夢使出招式或支付撤退費用。',
    timingText: '【主要階段】每回合只能從手牌手動附加 1 張能量卡至自己場上的 1 隻寶可夢身上。',
    tacticsTip: '高耐久鋼系防線的堅實後盾，提供防守反擊的能量動能。'
  },
  '小火龍': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 70。火屬性基礎寶可夢。可於後續回合進化為火恐龍，或配合「神奇糖果」跳階進化為噴火龍ex。',
    timingText: '【主要階段】在自己的回合，備戰區未滿 5 隻時可隨時從手牌直接放置到備戰區。',
    tacticsTip: '開局優先使用「巢穴球」展開小火龍至備戰區，為下回合進化「噴火龍ex」做好準備！'
  },
  '火恐龍': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由小火龍進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 90。火屬性 1 階寶可夢。重疊在場上的「小火龍」身上完成進化。招式【龍息】可造成 40 傷害。',
    timingText: '不可在小火龍剛登場的第一回合進化，亦不可在先攻玩家第 1 回合進化。',
    tacticsTip: '當手牌沒有神奇糖果時的重要進化過渡橋樑，確保進化鏈不中斷。'
  },
  '噴火龍ex': {
    categoryBadge: '🔥 2 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '需進化 · 【ex規則】昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 330。惡屬性泰拉寶可夢ex。【特性：煉獄支配】進化登場時，從牌庫找最多 3 張基本火能量任意附加給自己的寶可夢！【招式：紅蓮爆炎】基礎 180 傷害，對手每拿 1 張獎賞卡傷害再 +30！',
    timingText: '由火恐龍進化，或使用「神奇糖果」從小火龍直接進化。',
    tacticsTip: '絕對的主力核心王牌！自身血量極高、招式在劣勢時可高達 330 點傷害一擊秒殺，進化時的特性還能為全隊瞬間充能完畢！'
  },
  '波波': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 60。無色基礎寶可夢。起手直接放置於場上或備戰區，為大比鳥ex進化基礎。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '第一回合建議與小火龍一同鋪場，保障第 2 回合的大比鳥進化鏈。'
  },
  '比比鳥': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由波波進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 80。無色 1 階進化寶可夢。重疊在波波身上完成進化。',
    timingText: '不可在波波剛登場的第 1 回合進化。',
    tacticsTip: '若未抽到神奇糖果，可先進化為比比鳥以確保次輪能順利升級為大比鳥ex。'
  },
  '大比鳥ex': {
    categoryBadge: '🦅 2 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '特性萬能檢索 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 280。無色 2 階進化寶可夢ex。【特性：音速搜尋】在自己的回合，可從牌庫任意選擇 1 張卡片加入手牌（每回合限用1次）！招式【神速攻擊】可造成 120 傷害並可換場。',
    timingText: '由比比鳥進化，或配合「神奇糖果」由波波直接進化。',
    tacticsTip: '全環境最頂級的萬能導航引擎！每回合無條件自由抓取任何需要的卡片（老大的指令、能量、糖果、打手），讓戰術執行率達 100%！'
  },
  '皮卡丘ex': {
    categoryBadge: '⚡ 基礎寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '起手直接登場 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 200。雷屬性基礎寶可夢ex。招式【十萬伏特】可爆發造成 220 點毀滅性傷害！',
    timingText: '【主要階段】可直接從手牌置於備戰區或作為起手戰鬥寶可夢。',
    tacticsTip: '極高爆發的高速雷系打手！220 點傷害足以一擊秒殺絕大多數基礎寶可夢ex或V寶可夢。'
  },
  '皮卡丘': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 70。雷屬性基礎寶可夢。起手直接放置於場上，後續可進化為雷丘。',
    timingText: '【主要階段】直接從手牌放置至備戰區。',
    tacticsTip: '開局鋪場並準備進化為高攻擊力的雷丘。'
  },
  '雷丘': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由皮卡丘進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 120。雷屬性 1 階進化寶可夢。重疊在皮卡丘身上進化。招式【雷電爆發】可造成高額傷害。',
    timingText: '不可在皮卡丘剛登場的第 1 回合進化。',
    tacticsTip: '非規則單獎賞打手！配合充足能量可打出媲美ex的傷害，在獎賞卡交換上極具優勢。'
  },
  '密勒頓ex': {
    categoryBadge: '⚡ 基礎寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '極速鋪場特性 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 220。雷屬性基礎寶可夢ex。【特性：艾聯單元】在自己的回合，可從牌庫選擇最多 2 隻雷屬性基礎寶可夢直接放置於備戰區！招式【光子激光】可造成 220 傷害。',
    timingText: '【主要階段】直接從手牌放置上場即可發動特性。',
    tacticsTip: '雷隊絕對的鋪場發動機！單張卡瞬間抓滿備戰區（如皮卡丘、鐵臂膀ex），下回合直接滿員出擊！'
  },
  '鐵臂膀ex': {
    categoryBadge: '🦾 基礎未來寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '搶獎賞卡神器 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 230。雷屬性基礎寶可夢ex。【招式：增幅重拳】120 傷害；若使用此招式將對手的寶可夢昏厥，自己「額外多拿 1 張獎賞卡」！',
    timingText: '【主要階段】直接放置於備戰區，需充填足夠能量（雷雷無無）。',
    tacticsTip: '搶分大殺器！擊倒對手的非規則小怪可直接拿 2 張獎賞卡，擊倒 ex 更是直接拿 3 張！大幅縮短對局回合。'
  },
  '古劍豹ex': {
    categoryBadge: '❄️ 基礎寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '特性濾能 · 無限爆發',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 220。水屬性基礎寶可夢ex。【特性：凍結冰柱】在戰鬥場時，可從牌庫搜尋最多 2 張基本水能量加入手牌。招式【冰雹狂雪】可將場上任意數量的水能量丟棄，每丟棄 1 張造成 60 點傷害！',
    timingText: '【主要階段】直接登場。需在戰鬥場時發動特性。',
    tacticsTip: '水系極限爆發主力！配合戟脊龍無限填能，丟棄 5~6 張水能量可直接打出 300~360 傷害，瞬間秒殺任何 2 階大怪！'
  },
  '涼脊龍': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 70。水屬性基礎寶可夢。戟脊龍進化的基礎。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '開局優先拉出涼脊龍，準備後續進化戟脊龍開啟無限填能模式。'
  },
  '凍脊龍': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由涼脊龍進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 90。水屬性 1 階進化寶可夢。重疊在涼脊龍身上進化。',
    timingText: '不可在涼脊龍剛登場的第 1 回合進化。',
    tacticsTip: '進化過渡，若未抽到神奇糖果可經由此卡進化成戟脊龍。'
  },
  '戟脊龍': {
    categoryBadge: '❄️ 2 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '無限填水能量引擎',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 160。水屬性 2 階寶可夢。【特性：極冰之心】在自己的回合，可不限次數手動將手牌中的基本水能量附加給自己的寶可夢！',
    timingText: '由凍脊龍進化，或使用「神奇糖果」由涼脊龍直接進化。',
    tacticsTip: '水牌絕對的發動機！配合大地之器或古劍豹ex抓滿手水能量，瞬間全貼上場打出致死傷害。'
  },
  '光輝甲賀忍蛙': {
    categoryBadge: '🐸 輝耀基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '牌組限放1張光輝卡 · 特性抽牌',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 130。水屬性光輝寶可夢。【特性：隱匿手裡劍】從手牌丟棄 1 張基本能量，從牌庫抽 2 張卡！招式【月光手裡劍】丟棄 2 個能量，直接狙擊對手任意 2 隻寶可夢各造成 90 點傷害！',
    timingText: '全牌組僅限放入 1 張「光輝」寶可夢。直接放置備戰區。',
    tacticsTip: '濾牌與後排雙殺神器！一招月光手裡劍能同時擊殺對手後排 2 隻基礎怪（如小火龍+波波），開局直接打崩對手發動機！'
  },
  '轟鳴月ex': {
    categoryBadge: '🌙 基礎古代寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '強制一擊必殺 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 230。惡屬性古代基礎寶可夢ex。招式【狂怒粉碎】無視對手剩餘血量與防禦，直接讓對手的戰鬥寶可夢氣絕昏厥（自身承受 200 點自傷）；招式【災禍羽翼】可造成 220 傷害。',
    timingText: '【主要階段】直接從手牌置於備戰區。',
    tacticsTip: '無視任何血量的一擊必殺終結者！專門用於強殺對手滿血 330 HP 的巨型 ex 主力（如噴火龍ex、大比鳥ex）。'
  },
  '多龍巴魯托ex': {
    categoryBadge: '🐉 2 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '穿透狙擊雙殺 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 320。龍屬性 2 階進化寶可夢ex。招式【幽靈潛水】（超火能量）對戰鬥場造成 200 點重創，同時自由分配 6 個傷害指示物（60傷害）到對手的備戰區寶可夢！',
    timingText: '由多龍奇進化，或使用神奇糖果由多龍梅西亞進化。',
    tacticsTip: '當前環境最強打手之一！前排 200 傷害外加後排精準補刀，能邊打主力邊消滅對手的備戰小怪，極度難以應對。'
  },
  '多龍梅西亞': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 70。超屬性基礎寶可夢。多龍進化鏈的起點。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '起手快速鋪場，為後續多龍奇與多龍巴魯托ex進化做準備。'
  },
  '多龍奇': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由多龍梅西亞進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 90。龍屬性 1 階寶可夢。【特性：幽暗指令】每回合可看牌庫頂 2 張卡，選 1 張入手，另一張放牌庫底。',
    timingText: '不可在多龍梅西亞登場首回合進化。',
    tacticsTip: '後排神級過牌引擎！場上多隻多龍奇每回合可穩定獲取 2~4 張關鍵卡，即使主力未進化也能穩定運轉。'
  },
  '沙奈朵ex': {
    categoryBadge: '🔮 2 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '棄牌堆無限充能 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 310。超屬性 2 階進化寶可夢ex。【特性：靈魂超心理學】在自己的回合，可不限次數從棄牌堆將基本超能量附加給自己的超屬性寶可夢（每附加 1 張在其身上放置 2 個傷害指示物）。',
    timingText: '由奇魯莉安進化，或使用神奇糖果由拉魯拉絲進化。',
    tacticsTip: '超能軍團的永動機！無限回填能量給吼叫尾狙擊後排，或給自身打出超高額超能攻擊。'
  },
  '拉魯拉絲': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 70。超屬性基礎寶可夢。沙奈朵進化的起點。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '開局盡速展開 2 隻以上拉魯拉絲，保證進化鏈不中斷。'
  },
  '奇魯莉安': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由拉魯拉絲進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 90。超屬性 1 階寶可夢。【特性：精鍊】每回合丟棄 1 張手牌抽 2 張卡！',
    timingText: '不可在拉魯拉絲剛登場的首回合進化。',
    tacticsTip: '極致濾牌手！同時能把超能量送入棄牌堆，為沙奈朵ex的特性充能做完美鋪墊。'
  },
  '吼叫尾': {
    categoryBadge: '📢 基礎古代寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '遠程超長狙擊手',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 90。超屬性古代基礎寶可夢。招式【咆哮吶喊】根據自己身上所放置的傷害指示物數量，對對手任意 1 隻寶可夢造成「指示物數量 × 20 點」的遠程狙擊傷害！',
    timingText: '【主要階段】直接置於備戰區。',
    tacticsTip: '配合沙奈朵ex特性貼能量時自傷的特性，能輕鬆累積 4~8 個傷害指示物，直接遠程狙殺對手後排 80~160 滴血的關鍵怪！'
  },
  '洛奇亞V': {
    categoryBadge: '🌀 基礎V寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於場上 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 220。無色基礎V寶可夢。洛奇亞VSTAR的進化基礎。',
    timingText: '【主要階段】直接置於戰鬥場或備戰區。',
    tacticsTip: '首回合盡快進場並做好防護，次輪準備進化為洛奇亞VSTAR發動星力！'
  },
  '洛奇亞VSTAR': {
    categoryBadge: '⭐ VSTAR 進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: 'VSTAR力量 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 280。無色 VSTAR 進化寶可夢。【VSTAR力量：召喚之星】每局限用 1 次，可直接從棄牌堆將最多 2 隻無屬性非規則寶可夢（如始祖大鳥）放置到備戰區！招式【暴風雨突擊】可造成 220 傷害。',
    timingText: '重疊在洛奇亞V身上進化。',
    tacticsTip: '傳奇特能流核心！一鍵召喚 2 隻始祖大鳥，每回合自產 4 張特殊能量，瞬間起飛！'
  },
  '始祖大鳥': {
    categoryBadge: '🦅 2 階復原寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '特能調度引擎',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 150。無色 2 階寶可夢。【特性：原始呼喚】每回合可從牌庫搜尋最多 2 張特殊能量卡，直接附給自己的寶可夢！',
    timingText: '通常配合洛奇亞VSTAR的特性直接從棄牌堆召喚進場。',
    tacticsTip: '兩隻始祖大鳥每回合可為隊伍充能 4 張特殊能量，瞬間成型任何無色打手！'
  },
  '卡比獸': {
    categoryBadge: '💤 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '戰鬥場封鎖撤退',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 150。無色基礎寶可夢。【特性：擋路】只要卡比獸在戰鬥場，對手的戰鬥寶可夢就無法撤退！',
    timingText: '【主要階段】置於戰鬥場或備戰區。',
    tacticsTip: '控制與鎖場流代表！配合「老大的指令」將對手沒有攻擊力的輔助怪拉上戰鬥場，卡死對手並抽乾其牌庫！'
  },
  '厄鬼椪ex': {
    categoryBadge: '🎭 基礎寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '填能抽牌機動打手 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 210。草屬性基礎寶可夢ex。【特性：青翠之舞】每回合可從手牌附 1 張基本草能量到自身並抽 1 張牌！招式【落葉重擊】140 傷害。',
    timingText: '【主要階段】直接從手牌置於備戰區。',
    tacticsTip: '極佳的副打手與能量抽濾輔助，為草系隊伍提供穩定的手牌補充。'
  },
  '魔幻假面喵ex': {
    categoryBadge: '🐱 2 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '遠程點傷特性 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 310。草屬性 2 階進化寶可夢ex。【特性：花束魔術】從手牌丟棄 1 張基本草能量，給對手備戰區 1 隻寶可夢放置 3 個傷害指示物（30傷害）！',
    timingText: '由蒂蕾喵進化，或使用神奇糖果由新葉喵進化。',
    tacticsTip: '每回合無損耗遠程點傷，配合戰鬥場招式可精準收割對手後排殘血寶可夢。'
  },
  '新葉喵': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 70。草屬性基礎寶可夢。魔幻假面喵進化的起點。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '起手鋪場並保護好，準備進化為魔幻假面喵ex。'
  },
  '蒂蕾喵': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '由新葉喵進化',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 90。草屬性 1 階進化寶可夢。重疊在新葉喵身上進化。',
    timingText: '不可在新葉喵登場首回合進化。',
    tacticsTip: '過渡進化型，確保後續順利進化為魔幻假面喵ex。'
  },
  '超夢ex': {
    categoryBadge: '🔮 基礎寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '超能重砲主力 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 220。超屬性基礎寶可夢ex。招式【精神光束】與【超能爆發】，具備極高的正面壓制與一擊致勝威力。',
    timingText: '【主要階段】直接從手牌置於場上。',
    tacticsTip: '超能隊主力打手之一，配合沙奈朵ex快速充能後能打出強大傷害。'
  },
  '天然雀': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 50。超屬性基礎寶可夢。天然鳥的進化起點。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '保護好天然雀，為下回合天然鳥的過牌特性鋪路。'
  },
  '天然鳥': {
    categoryBadge: '⚡ 1 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '特性填能抽牌',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 100。超屬性 1 階寶可夢。【特性：預知飛翔】在自己的回合，當從手牌附加 1 張基本超能量給自己的備戰寶可夢時，從牌庫抽 2 張卡！',
    timingText: '重疊在天然雀身上進化。',
    tacticsTip: '超強的過牌填能特性，為超能隊伍提供源源不絕的手牌補充。'
  },
  '耿鬼': {
    categoryBadge: '👻 2 階進化寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '詛咒干擾',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 130。超屬性 2 階進化寶可夢。招式【暗影詛咒】能在對手身上散播傷害指示物，打亂對手節奏。',
    timingText: '不可在登場首回合進化。',
    tacticsTip: '控制與折磨流打法，適合搭配點傷型寶可夢持續削弱對手全隊血量。'
  },
  '光輝胡地': {
    categoryBadge: '🥄 輝耀基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '牌組限放1張光輝卡 · 特性移傷',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 130。超屬性光輝寶可夢。【特性：勺子彎曲】在自己的回合，可將場上對手寶可夢身上的最多 2 個傷害指示物（20傷害），自由移動到對手另一隻寶可夢身上！',
    timingText: '全牌組僅限放入 1 張「光輝」寶可夢。直接置於備戰區。',
    tacticsTip: '補刀神技！將多餘的過剩傷害轉移給對手殘血怪，直接完成收頭拿下獎賞卡！'
  },
  '希望護身符': {
    categoryBadge: '⭐ 【ACE SPEC】王牌道具',
    categoryClass: 'guide-badge-acespec',
    timingBadge: '牌組限放1張 · 氣絕檢索',
    timingClass: 'guide-badge-acespec',
    effectText: '【ACE SPEC】附有這張卡的寶可夢，受到對手的寶可夢招式的傷害而【昏厥】時，從自己的牌庫任意選擇最多 3 張卡加入手牌，重洗牌庫。',
    timingText: '【主要階段】附在場上的寶可夢身上。每隻寶可夢限攜帶 1 張道具，全牌組限放 1 張 ACE SPEC。',
    tacticsTip: '頂級防禦威懾王牌！附在主力身上，一旦對手擊殺它，立即無條件從牌庫抓 3 張任意關鍵牌（如打手、填能、老大的指令）瞬間滿血復仇反擊！'
  },
  '火箭隊的鈴鐺響': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 30。超屬性基礎寶可夢。招式【鈴鈴吵鬧】（無色能量）：在不看正面的情況下，從對手手牌隨機選擇 1 張將其丟棄！',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '極度惡劣的手牌破壞騷擾手！1 顆能量盲拆對手手牌，打亂對手下回合的進攻計畫。'
  },
  '寶可夢交換': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '解除異常 · 戰鬥換位',
    timingClass: 'guide-badge-timing',
    effectText: '將自己的戰鬥寶可夢與備戰區的 1 隻寶可夢互換位置。',
    timingText: '在自己的回合【主要階段】使用，備戰區必須至少有 1 隻寶可夢。',
    tacticsTip: '0 撤退費用換位神卡！瞬間解除所有戰鬥異常狀態，並讓後排主力無損上陣攻擊。'
  },
  '聖灰': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '資源大回收 · 洗回牌庫',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的棄牌區選擇最多 5 張寶可夢卡，給對手看過後洗回自己的牌庫。',
    timingText: '在自己的回合【主要階段】使用。',
    tacticsTip: '超大量的寶可夢資源續航！一次將多達 5 隻被擊倒的主力與進化鏈洗回牌庫，避免牌庫抽乾或主力斷檔。'
  },
  '米可利': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '每回合限用1張 · 先攻首回不可',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的牌庫抽取 3 張卡。若自己的戰鬥寶可夢為水屬性，則改為抽取 4 張卡！',
    timingText: '在自己的回合【主要階段】使用，每回合限用 1 張支援者。',
    tacticsTip: '水屬性隊伍專屬強效過牌手，配合古劍豹ex或水君V在戰鬥場時可穩定補充 4 張手牌！'
  },
  '莉莉艾的決意': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '開局暴抽8張 · 手牌洗牌',
    timingClass: 'guide-badge-timing',
    effectText: '將自己的手牌全部洗回牌庫並重洗。然後從牌庫抽出 6 張卡；若自己剩餘獎賞卡張數為 6 張（開局時），則改為抽出 8 張卡！',
    timingText: '在自己的回合【主要階段】使用，每回合限用 1 張支援者。',
    tacticsTip: '開局第一動或前期極致手牌補充神卡！在滿獎賞卡狀態下直接抽滿 8 張新資源，極速展開全場陣容。'
  },
  '厲害釣竿': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '資源循環 · 洗回牌庫',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的棄牌區選擇「寶可夢卡」與「基本能量卡」合計最多 3 張，給對手看後洗回自己的牌庫。',
    timingText: '在自己的回合【主要階段】使用。',
    tacticsTip: '環境必備的續航神卡！回收核心打手與能量回牌庫，配合檢索手段反覆使用。'
  },
  '招式學習演進': {
    categoryBadge: '🛡️ 寶可夢道具卡',
    categoryClass: 'guide-badge-tool',
    timingBadge: '每隻限攜帶1張 · 回合結束丟棄',
    timingClass: 'guide-badge-timing',
    effectText: '【寶可夢道具】附有這張卡的寶可夢可以使用招式【演進】（無色能量）：從自己的牌庫選擇最多 2 隻備戰寶可夢，各自選擇對應的進化卡直接放置其上完成進化！在自己的回合結束時丟棄此卡。',
    timingText: '【主要階段】附在場上的寶可夢身上。',
    tacticsTip: '後攻第一回合神技！使用 1 顆能量直接在後排同時進化 2 隻寶可夢（如波波變比比鳥、小火龍變火恐龍），比神奇糖果還穩定防截斷！'
  },
  '雪童子': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 60。水屬性基礎寶可夢。招式【驚嚇】（水能量，20傷害）：在不看正面的情況下，從對手手牌隨機選 1 張查看後洗回對手牌庫！可進化為超級雪妖女ex。',
    timingText: '【主要階段】直接置於備戰區。',
    tacticsTip: '起手騷擾對手關鍵手牌，並為後續進化「超級雪妖女ex」做好準備。'
  },
  '噴射能量': {
    categoryBadge: '🌀 特殊能量卡',
    categoryClass: 'guide-badge-energy',
    timingBadge: '手貼強制換位',
    timingClass: 'guide-badge-acespec',
    effectText: '只要這張卡附於寶可夢身上，視為提供 1 個無色能量。當從手牌附於「備戰寶可夢」身上時，必須將該備戰寶可夢與自己的戰鬥寶可夢互換！',
    timingText: '【主要階段】每回合限手動貼 1 張能量。',
    tacticsTip: '填能與換位合二為一的神卡！不用消耗交替物品卡，直接為後排打手貼能量並瞬間切換至戰鬥場立即進攻！'
  },
  '水君V': {
    categoryBadge: '💧 基礎寶可夢 (V)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '瞬步過牌 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 210。水屬性基礎寶可夢V。【特性：瞬步】在戰鬥場時，每回合可抽 1 張卡。【招式：暴雪迴旋曲】（水無能量，20+傷害）：雙方備戰寶可夢數量 × 20 點追加傷害（滿編時高達 220 傷害）！',
    timingText: '【主要階段】直接從手牌置於場上。',
    tacticsTip: '極度靈活的高速水系打手！自帶每回合免費抽牌特性，且僅需 2 顆能量就能配合雙方鋪場打出 220 點高額爆發！'
  },
  '裁判': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '雙向洗手牌 · 限制4張',
    timingClass: 'guide-badge-timing',
    effectText: '雙方玩家各自將全部手牌洗回牌庫。接著，雙方各自從牌庫頂部抽取 4 張卡。',
    timingText: '在自己的回合【主要階段】使用，每回合限用 1 張支援者。',
    tacticsTip: '極強的手牌壓制牌！當對手手牌大量囤積（如 7~10 張）時使用，瞬間將其手牌強制削減至 4 張，大幅壓制對手展開。'
  },
  '寶可夢平板': {
    categoryBadge: '🎒 物品卡',
    categoryClass: 'guide-badge-item',
    timingBadge: '非規則寶可夢精準檢索',
    timingClass: 'guide-badge-timing',
    effectText: '從自己的牌庫選擇 1 張「非規則寶可夢」（非 ex、非 V、非輝耀）加入手牌，重洗牌庫。',
    timingText: '在自己的回合【主要階段】使用，不限次數。',
    tacticsTip: '非規則隊伍或輔助怪（如大比鳥進化前、奇魯莉安、始祖大鳥、夜巡靈等）的無消耗精準檢索神卡！'
  },
  '麻花犬EX': {
    categoryBadge: '🍞 1 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '全隊滿血神級恢復 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 250。超屬性 1 階寶可夢ex。重疊在狗仔包身上進化。【特性：飽腹時間】從手牌進化登場時，將自己所有進化寶可夢的 HP 完全恢復！然後將恢復寶可夢身上的能量全部丟棄。【招式：奇跡閃耀】（無無能量，130傷害）：使對手戰鬥寶可夢混亂。',
    timingText: '由狗仔包進化。',
    tacticsTip: '全隊瞬間滿血的超強急救神犬！在噴火龍ex、沙奈朵ex等大怪殘血時進化，瞬間清除全部傷害指示物，直接讓對手的攻擊化為烏有！'
  },
  '麻花犬ex': {
    categoryBadge: '🍞 1 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '全隊滿血神級恢復 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 250。超屬性 1 階寶可夢ex。重疊在狗仔包身上進化。【特性：飽腹時間】從手牌進化登場時，將自己所有進化寶可夢的 HP 完全恢復！然後將恢復寶可夢身上的能量全部丟棄。【招式：奇跡閃耀】（無無能量，130傷害）：使對手戰鬥寶可夢混亂。',
    timingText: '由狗仔包進化。',
    tacticsTip: '全隊瞬間滿血的超強急救神犬！在噴火龍ex、沙奈朵ex等大怪殘血時進化，瞬間清除全部傷害指示物，直接讓對手的攻擊化為烏有！'
  },
  '狗仔包': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 60。超屬性基礎寶可夢。招式【香味】（超能量）：從自己的牌庫選擇 1 隻基礎寶可夢放置於備戰區，重洗牌庫。可進化為麻花犬EX。',
    timingText: '【主要階段】備戰區未滿 5 隻時直接放置。',
    tacticsTip: '起手鋪場好手，為下回合進化「麻花犬EX」發動全隊回血特性做準備。'
  },
  '火箭隊的謎擬Q': {
    categoryBadge: '⭐ 基礎寶可夢',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區',
    timingClass: 'guide-badge-timing',
    effectText: 'HP 60。超屬性基礎寶可夢。招式【扮晶晶酒】（超無能量，30傷害）：可選擇對手戰鬥場上太晶寶可夢的 1 個招式作為此招式使用！',
    timingText: '【主要階段】直接置於戰鬥場或備戰區。',
    tacticsTip: '以彼之道還施彼身！能複製對手強大太晶寶可夢（如太晶噴火龍ex、多龍巴魯托ex）的招式反擊對手！'
  },
  '真菰': {
    categoryBadge: '👤 支援者卡',
    categoryClass: 'guide-badge-supporter',
    timingBadge: '全隊回血40點 · 支援者',
    timingClass: 'guide-badge-timing',
    effectText: '將自己場上的所有寶可夢（戰鬥場與備戰區全體）各恢復 40 點 HP。',
    timingText: '在自己的回合【主要階段】使用，每回合限用 1 張支援者。',
    tacticsTip: '群體群補神卡！能一舉破壞對手後排點傷（如多龍巴魯托ex的幽靈潛水、忍蛙的手裡劍）的傷害計算，保全後排關鍵輔助怪。'
  },
  '超級雪妖女ex': {
    categoryBadge: '❄️ 1 階進化寶可夢 (ex)',
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '手牌殺傷暴擊 · 昏厥拿2張獎賞卡',
    timingClass: 'guide-badge-acespec',
    effectText: 'HP 310。水屬性 1 階寶可夢ex。由雪童子進化。【招式：怨言】（水無能量，50x傷害）：造成對手手牌張數 × 50 點巨額傷害！【招式：純粹雪】（水水無能量，150傷害）：使對手陷入睡眠狀態。',
    timingText: '重疊在雪童子身上進化。',
    tacticsTip: '手牌毀滅者！當對手手牌累積 6~7 張時，一招【怨言】能打出 300~350 點爆炸傷害，足以一擊秒殺滿血 330 HP 的巨型 ex 主力！'
  }
};

/**
 * 取得卡片的簡單使用說明與戰術指南
 * @param {Object} card 
 * @returns {Object} { categoryBadge, categoryClass, timingBadge, timingClass, effectText, timingText, tacticsTip }
 */
function getCardUsageGuide(card) {
  if (!card) return null;
  const name = String(card.name || '').trim();

  // 1. 精確卡名查詢
  if (CARD_USAGE_GUIDES[name]) {
    return CARD_USAGE_GUIDES[name];
  }

  // 2. 模糊卡名查詢
  for (const [k, guide] of Object.entries(CARD_USAGE_GUIDES)) {
    if (name.includes(k) || k.includes(name)) {
      return guide;
    }
  }

  // 3. 智慧規則生成器 (Fallback Generator for custom cards or newly synthesized cards)
  const isAceSpec = card.isAceSpec || (card.subtypes && card.subtypes.includes('ACE SPEC'));
  const supertype = card.supertype || 'pokemon';
  const subtypes = card.subtypes || [];

  if (supertype === 'energy') {
    return {
      categoryBadge: '⚡ 能量卡',
      categoryClass: 'guide-badge-energy',
      timingBadge: '每回合手動貼1張',
      timingClass: 'guide-badge-timing',
      effectText: (card.text && !card.text.includes('效果。')) ? card.text : `為場上的寶可夢附加 1 點 ${name}，提供使出招式或支付撤退費用所需點數。`,
      timingText: '【主要階段】在自己的回合，每回合只能從手牌手動將 1 張能量卡附加到戰鬥場或備戰區的 1 隻寶可夢身上。',
      tacticsTip: '穩定分配能量至當前戰鬥打手或後排備用主力，防止主打手氣絕後攻擊斷檔。'
    };
  }

  if (supertype === 'trainer') {
    if (isAceSpec) {
      return {
        categoryBadge: '⭐ 【ACE SPEC】王牌道具',
        categoryClass: 'guide-badge-acespec',
        timingBadge: '牌組限放1張 · 扭轉戰局',
        timingClass: 'guide-badge-acespec',
        effectText: (card.text && !card.text.includes('效果。')) ? card.text : '發動超強王牌效果，直接扭轉戰場局勢。',
        timingText: '【主要階段】在自己的回合使用。全牌組僅限放入 1 張 ACE SPEC 卡片，使用後進入棄牌區。',
        tacticsTip: '看準戰局關鍵決勝點發動，能一舉打亂對手節奏並鎖定對局勝利！'
      };
    }
    if (subtypes.includes('Supporter')) {
      return {
        categoryBadge: '👤 支援者卡',
        categoryClass: 'guide-badge-supporter',
        timingBadge: '每回合限用1張 · 先攻首回不可',
        timingClass: 'guide-badge-timing',
        effectText: (card.text && !card.text.includes('效果。')) ? card.text : '發動支援者效果，提供強力手牌濾牌、調度或對手干擾。',
        timingText: '【每回合限用 1 張】在自己的主要階段使用。先攻玩家的第 1 回合不可使用支援者卡。使用後進入棄牌區。',
        tacticsTip: '支援者卡通常擁有極大的戰略影響力，請根據手牌與場面情況把握最佳使用時機。'
      };
    }
    if (subtypes.includes('Tool')) {
      return {
        categoryBadge: '🛡️ 寶可夢道具卡',
        categoryClass: 'guide-badge-tool',
        timingBadge: '每隻寶可夢限攜帶1張',
        timingClass: 'guide-badge-timing',
        effectText: (card.text && !card.text.includes('效果。')) ? card.text : '為攜帶此道具的寶可夢提供持續性的能力增益或防禦提升。',
        timingText: '【主要階段】附加在自己場上的寶可夢身上。每隻寶可夢同一時間只能攜帶 1 張道具，裝備後不可任意拆卸或更換。',
        tacticsTip: '道具卡能在關鍵時刻提升寶可夢血量上限或降低撤退成本，提升站場與生存能力。'
      };
    }
    // 一般物品卡 (Item)
    return {
      categoryBadge: '🎒 物品卡',
      categoryClass: 'guide-badge-item',
      timingBadge: '主要階段 · 不限次數',
      timingClass: 'guide-badge-timing',
      effectText: (card.text && !card.text.includes('效果。')) ? card.text : '在自己的回合發動物品輔助效果，使用後送入棄牌區。',
      timingText: '【主要階段】在自己的回合中可以使用任意數量的物品卡。',
      tacticsTip: '靈活運用物品卡進行牌庫檢索、換位或資源調度，不消耗每回合唯一的支援者與能量次數。'
    };
  }

  // 寶可夢卡 (Pokemon)
  if (subtypes.includes('Stage 2')) {
    return {
      categoryBadge: `🔥 2 階進化寶可夢${subtypes.includes('ex') ? ' (ex)' : ''}`,
      categoryClass: 'guide-badge-pokemon',
      timingBadge: '需由1階進化或神奇糖果',
      timingClass: 'guide-badge-timing',
      effectText: `HP ${card.hp || 300}。可重疊在「${card.evolvesFrom || '1階寶可夢'}」身上進化，或使用「神奇糖果」從基礎直接進化。${subtypes.includes('ex') ? '【ex規則】昏厥時對手拿取 2 張獎賞卡。' : ''}`,
      timingText: '不可在基礎寶可夢剛放下的第 1 回合進化，亦不可在先攻玩家第 1 回合進化。',
      tacticsTip: '隊伍終極核心主力！具備極高 HP 與終結級招式傷害，配合特性快速成型能迅速主宰戰局。'
    };
  }
  if (subtypes.includes('Stage 1')) {
    return {
      categoryBadge: `⚡ 1 階進化寶可夢${subtypes.includes('ex') ? ' (ex)' : ''}`,
      categoryClass: 'guide-badge-pokemon',
      timingBadge: '需由基礎寶可夢進化',
      timingClass: 'guide-badge-timing',
      effectText: `HP ${card.hp || 100}。重疊在「${card.evolvesFrom || '基礎寶可夢'}」身上進化。${subtypes.includes('ex') ? '【ex規則】昏厥時對手拿取 2 張獎賞卡。' : ''}`,
      timingText: '不可在基礎寶可夢剛放下的第 1 回合進化，亦不可在先攻第 1 回合進化。',
      tacticsTip: '進化的過渡中樞，很多 1 階寶可夢擁有強力濾牌特性（如奇魯莉安、多龍奇），是維持資源循環的基石。'
    };
  }

  // 基礎寶可夢 (Basic)
  return {
    categoryBadge: `⭐ 基礎寶可夢${subtypes.includes('ex') ? ' (ex)' : ''}`,
    categoryClass: 'guide-badge-pokemon',
    timingBadge: '直接置於備戰區 (上限5隻)',
    timingClass: 'guide-badge-timing',
    effectText: `HP ${card.hp || 70}。起手直接放置於戰鬥場或備戰區，或在主要階段從手牌放置至備戰區。${subtypes.includes('ex') ? '【ex規則】昏厥時對手拿取 2 張獎賞卡。' : ''}`,
    timingText: '【主要階段】在自己的回合，備戰區未滿 5 隻時可隨時從手牌放置上場。',
    tacticsTip: '開局盡速鋪滿備戰區，展開基礎戰力與進化鏈，確保隨時有主力能替換上場。'
  };
}

// Global exports for browser window
if (typeof window !== 'undefined') {
  window.getCardImageUrl = getCardImageUrl;
  window.getCustomCardImages = getCustomCardImages;
  window.saveCustomCardImage = saveCustomCardImage;
  window.removeCustomCardImage = removeCustomCardImage;
  window.OFFICIAL_CARD_IMAGES = OFFICIAL_CARD_IMAGES;
  window.getCardArtEmoji = getCardArtEmoji;
  window.renderCardHtml = renderCardHtml;
  window.CARD_USAGE_GUIDES = CARD_USAGE_GUIDES;
  window.getCardUsageGuide = getCardUsageGuide;
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
    renderCardHtml,
    CARD_USAGE_GUIDES,
    getCardUsageGuide
  };
}
