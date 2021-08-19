var CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
var urlsToCache = [
    "/",
    "/db.js",
    "/index.js",
    "/styles.css",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
      caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
  });

self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        return cache.match(event.request);
                    });
            }).catch(err => console.log(err))
        );

        return;
    }

    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    );
});

// self.addEventListener("fetch", event => {
   
//     if (
//       event.request.method !== "GET" ||
//       !event.request.url.startsWith(self.location.origin)
//     ) {
//       event.respondWith(fetch(event.request));
//       return;
//     }
 
//     if (event.request.url.includes("/api/images")) {
     
//       event.respondWith(
//         caches.open(RUNTIME_CACHE).then(cache => {
//           return fetch(event.request)
//             .then(response => {
//               cache.put(event.request, response.clone());
//               return response;
//             })
//             .catch(() => caches.match(event.request));
//         })
//       );
//       return;
//     }
  
 
//     event.respondWith(
//       caches.match(event.request).then(cachedResponse => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }
  
       
//         return caches.open(RUNTIME_CACHE).then(cache => {
//           return fetch(event.request).then(response => {
//             return cache.put(event.request, response.clone()).then(() => {
//               return response;
//             });
//           });
//         });
//       })
//     );
//   });