// public/lokasi-laut.js
// Pemandangan laut (VIS.08). Memuat img/laut.svg lalu menempelkannya ke halaman
// supaya warnanya bisa diatur lewat style.css (blok LAUT).
// Dipakai dengan: LokasiLaut.buat().then(function (wadah) { ...tempel wadah... });
// Strukturnya sama dengan lokasi-danau.js dan lokasi-sungai.js. Belum dipasang di layar utama:
// pemilihan lokasi dikerjakan di VIS.09.

(function () {
  "use strict";

  var ALAMAT_SVG = "img/laut.svg";

  // Teks SVG disimpan setelah diambil sekali, supaya tidak diunduh berulang.
  var teksSvg = null;

  function muatSvg() {
    if (teksSvg !== null) {
      return Promise.resolve(teksSvg);
    }
    return fetch(ALAMAT_SVG)
      .then(function (balasan) {
        if (!balasan.ok) {
          throw new Error("Berkas laut tidak ditemukan");
        }
        return balasan.text();
      })
      .then(function (teks) {
        teksSvg = teks;
        return teks;
      });
  }

  // Membuat wadah laut. Bila gambar gagal dimuat, wadah tetap dikembalikan
  // (kosong) supaya game tetap bisa dipakai dan tidak ada galat di layar.
  function buat() {
    var wadah = document.createElement("div");
    wadah.className = "laut";
    wadah.setAttribute("role", "img");
    wadah.setAttribute("aria-label", "Pemandangan laut");

    return muatSvg()
      .then(function (teks) {
        var dokumen = new DOMParser().parseFromString(teks, "image/svg+xml");
        var svg = dokumen.documentElement;
        if (
          !svg ||
          svg.nodeName.toLowerCase() !== "svg" ||
          dokumen.querySelector("parsererror")
        ) {
          throw new Error("Isi berkas laut tidak valid");
        }
        wadah.appendChild(document.importNode(svg, true));
        return wadah;
      })
      .catch(function () {
        return wadah;
      });
  }

  window.LokasiLaut = {
    buat: buat,
  };
})();
