docs/database.md

# Database, RLS & Workflow SQL — Game Mancing

Spesifikasi Supabase (Postgres cloud, paket gratis): tabel, aturan akses (RLS), fungsi server, pengaturan, dan cara menjalankan SQL. Dokumen ini **tanpa kode**: hanya apa yang disimpan, aturannya, dan urutannya. SQL aslinya ada di `/supabase/migrations/`.

> **Status:** kerangka awal (USULAN). Bagian bertanda **[FINAL?]** dikunci setelah sesi strategi. Catatan susulan ditempel **append-only di bagian 8**; bila bertentangan dengan isi di atas, yang paling akhir menang.

---

## 1. Pilihan Teknologi

- **Supabase cloud, paket gratis.** Postgres + Auth + RLS + Edge Functions. Bukan Docker, bukan VPS, bukan self-host.
- **Satu environment: production.** Tidak ada dev/test terpisah (arahan dosen). Karena itu SQL disimpan dulu di repo sebelum dijalankan.
- Alasan dipilih (bandingan Firebase dan Cloudflare Workers + D1): Firebase gratis tidak punya fungsi server; Cloudflare tidak punya sistem login pemain siap pakai, jadi login harus dibuat sendiri. Supabase punya login dan RLS bawaan, dan logika game bisa ditulis sebagai fungsi database.

## 2. Skema Tabel (usulan **[FINAL?]**)

Semua tabel ada di schema `public`, RLS aktif, **tertutup untuk aplikasi** (bagian 3).

| Tabel            | Isi                                                                                                           |
| :--------------- | :------------------------------------------------------------------------------------------------------------ |
| **`pengaturan`** | Pasangan nama dan nilai yang bisa diatur tanpa ubah kode (bagian 4)                                           |
| **`ikan`**       | Katalog ikan: id, nama, rarity (Common/Rare/Epic/Legendary), harga jual, aktif atau tidak                     |
| **`pemain`**     | Satu baris per akun (kunci = ID akun login): nama tampilan, jumlah umpan, waktu terakhir umpan dihitung, koin |
| **`tangkapan`**  | Ikan yang dimiliki pemain: akun, ikan, jumlah, kapan pertama kali ditangkap                                   |

- Data pribadi tidak disimpan di tabel game. Email hanya ada di Supabase Auth. Nama tampilan bebas, boleh sama antar pemain.
- Hasil lemparan yang **lepas** tidak disimpan sebagai ikan; efeknya hanya umpan berkurang.
- Fishdex (koleksi) dan upgrade pancing **ditunda** (fitur belakangan); `tangkapan` sudah mencatat kapan pertama kali ikan didapat supaya Fishdex nanti tidak perlu ubah struktur.

## 3. Aturan Akses (RLS)

Tujuan: pemain tidak bisa melihat atau mengubah data pemain lain, dan tidak bisa mengubah umpan, koin, atau hasil tangkapan dari sisi HP.

**Aturan dalam bahasa biasa:**

1. RLS **aktif** di semua tabel, dan **tanpa policy untuk aplikasi**. Artinya kunci publik di HP tidak bisa membaca atau menulis tabel mana pun secara langsung.
2. Semua akses lewat **Edge Function** yang memakai `service_role`, dengan hak per tabel dan **tanpa DELETE**.
3. Edge Function membaca identitas pemain **dari token login di server**, bukan dari isian aplikasi.
4. Fungsi SQL game bersifat `SECURITY DEFINER`, `search_path` kosong, dan `EXECUTE`-nya hanya untuk `service_role` (dicabut dari `anon`, `authenticated`, dan `PUBLIC`).
5. Edge Function **di-deploy `--no-verify-jwt`**, dan tiap fungsi **memverifikasi token paling awal** (tanpa token atau token tidak valid: 401).

**Di mana dicatat:** salinan SQL RLS dan hak akses ada di `/supabase/migrations/`. Setiap perubahan dicatat di bagian 8 dan wajib "OK" ketua.

## 4. Pengaturan (bukan kode)

Disimpan di `pengaturan`, diubah lewat dashboard dengan penjelasan dampak dan "OK":

