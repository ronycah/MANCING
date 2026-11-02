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
  };

  // Kelas yang dikenal, dipakai untuk warna kotak.
  const KELAS_DIKENAL = ["common", "rare", "epic", "legendary"];
  const NAMA_KELAS = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };

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
    };
  }

  function tampil(ctx) {
    const status = ctx.status;
    ctx.kosongkan();

    const kartu = ctx.buatEl("div", "kartu kartu-tas");
    kartu.appendChild(ctx.buatEl("h2", "judul", "Tas Ikan"));

    const teksKoin = ctx.buatEl("p", "petunjuk", "Koin: " + status.koin);
    kartu.appendChild(teksKoin);

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
      kepala.appendChild(ctx.buatEl("div", "popup-gambar", "🐟"));
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
        const t = cari(e.id);
        if (t) jual(t, "semua");
      });
      tutupTeks.addEventListener("click", tutupPopup);
      aksi.appendChild(jual1);
      aksi.appendChild(jualSemua);
      aksi.appendChild(tutupTeks);
      isi.appendChild(aksi);
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
    }

    function pilih(id) {
      terpilih = id;
      ctx.aturPesan(pesan, "", false);
      gambarGrid();
      const e = cari(id);
      if (e && e.terbuka === true) bukaPopup(e);
      gambarDetail();
    }

    // 16 kotak: terbuka (gambar, nama, kelas, jumlah) atau siluet terkunci "???".
    function gambarGrid() {
      kosongkanElemen(grid);
      if (!album) return;
      album.forEach(function (e) {
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
          kotak.appendChild(ctx.buatEl("div", "gambar-kotak", "🐟"));
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
