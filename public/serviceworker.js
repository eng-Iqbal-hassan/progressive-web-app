
const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

// we have to do three things

// (1): Install SW
self.addEventListener("install", (event) => {
    // Here, we will open the cache and will add our files in the cache.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache)=>{
                console.log("cache opened");
                return cache.addAll(urlsToCache);
            }
        )
    )
});
// Here, self means the serverWorker

// (2): Listen for requests
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(async ()=>{
                return fetch(event.request)
                        .catch(()=> caches.match('offline.html'))
            })
        )
});

// (3): Activate the SW
self.addEventListener("activate", (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames)=>Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhiteList.includes(cacheName)) {
                    return caches.delete(cacheName)
                }
            })
        ))
    )
});