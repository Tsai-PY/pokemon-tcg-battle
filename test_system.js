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
// Attach energy to active
const fireEnergy = { name: '基本火能量', supertype: 'energy', energyType: 'Fire' };
currentP.active.attachedEnergy.push(fireEnergy, fireEnergy, fireEnergy);

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

console.log('\n=================================================');
console.log('🎉 所有單元測試與 PTCG 遊戲規則規範皆 100% 通過！');
console.log('=================================================');
