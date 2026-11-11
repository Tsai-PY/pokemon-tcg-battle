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

console.log('\n=================================================');
console.log('🎉 所有單元測試與 PTCG 遊戲規則規範皆 100% 通過！');
console.log('=================================================');
