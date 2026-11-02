/docs/mancing.md

# 🎣 mancing.md: Lempar Kail, Umpan, Ikan Lepas, dan Hasil Tangkapan

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Bergantung pada `fondasi.md` dan `akun.md` (pemain dikenali server; tabel `pengaturan` dan `pemain` sudah ada; fungsi `mancing` sudah ada dengan aksi `status` dan `ganti_nama`).
> **Status:** MC1 sampai MC13 disepakati tim (ketua ikut di Zoom, 1 Nov 2026). Butir bertanda **(bawaan)** adalah pilihan penulis yang tidak ditanyakan satu per satu; tim boleh mengubahnya sebelum dikerjakan. Belum ada yang dikerjakan.
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini saja**. Kerjakan langkah di bagian 5. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 9 bila ada kejadian di lapangan.
> **Berkas yang diminta AI di awal sesi** (sebut nama dan alasan sekaligus, jangan menebak isinya): berkas migration terbaru di `supabase/migrations/` (definisi `pengaturan` dan `pemain` yang berlaku), `supabase/functions/mancing/index.ts` (akan ditambah aksi `lempar`), dan berkas JS layar utama bila sudah ada.
> **Tanpa kode dan tanpa isi SQL.**
> **Fitur ini High-Risk (P0):** umpan, hasil, dan data pemain. Tes teliti dan wajib ada bukti (`AGENTS.md` bagian 9).
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Pemain menekan **Lempar Kail**, server memakai 1 umpan lalu menentukan hasilnya (**ikan lepas** atau **ikan dengan kelas tertentu**), dan layar menampilkannya. Ikan yang tertangkap langsung masuk tas/album koleksi.

Semua penentuan ada di server dalam satu langkah atomik. Aplikasi hanya mengirim aksi `lempar`, tanpa angka apa pun.

---

## 2. Keputusan

| No   | Keputusan                                                                                                                                                                                                                                                                                                                                 | Dasar                                               |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| MC1  | **Satu panggilan ke server per lemparan.** Server menentukan hasil sekaligus saat `lempar`. Tap atau animasi gigitan **hanya tampilan** dan tidak mempengaruhi hasil.                                                                                                                                                                     | Keputusan tim 1 Nov 2026 (opsi A).                  |
| MC2  | Satu langkah **atomik** di fungsi SQL: hitung umpan terkini dari jam server → bila 0, tolak → kurangi 1 umpan → undi **lepas atau tidak** → bila tidak lepas, undi **kelas** → undi **jenis ikan** dalam kelas itu → tambah jumlah di tangkapan pemain → kembalikan hasil. Gagal di mana pun membatalkan semuanya (umpan tidak terpakai). | `AGENTS.md` bagian 7; `security.md` aturan 4.       |
| MC3  | **Ikan lepas:** umpan **tetap terpakai**, tidak ada ikan masuk tas, tidak disimpan di mana pun. Layar hanya menulis **"Ikan lepas!"**, tanpa nama ikan dan tanpa penjelasan cara menentukannya.                                                                                                                                           | Keputusan tim 1 Nov 2026.                           |
| MC4  | **Ikan tertangkap** langsung masuk tas/album koleksi. Layar hasil menampilkan: **gambar ikan** (terbuka), **nama**, **kelas** (Common, Rare, Epic, Legendary), dan **jumlah yang dimiliki** setelah tangkapan ini. Detail tas ada di `tas-jual.md`.                                                                                       | Keputusan tim 1 Nov 2026.                           |
| MC5  | **Peluang disimpan di `pengaturan`, bukan di kode:** `peluang_lepas` (awal **15** persen) dan `peluang_common`, `peluang_rare`, `peluang_epic`, `peluang_legendary` (awal **60 / 25 / 12 / 3**, **harus berjumlah 100**; fungsi menolak bila tidak). Peluang kelas hanya berlaku bila ikan tidak lepas.                                   | Keputusan tim 1 Nov 2026; SEC-13.                   |
| MC6  | **Jenis dalam satu kelas dipilih sama rata** di antara ikan yang `aktif`. Awal: **4 jenis per kelas, total 16** (daftar di bagian 4).                                                                                                                                                                                                     | Keputusan tim (4 per kelas); pemerataan: bawaan.    |
| MC7  | **Umpan:** maksimal **20**, pulih **1 per jam**, awal pemain baru **10**. Semua angka dari `pengaturan`. Pemulihan **dihitung saat dibaca** dari selisih jam server dan waktu hitung terakhir, dibatasi `umpan_maks`; tidak ada timer yang jalan terus, dan tetap benar walau game ditutup.                                               | Keputusan tim 1 Nov 2026; `security.md` aturan 6.   |
| MC8  | **Umpan 0:** tombol Lempar Kail nonaktif dan layar menampilkan **perkiraan waktu umpan berikutnya**. Server mengirim sisa waktu saat masuk dan setelah tiap aksi; tidak ada polling.                                                                                                                                                      | `AGENTS.md` bagian 4.                               |
| MC9  | **Jam HP tidak mempengaruhi** jumlah umpan maupun tampilan waktu; semuanya dari jam server.                                                                                                                                                                                                                                               | `security.md` aturan 6; SEC-09.                     |
| MC10 | **Tombol Lempar nonaktif selama menunggu jawaban server** (mencegah ketukan ganda). Pengaman sebenarnya tetap di server (atomik; dua lemparan hampir bersamaan saat umpan 1: hanya satu berhasil, SEC-08).                                                                                                                                | Bawaan.                                             |
| MC11 | **Kegagalan koneksi:** pesan umum ("Gagal terhubung, coba lagi"), tanpa galat mentah. Bila jawaban server hilang di tengah jalan, umpan mungkin sudah terpakai dan ikan sudah masuk tas; pemain memuat ulang untuk melihat keadaan sebenarnya. Tanpa kunci pengulangan (lebih sederhana; batasan diterima).                               | Bawaan.                                             |
| MC12 | Jawaban server berisi status (`ok`, `lepas`, `umpan_habis`, atau `kolam_kosong`), sisa umpan, sisa detik ke umpan berikutnya, dan bila ikan: id, nama, kelas, kode gambar, jumlah dimiliki. **Aplikasi tidak pernah mengirim** id ikan, kelas, umpan, koin, atau hasil. Semua teks dari server lewat `textContent`.                       | `AGENTS.md` bagian 7; `security.md` aturan 2 dan 9. |
| MC13 | **`kolam_kosong`:** bila kelas hasil undian tidak punya satu pun ikan aktif, server membatalkan lemparan dan **umpan tidak terpakai** (atomik). Layar menampilkan pesan umum. Tidak diharapkan terjadi bila katalog awal benar.                                                                                                           | Bawaan.                                             |

