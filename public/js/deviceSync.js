// public/js/deviceSync.js
// Cross-Device Sync Manager (Cloud Sync + PeerJS 4-digit P2P Direct Transfer + JSON Backup)

(function () {
  let syncPeer = null;

  function ensureSyncModal() {
    if (document.getElementById('cross-device-sync-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'cross-device-sync-modal';
    modal.className = 'card-detail-popup';
    modal.innerHTML = `
      <div class="card-detail-card" style="max-width: 680px; width: 95%; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 10px; margin-bottom: 14px;">
          <h3 style="margin: 0; font-size: 1.25rem; color: #38bdf8;">🔄 跨裝置資料同步 (電腦 ↔ iPad)</h3>
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeCrossDeviceSyncModal()">✕ 關閉</button>
        </div>

        <div id="sync-device-stats" style="background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 10px; padding: 12px; margin-bottom: 14px; font-size: 0.9rem; color: #e2e8f0;"></div>

        <!-- 1. Cloud Sync -->
        <div style="background: rgba(30, 41, 59, 0.75); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 12px; padding: 14px; margin-bottom: 14px;">
          <div style="font-weight: 800; color: #38bdf8; margin-bottom: 6px; font-size: 1rem;">☁️ 方式一：雲端自動雙向同步</div>
          <p style="font-size: 0.83rem; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
            將本機的「會員帳號、自訂卡片照片、共同牌組與新增卡牌」同步到雲端，並拉回其他裝置的最新變更。
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn btn-primary" id="btn-cloud-sync-now" onclick="runManualCloudSync()">☁️ 立即雙向同步（上傳＋下載合併）</button>
          </div>
          <div id="cloud-sync-result" style="margin-top: 8px; font-size: 0.85rem; color: #94a3b8;"></div>
        </div>

        <!-- 2. PeerJS Direct P2P Transfer -->
        <div style="background: rgba(30, 41, 59, 0.75); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 12px; padding: 14px; margin-bottom: 14px;">
          <div style="font-weight: 800; color: #34d399; margin-bottom: 6px; font-size: 1rem;">📡 方式二：PC ↔ iPad 即時點對點直傳（不限照片數量與容量）</div>
          <p style="font-size: 0.83rem; color: #cbd5e1; margin: 0 0 12px 0; line-height: 1.5;">
            若在電腦上傳了較多張照片，可於「舊/電腦端」產生 4 位數同步碼，再到「iPad 接收端」輸入同一組代碼即可直接秒傳所有照片與帳號！
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px;">
              <div style="font-weight: 700; color: #fbbf24; margin-bottom: 8px;">📤 傳送端（例如：電腦）</div>
              <button type="button" class="btn btn-warning btn-sm" style="width: 100%;" onclick="startPeerSyncSender()">產生 4 位數同步碼</button>
              <div id="peer-sender-status" style="margin-top: 8px; font-size: 0.85rem; color: #cbd5e1; min-height: 36px;"></div>
            </div>
            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px;">
              <div style="font-weight: 700; color: #34d399; margin-bottom: 8px;">📥 接收端（例如：iPad）</div>
              <div style="display: flex; gap: 6px;">
                <input type="text" id="peer-sync-code-input" class="form-control" maxlength="4" placeholder="輸入4位數代碼" style="padding: 6px 10px; font-size: 0.95rem; text-align: center; letter-spacing: 2px;">
                <button type="button" class="btn btn-success btn-sm" onclick="startPeerSyncReceiver()" style="white-space: nowrap;">接收同步</button>
              </div>
              <div id="peer-receiver-status" style="margin-top: 8px; font-size: 0.85rem; color: #cbd5e1; min-height: 36px;"></div>
            </div>
          </div>
        </div>

        <!-- 3. JSON Backup Export / Import -->
        <div style="background: rgba(30, 41, 59, 0.75); border: 1px solid #475569; border-radius: 12px; padding: 14px;">
          <div style="font-weight: 800; color: #e2e8f0; margin-bottom: 6px; font-size: 1rem;">💾 方式三：同步備份檔 (.json)</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="downloadSyncBackupFile()">⬇️ 匯出全部資料 (.json)</button>
            <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
              ⬆️ 匯入備份檔 (.json)
              <input type="file" accept=".json,application/json" style="display: none;" onchange="importSyncBackupFile(this)">
            </label>
          </div>
          <div id="backup-sync-status" style="margin-top: 8px; font-size: 0.83rem; color: #94a3b8;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function refreshSyncStats() {
    const statsEl = document.getElementById('sync-device-stats');
    if (!statsEl || typeof window.exportAllSyncData !== 'function') return;
    const d = window.exportAllSyncData();
    const imgCount = Object.keys(d.customImages || {}).length;
    const userCount = (d.users || []).length;
    const customCardCount = (d.customCards || []).length;
    const deckCount = (d.decks || []).length;
    const last = window._lastCloudSyncStatus;
    const lastInfo = last
      ? `<div style="margin-top: 6px; font-size: 0.8rem; color: #94a3b8;">最近雲端同步時間：${last.at}（帳號：${last.usersOk ? '✓' : '✗'} / 照片與牌組：${last.dataOk ? '✓' : '✗'}）</div>`
      : '';
    statsEl.innerHTML = `
      <div>📱 <strong>目前裝置資料統計：</strong>會員帳號 <b>${userCount}</b> 筆 ｜ 已更新卡片照片 <b>${imgCount}</b> 張 ｜ 共同牌組 <b>${deckCount}</b> 組 ｜ 自訂新增卡牌 <b>${customCardCount}</b> 張</div>
      ${lastInfo}
    `;
  }

  function refreshAllViewsAfterSync() {
    refreshSyncStats();
    if (typeof window.loadDecks === 'function') window.loadDecks();
    if (typeof window.initCardLibrary === 'function') window.initCardLibrary();
    if (typeof window.renderCardLibraryGrid === 'function') window.renderCardLibraryGrid();
    if (typeof window.loadAdminMembers === 'function') window.loadAdminMembers();
    if (typeof window.renderGameState === 'function' && window.currentGameState) {
      window.renderGameState(window.currentGameState);
    }
  }

  window.openCrossDeviceSyncModal = function () {
    ensureSyncModal();
    refreshSyncStats();
    document.getElementById('cross-device-sync-modal').classList.add('active');
  };

  window.closeCrossDeviceSyncModal = function () {
    const modal = document.getElementById('cross-device-sync-modal');
    if (modal) modal.classList.remove('active');
    if (syncPeer) {
      try { syncPeer.destroy(); } catch (e) {}
      syncPeer = null;
    }
  };

  window.runManualCloudSync = async function () {
    const btn = document.getElementById('btn-cloud-sync-now');
    const out = document.getElementById('cloud-sync-result');
    if (btn) btn.disabled = true;
    if (out) out.innerHTML = '<span style="color:#fbbf24;">⏳ 正在與雲端雙向合併資料中...</span>';
    try {
      const pullRes = await window.pullAllSyncFromCloud();
      const pushRes = await window.pushAllSyncToCloud(true);
      refreshAllViewsAfterSync();
      if (pushRes.usersOk && pushRes.dataOk) {
        out.innerHTML = `<span style="color:#34d399;">✅ 雲端雙向同步完成！已同步帳號與牌組/照片資料（總容量約 ${pushRes.sizeKB} KB）。請在 iPad 重新整理網頁即可看到最新資料。</span>`;
      } else if (pushRes.usersOk && !pushRes.dataOk) {
        out.innerHTML = `<span style="color:#fbbf24;">⚠️ 帳號已成功同步至雲端，但卡片照片總容量（${pushRes.sizeKB} KB）超過雲端免費空間上限（${pushRes.dataError || '容量過大'}）。請改用下方「方式二：4位數同步碼直傳」將照片傳至 iPad！</span>`;
      } else {
        out.innerHTML = `<span style="color:#f87171;">⚠️ 雲端連線異常（網路或免費空間限制），建議改用下方「方式二：4位數同步碼直傳」或「方式三：匯出備份檔」。</span>`;
      }
    } catch (e) {
      if (out) out.innerHTML = `<span style="color:#f87171;">❌ 同步發生錯誤：${e.message}</span>`;
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  window.startPeerSyncSender = function () {
    const statusEl = document.getElementById('peer-sender-status');
    if (typeof Peer === 'undefined') {
      statusEl.innerHTML = '<span style="color:#f87171;">PeerJS 尚未載入，請確認網路連線後重試。</span>';
      return;
    }
    if (syncPeer) {
      try { syncPeer.destroy(); } catch (e) {}
      syncPeer = null;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const peerId = `ptcg-sync-${code}`;
    statusEl.innerHTML = '<span style="color:#fbbf24;">⏳ 正在建立連線通道...</span>';
    syncPeer = new Peer(peerId);
    syncPeer.on('open', () => {
      statusEl.innerHTML = `✅ 同步碼：<strong style="font-size:1.35rem; color:#ffcb05; letter-spacing:3px;">${code}</strong><br><span style="font-size:0.78rem; color:#94a3b8;">請在 iPad 輸入此 4 位數代碼後按「接收同步」</span>`;
    });
    syncPeer.on('connection', (conn) => {
      statusEl.innerHTML = '<span style="color:#38bdf8;">🔄 已連線！正在傳送全部帳號與卡片照片...</span>';
      conn.on('open', () => {
        const data = window.exportAllSyncData();
        conn.send({ type: 'PTCG_SYNC_BUNDLE', payload: data });
        statusEl.innerHTML = '<span style="color:#34d399;">🎉 已成功將全部帳號、照片與牌組傳送至 iPad！</span>';
      });
    });
    syncPeer.on('error', (err) => {
      statusEl.innerHTML = `<span style="color:#f87171;">❌ 連線失敗：${err.type || err.message}</span>`;
    });
  };

  window.startPeerSyncReceiver = function () {
    const input = document.getElementById('peer-sync-code-input');
    const statusEl = document.getElementById('peer-receiver-status');
    const code = (input ? input.value : '').trim();
    if (!/^\d{4}$/.test(code)) {
      statusEl.innerHTML = '<span style="color:#f87171;">請輸入正確的 4 位數同步碼！</span>';
      return;
    }
    if (typeof Peer === 'undefined') {
      statusEl.innerHTML = '<span style="color:#f87171;">PeerJS 尚未載入，請確認網路連線。</span>';
      return;
    }
    if (syncPeer) {
      try { syncPeer.destroy(); } catch (e) {}
      syncPeer = null;
    }
    statusEl.innerHTML = `<span style="color:#fbbf24;">⏳ 正在連線至代碼 ${code}...</span>`;
    syncPeer = new Peer();
    syncPeer.on('open', () => {
      const conn = syncPeer.connect(`ptcg-sync-${code}`, { reliable: true });
      conn.on('data', (msg) => {
        if (msg && msg.type === 'PTCG_SYNC_BUNDLE' && msg.payload) {
          const stats = window.importAllSyncData(msg.payload);
          refreshAllViewsAfterSync();
          statusEl.innerHTML = `<span style="color:#34d399;">✅ 接收完成！新增帳號 ${stats.usersAdded} 筆、更新照片 ${stats.imagesAdded} 張、更新牌組 ${stats.decksUpdated} 組、新增卡牌 ${stats.cardsAdded} 張！</span>`;
          try { conn.close(); } catch (e) {}
        }
      });
      conn.on('error', (err) => {
        statusEl.innerHTML = `<span style="color:#f87171;">❌ 接收失敗：${err.message || err}</span>`;
      });
    });
    syncPeer.on('error', (err) => {
      statusEl.innerHTML = `<span style="color:#f87171;">❌ 找不到代碼 ${code} 或連線逾時（${err.type || err.message}）</span>`;
    });
  };

  window.downloadSyncBackupFile = function () {
    const data = window.exportAllSyncData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `ptcg-sync-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const status = document.getElementById('backup-sync-status');
    if (status) status.innerHTML = '<span style="color:#34d399;">✅ 已下載完整同步備份檔！請傳送至 iPad 匯入。</span>';
  };

  window.importSyncBackupFile = function (inputEl) {
    const file = inputEl && inputEl.files && inputEl.files[0];
    if (!file) return;
    const status = document.getElementById('backup-sync-status');
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        const stats = window.importAllSyncData(parsed);
        refreshAllViewsAfterSync();
        if (typeof window.pushAllSyncToCloud === 'function') window.pushAllSyncToCloud();
        if (status) status.innerHTML = `<span style="color:#34d399;">✅ 匯入成功！新增帳號 ${stats.usersAdded} 筆、更新照片 ${stats.imagesAdded} 張、更新牌組 ${stats.decksUpdated} 組、新增卡牌 ${stats.cardsAdded} 張！</span>`;
      } catch (e) {
        if (status) status.innerHTML = `<span style="color:#f87171;">❌ 檔案格式錯誤：${e.message}</span>`;
      }
      inputEl.value = '';
    };
    reader.readAsText(file);
  };
})();
