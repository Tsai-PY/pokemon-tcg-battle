// lib/deckValidator.js
const { recognizeOrSynthesizeCard } = require('./cardDb');

/**
 * Validates a deck according to PTCG official rules:
 * 1. Total cards must be exactly 60.
 * 2. Same-name limit: at most 4 copies per deck, except Basic Energy.
 * 3. ACE SPEC limit: at most 1 ACE SPEC card in the entire deck.
 * 4. Must contain at least 1 Basic Pokémon.
 */
function validateDeck(cardEntries) {
  // cardEntries: Array<{ name: string, count: number, card?: object }>
  const errors = [];
  const warnings = [];
  const nameCounts = new Map();
  let totalCards = 0;
  let aceSpecCount = 0;
  let aceSpecNames = [];
  let basicPokemonCount = 0;
  const processedCards = [];
  const flattenedDeck = [];

  for (const entry of cardEntries) {
    const count = parseInt(entry.count, 10) || 0;
    if (count <= 0) continue;

    const card = entry.card || recognizeOrSynthesizeCard(entry.name);
    totalCards += count;

    // Tally by normalized name
    const currentCount = (nameCounts.get(card.name) || 0) + count;
    nameCounts.set(card.name, currentCount);

    const isBasicEnergy = card.supertype === 'energy' && (
      (card.subtypes && card.subtypes.includes('Basic Energy')) ||
      /^基本.*能量$/.test(card.name)
    );

    const isAceSpec = card.isAceSpec || (card.subtypes && card.subtypes.includes('ACE SPEC'));
    if (isAceSpec) {
      aceSpecCount += count;
      aceSpecNames.push(card.name);
    }

    const isBasicPokemon = card.supertype === 'pokemon' && card.subtypes && card.subtypes.includes('Basic');
    if (isBasicPokemon) {
      basicPokemonCount += count;
    }

    processedCards.push({
      card,
      count,
      isBasicEnergy,
      isAceSpec,
      isBasicPokemon
    });

    for (let i = 0; i < count; i++) {
      flattenedDeck.push({
        ...card,
        instanceId: `c_${flattenedDeck.length + 1}_${Math.random().toString(36).substring(7)}`
      });
    }
  }

  // 1. Total count check
  if (totalCards !== 60) {
    errors.push(`【牌數限制】一副正式牌庫必須剛好 60 張卡牌（目前：${totalCards} 張，${totalCards > 60 ? '超出 ' + (totalCards - 60) : '還差 ' + (60 - totalCards)} 張）`);
  }

  // 2. Same name limit check (max 4, except Basic Energy)
  for (const [name, count] of nameCounts.entries()) {
    const isBasicEnergy = /^基本.*能量$/.test(name) || name.includes('Basic Energy');
    if (!isBasicEnergy && count > 4) {
      errors.push(`【同名卡限制】「${name}」在牌庫中放入了 ${count} 張（超過上限 4 張限制）`);
    }
  }

  // 3. ACE SPEC limit check (max 1)
  if (aceSpecCount > 1) {
    errors.push(`【特殊卡牌限制】ACE SPEC（王牌卡）全牌庫最多只能放入 1 張（目前共有 ${aceSpecCount} 張：${aceSpecNames.join('、')}）`);
  }

  // 4. Basic Pokémon check
  if (basicPokemonCount === 0) {
    errors.push('【基礎寶可夢限制】牌庫中必須至少包含 1 張「基礎寶可夢」，否則無法進行對戰！');
  }

  return {
    valid: errors.length === 0,
    totalCards,
    errors,
    warnings,
    aceSpecCount,
    basicPokemonCount,
    processedCards,
    flattenedDeck
  };
}

/**
 * Parses user input text into card entries.
 * Supports:
 * - PTCG Live export format (e.g. "4 Charmander MEW 4" or "4 小火龍")
 * - Simple format (e.g. "小火龍 4" or "小火龍 x4" or "4x 小火龍")
 * - Line-by-line list
 */
function parseDeckText(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split(/\r?\n/);
  const cardMap = new Map();

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;
    // Skip PTCG headers like "Pokémon: 15", "Trainer: 30", "Energy: 15"
    if (/^(Pokémon|Pokemon|Trainer|Energy|寶可夢|訓練家|能量)[:：]/i.test(line)) continue;

    let count = 1;
    let cardName = line;

    // Pattern 1: Leading count e.g. "4 Charmander MEW 4" or "4x 小火龍" or "4 小火龍"
    const leadMatch = line.match(/^(\d+)\s*[xX*]?\s+(.+)$/);
    if (leadMatch) {
      count = parseInt(leadMatch[1], 10);
      let rest = leadMatch[2].trim();
      // Remove trailing set codes if any, e.g. "MEW 4" or "PAF 54" or "sv3 105"
      rest = rest.replace(/\s+[A-Za-z0-9_-]+\s+\d+.*$/, '').trim();
      cardName = rest;
    } else {
      // Pattern 2: Trailing count e.g. "小火龍 4" or "小火龍 x4"
      const trailMatch = line.match(/^(.+?)\s*[xX*]?\s*(\d+)$/);
      if (trailMatch) {
        cardName = trailMatch[1].trim();
        count = parseInt(trailMatch[2], 10);
      }
    }

    if (cardName) {
      const card = recognizeOrSynthesizeCard(cardName);
      const prev = cardMap.get(card.name) || 0;
      cardMap.set(card.name, prev + count);
    }
  }

  const entries = [];
  for (const [name, count] of cardMap.entries()) {
    entries.push({ name, count });
  }
  return entries;
}

module.exports = {
  validateDeck,
  parseDeckText
};
