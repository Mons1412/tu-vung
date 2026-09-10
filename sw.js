const CACHE_NAME = "vocamini-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
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