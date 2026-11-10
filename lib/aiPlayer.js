// lib/aiPlayer.js
// Automated Computer AI Player for PTCG

function playAiTurn(game, aiPlayerIndex) {
  if (game.status !== 'active') return;
  if (game.activePlayerIndex !== aiPlayerIndex) return;

  const ai = game.players[aiPlayerIndex];

  // 1. Play basic Pokémon from hand to bench
  let playedBasic = true;
  while (playedBasic && ai.bench.length < 5) {
    playedBasic = false;
    const basicInHand = ai.hand.find(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
    if (basicInHand) {
      const res = game.playBasicToBench(aiPlayerIndex, basicInHand.instanceId);
      if (res && res.success) playedBasic = true;
    }
  }

  // 2. Evolve Pokémon if possible (Turn > 2)
  if (game.turnNumber > 2) {
    for (const card of [...ai.hand]) {
      if (card.supertype === 'pokemon' && (card.subtypes.includes('Stage 1') || card.subtypes.includes('Stage 2'))) {
        // Try active first
        if (ai.active && ai.active.name === card.evolvesFrom && ai.active.turnPlayed < game.turnNumber) {
          game.evolvePokemon(aiPlayerIndex, card.instanceId, 'active');
          continue;
        }
        // Try bench
        for (let bIdx = 0; bIdx < ai.bench.length; bIdx++) {
          const b = ai.bench[bIdx];
          if (b && b.name === card.evolvesFrom && b.turnPlayed < game.turnNumber) {
            game.evolvePokemon(aiPlayerIndex, card.instanceId, bIdx);
            break;
          }
        }
      }
    }
  }

  // 3. Attach Energy (Max 1 per turn)
  if (!ai.turnFlags.energyAttached) {
    const energyCard = ai.hand.find(c => c.supertype === 'energy');
    if (energyCard) {
      // Prioritize Active if Active needs energy for strongest attack
      if (ai.active) {
        game.attachEnergy(aiPlayerIndex, energyCard.instanceId, 'active');
      } else if (ai.bench.length > 0) {
        game.attachEnergy(aiPlayerIndex, energyCard.instanceId, 0);
      }
    }
  }

  // 4. Attach Tools
  for (const card of [...ai.hand]) {
    if (card.supertype === 'trainer' && card.subtypes && card.subtypes.includes('Tool')) {
      if (ai.active && !ai.active.attachedTool) {
        game.attachTool(aiPlayerIndex, card.instanceId, 'active');
      } else {
        const bTarget = ai.bench.findIndex(b => !b.attachedTool);
        if (bTarget !== -1) {
          game.attachTool(aiPlayerIndex, card.instanceId, bTarget);
        }
      }
    }
  }

  // 5. Play Items
  for (const card of [...ai.hand]) {
    if (card.supertype === 'trainer' && card.subtypes && card.subtypes.includes('Item')) {
      if (card.id === 'nest_ball' && ai.bench.length < 5) {
        game.playItem(aiPlayerIndex, card.instanceId);
      } else if (card.id === 'potion' && ai.active && ai.active.damage > 0) {
        game.playItem(aiPlayerIndex, card.instanceId);
      } else if (card.id === 'ultra_ball') {
        game.playItem(aiPlayerIndex, card.instanceId);
      } else if (card.id === 'prime_catcher' && ai.bench.length > 0) {
        game.playItem(aiPlayerIndex, card.instanceId, { oppBenchIndex: 0, ownBenchIndex: 0 });
      }
    }
  }

  // 6. Play Supporter (Max 1, not Turn 1)
  if (!ai.turnFlags.supporterPlayed && game.turnNumber > 1) {
    const supp = ai.hand.find(c => c.supertype === 'trainer' && c.subtypes && c.subtypes.includes('Supporter'));
    if (supp) {
      game.playSupporter(aiPlayerIndex, supp.instanceId, { oppBenchIndex: 0 });
    }
  }

  // 7. Attack or Pass
  if (game.turnNumber > 1 && ai.active) {
    const attacks = ai.active.attacks || [];
    const attachedCount = (ai.active.attachedEnergy || []).length;

    // Check strongest ready attack
    let bestAttackIdx = -1;
    let maxDamage = -1;

    for (let i = 0; i < attacks.length; i++) {
      const at = attacks[i];
      const cost = (at.cost || []).length;
      if (attachedCount >= cost) {
        const dmg = at.damage || 0;
        if (dmg > maxDamage) {
          maxDamage = dmg;
          bestAttackIdx = i;
        }
      }
    }

    if (bestAttackIdx !== -1) {
      // Attack ends turn automatically
      game.attack(aiPlayerIndex, bestAttackIdx);
      return;
    }
  }

  // If cannot attack or Turn 1, pass turn
  game.nextTurn();
}

module.exports = {
  playAiTurn
};