---

## 3. Prasyarat

- Dari `akun.md`: pemain dikenali lewat token; tabel `pemain` dan `pengaturan` ada (baris umpan terisi); fungsi `mancing` sudah di-deploy dengan aksi `status` dan `ganti_nama`.

---

## 4. Yang dibuat

**Alur satu lemparan:**

1. Pemain menekan **Lempar Kail** (tombol nonaktif sampai jawaban datang).
2. Aplikasi mengirim aksi `lempar`, tanpa angka apa pun.
3. Server menjalankan satu langkah atomik (MC2) dan membalas.
4. Layar menampilkan animasi singkat, lalu hasil: **"Ikan lepas!"** atau kartu hasil ikan. Jumlah umpan dan hitung mundur diperbarui.

**Katalog awal 16 ikan (nama fantasi, tidak terikat air tawar atau asin):**

| Kelas     | Empat ikan                                           |
| --------- | ---------------------------------------------------- |
| Common    | Sisik Pasir, Biru Mungil, Ekor Lincah, Si Gelembung  |
| Rare      | Sirip Senja, Mata Zamrud, Ekor Pelangi, Perak Bulan  |
| Epic      | Naga Mungil, Sirip Petir, Pari Kristal, Taring Badai |
| Legendary | Naga Emas, Dewa Air, Ratu Bintang, Raja Gelombang    |

Nama bisa diubah lewat katalog di database tanpa ubah kode (misal bila pendekatan gambar berubah, lihat `pemandangan-ikan.md`).

**Komponen:**

| Komponen                         | Isi                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Tabel `ikan`                     | Katalog: id, nama, kelas, kode gambar, aktif. Skema di `database.md`. RLS aktif tanpa policy; `service_role` per tabel tanpa DELETE.    |
| Tabel `tangkapan`                | Ikan milik pemain: akun, ikan, jumlah, kapan pertama kali ditangkap. Satu baris unik per (akun, ikan).                                  |
| Baris peluang di `pengaturan`    | `peluang_lepas` dan empat peluang kelas. Ditambah **tanpa mengubah** baris umpan yang ada.                                              |
| Fungsi SQL `lempar`              | Atomik (MC2), `SECURITY DEFINER`, `search_path` kosong, `EXECUTE` hanya `service_role`. Menolak bila peluang kelas tidak berjumlah 100. |
| Edge Function `mancing` (diubah) | Menambah aksi `lempar`. Token diverifikasi paling awal, tanpa token 401. Aksi lama tidak diubah atau dihapus.                           |
| Layar utama                      | Umpan, hitung mundur, tombol Lempar, layar hasil (MC3, MC4). Versi sederhana dulu; tampilan danau ada di `pemandangan-ikan.md`.         |

