// public/password.js
// Layar "Buat password baru" untuk pemain yang membuka link reset dari email (AKN.06).
// Dipanggil dari akun.js saat link pemulihan terdeteksi. Nantinya berkas ini juga
// dipakai layar Ganti password (AK7).
// Password hanya dikirim ke Supabase Auth; tidak disimpan, dicatat, atau ditampilkan sendiri.
// Semua teks lewat textContent (tanpa innerHTML). Galat mentah tidak ditampilkan.
(function () {
  "use strict";

  // Password: hanya huruf dan angka, minimal 8 karakter (AK3).
  const ATURAN_PASSWORD = /^[A-Za-z0-9]{8,}$/;

  const PESAN = {
    aturanPassword: "Password minimal 8 karakter, hanya huruf dan angka",
    tidakSama: "Kedua password harus sama",
    samaDenganLama: "Password baru harus berbeda dari password lama",
    sesiHabis:
      "Link reset sudah tidak berlaku. Hubungi tim untuk dikirim ulang, lalu klik link yang baru",
    terlaluSering: "Terlalu sering mencoba. Tunggu sebentar lalu coba lagi",
    gagalMemuat: "Gagal memuat. Periksa internet lalu coba lagi",
    gagalSimpan: "Gagal menyimpan password. Coba lagi",
    tunggu: "Mohon tunggu...",
  };

  // Menerjemahkan galat Supabase ke pesan aman Bahasa Indonesia.
  function pesanGalat(galat) {
    const status = galat && galat.status;
    const kode = String((galat && galat.code) || "").toLowerCase();
    const teks = String((galat && galat.message) || "").toLowerCase();
    if (status === 429 || teks.indexOf("rate limit") !== -1) {
      return PESAN.terlaluSering;
    }
    if (
      kode === "same_password" ||
      teks.indexOf("different from the old") !== -1
    ) {
      return PESAN.samaDenganLama;
    }
    if (kode === "weak_password") return PESAN.aturanPassword;
    if (status === 401 || teks.indexOf("session") !== -1) {
      return PESAN.sesiHabis;
    }
    if (!status) return PESAN.gagalMemuat;
    return PESAN.gagalSimpan;
  }

  // Buang token dari alamat di bilah browser supaya tidak tertinggal di riwayat.
  function bersihkanAlamat() {
    try {
      if (window.location.hash || window.location.search) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch (e) {
      // Diabaikan: hanya merapikan alamat.
    }
  }

  // ctx dari akun.js: wadah, klien, buatEl, kosongkan, aturPesan, buatKolom,
  // selesai(email) bila password berhasil diganti, batal() untuk keluar.
  function tampilBaru(ctx) {
    ctx.kosongkan();
    const kartu = ctx.buatEl("div", "kartu");
    kartu.appendChild(ctx.buatEl("h2", "judul", "Buat password baru"));
    kartu.appendChild(
      ctx.buatEl(
        "p",
        "petunjuk",
        "Password: huruf dan angka saja, minimal 8 karakter.",
      ),
    );

    const form = ctx.buatEl("form", "form");
    form.noValidate = true;

    const kolomBaru = ctx.buatKolom(
      "Password baru",
      "password",
      "password-baru",
      "new-password",
    );
    const kolomUlang = ctx.buatKolom(
      "Ulangi password baru",
      "password",
      "password-ulang",
      "new-password",
    );
    form.appendChild(kolomBaru.baris);
    form.appendChild(kolomUlang.baris);

    const lihat = ctx.buatEl("label", "lihat");
    const cek = ctx.buatEl("input");
    cek.type = "checkbox";
    cek.addEventListener("change", function () {
      const tipe = cek.checked ? "text" : "password";
      kolomBaru.input.type = tipe;
      kolomUlang.input.type = tipe;
    });
    lihat.appendChild(cek);
    lihat.appendChild(document.createTextNode(" Tampilkan password"));
    form.appendChild(lihat);

    const pesan = ctx.buatEl("p", "pesan");
    pesan.setAttribute("role", "alert");
    form.appendChild(pesan);

    const simpan = ctx.buatEl("button", "tombol", "Simpan password");
    simpan.type = "submit";
    form.appendChild(simpan);

    const batal = ctx.buatEl("button", "tombol sekunder", "Batal");
    batal.type = "button";
    batal.addEventListener("click", function () {
      batal.disabled = true;
      simpan.disabled = true;
      ctx.batal();
    });
    form.appendChild(batal);

    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      const baru = kolomBaru.input.value;
      const ulang = kolomUlang.input.value;

      if (!ATURAN_PASSWORD.test(baru)) {
        ctx.aturPesan(pesan, PESAN.aturanPassword, true);
        return;
      }
      if (baru !== ulang) {
        ctx.aturPesan(pesan, PESAN.tidakSama, true);
        return;
      }

      // Cegah tekan dua kali saat menunggu.
      simpan.disabled = true;
      batal.disabled = true;
      ctx.aturPesan(pesan, PESAN.tunggu, false);

      let hasil;
      try {
        hasil = await ctx.klien.auth.updateUser({ password: baru });
      } catch (e) {
        hasil = { error: { status: 0 } };
      }

      if (hasil.error) {
        simpan.disabled = false;
        batal.disabled = false;
        ctx.aturPesan(pesan, pesanGalat(hasil.error), true);
        return;
      }

      bersihkanAlamat();
      const email = hasil.data && hasil.data.user ? hasil.data.user.email : "";
      ctx.selesai(email);
    });

    kartu.appendChild(form);
    ctx.wadah.appendChild(kartu);
    kolomBaru.input.focus();
  }

  window.MANCING_PASSWORD = { tampilBaru: tampilBaru };
})();
