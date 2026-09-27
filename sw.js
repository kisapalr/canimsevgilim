/* Çevrimdışı da açılsın diye küçük bir önbellek.
   Önce ağdan dener (böylece icerik.js'i düzenleyince değişiklik hemen görünür),
   internet yoksa önbellekten verir. */
const AD = "kavanoz-v4";
const DOSYALAR = [
  "./", "./index.html", "./style.css", "./app.js", "./icerik.js",
  "./manifest.json",
  "./ikonlar/icon-192.png", "./ikonlar/icon-512.png", "./ikonlar/apple-touch-icon.png",
  "./fotograflar/1.jpg", "./fotograflar/2.jpg", "./fotograflar/3.jpg",
  "./song.mp3"
];

self.addEventListener("install", e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(AD).then(c=>c.addAll(DOSYALAR).catch(()=>{})));
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(k=>Promise.all(k.filter(n=>n!==AD).map(n=>caches.delete(n))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", e=>{
  const istek = e.request;
  if(istek.method !== "GET") return;
  if(new URL(istek.url).origin !== location.origin) return;   // yazı tipleri vb.

  e.respondWith(
    fetch(istek).then(cevap=>{
      if(cevap && cevap.status === 200){
        const kopya = cevap.clone();
        caches.open(AD).then(c=>c.put(istek, kopya));
      }
      return cevap;
    }).catch(()=>
      caches.match(istek).then(b => b || caches.match("./index.html"))
    )
  );
});