---

## 5. Urutan pekerjaan (untuk TODO sheet, prefix MCG)

Langkah ⚠️ butuh penjelasan dampak dan "OK" ketua. Jangan menjalankan undian berulang-ulang di production tanpa perlu.

1. **MCG.01 ⚠️** Migration: tabel `ikan` dan `tangkapan` beserta hak dan RLS, baris peluang di `pengaturan`, isi katalog awal 16 ikan, fungsi `lempar`. Satu paket; SQL disalin ke `supabase/migrations/` dulu, lalu dijalankan di SQL Editor. Bukti: RLS aktif, `anon` dan `authenticated` tanpa hak, fungsi hanya `EXECUTE` untuk `service_role`, jumlah peluang 100.
2. **MCG.02 ⚠️** Edge Function `mancing` ditambah aksi `lempar`. Satu berkas utuh, deploy ulang dengan perintah di `fondasi.md` F11; sebut nama fungsinya.
3. **MCG.03** Layar utama versi sederhana: umpan, hitung mundur, tombol Lempar, layar hasil.
4. **MCG.04** Sesi tes (`mancing-test.md`, dibuat di sesi tes): SEC-05 sampai SEC-13 yang menyangkut lempar, dengan bukti. Sebaran kelas dicek kasar di akhir (misal 100 lemparan sekali jalan), tidak perlu bukti statistik ketat.

---

## 6. Aturan yang paling sering terlanggar

| Aturan                                                                                         | Akibat bila dilanggar                                            |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Aplikasi mengirim umpan, kelas, ikan, koin, atau hasil                                         | Pemain bisa curang lewat devtools (SEC-06).                      |
| Mengundi hasil atau memotong umpan di frontend, atau memecah langkah di Edge Function          | Umpan terpotong tapi hasil hilang, atau bisa dicurangi (SEC-08). |
| Menghitung umpan dari jam HP                                                                   | Pemain mengubah jam untuk mengisi umpan (SEC-09).                |
| Menulis angka peluang, batas umpan, atau jeda pulih mati di kode                               | Angka tidak bisa diubah tanpa ubah kode.                         |
| Ikan lepas tidak memotong umpan, atau disimpan sebagai ikan                                    | Melanggar aturan dosen (SEC-11).                                 |
| Peluang kelas tidak berjumlah 100 dan tidak ditolak                                            | Sebaran hasil salah tanpa disadari (SEC-13).                     |
| Menampilkan nama ikan atau penjelasan saat ikan lepas                                          | Melanggar keputusan tim (MC3).                                   |
| Memasang nama ikan lewat `innerHTML`                                                           | Teks dari server bisa menjalankan skrip.                         |
| Menampilkan galat mentah                                                                       | Membocorkan detail teknis; pemain bingung.                       |
| Mengubah `pemain`, baris umpan di `pengaturan`, atau aksi `status` dan `ganti_nama` tanpa "OK" | Merusak fitur Akun yang sudah jalan.                             |
| Upgrade umpan atau pancing ikut dikerjakan                                                     | Dilarang sampai inti stabil (`AGENTS.md` bagian 1).              |

---

## 7. Dampak dan pembatalan

- **Migration:** hanya menambah tabel, baris pengaturan, dan satu fungsi baru. Tabel dan fungsi yang tidak terpakai boleh dibiarkan. Data akun uji boleh dibersihkan lewat SQL Editor dengan penjelasan dampak dan "OK".
- **Edge Function `mancing`:** bila bermasalah, deploy ulang versi sebelumnya (salinan di repo).
- **Risiko utama:** fungsi `lempar` menyentuh umpan dan data pemain, jadi paling teliti dites (umpan 0, dua lemparan bersamaan, jam HP diubah, batas umpan).
- **Mengubah peluang saat game dipakai** mengubah hasil semua pemain; jelaskan dampaknya dan minta "OK" sebelum mengubah `pengaturan`.

---

## 8. Ditunda dan belum diketahui

**Ditunda (lihat `bonus.md`):** efek khusus Epic dan Legendary, suara, upgrade umpan atau pancing, berat ikan, tap tepat waktu yang mempengaruhi hasil (butuh dua tahap dan keputusan baru), kunci pengulangan lemparan, riwayat lemparan, penjelasan alasan ikan lepas.

