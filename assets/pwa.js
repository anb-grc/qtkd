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
      alert("Để cài đặt app trên iOS:\n1. Nhấn nút Share (Chia sẻ) ở trình duyệt Safari.\n2. Chọn 'Add to Home Screen' (Thêm vào MH chính).");
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
