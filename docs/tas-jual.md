/docs/tas-jual.md

# 🎒 tas-jual.md: Tas Ikan (Album Koleksi), Jual, dan Koin

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Bergantung pada `akun.md` dan `mancing.md` (tabel `ikan` dan `tangkapan` sudah ada, ikan sudah bisa tertangkap).
> **Status:** TS1 sampai TS9 disepakati tim (ketua ikut di Zoom, 1 Nov 2026). Butir bertanda **(bawaan)** adalah pilihan penulis yang tidak ditanyakan satu per satu; tim boleh mengubahnya sebelum dikerjakan. Belum ada yang dikerjakan.
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini saja**. Kerjakan langkah di bagian 5. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 9 bila ada kejadian di lapangan.
> **Berkas yang diminta AI di awal sesi** (sebut nama dan alasan sekaligus, jangan menebak isinya): berkas migration terbaru di `supabase/migrations/`, `supabase/functions/mancing/index.ts`, dan berkas JS layar utama dan tas bila sudah ada.
> **Tanpa kode dan tanpa isi SQL.**
> **Fitur ini High-Risk (P0) di bagian jual:** koin dan stok ikan. Tampilan tas Low-Risk.
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Pemain melihat ikan yang dimilikinya dalam bentuk **album koleksi**, bisa **menjual** ikan untuk mendapat **koin**, dan koin tampil di layar utama. Server yang menghitung stok dan koin; aplikasi tidak pernah mengirim harga atau koin.

---

## 2. Keputusan

| No  | Keputusan                                                                                                                                                                                                                                                                                                                                                          | Dasar                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| TS1 | **Tas = album koleksi.** Ke-16 jenis ikan selalu tampil dalam kotak. Jenis yang **belum pernah didapat** tampil sebagai **siluet terkunci** dengan nama "???". Begitu tertangkap, gambar, nama, kelas, dan jumlahnya **terbuka**. Jenis yang pernah didapat **tetap terbuka** walau semuanya dijual (jumlah 0).                                                    | Keputusan tim 1 Nov 2026. Fishdex dipindah dari bonus ke inti. |
| TS2 | Tiap kotak menampilkan **gambar, nama, kelas (rarity), dan jumlah yang dimiliki**.                                                                                                                                                                                                                                                                                 | Keputusan tim 1 Nov 2026.                                      |
| TS3 | **Cara jual:** pemain mengetuk satu jenis di album, lalu memilih **"Jual 1"** atau **"Jual semua jenis ini"**. Tanpa mengetik jumlah.                                                                                                                                                                                                                              | Keputusan tim 1 Nov 2026 (opsi A).                             |
| TS4 | **Harga ditentukan oleh kelas saja**, tanpa berat ikan, disimpan di `pengaturan`: `harga_common` **10**, `harga_rare` **30**, `harga_epic` **100**, `harga_legendary` **500** koin per ekor. Bisa diubah tanpa ubah kode.                                                                                                                                          | Keputusan tim 1 Nov 2026.                                      |
| TS5 | **Jual dilakukan server, atomik:** cek jenis dan jumlah cukup → kurangi ikan → tambah koin (harga kelas × jumlah yang dijual). Aplikasi hanya mengirim aksi `jual`, id jenis, dan pilihan "satu" atau "semua". **Tidak pernah** mengirim harga, jumlah koin, atau kelas.                                                                                           | `AGENTS.md` bagian 7; `security.md` aturan 2.                  |
| TS6 | **Tanpa DELETE:** saat ikan habis dijual, baris di `tangkapan` tetap ada dengan jumlah 0 (itu yang membuat jenis tetap "terbuka").                                                                                                                                                                                                                                 | `AGENTS.md` bagian 7; TS1.                                     |
| TS7 | **Gagal jual** (stok tidak cukup, jenis tidak dimiliki, koneksi): pesan umum Bahasa Indonesia, data tidak berubah.                                                                                                                                                                                                                                                 | `features.md`; SEC-12.                                         |
| TS8 | **Koin tampil di layar utama.** Di inti game koin belum bisa dipakai membeli apa pun (upgrade umpan atau pancing ditunda), jadi koin berfungsi seperti skor.                                                                                                                                                                                                       | Keputusan tim; `bonus.md`.                                     |
| TS9 | Aksi `status` **diperluas** (tanpa menghapus isi lama) untuk mengirim daftar ikan aktif dan isi tangkapan pemain. Nama dan gambar jenis yang belum pernah didapat **tidak dikirim** (hanya kelas dan kode siluet); untuk jenis yang sudah pernah didapat dikirim nama, kode gambar, dan jumlah. Ikan yang kemudian dinonaktifkan tetap tampil bila pernah didapat. | Bawaan.                                                        |

