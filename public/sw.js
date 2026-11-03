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
  "nama.js",
  "password.js",
  "mancing.js",
  "tas.js",
  "lokasi-danau.js",
  "manifest.json",
  "img/web-app-manifest-192x192.png",
  "img/web-app-manifest-512x512.png",
  "img/apple-touch-icon.png",
  "img/favicon.svg",
  "img/danau.svg",
  "img/sisikpasir.webp",
  "img/birumungil.webp",
  "img/babydragon.webp",
  "img/golddragon.webp",
  "img/ikan/bayangan-malam.webp",
  "img/ikan/bayu-bajra.webp",
  "img/ikan/belang-danio.webp",
  "img/ikan/benteng-karang.webp",
  "img/ikan/biru-mungil.webp",
  "img/ikan/dewa-air.webp",
  "img/ikan/ekor-lincah.webp",
  "img/ikan/ekor-pelangi.webp",
  "img/ikan/gembong-lautan.webp",
  "img/ikan/jejak-emas.webp",
  "img/ikan/keping-darah.webp",
  "img/ikan/kilat-samudra.webp",
  "img/ikan/kilau-senja.webp",
  "img/ikan/kuda-samudra.webp",
  "img/ikan/lembayung-purba.webp",
  "img/ikan/mata-zamrud.webp",
  "img/ikan/merah-bara.webp",
  "img/ikan/naga-emas.webp",
  "img/ikan/naga-mungil.webp",
  "img/ikan/nyala-api.webp",
  "img/ikan/pangeran-samudra.webp",
  "img/ikan/pari-kristal.webp",
  "img/ikan/pedang-ombak.webp",
  "img/ikan/pemburu-kelam.webp",
  "img/ikan/penari-gelombang.webp",
  "img/ikan/penembak-jitu.webp",
  "img/ikan/penghuni-arus.webp",
  "img/ikan/penguasa-amazon.webp",
  "img/ikan/penjelajah-gesit.webp",
  "img/ikan/perak-bulan.webp",
  "img/ikan/perisai-berlian.webp",
  "img/ikan/raja-gelombang.webp",
  "img/ikan/ratu-bintang.webp",
  "img/ikan/si-gelembung.webp",
  "img/ikan/sirip-petir.webp",
  "img/ikan/sirip-senja.webp",
  "img/ikan/sirip-siluman.webp",
  "img/ikan/sisik-pasir.webp",
  "img/ikan/sutra-berkilau.webp",
  "img/ikan/taring-badai.webp",
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
