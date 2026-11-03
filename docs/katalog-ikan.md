/docs/katalog-ikan.md

# 🐟 katalog-ikan.md: Jumlah, Gambar, dan Penambahan Katalog Ikan

> **Versi 1.0 (3 Nov 2026).** Bergantung pada `mancing.md` (undian ikan), `tas-jual.md` (album), dan `database.md` (tabel `ikan`).
> **Status:** KT1 sampai KT4, KT6, dan KT7 berasal dari keputusan ketua dan aturan dosen (3 Nov 2026). Butir bertanda **(bawaan)** adalah pilihan penulis yang belum ditanyakan satu per satu; tim boleh mengubahnya sebelum dikerjakan. Belum ada yang dikerjakan.
> **Dokumen ini adalah rujukan tunggal untuk penambahan dan perubahan katalog ikan.**
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini saja**. Berkas yang diminta AI di awal sesi (sebut nama dan alasan sekaligus, jangan menebak isinya): hasil query isi tabel `ikan` saat ini, `public/tas.js`, `public/mancing.js`, `public/style.css`, `public/sw.js`, dan berkas SQL katalog yang sudah ada di `supabase/migrations/`. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 9 bila ada keputusan baru atau kejadian di lapangan.
> **Tanpa kode dan tanpa isi SQL.**
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Katalog berisi **40 ikan** dengan sebaran tetap per kelas, dan **setiap ikan punya gambar sendiri** (CC0). Dokumen ini menjadi acuan siapa pun yang menambah ikan, mencari gambar, atau mengubah katalog.

---

## 2. Keputusan

| No  | Keputusan                                                                                                                                                                                                                                                                            | Dasar                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| KT1 | **Katalog 40 ikan** dengan sebaran **Common 16, Rare 12, Epic 8, Legendary 4**. Menggantikan "4 jenis per kelas, total 16" di `mancing.md` MC6 dan "16 jenis" di `tas-jual.md` TS1. Yang paling akhir menang.                                                                        | Keputusan ketua, 3 Nov 2026; aturan dosen (min. 40). |
| KT2 | **Satu nama ikan, satu gambar.** Saat penilaian, tim punya minimal **40 gambar berbeda** yang mewakili 40 nama ikan. Menggantikan pendekatan "satu gambar per kelas".                                                                                                                | Aturan dosen (WA, 3 Nov 2026).                       |
| KT3 | **Semua gambar berlisensi CC0**, supaya tidak ada urusan atribusi.                                                                                                                                                                                                                   | Aturan dosen (WA, 3 Nov 2026).                       |
| KT4 | **Tabel `ikan` menyimpan nama berkas dan lokasi gambar** untuk tiap ikan, memakai kolom `kode_gambar` yang sudah ada. Tidak ada kolom baru.                                                                                                                                          | Arahan dosen; `database.md` bagian 2.                |
| KT5 | **Jalur dan format gambar (bawaan):** berkas WebP transparan di `public/img/ikan/`, nama huruf kecil tanpa spasi mengikuti nama ikan (contoh `img/ikan/sisik-pasir.webp`). Isi `kode_gambar` adalah jalur lengkap ini.                                                               | Bawaan; `fondasi.md` (aturan nama berkas).           |
| KT6 | **Placeholder selama development.** Ikan yang gambarnya belum ada boleh memakai gambar pengganti. Cara (bawaan): game menampilkan gambar kelas (empat WebP yang sudah ada), lalu emoji bila gagal juga. Saat gambar asli tiba, cukup taruh berkas dengan nama final; tanpa SQL lagi. | Aturan dosen (WA, 3 Nov 2026); cara: bawaan.         |
| KT7 | **Satu anggota ditugaskan khusus mencari gambar** (saran dosen; tim berdelapan). Nama pemegang dicatat di TODO sheet, bukan di repo.                                                                                                                                                 | Saran dosen (WA, 3 Nov 2026).                        |
| KT8 | **Katalog diubah lewat satu file SQL** di `supabase/migrations/`, dengan penjelasan dampak dan "OK" ketua, lalu dijalankan di SQL Editor. **Ikan tidak dihapus**; ikan yang tidak dipakai dinonaktifkan lewat kolom `aktif`.                                                         | `database.md` bagian 3 dan 7 (tanpa DELETE).         |
| KT9 | **Undian jenis tidak berubah:** sama rata di antara ikan aktif dalam kelas yang terundi (`mancing.md` MC6). Peluang kelas dan peluang lepas tetap dari `pengaturan`. Jadi sebaran KT1 menentukan peluang tiap ikan (bagian 4).                                                       | `mancing.md` MC6; `database.md` bagian 4.            |