---

## 3. Prasyarat

Dari `mancing.md`: tabel `ikan` dan `tangkapan` ada, ikan sudah masuk saat tertangkap, fungsi `mancing` punya aksi `status`, `ganti_nama`, `lempar`.

---

## 4. Yang dibuat

**Alur jual:**

1. Pemain membuka **Tas** dari layar utama.
2. Album menampilkan 16 kotak (terbuka atau siluet).
3. Pemain mengetuk jenis yang dimiliki → tombol **Jual 1** dan **Jual semua jenis ini**.
4. Aplikasi mengirim aksi `jual` (tanpa angka). Server memproses dan membalas jumlah baru, koin baru.
5. Album dan koin di layar diperbarui. Bila gagal, pesan umum.

**Komponen:**

| Komponen                         | Isi                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Baris harga di `pengaturan`      | `harga_common`, `harga_rare`, `harga_epic`, `harga_legendary`. Ditambah tanpa mengubah baris yang sudah ada. |
| Fungsi SQL `jual`                | Atomik (TS5), pola keamanan fungsi sesuai `AGENTS.md` bagian 7.                                              |
| Edge Function `mancing` (diubah) | Menambah aksi `jual` dan memperluas `status` (TS9). Aksi lama tidak diubah atau dihapus.                     |
| Layar Tas / album                | Kotak jenis, siluet terkunci, detail dan tombol jual. Teks lewat `textContent`.                              |
| Tampilan koin                    | Di layar utama.                                                                                              |

Gambar ikan dan siluet mengikuti `pemandangan-ikan.md`.

---

## 5. Urutan pekerjaan (untuk TODO sheet, prefix TAS)

Langkah ⚠️ butuh penjelasan dampak dan "OK" ketua.

1. **TAS.01 ⚠️** Migration: baris harga di `pengaturan` dan fungsi `jual`. SQL disalin ke `supabase/migrations/` dulu, lalu dijalankan.
2. **TAS.02 ⚠️** Edge Function `mancing`: aksi `jual` dan perluasan `status`. Satu berkas utuh, deploy dengan perintah di `fondasi.md` F11.
3. **TAS.03** Layar Tas / album dan tampilan koin.
4. **TAS.04** Sesi tes (`tas-jual-test.md`, dibuat di sesi tes): SEC-12 dan kasus jual lain, dengan bukti.

---

## 6. Aturan yang paling sering terlanggar

| Aturan                                                               | Akibat bila dilanggar                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Aplikasi mengirim harga, jumlah koin, atau kelas                     | Pemain bisa menambah koin sendiri (SEC-06).                                |
| Menghitung koin atau stok di frontend                                | Hasil tidak bisa dipercaya.                                                |
| Memotong ikan dan menambah koin dalam dua langkah terpisah           | Ikan hilang tanpa koin, atau koin bertambah dua kali.                      |
| Menghapus baris `tangkapan` saat ikan habis                          | Melanggar aturan tanpa DELETE; album kehilangan jenis yang pernah terbuka. |
| Harga ditulis mati di kode                                           | Tidak bisa diubah tanpa ubah kode.                                         |
| Mengirim nama dan gambar jenis yang belum pernah didapat ke aplikasi | Siluet "???" tidak berarti (bukan celah keamanan, tapi melanggar TS9).     |
| Menampilkan nama ikan atau koin lewat `innerHTML`                    | Teks dari server bisa menjalankan skrip.                                   |
| Mengubah aksi `status` sampai aksi lama rusak                        | Layar utama dan akun berhenti jalan.                                       |

