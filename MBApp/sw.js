self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                "./",
                "./css/style.css",
                "./scripts/main.js",
                "./imgs/Logo192-White.png",
                "./imgs/Logo512-White.png",
                "./imgs/MenuIcon50.png",
                "./imgs/SearchIcon.png"
            ]);
        }) 
    );
});

self.addEventListener("fetch", e => {
    console.log(`Intercepting fetch request for: ${e.request.url}`);
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
}); 