---

## 3. Katalog sekarang dan yang perlu ditambah

Isi tabel `ikan` per 3 Nov 2026 (hasil query baca-saja): 16 ikan, semuanya aktif, `kode_gambar` masih berupa kunci pendek (misalnya `sisik-pasir`, belum berupa jalur).

| Kelas     | Sekarang | Target | Tambah | Ikan yang sudah ada                                  |
| --------- | -------- | ------ | ------ | ---------------------------------------------------- |
| Common    | 4        | 16     | 12     | Sisik Pasir, Biru Mungil, Ekor Lincah, Si Gelembung  |
| Rare      | 4        | 12     | 8      | Sirip Senja, Mata Zamrud, Ekor Pelangi, Perak Bulan  |
| Epic      | 4        | 8      | 4      | Naga Mungil, Sirip Petir, Pari Kristal, Taring Badai |
| Legendary | 4        | 4      | 0      | Naga Emas, Dewa Air, Ratu Bintang, Raja Gelombang    |
| **Total** | **16**   | **40** | **24** |                                                      |

Aturan nama: unik (kolom `nama` tidak boleh kembar), Bahasa Indonesia atau fantasi, tidak terikat air tawar atau asin. Nama 24 ikan baru **belum diputuskan** (bagian 8).

---

## 4. Dampak sebaran ke peluang

Peluang di `pengaturan`: lepas 15%, kelas Common 60, Rare 25, Epic 12, Legendary 3. Peluang satu ikan tertentu per lemparan = (100% − 15%) × peluang kelas ÷ jumlah ikan di kelas itu. Angka berikut hitungan penulis dari pengaturan, bukan hasil uji.

| Kelas     | Jumlah ikan | Peluang satu ikan per lemparan | Rata-rata lemparan untuk satu ikan tertentu |
| --------- | ----------- | ------------------------------ | ------------------------------------------- |
| Common    | 16          | sekitar 3,2%                   | sekitar 31                                  |
| Rare      | 12          | sekitar 1,8%                   | sekitar 57                                  |
| Epic      | 8           | sekitar 1,3%                   | sekitar 78                                  |
| Legendary | 4           | sekitar 0,64%                  | sekitar 157                                 |

- Umpan pulih 1 per jam, jadi satu Legendary tertentu bisa memakan waktu berhari-hari. Melengkapi seluruh album lebih sulit dibanding sebelumnya.
- Peluang bisa diatur lewat tabel `pengaturan` tanpa mengubah kode, dengan penjelasan dampak dan "OK" ketua (mengubah hasil permainan semua pemain).
- Album menampilkan 40 kotak (dua kolom, jadi 20 baris); layarnya memanjang dan perlu digulir.

---

## 5. Aturan gambar

| Aturan                      | Isi                                                                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lisensi                     | **Cek per gambar, bukan per situs.** Halaman gambar harus menulis CC0 (atau domain publik yang setara). Situs yang memuat lisensi campuran (misalnya svgrepo.com) tidak otomatis aman.         |
| Bukti lisensi               | Simpan tautan sumber, pencari, dan tanggal cek di Google Sheet (tab katalog). Tautan tidak perlu masuk repo. Bila dosen meminta, tim bisa menunjukkan.                                         |
| Tidak boleh                 | Gambar bermerek, karakter berhak cipta, gambar berlisensi selain CC0, dan gambar hasil unduhan yang lisensinya tidak jelas.                                                                    |
| Format dan nama berkas      | WebP transparan. Nama huruf kecil, tanpa spasi, berakhiran `.webp`. Mengikuti KT5.                                                                                                             |
| Ukuran (bawaan)             | Sekitar 40 KB per berkas dan total di bawah 2 MB untuk 40 gambar. Rasio gambar boleh berbeda; tampilan memakai kotak berukuran tetap dengan `object-fit: contain`.                             |
| Penanda kelas (bawaan)      | Tiap kelas memakai warna glow yang sama dengan empat gambar kelas yang sudah ada (abu-abu Common, biru Rare, ungu Epic, oranye Legendary), supaya kelas tetap terbaca meski gambarnya berbeda. |
| Offline                     | Tiap berkas gambar baru wajib ditambahkan ke `BERKAS_DASAR` di `sw.js` (dikerjakan tim, AI memandu), supaya tampil saat offline. Berkas yang belum ada tidak boleh didaftarkan di sana.        |
| Empat gambar kelas yang ada | `sisikpasir.webp`, `birumungil.webp`, `babydragon.webp`, `golddragon.webp` di `public/img/`, bersumber CC0 dan dikonfirmasi tim. Tetap dipakai sebagai gambar cadangan (KT6).                  |

