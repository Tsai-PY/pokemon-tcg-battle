// lib/auth.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data directory and users.json exist with default Admin account
function initUsersDb() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const defaultAdmin = {
    phone: '0988229731',
    birthday: '19710607',
    name: '系統管理員',
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString()
  };

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([defaultAdmin], null, 2), 'utf8');
  } else {
    try {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      // Ensure admin exists
      const hasAdmin = users.some(u => u.phone === defaultAdmin.phone);
      if (!hasAdmin) {
        users.unshift(defaultAdmin);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
      }
    } catch (e) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([defaultAdmin], null, 2), 'utf8');
    }
  }
}

function loadUsers() {
  initUsersDb();
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// In-memory active tokens
const activeSessions = new Map();

function generateToken(user) {
  const token = crypto.randomBytes(24).toString('hex');
  activeSessions.set(token, {
    phone: user.phone,
    name: user.name || user.phone,
    role: user.role,
    status: user.status,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });
  return token;
}

function verifyToken(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

function validateBirthday(bday) {
  if (!/^\d{8}$/.test(bday)) return false;
  const year = parseInt(bday.substring(0, 4), 10);
  const month = parseInt(bday.substring(4, 6), 10);
  const day = parseInt(bday.substring(6, 8), 10);
  if (year < 1920 || year > 2026) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  return true;
}

function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function registerUser(phone, birthday, name) {
  const cleanPhone = String(phone).trim();
  const cleanBirthday = String(birthday).trim();
  const cleanName = (name || '').trim() || `訓練家_${cleanPhone.slice(-4)}`;

  if (!validatePhone(cleanPhone)) {
    return { success: false, message: '請輸入正確的10碼行動電話號碼（例：0912345678）' };
  }
  if (!validateBirthday(cleanBirthday)) {
    return { success: false, message: '密碼必須為西元生日8碼（例：19950520）' };
  }

  const users = loadUsers();
  const existing = users.find(u => u.phone === cleanPhone);
  if (existing) {
    return { success: false, message: '此行動電話號碼已被註冊過！' };
  }

  const newUser = {
    phone: cleanPhone,
    birthday: cleanBirthday,
    name: cleanName,
    role: 'member',
    status: 'pending', // Pending admin review
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: '註冊申請成功！請等待系統管理員審核通過後即可登入對戰。',
    user: {
      phone: newUser.phone,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status
    }
  };
}

function loginUser(phone, birthday) {
  const cleanPhone = String(phone).trim();
  const cleanBirthday = String(birthday).trim();

  const users = loadUsers();
  const user = users.find(u => u.phone === cleanPhone);

  if (!user) {
    return { success: false, message: '帳號不存在，初次使用請先點選「申請會員」' };
  }

  if (user.birthday !== cleanBirthday) {
    return { success: false, message: '密碼錯誤（密碼為西元生日8碼）' };
  }

  // Admin always has immediate access
  if (user.role === 'admin') {
    const token = generateToken(user);
    return {
      success: true,
      message: '系統管理員登入成功',
      token,
      user: {
        phone: user.phone,
        name: user.name,
        role: user.role,
        status: user.status
      }
    };
  }

  // Member status check
  if (user.status === 'pending') {
    return {
      success: false,
      message: '您的會員資格尚在等待系統管理員審核中，審核通過後方可登入！'
    };
  }

  if (user.status === 'rejected') {
    return {
      success: false,
      message: '您的會員資格已被管理員拒絕或停權，如有疑問請洽管理員！'
    };
  }

  const token = generateToken(user);
  return {
    success: true,
    message: '登入成功！歡迎進入寶可夢紙牌對戰系統',
    token,
    user: {
      phone: user.phone,
      name: user.name,
      role: user.role,
      status: user.status
    }
  };
}

// Admin management operations
function getMemberList(adminToken) {
  const admin = verifyToken(adminToken);
  if (!admin || admin.role !== 'admin') {
    return { success: false, message: '無管理員權限' };
  }

  const users = loadUsers().map(u => ({
    phone: u.phone,
    name: u.name,
    birthday: u.birthday,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    approvedAt: u.approvedAt || null
  }));

  return { success: true, users };
}

function updateMemberStatus(adminToken, targetPhone, newStatus) {
  const admin = verifyToken(adminToken);
  if (!admin || admin.role !== 'admin') {
    return { success: false, message: '無管理員權限' };
  }

  if (!['approved', 'rejected', 'pending'].includes(newStatus)) {
    return { success: false, message: '無效的審核狀態' };
  }

  const users = loadUsers();
  const target = users.find(u => u.phone === targetPhone);
  if (!target) {
    return { success: false, message: '找不到該會員' };
  }

  if (target.role === 'admin') {
    return { success: false, message: '無法修改管理員狀態' };
  }

  target.status = newStatus;
  if (newStatus === 'approved') {
    target.approvedAt = new Date().toISOString();
  }
  saveUsers(users);

  return { success: true, message: `會員 ${target.phone} 狀態已更新為：${newStatus === 'approved' ? '審核通過' : newStatus === 'rejected' ? '拒絕/停權' : '待審核'}` };
}

function deleteMember(adminToken, targetPhone) {
  const admin = verifyToken(adminToken);
  if (!admin || admin.role !== 'admin') {
    return { success: false, message: '無管理員權限' };
  }

  let users = loadUsers();
  const target = users.find(u => u.phone === targetPhone);
  if (!target) {
    return { success: false, message: '找不到該會員' };
  }
  if (target.role === 'admin') {
    return { success: false, message: '無法刪除系統管理員' };
  }

  users = users.filter(u => u.phone !== targetPhone);
  saveUsers(users);

  return { success: true, message: `會員 ${targetPhone} 已刪除` };
}

module.exports = {
  initUsersDb,
  registerUser,
  loginUser,
  verifyToken,
  getMemberList,
  updateMemberStatus,
  deleteMember
};
