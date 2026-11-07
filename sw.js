const CACHE_NAME = "vocamini-cache-v9";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./pronunciation/recorder.js",
  "./pronunciation/phoneme-data.js",
  "./pronunciation/minimal-pairs.js",
  "./icon-192.jpg",
  "./icon-512.jpg",
  "./manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", event => {
  // Always let the browser send recognition requests directly to the local Vosk API.
  // The cache only contains static GET resources, never responses from /api/.
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== 'GET' || requestUrl.pathname.startsWith('/api/')) return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith("vocamini-cache-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});
