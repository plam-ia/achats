const CACHE="achats-v5-evolution";
const CORE=["./","./index.html?v=5","./styles.css?v=5","./app.js?v=5","./config.js","./manifest.json?v=5"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET") return;e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const clone=r.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return r;}).catch(()=>caches.match(e.request)));});