**Belum diketahui (dicek, bukan ditebak):**

- Apakah gambar tiap jenis bisa berbeda (script SVG, lihat `pemandangan-ikan.md`). Bila tidak, nama 16 ikan bisa disesuaikan.
- Apakah `peluang_lepas` boleh bernilai 0 atau 100: belum ditentukan; fungsi hanya diwajibkan menolak peluang kelas yang tidak berjumlah 100.

---

## 9. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_

### Handoff #1 | 2026-11-02 | (rac)

**Tugas:** MCG.01 (migration) dan MCG.02 (Edge Function `mancing` aksi `lempar`). Keduanya selesai, tinggal dicentang di sheet.

**File yang diubah:**

- `supabase/migrations/2026-11-02_mancing-ikan-tangkapan.sql` (baru): tabel `ikan` dan `tangkapan`, RLS tanpa policy, 5 baris peluang di `pengaturan`, katalog 16 ikan, fungsi atomik `public.lempar(uuid)`, serta query cek baca-saja (dikomentari) di bagian bawah. Dijalankan manual di SQL Editor.
- `supabase/functions/mancing/index.ts` (diubah): ditambah fungsi `aksiLempar` dan satu `case "lempar"`. 28 baris ditambah, 0 dihapus. Aksi `status` dan `ganti_nama` tidak disentuh. Di-deploy dengan urutan Mac bersama (`--project-ref`).

**Keputusan baru:**

- `service_role` di `ikan` dan `tangkapan` hanya SELECT. Tulis ke `tangkapan` lewat fungsi `lempar` (SECURITY DEFINER), jadi INSERT dan UPDATE langsung tidak diperlukan. Menyimpang dari saran awal (SELECT, INSERT, UPDATE) dan disetujui ketua lewat "OK". Bila `tas-jual` butuh tulis langsung, hak ditambah di migration TAS.
- `lempar` menggeser `umpan_dihitung_pada` maju sebanyak umpan yang sudah pulih, bukan mengisinya `now()`, supaya progres pulih pemain tidak hilang. Bila umpan sudah penuh, hitungan mulai dari `now()`.
- Kunci baris `pemain` (`for update`) selama lemparan, untuk mencegah dua lemparan bersamaan saat umpan 1 (SEC-08).
- `umpan_habis` dan `kolam_kosong` dibalas sebagai status biasa (tidak ada yang ditulis, umpan tidak terpakai), bukan galat. `PEMAIN_TIDAK_ADA` dibalas 400 dengan pesan "Pilih nama tampilan dulu"; galat lain 500 dengan pesan umum, detail hanya di log server.
- `peluang_lepas` ditolak bila di luar 0 sampai 100; peluang kelas wajib berjumlah 100 (menjawab sebagian butir "belum diketahui" di bagian 8). `kode_gambar` berupa slug nama ikan (misal `sisik-pasir`). Keduanya pilihan bawaan penulis, alasan lain belum tercatat.
- **Bentuk jawaban `lempar` (untuk MCG.03):** `{ ok: true, hasil: { status, umpan, umpan_maks, detik_ke_umpan_berikutnya, jam_server, ikan? } }`. Kuncinya `hasil`, bukan `status`. Objek `ikan` (id, nama, kelas, kode_gambar, jumlah_dimiliki) hanya ada bila `status` = `ok`.

**Bukti (semua dari balasan server atau hasil query):**

- RLS aktif di `ikan` dan `tangkapan`.
- `anon` dan `authenticated` tanpa hak apa pun; `service_role` hanya SELECT.
- `EXECUTE` `lempar` hanya `service_role`.
- Jumlah peluang kelas 100; `pengaturan` berisi 8 baris (3 umpan lama utuh + 5 peluang).
- Katalog 4 ikan aktif per kelas (total 16).
- Deploy `mancing` sukses; tanpa token, aksi `lempar` dibalas `401` ("Silakan masuk dulu.") dari fungsi sendiri.

**Masalah yang belum beres:**

1. `lempar` dengan token sah **belum pernah dijalankan**, jadi perilakunya (ikan lepas, sebaran kelas, umpan berkurang, `tangkapan` bertambah, umpan 0, dua lemparan bersamaan, jam HP, batas umpan) belum terbukti. Dites di MCG.04.
2. `status` dan `ganti_nama` setelah deploy belum dites ulang. Cukup dicek lewat game dengan akun dummy di MCG.03.
3. Berkas migration baru belum terverifikasi sudah ter-commit di repo (`git status` saat commit MCG.02 hanya menampilkan `index.ts`). Cek dengan `git log -- supabase/migrations/2026-11-02_mancing-ikan-tangkapan.sql`.
4. Pembersihan token CLI: sempat tampil `[ada]` saat dicek di jendela yang sama dengan tempat token ditempel; kedua jendela lalu

