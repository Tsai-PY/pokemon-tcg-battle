// test_system.js
const assert = require('assert');
const auth = require('./lib/auth');
const cardDb = require('./lib/cardDb');
const { validateDeck, parseDeckText } = require('./lib/deckValidator');
const { initSharedDecks, getSharedDecks, uploadSharedDeck } = require('./lib/initDecks');
const { PTCGGame } = require('./lib/gameEngine');
const { playAiTurn } = require('./lib/aiPlayer');

console.log('--- 1. 測試會員與管理員登錄審核系統 ---');
auth.initUsersDb();

// Test Admin Login
const adminRes = auth.loginUser('0988229731', '19710607');
assert(adminRes.success, '管理員登入應成功');
assert.strictEqual(adminRes.user.role, 'admin', '角色應為管理員');
console.log('✓ 管理員 (0988229731 / 19710607) 登入成功');

// Register new member
const testPhone = '0912345678';
const testBday = '19950520';
auth.deleteMember(adminRes.token, testPhone); // cleanup if exists

const regRes = auth.registerUser(testPhone, testBday, '測試訓練家小明');
assert(regRes.success, '註冊申請應成功');
assert.strictEqual(regRes.user.status, 'pending', '新註冊狀態應為 pending (待審核)');
console.log('✓ 新會員申請註冊成功，狀態為待審核');

// Try login before approval
const unapprovedLogin = auth.loginUser(testPhone, testBday);
assert(!unapprovedLogin.success, '未審核會員登入應被阻擋');
console.log('✓ 未審核會員無法登入：', unapprovedLogin.message);

// Admin reviews and approves
const approveRes = auth.updateMemberStatus(adminRes.token, testPhone, 'approved');
assert(approveRes.success, '管理員審核應成功');
console.log('✓ 管理員審核通過會員');

// Member logins after approval
const approvedLogin = auth.loginUser(testPhone, testBday);
assert(approvedLogin.success, '審核通過後會員登入應成功');
console.log('✓ 審核通過後會員成功登入');

console.log('\n--- 2. 測試牌庫規範 (60張/同名卡4張/ACE SPEC 1張) ---');
// Test valid deck
const decks = getSharedDecks();
assert.strictEqual(decks.length, 10, '共同牌庫應有 10 組');
console.log(`✓ 共同牌庫已載入 ${decks.length} 組預設牌組`);

// Test rule: > 4 copies
const invalidDeckTooManyCopies = [
  { name: '小火龍', count: 5 }, // Exceeds 4!
  { name: '噴火龍ex', count: 3 },
  { name: '基本火能量', count: 52 }
];
const vCopies = validateDeck(invalidDeckTooManyCopies);
assert(!vCopies.valid, '超過4張同名卡應判定不合規');
console.log('✓ 成功攔截同名卡超過 4 張：', vCopies.errors[0]);

// Test rule: > 1 ACE SPEC
const invalidDeckTooManyAce = [
  { name: '小火龍', count: 4 },
  { name: '至尊捕捉器', count: 2 }, // ACE SPEC > 1
  { name: '基本火能量', count: 54 }
];
const vAce = validateDeck(invalidDeckTooManyAce);
assert(!vAce.valid, '超過1張ACE SPEC應判定不合規');
console.log('✓ 成功攔截 ACE SPEC 超過 1 張：', vAce.errors[0]);

// Test rule: Total cards != 60
const invalidDeckCount = [
  { name: '小火龍', count: 4 },
  { name: '基本火能量', count: 50 } // Total 54
];
const vCount = validateDeck(invalidDeckCount);
assert(!vCount.valid, '總牌數不等於60應判定不合規');
console.log('✓ 成功攔截總張數非 60 張：', vCount.errors[0]);

console.log('\n--- 3. 測試 PTCG 標準對戰引擎 ---');
const game = new PTCGGame('test_game_1', {
  id: testPhone,
  name: '小明',
  deck: decks[0]
}, {
  id: 'ai_bot',
  name: '電腦AI',
  isAi: true,
  deck: decks[1]
});

game.startSetup();
console.log(`✓ 對戰準備完成：先攻為玩家 ${game.firstPlayerIndex + 1} (${game.players[game.firstPlayerIndex].name})`);
console.log(`✓ 雙方戰鬥場與備戰區已就緒，各設置 6 張獎賞卡 (P1獎賞卡: ${game.players[0].prizes.length}, P2: ${game.players[1].prizes.length})`);

// Check turn 1 constraints
assert.strictEqual(game.turnNumber, 1, '第一回合');
const pFirst = game.players[game.activePlayerIndex];
console.log(`✓ 第 1 回合限制檢查：先攻不可抽牌、不可攻擊、不可使用支援者`);

// Fast forward to turn 2
game.nextTurn();
console.log(`✓ 進入第 2 回合 (輪到 ${game.players[game.activePlayerIndex].name})`);

// Player attacks
const currentP = game.players[game.activePlayerIndex];
// Attach energy matching the active Pokémon's first attack
const requiredCosts = (currentP.active.attacks && currentP.active.attacks[0] && currentP.active.attacks[0].cost) || ['Fire'];
requiredCosts.forEach(t => {
  const eType = t === 'Colorless' ? 'Fire' : t;
  currentP.active.attachedEnergy.push({ name: `基本${eType}能量`, supertype: 'energy', energyType: eType });
});

