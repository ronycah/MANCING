// public/mancing.js
// Layar permainan sederhana (MCG.03): tombol Lempar Kail, hitung mundur umpan, dan hasil lemparan.
// Dipasang di layar utama oleh nama.js lewat window.MANCING_LEMPAR.pasang(...).
// Hasil lemparan SEPENUHNYA ditentukan server (aksi "lempar"); aplikasi tidak mengirim angka apa pun.
// Hitung mundur memakai sisa detik dari server dan jam internal browser (performance.now),
// bukan jam HP, jadi mengubah jam HP tidak berpengaruh (MC9).
// Semua teks lewat textContent (tanpa innerHTML). Galat mentah tidak ditampilkan.
// VIS.01: pemandangan danau dipasang di atas area hasil lewat window.LokasiDanau (lokasi-danau.js), hanya tampilan.
// VIS.02: suasana danau (pagi, siang, sore, malam) mengikuti jam WIB dari "jam_server" yang dikirim server
// (status dan hasil lempar). Waktu berjalan dihitung dari titik acuan jam_server + performance.now(),
// bukan jam HP. Hanya mengubah kelas CSS di wadah danau; tidak mempengaruhi hasil mancing.
// VIS.03: animasi pelampung dan gigitan. Saat tombol ditekan, wadah danau diberi kelas "lempar"
// (pelampung jatuh dan mengapung), lalu "gigit" (pelampung tersentak) sebelum hasil tampil.
// Murni tampilan: hasil sudah ditentukan server (aksi "lempar"), animasi tidak mempengaruhinya.
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
  // VIS.03: diperpanjang dari 700 supaya pelampung sempat jatuh, mengapung, lalu tersentak.
  const JEDA_ANIMASI = 2200;
  // VIS.03: waktu (milidetik sejak lempar) pelampung mulai tersentak (gigitan).
  const JEDA_GIGITAN = 1500;
  // Bila gagal menyegarkan umpan, coba lagi setelah sekian milidetik (maksimal 3 kali).
  const JEDA_ULANG = 10000;
  const MAKS_ULANG = 3;

  // VIS.02: WIB = UTC+7 (tanpa pergeseran musim). Dihitung manual, tidak memakai zona waktu HP.
  const GESER_WIB_MS = 7 * 3600 * 1000;
  // Kelas CSS suasana di wadah danau. Siang = bawaan (tanpa kelas tambahan).
  const KELAS_SUASANA = ["pagi", "sore", "malam"];

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

  // VIS.02: teks waktu dari server (misal "2026-11-02T14:19:00.123456+00:00") -> milidetik.
  // Pecahan detik dipotong jadi 3 digit supaya terbaca di semua browser. Mengembalikan null bila tidak valid.
  function bacaJamServer(teks) {
    if (typeof teks !== "string") return null;
    const ms = Date.parse(teks.replace(/(\.\d{3})\d+/, "$1"));
    return isFinite(ms) ? ms : null;
  }

  // VIS.02: jam WIB (0 sampai 23) -> nama suasana (VS2).
  function suasanaDariJam(jam) {
    if (jam >= 5 && jam < 10) return "pagi";
    if (jam >= 10 && jam < 15) return "siang";
    if (jam >= 15 && jam < 18) return "sore";
    return "malam";
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

    let wadahAktif = null; // VIS.02: wadah danau yang sudah terpasang (null sebelum gambar selesai dimuat)
    let suasanaSekarang = null; // VIS.02: suasana yang sedang terpasang di wadahAktif

    // VIS.02: simpan titik acuan waktu server. Disimpan di status (seperti _akhir_umpan)
    // supaya kembali dari layar lain tidak kehilangan acuan.
    function aturAcuanWaktu(jamServer) {
      const ms = bacaJamServer(jamServer);
      if (ms === null) return;
      status._acuan_waktu = { ms: ms, pn: performance.now() };
    }

    // VIS.02: jam WIB sekarang (0 sampai 23) dari jam server + jam internal browser. null bila belum ada acuan.
    function jamWibSekarang() {
      const a = status._acuan_waktu;
      if (!a || typeof a.ms !== "number" || typeof a.pn !== "number") {
        return null;
      }
      const msServer = a.ms + (performance.now() - a.pn);
      return new Date(msServer + GESER_WIB_MS).getUTCHours();
    }

    // VIS.02: pasang kelas suasana di wadah danau bila suasana berganti. Hanya tampilan.
    function terapkanSuasana() {
      if (!wadahAktif) return;
      const jam = jamWibSekarang();
      if (jam === null) return;
      const baru = suasanaDariJam(jam);
      if (baru === suasanaSekarang) return;
      KELAS_SUASANA.forEach(function (k) {
        wadahAktif.classList.remove(k);
      });
      if (baru !== "siang") wadahAktif.classList.add(baru);
      suasanaSekarang = baru;
    }

    // VIS.03: atur tahap animasi pelampung lewat kelas di wadah danau. Hanya tampilan.
    // "lempar" = pelampung muncul dan mengapung; "gigit" = ditambahkan di atas "lempar" (pelampung tersentak);
    // null = semua kelas dilepas (pelampung hilang). Tidak berbuat apa-apa bila danau belum terpasang.
    function aturAnimasi(tahap) {
      if (!wadahAktif) return;
      if (tahap === "lempar") {
        wadahAktif.classList.remove("gigit");
        wadahAktif.classList.add("lempar");
      } else if (tahap === "gigit") {
        wadahAktif.classList.add("gigit");
      } else {
        wadahAktif.classList.remove("lempar");
        wadahAktif.classList.remove("gigit");
      }
    }

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
          // VIS.02: wadah baru belum punya kelas suasana, pasang sesuai jam server.
          wadahAktif = wadahDanau;
          suasanaSekarang = null;
          terapkanSuasana();
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
        // VIS.02: jam server terbaru ikut menyegarkan titik acuan waktu.
        aturAcuanWaktu(res.status.jam_server);
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

      // VIS.03: pelampung jatuh ke air sekarang, lalu tersentak (gigitan) sebelum hasil tampil.
      aturAnimasi("lempar");
      const pewaktuGigit = setTimeout(function () {
        if (sibuk) aturAnimasi("gigit");
      }, JEDA_GIGITAN);

      const jawaban = await Promise.all([
        ctx.kirim("lempar"),
        jeda(JEDA_ANIMASI),
      ]);
      const res = jawaban[0];
      sibuk = false;
      // VIS.03: hasil sudah ada, pelampung dihilangkan (juga bila lemparan gagal).
      clearTimeout(pewaktuGigit);
      aturAnimasi(null);

      // Perbarui status bersama DULU, walau layar sudah berpindah, supaya angka tidak basi.
      if (res.ok && res.hasil && typeof res.hasil === "object") {
        const h = res.hasil;
        if (typeof h.umpan === "number") status.umpan = h.umpan;
        if (typeof h.umpan_maks === "number") status.umpan_maks = h.umpan_maks;
        // VIS.02: jam server dari hasil lempar ikut menyegarkan titik acuan waktu.
        aturAcuanWaktu(h.jam_server);
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
    // VIS.02: titik acuan waktu dari jam_server di status, hanya bila belum ada
    // (kembali dari layar lain memakai acuan yang sudah tersimpan).
    if (!status._acuan_waktu) {
      aturAcuanWaktu(status.jam_server);
    }
    perbaruiTampilan();

    // Pewaktu berhenti sendiri bila layar sudah berganti.
    pewaktu = setInterval(function () {
      if (!bagian.isConnected) {
        clearInterval(pewaktu);
        return;
      }
      perbaruiTampilan();
      // VIS.02: cek suasana tiap detik dari waktu yang dihitung lokal (tanpa panggilan server).
      terapkanSuasana();
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
