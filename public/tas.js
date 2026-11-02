// public/tas.js
// Layar Tas Ikan / album koleksi (TAS.03): 16 kotak (terbuka atau siluet "???"),
// detail jenis, tombol Jual 1 dan Jual semua jenis ini.
// Dipasang dari nama.js lewat window.MANCING_TAS.tampil(ctx). ctx berisi:
// wadah, status, buatEl, kosongkan, aturPesan, muatStatus(), jual(ikanId, pilihan),
// saatKoinBerubah(), sesiHabis(), kembali()
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

  // Ambil daftar album dari balasan status. Bila tidak sah (null atau bukan daftar), kembalikan null.
  function ambilAlbum(status) {
    if (!status || !Array.isArray(status.album)) return null;
    const daftar = status.album.filter(function (e) {
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
      ctx.kembali();
    });
    aksiBawah.appendChild(kembali);
    kartu.appendChild(aksiBawah);

    ctx.wadah.appendChild(kartu);

    let album = null; // daftar jenis dari server; null bila belum atau gagal dimuat
    let terpilih = null; // id jenis yang sedang dibuka detailnya
    let sibuk = false; // menunggu jawaban jual
    let memuat = false; // menunggu jawaban status

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

    function pilih(id) {
      terpilih = id;
      ctx.aturPesan(pesan, "", false);
      gambarGrid();
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

    // Detail jenis yang dipilih, dengan tombol Jual 1 dan Jual semua jenis ini.
    function gambarDetail() {
      kosongkanElemen(detail);
      if (!album) return;
      const e = terpilih === null ? null : cari(terpilih);
      if (!e || e.terbuka !== true) {
        terpilih = null;
        detail.appendChild(ctx.buatEl("p", "petunjuk", PESAN.petunjukPilih));
        return;
      }

      const k = kelasDari(e);
      const n = jumlahDari(e);
      const panel = ctx.buatEl("div", "panel-ikan" + k.css);
      panel.appendChild(ctx.buatEl("p", "nama-ikan", String(e.nama || "")));
      panel.appendChild(ctx.buatEl("p", "kelas-ikan", k.nama));
      panel.appendChild(ctx.buatEl("p", "jumlah-ikan", "Dimiliki: " + n));
      if (n < 1) {
        panel.appendChild(ctx.buatEl("p", "petunjuk", PESAN.habis));
      }

      const aksi = ctx.buatEl("div", "aksi aksi-jual");
      const jual1 = ctx.buatEl("button", "tombol", "Jual 1");
      jual1.type = "button";
      const jualSemua = ctx.buatEl(
        "button",
        "tombol sekunder",
        "Jual semua jenis ini",
      );
      jualSemua.type = "button";
      const mati = sibuk || memuat || n < 1;
      jual1.disabled = mati;
      jualSemua.disabled = mati;
      jual1.addEventListener("click", function () {
        jual(e, "satu");
      });
      jualSemua.addEventListener("click", function () {
        jual(e, "semua");
      });
      aksi.appendChild(jual1);
      aksi.appendChild(jualSemua);
      panel.appendChild(aksi);
      detail.appendChild(panel);
    }

    function tampilGagalAlbum(teks) {
      kosongkanElemen(grid);
      kosongkanElemen(detail);
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
        const a = ambilAlbum(res.status);
        if (a) {
          album = a;
          status.album = res.status.album;
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
      ctx.aturPesan(pesan, PESAN.menjual, false);
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
        ctx.aturPesan(pesan, teks, false);
        return;
      }

      if (!res.ok && res.kode === 401) {
        ctx.sesiHabis();
        return;
      }
      if (!res.ok && res.kode === 0) {
        ctx.aturPesan(pesan, PESAN.gagalTerhubung, true);
        gambarDetail();
        return;
      }
      if (!res.ok && res.kode === 429) {
        ctx.aturPesan(pesan, PESAN.terlaluSering, true);
        gambarDetail();
        return;
      }
      // Gagal lain (misal stok sudah berubah): pesan umum, lalu muat ulang album supaya angka cocok.
      ctx.aturPesan(pesan, PESAN.gagalJual, true);
      muat();
    }

    gambarDetail();
    muat();
    return kartu;
  }

  window.MANCING_TAS = { tampil: tampil };
})();