---

## 7. Dampak dan pembatalan

- **Migration:** hanya menambah baris pengaturan dan satu fungsi baru; yang tidak terpakai boleh dibiarkan.
- **Edge Function `mancing`:** bila bermasalah, deploy ulang versi sebelumnya (salinan di repo).
- **Mengubah harga saat game dipakai** mengubah ekonomi semua pemain; jelaskan dampaknya dan minta "OK" sebelum mengubah `pengaturan`.
- **Risiko utama:** fungsi `jual` menyentuh stok dan koin, jadi dites teliti (jual melebihi stok, jual jenis yang tidak dimiliki, dua penjualan hampir bersamaan).

---

## 8. Ditunda dan belum diketahui

**Ditunda (lihat `bonus.md`):** berat ikan dan harga berdasarkan berat, pembelian memakai koin (upgrade umpan atau pancing), papan peringkat, filter dan urutan album, konfirmasi "yakin jual?" (bila terasa perlu setelah dicoba).

**Belum diketahui (dicek, bukan ditebak):**

- Apakah perlu **konfirmasi sebelum "Jual semua jenis ini"**: dinilai saat uji coba, belum diputuskan.
- Bentuk siluet terkunci tergantung pendekatan gambar ikan (`pemandangan-ikan.md`).

---

## 9. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_

### 2026-11-02: Jumlah tangkapan boleh 0 (TAS.01)

- Keputusan ketua (2 Nov 2026): aturan tabel `tangkapan` diubah dari `jumlah > 0` menjadi `jumlah >= 0`, supaya baris tetap ada saat ikan habis dijual dan jenisnya tetap "terbuka" di album (TS1, TS6).
- Pertentangan: SQL MCG.01 (`2026-11-02_mancing-ikan-tangkapan.sql`) menulis `jumlah > 0`, sedangkan dokumen ini (TS6) dan `database.md` bagian 2 menyebut jumlah bisa 0. Yang paling akhir menang: 0 atau lebih.
- Dijalankan lewat `2026-11-02_tas-jual.sql`, bersama baris `harga_common`, `harga_rare`, `harga_epic`, `harga_legendary` (10 / 30 / 100 / 500) dan fungsi `public.jual(p_id uuid, p_ikan_id bigint, p_pilihan text)` dengan pilihan `satu` atau `semua`. Ikan yang dinonaktifkan tetap boleh dijual (bawaan penulis, belum ditanyakan ke tim).
- Bukti: query cek 2 Nov 2026 menunjukkan aturan tinggal `CHECK (jumlah >= 0)`, harga 10 / 30 / 100 / 500 dengan baris umpan dan peluang lama utuh, `EXECUTE` fungsi `jual` hanya `service_role`, dan hak `ikan` dan `tangkapan` tetap: `anon` dan `authenticated` tanpa hak, `service_role` hanya SELECT. Fungsi `jual` belum diuji perilakunya (menunggu TAS.04). Alasan lain belum tercatat.

### Handoff #1 | 2026-11-02 | [miemoe]

- **Tugas selesai:** TAS.01 (migration: `2026-11-02_tas-jual.sql`) dan TAS.02 (Edge Function `mancing`: aksi `jual` dan `status` diperluas). Keduanya sudah dijalankan atau di-deploy di production dan lolos tes konsol. TAS.01 sudah di-commit (`71dfb69`). Pengingat: centang TAS.01 dan TAS.02 di sheet.
- **File yang diubah:** `supabase/migrations/2026-11-02_tas-jual.sql` (baru), `supabase/functions/mancing/index.ts` (diubah, sudah di-deploy), blok catatan TAS.01 di `tas-jual.md` dan `database.md`.
- **Keputusan baru (bawaan penulis, belum ditanyakan ke tim):**
  - Balasan `status` ditambah kunci `album`: tiap entri berisi `id`, `terbuka`, `kelas`. Jenis terbuka juga `nama`, `kode_gambar`, `jumlah` (boleh 0). Jenis terkunci **hanya** `id` dan `kelas`. Jenis nonaktif yang belum pernah didapat tidak dikirim. Bila album gagal dibaca, `album` bernilai `null` dan isi `status` lama tetap jalan; layar Tas harus menangani `null` dengan pesan umum.
  - Kode siluet belum ada, menunggu pendekatan gambar di `pemandangan-ikan.md`.
  - Aksi `jual` menerima `ikan_id` (angka bulat positif) dan `pilihan` (`satu` atau `semua`). Sukses membalas `hasil` berisi `terjual`, `koin_didapat`, `jumlah_sisa`, `koin`. Gagal 400 dengan pesan umum.
  - Ikan nonaktif tetap boleh dijual.
