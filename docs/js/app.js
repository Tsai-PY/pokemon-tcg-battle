// public/js/app.js
// Main Application Controller, Navigation, and Auth State

let currentUser = null;

function switchView(targetViewId) {
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const target = document.getElementById(targetViewId);
  if (target) target.classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === targetViewId);
  });

  // Lazy load views
  if (targetViewId === 'view-decks') {
    loadSharedDecks();
  } else if (targetViewId === 'view-upload') {
    if (typeof initUploadDeckView === 'function') {
      initUploadDeckView();
    }
  } else if (targetViewId === 'view-admin') {
    loadAdminMembers();
  }
}

async function checkAuth() {
  const token = localStorage.getItem('ptcg_token');
  if (!token) {
    showLoggedOutUI();
    return;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.success && data.user) {
      currentUser = data.user;
      showLoggedInUI(currentUser);
      switchView('view-decks');
    } else {
      localStorage.removeItem('ptcg_token');
      showLoggedOutUI();
    }
  } catch (e) {
    showLoggedOutUI();
  }
}

function showLoggedInUI(user) {
  document.getElementById('main-nav').style.display = 'flex';
  document.getElementById('user-badge').style.display = 'flex';

  document.getElementById('header-username').textContent = user.name || user.phone;
  document.getElementById('header-avatar').textContent = (user.name || user.phone)[0];

  const roleLabel = user.role === 'admin' ? '👑 系統管理員' : '訓練家會員';
  document.getElementById('header-userrole').textContent = roleLabel;

  // Show/Hide admin nav button
  const adminBtn = document.getElementById('nav-admin-btn');
  if (adminBtn) {
    adminBtn.style.display = user.role === 'admin' ? 'flex' : 'none';
  }
}

function showLoggedOutUI() {
  currentUser = null;
  document.getElementById('main-nav').style.display = 'none';
  document.getElementById('user-badge').style.display = 'none';
  switchView('view-auth');
}

// Auth Handlers
async function handleLogin(e) {
  e.preventDefault();
  const phone = document.getElementById('login-phone').value.trim();
  const birthday = document.getElementById('login-birthday').value.trim();
  const alertBox = document.getElementById('auth-alert');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, birthday })
    });
    const data = await res.json();

    if (!data.success) {
      alertBox.className = 'alert alert-danger';
      alertBox.innerText = data.message;
      alertBox.style.display = 'block';
      return;
    }

    localStorage.setItem('ptcg_token', data.token);
    currentUser = data.user;
    alertBox.style.display = 'none';
    showLoggedInUI(currentUser);
    switchView('view-decks');
  } catch (err) {
    alertBox.className = 'alert alert-danger';
    alertBox.innerText = '登入發生錯誤，請確認伺服器連線狀態！';
    alertBox.style.display = 'block';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const phone = document.getElementById('reg-phone').value.trim();
  const birthday = document.getElementById('reg-birthday').value.trim();
  const name = document.getElementById('reg-name').value.trim();
  const alertBox = document.getElementById('auth-alert');

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, birthday, name })
    });
    const data = await res.json();

    if (!data.success) {
      alertBox.className = 'alert alert-danger';
      alertBox.innerText = data.message;
      alertBox.style.display = 'block';
      return;
    }

    alertBox.className = 'alert alert-success';
    alertBox.innerText = data.message;
    alertBox.style.display = 'block';

    // Switch to login tab
    setTimeout(() => {
      document.querySelector('.auth-tab-btn[data-tab="tab-login"]').click();
      document.getElementById('login-phone').value = phone;
      document.getElementById('login-birthday').value = birthday;
    }, 1500);
  } catch (err) {
    alertBox.className = 'alert alert-danger';
    alertBox.innerText = '註冊申請發生錯誤！';
    alertBox.style.display = 'block';
  }
}

function handleLogout() {
  localStorage.removeItem('ptcg_token');
  showLoggedOutUI();
}

// DOM Setup
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      switchView(targetView);
    });
  });

  const logoBtn = document.getElementById('logo-home-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', () => {
      if (currentUser) switchView('view-decks');
      else switchView('view-auth');
    });
  }

  // Auth Tabs
  document.querySelectorAll('.auth-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      const loginForm = document.getElementById('form-login');
      const regForm = document.getElementById('form-register');
      const alertBox = document.getElementById('auth-alert');
      if (alertBox) alertBox.style.display = 'none';

      if (targetTab === 'tab-login') {
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
      } else {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
      }
    });
  });

  // Auth Forms
  const loginForm = document.getElementById('form-login');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const regForm = document.getElementById('form-register');
  if (regForm) regForm.addEventListener('submit', handleRegister);

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // Quick fill Admin credentials: 0988229731 / 19710607
  const quickAdminBtn = document.getElementById('quick-admin-btn');
  if (quickAdminBtn) {
    quickAdminBtn.addEventListener('click', () => {
      document.getElementById('login-phone').value = '0988229731';
      document.getElementById('login-birthday').value = '19710607';
    });
  }

  // Initial Auth check
  checkAuth();
});