---

## 6. Urutan pekerjaan (untuk TODO sheet, prefix KAT, bawaan)

Langkah ⚠️ butuh penjelasan dampak dan "OK" ketua.

1. **KAT.01** Putuskan 24 nama ikan baru dan kelasnya sesuai bagian 3.
2. **KAT.02** Kumpulkan gambar CC0 untuk 40 ikan (anggota yang ditugaskan, KT7); catat sumber dan lisensi (bagian 5).
3. **KAT.03** Ubah ke WebP, beri nama berkas final, taruh di `public/img/ikan/`, push.
4. **KAT.04** Kode game membaca jalur gambar dari server, dengan cadangan ke gambar kelas lalu emoji (KT6). Hanya tampilan (`tas.js`, `mancing.js`, `style.css`); bisa dipasang lebih dulu karena cadangan membuat tampilan tetap normal sampai tabel diisi.
5. **KAT.05 ⚠️** SQL katalog (KT8): ubah `kode_gambar` 16 ikan yang ada menjadi jalur, dan tambah 24 ikan baru. Satu file utuh dengan query cek baca-saja.
6. **KAT.06** Tambahkan jalur berkas gambar ke `BERKAS_DASAR` di `sw.js` (dikerjakan tim, AI memandu).

Bukti (KAT.05): jumlah ikan aktif per kelas sesuai KT1, semua `kode_gambar` berbentuk jalur yang benar, tidak ada nama kembar. **Jangan menjalankan undian lemparan berulang di production untuk mengecek.**

---

## 7. Aturan yang paling sering terlanggar

| Aturan                                                    | Akibat bila dilanggar                                                                                                |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Menambah ikan lewat Table Editor tanpa file SQL di repo   | Perubahan tidak tercatat dan tidak bisa dilacak.                                                                     |
| Menghapus baris ikan                                      | Melanggar aturan tanpa DELETE; tangkapan pemain terkait bisa rusak.                                                  |
| Memakai gambar yang lisensinya bukan CC0 atau tidak jelas | Melanggar aturan dosen.                                                                                              |
| Nama berkas gambar berhuruf besar atau berspasi           | Tidak muncul di versi online.                                                                                        |
| Mendaftarkan berkas di `sw.js` yang belum ada             | Berkas gagal tersimpan untuk offline, tanpa pesan galat yang jelas.                                                  |
| Nama ikan kembar                                          | SQL gagal (kolom `nama` unik).                                                                                       |
| Mengubah peluang atau menonaktifkan banyak ikan sekaligus | Hasil permainan berubah untuk semua pemain; bila satu kelas tanpa ikan aktif, lemparan mengembalikan `kolam_kosong`. |
| Teks nama ikan dari server lewat `innerHTML`              | Teks bisa menjalankan skrip.                                                                                         |

---

## 8. Dampak dan pembatalan

- Penambahan ikan hanya menambah baris; tidak ada data pemain yang terhapus. Bila ada ikan bermasalah, nonaktifkan lewat `aktif` (tidak dihapus).
- Bagian kode game (KAT.04) hanya tampilan: bila ada glitch, perbaiki berkas dan push ulang.
- Perubahan `kode_gambar` bisa dibalikkan dengan SQL berikutnya; salinan SQL selalu disimpan di `supabase/migrations/` sebelum dijalankan.

---

## 9. Ditunda dan belum diketahui

**Belum diputuskan:**

- Nama dan kelas 24 ikan baru (KAT.01).
- Pemetaan empat gambar kelas yang ada ke ikan tertentu, atau hanya jadi cadangan (bawaan: cadangan).
- Siapa anggota yang mencari gambar (dicatat di sheet, bukan di repo).
- Ukuran maksimal berkas gambar yang diterima (bawaan: sekitar 40 KB).
- Bentuk siluet album untuk ikan yang belum didapat (dikerjakan di VIS.05).

**Ditunda (lihat `bonus.md`):** ikan baru di luar 40, kelas baru, filter dan urutan album.

---

## 10. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_

### Handoff #1 | 2026-11-03 | [nama PIC]

