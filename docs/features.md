docs/features.md

# Features & UI Modules — Game Mancing

Ringkasan fitur dan modul tampilan game mancing (PWA). Detail per fitur yang besar ditulis di dokumen fitur sendiri (satu fitur = satu md + satu md tes) setelah sesi strategi.

Status: **(ada)** = sudah diimplementasi, **(rencana)** = baru spesifikasi, **(ditunda)** = sengaja belum dikerjakan. Bagian bertanda **[FINAL?]** dikunci setelah sesi strategi.

> **Versi awal.** Semua fitur masih **(rencana)**. Status diperbarui lewat blok catatan di bagian 11 (append-only), bukan dengan menyunting bagian di atasnya. Struktur data ada di `docs/database.md`, aturan keamanan di `docs/security.md`.

---

## 1. Akun & Login (rencana)

- **Daftar dan login** dengan email + password lewat Supabase Auth. Validasi dasar di game: format email dan panjang minimal password.
- **Nama tampilan**: dipilih saat pertama masuk, bisa diganti kapan saja, **boleh sama antar pemain**. Tanpa data pribadi.
- **Ganti password**: lewat Supabase Auth.
- **Lupa password** lewat tautan email **[FINAL?]**. Alamat GitHub Pages harus terdaftar di pengaturan URL Auth.
- **Gagal**: pesan Bahasa Indonesia yang aman ("Email atau password salah", "Gagal memuat"). Galat mentah tidak ditampilkan; teks lewat `textContent`.

---

## 2. Layar Utama & Pemandangan (rencana)

- Satu lokasi: air (laut/danau **[FINAL?]**), langit, matahari, awan.
- **Tampilan mengikuti waktu WIB** (pagi, siang, sore, malam), dihitung dari **jam server**. Jam HP tidak dipakai.
- Menampilkan **jumlah umpan**, **koin**, nama tampilan, dan tombol Lempar Kail.
- Dibuat dengan CSS/SVG/Canvas, ringan untuk HP biasa. Gaya visual: **[ISI SETELAH SESI STRATEGI]**.

---

## 3. Mancing (rencana)

Alur satu putaran:

1. Pemain menekan **Lempar Kail**.
2. Aplikasi mengirim aksi "lempar" ke server (tanpa angka apa pun).
3. Server memakai 1 umpan, lalu menentukan hasil: **ikan lepas** atau **ikan dengan rarity** (Common, Rare, Epic, Legendary).
4. Aplikasi menampilkan animasi (pelampung, gigitan) dan hasilnya.

Aturan:

- Semua pemain memakai umpan dan pancing yang **sama**; hasil hanya dari peluang di pengaturan.
- **Ikan lepas tetap memakai umpan.**
- **Hasil ditentukan server**; animasi gigitan hanya tampilan **[FINAL?]**.
- Efek khusus untuk Epic dan Legendary (cahaya, kilau): bonus, setelah inti jalan.
- Umpan 0: tombol nonaktif dan tampil perkiraan waktu umpan berikutnya.

---

## 4. Umpan (rencana)

- Maksimal **20**, pulih seiring waktu (awal usulan **1 umpan per jam**), semua angka dari tabel `pengaturan`, bisa diubah tanpa ubah kode.
- Pemulihan dihitung server dari **jam server**, bukan jam HP, dan tetap jalan walau game ditutup.
- Umpan awal pemain baru: **[FINAL?]**.
- Tampilan: jumlah umpan dan hitung mundur ke umpan berikutnya (selisih dihitung dari jam server yang dikirim saat masuk).

---

## 5. Tas Ikan & Jual (rencana)

- Tas menampilkan ikan yang dimiliki per jenis dan jumlahnya, dengan gambar SVG sesuai rarity.
- **Jual**: pemain memilih ikan dan jumlah; server menghitung koin dari harga di katalog dan mengurangi stok. Aplikasi tidak pernah mengirim harga atau koin.
- Gagal (stok tidak cukup, koneksi): pesan umum, data tidak berubah.

---

## 6. Ikan & Rarity (rencana)

- Katalog ikan ada di database (`ikan`): nama, rarity, harga, aktif. Awal: **3 sampai 5 ikan per rarity [FINAL?]**.
- Peluang awal (usulan): Common 60, Rare 25, Epic 12, Legendary 3, dan bisa diubah lewat pengaturan.
- **Gambar ikan**: satu SVG dasar yang warnanya diubah script sesuai rarity (dan bisa lokasi atau waktu). Script SVG dibuat oleh pihak di luar AI (kakak dari salah satu anggota). Catat di dokumen fitur siapa yang memegangnya, dan berlaku aturan "file utuh, jangan hapus kode lama".

---

## 7. PWA & Offline (rencana)

- `manifest.json` dan `sw.js` agar game bisa dipasang di layar utama HP.
- Strategi cache **network first**: ambil dari internet dulu, cache hanya cadangan saat offline. Setelah update, HP tester otomatis dapat versi baru.
- Offline: file game tetap terbuka, tapi login dan semua aksi game butuh internet (pesan jelas ditampilkan).
- Semua path relatif terhadap `public/`.
- Menyentuh `sw.js` termasuk perubahan berisiko, wajib dijelaskan dan menunggu "OK".

---

## 8. Upgrade Umpan/Pancing (ditunda; fitur 4 atau 5)

- Arahan dosen: jenis umpan atau pancing **jangan dulu menentukan hasil**. Fitur ini baru dikerjakan setelah inti (login, mancing, umpan, jual) stabil.
- Bila dikerjakan, ia mengubah peluang rarity dan butuh dokumen fitur sendiri.

---

## 9. Ditunda / Bonus

Tidak dikerjakan atas inisiatif sendiri; masuk hanya bila inti sudah stabil dan ada keputusan baru:

- **Fishdex** (koleksi ikan, siluet untuk yang belum ketemu).
- Leaderboard, achievement, hadiah harian.
- Musik dan suara.
- Halaman **Cara Main / Help** dan **Tentang** (teks dari database, bukan di kode) bila waktu cukup.
- Banyak lokasi atau cuaca.

---

## 10. Aturan Umum Tampilan & Pemeliharaan

- Semua teks dari server dan input pemain lewat `textContent`, bukan `innerHTML`.
- Bahasa UI: Bahasa Indonesia.
- Teks yang bisa berubah (misal pengaturan, daftar ikan) disimpan di database, tanpa ubah kode.
- Tiap perilaku fitur di dokumen ini berubah, ikut perbarui blok catatan di bagian 11 dan dokumen fitur terkait.
- Fitur yang sudah selesai dites dicatat statusnya lewat blok catatan, bukan dengan menimpa isi bagian di atas.

---

## 11. CATATAN TAMBAHAN (append-only)

> Aturan menulis blok: `AGENTS.md` bagian 2, aturan 7. Tempel blok baru di bawah garis ini, format `### YYYY-MM-DD: topik`. Yang paling akhir menang.

_(belum ada blok)_
