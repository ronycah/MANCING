// public/akun.js
// Layar Daftar, Masuk, dan Keluar (AKN.04).
// Memakai Supabase Auth dengan kunci publik dari config.js.
// Semua teks lewat textContent (tanpa innerHTML). Galat mentah tidak ditampilkan.
// AKN.05: setelah masuk, layar Pilih nama / layar utama diambil alih nama.js bila termuat.
(function () {
  "use strict";

  const wadah = document.getElementById("akun");
  if (!wadah) return;

  // Password: hanya huruf dan angka, minimal 8 karakter (AK3).
  const ATURAN_PASSWORD = /^[A-Za-z0-9]{8,}$/;

  // AKN.06: link reset password dari email. Alamat dibaca SEKARANG (sebelum pustaka
  // Supabase memprosesnya) supaya link pemulihan tidak berubah jadi masuk biasa.
  const HASH_AWAL = window.location.hash || "";
  const LINK_PEMULIHAN = /[#&]type=recovery(&|$)/.test(HASH_AWAL);
  const LINK_GALAT = !LINK_PEMULIHAN && /[#&]error(_code)?=/.test(HASH_AWAL);
  let sedangPemulihan = LINK_PEMULIHAN;
  let sudahMulai = false;

  const PESAN = {
    linkKedaluwarsa:
      "Link reset sudah kedaluwarsa atau sudah dipakai. Hubungi tim untuk dikirim ulang",
    aturanPassword: "Password minimal 8 karakter, hanya huruf dan angka",
    gagalMemuat: "Gagal memuat. Periksa internet lalu coba lagi",
    loginSalah: "Email atau password salah",
    terlaluSering: "Terlalu sering mencoba. Tunggu sebentar lalu coba lagi",
    emailTerdaftar: "Email ini sudah terdaftar. Coba tab Masuk",
    daftarTidakValid:
      "Email atau password tidak valid. Password minimal 8 karakter, hanya huruf dan angka",
    daftarGagal: "Gagal mendaftar. Coba lagi",
    daftarBelumSelesai: "Pendaftaran belum selesai. Coba tab Masuk",
    keluarGagal: "Gagal keluar. Coba lagi",
    isiEmail: "Isi email dengan benar",
    isiPassword: "Isi password",
    tunggu: "Mohon tunggu...",
  };

  // ===== Klien Supabase (bila pustaka dari CDN tidak termuat, tetap tidak error) =====
  let klien = null;
  try {
    if (window.supabase && window.MANCING_CONFIG) {
      klien = window.supabase.createClient(
        window.MANCING_CONFIG.SUPABASE_URL,
        window.MANCING_CONFIG.SUPABASE_ANON_KEY,
      );
    }
  } catch (e) {
    klien = null;
  }
  // Dipakai fitur berikutnya (nama tampilan, mancing, dan lain-lain).
  window.MANCING_KLIEN = klien;

  // ===== Pembantu tampilan =====
  function buatEl(tag, kelas, teks) {
    const e = document.createElement(tag);
    if (kelas) e.className = kelas;
    if (teks !== undefined) e.textContent = teks;
    return e;
  }

  function kosongkan() {
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);
  }

  function buatKolom(label, tipe, id, autolengkap) {
    const baris = buatEl("div", "kolom");
    const lab = buatEl("label", "", label);
    lab.htmlFor = id;
    const input = buatEl("input");
    input.id = id;
    input.type = tipe;
    input.autocomplete = autolengkap;
    if (tipe === "email") input.inputMode = "email";
    input.autocapitalize = "none";
    input.spellcheck = false;
    baris.appendChild(lab);
    baris.appendChild(input);
    return { baris: baris, input: input };
  }

  function aturPesan(elemen, teks, galat) {
    elemen.textContent = teks;
    elemen.className = galat ? "pesan" : "pesan info";
  }

  // ===== Menerjemahkan galat Supabase ke pesan aman Bahasa Indonesia =====
  function pesanGalat(galat, mode) {
    const status = galat && galat.status;
    const teks = String((galat && galat.message) || "").toLowerCase();
    if (status === 429 || teks.indexOf("rate limit") !== -1) {
      return PESAN.terlaluSering;
    }
    if (mode === "daftar") {
      if (teks.indexOf("already") !== -1) return PESAN.emailTerdaftar;
      if (status === 400 || status === 422) return PESAN.daftarTidakValid;
      if (!status) return PESAN.gagalMemuat;
      return PESAN.daftarGagal;
    }
    if (status === 400) return PESAN.loginSalah;
    return PESAN.gagalMemuat;
  }

  // ===== Aksi ke Supabase Auth =====
  async function daftar(email, password) {
    try {
      const hasil = await klien.auth.signUp({
        email: email,
        password: password,
      });
      if (hasil.error) {
        return { ok: false, pesan: pesanGalat(hasil.error, "daftar") };
      }
      if (!hasil.data || !hasil.data.session) {
        return { ok: false, pesan: PESAN.daftarBelumSelesai };
      }
      return { ok: true, email: hasil.data.session.user.email };
    } catch (e) {
      return { ok: false, pesan: PESAN.gagalMemuat };
    }
  }

  async function masuk(email, password) {
    try {
      const hasil = await klien.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (hasil.error) {
        return { ok: false, pesan: pesanGalat(hasil.error, "masuk") };
      }
      return { ok: true, email: hasil.data.user.email };
    } catch (e) {
      return { ok: false, pesan: PESAN.gagalMemuat };
    }
  }

  // ===== Layar =====
  function tampilTanpaPustaka() {
    kosongkan();
    const kartu = buatEl("div", "kartu");
    kartu.appendChild(buatEl("h2", "judul", "Butuh internet"));
    kartu.appendChild(
      buatEl(
        "p",
        "petunjuk",
        "Masuk dan daftar butuh internet. Periksa sambunganmu lalu coba lagi.",
      ),
    );
    const tombol = buatEl("button", "tombol", "Coba lagi");
    tombol.type = "button";
    tombol.addEventListener("click", function () {
      location.reload();
    });
    kartu.appendChild(tombol);
    wadah.appendChild(kartu);
  }

  function tampilForm(mode, pesanAwal) {
    kosongkan();
    const kartu = buatEl("div", "kartu");

    // Tab Masuk / Daftar
    const tab = buatEl("div", "tab");
    [
      ["masuk", "Masuk"],
      ["daftar", "Daftar"],
    ].forEach(function (p) {
      const b = buatEl(
        "button",
        "tab-tombol" + (p[0] === mode ? " aktif" : ""),
        p[1],
      );
      b.type = "button";
      b.addEventListener("click", function () {
        if (p[0] !== mode) tampilForm(p[0]);
      });
      tab.appendChild(b);
    });
    kartu.appendChild(tab);

    // Formulir
    const form = buatEl("form", "form");
    form.noValidate = true;

    const kolomEmail = buatKolom("Email", "email", "akun-email", "email");
    const kolomPass = buatKolom(
      "Password",
      "password",
      "akun-password",
      mode === "daftar" ? "new-password" : "current-password",
    );
    form.appendChild(kolomEmail.baris);
    form.appendChild(kolomPass.baris);

    if (mode === "daftar") {
      form.appendChild(
        buatEl(
          "p",
          "petunjuk",
          "Password: huruf dan angka saja, minimal 8 karakter.",
        ),
      );
    }

    const lihat = buatEl("label", "lihat");
    const cek = buatEl("input");
    cek.type = "checkbox";
    cek.addEventListener("change", function () {
      kolomPass.input.type = cek.checked ? "text" : "password";
    });
    lihat.appendChild(cek);
    lihat.appendChild(document.createTextNode(" Tampilkan password"));
    form.appendChild(lihat);

    const pesan = buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    if (pesanAwal) aturPesan(pesan, pesanAwal, true);
    form.appendChild(pesan);

    const tombol = buatEl(
      "button",
      "tombol",
      mode === "daftar" ? "Daftar" : "Masuk",
    );
    tombol.type = "submit";
    form.appendChild(tombol);

    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      const email = kolomEmail.input.value.trim();
      const password = kolomPass.input.value;

      if (!email || email.indexOf("@") < 1) {
        aturPesan(pesan, PESAN.isiEmail, true);
        return;
      }
      if (mode === "daftar" && !ATURAN_PASSWORD.test(password)) {
        aturPesan(pesan, PESAN.aturanPassword, true);
        return;
      }
      if (mode === "masuk" && !password) {
        aturPesan(pesan, PESAN.isiPassword, true);
        return;
      }

      // Cegah tekan dua kali saat menunggu.
      tombol.disabled = true;
      aturPesan(pesan, PESAN.tunggu, false);

      const hasil =
        mode === "daftar"
          ? await daftar(email, password)
          : await masuk(email, password);

      if (hasil.ok) {
        tampilSudahMasuk(hasil.email);
      } else {
        tombol.disabled = false;
        aturPesan(pesan, hasil.pesan, true);
      }
    });

    kartu.appendChild(form);
    wadah.appendChild(kartu);
  }

  // AKN.06: pemain membuka link reset dari email. Wajib membuat password baru dulu;
  // tidak boleh langsung masuk ke layar utama.
  function tampilPemulihan() {
    const modul = window.MANCING_PASSWORD;
    if (!modul || typeof modul.tampilBaru !== "function") {
      // password.js tidak termuat: jangan biarkan link berubah jadi masuk biasa.
      sedangPemulihan = false;
      const kembali = function () {
        tampilForm("masuk", PESAN.gagalMemuat);
      };
      klien.auth.signOut().then(kembali, kembali);
      return;
    }
    modul.tampilBaru({
      wadah: wadah,
      klien: klien,
      buatEl: buatEl,
      kosongkan: kosongkan,
      aturPesan: aturPesan,
      buatKolom: buatKolom,
      selesai: function (email) {
        sedangPemulihan = false;
        tampilSudahMasuk(email);
      },
      batal: async function () {
        sedangPemulihan = false;
        try {
          await klien.auth.signOut();
        } catch (e) {
          // Diabaikan: tetap kembali ke layar Masuk.
        }
        tampilForm("masuk");
      },
    });
  }

  function tampilSudahMasuk(email) {
    // AKN.05: bila nama.js termuat, dia yang mengurus layar sesudah masuk
    // (Pilih nama, layar utama, Ganti nama, Keluar).
    if (
      window.MANCING_NAMA &&
      typeof window.MANCING_NAMA.mulai === "function"
    ) {
      window.MANCING_NAMA.mulai({
        wadah: wadah,
        klien: klien,
        email: email,
        buatEl: buatEl,
        kosongkan: kosongkan,
        aturPesan: aturPesan,
        keMasuk: function () {
          tampilForm("masuk");
        },
      });
      return;
    }

    // Cadangan (layar sementara AKN.04) bila nama.js belum termuat.
    kosongkan();
    const kartu = buatEl("div", "kartu");
    kartu.appendChild(buatEl("h2", "judul", "Kamu sudah masuk 🎣"));
    kartu.appendChild(
      buatEl("p", "petunjuk", "Masuk sebagai: " + (email || "")),
    );
    kartu.appendChild(
      buatEl(
        "p",
        "petunjuk",
        "Layar permainan menyusul di langkah berikutnya.",
      ),
    );

    const pesan = buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    kartu.appendChild(pesan);

    const keluar = buatEl("button", "tombol sekunder", "Keluar");
    keluar.type = "button";
    keluar.addEventListener("click", async function () {
      keluar.disabled = true;
      try {
        const hasil = await klien.auth.signOut();
        if (hasil && hasil.error) {
          keluar.disabled = false;
          aturPesan(pesan, PESAN.keluarGagal, true);
          return;
        }
        tampilForm("masuk");
      } catch (e) {
        keluar.disabled = false;
        aturPesan(pesan, PESAN.keluarGagal, true);
      }
    });
    kartu.appendChild(keluar);
    wadah.appendChild(kartu);
  }

  // ===== Mulai =====
  async function mulai() {
    if (!klien) {
      tampilTanpaPustaka();
      return;
    }

    // Bila sesi berakhir dari tab lain, kembali ke layar Masuk.
    klien.auth.onAuthStateChange(function (kejadian) {
      if (kejadian === "SIGNED_OUT") tampilForm("masuk");
      // AKN.06: pustaka mengenali link pemulihan.
      if (kejadian === "PASSWORD_RECOVERY") {
        sedangPemulihan = true;
        if (sudahMulai) tampilPemulihan();
      }
    });

    try {
      const hasil = await klien.auth.getSession();
      sudahMulai = true;
      if (hasil.data && hasil.data.session) {
        if (sedangPemulihan) {
          tampilPemulihan();
        } else {
          tampilSudahMasuk(hasil.data.session.user.email);
        }
        return;
      }
    } catch (e) {
      // Gagal membaca sesi: lanjut ke layar Masuk.
    }
    sudahMulai = true;

    // Link reset yang kedaluwarsa atau sudah dipakai: beri tahu dan bersihkan alamat.
    if (LINK_GALAT) {
      try {
        window.history.replaceState(null, "", window.location.pathname);
      } catch (e) {
        // Diabaikan: hanya merapikan alamat.
      }
      tampilForm("masuk", PESAN.linkKedaluwarsa);
      return;
    }
    tampilForm("masuk");
  }

  mulai();
})();
