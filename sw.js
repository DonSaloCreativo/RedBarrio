self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('llamabarrio-v1').then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'script.js',
        'manifest.json'
      ]).catch(err => console.log("Error cargando caché: ", err));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});