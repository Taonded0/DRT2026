// 例: v1 や v2 になっていたら v3 や v-force-update に書き換える
const CACHE_NAME = 'dice-rugby-v3-force'; 

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // 古いキャッシュを無視して即座に新しいService Workerを有効化
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            // 古いバージョンのキャッシュを完全に破棄
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // すぐに全クライアントに反映
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

