// public/mancing.js
// Layar permainan sederhana (MCG.03): tombol Lempar Kail, hitung mundur umpan, dan hasil lemparan.
// Dipasang di layar utama oleh nama.js lewat window.MANCING_LEMPAR.pasang(...).
// Hasil lemparan SEPENUHNYA ditentukan server (aksi "lempar"); aplikasi tidak mengirim angka apa pun.
// Hitung mundur memakai sisa detik dari server dan jam internal browser (performance.now),
// bukan jam HP, jadi mengubah jam HP tidak berpengaruh (MC9).
// Semua teks lewat textContent (tanpa innerHTML). Galat mentah tidak ditampilkan.
// VIS.01: pemandangan danau dipasang di atas area hasil lewat window.LokasiDanau (lokasi-danau.js), hanya tampilan.
(function () {
  "use strict";

  const PESAN = {
    melempar: "Melempar kail...",
    gagalTerhubung: "Gagal terhubung, coba lagi",
    gagalLempar: "Gagal melempar kail. Coba lagi",
    terlaluSering: "Terlalu sering mencoba. Tunggu sebentar lalu coba lagi",
    umpanHabis: "Umpan habis. Tunggu sampai umpan pulih",
    kolamKosong: "Kolam sedang kosong. Umpanmu tidak terpakai, coba lagi nanti",
    umpanTidakTerbaca: "Umpan belum terbaca. Muat ulang halaman",
    ikanLepas: "Ikan lepas!",
    dapatIkan: "Dapat ikan!",
  };

  // Kelas yang dikenal, dipakai untuk warna kotak gambar sementara.
  const KELAS_DIKENAL = ["common", "rare", "epic", "legendary"];
  const NAMA_KELAS = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };

  // Jeda animasi singkat sebelum hasil ditampilkan (milidetik).
  const JEDA_ANIMASI = 700;
  // Bila gagal menyegarkan umpan, coba lagi setelah sekian milidetik (maksimal 3 kali).
  const JEDA_ULANG = 10000;
  const MAKS_ULANG = 3;

  function dua(n) {
    return String(n).padStart(2, "0");
  }

  // Detik -> "mm:ss" (atau "j:mm:ss" bila lebih dari satu jam).
  function formatWaktu(detik) {
    const d = Math.max(0, Math.ceil(detik));
    const j = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = d % 60;
    return j > 0 ? j + ":" + dua(m) + ":" + dua(s) : dua(m) + ":" + dua(s);
  }

  function jeda(ms) {
    return new Promise(function (selesai) {
      setTimeout(selesai, ms);
    });
  }

  function kosongkanElemen(e) {
    while (e.firstChild) e.removeChild(e.firstChild);
  }

  // Dipanggil dari nama.js. ctx berisi:
  // induk, status, buatEl, aturPesan, kirim(aksi), muatStatus(), saatUmpanBerubah(), sesiHabis()
  function pasang(ctx) {
    const status = ctx.status;

    const bagian = ctx.buatEl("div", "mancing");
    const area = ctx.buatEl("div", "hasil-lempar");
    area.setAttribute("aria-live", "polite");
    const hitung = ctx.buatEl("p", "petunjuk hitung-mundur");
    const pesan = ctx.buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    const tombol = ctx.buatEl("button", "tombol tombol-lempar", "Lempar Kail");
    tombol.type = "button";

    // VIS.01: pemandangan danau di bagian paling atas. Dilewati bila lokasi-danau.js tidak termuat.
    // Tempat sementara (kelas "danau") menjaga tinggi layar sampai gambar selesai dimuat.
    const modulDanau = window.LokasiDanau;
    if (modulDanau && typeof modulDanau.buat === "function") {
      const tempatDanau = ctx.buatEl("div", "danau");
      bagian.appendChild(tempatDanau);
      modulDanau.buat().then(function (wadahDanau) {
        // Bila layar sudah berganti sebelum gambar selesai, tidak perlu dipasang.
        if (tempatDanau.parentNode === bagian) {
          bagian.replaceChild(wadahDanau, tempatDanau);
        }
      });
    }

    bagian.appendChild(area);
    bagian.appendChild(hitung);
    bagian.appendChild(pesan);
    bagian.appendChild(tombol);
    ctx.induk.appendChild(bagian);

    let sibuk = false; // menunggu jawaban lempar (MC10)
    let menyegarkan = false; // menunggu jawaban status saat umpan pulih
    let akhir = null; // waktu performance.now() saat umpan berikutnya pulih
    let ulang = 0;
    let pewaktu = null;

    // Simpan juga di status supaya kembali dari layar lain tidak mulai dari nol.
    function aturAkhir(detik) {
      status.detik_ke_umpan_berikutnya = detik;
      if (typeof detik === "number" && isFinite(detik) && detik > 0) {
        akhir = performance.now() + detik * 1000;
      } else {
        akhir = null;
      }
      status._akhir_umpan = akhir;
    }

    function perbaruiTampilan() {
      const ada = Number(status.umpan) > 0;
      tombol.disabled = sibuk || !ada;
      let teks = "";
      if (akhir !== null) {
        const sisa = (akhir - performance.now()) / 1000;
        // Hitung mundur ini jarak ke tambahan 1 umpan, bukan jeda antar lemparan.
        teks =
          (ada ? "+1 umpan dalam " : "Umpan habis. +1 umpan dalam ") +
          formatWaktu(sisa);
      } else if (!ada) {
        teks = "Umpan habis. Tunggu sebentar";
      }
      hitung.textContent = teks;
    }

    function tundaUlang() {
      if (ulang < MAKS_ULANG) {
        ulang += 1;
        akhir = performance.now() + JEDA_ULANG;
        status._akhir_umpan = akhir;
      } else {
        akhir = null;
        status._akhir_umpan = null;
        ctx.aturPesan(pesan, PESAN.umpanTidakTerbaca, true);
      }
    }

    // Umpan sudah waktunya pulih: tanyakan status ke server SEKALI (bukan polling terus).
    async function segarkan() {
      menyegarkan = true;
      const res = await ctx.muatStatus();
      menyegarkan = false;
      if (!bagian.isConnected) return;

      if (res.ok && res.status) {
        if (typeof res.status.umpan === "number") {
          status.umpan = res.status.umpan;
        }
        if (typeof res.status.umpan_maks === "number") {
          status.umpan_maks = res.status.umpan_maks;
        }
        aturAkhir(res.status.detik_ke_umpan_berikutnya);
        ctx.saatUmpanBerubah();
        if (Number(status.umpan) <= 0 && akhir === null) {
          tundaUlang();
        } else {
          ulang = 0;
        }
      } else if (res.kode === 401) {
        ctx.sesiHabis();
        return;
      } else {
        tundaUlang();
      }
      perbaruiTampilan();
    }

    function tampilIkan(ikan) {
      const k = String(ikan.kelas || "").toLowerCase();
      const dikenal = KELAS_DIKENAL.indexOf(k) !== -1;
      const kartuIkan = ctx.buatEl(
        "div",
        "kartu-ikan" + (dikenal ? " kelas-" + k : ""),
      );
      kartuIkan.appendChild(ctx.buatEl("p", "judul-hasil", PESAN.dapatIkan));
      // Gambar sementara: kotak berwarna sesuai kelas (SVG ikan menyusul).
      kartuIkan.appendChild(ctx.buatEl("div", "gambar-ikan", "🐟"));
      kartuIkan.appendChild(
        ctx.buatEl("p", "nama-ikan", String(ikan.nama || "")),
      );
      kartuIkan.appendChild(
        ctx.buatEl(
          "p",
          "kelas-ikan",
          dikenal ? NAMA_KELAS[k] : String(ikan.kelas || ""),
        ),
      );
      kartuIkan.appendChild(
        ctx.buatEl("p", "jumlah-ikan", "Dimiliki: " + ikan.jumlah_dimiliki),
      );
      area.appendChild(kartuIkan);
    }

    function tampilHasil(h) {
      kosongkanElemen(area);
      ctx.aturPesan(pesan, "", false);

      if (h.status === "ok" && h.ikan && typeof h.ikan === "object") {
        tampilIkan(h.ikan);
      } else if (h.status === "lepas") {
        // MC3: hanya tulisan ini, tanpa nama ikan dan tanpa penjelasan.
        area.appendChild(ctx.buatEl("p", "ikan-lepas", PESAN.ikanLepas));
      } else if (h.status === "umpan_habis") {
        ctx.aturPesan(pesan, PESAN.umpanHabis, false);
      } else if (h.status === "kolam_kosong") {
        ctx.aturPesan(pesan, PESAN.kolamKosong, true);
      } else {
        ctx.aturPesan(pesan, PESAN.gagalLempar, true);
      }
    }

    tombol.addEventListener("click", async function () {
      if (sibuk) return;
      sibuk = true;
      kosongkanElemen(area);
      ctx.aturPesan(pesan, "", false);
      area.appendChild(ctx.buatEl("p", "petunjuk", PESAN.melempar));
      perbaruiTampilan();

      const jawaban = await Promise.all([
        ctx.kirim("lempar"),
        jeda(JEDA_ANIMASI),
      ]);
      const res = jawaban[0];
      sibuk = false;

      // Perbarui status bersama DULU, walau layar sudah berpindah, supaya angka tidak basi.
      if (res.ok && res.hasil && typeof res.hasil === "object") {
        const h = res.hasil;
        if (typeof h.umpan === "number") status.umpan = h.umpan;
        if (typeof h.umpan_maks === "number") status.umpan_maks = h.umpan_maks;
        aturAkhir(h.detik_ke_umpan_berikutnya);
        ctx.saatUmpanBerubah();
      }
      if (!bagian.isConnected) return;

      if (!res.ok) {
        kosongkanElemen(area);
        if (res.kode === 401) {
          ctx.sesiHabis();
          return;
        }
        if (res.kode === 0) {
          ctx.aturPesan(pesan, PESAN.gagalTerhubung, true);
        } else if (res.kode === 429) {
          ctx.aturPesan(pesan, PESAN.terlaluSering, true);
        } else {
          ctx.aturPesan(pesan, PESAN.gagalLempar, true);
        }
        perbaruiTampilan();
        return;
      }

      tampilHasil(res.hasil || {});
      perbaruiTampilan();
    });

    // Mulai: pakai sisa waktu yang sudah ada bila kembali dari layar lain.
    if (typeof status._akhir_umpan === "number") {
      akhir = status._akhir_umpan;
    } else {
      aturAkhir(status.detik_ke_umpan_berikutnya);
    }
    perbaruiTampilan();

    // Pewaktu berhenti sendiri bila layar sudah berganti.
    pewaktu = setInterval(function () {
      if (!bagian.isConnected) {
        clearInterval(pewaktu);
        return;
      }
      perbaruiTampilan();
      if (
        akhir !== null &&
        !sibuk &&
        !menyegarkan &&
        akhir - performance.now() <= 0
      ) {
        segarkan();
      }
    }, 1000);

    return bagian;
  }

  window.MANCING_LEMPAR = { pasang: pasang };
})();