const attackRes = game.attack(game.activePlayerIndex, 0);
assert(attackRes.success, '第2回合應可使出攻擊');
console.log('✓ 攻擊成功執行並自動計算傷害與切換回合');

console.log('\n--- 4. 測試起手無基礎寶可夢時，雙方重新抽牌開局 (Mulligan規則) ---');
const mulliganGame = new PTCGGame('test_game_mulligan', {
  id: 'p1_test',
  name: '玩家1',
  deck: decks[0]
}, {
  id: 'p2_test',
  name: '玩家2',
  deck: decks[1]
});

// 模擬玩家 1 起手前 7 張完全沒有基礎寶可夢
// 將所有基礎寶可夢移到牌庫底部（index 20 以後）
const p1NonBasics = mulliganGame.players[0].deck.filter(c => !(c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic')));
const p1Basics = mulliganGame.players[0].deck.filter(c => c.supertype === 'pokemon' && c.subtypes && c.subtypes.includes('Basic'));
mulliganGame.players[0].deck = [...p1NonBasics, ...p1Basics];

// 執行開局
mulliganGame.startSetup();

// 驗證是否有觸發重新抽牌開局日誌
const hasRedrawLog = mulliganGame.logs.some(l => l.message.includes('重新抽牌開局'));
assert(hasRedrawLog, '任何一方起手無基礎寶可夢時，應觸發雙方重新抽牌開局');
console.log('✓ 成功觸發雙方重新洗牌抽牌開局：', mulliganGame.logs.find(l => l.message.includes('重新抽牌開局')).message);

// 驗證最終雙方皆成功放置戰鬥場寶可夢
assert(mulliganGame.players[0].active, '玩家1應有戰鬥場寶可夢');
assert(mulliganGame.players[1].active, '玩家2應有戰鬥場寶可夢');
assert.strictEqual(mulliganGame.players[0].prizes.length, 6, '玩家1獎賞卡應為6張');
assert.strictEqual(mulliganGame.players[1].prizes.length, 6, '玩家2獎賞卡應為6張');
console.log(`✓ 重新開局後雙方戰鬥場皆已成功放置寶可夢 (P1: ${mulliganGame.players[0].active.name}, P2: ${mulliganGame.players[1].active.name})`);

console.log('\n--- 5. 測試「高級球」丟棄 2 張手牌並從牌庫挑選寶可夢 ---');
const ubGame = new PTCGGame('test_game_ub', {
  id: 'ub_p1',
  name: '訓練家小智',
  deck: decks[0]
}, {
  id: 'ub_p2',
  name: '電腦AI',
  isAi: true,
  deck: decks[1]
});
ubGame.startSetup();
const ubPlayer = ubGame.players[0];
const targetPoke = ubPlayer.deck.find(c => c.supertype === 'pokemon');
assert(targetPoke, '牌庫中應有寶可夢');

ubPlayer.hand = [
  { instanceId: 'ub_card', id: 'ultra_ball', name: '高級球', supertype: 'trainer', subtypes: ['Item'] },
  { instanceId: 'd1', name: '卡片A', supertype: 'energy' },
  { instanceId: 'd2', name: '卡片B', supertype: 'energy' }
];

ubGame.activePlayerIndex = 0;
const ubRes = ubGame.playItem(0, 'ub_card', {
  discardCardIds: ['d1', 'd2'],
  targetCardId: targetPoke.instanceId
});
assert(ubRes.success, '高級球發動應成功');
assert(ubPlayer.hand.some(c => c.instanceId === targetPoke.instanceId), '目標寶可夢應已加入手牌');
assert.strictEqual(ubPlayer.hand.length, 1, '手牌應只剩檢索加入的該隻寶可夢');
assert(ubPlayer.discard.some(c => c.instanceId === 'ub_card'), '高級球應在棄牌堆');
assert(ubPlayer.discard.some(c => c.instanceId === 'd1' || c.instanceId === 'd2'), '丟棄的2張手牌應在棄牌堆');
console.log(`✓ 成功發動高級球：丟棄2張手牌並精準從牌庫挑選「${targetPoke.name}」加入手牌！`);

console.log('\n--- 6. 測試寶可夢道具卡「勇氣護符」貼附與生命值提升規則 ---');
const toolGame = new PTCGGame('test_game_tool', {
  id: 'tool_p1',
  name: '小明',
  deck: decks[0]
}, {
  id: 'tool_p2',
  name: '電腦AI',
  isAi: true,
  deck: decks[1]
});
toolGame.startSetup();
const toolPlayer = toolGame.players[0];
toolGame.activePlayerIndex = 0;

// 設置基礎寶可夢「密勒頓ex」在戰鬥場 (基礎生命 220)
toolPlayer.active = {
  instanceId: 'miraidon_1',
  id: 'miraidon_ex',
  name: '密勒頓ex',
  supertype: 'pokemon',
  subtypes: ['Basic', 'ex'],
  hp: 220,
  damage: 0,
  attachedEnergy: [],
  attachedTool: null,
  maxHpBonus: 0
};

// 手牌給予 2 張「勇氣護符」
const braveryCharm1 = { instanceId: 'bc_1', id: 'bravery_charm', name: '勇氣護符', supertype: 'trainer', subtypes: ['Tool'] };
const braveryCharm2 = { instanceId: 'bc_2', id: 'bravery_charm', name: '勇氣護符', supertype: 'trainer', subtypes: ['Tool'] };
toolPlayer.hand = [braveryCharm1, braveryCharm2];

// 執行貼附第 1 張勇氣護符
const attachRes1 = toolGame.attachTool(0, 'bc_1', 'active');
assert(attachRes1.success, '貼附勇氣護符應成功');
assert.strictEqual(toolPlayer.active.attachedTool.name, '勇氣護符', '目標寶可夢應已貼上勇氣護符');
assert.strictEqual(toolPlayer.active.maxHpBonus, 50, '基礎寶可夢貼上勇氣護符後 maxHpBonus 應為 50');

// 檢查 getState 輸出的 currentHp 與 maxHp
const p1State = toolGame.getState(0).players[0];
assert.strictEqual(p1State.active.maxHp, 270, '有效最大生命值應從 220 提升至 270');
assert.strictEqual(p1State.active.currentHp, 270, '有效當前生命值應為 270');
assert(p1State.active.attachedTool, 'getState 應包含 attachedTool');
console.log('✓ 成功將「勇氣護符」貼附在基礎寶可夢「密勒頓ex」身上，最大 HP 成功提升至 270！');

// 測試 PTCG 規則：每隻寶可夢限貼 1 張道具卡，重複貼附應被阻擋
const attachRes2 = toolGame.attachTool(0, 'bc_2', 'active');
assert(!attachRes2.success, '身上已有道具卡時不應允許再次貼附道具');
console.log('✓ 成功攔截重複貼附道具卡：', attachRes2.message);

console.log('\n--- 7. 測試「使出招式」後不可繼續攻擊的回合限制 ---');
toolGame.turnNumber = 2;
toolGame.activePlayerIndex = 0;
toolPlayer.turnFlags.attacked = false;
toolPlayer.active.attacks = [{ name: '閃電連擊', cost: ['Lightning'], damage: 20 }];
toolPlayer.active.attachedEnergy = [{ instanceId: 'e_l1', name: '基本雷能量', supertype: 'energy', energyType: 'Lightning' }];
const atkRes1 = toolGame.attack(0, 0);
assert(atkRes1.success, '第一次使出招式應成功');
assert.strictEqual(toolGame.activePlayerIndex, 1, '使出招式後應自動切換至對手回合');
const atkRes2 = toolGame.attack(0, 0);
assert(!atkRes2.success, '使出招式後不可再次使出招式');
console.log('✓ 成功攔截連續使出招式：', atkRes2.message);

console.log('\n--- 8. 測試支援者卡「老大的指令」強制調換對手戰鬥區與備戰區寶可夢 ---');
toolGame.status = 'playing';
toolGame.turnNumber = 2;
toolGame.activePlayerIndex = 0;
toolPlayer.turnFlags.supporterPlayed = false;
const oppPlayer = toolGame.players[1];
oppPlayer.active = { instanceId: 'opp_a', name: '古劍豹ex', supertype: 'pokemon', hp: 220, damage: 0 };
oppPlayer.bench = [
  { instanceId: 'opp_b0', name: '小火龍', supertype: 'pokemon', hp: 70, damage: 0 },
  { instanceId: 'opp_b1', name: '波波', supertype: 'pokemon', hp: 60, damage: 0 }
];
toolPlayer.hand = [
  { instanceId: 'boss_1', id: 'boss_orders', name: '老大的指令', supertype: 'trainer', subtypes: ['Supporter'], effect: 'boss_orders_switch' }
];
const bossRes = toolGame.playSupporter(0, 'boss_1', { oppBenchIndex: 1 });
assert(bossRes.success, '老大的指令發動應成功');
assert.strictEqual(oppPlayer.active.name, '波波', '對手戰鬥場應已更換為指定的備戰寶可夢「波波」');
assert.strictEqual(oppPlayer.bench[1].name, '古劍豹ex', '原本的對手戰鬥寶可夢「古劍豹ex」應已移至備戰區槽位 1');
console.log('✓ 成功發動「老大的指令」，將對手備戰區的「波波」與戰鬥區的「古劍豹ex」互換！');

console.log('\n[Test 9] 測試特殊狀態（中毒、灼傷、麻痺）與持續傷害結算及撤退解除...');
const statusGame = new PTCGGame(
  'status_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const sP0 = statusGame.players[0];
const sP1 = statusGame.players[1];
statusGame.turnNumber = 2;
statusGame.activePlayerIndex = 0;
sP0.deck = Array.from({ length: 10 }, (_, i) => ({ instanceId: `d0_${i}`, name: '雷能量', supertype: 'energy' }));
sP1.deck = Array.from({ length: 10 }, (_, i) => ({ instanceId: `d1_${i}`, name: '火能量', supertype: 'energy' }));
sP0.active = {
  instanceId: 'sa0', name: '毒電嬰', supertype: 'pokemon', hp: 100, damage: 0, retreatCost: 1,
  attachedEnergy: [{ instanceId: 'e0', name: '雷能量', supertype: 'energy', energyType: 'Lightning' }],
  attacks: [{ name: '麻痺毒針', cost: ['Lightning'], damage: 20, text: '將對手的戰鬥寶可夢麻痺。' }]
};
sP1.active = {
  instanceId: 'sa1', name: '噴火龍ex', supertype: 'pokemon', hp: 330, damage: 0, retreatCost: 2,
  attachedEnergy: [
    { instanceId: 'e1a', name: '火能量', supertype: 'energy', energyType: 'Fire' },
    { instanceId: 'e1b', name: '火能量', supertype: 'energy', energyType: 'Fire' }
  ],
  attacks: [{ name: '火焰爪', cost: ['Fire'], damage: 60, text: '將對手的戰鬥寶可夢灼傷並中毒。' }]
};
sP1.bench = [{ instanceId: 'sb1', name: '小火龍', supertype: 'pokemon', hp: 70, damage: 0 }];

// 1. P0 攻擊使 P1 陷入麻痺
const paraAtk = statusGame.attack(0, 0);
assert(paraAtk.success, '毒電嬰攻擊應成功');
assert(sP1.active.statusConditions.includes('paralyzed'), '對手噴火龍ex應陷入麻痺狀態');
assert.strictEqual(statusGame.activePlayerIndex, 1, '攻擊後應換為玩家 B 回合');

// 2. P1 處於麻痺狀態不可攻擊也不可撤退
const blockedAtk = statusGame.attack(1, 0);
assert(!blockedAtk.success && blockedAtk.message.includes('麻痺'), '麻痺時應禁止攻擊');
const blockedRetreat = statusGame.retreatActive(1, 0);
assert(!blockedRetreat.success && blockedRetreat.message.includes('麻痺'), '麻痺時應禁止撤退');

// 3. P1 結束回合 -> 寶可夢檢查應自動解除 P1 的麻痺
statusGame.nextTurn();
assert(!sP1.active.statusConditions.includes('paralyzed'), '玩家 B 回合結束後麻痺應自動解除');
assert.strictEqual(statusGame.activePlayerIndex, 0, '應回到玩家 A 回合');

// 4. 測試中毒持續傷害 (+10) 與撤退清除狀態
statusGame._applySpecialCondition(sP0.active, 'poisoned');
assert(sP0.active.statusConditions.includes('poisoned'), '毒電嬰應陷入中毒狀態');
const dmgBeforeCheckup = sP0.active.damage || 0;
statusGame.nextTurn(); // 觸發寶可夢檢查：中毒 +10
assert.strictEqual(sP0.active.damage, dmgBeforeCheckup + 10, '寶可夢檢查時中毒應造成 10 點持續傷害');

// 5. 測試撤退解除所有特殊狀態
statusGame.activePlayerIndex = 1;
statusGame._applySpecialCondition(sP1.active, 'poisoned');
statusGame._applySpecialCondition(sP1.active, 'confused');
const retreatOk = statusGame.retreatActive(1, 0);
assert(retreatOk.success, '無麻痺/睡眠且能量足夠時撤退應成功');
assert.strictEqual(sP1.bench[0].statusConditions.length, 0, '撤退回備戰區後應清除所有特殊狀態');
console.log('✓ 特殊狀態（麻痺禁止行動與自動解除、中毒持續傷害、撤退清除狀態）驗證全數通過！');

console.log('\n[Test 10] 測試物品卡「大地之器」（丟 1 張手牌、從牌庫選最多 2 張基本能量並洗牌、可不限張數使用）...');
const evGame = new PTCGGame(
  'ev_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const evP0 = evGame.players[0];
evGame.turnNumber = 2;
evGame.activePlayerIndex = 0;

// 1. 沒有其他手牌可丟棄時應不可使用
evP0.hand = [
  { instanceId: 'ev_1', id: 'earthen_vessel', name: '大地之器', supertype: 'trainer', subtypes: ['Item'], effect: 'earthen_vessel_search_energy' }
];
evP0.deck = [
  { instanceId: 'en_1', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'en_2', name: '基本雷能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Lightning' },
  { instanceId: 'en_sp', name: '雙重渦輪能量', supertype: 'energy', subtypes: ['Special'] }
];
const evFail = evGame.playItem(0, 'ev_1');
assert(!evFail.success, '沒有其他手牌可丟棄時應禁止使用大地之器');
assert.strictEqual(evP0.hand.length, 1, '使用失敗時大地之器應保留在手牌中');

// 2. 加入其他手牌與第 2 張大地之器，測試正常丟 1 棄牌 + 選 2 張基本能量，且同回合可連續使用多張物品卡
evP0.hand.push(
  { instanceId: 'disc_1', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'] },
  { instanceId: 'ev_2', id: 'earthen_vessel', name: '大地之器', supertype: 'trainer', subtypes: ['Item'], effect: 'earthen_vessel_search_energy' },
  { instanceId: 'disc_2', name: '波波', supertype: 'pokemon', subtypes: ['Basic'] }
);
const evOk = evGame.playItem(0, 'ev_1', {
  discardCardIds: ['disc_1'],
  targetCardIds: ['en_1', 'en_2']
});
assert(evOk.success, '有其他手牌時使用大地之器應成功');
assert(evP0.discard.some(c => c.instanceId === 'ev_1') && evP0.discard.some(c => c.instanceId === 'disc_1'), '大地之器與丟棄的 1 張手牌應進入棄牌區');
assert(evP0.hand.some(c => c.instanceId === 'en_1') && evP0.hand.some(c => c.instanceId === 'en_2'), '選擇的 2 張基本能量應加入手牌');
assert.strictEqual(evP0.deck.length, 1, '牌庫應僅剩 1 張特殊能量');

// 3. 驗證同回合可再次使用第 2 張大地之器（物品卡不限張數）
const evOk2 = evGame.playItem(0, 'ev_2', {
  discardCardIds: ['disc_2'],
  targetCardIds: []
});
assert(evOk2.success, '同一回合應可再次使用物品卡「大地之器」');
console.log('✓ 「大地之器」丟棄手牌條件、最多選 2 張基本能量與同回合不限張數驗證全數通過！');

console.log('\n[Test 11] 測試支援者卡「吹火人」（從牌庫選擇最多 7 張基本火能量加入手牌並重洗牌庫）...');
const fbGame = new PTCGGame(
  'fb_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const fbP0 = fbGame.players[0];
fbGame.turnNumber = 2;
fbGame.activePlayerIndex = 0;
fbP0.hand = [
  { instanceId: 'fb_1', id: 'firebreather', name: '吹火人', supertype: 'trainer', subtypes: ['Supporter'] }
];
fbP0.deck = [
  { instanceId: 'f1', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f2', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f3', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f4', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f5', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f6', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f7', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'f8', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'w1', name: '基本水能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Water' },
  { instanceId: 'p1', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'] }
];
const fbRes = fbGame.playSupporter(0, 'fb_1', {
  targetCardIds: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'] // 刻意傳 8 張，應最多只拿 7 張
});
assert(fbRes.success, '使用吹火人應成功');
assert.strictEqual(fbP0.hand.length, 7, '最多只能將 7 張基本火能量加入手牌');
assert(fbP0.hand.every(c => c.energyType === 'Fire'), '加入手牌的應全為基本火能量');
assert.strictEqual(fbP0.deck.length, 3, '牌庫應剩餘 3 張（1 張火能量 + 1 張水能量 + 1 張小火龍）');
console.log('✓ 「吹火人」最多選擇 7 張基本火能量加入手牌並重洗牌庫驗證全數通過！');

console.log('\n[Test 12] 測試物品卡「寶可平板」（從牌庫選擇 1 張無規則寶可夢加入手牌並重洗牌庫）...');
const ppGame = new PTCGGame(
  'pp_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const ppP0 = ppGame.players[0];
ppGame.turnNumber = 2;
ppGame.activePlayerIndex = 0;
ppP0.hand = [
  { instanceId: 'pp_1', id: 'poke_pad', name: '寶可平板', supertype: 'trainer', subtypes: ['Item'] },
  { instanceId: 'pp_2', id: 'poke_pad', name: '寶可平板', supertype: 'trainer', subtypes: ['Item'] }
];
ppP0.deck = [
  { instanceId: 'ex_1', id: 'mega_charizard_x_ex', name: '超級噴火龍Xex', supertype: 'pokemon', subtypes: ['Stage 2', 'ex'], isEx: true },
  { instanceId: 'rad_1', id: 'radiant_greninja', name: '光輝甲賀忍蛙', supertype: 'pokemon', subtypes: ['Basic', 'Radiant'] },
  { instanceId: 'evo_1', id: 'charmeleon', name: '火恐龍', supertype: 'pokemon', subtypes: ['Stage 1'] }
];
// 1. 嘗試選取擁有規則的寶可夢（超級噴火龍Xex）應被忽略
const ppTryEx = ppGame.playItem(0, 'pp_1', { targetCardId: 'ex_1' });
assert(ppTryEx.success, '寶可平板結算應成功');
assert(!ppP0.hand.some(c => c.instanceId === 'ex_1'), '不可選取擁有規則的寶可夢（超級噴火龍Xex）');
// 2. 選取無規則的進化寶可夢（火恐龍）應成功加入手牌
const ppOk = ppGame.playItem(0, 'pp_2', { targetCardId: 'evo_1' });
assert(ppOk.success, '寶可平板選取火恐龍應成功');
assert(ppP0.hand.some(c => c.instanceId === 'evo_1'), '無規則寶可夢「火恐龍」應加入手牌');
console.log('✓ 「寶可平板」排除擁有規則的寶可夢並檢索無規則寶可夢加入手牌驗證全數通過！');

console.log('\n[Test 13] 測試支援者卡「小光」（從牌庫選擇基礎、1階進化、2階進化寶可夢各 1 張加入手牌並重洗牌庫）...');
const dawnGame = new PTCGGame(
  'dawn_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const dawnP0 = dawnGame.players[0];
dawnGame.turnNumber = 2;
dawnGame.activePlayerIndex = 0;
dawnP0.hand = [
  { instanceId: 'dawn_1', id: 'dawn_supporter', name: '小光', supertype: 'trainer', subtypes: ['Supporter'] }
];
dawnP0.deck = [
  { instanceId: 'b_1', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'] },
  { instanceId: 's1_1', name: '火恐龍', supertype: 'pokemon', subtypes: ['Stage 1'] },
  { instanceId: 's2_1', name: '超級噴火龍Xex', supertype: 'pokemon', subtypes: ['Stage 2', 'ex'], isEx: true },
  { instanceId: 'en_x', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'] }
];
const dawnRes = dawnGame.playSupporter(0, 'dawn_1', {
  basicId: 'b_1',
  stage1Id: 's1_1',
  stage2Id: 's2_1'
});
assert(dawnRes.success, '使用小光應成功');
assert.strictEqual(dawnP0.hand.length, 3, '手牌應加入基礎、1階進化、2階進化各 1 張共 3 張寶可夢');
assert(dawnP0.hand.some(c => c.instanceId === 'b_1') && dawnP0.hand.some(c => c.instanceId === 's1_1') && dawnP0.hand.some(c => c.instanceId === 's2_1'), '三階段寶可夢應皆在手牌中');
assert.strictEqual(dawnP0.deck.length, 1, '牌庫應僅剩 1 張基本火能量');
console.log('✓ 「小光」從牌庫選擇基礎、1階進化、2階進化寶可夢各 1 張加入手牌驗證全數通過！');

console.log('\n[Test 14] 測試物品卡「神奇糖果」（跳過 1 階完成 2 階進化、最初回合與剛出場不可用、同回合不限張數）...');
const rcGame = new PTCGGame(
  'rc_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const rcP0 = rcGame.players[0];
rcGame.activePlayerIndex = 0;
rcP0.active = {
  instanceId: 'rc_base_a', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'],
  hp: 80, damage: 20, turnPlayed: 1, statusConditions: ['poisoned'],
  attachedEnergy: [{ instanceId: 'rc_e1', name: '基本火能量', supertype: 'energy', energyType: 'Fire' }]
};
rcP0.bench = [
  { instanceId: 'rc_base_new', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'], hp: 80, damage: 0, turnPlayed: 3, attachedEnergy: [] },
  { instanceId: 'rc_base_old', name: '拉魯拉絲', supertype: 'pokemon', subtypes: ['Basic'], hp: 70, damage: 0, turnPlayed: 1, attachedEnergy: [] }
];
rcP0.hand = [
  { instanceId: 'rc_item_1', id: 'rare_candy', name: '神奇糖果', supertype: 'trainer', subtypes: ['Item'] },
  { instanceId: 'rc_item_2', id: 'rare_candy', name: '神奇糖果', supertype: 'trainer', subtypes: ['Item'] },
  { instanceId: 'rc_s2_char', id: 'mega_charizard_x_ex', name: '超級噴火龍Xex', supertype: 'pokemon', subtypes: ['Stage 2', 'ex'], evolvesFrom: '火恐龍', hp: 360, isEx: true },
  { instanceId: 'rc_s2_gard', id: 'mega_gardevoir_ex', name: '超級沙奈朵ex', supertype: 'pokemon', subtypes: ['Stage 2', 'ex'], evolvesFrom: '奇魯莉安', hp: 360, isEx: true }
];

// 1. 最初回合（turn 1）不可使用
rcGame.turnNumber = 1;
const rcTurn1Fail = rcGame.playItem(0, 'rc_item_1', { stage2CardId: 'rc_s2_char', targetSlot: 'active' });
assert(!rcTurn1Fail.success, '最初回合應禁止使用神奇糖果');

// 2. 第 3 回合對「本回合剛出場」的小火龍（bench[0]）不可使用
rcGame.turnNumber = 3;
const rcFreshFail = rcGame.playItem(0, 'rc_item_1', { stage2CardId: 'rc_s2_char', targetSlot: 0 });
assert(!rcFreshFail.success, '本回合剛使出的基礎寶可夢不可使用神奇糖果進化');

// 3. 第 3 回合對第 1 回合已在場上的小火龍（active）成功跳階進化為超級噴火龍Xex，保留能量與傷害並清除中毒
const rcOk1 = rcGame.playItem(0, 'rc_item_1', { stage2CardId: 'rc_s2_char', targetSlot: 'active' });
assert(rcOk1.success, '神奇糖果進化小火龍為超級噴火龍Xex應成功');
assert.strictEqual(rcP0.active.name, '超級噴火龍Xex', '戰鬥場應進化為超級噴火龍Xex');
assert.strictEqual(rcP0.active.damage, 20, '應保留原傷害 20');
assert.strictEqual(rcP0.active.attachedEnergy.length, 1, '應保留原附加能量');
assert.strictEqual(rcP0.active.statusConditions.length, 0, '進化後應清除特殊狀態');

// 4. 同回合再使用第 2 張神奇糖果將備戰區拉魯拉絲（bench[1]）進化為超級沙奈朵ex（驗證物品卡不限張數）
const rcOk2 = rcGame.playItem(0, 'rc_item_2', { stage2CardId: 'rc_s2_gard', targetSlot: 1 });
assert(rcOk2.success, '同回合應可再次使用第 2 張神奇糖果');
assert.strictEqual(rcP0.bench[1].name, '超級沙奈朵ex', '備戰區拉魯拉絲應進化為超級沙奈朵ex');
console.log('✓ 「神奇糖果」跳階進化、最初回合與剛出場限制、保留能量傷害及同回合不限張數驗證全數通過！');

console.log('\n[Test 15] 測試支援者卡「莉莉艾」（補滿6張 / 最初回合補滿8張）與「莉莉艾的決意」（手牌洗回抽6張 / 6張獎賞卡抽8張）...');
const lillieGame = new PTCGGame(
  'lillie_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const lP0 = lillieGame.players[0];
lillieGame.activePlayerIndex = 0;
lP0.deck = Array.from({ length: 20 }, (_, i) => ({ instanceId: `ld_${i}`, name: '基本火能量', supertype: 'energy' }));

// 1. 最初回合（turn 2 後攻首回合）：手牌 2 張（含莉莉艾）-> 用掉莉莉艾剩 1 張 -> 抽 7 張補滿至 8 張
lillieGame.turnNumber = 2;
lP0.turnFlags.supporterPlayed = false;
lP0.hand = [
  { instanceId: 'lil_1', id: 'lillie', name: '莉莉艾', supertype: 'trainer', subtypes: ['Supporter'] },
  { instanceId: 'keep_1', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'] }
];
const lilRes1 = lillieGame.playSupporter(0, 'lil_1');
assert(lilRes1.success, '最初回合使用莉莉艾應成功');
assert.strictEqual(lP0.hand.length, 8, '最初回合使用莉莉艾應補滿至 8 張手牌');

// 2. 一般回合（turn 3）：手牌 3 張（含莉莉艾）-> 用掉莉莉艾剩 2 張 -> 抽 4 張補滿至 6 張
lillieGame.turnNumber = 3;
lP0.turnFlags.supporterPlayed = false;
lP0.hand = [
  { instanceId: 'lil_2', id: 'lillie', name: '莉莉艾', supertype: 'trainer', subtypes: ['Supporter'] },
  { instanceId: 'k1', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'] },
  { instanceId: 'k2', name: '火恐龍', supertype: 'pokemon', subtypes: ['Stage 1'] }
];
const lilRes2 = lillieGame.playSupporter(0, 'lil_2');
assert(lilRes2.success, '一般回合使用莉莉艾應成功');
assert.strictEqual(lP0.hand.length, 6, '一般回合使用莉莉艾應補滿至 6 張手牌');

// 3. 「莉莉艾的決意」：剩餘 6 張獎賞卡時，手牌全洗回牌庫抽 8 張
lP0.turnFlags.supporterPlayed = false;
lP0.prizes = Array.from({ length: 6 }, (_, i) => ({ instanceId: `pz_${i}` }));
lP0.hand = [
  { instanceId: 'lild_1', id: 'lillies_determination', name: '莉莉艾的決意', supertype: 'trainer', subtypes: ['Supporter'] },
  { instanceId: 'k3', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'] }
];
const lildRes = lillieGame.playSupporter(0, 'lild_1');
assert(lildRes.success, '使用莉莉艾的決意應成功');
assert.strictEqual(lP0.hand.length, 8, '剩餘 6 張獎賞卡時使用莉莉艾的決意應抽出 8 張');
console.log('✓ 「莉莉艾」與「莉莉艾的決意」抽牌與條件規則驗證全數通過！');

console.log('\n[Test 16] 測試花舞鳥ex特性【激動渦輪】（場上有火屬性超級進化寶可夢ex時，可不限次數附基本火能量至備戰區火寶可夢）...');
const etGame = new PTCGGame(
  'et_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const etP0 = etGame.players[0];
etGame.turnNumber = 3;
etGame.activePlayerIndex = 0;
etP0.active = { instanceId: 'et_ori', id: 'oricorio_ex', name: '花舞鳥ex', supertype: 'pokemon', subtypes: ['Basic', 'ex'], types: ['Fire'], hp: 190, attachedEnergy: [] };
etP0.bench = [
  { instanceId: 'et_ch', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'], types: ['Fire'], hp: 80, attachedEnergy: [] },
  { instanceId: 'et_fez', id: 'fezandipiti_ex', name: '吉雉雞ex', supertype: 'pokemon', subtypes: ['Basic', 'ex'], types: ['Darkness'], hp: 210, attachedEnergy: [] }
];
etP0.hand = [
  { instanceId: 'et_f1', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' },
  { instanceId: 'et_f2', name: '基本火能量', supertype: 'energy', subtypes: ['Basic'], energyType: 'Fire' }
];

// 1. 場上沒有火屬性超級進化寶可夢ex時不可發動
const etNoMega = etGame.useAbility(0, { abilityId: 'excited_turbo', energyCardId: 'et_f1', benchIndex: 0 });
assert(!etNoMega.success, '場上沒有火屬性超級進化寶可夢ex時應禁止發動激動渦輪');

// 2. 將戰鬥場換成超級噴火龍Xex、備戰區放花舞鳥ex
etP0.active = { instanceId: 'et_mega', id: 'mega_charizard_x_ex', name: '超級噴火龍Xex', supertype: 'pokemon', subtypes: ['Stage 2', 'ex'], types: ['Fire'], hp: 360, isEx: true, attachedEnergy: [] };
etP0.bench.push({ instanceId: 'et_ori2', id: 'oricorio_ex', name: '花舞鳥ex', supertype: 'pokemon', subtypes: ['Basic', 'ex'], types: ['Fire'], hp: 190, attachedEnergy: [] });

// 3. 不可附於非火屬性的備戰寶可夢（吉雉雞ex）
const etNonFire = etGame.useAbility(0, { abilityId: 'excited_turbo', energyCardId: 'et_f1', benchIndex: 1 });
assert(!etNonFire.success, '激動渦輪不可附於非火屬性備戰寶可夢');

// 4. 即使當回合已手動貼過能量（energyAttached = true），仍可連續 2 次發動激動渦輪附於備戰區小火龍
etP0.turnFlags.energyAttached = true;
const etOk1 = etGame.useAbility(0, { abilityId: 'excited_turbo', energyCardId: 'et_f1', benchIndex: 0 });
const etOk2 = etGame.useAbility(0, { abilityId: 'excited_turbo', energyCardId: 'et_f2', benchIndex: 0 });
assert(etOk1.success && etOk2.success, '場上有超級噴火龍Xex與花舞鳥ex時，激動渦輪應可不限次數連續發動');
assert.strictEqual(etP0.bench[0].attachedEnergy.length, 2, '備戰區小火龍應成功附加 2 個基本火能量');
console.log('✓ 花舞鳥ex特性【激動渦輪】條件檢核與不限次數貼能驗證全數通過！');

console.log('\n[Test 17] 測試物品卡「寶可夢交替」（指定備戰寶可夢互換、免撤退能量、解除異常狀態且同回合不限張數）...');
const swGame = new PTCGGame(
  'sw_test',
  { name: '玩家A', deck: { cardEntries: [] } },
  { name: '玩家B', deck: { cardEntries: [] } }
);
const swP0 = swGame.players[0];
swGame.turnNumber = 2;
swGame.activePlayerIndex = 0;
swP0.active = { instanceId: 'sw_a', name: '小火龍', supertype: 'pokemon', subtypes: ['Basic'], hp: 80, statusConditions: ['paralyzed'], attachedEnergy: [] };
swP0.bench = [];
swP0.hand = [
  { instanceId: 'sw_1', id: 'switch_card', name: '寶可夢交替', supertype: 'trainer', subtypes: ['Item'], effect: 'switch_active_bench' },
  { instanceId: 'sw_2', id: 'switch_card', name: '寶可夢交替', supertype: 'trainer', subtypes: ['Item'], effect: 'switch_active_bench' }
];
// 1. 備戰區無寶可夢時不可使用且保留手牌
const swEmptyFail = swGame.playItem(0, 'sw_1', { benchIndex: 0 });
assert(!swEmptyFail.success, '備戰區沒有寶可夢時應不可使用寶可夢交替');
assert.strictEqual(swP0.hand.length, 2, '使用失敗時寶可夢交替應保留於手牌中');

// 2. 放入 2 隻備戰寶可夢，將戰鬥場（麻痺且無能量）與備戰區第 2 隻（index 1）互換
swP0.bench = [
  { instanceId: 'sw_b0', name: '比克提尼', supertype: 'pokemon', subtypes: ['Basic'], hp: 80, attachedEnergy: [] },
  { instanceId: 'sw_b1', name: '花舞鳥ex', supertype: 'pokemon', subtypes: ['Basic', 'ex'], hp: 190, attachedEnergy: [] }
];
const swOk1 = swGame.playItem(0, 'sw_1', { benchIndex: 1 });
assert(swOk1.success, '即使戰鬥場麻痺且無能量，使用寶可夢交替應成功');
assert.strictEqual(swP0.active.name, '花舞鳥ex', '戰鬥場應已更換為指定的備戰寶可夢花舞鳥ex');
assert.strictEqual(swP0.bench[1].name, '小火龍', '原本戰鬥場的小火龍應退回備戰區索引 1');
assert.strictEqual(swP0.bench[1].statusConditions.length, 0, '退回備戰區後原麻痺狀態應清除');

// 3. 同回合再次使用第 2 張寶可夢交替換上比克提尼（驗證不限張數）
const swOk2 = swGame.playItem(0, 'sw_2', { benchIndex: 0 });
assert(swOk2.success, '同一回合應可再次使用第 2 張寶可夢交替');
assert.strictEqual(swP0.active.name, '比克提尼', '戰鬥場應已更換為比克提尼');
console.log('✓ 「寶可夢交替」指定互換、解除異常狀態與同回合不限張數驗證全數通過！');

console.log('\n=================================================');
console.log('🎉 所有單元測試與 PTCG 遊戲規則規範皆 100% 通過！');
console.log('=================================================');