- **Tugas selesai:** sesi strategi katalog ikan (tanpa perubahan data). Satu bagian kode dikirim dan belum dicek, lihat "Belum beres".
- **Berkas yang dibuat atau diubah:**
  - `docs/katalog-ikan.md` (baru): rujukan tunggal untuk jumlah ikan, gambar CC0, dan penambahan katalog.
  - `public/tas.js`, `public/mancing.js`, `public/style.css`: versi gambar per kelas (VIS.04) dikirim, empat gambar WebP pengganti emoji. `public/sw.js`: empat berkas gambar kelas ditambahkan oleh tim.
  - `docs/pemandangan-ikan.md`: blok "Satu nama ikan, satu gambar" ditambahkan dan butir jumlah ikan dipindah ke dokumen ini.
- **Keputusan baru:**
  - Aturan dosen (WA, 3 Nov 2026): saat penilaian minimal 40 gambar ikan untuk 40 nama ikan, semuanya CC0. Selama development, gambar placeholder boleh dipakai. Menggantikan pendekatan satu gambar per kelas.
  - Keputusan ketua (3 Nov 2026): katalog 40 ikan, sebaran Common 16, Rare 12, Epic 8, Legendary 4. Menggantikan "16 ikan" di `mancing.md` dan `tas-jual.md`.
  - Pilihan bawaan penulis, belum ditanyakan ke tim: jalur gambar `public/img/ikan/`, empat gambar kelas lama tetap jadi cadangan, ukuran sekitar 40 KB per berkas. Alasan lain belum tercatat.
- **Pertentangan dengan isi lama:** blok 4 WebP (2 Nov 2026) di `pemandangan-ikan.md` menyebut satu gambar per kelas; sekarang satu gambar per ikan. Yang paling akhir menang. Kode yang terpasang sekarang masih versi per kelas dan berfungsi sebagai cadangan, bukan hasil akhir.
- **Strategi menuju hasil akhir (urutan KAT.01 sampai KAT.06):**
  1. Tim memutuskan 24 nama ikan baru dan mulai mencari 40 gambar CC0 (satu anggota ditugaskan). Dikerjakan paralel.
  2. Kode game diubah supaya gambar diambil dari data ikan, dengan cadangan gambar kelas lalu emoji. Bisa dikerjakan sebelum gambar lengkap karena tampilan tetap normal. Berkas yang disentuh: `tas.js`, `mancing.js`, `style.css`.
  3. Satu SQL utuh untuk isi jalur gambar 16 ikan yang ada dan tambah 24 ikan baru. Tanpa perubahan struktur tabel dan tanpa deploy. Butuh penjelasan dampak dan "OK" ketua.
  4. Berkas gambar didaftarkan bertahap di `sw.js` (dikerjakan tim, AI memandu).
- **Bukti:** query isi tabel ikan (3 Nov 2026) menunjukkan 16 ikan, semuanya aktif, kolom gambar masih berupa kunci pendek, belum jalur. Hasil cek visual gambar per kelas belum dikonfirmasi.
- **Belum beres:**
  1. Cek visual gambar per kelas (kartu hasil, album, popup, cache offline) belum dilaporkan. Setelah lolos, centang VIS.04 di sheet.
  2. Sheet baris KAT.01 sampai KAT.06: urutan harus sama dengan `katalog-ikan.md` bagian 6 (KAT.04 kode game, KAT.05 SQL).
  3. Strategi ini akan dibahas dulu di rapat tim; keputusan rapat belum tercatat.
  4. 24 nama ikan baru, pencari gambar, dan batas waktu belum ditentukan.
- **Saran giliran berikutnya:** (1) catat hasil rapat sebagai blok baru. (2) Kerjakan KAT.04 dengan melampirkan `AGENTS.md`, `katalog-ikan.md`, `tas.js`, `mancing.js`, `style.css`, dan `sw.js` dari repo. (3) Setelah nama final, susun SQL (KAT.05) dengan melampirkan hasil query isi tabel ikan terbaru dan berkas SQL katalog lama. (4) Jangan menjalankan undian lemparan berulang di production.

### Handoff #2 | 2026-11-03 | [RAC]

- **Tugas selesai:** KAT.05, SQL katalog 40 ikan, dijalankan di SQL Editor Supabase setelah "OK" ketua (3 Nov 2026). Isinya: `kode_gambar` 16 ikan lama diganti dari kunci pendek menjadi jalur lengkap, dan 24 ikan baru ditambahkan (12 Common, 8 Rare, 4 Epic). Tanpa perubahan struktur tabel, hak akses, pengaturan, maupun fungsi.
- **Asal pekerjaan:** SQL disusun oleh PIC sebelumnya di sesi lain. Sesi itu berhenti sebelum SQL dijalankan dan handoff-nya belum sempat dibuat, jadi pekerjaan diteruskan oleh PIC ini. Isi SQL dicocokkan dulu dengan bagian 3 dokumen ini dan dengan 40 berkas gambar di `public/img/ikan/` sebelum dijalankan.
- **Berkas yang dibuat atau diubah:**
  - `supabase/migrations/2026-11-03_katalog-ikan-40.sql` (baru): salinan SQL katalog beserta query cek dan skrip pemulihan.
  - Data tabel `ikan` di Supabase: 40 baris, semuanya aktif.
