/**
 * LearnIZ x TVU Telegram Automation Cockpit
 * Zero-AI Tacky Aesthetic - Pure Vector SVG - Fully Synchronized UI
 */

(function () {
  'use strict';

  const STORAGE_KEY_LAST_SEEN = 'learniz_tg_last_seen_id';
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
    shieldAlert: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
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

  function renderHomeDashboard() {
    const dash = document.getElementById('tvuHomeDashboard');
    if (!dash) return;

    // 1. Header status & subtitle
    const statusDot = document.getElementById('dashStatusDot');
    if (statusDot) {
      const isOnline = systemStatusCache.status === 'online';
      statusDot.style.background = isOnline ? '#00d2a0' : '#ffc107';
      statusDot.style.boxShadow = isOnline ? '0 0 8px #00d2a0' : '0 0 8px #ffc107';
      statusDot.title = `Trạng thái: ${isOnline ? 'Sẵn sàng' : 'Chờ kết nối'}`;
    }

    const subtitleEl = document.getElementById('dashSubtitle');
    if (subtitleEl) {
      const slotText = systemStatusCache.slot || 'Chiều - Tối (19:00 - 21:00)';
      const deviceText = systemStatusCache.device || 'MacBook Pro';
      subtitleEl.textContent = `Khung giờ: ${slotText} • Thiết bị: ${deviceText}`;
    }

    const lastSyncEl = document.getElementById('dashLastSync');
    if (lastSyncEl) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      lastSyncEl.textContent = `Đồng bộ: ${timeStr}`;
    }

    // 2. Compute 4 KPI Tiles
    const kpiCourses = document.getElementById('dashKpiCourses');
    const kpiSlot = document.getElementById('dashKpiSlot');
    if (kpiCourses) {
      const activeSubjects = new Set(
        eventsCache
          .filter(e => e.subject_id && e.subject_id !== '00')
          .map(e => e.subject_id)
      );
      const count = activeSubjects.size > 0 ? activeSubjects.size : 3;
      kpiCourses.textContent = `${count}/3 môn`;
    }
    if (kpiSlot) {
      const rawSlot = systemStatusCache.slot || 'Trưa & Tối';
      const slotShort = rawSlot.split('(')[0].trim();
      kpiSlot.textContent = `Slot: ${slotShort}`;
    }

    // Tile 2: Trắc nghiệm LTTN
    const kpiQuiz = document.getElementById('dashKpiQuiz');
    const kpiQuizSub = document.getElementById('dashKpiQuizSub');
    const quizEvt = [...eventsCache].reverse().find(e => e.type === 'quiz_completed');
    if (kpiQuiz) {
      if (quizEvt) {
        kpiQuiz.textContent = quizEvt.stats?.['Tổng câu'] || '40/40 câu';
        if (kpiQuizSub) {
          kpiQuizSub.textContent = `Ước tính: ${quizEvt.stats?.['Dự kiến'] || '9.8 / 10'}`;
        }
      } else {
        kpiQuiz.textContent = 'Sẵn sàng';
        if (kpiQuizSub) kpiQuizSub.textContent = 'Chưa có bài thi';
      }
    }

    // Tile 3: Bài thảo luận tuần
    const kpiForum = document.getElementById('dashKpiForum');
    const kpiForumSub = document.getElementById('dashKpiForumSub');
    const forumEvt = [...eventsCache].reverse().find(e => e.type === 'forum_draft');
    if (kpiForum) {
      if (forumEvt) {
        kpiForum.textContent = '1/1 bài';
        if (kpiForumSub) kpiForumSub.textContent = 'Đã có bản nháp';
      } else {
        kpiForum.textContent = '0/1 bài';
        if (kpiForumSub) kpiForumSub.textContent = 'Chưa có chủ đề';
      }
    }

    // Tile 4: Thu hoạch đề mới
    const kpiHarvest = document.getElementById('dashKpiHarvest');
    const kpiTotalQs = document.getElementById('dashKpiTotalQs');
    const harvestEvt = [...eventsCache].reverse().find(e => e.type === 'harvest');
    if (kpiHarvest) {
      if (harvestEvt) {
        kpiHarvest.textContent = harvestEvt.stats?.['Câu mới'] || '+12 câu';
        if (kpiTotalQs) {
          kpiTotalQs.textContent = harvestEvt.stats?.['Tổng kho']
            ? `Tổng kho: ${harvestEvt.stats['Tổng kho']}`
            : 'Tổng kho: 248 câu';
        }
      } else {
        kpiHarvest.textContent = '0 câu';
        if (kpiTotalQs) kpiTotalQs.textContent = 'Kho đề ổn định';
      }
    }

    // 3. Render Today's Active Courses List
    const courseListEl = document.getElementById('dashCourseList');
    if (courseListEl) {
      const subjectEvents = eventsCache.filter(e => e.subject_id && e.subject_id !== '00');
      const displayEvents = subjectEvents.length > 0 ? subjectEvents : eventsCache;
      const recentEvents = [...displayEvents].reverse().slice(0, 4);

      if (recentEvents.length === 0) {
        courseListEl.innerHTML = '<div class="tg-empty-state" style="padding:16px;">Chưa có hoạt động nào trong phiên hôm nay.</div>';
      } else {
        courseListEl.innerHTML = recentEvents.map(evt => {
          let badgeClass = 'badge-info';
          let badgeText = 'CẬP NHẬT';

          if (evt.type === 'quiz_completed') {
            badgeClass = 'badge-urgent';
            badgeText = 'CẦN NỘP BÀI';
          } else if (evt.type === 'forum_draft') {
            badgeClass = 'badge-info';
            badgeText = 'BÀI THẢO LUẬN';
          } else if (evt.type === 'harvest') {
            badgeClass = 'badge-done';
            badgeText = 'THU HOẠCH ĐỀ';
          }

          let actionsHTML = '';
          if (evt.actions && Array.isArray(evt.actions) && evt.actions.length > 0) {
            actionsHTML = evt.actions.map(act => {
              if (act.type === 'copy') {
                return `
                  <button class="tg-action-btn primary" data-copy="${escapeHTML(act.copy_text || '')}" title="Sao chép">
                    ${ICONS.copy}
                    <span>${escapeHTML(act.label)}</span>
                  </button>
                `;
              } else {
                return `
                  <a href="${sanitizeURL(act.url)}" target="_blank" rel="noopener noreferrer" class="tg-action-btn" title="Mở liên kết">
                    ${ICONS.externalLink}
                    <span>${escapeHTML(act.label)}</span>
                  </a>
                `;
              }
            }).join('');
          } else {
            actionsHTML = `
              <button class="tg-action-btn" data-open-drawer="true" title="Xem luồng sự kiện">
                ${ICONS.telegram}
                <span>Chi tiết</span>
              </button>
            `;
          }

          const subjectLabel = evt.subject_name ? `${escapeHTML(evt.subject_name)} — ` : '';

          return `
            <div class="tvu-dash-course-row">
              <div class="tvu-dash-course-info">
                <div class="tvu-dash-course-badge-row">
                  <span class="tvu-dash-badge ${badgeClass}">${badgeText}</span>
                  <span style="font-size:0.75em; color:var(--muted);">${escapeHTML(evt.time_str || '')}</span>
                </div>
                <div class="tvu-dash-course-title">${subjectLabel}${escapeHTML(evt.title || '')}</div>
                <div class="tvu-dash-course-desc">${escapeHTML(evt.message || '')}</div>
              </div>
              <div class="tvu-dash-course-actions">
                ${actionsHTML}
              </div>
            </div>
          `;
        }).join('');

        // Attach listeners for copy & drawer
        courseListEl.querySelectorAll('[data-copy]').forEach(btn => {
          btn.addEventListener('click', function () {
            const text = this.getAttribute('data-copy');
            copyToClipboard(text, this);
          });
        });

        courseListEl.querySelectorAll('[data-open-drawer]').forEach(btn => {
          btn.addEventListener('click', openDrawer);
        });
      }
    }
  }

  function setupHomeDashboardListeners() {
    const refreshBtn = document.getElementById('dashRefreshBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        fetchEvents(true).finally(() => {
          setTimeout(() => refreshBtn.classList.remove('spinning'), 400);
        });
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
    fetchEvents();
    setInterval(() => fetchEvents(false), POLL_INTERVAL);
  }

})();
