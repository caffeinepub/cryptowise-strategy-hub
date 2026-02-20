/// <reference lib="webworker" />

const CACHE_NAME = 'cryptowise-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/generated/cryptowise-logo.dim_512x512.png',
  '/assets/generated/cryptowise-bg.dim_1920x1080.png',
];

const sw = self as unknown as ServiceWorkerGlobalScope;

// Install event - cache core assets
sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  sw.skipWaiting();
});

// Activate event - clean up old caches
sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  sw.clients.claim();
});

// Fetch event - serve from cache, fallback to network
sw.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external API requests (CoinGecko)
  if (event.request.url.includes('coingecko.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
