// public/nama.js
// Layar Pilih nama, Ganti nama, dan layar utama sederhana (AKN.05).
// Dipanggil dari akun.js setelah pemain berhasil masuk.
// AKN.06c: tombol Ganti password di layar utama (layarnya ada di password.js).
// MCG.03: layar utama memasang tombol Lempar Kail dari mancing.js bila termuat.
// TAS.03: layar utama punya tombol Tas Ikan (layarnya ada di tas.js) dan koin ikut diperbarui setelah jual.
// LAY.01: selama layar pilih lokasi tampil (dari mancing.js), judul Halo, umpan, koin, dan tombol selain Keluar disembunyikan.
// LAY.02: selama pemain di layar permainan (layar utama, pilih lokasi, Tas, Ganti nama, Ganti password),
// orientasi dikunci landscape bila perangkat mendukung, dan layar "Putar HP" menutup game saat HP tegak.
// Dilepas saat pemain kembali ke layar Masuk (Keluar, sesi habis, atau keluar dari tab lain).
// LAY.05: ikon pengaturan (gerigi) di kanan atas membuka panel berisi Ganti nama, Ganti password, dan Ganti lokasi.
// Tombol-tombol lama dipakai ulang (dipindah tempat, fungsinya tidak ditulis ulang). Ganti lokasi memakai
// tombol milik mancing.js (disembunyikan lewat CSS), jadi mancing.js tidak diubah.
// LAY.06: tombol Keluar di layar utama menjadi ikon saja (pintu). Di layar lain tetap bertulisan.
// LAY.07: tombol Tas Ikan jadi ikon tas (sejajar tombol Lempar Kail, kanan bawah, di sebelah kirinya). Dibuat di sini,
// ditaruh langsung di kartu (bukan di .aksi); letak dan gayanya diatur CSS blok LAY.07. Fungsi klik tidak berubah.
// Aplikasi hanya mengirim nama aksi (dan nama untuk ganti_nama; id jenis dan pilihan untuk jual); identitas dibaca server dari token.
// Semua teks lewat textContent (tanpa innerHTML). Galat mentah tidak ditampilkan.
(function () {
  "use strict";

  // Nama tampilan: 3 sampai 20 karakter, huruf, angka, spasi, garis bawah (AK4).
  // Server tetap memeriksa ulang; cek di sini hanya supaya pesannya cepat.
  const ATURAN_NAMA = /^[A-Za-z0-9_ ]{3,20}$/;

  const PESAN = {
    aturanNama:
      "Nama 3 sampai 20 karakter: huruf, angka, spasi, atau garis bawah",
    gagalMemuat: "Gagal memuat. Periksa internet lalu coba lagi",
    gagalSimpan: "Gagal menyimpan nama. Coba lagi",
    terlaluSering: "Terlalu sering mencoba. Tunggu sebentar lalu coba lagi",
    keluarGagal: "Gagal keluar. Coba lagi",
    tunggu: "Mohon tunggu...",
    passwordBerhasil: "Password berhasil diganti",
  };

  // ===== LAY.02: paksa landscape =====
  // Dua lapis (KL10): (a) kunci orientasi bila didukung, (b) layar "Putar HP" lewat CSS saat tegak.
  // Kunci orientasi di browser biasa sering ditolak (butuh layar penuh atau PWA terpasang);
  // itu wajar, layar "Putar HP" yang jadi cadangannya. Galat kunci diabaikan.
  let layarPutarHp = null;
  let pendengarKeluarTerpasang = false;

  function buatLayarPutarHp() {
    if (layarPutarHp) return layarPutarHp;
    const el = document.createElement("div");
    el.className = "putar-hp";
    el.setAttribute("role", "alert");
    const ikon = document.createElement("div");
    ikon.className = "putar-hp-ikon";
    ikon.setAttribute("aria-hidden", "true");
    const judul = document.createElement("p");
    judul.className = "putar-hp-judul";
    judul.textContent = "Putar HP ke posisi landscape";
    const teks = document.createElement("p");
    teks.className = "putar-hp-teks";
    teks.textContent = "Game ini dimainkan dengan layar mendatar.";
    el.appendChild(ikon);
    el.appendChild(judul);
    el.appendChild(teks);
    layarPutarHp = el;
    return el;
  }

  function aktifkanLandscape(ctx) {
    const layar = buatLayarPutarHp();
    if (!layar.parentNode) document.body.appendChild(layar);
    document.body.classList.add("wajib-landscape");

    // Jaga-jaga: sesi berakhir dari tab lain tidak lewat tombol Keluar di sini.
    if (!pendengarKeluarTerpasang && ctx && ctx.klien) {
      pendengarKeluarTerpasang = true;
      try {
        ctx.klien.auth.onAuthStateChange(function (kejadian) {
          if (kejadian === "SIGNED_OUT") matikanLandscape();
        });
      } catch (e) {
        pendengarKeluarTerpasang = false;
      }
    }

    try {
      if (window.screen && screen.orientation && screen.orientation.lock) {
        const janji = screen.orientation.lock("landscape");
        if (janji && typeof janji.catch === "function") {
          janji.catch(function () {
            // Ditolak browser: layar "Putar HP" tetap bekerja.
          });
        }
      }
    } catch (e) {
      // Tidak didukung: layar "Putar HP" tetap bekerja.
    }
  }

  function matikanLandscape() {
    document.body.classList.remove("wajib-landscape");
    try {
      if (window.screen && screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (e) {
      // Diabaikan: tidak ada kunci yang perlu dilepas.
    }
  }

  function alamatFungsi() {
    const c = window.MANCING_CONFIG;
    return c && c.SUPABASE_URL ? c.SUPABASE_URL + "/functions/v1/mancing" : "";
  }

  // Panggil Edge Function "mancing". Mengembalikan { ok, status, album } (aksi status dan ganti_nama;
  // album sejajar dengan status di balasan server, bisa null atau tidak ada),
  // { ok, hasil } (aksi lempar dan jual), atau { ok:false, kode }.
  async function panggil(ctx, aksi, tambahan) {
    try {
      const alamat = alamatFungsi();
      if (!alamat) return { ok: false, kode: 0 };
      const sesi = await ctx.klien.auth.getSession();
      const token =
        sesi && sesi.data && sesi.data.session
          ? sesi.data.session.access_token
          : null;
      if (!token) return { ok: false, kode: 401 };

      const badan = Object.assign({ aksi: aksi }, tambahan || {});
      const res = await fetch(alamat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          apikey: window.MANCING_CONFIG.SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(badan),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }
      if (res.ok && data && data.ok && data.status) {
        // TAS.03: album dikirim server sejajar dengan status, jadi ikut diteruskan.
        return { ok: true, status: data.status, album: data.album };
      }
      // MCG.03 dan TAS.03: jawaban aksi "lempar" dan "jual" berkunci "hasil".
      if (res.ok && data && data.ok && data.hasil) {
        return { ok: true, hasil: data.hasil };
      }
      return { ok: false, kode: res.status };
    } catch (e) {
      return { ok: false, kode: 0 };
    }
  }

  // Sesi tidak sah: keluar dan kembali ke layar Masuk.
  async function sesiHabis(ctx) {
    matikanLandscape(); // LAY.02
    try {
      await ctx.klien.auth.signOut();
    } catch (e) {
      // Diabaikan: tetap kembali ke layar Masuk.
    }
    ctx.keMasuk();
  }

  // ===== Tombol Keluar (dipakai di beberapa layar) =====
  // LAY.06: sebagaiIkon = true membuat tombolnya ikon saja (tanpa teks), dengan label untuk pembaca layar.
  function buatTombolKeluar(ctx, pesan, sebagaiIkon) {
    const keluar = ctx.buatEl("button", "tombol sekunder", "Keluar");
    keluar.type = "button";
    if (sebagaiIkon) {
      keluar.classList.add("tombol-ikon");
      //keluar.textContent = "\uD83D\uDEAA"; // pintu
      keluar.textContent = "\u274C"; // silang
      keluar.setAttribute("aria-label", "Keluar");
      keluar.title = "Keluar";
    }
    keluar.addEventListener("click", async function () {
      keluar.disabled = true;
      try {
        const hasil = await ctx.klien.auth.signOut();
        if (hasil && hasil.error) {
          keluar.disabled = false;
          ctx.aturPesan(pesan, PESAN.keluarGagal, true);
          return;
        }
        matikanLandscape(); // LAY.02
        ctx.keMasuk();
      } catch (e) {
        keluar.disabled = false;
        ctx.aturPesan(pesan, PESAN.keluarGagal, true);
      }
    });
    return keluar;
  }

  // ===== Layar =====
  function tampilMuat(ctx) {
    ctx.kosongkan();
    const kartu = ctx.buatEl("div", "kartu");
    kartu.appendChild(ctx.buatEl("p", "petunjuk", PESAN.tunggu));
    ctx.wadah.appendChild(kartu);
  }

  function tampilGagalMuat(ctx, pesanTeks) {
    ctx.kosongkan();
    const kartu = ctx.buatEl("div", "kartu");
    kartu.appendChild(ctx.buatEl("h2", "judul", "Gagal memuat"));
    kartu.appendChild(ctx.buatEl("p", "petunjuk", pesanTeks));

    const pesan = ctx.buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    kartu.appendChild(pesan);

    const aksi = ctx.buatEl("div", "aksi");
    const ulang = ctx.buatEl("button", "tombol", "Coba lagi");
    ulang.type = "button";
    ulang.addEventListener("click", function () {
      mulai(ctx);
    });
    aksi.appendChild(ulang);
    aksi.appendChild(buatTombolKeluar(ctx, pesan));
    kartu.appendChild(aksi);
    ctx.wadah.appendChild(kartu);
  }

  // Layar Pilih nama (mode "baru") dan Ganti nama (mode "ganti").
  function tampilNama(ctx, mode, status) {
    // LAY.02: layar Pilih nama untuk akun baru boleh tegak (belum layar permainan).
    if (mode === "baru") matikanLandscape();
    ctx.kosongkan();
    const kartu = ctx.buatEl("div", "kartu");
    kartu.appendChild(
      ctx.buatEl(
        "h2",
        "judul",
        mode === "baru" ? "Pilih nama tampilan" : "Ganti nama",
      ),
    );
    kartu.appendChild(
      ctx.buatEl(
        "p",
        "petunjuk",
        "3 sampai 20 karakter: huruf, angka, spasi, atau garis bawah. Boleh sama dengan pemain lain.",
      ),
    );

    const form = ctx.buatEl("form", "form");
    form.noValidate = true;

    const baris = ctx.buatEl("div", "kolom");
    const lab = ctx.buatEl("label", "", "Nama tampilan");
    lab.htmlFor = "nama-tampilan";
    const input = ctx.buatEl("input");
    input.id = "nama-tampilan";
    input.type = "text";
    input.maxLength = 20;
    input.autocomplete = "nickname";
    input.spellcheck = false;
    if (mode === "ganti" && status && status.nama_tampilan) {
      input.value = status.nama_tampilan;
    }
    baris.appendChild(lab);
    baris.appendChild(input);
    form.appendChild(baris);

    const pesan = ctx.buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    form.appendChild(pesan);

    const simpan = ctx.buatEl("button", "tombol", "Simpan nama");
    simpan.type = "submit";
    form.appendChild(simpan);

    if (mode === "ganti") {
      const batal = ctx.buatEl("button", "tombol sekunder", "Batal");
      batal.type = "button";
      batal.addEventListener("click", function () {
        tampilUtama(ctx, status);
      });
      form.appendChild(batal);
    } else {
      form.appendChild(buatTombolKeluar(ctx, pesan));
    }

    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      const nama = input.value.trim();
      if (!ATURAN_NAMA.test(nama)) {
        ctx.aturPesan(pesan, PESAN.aturanNama, true);
        return;
      }

      // Cegah tekan dua kali saat menunggu.
      simpan.disabled = true;
      ctx.aturPesan(pesan, PESAN.tunggu, false);

      const hasil = await panggil(ctx, "ganti_nama", { nama: nama });
      if (hasil.ok) {
        tampilUtama(ctx, hasil.status);
        return;
      }
      if (hasil.kode === 401) {
        sesiHabis(ctx);
        return;
      }
      simpan.disabled = false;
      if (hasil.kode === 400) {
        ctx.aturPesan(pesan, PESAN.aturanNama, true);
      } else if (hasil.kode === 429) {
        ctx.aturPesan(pesan, PESAN.terlaluSering, true);
      } else if (hasil.kode === 0) {
        ctx.aturPesan(pesan, PESAN.gagalMemuat, true);
      } else {
        ctx.aturPesan(pesan, PESAN.gagalSimpan, true);
      }
    });

    kartu.appendChild(form);
    ctx.wadah.appendChild(kartu);
    input.focus();
  }

  // Layar utama sederhana: nama, umpan, koin, tombol Lempar Kail, menu akun.
  // pesanAwal (opsional): pesan info singkat, misal setelah password berhasil diganti.
  function tampilUtama(ctx, status, pesanAwal) {
    aktifkanLandscape(ctx); // LAY.02
    ctx.kosongkan();
    const kartu = ctx.buatEl("div", "kartu");
    const judulHalo = ctx.buatEl(
      "h2",
      "judul",
      "Halo, " + String(status.nama_tampilan || ""),
    );
    kartu.appendChild(judulHalo);

    // LAY.01: bagian layar utama yang disembunyikan selama layar pilih lokasi tampil.
    // Dideklarasikan di sini karena mancing.js memanggil saatLayarPilih saat dipasang,
    // sebelum tombol-tombol di bawah dibuat; keadaannya diterapkan lagi setelah tombol ada.
    const bagianUtama = [judulHalo];
    let layarPilihAktif = false;
    // LAY.05: diisi di bawah setelah panel pengaturan dibuat; null selama belum ada.
    let tutupMenuPengaturan = null;
    function terapkanLayarPilih() {
      bagianUtama.forEach(function (e) {
        e.hidden = layarPilihAktif;
      });
      if (layarPilihAktif && tutupMenuPengaturan) tutupMenuPengaturan();
    }

    const info = ctx.buatEl("div", "statistik");
    // MCG.03: disimpan di variabel supaya angka umpan bisa diperbarui setelah lemparan.
    const teksUmpan = ctx.buatEl(
      "p",
      "petunjuk",
      "Umpan: " + status.umpan + " / " + status.umpan_maks,
    );
    info.appendChild(teksUmpan);
    // TAS.03: disimpan di variabel supaya koin bisa diperbarui setelah jual.
    const teksKoin = ctx.buatEl("p", "petunjuk", "Koin: " + status.koin);
    info.appendChild(teksKoin);
    kartu.appendChild(info);
    // LAY.01: tulisan Umpan dan Koin disembunyikan langsung, karena CSS kotak .statistik
    // menimpa atribut hidden sehingga menyembunyikan kotaknya saja tidak cukup.
    bagianUtama.push(info, teksUmpan, teksKoin);

    // MCG.03: pasang layar lempar bila mancing.js termuat; bila tidak, tampil teks lama.
    const modulLempar = window.MANCING_LEMPAR;
    if (modulLempar && typeof modulLempar.pasang === "function") {
      modulLempar.pasang({
        induk: kartu,
        status: status,
        buatEl: ctx.buatEl,
        aturPesan: ctx.aturPesan,
        kirim: function (aksi) {
          return panggil(ctx, aksi);
        },
        muatStatus: function () {
          return panggil(ctx, "status");
        },
        saatUmpanBerubah: function () {
          teksUmpan.textContent =
            "Umpan: " + status.umpan + " / " + status.umpan_maks;
        },
        sesiHabis: function () {
          sesiHabis(ctx);
        },
        // LAY.01: dipanggil mancing.js saat layar pilih lokasi tampil (true) atau tertutup (false).
        saatLayarPilih: function (tampilPilihan) {
          layarPilihAktif = !!tampilPilihan;
          terapkanLayarPilih();
        },
      });
    } else {
      kartu.appendChild(
        ctx.buatEl(
          "p",
          "petunjuk",
          "Layar permainan menyusul di langkah berikutnya.",
        ),
      );
    }

    const pesan = ctx.buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    if (pesanAwal) ctx.aturPesan(pesan, pesanAwal, false);
    kartu.appendChild(pesan);

    const aksi = ctx.buatEl("div", "aksi");

    // TAS.03: tombol Tas Ikan (album koleksi dan jual). Layarnya ada di tas.js.
    //const tas = ctx.buatEl("button", "tombol", "Tas Ikan"); // LAY.07: diganti ikon di bawah
    const tas = ctx.buatEl(
      "button",
      "tombol sekunder tombol-ikon tombol-tas",
      "\uD83C\uDF92",
    ); // LAY.07: ikon tas
    tas.type = "button";
    tas.setAttribute("aria-label", "Tas Ikan");
    tas.title = "Tas Ikan";
    tas.addEventListener("click", function () {
      const modul = window.MANCING_TAS;
      if (!modul || typeof modul.tampil !== "function") {
        ctx.aturPesan(pesan, PESAN.gagalMemuat, true);
        return;
      }
      modul.tampil({
        wadah: ctx.wadah,
        status: status,
        buatEl: ctx.buatEl,
        kosongkan: ctx.kosongkan,
        aturPesan: ctx.aturPesan,
        muatStatus: function () {
          return panggil(ctx, "status");
        },
        // Hanya id jenis dan pilihan ("satu" atau "semua") yang dikirim; harga dan koin dihitung server.
        jual: function (ikanId, pilihan) {
          return panggil(ctx, "jual", { ikan_id: ikanId, pilihan: pilihan });
        },
        saatKoinBerubah: function () {
          teksKoin.textContent = "Koin: " + status.koin;
        },
        sesiHabis: function () {
          sesiHabis(ctx);
        },
        kembali: function () {
          tampilUtama(ctx, status);
        },
      });
    });
    //aksi.appendChild(tas); // LAY.07: Tas Ikan dipasang langsung di kartu (lihat bawah)

    const ganti = ctx.buatEl("button", "tombol sekunder", "Ganti nama");
    ganti.type = "button";
    ganti.addEventListener("click", function () {
      tampilNama(ctx, "ganti", status);
    });
    aksi.appendChild(ganti);

    // AKN.06c: Ganti password (login ulang dengan password lama dulu, AK7).
    const gantiPass = ctx.buatEl("button", "tombol sekunder", "Ganti password");
    gantiPass.type = "button";
    gantiPass.addEventListener("click", function () {
      const modul = window.MANCING_PASSWORD;
      if (!modul || typeof modul.tampilGanti !== "function") {
        ctx.aturPesan(pesan, PESAN.gagalMemuat, true);
        return;
      }
      modul.tampilGanti({
        wadah: ctx.wadah,
        klien: ctx.klien,
        email: ctx.email,
        buatEl: ctx.buatEl,
        kosongkan: ctx.kosongkan,
        aturPesan: ctx.aturPesan,
        selesai: function () {
          tampilUtama(ctx, status, PESAN.passwordBerhasil);
        },
        batal: function () {
          tampilUtama(ctx, status);
        },
      });
    });
    aksi.appendChild(gantiPass);

    // LAY.05: ikon pengaturan (gerigi) dan panelnya. Tombol Ganti nama dan Ganti password di atas
    // dipindah ke panel (appendChild memindahkan elemen yang sama, fungsinya tetap). Ganti lokasi
    // menekan tombol milik mancing.js (class tombol-ganti-lokasi) supaya aturan lama (tidak bisa
    // ganti saat lemparan berjalan) tetap berlaku.
    const gerigi = ctx.buatEl(
      "button",
      "tombol sekunder tombol-ikon",
      "\u2699\uFE0F",
    );
    gerigi.type = "button";
    gerigi.setAttribute("aria-label", "Pengaturan");
    gerigi.setAttribute("aria-expanded", "false");
    gerigi.title = "Pengaturan";

    const latarMenu = ctx.buatEl("div", "menu-latar");
    latarMenu.hidden = true;
    const menu = ctx.buatEl("div", "menu-pengaturan");
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-label", "Pengaturan");
    menu.hidden = true;
    menu.appendChild(ctx.buatEl("p", "judul-menu", "Pengaturan"));

    const gantiLokasi = ctx.buatEl("button", "tombol sekunder", "Ganti lokasi");
    gantiLokasi.type = "button";

    menu.appendChild(ganti);
    menu.appendChild(gantiPass);
    menu.appendChild(gantiLokasi);

    function tombolLokasiMancing() {
      return kartu.querySelector(".tombol-ganti-lokasi");
    }

    function tutupMenu() {
      menu.hidden = true;
      latarMenu.hidden = true;
      gerigi.setAttribute("aria-expanded", "false");
    }
    tutupMenuPengaturan = tutupMenu;

    function bukaMenu() {
      // Ganti lokasi mati bila tombol milik mancing.js tidak ada atau sedang mati (lemparan berjalan).
      const t = tombolLokasiMancing();
      gantiLokasi.disabled = !t || t.disabled;
      menu.hidden = false;
      latarMenu.hidden = false;
      gerigi.setAttribute("aria-expanded", "true");
      ganti.focus();
    }

    gerigi.addEventListener("click", function () {
      if (menu.hidden) {
        bukaMenu();
      } else {
        tutupMenu();
      }
    });
    latarMenu.addEventListener("click", tutupMenu);
    function saatTombolMenu(ev) {
      if (ev.key === "Escape" && !menu.hidden) {
        tutupMenu();
        gerigi.focus();
      }
    }
    gerigi.addEventListener("keydown", saatTombolMenu);
    menu.addEventListener("keydown", saatTombolMenu);

    gantiLokasi.addEventListener("click", function () {
      tutupMenu();
      const t = tombolLokasiMancing();
      if (t && !t.disabled) t.click();
    });

    aksi.appendChild(gerigi);

    // LAY.01: tiga tombol ini ikut disembunyikan saat layar pilih lokasi; Keluar sengaja tetap tampil.
    bagianUtama.push(tas, ganti, gantiPass, gerigi);
    terapkanLayarPilih();

    aksi.appendChild(buatTombolKeluar(ctx, pesan, true)); // LAY.06: ikon saja
    kartu.appendChild(aksi);
    kartu.appendChild(tas); // LAY.07
    kartu.appendChild(latarMenu); // LAY.05
    kartu.appendChild(menu); // LAY.05
    ctx.wadah.appendChild(kartu);
  }

  // ===== Mulai: dipanggil sekali setelah masuk =====
  async function mulai(ctx) {
    matikanLandscape(); // LAY.02: login baru mulai dari keadaan bersih
    // LAY.01: pemain yang baru masuk selalu memilih lokasi dulu; lokasi pemain sebelumnya dilupakan.
    const modulLokasi = window.MANCING_LEMPAR;
    if (modulLokasi && typeof modulLokasi.lupakanLokasi === "function") {
      modulLokasi.lupakanLokasi();
    }
    tampilMuat(ctx);
    const hasil = await panggil(ctx, "status");
    if (!hasil.ok) {
      if (hasil.kode === 401) {
        sesiHabis(ctx);
        return;
      }
      tampilGagalMuat(
        ctx,
        hasil.kode === 429 ? PESAN.terlaluSering : PESAN.gagalMemuat,
      );
      return;
    }
    if (hasil.status.ada === false) {
      tampilNama(ctx, "baru", null);
      return;
    }
    tampilUtama(ctx, hasil.status);
  }

  window.MANCING_NAMA = { mulai: mulai };
})();
