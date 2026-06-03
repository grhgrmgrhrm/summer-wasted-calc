const CACHE_NAME = 'summer-tracker-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
];

self.addEventListener('install', e => {
  e.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
      caches.keys().then(keys =>
          Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Показать уведомление по сигналу из страницы
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification('☀️ Summer Wasted Calc', {
      body: 'Эй, добавь что сделал сегодня — не дай дню сгореть впустую!',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'daily-reminder',
      renotify: true,
      vibrate: [200, 100, 200]
    });
  }
});

// Клик по уведомлению — открыть приложение
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        if (list.length > 0) return list[0].focus();
        return clients.openWindow('./');
      })
  );
});
