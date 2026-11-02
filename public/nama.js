// public/nama.js
// Layar Pilih nama, Ganti nama, dan layar utama sederhana (AKN.05).
// Dipanggil dari akun.js setelah pemain berhasil masuk.
// AKN.06c: tombol Ganti password di layar utama (layarnya ada di password.js).
// MCG.03: layar utama memasang tombol Lempar Kail dari mancing.js bila termuat.
// TAS.03: layar utama punya tombol Tas Ikan (layarnya ada di tas.js) dan koin ikut diperbarui setelah jual.
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

  function alamatFungsi() {
    const c = window.MANCING_CONFIG;
    return c && c.SUPABASE_URL ? c.SUPABASE_URL + "/functions/v1/mancing" : "";
  }

  // Panggil Edge Function "mancing". Mengembalikan { ok, status } (aksi status dan ganti_nama),
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
        return { ok: true, status: data.status };
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
    try {
      await ctx.klien.auth.signOut();
    } catch (e) {
      // Diabaikan: tetap kembali ke layar Masuk.
    }
    ctx.keMasuk();
  }

  // ===== Tombol Keluar (dipakai di beberapa layar) =====
  function buatTombolKeluar(ctx, pesan) {
    const keluar = ctx.buatEl("button", "tombol sekunder", "Keluar");
    keluar.type = "button";
    keluar.addEventListener("click", async function () {
      keluar.disabled = true;
      try {
        const hasil = await ctx.klien.auth.signOut();
        if (hasil && hasil.error) {
          keluar.disabled = false;
          ctx.aturPesan(pesan, PESAN.keluarGagal, true);
          return;
        }
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
    ctx.kosongkan();
    const kartu = ctx.buatEl("div", "kartu");
    kartu.appendChild(
      ctx.buatEl("h2", "judul", "Halo, " + String(status.nama_tampilan || "")),
    );

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
    const tas = ctx.buatEl("button", "tombol", "Tas Ikan");
    tas.type = "button";
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
    aksi.appendChild(tas);

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

    aksi.appendChild(buatTombolKeluar(ctx, pesan));
    kartu.appendChild(aksi);
    ctx.wadah.appendChild(kartu);
  }

  // ===== Mulai: dipanggil sekali setelah masuk =====
  async function mulai(ctx) {
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
