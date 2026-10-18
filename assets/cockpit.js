/**
 * LearnIZ x TVU Telegram Automation Cockpit
 * Zero-AI Tacky Aesthetic - Pure Vector SVG - Fully Synchronized UI
 */

(function () {
  'use strict';

  const STORAGE_KEY_LAST_SEEN = 'learniz_tg_last_seen_id';
  const STORAGE_KEY_COLLAPSED = 'learniz_dash_collapsed';
  const EVENTS_URL = './assets/dashboard_events.json';
  const POLL_INTERVAL = 15000; // 15s

  let eventsCache = [];
  let systemStatusCache = {};
  let botUsernameCache = 'LearnIZ_TVU_Bot';
  let isDrawerOpen = false;
  let isRefreshing = false;

  // Clean vector SVG icons (Lucide/Feather style, 2px stroke, no emoji junk)
  const ICONS = {
    telegram: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>`,
    close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    externalLink: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    cpu: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    battery: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/></svg>`,
    shieldAlert: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    bookOpen: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    chevronUp: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    award: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
  };

  function injectDOM() {
    if (document.getElementById('tgCockpitFab')) return;

    // 1. Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'tgToastContainer';
    document.body.appendChild(toastContainer);

    // 2. Floating Action Button
    const fab = document.createElement('button');
    fab.id = 'tgCockpitFab';
    fab.title = 'Mở TVU Automation Cockpit';
    fab.innerHTML = `
      ${ICONS.telegram}
      <span id="tgCockpitBadge"></span>
    `;
    document.body.appendChild(fab);

    // 3. Drawer Backdrop & Container
    const backdrop = document.createElement('div');
    backdrop.id = 'tgDrawerBackdrop';
    backdrop.innerHTML = `
      <div id="tgDrawer" role="dialog" aria-modal="true" aria-label="TVU Automation Cockpit">
        <div class="tg-sheet-handle"></div>
        <div class="tg-drawer-header">
          <div class="tg-drawer-brand">
            <div class="tg-brand-icon">${ICONS.telegram}</div>
            <div class="tg-brand-title">
              TVU Cockpit
              <span class="tg-status-dot" id="tgHeaderStatusDot" title="Trạng thái hệ thống: Sẵn sàng"></span>
            </div>
          </div>
          <div class="tg-drawer-controls">
            <button class="tg-icon-btn" id="tgBtnRefresh" title="Làm mới">${ICONS.refresh}</button>
            <button class="tg-icon-btn" id="tgBtnClose" title="Đóng">${ICONS.close}</button>
          </div>
        </div>

        <div class="tg-monitor-bar" id="tgMonitorBar">
          <div class="tg-monitor-item">
            ${ICONS.cpu}
            <span id="tgMonitorSlot">Đang nạp...</span>
          </div>
          <div class="tg-monitor-item">
            ${ICONS.battery}
            <span id="tgMonitorBatt">100%</span>
          </div>
        </div>

        <div class="tg-stream" id="tgStream">
          <div class="tg-empty-state">Đang kết nối trung tâm điều phối TVU...</div>
        </div>

        <div class="tg-drawer-footer">
          <span id="tgLastSyncText">Đồng bộ: Vừa xong</span>
          <a href="https://t.me/${botUsernameCache}" target="_blank" rel="noopener" class="tg-tele-direct" id="tgDirectLink">
            ${ICONS.telegram}
            <span>Mở Bot Telegram</span>
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    // Event listeners
    fab.addEventListener('click', toggleDrawer);
    document.getElementById('tgBtnClose').addEventListener('click', closeDrawer);
    document.getElementById('tgBtnRefresh').addEventListener('click', () => fetchEvents(true));

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeDrawer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    });
  }

  function toggleDrawer() {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function openDrawer() {
    const backdrop = document.getElementById('tgDrawerBackdrop');
    if (!backdrop) return;
    backdrop.classList.add('tg-open');
    isDrawerOpen = true;

    // Clear unread badge
    const badge = document.getElementById('tgCockpitBadge');
    if (badge) {
      badge.style.display = 'none';
      badge.textContent = '';
    }

    if (eventsCache.length > 0) {
      const latestId = eventsCache[eventsCache.length - 1].id;
      localStorage.setItem(STORAGE_KEY_LAST_SEEN, latestId);
    }
  }

  function closeDrawer() {
    const backdrop = document.getElementById('tgDrawerBackdrop');
    if (!backdrop) return;
    backdrop.classList.remove('tg-open');
    isDrawerOpen = false;
  }

  async function fetchEvents(isManual = false) {
    if (isRefreshing) return;
    isRefreshing = true;

    const btnRefresh = document.getElementById('tgBtnRefresh');
    if (btnRefresh) btnRefresh.classList.add('spinning');

    try {
      const res = await fetch(`${EVENTS_URL}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newEvents = data.events || [];
      systemStatusCache = data.system_status || {};
      botUsernameCache = data.bot_username || 'LearnIZ_TVU_Bot';

      // Update direct Telegram link
      const directLink = document.getElementById('tgDirectLink');
      if (directLink) {
        directLink.href = `https://t.me/${botUsernameCache}`;
      }

      // Check for newly arrived events
      const lastSeenId = localStorage.getItem(STORAGE_KEY_LAST_SEEN);
      const prevIds = new Set(eventsCache.map(e => e.id));

      if (eventsCache.length > 0 && newEvents.length > 0) {
        // Detect genuinely new items
        const brandNewItems = newEvents.filter(e => !prevIds.has(e.id));
        if (brandNewItems.length > 0) {
          const newest = brandNewItems[brandNewItems.length - 1];
          if (!isDrawerOpen) {
            showToastNotification(newest);
            updateBadge(brandNewItems.length);
          }
        }
      } else if (!lastSeenId && newEvents.length > 0) {
        // First visit: set badge to unread count
        updateBadge(newEvents.length);
      }

      eventsCache = newEvents;
      renderMonitorBar();
      renderEventsList();
      renderHomeDashboard();

      const lastSyncEl = document.getElementById('tgLastSyncText');
      if (lastSyncEl) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        lastSyncEl.textContent = `Đồng bộ: ${timeStr}`;
      }

    } catch (err) {
      console.warn('[LearnIZ Cockpit] Không tải được dashboard_events.json:', err);
      if (eventsCache.length === 0) {
        const stream = document.getElementById('tgStream');
        if (stream) {
          stream.innerHTML = '<div class="tg-empty-state">Chưa thể đồng bộ sự kiện từ máy chủ.<br><small style="opacity:0.7">Sẽ tự động kết nối lại khi có mạng.</small></div>';
        }
      }
    } finally {
      isRefreshing = false;
      if (btnRefresh) {
        setTimeout(() => btnRefresh.classList.remove('spinning'), 400);
      }
    }
  }

  function updateBadge(count) {
    const badge = document.getElementById('tgCockpitBadge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
      badge.textContent = '';
    }
  }

  function renderMonitorBar() {
    const slotEl = document.getElementById('tgMonitorSlot');
    const battEl = document.getElementById('tgMonitorBatt');
    if (slotEl) {
      slotEl.textContent = systemStatusCache.slot || 'Sẵn sàng';
    }
    if (battEl) {
      battEl.textContent = systemStatusCache.battery || 'Pin: Tốt';
    }
  }

  function renderEventsList() {
    const stream = document.getElementById('tgStream');
    if (!stream) return;

    if (!eventsCache || eventsCache.length === 0) {
      stream.innerHTML = '<div class="tg-empty-state">Chưa có sự kiện nào từ hệ thống TVU.</div>';
      return;
    }

    // Render in reverse chronological order (newest on top)
    const sorted = [...eventsCache].reverse();
    stream.innerHTML = sorted.map(evt => createEventCardHTML(evt)).join('');

    // Attach action listeners
    stream.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', function () {
        const text = this.getAttribute('data-copy');
        copyToClipboard(text, this);
      });
    });
  }

  function createEventCardHTML(evt) {
    const priorityClass = `priority-${evt.priority || 'normal'}`;
    const badgeText = escapeHTML(getBadgeText(evt));

    // Stats HTML
    let statsHTML = '';
    if (evt.stats && typeof evt.stats === 'object') {
      const items = Object.entries(evt.stats).map(([k, v]) => `
        <div class="tg-stat-item">
          <span class="tg-stat-key">${escapeHTML(k)}:</span>
          <span class="tg-stat-val">${escapeHTML(v)}</span>
        </div>
      `).join('');
      statsHTML = `<div class="tg-card-stats">${items}</div>`;
    }

    // Actions HTML
    let actionsHTML = '';
    if (evt.actions && Array.isArray(evt.actions) && evt.actions.length > 0) {
      const btns = evt.actions.map(act => {
        if (act.type === 'copy') {
          return `
            <button class="tg-action-btn primary" data-copy="${escapeHTML(act.copy_text || '')}">
              ${ICONS.copy}
              <span>${escapeHTML(act.label)}</span>
            </button>
          `;
        } else {
          return `
            <a href="${sanitizeURL(act.url)}" target="_blank" rel="noopener noreferrer" class="tg-action-btn">
              ${ICONS.externalLink}
              <span>${escapeHTML(act.label)}</span>
            </a>
          `;
        }
      }).join('');
      actionsHTML = `<div class="tg-card-actions">${btns}</div>`;
    }

    return `
      <div class="tg-card ${priorityClass}" id="${escapeHTML(evt.id)}">
        <div class="tg-card-header">
          <span class="tg-card-badge">${badgeText}</span>
          <span class="tg-card-time">${escapeHTML(evt.time_str || '')}</span>
        </div>
        <div class="tg-card-title">${escapeHTML(evt.title || '')}</div>
        <div class="tg-card-msg">${escapeHTML(evt.message || '')}</div>
        ${statsHTML}
        ${actionsHTML}
      </div>
    `;
  }

  function getBadgeText(evt) {
    if (evt.type === 'quiz_completed') return 'CẦN NỘP BÀI';
    if (evt.type === 'forum_draft') return 'BÀI THẢO LUẬN';
    if (evt.type === 'harvest') return 'THU HOẠCH ĐỀ';
    if (evt.type === 'warning') return 'CẢNH BÁO';
    return (evt.subject_name || 'HỆ THỐNG').toUpperCase();
  }

  function showToastNotification(evt) {
    const container = document.getElementById('tgToastContainer');
    if (!container) return;

    triggerHaptic(25);

    const toast = document.createElement('div');
    toast.className = 'tg-toast';
    toast.innerHTML = `
      <div class="tg-toast-header">
        <span class="tg-toast-tag">${ICONS.telegram} ${escapeHTML(getBadgeText(evt))}</span>
        <button class="tg-toast-close" title="Đóng">${ICONS.close}</button>
      </div>
      <div class="tg-toast-body">
        <div class="tg-toast-title">${escapeHTML(evt.title || 'Thông báo TVU')}</div>
        <div>${escapeHTML(evt.message || '')}</div>
      </div>
      <div class="tg-toast-actions">
        <button class="tg-btn-subtle" id="tgToastViewDetail">Xem chi tiết</button>
      </div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.tg-toast-close');
    const viewBtn = toast.querySelector('#tgToastViewDetail');

    function dismiss() {
      toast.classList.add('tg-toast-exit');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }

    closeBtn.addEventListener('click', dismiss);
    viewBtn.addEventListener('click', () => {
      dismiss();
      openDrawer();
    });

    // Auto dismiss after 7 seconds
    setTimeout(dismiss, 7000);
  }

  function copyToClipboard(text, btnEl) {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      const originalHTML = btnEl.innerHTML;
      btnEl.innerHTML = `${ICONS.check} <span>Đã chép!</span>`;
      btnEl.style.borderColor = '#00d2a0';
      btnEl.style.color = '#00d2a0';

      triggerHaptic(20);

      setTimeout(() => {
        btnEl.innerHTML = originalHTML;
        btnEl.style.borderColor = '';
        btnEl.style.color = '';
      }, 1800);
    }).catch(err => {
      console.warn('Clipboard write error:', err);
    });
  }

  function triggerHaptic(duration = 20) {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      try {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        return;
      } catch (_) {}
    }
    if (navigator.vibrate) {
      try { navigator.vibrate([duration]); } catch (_) {}
    }
  }

  function sanitizeURL(url) {
    if (!url || typeof url !== 'string') return '#';
    const trimmed = url.trim();
    if (/^(https?:\/\/|\.\/|\/)/i.test(trimmed)) {
      return escapeHTML(trimmed);
    }
    return '#';
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getTVUWeeklyDeadline() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday ...
    let daysUntilSunday = (7 - dayOfWeek) % 7;
    const deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59);
    const diffMs = deadline.getTime() - now.getTime();
    if (diffMs <= 0) return 'Đã hết hạn';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;

    if (diffDays > 0) {
      return `Còn ${diffDays} ngày ${remHours}h`;
    }
    return `Còn ${diffHours} giờ`;
  }

  // Helper tra cứu tiến độ học tập đa nguồn cho từng môn học
  function getSubjectProgress(subject) {
    if (!subject) return { hasData: false, attempts: 0, lastScore: 0, lastTotal: 0, lastPercent: 0, isCompleted: false };

    let history = [];
    try {
      const key1 = 'tvu_history_' + (subject.jsonPath || '').normalize('NFC').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = (subject.jsonPath || '').substring((subject.jsonPath || '').lastIndexOf('/') + 1);
      const key2 = 'tvu_history_' + filename.replace(/[^a-zA-Z0-9]/g, '_');
      const key3 = 'tvu_history_subject_' + subject.id;

      const raw = localStorage.getItem(key1) || localStorage.getItem(key2) || localStorage.getItem(key3);
      if (raw) {
        history = JSON.parse(raw);
      } else {
        // Quét tìm key chứa tên môn hoặc ID
        const normName = (subject.name || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('tvu_history_')) {
            const cleanK = k.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            if (normName && cleanK.includes(normName)) {
              const r = localStorage.getItem(k);
              if (r) { history = JSON.parse(r); break; }
            }
          }
        }
      }
    } catch (_) {}

    const isCompleted = localStorage.getItem('tvu_completed_subject_' + subject.id) === 'true';
    const lastOpened = parseInt(localStorage.getItem('tvu_last_opened_' + subject.id)) || 0;

    if (Array.isArray(history) && history.length > 0) {
      const lastAttempt = history[history.length - 1];
      const percent = typeof lastAttempt.percent === 'number' 
        ? lastAttempt.percent 
        : Math.round(((lastAttempt.score || 0) / (lastAttempt.total || 1)) * 100);
      return {
        hasData: true,
        attempts: history.length,
        lastScore: lastAttempt.score || 0,
        lastTotal: lastAttempt.total || 0,
        lastPercent: percent,
        isCompleted: isCompleted,
        lastOpened: lastOpened
      };
    }

    return {
      hasData: false,
      attempts: 0,
      lastScore: 0,
      lastTotal: 0,
      lastPercent: 0,
      isCompleted: isCompleted,
      lastOpened: lastOpened
    };
  }

  function renderHomeDashboard() {
    const dash = document.getElementById('tvuHomeDashboard');
    if (!dash) return;

    const subjects = window.TVU_SUBJECTS || [];
    const totalCount = subjects.length;

    // Phân loại môn: Đã hoàn thành vs Đang học
    const completedList = [];
    const activeList = [];

    subjects.forEach(sub => {
      const prog = getSubjectProgress(sub);
      const item = { subject: sub, progress: prog };
      if (prog.isCompleted) {
        completedList.push(item);
      } else {
        activeList.push(item);
      }
    });

    // Sắp xếp môn đang học: ưu tiên môn có tương tác gần nhất
    activeList.sort((a, b) => {
      const tA = Math.max(a.progress.lastOpened, a.progress.attempts > 0 ? 1 : 0);
      const tB = Math.max(b.progress.lastOpened, b.progress.attempts > 0 ? 1 : 0);
      if (tA !== tB) return tB - tA;
      return parseInt(a.subject.id) - parseInt(b.subject.id);
    });

    // 1. Cập nhật tiến độ tổng thể chương trình
    const completedCount = completedList.length;
    const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const elCompCount = document.getElementById('dashCompletedCount');
    const elTotalCount = document.getElementById('dashTotalCount');
    const elCompPct = document.getElementById('dashCompletedPercent');
    const elBar = document.getElementById('dashOverallBar');
    const elActiveCount = document.getElementById('dashActiveCount');

    if (elCompCount) elCompCount.textContent = completedCount;
    if (elTotalCount) elTotalCount.textContent = totalCount;
    if (elCompPct) elCompPct.textContent = `${completedPct}%`;
    if (elBar) elBar.style.width = `${completedPct}%`;
    if (elActiveCount) elActiveCount.textContent = activeList.length;

    // 2. Render danh sách môn đang học (Môn học xong tự động ẩn)
    const activeContainer = document.getElementById('tvuActiveSubjectsList');
    if (activeContainer) {
      if (activeList.length === 0) {
        activeContainer.innerHTML = `
          <div class="tvu-all-done-banner">
            🎉 Chúc mừng! Bạn đã hoàn thành tất cả ${totalCount} môn học trong chương trình!
          </div>
        `;
      } else {
        activeContainer.innerHTML = activeList.map(({ subject, progress }) => {
          let scoreText = '';
          let scoreClass = 'low';
          let barWidth = 0;

          if (progress.hasData) {
            barWidth = Math.min(100, Math.max(5, progress.lastPercent));
            scoreClass = progress.lastPercent >= 80 ? 'high' : (progress.lastPercent >= 50 ? 'mid' : 'low');
            scoreText = `Điểm: <span class="meta-score ${scoreClass}">${progress.lastScore}/${progress.lastTotal} (${progress.lastPercent}%)</span> • ${progress.attempts} lượt ôn`;
          } else {
            scoreText = 'Chưa thi thử';
          }

          return `
            <div class="tvu-active-item" data-subject-id="${subject.id}">
              <div class="tvu-active-info">
                <div class="tvu-active-name-row">
                  <span class="tvu-active-id">${subject.id}</span>
                  <a href="./quiz.html?id=${subject.id}" class="tvu-active-name" title="Mở môn ${escapeHTML(subject.name)}">
                    ${escapeHTML(subject.name)}
                  </a>
                </div>
                <div class="tvu-active-meta">
                  <span class="tvu-mini-bar-wrap">
                    <span class="tvu-mini-bar-fill" style="width: ${barWidth}%;"></span>
                  </span>
                  <span>${scoreText}</span>
                </div>
              </div>
              <div class="tvu-active-actions">
                <a href="./quiz.html?id=${subject.id}" class="tvu-btn-pill primary" title="Vào ôn thi">
                  ${ICONS.bookOpen}
                  <span>Vào ôn</span>
                </a>
                <button type="button" class="tvu-btn-done btn-mark-done" data-id="${subject.id}" title="Đánh dấu đã học xong để ẩn khỏi Dashboard">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Xong</span>
                </button>
              </div>
            </div>
          `;
        }).join('');

        // Gắn sự kiện đánh dấu hoàn thành
        activeContainer.querySelectorAll('.btn-mark-done').forEach(btn => {
          btn.addEventListener('click', function () {
            const sid = this.getAttribute('data-id');
            if (sid) {
              localStorage.setItem('tvu_completed_subject_' + sid, 'true');
              renderHomeDashboard();
              updateSubjectsGridBadges();
            }
          });
        });
      }
    }

    // 3. Render khay môn đã hoàn thành (để xem / khôi phục)
    const toggleRow = document.getElementById('completedToggleRow');
    const badgeCompleted = document.getElementById('completedSubjectsBadge');
    const tray = document.getElementById('tvuCompletedTray');

    if (toggleRow && badgeCompleted && tray) {
      if (completedList.length > 0) {
        toggleRow.style.display = 'block';
        badgeCompleted.textContent = completedList.length;

        tray.innerHTML = completedList.map(({ subject, progress }) => {
          const scoreInfo = progress.hasData ? `(${progress.lastScore}/${progress.lastTotal} - ${progress.lastPercent}%)` : '';
          return `
            <div class="tvu-completed-item">
              <div>
                <span class="comp-name">${subject.id}. ${escapeHTML(subject.name)}</span>
                <span style="font-size: 0.85em; margin-left: 4px; color: #00d2a0;">${scoreInfo}</span>
              </div>
              <button type="button" class="tvu-btn-restore btn-restore-subject" data-id="${subject.id}" title="Đưa môn này trở lại danh sách đang học">
                Học lại
              </button>
            </div>
          `;
        }).join('');

        // Gắn sự kiện khôi phục môn
        tray.querySelectorAll('.btn-restore-subject').forEach(btn => {
          btn.addEventListener('click', function () {
            const sid = this.getAttribute('data-id');
            if (sid) {
              localStorage.removeItem('tvu_completed_subject_' + sid);
              renderHomeDashboard();
              updateSubjectsGridBadges();
            }
          });
        });

      } else {
        toggleRow.style.display = 'none';
        tray.style.display = 'none';
      }
    }

    // 4. Hàng sự kiện cấp thiết từ bot Telegram (nếu có bài cần nộp)
    const quizEvt = [...eventsCache].reverse().find(e => e.type === 'quiz_completed');
    const actionRow = document.getElementById('hudActionRow');
    const actionLeft = document.getElementById('hudActionLeft');
    const actionBtns = document.getElementById('hudActionBtns');

    if (actionRow && actionLeft && actionBtns) {
      if (quizEvt) {
        actionRow.style.display = 'flex';
        const subjectStr = quizEvt.subject_name ? `<strong>${escapeHTML(quizEvt.subject_name)}:</strong> ` : '';
        actionLeft.innerHTML = `
          <span class="badge-pill urgent">CẦN NỘP • HẠN 23:59 CN (${getTVUWeeklyDeadline()})</span>
          <span class="action-desc">${subjectStr}${escapeHTML(quizEvt.title || '')}</span>
        `;

        let btnsHTML = '';
        if (quizEvt.subject_id && quizEvt.subject_id !== '00') {
          btnsHTML += `
            <a href="./quiz.html?id=${escapeHTML(quizEvt.subject_id)}" class="tvu-btn-pill primary">
              ${ICONS.bookOpen}
              <span>Vào ôn</span>
            </a>
          `;
        }
        if (quizEvt.actions && Array.isArray(quizEvt.actions)) {
          quizEvt.actions.forEach(act => {
            if (act.type === 'copy') {
              btnsHTML += `
                <button class="tvu-btn-pill" data-copy="${escapeHTML(act.copy_text || '')}">
                  ${ICONS.copy}
                  <span>${escapeHTML(act.label)}</span>
                </button>
              `;
            } else {
              btnsHTML += `
                <a href="${sanitizeURL(act.url)}" target="_blank" rel="noopener noreferrer" class="tvu-btn-pill">
                  ${ICONS.externalLink}
                  <span>${escapeHTML(act.label)}</span>
                </a>
              `;
            }
          });
        }
        actionBtns.innerHTML = btnsHTML;

        actionBtns.querySelectorAll('[data-copy]').forEach(b => {
          b.addEventListener('click', function () {
            copyToClipboard(this.getAttribute('data-copy'), this);
          });
        });
      } else {
        actionRow.style.display = 'none';
      }
    }
  }

  // Cập nhật badge hoàn thành trên grid môn học toàn trang
  function updateSubjectsGridBadges() {
    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.card');
    cards.forEach(card => {
      const numEl = card.querySelector('.mod-number span');
      if (numEl) {
        const sid = numEl.textContent.trim();
        const isCompleted = localStorage.getItem('tvu_completed_subject_' + sid) === 'true';
        let badge = card.querySelector('.tag-completed-live');
        if (isCompleted && !badge) {
          const tagsWrap = card.querySelector('.card-tags');
          if (tagsWrap) {
            const b = document.createElement('span');
            b.className = 'tag-completed-live';
            b.style.cssText = 'display:inline-block; margin-left:6px; padding:2px 7px; border-radius:6px; background:rgba(0,210,160,0.15); color:#00d2a0; font-size:0.75em; font-weight:700; border:1px solid rgba(0,210,160,0.3);';
            b.textContent = '✓ ĐÃ HỌC XONG';
            tagsWrap.appendChild(b);
          }
        } else if (!isCompleted && badge) {
          badge.remove();
        }
      }
    });
  }

  function setupHomeDashboardListeners() {
    const refreshBtn = document.getElementById('dashRefreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        renderHomeDashboard();
        updateSubjectsGridBadges();
        fetchEvents(true).finally(() => {
          setTimeout(() => refreshBtn.classList.remove('spinning'), 400);
        });
      });
    }

    const toggleCompletedBtn = document.getElementById('btnToggleCompletedList');
    const completedTray = document.getElementById('tvuCompletedTray');
    if (toggleCompletedBtn && completedTray) {
      toggleCompletedBtn.addEventListener('click', () => {
        const isHidden = completedTray.style.display === 'none';
        completedTray.style.display = isHidden ? 'flex' : 'none';
        toggleCompletedBtn.classList.toggle('is-open', isHidden);
      });
    }

    const openDrawerBtn = document.getElementById('dashOpenDrawerBtn');
    if (openDrawerBtn) {
      openDrawerBtn.addEventListener('click', openDrawer);
    }
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
      } catch (_) {}
    }
    injectDOM();
    setupHomeDashboardListeners();
    renderHomeDashboard();
    updateSubjectsGridBadges();
    fetchEvents();
    setInterval(() => fetchEvents(false), POLL_INTERVAL);
  }

})();
