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

// Detect iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (isIOS) {
  // Check if already installed
  const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  if (!isStandalone && installBtn) {
    installBtn.style.display = 'inline-flex';
    installBtn.addEventListener('click', () => {
      alert("Để cài đặt app trên iOS:\\n1. Nhấn nút Share (Chia sẻ) ở trình duyệt Safari.\\n2. Chọn 'Add to Home Screen' (Thêm vào MH chính).");
    });
  }
} else {
  // Lắng nghe sự kiện cài đặt trên Android/Chrome
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.addEventListener('click', async () => {
        installBtn.style.display = 'none';
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
      });
    }
  });
}

// Ẩn nút sau khi đã cài đặt thành công
window.addEventListener('appinstalled', () => {
  if (installBtn) {
    installBtn.style.display = 'none';
  }
  console.log('PWA was installed');
});
