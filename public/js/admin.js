// public/js/admin.js
// Admin Member Review & Management System

async function loadAdminMembers() {
  const token = localStorage.getItem('ptcg_token');
  const alertBox = document.getElementById('admin-alert');
  const tbody = document.getElementById('admin-members-tbody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/admin/members', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.success) {
      if (alertBox) {
        alertBox.className = 'alert alert-danger';
        alertBox.innerText = data.message || '無法取得會員審核名單';
        alertBox.style.display = 'block';
      }
      return;
    }

    if (alertBox) alertBox.style.display = 'none';

    tbody.innerHTML = '';
    if (!data.users || data.users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 24px;">目前尚無申請會員</td></tr>`;
      return;
    }

    data.users.forEach(u => {
      const tr = document.createElement('tr');
      const isAdmin = u.role === 'admin';

      let statusBadge = '';
      if (u.status === 'approved') {
        statusBadge = '<span class="status-badge status-approved">已通過審核</span>';
      } else if (u.status === 'pending') {
        statusBadge = '<span class="status-badge status-pending">待管理員審核</span>';
      } else {
        statusBadge = '<span class="status-badge status-rejected">已拒絕/停權</span>';
      }

      const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleString('zh-TW', { hour12: false }) : '-';

      let actionButtons = '';
      if (isAdmin) {
        actionButtons = '<span style="color: #38bdf8; font-size: 0.8rem; font-weight: bold;">👑 系統管理員</span>';
      } else {
        actionButtons = `
          <div style="display: flex; gap: 6px;">
            ${u.status !== 'approved' ? `<button class="btn btn-success btn-sm" onclick="handleMemberStatus('${u.phone}', 'approved')">通過審核</button>` : ''}
            ${u.status !== 'rejected' ? `<button class="btn btn-danger btn-sm" onclick="handleMemberStatus('${u.phone}', 'rejected')">拒絕/停權</button>` : ''}
            <button class="btn btn-secondary btn-sm" onclick="handleDeleteMember('${u.phone}')">刪除</button>
          </div>
        `;
      }

      tr.innerHTML = `
        <td style="font-weight: bold;">${u.phone}</td>
        <td>${u.name || '-'}</td>
        <td style="color: #94a3b8;">${u.birthday}</td>
        <td style="font-size: 0.8rem; color: #94a3b8;">${createdDate}</td>
        <td>${statusBadge}</td>
        <td>${actionButtons}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('loadAdminMembers error:', err);
  }
}

async function handleMemberStatus(phone, status) {
  const token = localStorage.getItem('ptcg_token');
  const alertBox = document.getElementById('admin-alert');
  const actionName = status === 'approved' ? '核准通過' : '拒絕/停權';

  if (!confirm(`確定要將會員 ${phone} 的資格設定為「${actionName}」嗎？`)) return;

  try {
    const res = await fetch('/api/admin/members/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phone, status })
    });
    const data = await res.json();

    if (alertBox) {
      alertBox.className = data.success ? 'alert alert-success' : 'alert alert-danger';
      alertBox.innerText = data.message;
      alertBox.style.display = 'block';
    }

    if (data.success) {
      loadAdminMembers();
    }
  } catch (err) {
    console.error('handleMemberStatus error:', err);
  }
}

async function handleDeleteMember(phone) {
  const token = localStorage.getItem('ptcg_token');
  const alertBox = document.getElementById('admin-alert');

  if (!confirm(`警告：確定要永久刪除會員 ${phone} 的帳號嗎？`)) return;

  try {
    const res = await fetch('/api/admin/members/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();

    if (alertBox) {
      alertBox.className = data.success ? 'alert alert-success' : 'alert alert-danger';
      alertBox.innerText = data.message;
      alertBox.style.display = 'block';
    }

    if (data.success) {
      loadAdminMembers();
    }
  } catch (err) {
    console.error('handleDeleteMember error:', err);
  }
}

// Bind admin refresh
document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refresh-members-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', loadAdminMembers);
  }
});
