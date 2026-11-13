const CACHE = "eda-bus-v2";
const SHELL = ["./","./style.css","./questions.js","./extra.js","./materials.js","./app.js"];
const shellUrls = new Set(SHELL.map(path => new URL(path,self.registration.scope).href));

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const path of SHELL) {
      const response = await fetch(path,{cache:"reload"});
      if (!response.ok || response.redirected) throw new Error("No se pudo preparar " + path);
      if (path === "./" && !(await response.clone().text()).includes('id="offline-enable"')) {
        throw new Error("El acceso al sitio requiere iniciar sesión");
      }
      await cache.put(path,response);
    }
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("eda-bus-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || !shellUrls.has(request.url)) return;
  event.respondWith((async () => {
    try {
      return await fetch(request);
    } catch {
      const cache = await caches.open(CACHE);
      return await cache.match(request) || Response.error();
    }
  })());
});