- **Keputusan baru:**
  - Nama dan kelas 24 ikan baru kini final (tercantum di berkas SQL di atas). Menjawab butir "belum diputuskan" di bagian 9. Alasan pemilihan nama belum tercatat.
  - "OK" ketua untuk menjalankan SQL diterima lewat WhatsApp, 3 Nov 2026.
- **Pertentangan dengan isi lama:** bagian 3 menyebut katalog sekarang 16 ikan, `kode_gambar` masih kunci pendek, dan nama 24 ikan baru belum diputuskan. Sejak SQL ini dijalankan, keadaannya 40 ikan dengan jalur lengkap. Yang paling akhir menang.
- **Bukti (hasil query baca-saja, 3 Nov 2026):**
  1. Sebaran ikan aktif: Common 16, Epic 8, Legendary 4, Rare 12 (total 40).
  2. Seluruh katalog: 40 baris, id 1 sampai 40, semua aktif, semua `kode_gambar` berbentuk `img/ikan/nama.webp`.
  3. Jalur yang salah: 0 baris. Nama kembar: 0 baris.
  4. Hak tabel `ikan`: `anon` dan `authenticated` semuanya false; `service_role` hanya select.
     Tidak ada undian lemparan yang dijalankan di production.
- **Belum beres:**
  1. Cek visual di game (album 40 kotak, gambar per ikan tampil, popup, cache offline) belum dilakukan. Cukup visual sanity check dengan akun dummy.
  2. Pastikan berkas SQL di `supabase/migrations/` sudah di-commit dan di-push.
  3. Sheet: centang KAT.05 (tanggal 3 Nov 2026).
  4. Cek visual gambar per kelas dari Handoff #1 (VIS.04) belum tercatat hasilnya.
- **Saran giliran berikutnya:** (1) lakukan cek visual di game; bila ada gambar tidak muncul, periksa nama berkas dan `sw.js` (KAT.06). (2) Bila lolos, kerjakan siluet album untuk ikan yang belum didapat (VIS.05). (3) Jangan menjalankan undian lemparan berulang di production.

### 2026-11-03: Susulan Handoff #2 (KAT.04 dan KAT.05 tayang, cek visual) | [RAC]

Memperbarui butir "Belum beres" di Handoff #2; yang paling akhir menang.

- **KAT.04 baru tayang malam ini.** Kode game versi KAT.04 (`public/tas.js`, `public/mancing.js`, `public/style.css`) ternyata belum ter-push saat SQL dijalankan, sehingga game masih menampilkan gambar kelas. Setelah commit `566ac01` (bersama berkas SQL di `supabase/migrations/`) di-push dan terbit, tiap ikan tampil dengan gambarnya sendiri. Tidak ada perubahan di SQL maupun Edge Function; server sudah mengirim `kode_gambar` sejak TAS.02.
- **Cek visual (akun dummy) lolos:** album menampilkan 40 kotak (ikan yang belum didapat tampil "???" sesuai warna kelas), gambar per ikan tampil di album dan di kartu "Dapat ikan!". Satu lemparan menghasilkan ikan baru (Kilat Samudra, Rare), tersimpan di album dengan jumlah x1.
- **Pelajaran:** SQL katalog dijalankan sebelum kode game terbit, jadi sempat ada selisih antara data dan tampilan. Urutan aman: push kode lebih dulu (cadangan gambar kelas membuat tampilan tetap normal), baru jalankan SQL. Alasan lain belum tercatat.
- **Belum beres (menggantikan daftar di Handoff #2):**
  1. Popup detail ikan belum dicek visual. Tes offline (cache gambar di `sw.js`, KAT.06) belum dicek.
  2. Gambar Pari Kristal dan Perak Bulan kemungkinan tertukar (Pari Kristal tampil sebagai ikan biasa, Perak Bulan sebagai pari). Bila tim setuju, cukup tukar nama dua berkas `.webp` lalu push; tanpa SQL.
  3. Sheet: centang KAT.05 (3 Nov 2026).
