// public/tas.js
// Layar Tas Ikan / album koleksi (TAS.03): 16 kotak (terbuka atau siluet "???"),
// detail jenis, tombol Jual 1 dan Jual semua jenis ini.
// TAS.05: album 2 kolom (lihat style.css). Mengetuk kotak membuka POPUP detail (sebelumnya
// kartu detail di bawah album). Popup tetap terbuka setelah jual supaya bisa jual beruntun.
// Ditutup lewat tombol silang, tombol Tutup, ketuk area gelap, atau tombol Esc.
// Dipasang dari nama.js lewat window.MANCING_TAS.tampil(ctx). ctx berisi:
// wadah, status, buatEl, kosongkan, aturPesan, muatStatus(), jual(ikanId, pilihan),
// saatKoinBerubah(), sesiHabis(), kembali()
// Album dikirim server sejajar dengan status (res.album), bukan di dalam status.
// Aplikasi hanya mengirim id jenis dan pilihan "satu" atau "semua" (lewat ctx.jual).
// Harga, stok, dan koin SEPENUHNYA dihitung server; angka di layar diambil dari balasan server.
// Gambar masih sementara (SVG ikan menyusul, lihat pemandangan-ikan.md).
// Semua teks lewat textContent (tanpa innerHTML). Galat mentah tidak ditampilkan.
// VIS.04: emoji ikan diganti gambar WebP per kelas (img/sisikpasir, birumungil, babydragon, golddragon).
// Emoji tetap dipakai sebagai cadangan bila gambar gagal dimuat. Hanya tampilan.
// KAT.04: tiap ikan memakai gambarnya sendiri dari kode_gambar yang dikirim server (jalur img/ikan/...);
// bila tidak ada atau gagal dimuat, dipakai gambar kelas, lalu emoji.
// TAS.06: "Jual semua jenis ini" meminta konfirmasi dulu di dalam popup (Ya, jual / Batal) yang
// menyebut nama ikan dan jumlahnya. "Jual 1" tetap langsung. Hanya tampilan; server tidak berubah.
// BNS.10: filter (Semua, Dimiliki, per kelas) dan urutan (bawaan, nama, kelas, jumlah) di atas album.
// Memakai data album yang sudah ada di memori: tanpa panggilan server baru, tanpa mengubah data.
// Pilihan filter dan urutan hanya diingat selama layar Tas Ikan terbuka. Hanya tampilan.
(function () {
  "use strict";

  const PESAN = {
    tunggu: "Mohon tunggu...",
    gagalMemuat: "Album belum bisa dimuat. Periksa internet lalu coba lagi",
    gagalTerhubung: "Gagal terhubung, coba lagi",
    terlaluSering: "Terlalu sering mencoba. Tunggu sebentar lalu coba lagi",
    gagalJual: "Gagal menjual. Data tidak berubah, coba lagi",
    menjual: "Menjual...",
    petunjukPilih: "Ketuk ikan di album untuk melihat detail dan menjualnya.",
    habis: "Kamu belum punya ikan jenis ini sekarang.",
    berhasil: "Berhasil dijual",
    kosongFilter: "Tidak ada ikan yang cocok dengan filter ini.",
  };

  // Kelas yang dikenal, dipakai untuk warna kotak.
  const KELAS_DIKENAL = ["common", "rare", "epic", "legendary"];
  const NAMA_KELAS = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };

  // BNS.10: pilihan filter dan urutan. Hanya mengatur tampilan daftar di layar.
  const PILIHAN_FILTER = [
    { kunci: "semua", teks: "Semua" },
    { kunci: "dimiliki", teks: "Dimiliki" },
    { kunci: "common", teks: "Common" },
    { kunci: "rare", teks: "Rare" },
    { kunci: "epic", teks: "Epic" },
    { kunci: "legendary", teks: "Legendary" },
  ];
  const PILIHAN_URUT = [
    { kunci: "bawaan", teks: "Urutan album" },
    { kunci: "nama", teks: "Nama A-Z" },
    { kunci: "kelas-naik", teks: "Kelas: Common dulu" },
    { kunci: "kelas-turun", teks: "Kelas: Legendary dulu" },
    { kunci: "jumlah", teks: "Jumlah terbanyak" },
  ];

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

  function kosongkanElemen(e) {
    while (e.firstChild) e.removeChild(e.firstChild);
  }

  // Rapikan daftar album mentah dari server (res.album). Bila tidak sah (null atau bukan daftar), kembalikan null.
  function ambilAlbum(mentah) {
    if (!Array.isArray(mentah)) return null;
    const daftar = mentah.filter(function (e) {
      return e && typeof e === "object" && typeof e.id === "number";
    });
    daftar.sort(function (a, b) {
      return a.id - b.id;
    });
    return daftar;
  }

  function jumlahDari(e) {
    const n = Math.floor(Number(e.jumlah));
    return isFinite(n) && n > 0 ? n : 0;
  }

  // Kelas -> { css, nama } untuk warna dan tulisan.
  function kelasDari(e) {
    const k = String(e.kelas || "").toLowerCase();
    const dikenal = KELAS_DIKENAL.indexOf(k) !== -1;
    return {
      css: dikenal ? " kelas-" + k : "",
      nama: dikenal ? NAMA_KELAS[k] : String(e.kelas || ""),
      kunci: dikenal ? k : "", // VIS.04: kunci kelas untuk memilih gambar
    };
  }

  function tampil(ctx) {
    const status = ctx.status;
    ctx.kosongkan();

    const kartu = ctx.buatEl("div", "kartu kartu-tas");
    kartu.appendChild(ctx.buatEl("h2", "judul", "Tas Ikan"));

    const teksKoin = ctx.buatEl("p", "petunjuk", "Koin: " + status.koin);
    kartu.appendChild(teksKoin);

    // BNS.10: baris filter dan urutan di atas album.
    let filterAktif = "semua";
    let urutAktif = "bawaan";
    const barFilter = ctx.buatEl("div", "filter-album");
    const kelompokChip = ctx.buatEl("div", "filter-chip-baris");
    kelompokChip.setAttribute("role", "group");
    kelompokChip.setAttribute("aria-label", "Filter album");
    const tombolChip = [];
    PILIHAN_FILTER.forEach(function (p) {
      const chip = ctx.buatEl("button", "chip-filter", p.teks);
      chip.type = "button";
      chip.addEventListener("click", function () {
        filterAktif = p.kunci;
        tandaiChip();
        gambarGrid();
      });
      tombolChip.push({ kunci: p.kunci, el: chip });
      kelompokChip.appendChild(chip);
    });
    barFilter.appendChild(kelompokChip);

    const kelompokUrut = ctx.buatEl("div", "filter-urut");
    const labelUrut = ctx.buatEl("label", "", "Urutkan");
    labelUrut.htmlFor = "urut-album";
    const pilihUrut = document.createElement("select");
    pilihUrut.id = "urut-album";
    pilihUrut.className = "urut-album";
    PILIHAN_URUT.forEach(function (p) {
      const opsi = document.createElement("option");
      opsi.value = p.kunci;
      opsi.textContent = p.teks;
      pilihUrut.appendChild(opsi);
    });
    pilihUrut.addEventListener("change", function () {
      urutAktif = pilihUrut.value;
      gambarGrid();
    });
    kelompokUrut.appendChild(labelUrut);
    kelompokUrut.appendChild(pilihUrut);
    barFilter.appendChild(kelompokUrut);
    kartu.appendChild(barFilter);

    function tandaiChip() {
      tombolChip.forEach(function (t) {
        const aktif = t.kunci === filterAktif;
        t.el.classList.toggle("aktif", aktif);
        t.el.setAttribute("aria-pressed", aktif ? "true" : "false");
      });
    }
    tandaiChip();

    const pesan = ctx.buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    kartu.appendChild(pesan);

    const grid = ctx.buatEl("div", "album");
    kartu.appendChild(grid);

    const detail = ctx.buatEl("div", "detail-ikan");
    detail.setAttribute("aria-live", "polite");
    kartu.appendChild(detail);

    const aksiBawah = ctx.buatEl("div", "aksi");
    const kembali = ctx.buatEl("button", "tombol sekunder", "Kembali");
    kembali.type = "button";
    kembali.addEventListener("click", function () {
      hapusPopup();
      ctx.kembali();
    });
    aksiBawah.appendChild(kembali);
    kartu.appendChild(aksiBawah);

    ctx.wadah.appendChild(kartu);

    let album = null; // daftar jenis dari server; null bila belum atau gagal dimuat
    let terpilih = null; // id jenis yang sedang dibuka popupnya
    let sibuk = false; // menunggu jawaban jual
    let memuat = false; // menunggu jawaban status
    let popup = null; // isi popup yang sedang terbuka; null bila tertutup (TAS.05)

    function perbaruiKoin() {
      teksKoin.textContent = "Koin: " + status.koin;
    }

    function cari(id) {
      if (!album) return null;
      for (let i = 0; i < album.length; i++) {
        if (album[i].id === id) return album[i];
      }
      return null;
    }

    // Pesan ditulis di layar Tas dan, bila popup terbuka, juga di dalam popup.
    function kabar(teks, galat) {
      ctx.aturPesan(pesan, teks, galat);
      if (popup) ctx.aturPesan(popup.pesan, teks, galat);
    }

    // Tombol Esc menutup popup. Bila layar Tas sudah tidak tampil, pendengar ini melepas dirinya.
    function saatTombolTekan(ev) {
      if (!kartu.isConnected) {
        document.removeEventListener("keydown", saatTombolTekan);
        return;
      }
      if (ev.key === "Escape") tutupPopup();
    }

    function hapusPopup() {
      document.removeEventListener("keydown", saatTombolTekan);
      if (popup && popup.latar.parentNode) {
        popup.latar.parentNode.removeChild(popup.latar);
      }
      popup = null;
    }

    function tutupPopup() {
      hapusPopup();
      terpilih = null;
      gambarGrid();
    }

    // Buat popup untuk satu jenis (bagian yang tetap). Angka yang berubah diisi perbaruiPopup().
    function bukaPopup(e) {
      hapusPopup();
      const k = kelasDari(e);

      const latar = ctx.buatEl("div", "popup-latar");
      const dialog = ctx.buatEl("div", "popup-ikan" + k.css);
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "popup-nama-ikan");
      dialog.tabIndex = -1;

      const kepala = ctx.buatEl("div", "popup-kepala");
      const gambarPopup = ctx.buatEl("div", "popup-gambar", "");
      isiGambarIkan(gambarPopup, k.kunci, e.kode_gambar); // VIS.04, KAT.04
      kepala.appendChild(gambarPopup);
      dialog.appendChild(kepala);

      const tutupX = ctx.buatEl("button", "popup-tutup", "✕");
      tutupX.type = "button";
      tutupX.setAttribute("aria-label", "Tutup");
      tutupX.addEventListener("click", tutupPopup);
      dialog.appendChild(tutupX);

      const isi = ctx.buatEl("div", "popup-isi");
      const nama = ctx.buatEl("h3", "popup-nama", String(e.nama || ""));
      nama.id = "popup-nama-ikan";
      isi.appendChild(nama);
      isi.appendChild(ctx.buatEl("p", "popup-kelas", k.nama));

      const stat = ctx.buatEl("div", "popup-stat");
      const chipJumlah = ctx.buatEl("div", "popup-chip");
      chipJumlah.appendChild(ctx.buatEl("p", "popup-chip-label", "Dimiliki"));
      const nilaiJumlah = ctx.buatEl("p", "popup-chip-nilai", "");
      chipJumlah.appendChild(nilaiJumlah);
      const chipKoin = ctx.buatEl("div", "popup-chip");
      chipKoin.appendChild(ctx.buatEl("p", "popup-chip-label", "Koin kamu"));
      const nilaiKoin = ctx.buatEl("p", "popup-chip-nilai", "");
      chipKoin.appendChild(nilaiKoin);
      stat.appendChild(chipJumlah);
      stat.appendChild(chipKoin);
      isi.appendChild(stat);

      const habis = ctx.buatEl("p", "petunjuk", PESAN.habis);
      isi.appendChild(habis);

      const pesanPopup = ctx.buatEl("p", "pesan");
      pesanPopup.setAttribute("role", "alert");
      isi.appendChild(pesanPopup);

      const aksi = ctx.buatEl("div", "aksi aksi-jual");
      const jual1 = ctx.buatEl("button", "tombol", "Jual 1");
      jual1.type = "button";
      const jualSemua = ctx.buatEl(
        "button",
        "tombol sekunder",
        "Jual semua jenis ini",
      );
      jualSemua.type = "button";
      const tutupTeks = ctx.buatEl("button", "tautan", "Tutup");
      tutupTeks.type = "button";
      // Jenis dicari ulang saat diketuk, supaya yang dijual selalu data album terbaru.
      jual1.addEventListener("click", function () {
        const t = cari(e.id);
        if (t) jual(t, "satu");
      });
      jualSemua.addEventListener("click", function () {
        bukaKonfirmasi();
      });
      tutupTeks.addEventListener("click", tutupPopup);
      aksi.appendChild(jual1);
      aksi.appendChild(jualSemua);
      aksi.appendChild(tutupTeks);
      isi.appendChild(aksi);

      // TAS.06: panel konfirmasi "Jual semua", tersembunyi sampai tombol Jual semua diketuk.
      const konfirmasi = ctx.buatEl("div", "konfirmasi-jual");
      konfirmasi.hidden = true;
      const tanya = ctx.buatEl("p", "konfirmasi-tanya", "");
      konfirmasi.appendChild(tanya);
      const aksiKonfirmasi = ctx.buatEl("div", "aksi");
      const ya = ctx.buatEl("button", "tombol", "Ya, jual");
      ya.type = "button";
      const batal = ctx.buatEl("button", "tombol sekunder", "Batal");
      batal.type = "button";
      aksiKonfirmasi.appendChild(ya);
      aksiKonfirmasi.appendChild(batal);
      konfirmasi.appendChild(aksiKonfirmasi);
      isi.appendChild(konfirmasi);
      // Jenis dicari ulang saat diketuk. Yang dijual tetap SEMUA ekor menurut server.
      ya.addEventListener("click", function () {
        tutupKonfirmasi();
        const t = cari(e.id);
        if (t) jual(t, "semua");
      });
      batal.addEventListener("click", tutupKonfirmasi);
      dialog.appendChild(isi);

      // Ketuk area gelap di luar popup menutupnya.
      latar.addEventListener("click", function (ev) {
        if (ev.target === latar) tutupPopup();
      });
      latar.appendChild(dialog);
      kartu.appendChild(latar);

      popup = {
        id: e.id,
        latar: latar,
        pesan: pesanPopup,
        jumlah: nilaiJumlah,
        koin: nilaiKoin,
        habis: habis,
        jual1: jual1,
        jualSemua: jualSemua,
        aksi: aksi,
        konfirmasi: konfirmasi,
        tanya: tanya,
        ya: ya,
        batal: batal,
      };
      document.addEventListener("keydown", saatTombolTekan);
      dialog.focus();
    }

    // Perbarui angka dan tombol di popup yang terbuka (jumlah, koin, tombol jual aktif atau mati).
    function perbaruiPopup() {
      if (!popup) return;
      const e = cari(popup.id);
      if (!album || !e || e.terbuka !== true) {
        hapusPopup();
        terpilih = null;
        gambarGrid();
        return;
      }
      const n = jumlahDari(e);
      popup.jumlah.textContent = String(n);
      popup.koin.textContent = String(status.koin);
      popup.habis.hidden = n >= 1;
      const mati = sibuk || memuat || n < 1;
      popup.jual1.disabled = mati;
      popup.jualSemua.disabled = mati;
      // TAS.06: bila konfirmasi sedang tampil, jumlahnya ikut mengikuti data terbaru.
      if (!popup.konfirmasi.hidden) {
        if (n < 1) {
          tutupKonfirmasi();
        } else {
          popup.tanya.textContent = teksTanya(e, n);
          popup.ya.disabled = mati;
        }
      }
    }

    // TAS.06: kalimat konfirmasi, menyebut nama ikan dan jumlahnya.
    function teksTanya(e, n) {
      return "Jual semua " + String(e.nama || "") + " (" + n + " ekor)?";
    }

    // TAS.06: tampilkan konfirmasi menggantikan tombol jual. Fokus ke Batal supaya aman.
    function bukaKonfirmasi() {
      if (!popup || sibuk || memuat) return;
      const e = cari(popup.id);
      if (!e) return;
      const n = jumlahDari(e);
      if (n < 1) return;
      popup.tanya.textContent = teksTanya(e, n);
      ctx.aturPesan(popup.pesan, "", false);
      popup.aksi.hidden = true;
      popup.konfirmasi.hidden = false;
      popup.ya.disabled = false;
      popup.batal.focus();
    }

    // TAS.06: sembunyikan konfirmasi, tombol jual tampil lagi.
    function tutupKonfirmasi() {
      if (!popup) return;
      popup.konfirmasi.hidden = true;
      popup.aksi.hidden = false;
    }

    function pilih(id) {
      terpilih = id;
      ctx.aturPesan(pesan, "", false);
      gambarGrid();
      const e = cari(id);
      if (e && e.terbuka === true) bukaPopup(e);
      gambarDetail();
    }

    // BNS.10: daftar yang tampil setelah filter dan urutan. Data album tidak diubah (salinan).
    // Ikan terkunci ("???") tidak ikut diurutkan menurut nama atau jumlah; ditaruh di akhir menurut id.
    function daftarTampil() {
      const lolos = album.filter(function (e) {
        if (filterAktif === "semua") return true;
        if (filterAktif === "dimiliki") {
          return e.terbuka === true && jumlahDari(e) >= 1;
        }
        return kelasDari(e).kunci === filterAktif;
      });
      if (urutAktif === "bawaan") return lolos;

      const urutanKelas = { common: 0, rare: 1, epic: 2, legendary: 3 };
      function peringkat(e) {
        const k = kelasDari(e).kunci;
        return k in urutanKelas ? urutanKelas[k] : 4;
      }
      const terbuka = lolos.filter(function (e) {
        return e.terbuka === true;
      });
      const terkunci = lolos.filter(function (e) {
        return e.terbuka !== true;
      });
      terbuka.sort(function (a, b) {
        let beda = 0;
        if (urutAktif === "nama") {
          beda = String(a.nama || "").localeCompare(String(b.nama || ""), "id");
        } else if (urutAktif === "kelas-naik") {
          beda = peringkat(a) - peringkat(b);
        } else if (urutAktif === "kelas-turun") {
          beda = peringkat(b) - peringkat(a);
        } else if (urutAktif === "jumlah") {
          beda = jumlahDari(b) - jumlahDari(a);
        }
        return beda !== 0 ? beda : a.id - b.id;
      });
      return terbuka.concat(terkunci);
    }

    // 16 kotak: terbuka (gambar, nama, kelas, jumlah) atau siluet terkunci "???".
    function gambarGrid() {
      kosongkanElemen(grid);
      if (!album) return;
      const tampilkan = daftarTampil();
      if (tampilkan.length === 0) {
        grid.appendChild(ctx.buatEl("p", "petunjuk", PESAN.kosongFilter));
        return;
      }
      tampilkan.forEach(function (e) {
        const k = kelasDari(e);
        if (e.terbuka === true) {
          const n = jumlahDari(e);
          const kotak = ctx.buatEl(
            "button",
            "kotak-ikan" +
              k.css +
              (n < 1 ? " kosong" : "") +
              (e.id === terpilih ? " dipilih" : ""),
          );
          kotak.type = "button";
          const gambarKotak = ctx.buatEl("div", "gambar-kotak", "");
          isiGambarIkan(gambarKotak, k.kunci, e.kode_gambar, true); // VIS.04, KAT.04 (dimuat belakangan)
          kotak.appendChild(gambarKotak);
          kotak.appendChild(
            ctx.buatEl("p", "nama-kotak", String(e.nama || "")),
          );
          kotak.appendChild(ctx.buatEl("p", "kelas-kotak", k.nama));
          kotak.appendChild(ctx.buatEl("p", "jumlah-kotak", "x" + n));
          kotak.addEventListener("click", function () {
            pilih(e.id);
          });
          grid.appendChild(kotak);
        } else {
          const kotak = ctx.buatEl("div", "kotak-ikan terkunci" + k.css);
          kotak.appendChild(ctx.buatEl("div", "gambar-kotak", "?"));
          kotak.appendChild(ctx.buatEl("p", "nama-kotak", "???"));
          grid.appendChild(kotak);
        }
      });
    }

    // TAS.05: di bawah album hanya tersisa teks petunjuk; detail dan tombol jual ada di popup.
    function gambarDetail() {
      kosongkanElemen(detail);
      if (!album) {
        hapusPopup();
        return;
      }
      detail.appendChild(ctx.buatEl("p", "petunjuk", PESAN.petunjukPilih));
      perbaruiPopup();
    }

    function tampilGagalAlbum(teks) {
      kosongkanElemen(grid);
      kosongkanElemen(detail);
      hapusPopup();
      album = null;
      grid.appendChild(ctx.buatEl("p", "petunjuk", teks));
      const ulang = ctx.buatEl("button", "tombol", "Coba lagi");
      ulang.type = "button";
      ulang.addEventListener("click", function () {
        muat();
      });
      grid.appendChild(ulang);
    }

    // Ambil album terbaru dari server (aksi status).
    async function muat() {
      if (memuat) return;
      memuat = true;
      kosongkanElemen(grid);
      grid.appendChild(ctx.buatEl("p", "petunjuk", PESAN.tunggu));
      gambarDetail();

      const res = await ctx.muatStatus();
      memuat = false;
      if (!kartu.isConnected) return;

      if (res.ok && res.status) {
        if (typeof res.status.koin === "number") {
          status.koin = res.status.koin;
          ctx.saatKoinBerubah();
          perbaruiKoin();
        }
        // Album ada di res.album (sejajar dengan res.status).
        const a = ambilAlbum(res.album);
        if (a) {
          album = a;
          status.album = res.album;
          gambarGrid();
          gambarDetail();
          return;
        }
        // Album bernilai null dari server: pesan umum, isi status lama tetap jalan.
        tampilGagalAlbum(PESAN.gagalMemuat);
        return;
      }
      if (res.kode === 401) {
        ctx.sesiHabis();
        return;
      }
      tampilGagalAlbum(
        res.kode === 429 ? PESAN.terlaluSering : PESAN.gagalMemuat,
      );
    }

    // Jual: aplikasi hanya mengirim id jenis dan pilihan; hasilnya dibaca dari balasan server.
    async function jual(e, pilihan) {
      if (sibuk) return;
      sibuk = true;
      kabar(PESAN.menjual, false);
      gambarDetail();

      const res = await ctx.jual(e.id, pilihan);
      sibuk = false;

      const h =
        res.ok && res.hasil && typeof res.hasil === "object" ? res.hasil : null;
      const sah =
        h !== null &&
        typeof h.jumlah_sisa === "number" &&
        typeof h.koin === "number";

      // Perbarui status bersama DULU, walau layar sudah berpindah, supaya angka tidak basi.
      if (sah) {
        e.jumlah = h.jumlah_sisa;
        status.koin = h.koin;
        ctx.saatKoinBerubah();
      }
      if (!kartu.isConnected) return;

      if (sah) {
        perbaruiKoin();
        gambarGrid();
        gambarDetail();
        const teks =
          typeof h.terjual === "number" && typeof h.koin_didapat === "number"
            ? "Terjual " + h.terjual + " ekor. Koin +" + h.koin_didapat
            : PESAN.berhasil;
        kabar(teks, false);
        return;
      }

      if (!res.ok && res.kode === 401) {
        ctx.sesiHabis();
        return;
      }
      if (!res.ok && res.kode === 0) {
        kabar(PESAN.gagalTerhubung, true);
        gambarDetail();
        return;
      }
      if (!res.ok && res.kode === 429) {
        kabar(PESAN.terlaluSering, true);
        gambarDetail();
        return;
      }
      // Gagal lain (misal stok sudah berubah): pesan umum, lalu muat ulang album supaya angka cocok.
      kabar(PESAN.gagalJual, true);
      muat();
    }

    gambarDetail();
    muat();
    return kartu;
  }

  window.MANCING_TAS = { tampil: tampil };
})();
