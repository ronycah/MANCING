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
// VIS.04: emoji ikan di kartu hasil diganti gambar WebP per kelas. Emoji tetap jadi cadangan
// bila gambar gagal dimuat. Hanya tampilan.
// KAT.04: tiap ikan memakai gambarnya sendiri dari kode_gambar yang dikirim server (jalur img/ikan/...);
// bila tidak ada atau gagal dimuat, dipakai gambar kelas, lalu emoji.
// VIS.09: layar pilih lokasi (Danau, Sungai, Laut) sebelum mulai mancing, plus tombol Ganti lokasi.
// Pilihan lokasi hanya diingat selama halaman terbuka (variabel di bawah), tidak disimpan di server.
// Murni tampilan: lokasi tidak mempengaruhi ikan, umpan, maupun hasil lemparan.
// LAY.01: saat layar pilih lokasi tampil atau tertutup, nama.js diberi tahu lewat ctx.saatLayarPilih(tampil)
// supaya bagian layar utama (Halo, umpan, koin, tombol) disembunyikan selama pemain memilih lokasi.
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
    pilihLokasi: "Mau mancing di mana?",
  };

  // VIS.09: daftar lokasi. "modul" = nama objek global dari lokasi-*.js, "kelas" = kelas CSS wadah pemandangan.
  const LOKASI = [
    {
      kunci: "danau",
      nama: "Danau",
      ikon: "🏞️",
      modul: "LokasiDanau",
      kelas: "danau",
    },
    {
      kunci: "sungai",
      nama: "Sungai",
      ikon: "🌿",
      modul: "LokasiSungai",
      kelas: "sungai",
    },
    {
      kunci: "laut",
      nama: "Laut",
      ikon: "🌊",
      modul: "LokasiLaut",
      kelas: "laut",
    },
  ];

  // VIS.09: lokasi yang dipilih pemain. Di luar pasang() supaya tidak hilang saat pemain
  // pindah ke layar lain (misal Tas Ikan) lalu kembali. Hilang bila halaman ditutup (sengaja).
  let lokasiTerpilih = null;

  function cariLokasi(kunci) {
    for (let i = 0; i < LOKASI.length; i++) {
      if (LOKASI[i].kunci === kunci) return LOKASI[i];
    }
    return null;
  }

  // Kelas yang dikenal, dipakai untuk warna kotak gambar sementara.
  const KELAS_DIKENAL = ["common", "rare", "epic", "legendary"];
  const NAMA_KELAS = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };

  // VIS.04 dan KAT.04: gambar ikan. Tiap ikan punya gambar sendiri (kolom kode_gambar di tabel ikan,
  // berisi jalur seperti "img/ikan/sisik-pasir.webp"). Urutan tampil: (1) gambar ikan itu sendiri,
  // (2) gambar per kelas (4 berkas cadangan), (3) emoji. Hanya tampilan; kelas tetap dari server.
  const GAMBAR_KELAS = {
    common: "img/sisikpasir.webp",
    rare: "img/birumungil.webp",
    epic: "img/babydragon.webp",
    legendary: "img/golddragon.webp",
  };

  // Jalur dari server diterima hanya bila bentuknya wajar (img/ikan/nama-huruf-kecil.webp).
  // Selain itu (misal kunci pendek lama seperti "sisik-pasir") diabaikan dan gambar kelas dipakai.
  function jalurGambar(kode) {
    if (typeof kode !== "string") return null;
    return /^img\/ikan\/[a-z0-9-]+\.webp$/.test(kode) ? kode : null;
  }

  // Isi wadah dengan gambar ikan. kunci = kelas huruf kecil (misal "rare"), kode = kode_gambar dari server,
  // tunda = true untuk memuat gambar belakangan (dipakai di album yang panjang).
  function isiGambarIkan(wadah, kunci, kode, tunda) {
    const daftar = [];
    const jalur = jalurGambar(kode);
    if (jalur) daftar.push(jalur);
    if (GAMBAR_KELAS[kunci]) daftar.push(GAMBAR_KELAS[kunci]);
    if (daftar.length === 0) {
      wadah.textContent = "🐟";
      return;
    }
    wadah.classList.add("ada-gambar");
    const gambar = document.createElement("img");
    gambar.alt = "";
    gambar.decoding = "async";
    if (tunda) gambar.loading = "lazy";
    let urutan = 0;
    // Gagal dimuat: coba gambar berikutnya; bila habis, kembali ke emoji.
    gambar.addEventListener("error", function () {
      urutan += 1;
      if (urutan < daftar.length) {
        gambar.src = daftar[urutan];
      } else {
        wadah.classList.remove("ada-gambar");
        wadah.textContent = "🐟";
      }
    });
    gambar.src = daftar[0];
    wadah.appendChild(gambar);
  }

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

    // VIS.09: tombol Ganti lokasi, di bawah tombol Lempar Kail.
    const tombolGanti = ctx.buatEl(
      "button",
      "tombol sekunder tombol-ganti-lokasi",
      "Ganti lokasi",
    );
    tombolGanti.type = "button";

    // VIS.09: layar pilih lokasi (tiga tombol besar).
    const layarPilih = ctx.buatEl("div", "pilih-lokasi");
    layarPilih.appendChild(ctx.buatEl("p", "judul-lokasi", PESAN.pilihLokasi));
    const daftarLokasi = ctx.buatEl("div", "daftar-lokasi");
    LOKASI.forEach(function (l) {
      const b = ctx.buatEl("button", "tombol tombol-lokasi");
      b.type = "button";
      b.appendChild(ctx.buatEl("span", "ikon-lokasi", l.ikon));
      b.appendChild(ctx.buatEl("span", "nama-lokasi", l.nama));
      b.addEventListener("click", function () {
        pilihLokasi(l.kunci);
      });
      daftarLokasi.appendChild(b);
    });
    layarPilih.appendChild(daftarLokasi);

    // VIS.01 dan VIS.09: pemandangan di bagian atas layar mancing, sesuai lokasi terpilih.
    // Dilewati bila berkas lokasi-*.js tidak termuat. Tempat sementara (kelas lokasi) menjaga
    // tinggi layar sampai gambar selesai dimuat.
    let pemandanganEl = null; // VIS.09: elemen pemandangan yang sedang terpasang (tempat sementara atau wadah)

    function lepasPemandangan() {
      if (pemandanganEl && pemandanganEl.parentNode === bagian) {
        bagian.removeChild(pemandanganEl);
      }
      pemandanganEl = null;
      wadahAktif = null;
      suasanaSekarang = null;
    }

    function pasangPemandangan(def) {
      lepasPemandangan();
      const modul = window[def.modul];
      if (!modul || typeof modul.buat !== "function") return;
      const tempat = ctx.buatEl("div", def.kelas);
      bagian.insertBefore(tempat, area);
      pemandanganEl = tempat;
      modul.buat().then(function (wadah) {
        // Bila layar atau lokasi sudah berganti sebelum gambar selesai, tidak perlu dipasang.
        if (pemandanganEl === tempat && tempat.parentNode === bagian) {
          bagian.replaceChild(wadah, tempat);
          // VIS.02: wadah baru belum punya kelas suasana, pasang sesuai jam server.
          pemandanganEl = wadah;
          wadahAktif = wadah;
          suasanaSekarang = null;
          terapkanSuasana();
        }
      });
    }

    // VIS.09: bagian layar mancing yang disembunyikan saat layar pilih lokasi tampil.
    const bagianMancing = [area, hitung, pesan, tombol, tombolGanti];

    function aturLayar(tampilPilihan) {
      layarPilih.hidden = !tampilPilihan;
      bagianMancing.forEach(function (e) {
        e.hidden = tampilPilihan;
      });
      // LAY.01: beri tahu layar utama (nama.js) agar bagiannya ikut disembunyikan atau ditampilkan.
      if (typeof ctx.saatLayarPilih === "function") {
        ctx.saatLayarPilih(tampilPilihan);
      }
    }

    function tampilPilih() {
      lokasiTerpilih = null;
      lepasPemandangan();
      kosongkanElemen(area);
      ctx.aturPesan(pesan, "", false);
      aturLayar(true);
    }

    function pilihLokasi(kunci) {
      const def = cariLokasi(kunci);
      if (!def) {
        tampilPilih();
        return;
      }
      lokasiTerpilih = kunci;
      aturLayar(false);
      pasangPemandangan(def);
      perbaruiTampilan();
    }

    tombolGanti.addEventListener("click", function () {
      if (sibuk) return; // jangan ganti saat lemparan berjalan
      tampilPilih();
    });

    bagian.appendChild(layarPilih);
    bagian.appendChild(area);
    bagian.appendChild(hitung);
    bagian.appendChild(pesan);
    bagian.appendChild(tombol);
    bagian.appendChild(tombolGanti);
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
      tombolGanti.disabled = sibuk; // VIS.09
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
      // VIS.04: gambar WebP sesuai kelas (emoji sebagai cadangan).
      const gambarHasil = ctx.buatEl("div", "gambar-ikan", "");
      isiGambarIkan(gambarHasil, dikenal ? k : "", ikan.kode_gambar); // KAT.04
      kartuIkan.appendChild(gambarHasil);
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

    // VIS.09: bila pemain sudah memilih lokasi sebelumnya (kembali dari layar lain), langsung mancing;
    // bila belum, tampilkan layar pilih lokasi.
    if (cariLokasi(lokasiTerpilih)) {
      pilihLokasi(lokasiTerpilih);
    } else {
      tampilPilih();
    }

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

  // LAY.01: dipanggil nama.js tiap kali pemain baru masuk, supaya lokasi pemain sebelumnya
  // (di tab yang sama) tidak terbawa dan pemain selalu memilih lokasi dulu (KL2).
  function lupakanLokasi() {
    lokasiTerpilih = null;
  }

  window.MANCING_LEMPAR = { pasang: pasang, lupakanLokasi: lupakanLokasi };
})();
