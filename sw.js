const CACHE_NAME = 'learniz-cache-v104';
const DYNAMIC_CACHE = 'learniz-dynamic-v26';

const PRECACHE_URLS = [
  './',
  './index.html',
  './quiz.html',
  './manifest.json',
  './assets/style.css',
  './assets/config.js',
  './assets/app.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Bỏ qua các request không phải GET hoặc khác origin
  if (event.request.method !== 'GET') return;
  
  // Với các file HTML hoặc JSON, ưu tiên lấy từ Network (để luôn cập nhật mới nhất)
  // Nếu mất mạng thì fallback về Cache
  if (event.request.headers.get('accept').includes('text/html') || event.request.url.includes('.json')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    // Với assets tĩnh (CSS, JS, ảnh), ưu tiên Cache (để tải siêu nhanh)
    // Fallback về Network nếu chưa có trong Cache
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // Fetch ngầm để cập nhật cache cho lần sau (stale-while-revalidate)
          event.waitUntil(
            fetch(event.request).then(response => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, response);
              });
            })
          );
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
  }
});
