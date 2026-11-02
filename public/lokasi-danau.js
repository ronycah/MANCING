// public/lokasi-danau.js
// Pemandangan danau (VIS.01). Memuat img/danau.svg lalu menempelkannya ke halaman
// supaya warnanya bisa diatur lewat style.css (blok DANAU).
// Dipakai dengan: LokasiDanau.buat().then(function (wadah) { ...tempel wadah... });
// Sungai dan laut nanti dibuat sebagai berkas terpisah (lokasi-sungai.js, lokasi-laut.js).

(function () {
  "use strict";

  var ALAMAT_SVG = "img/danau.svg";

  // Teks SVG disimpan setelah diambil sekali, supaya tidak diunduh berulang.
  var teksSvg = null;

  function muatSvg() {
    if (teksSvg !== null) {
      return Promise.resolve(teksSvg);
    }
    return fetch(ALAMAT_SVG)
      .then(function (balasan) {
        if (!balasan.ok) {
          throw new Error("Berkas danau tidak ditemukan");
        }
        return balasan.text();
      })
      .then(function (teks) {
        teksSvg = teks;
        return teks;
      });
  }

  // Membuat wadah danau. Bila gambar gagal dimuat, wadah tetap dikembalikan
  // (kosong) supaya game tetap bisa dipakai dan tidak ada galat di layar.
  function buat() {
    var wadah = document.createElement("div");
    wadah.className = "danau";
    wadah.setAttribute("role", "img");
    wadah.setAttribute("aria-label", "Pemandangan danau");

    return muatSvg()
      .then(function (teks) {
        var dokumen = new DOMParser().parseFromString(teks, "image/svg+xml");
        var svg = dokumen.documentElement;
        if (
          !svg ||
          svg.nodeName.toLowerCase() !== "svg" ||
          dokumen.querySelector("parsererror")
        ) {
          throw new Error("Isi berkas danau tidak valid");
        }
        wadah.appendChild(document.importNode(svg, true));
        return wadah;
      })
      .catch(function () {
        return wadah;
      });
  }

  window.LokasiDanau = {
    buat: buat,
  };
})();
