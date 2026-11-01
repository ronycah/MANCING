// public/sw.js
// Service worker Mancing Santuy: strategi NETWORK FIRST.
// Ambil dari internet dulu; cache hanya cadangan saat offline.
// Hanya menangani berkas game (GET) dari domain sendiri.
// Panggilan ke Supabase atau domain lain TIDAK disentuh dan TIDAK di-cache.

// Naikkan angka versi ini bila ingin membersihkan cache lama.
const NAMA_CACHE = "santuy-v1";

// Berkas dasar yang disimpan sejak awal supaya game bisa dibuka offline.
const BERKAS_DASAR = [
  "./",
  "index.html",
  "config.js",
  "style.css",
  "akun.js",
  "manifest.json",
  "img/web-app-manifest-192x192.png",
  "img/web-app-manifest-512x512.png",
  "img/apple-touch-icon.png",
  "img/favicon.svg",
];

// Pasang: simpan berkas dasar. Satu berkas gagal tidak membatalkan yang lain.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(NAMA_CACHE)
      .then((cache) =>
        Promise.all(BERKAS_DASAR.map((url) => cache.add(url).catch(() => {}))),
      )
      .then(() => self.skipWaiting()),
  );
});

// Aktif: hapus cache versi lama, lalu ambil alih halaman yang terbuka.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((daftar) =>
        Promise.all(
          daftar
            .filter((nama) => nama !== NAMA_CACHE)
            .map((nama) => caches.delete(nama)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Ambil berkas: internet dulu, cache sebagai cadangan.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Hanya GET dan hanya domain sendiri (Supabase dan CDN dilewati).
  if (req.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req, { cache: "no-cache" })
      .then((res) => {
        // Simpan salinan terbaru hanya bila balasan normal.
        if (res && res.ok) {
          const salinan = res.clone();
          caches.open(NAMA_CACHE).then((cache) => cache.put(req, salinan));
        }
        return res;
      })
      .catch(() =>
        // Offline: pakai cache; untuk buka halaman, jatuh ke index.html.
        caches
          .match(req, { ignoreSearch: true })
          .then(
            (cache) =>
              cache ||
              (req.mode === "navigate"
                ? caches.match("index.html")
                : undefined),
          ),
      ),
  );
});