| Nama                                                                  | Arti                       | Nilai awal usulan                       |
| :-------------------------------------------------------------------- | :------------------------- | :-------------------------------------- |
| `jeda_isi_umpan_menit`                                                | Menit untuk pulih 1 umpan  | 60 (boleh dipercepat saat pengembangan) |
| `umpan_maks`                                                          | Batas umpan                | 20                                      |
| `umpan_awal`                                                          | Umpan pemain baru          | **[FINAL?]**                            |
| `peluang_common`, `peluang_rare`, `peluang_epic`, `peluang_legendary` | Peluang rarity (total 100) | 60 / 25 / 12 / 3                        |
| `peluang_lepas`                                                       | Peluang ikan lepas         | 10 sampai 20 persen **[FINAL?]**        |

- Peluang rarity harus berjumlah 100; fungsi menolak bila tidak.
- Mengubah pengaturan saat game dipakai orang lain bisa mengubah hasil permainan; jelaskan dampaknya dulu.

## 5. Fungsi Server (usulan)

Satu Edge Function utama (nama **[FINAL?]**, misal `mancing`) dengan aksi, hanya untuk pemain yang login:

| Aksi         | Yang dikerjakan di server                                                                                                                                         |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`     | Hitung umpan terkini, kembalikan umpan, koin, isi tas, dan **jam server** (untuk tampilan WIB)                                                                    |
| `lempar`     | Satu langkah atomik: hitung umpan terkini; bila 0, tolak; kurangi 1 umpan; undi lepas atau ikan; bila ikan, undi rarity lalu ikan; simpan hasil; kembalikan hasil |
| `jual`       | Jual ikan dari tas: kurangi ikan, tambah koin (jumlah dihitung server dari harga di katalog)                                                                      |
| `ganti_nama` | Ubah nama tampilan (validasi panjang dan karakter)                                                                                                                |

- **Pemulihan umpan dihitung saat dibaca** dari selisih jam server dan waktu terakhir hitung, dibatasi `umpan_maks`. Tidak ada timer yang jalan terus, jadi hemat dan tetap benar walau game ditutup.
- Aplikasi hanya mengirim nama aksi (dan id ikan untuk jual). Tidak pernah mengirim umpan, koin, rarity, atau hasil.
- **Tap saat gigitan [FINAL?]:** usulan, server menentukan hasil sekaligus saat `lempar`, sedangkan animasi gigitan hanya tampilan. Bila tim ingin tap tepat waktu mempengaruhi hasil, itu butuh langkah dua tahap dan keputusan baru.
- Ganti password memakai fitur Supabase Auth bawaan, bukan fungsi buatan sendiri.

## 6. Login & Akun

- Daftar dan login email + password lewat Supabase Auth. Validasi dasar di game: format email dan panjang password.
- Pesan galat dalam Bahasa Indonesia yang aman.
- Pengaturan URL Auth (Site URL dan Redirect URLs) harus berisi alamat GitHub Pages.
- Akun testing memakai email dummy.

## 7. Workflow SQL & Batasan

**Workflow (tanpa CLI, tanpa Docker):**

1. AI menulis SQL sebagai **1 file utuh** dan menjelaskan dampaknya.
2. Ketua memberi "OK" untuk perubahan berisiko.
3. SQL disimpan dulu ke `/supabase/migrations/` dengan nama berurutan (tanggal + topik).
4. SQL dijalankan manual di **SQL Editor** dari akun pemilik project.
5. Hasil dicek dengan query baca-saja, lalu dicatat di bagian 8.
6. Karena hanya ada production, SQL yang menghapus atau mengubah data wajib dijelaskan dampaknya dan dibuat bisa dipulihkan.

**Batasan yang diketahui:**

- **Project gratis dijeda otomatis bila sekitar 1 minggu tanpa aktivitas.** Buka game atau dashboard rutin, dan sehari sebelum penilaian. Cek aturan gratis terbaru di situs resmi.
- **Skala:** asumsi maksimal 100 concurrent user, free tier. Panggilan ke server hanya saat aksi.
- Login dan aksi game butuh internet; file game tetap bisa dibuka offline lewat `sw.js` network first.
- Struktur di bagian 2 bisa berubah; perubahan dicatat di bagian 8.

## 8. Catatan Susulan (append-only)

> Tempel blok baru di bawah garis ini. Format: `### YYYY-MM-DD: topik`. Jangan menyunting bagian lain. Yang paling akhir menang.

---
