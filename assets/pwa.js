// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Xử lý logic nút Tải App (Install PWA)
let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

// Kiểm tra xem đang mở bằng trình duyệt hay đã cài App (Standalone)
const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

// Nếu đã cài app rồi thì ẩn nút đi trên mọi nền tảng
if (isStandalone && installBtn) {
  installBtn.style.display = 'none';
} else if (!isStandalone && installBtn) {
  // Nếu chưa cài thì hiện nút lên
  installBtn.style.display = 'inline-flex';
  
  // Detect iOS (Bao gồm cả Safari iOS khi bật chế độ Desktop - hiển thị MacIntel)
  const isIOS = (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    installBtn.addEventListener('click', () => {
      showIOSInstallGuide();
    });
  } else {
    // Android / Chrome
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
      } else {
        alert("Trình duyệt chưa sẵn sàng cài đặt hoặc bạn đang dùng trình duyệt nhúng (Zalo/Messenger). Vui lòng mở bằng Chrome hoặc chọn 'Thêm vào Màn hình chính' từ Menu trình duyệt (dấu 3 chấm).");
      }
    });

    // Lắng nghe sự kiện cài đặt trên Android/Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
  }
}

// Ẩn nút ngay lập tức sau khi user vừa cài đặt xong
window.addEventListener('appinstalled', () => {
  if (installBtn) {
    installBtn.style.display = 'none';
  }
  console.log('PWA was installed');
});

function showIOSInstallGuide() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.7)';
  overlay.style.backdropFilter = 'blur(8px)';
  overlay.style.webkitBackdropFilter = 'blur(8px)';
  overlay.style.zIndex = '99999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  const modal = document.createElement('div');
  modal.style.background = 'var(--surface, #1e1e35)';
  modal.style.color = 'var(--text, #fff)';
  modal.style.border = '1px solid var(--border, rgba(255,255,255,0.1))';
  modal.style.borderRadius = '16px';
  modal.style.padding = '24px';
  modal.style.maxWidth = '320px';
  modal.style.width = '90%';
  modal.style.textAlign = 'center';
  modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';

  modal.innerHTML = `
    <h3 style="margin-bottom: 16px; color: var(--primary, #6c5ce7); font-weight: 700;">Cài đặt ứng dụng</h3>
    <p style="margin-bottom: 12px; font-size: 0.95em; line-height: 1.5; color: var(--muted, rgba(255,255,255,0.7));">
      Để cài đặt LearnIZ trên iOS, vui lòng:
    </p>
    <div style="text-align: left; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px; margin-bottom: 20px;">
      <p style="margin-bottom: 12px; font-size: 0.95em;">1. Nhấn nút <strong>Share</strong> (Chia sẻ) <svg style="display:inline-block; vertical-align:middle; color:var(--secondary, #a29bfe);" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> ở thanh công cụ dưới đáy Safari.</p>
      <p style="font-size: 0.95em;">2. Chọn <strong>Thêm vào MH chính</strong> (Add to Home Screen) <svg style="display:inline-block; vertical-align:middle; color:var(--secondary, #a29bfe);" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>.</p>
    </div>
    <button id="closeIOSGuide" style="background: var(--primary, #6c5ce7); color: #fff; border: none; padding: 12px 24px; border-radius: 20px; font-weight: 600; cursor: pointer; width: 100%; transition: opacity 0.2s;">Đã hiểu</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById('closeIOSGuide').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}