- **Bukti:** tes konsol 2 Nov 2026 dengan akun dummy Penguji Satu: tanpa token 401; album 16 entri tanpa bocor nama atau gambar di jenis terkunci; jual jenis tidak dimiliki dan kiriman ngawur ditolak tanpa mengubah data; harga palsu dari aplikasi diabaikan; jual satu dan semua benar; jenis yang habis tetap tampil dengan jumlah 0; dua penjualan bersamaan hanya satu yang berhasil; `lempar` masih jalan. Belum termasuk SEC-12 dan kasus lengkap (TAS.04).
- **Belum beres:** catatan TAS.02 ini belum di-commit dan di-push (`index.ts` masih berstatus modified di Git). Konfirmasi sebelum "Jual semua jenis ini" belum diputuskan (bagian 8). Akun Penguji Satu sekarang koin 910 dengan stok campuran (terbuka, terkunci, dan berjumlah 0), cocok untuk uji TAS.03.
- **Saran giliran berikutnya:** (1) `git status`, lalu `git add .`, commit, push (`index.ts` dan `tas-jual.md`). (2) Kerjakan TAS.03 (Low-Risk, tanpa "OK" ketua). Lampirkan `AGENTS.md`, `tas-jual.md`, `public/mancing.js`, `public/index.html`, `public/style.css`, dan `public/sw.js`; berkas JS baru wajib didaftarkan di `BERKAS_DASAR` `sw.js` (butuh "OK" ketua). (3) Setelah itu TAS.04 (sesi tes).

### Handoff #2 | 2026-11-02 | [porek]

- **Tugas selesai:** TAS.03 (layar Tas / album dan tampilan koin). Sudah terbit di production dan lolos cek visual. Pengingat: centang TAS.03 di sheet.
- **File yang diubah:** `public/tas.js` (baru), `public/nama.js` (tombol Tas Ikan, koin ikut diperbarui, `panggil` meneruskan `album`), `public/index.html` (satu baris `<script src="tas.js">`, dimuat sebelum `nama.js`), `public/sw.js` (tambah `"tas.js"` di `BERKAS_DASAR`, sudah "OK" ketua), `public/style.css` (bagian baru "Layar Tas Ikan (TAS.03)" di akhir).
- **Keputusan baru (bawaan penulis, belum ditanyakan ke tim):**
  - Album diambil ulang dari server tiap Tas dibuka, supaya ikan yang baru ditangkap ikut muncul.
  - Harga tidak ditampilkan di layar; yang tampil hanya hasil dari balasan server ("Terjual N ekor. Koin +M").
  - Kotak diurutkan menurut id jenis. Jenis berjumlah 0 tampil pudar, tetap terbuka, dan tombol jualnya mati.
  - Jual gagal (selain putus internet atau terlalu sering): pesan umum, lalu album dimuat ulang otomatis supaya angka cocok.
  - Gambar masih emoji 🐟 dalam lingkaran berwarna kelas; siluet terkunci berupa kotak abu-abu bertanda "?" dan nama "???". Kode siluet dari server belum ada, menunggu `pemandangan-ikan.md`.