### Handoff #2 | 2026-11-02 | (germano)

**Tugas:** MCG.03 (layar utama sederhana: umpan, hitung mundur, tombol Lempar, layar hasil) dan penambahan `mancing.js` ke cache `sw.js` (disetujui ketua). Keduanya selesai, tinggal dicentang di sheet.

**File yang diubah:**

- `public/mancing.js` (baru): tombol Lempar Kail, hitung mundur, layar hasil. Dipasang lewat `window.MANCING_LEMPAR.pasang(...)`.
- `public/nama.js` (diubah): `panggil()` ditambah cabang untuk jawaban berkunci `hasil`; `tampilUtama` memasang `mancing.js` bila termuat (bila tidak, teks lama "Layar permainan menyusul" tetap tampil). Tidak ada kode lama yang dihapus. Aksi `status` dan `ganti_nama` tidak disentuh.
- `public/index.html` (diubah): ditambah `<script src="mancing.js">` sebelum `nama.js`.
- `public/style.css` (ditambah): bagian `/* ===== Layar lempar kail dan hasil (MCG.03) ===== */` (kartu hasil berwarna per kelas, tombol selebar kartu).
- `public/sw.js` (diubah): satu baris `"mancing.js"` ditambah di `BERKAS_DASAR`. `NAMA_CACHE` tetap `santuy-v1`.

**Keputusan baru:**

- Teks hitung mundur: **"+1 umpan dalam mm:ss"** (saat umpan 0: "Umpan habis. +1 umpan dalam mm:ss"). Teks awal "Umpan berikutnya dalam..." disalahartikan sebagai jeda antar lemparan; padahal tombol Lempar aktif selama umpan masih ada dan hitung mundur hanya jarak ke tambahan 1 umpan.
- Hitung mundur berjalan di browser (`performance.now()`), bukan jam HP, dan tidak memanggil server tiap detik. Server dipanggil (`status`) **sekali** saat hitungan habis; bila gagal, coba lagi tiap 10 detik, maksimal 3 kali, lalu muncul "Umpan belum terbaca. Muat ulang halaman".
- Gambar ikan **sementara**: emoji di lingkaran berwarna sesuai kelas (Common abu-biru, Rare biru, Epic ungu, Legendary emas). Diganti SVG saat `pemandangan-ikan.md` siap.
- Ikan lepas hanya menampilkan "Ikan lepas!" (MC3). `umpan_habis` dan `kolam_kosong` ditampilkan sebagai pesan biasa.

**Bukti dan hasil cek (visual, Low-Risk):**

- Lempar berjalan dengan akun dummy: dapat ikan (Common dan Rare), "Ikan lepas!", umpan berkurang, hitung mundur tidak ter-reset saat lempar atau muat ulang. Aksi `status` mengirim `detik_ke_umpan_berikutnya`.
- `sw.js` (High-Risk): Cache Storage `santuy-v1` berisi `mancing.js`; dengan Network Offline, halaman tetap terbuka dan menampilkan "Butuh internet" (sesuai aturan: login tetap butuh internet).
- Migration `2026-11-02_mancing-ikan-tangkapan.sql` sudah ter-commit (`6d89af9`), menjawab butir 3 Handoff #1.

**Masalah yang belum beres:**

1. Perilaku server `lempar` belum dibuktikan resmi (umpan tetap terpakai saat ikan lepas, sebaran kelas, umpan 0, dua lemparan bersamaan, jam HP diubah, batas umpan). Dites di MCG.04. Hasil visual di atas bukan bukti.
2. `ganti_nama` belum dites ulang setelah deploy (`status` sudah terlihat sehat lewat layar utama).
3. Ruang kosong besar di kartu sebelum ada lemparan (dari `min-height: 150px` di `.hasil-lempar`). Kosmetik; boleh dikecilkan.
4. Tes di iPhone tidak bisa dilakukan (tidak ada device).

**Saran giliran berikutnya:**

- MCG.04: buat `mancing-test.md` dan mulai dari bukti umpan tetap terpakai saat ikan lepas (SEC-11) dan SEC-08 (dua lemparan bersamaan saat umpan 1). Jangan spam lemparan di production; sebaran kelas cukup dicek kasar.
- Sebelum commit: cek `git status`, pastikan blok CSS MCG.03 sudah ada di `style.css` dan tidak ada rahasia ikut.
