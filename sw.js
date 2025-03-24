const CACHE_NAME = 'pwa-cache-v3';
const DYNAMIC_CACHE = 'pwa-dynamic-cache';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching assets');
      return cache.addAll([
        '/',
        '/index.html',
        '/about.html',
        '/offline.html',
        '/src/css/style.css',
        '/src/js/app.js',
        '/manifest.json',
        '/src/css/offline.css'
      ]).then(() => {
        console.log('[Service Worker] All assets cached');
      }).catch((error) => {
        console.error('[Service Worker] Failed to cache assets', error);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then(function(res) {
        const resClone = res.clone();
        
        caches.open(DYNAMIC_CACHE).then(function(cache) {
          cache.put(event.request, resClone);
        });
        
        return res;
      }).catch(function(err) {

        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match(OFFLINE_PAGE);
        }
      });
    })
  );
});