- **Pertentangan dengan Handoff #1:** Handoff #1 menulis "balasan `status` ditambah kunci `album`". Ternyata `album` ada di **tingkat atas** balasan, sejajar dengan `status`, bukan di dalamnya. Yang paling akhir menang: `album` sejajar dengan `status`. Server tidak diubah.
- **Kejadian di lapangan (catatan crash):** Setelah terbit, Tas menampilkan "Album belum bisa dimuat" padahal internet aman (koin tampil). Penyebab: layar membaca `album` dari dalam `status`, padahal server mengirimnya sejajar, dan `panggil` di `nama.js` hanya meneruskan `status`. Perbaikan: `panggil` ikut meneruskan `album`, dan `tas.js` membacanya dari `res.album`. Pencegahan: sebelum menulis layar yang membaca balasan server, cek bentuk balasan asli di DevTools > Network > Response (jangan tempel tab Headers karena berisi token). Alasan lain belum tercatat.
- **Bukti (cek visual, Low-Risk):** album 16 kotak (13 terbuka, 3 siluet "???"); Jual 1 Mata Zamrud (Rare): x1 menjadi x0, tetap terbuka, koin 910 menjadi 940 (+30), koin di layar utama sama; berkas `tas.js` ada di cache `santuy-v1` dan halaman tetap terbuka saat Network diset Offline. Bukan bukti keamanan; itu tugas TAS.04.
- **Belum beres:** "Jual semua jenis ini" belum dicoba di layar. Konfirmasi sebelum "Jual semua jenis ini" belum diputuskan (bagian 8). Akun Penguji Satu sekarang koin 940.
- **Saran giliran berikutnya:** (1) TAS.04, sesi tes `tas-jual-test.md` (High-Risk, wajib bukti): SEC-12 dan SEC-18, jual melebihi stok, jenis tidak dimiliki, "Jual semua", cek album dan koin. (2) Gambar ikan dan siluet sungguhan lewat `pemandangan-ikan.md` (VIS.01) menggantikan emoji. (3) Putuskan konfirmasi "Jual semua jenis ini" setelah dicoba.

### Handoff #3 | 2026-11-02 | [fren]

- **Tugas selesai:** TAS.04 (sesi tes tas dan jual). Seluruh kasus lulus di production dengan akun dummy `tes1` dan `tes2`. Pengingat: centang TAS.04 di sheet.
- **File yang diubah:** `docs/tas-jual-test.md` (baru) dan blok ini di akhir `docs/tas-jual.md`. Tidak ada kode, SQL, atau pengaturan yang diubah.
- **Keputusan baru:** tidak ada.
- **Bukti (ringkas, rincian di `tas-jual-test.md`):** SEC-12 (13 kasus ditolak 400, data tidak berubah), SEC-06 (harga dan koin palsu diabaikan, koin 940 menjadi 950), SEC-18 (jual semua Biru Mungil ×7, koin 1020, baris tetap ada), jual bersamaan Naga Emas ×1 (satu berhasil, koin 1520 bukan 2020), SEC-05 (`tes2` tidak berubah), SEC-01 dan SEC-02 untuk `jual` (401), SEC-03 dan SEC-04 (permission denied), cek visual album dan koin.
- **Belum beres:** (1) Konfirmasi sebelum "Jual semua jenis ini" belum diputuskan (bagian 8); sekarang satu ketukan langsung menjual. (2) Belum dites: harga ikut berubah saat `pengaturan` diubah (P0, butuh "OK" ketua), `PEMAIN_TIDAK_ADA` pada jual, jual ikan nonaktif, galat pengaturan rusak, layar sesi habis, cek skala 100 user. (3) Data uji `tes1` berubah (koin 1520, beberapa jenis berjumlah 0) dan tidak dikembalikan; dibersihkan bersama akun tes sebelum demo (butuh "OK" ketua). (4) `docs/tas-jual-test.md` dan blok handoff ini belum di-commit dan di-push (`git status`, `git add .`, commit, push).
- **Saran giliran berikutnya:** (1) `git status`, lalu `git add .`, commit, push. (2) Tes harga lewat `pengaturan` bila ketua setuju (P0 yang tersisa). (3) VIS.01 (gambar ikan dan siluet sungguhan) menggantikan emoji. (4) Putuskan konfirmasi "Jual semua jenis ini" bersama tim.
