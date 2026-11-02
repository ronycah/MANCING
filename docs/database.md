docs/database.md

# Database, RLS & Workflow SQL — Mancing Santuy

Spesifikasi Supabase (Postgres cloud, paket gratis): tabel, aturan akses (RLS), fungsi server, pengaturan, dan cara menjalankan SQL. Dokumen ini **tanpa kode**: hanya apa yang disimpan, aturannya, dan urutannya. SQL aslinya ada di `/supabase/migrations/`.

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Belum ada tabel yang dibuat. Perubahan setelah ini dari sesi kode dicatat sebagai blok di bagian 8 (append-only); bila bertentangan dengan isi di atas, yang paling akhir menang.

---

## 1. Pilihan Teknologi

- **Supabase cloud, paket gratis**, wilayah Singapura. Postgres + Auth + RLS + Edge Functions. Bukan Docker, bukan VPS, bukan self-host.
- **Satu environment: production.** Tidak ada dev/test terpisah (arahan dosen). SQL disimpan dulu di repo sebelum dijalankan.
- Alasan dipilih (dibanding Firebase dan Cloudflare Workers + D1): Firebase gratis tidak punya fungsi server; Cloudflare tidak punya sistem login pemain siap pakai. Supabase punya login dan RLS bawaan, dan logika game bisa ditulis sebagai fungsi database.

## 2. Skema Tabel

Semua tabel di schema `public`, RLS aktif, **tertutup untuk aplikasi** (bagian 3).

| Tabel            | Kolom (isi)                                                                                                                                       | Dibuat di                                                              |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------- |
| **`pengaturan`** | nama dan nilai pengaturan (bagian 4)                                                                                                              | `akun.md` (baris umpan); `mancing.md` (peluang); `tas-jual.md` (harga) |
| **`pemain`**     | satu baris per akun (kunci = ID akun login): nama tampilan, jumlah umpan, waktu terakhir umpan dihitung, koin (awal 0), waktu dibuat              | `akun.md`                                                              |
| **`ikan`**       | katalog: id, nama, kelas (Common/Rare/Epic/Legendary), **kode gambar**, aktif atau tidak. **Tanpa kolom harga** (harga per kelas di `pengaturan`) | `mancing.md`                                                           |
| **`tangkapan`**  | ikan milik pemain: akun, ikan, jumlah, kapan pertama kali ditangkap. Satu baris unik per (akun, ikan); **tidak pernah dihapus**, jumlah bisa 0    | `mancing.md`                                                           |

- Data pribadi tidak disimpan di tabel game. Email hanya ada di Supabase Auth. Nama tampilan boleh sama antar pemain.
- Hasil lemparan yang **lepas** tidak disimpan; efeknya hanya umpan berkurang.
- Baris `tangkapan` yang jumlahnya 0 menjaga jenis ikan tetap "terbuka" di album (`tas-jual.md` TS1, TS6).
- Berat ikan, upgrade, dan papan peringkat **ditunda** (`bonus.md`).

## 3. Aturan Akses (RLS)

Tujuan: pemain tidak bisa melihat atau mengubah data pemain lain, dan tidak bisa mengubah umpan, koin, atau hasil dari sisi HP.

1. RLS **aktif** di semua tabel, **tanpa policy untuk aplikasi**. Kunci publik di HP tidak bisa membaca atau menulis tabel mana pun secara langsung.
2. Semua akses lewat **Edge Function** yang memakai `service_role`, dengan hak per tabel dan **tanpa DELETE**.
3. Edge Function membaca identitas pemain **dari token login di server**, bukan dari isian aplikasi.
4. Fungsi SQL game bersifat `SECURITY DEFINER`, `search_path` kosong, skema `public.` eksplisit, dan `EXECUTE`-nya hanya untuk `service_role` (dicabut dari `anon`, `authenticated`, dan `PUBLIC`).
5. Edge Function di-deploy `--no-verify-jwt`, dan tiap fungsi **memverifikasi token paling awal** (tanpa token atau token tidak valid: 401).

Salinan SQL RLS dan hak akses ada di `/supabase/migrations/`.

## 4. Pengaturan (bukan kode)

Disimpan di `pengaturan`, diubah lewat dashboard dengan penjelasan dampak dan "OK" ketua:

| Nama                                                                  | Arti                        | Nilai awal          | Dibuat di     |
| :-------------------------------------------------------------------- | :-------------------------- | :------------------ | :------------ |
| `umpan_awal`                                                          | Umpan pemain baru           | 10                  | `akun.md`     |
| `umpan_maks`                                                          | Batas umpan                 | 20                  | `akun.md`     |
| `jeda_isi_umpan_menit`                                                | Menit untuk pulih 1 umpan   | 60                  | `akun.md`     |
| `peluang_lepas`                                                       | Peluang ikan lepas (persen) | 15                  | `mancing.md`  |
| `peluang_common`, `peluang_rare`, `peluang_epic`, `peluang_legendary` | Peluang kelas (total 100)   | 60 / 25 / 12 / 3    | `mancing.md`  |
| `harga_common`, `harga_rare`, `harga_epic`, `harga_legendary`         | Harga jual per ekor         | 10 / 30 / 100 / 500 | `tas-jual.md` |

- Peluang kelas harus berjumlah 100; fungsi menolak bila tidak.
- Mengubah pengaturan saat game dipakai orang lain mengubah hasil permainan; jelaskan dampaknya dulu.

## 5. Fungsi Server

Satu Edge Function bernama **`mancing`** dengan banyak aksi, hanya untuk pemain yang login:

| Aksi         | Yang dikerjakan di server                                                                                                                             | Ditambah di                        |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------- |
| `status`     | Hitung umpan terkini; kembalikan umpan, koin, sisa detik ke umpan berikutnya, **jam server**; belakangan juga daftar ikan dan tangkapan pemain        | `akun.md`; diperluas `tas-jual.md` |
| `ganti_nama` | Ubah nama tampilan (3–20 karakter, huruf/angka/spasi/garis bawah); **membuat baris pemain bila belum ada**                                            | `akun.md`                          |
| `lempar`     | Satu langkah atomik: hitung umpan terkini; bila 0, tolak; kurangi 1; undi lepas atau ikan; bila ikan, undi kelas lalu jenis; simpan; kembalikan hasil | `mancing.md`                       |
| `jual`       | Atomik: cek jenis dan jumlah; kurangi ikan; tambah koin (harga kelas × jumlah)                                                                        | `tas-jual.md`                      |

- **Pemulihan umpan dihitung saat dibaca** dari selisih jam server dan waktu hitung terakhir, dibatasi `umpan_maks`. Tidak ada timer yang jalan terus.
- Aplikasi hanya mengirim nama aksi (dan id jenis serta pilihan "satu" atau "semua" untuk jual). **Tidak pernah** mengirim umpan, koin, rarity, atau hasil.
- Tap saat gigitan hanya animasi; hasil ditentukan server saat `lempar`.
- Ganti password memakai fitur Supabase Auth bawaan (dengan login ulang memakai password lama), bukan fungsi buatan sendiri.

## 6. Login & Akun

- Daftar dan login email + password lewat Supabase Auth; "Confirm email" dimatikan. Validasi di game: format email, password huruf/angka minimal 8.
- Pesan galat Bahasa Indonesia yang aman.
- Pengaturan URL Auth (Site URL dan Redirect URLs) berisi alamat GitHub Pages.
- Lupa password: reset manual oleh tim di dashboard (lihat `akun.md` AK8).
- Akun uji memakai email dummy.

## 7. Workflow SQL & Batasan

**Workflow (tanpa migration CLI, tanpa Docker):**

1. AI menulis SQL sebagai **1 file utuh** dan menjelaskan dampaknya.
2. Ketua memberi "OK" untuk perubahan berisiko (lewat WA/Telegram bila tidak sedang giliran).
3. SQL disimpan dulu ke `/supabase/migrations/` dengan nama berurutan (tanggal + topik), lalu di-push.
4. SQL dijalankan manual di **SQL Editor** dari akun pemilik project.
5. Hasil dicek dengan query baca-saja.
6. SQL yang menghapus atau mengubah data wajib dijelaskan dampaknya dan dibuat bisa dipulihkan (hanya ada production).
7. Edge Function di-deploy dari terminal: `supabase functions deploy mancing --use-api --no-verify-jwt`.

**Batasan yang diketahui:**

- **Project gratis dijeda otomatis bila sekitar 1 minggu tanpa aktivitas.** Buka game atau dashboard rutin dan sehari sebelum penilaian. Cek aturan gratis terbaru di situs resmi.
- **Skala:** asumsi maksimal 100 concurrent user, free tier. Panggilan ke server hanya saat aksi.
- **Email Supabase bawaan** hanya mengirim ke anggota tim dan terbatas 2 per jam: tidak dipakai untuk pemain (itu sebabnya lupa password manual).
- Login dan aksi game butuh internet; file game terbuka offline lewat `sw.js` network first.

## 8. Catatan Susulan (append-only, hanya di sesi kode)

> Tempel blok baru di bawah garis ini bila ada perubahan struktur atau kejadian di lapangan. Format: `### YYYY-MM-DD: topik`. Jangan menyunting bagian lain. Yang paling akhir menang.

---

### 2026-11-01: AKN.02 selesai, hak service_role dan fungsi simpan_nama_pemain

- Migration yang dijalankan di SQL Editor: `2026-11-01_akun-pemain-pengaturan.sql` (tabel `pengaturan` dengan baris umpan, tabel `pemain`, RLS tanpa policy, fungsi) dan `2026-11-01_cabut-hak-berlebih.sql` (perbaikan hak).
- Kejadian: Supabase otomatis memberi `service_role` semua hak (termasuk DELETE dan TRUNCATE) pada tabel baru. Migration pertama hanya menambah hak, jadi hak berlebih tetap ada. Terdeteksi lewat query cek, lalu dicabut. Pencegahan: **setiap migration tabel baru (`ikan`, `tangkapan`, dan seterusnya) wajib mencabut semua hak `service_role` lalu memberi ulang hanya yang perlu**, dan dicek dengan query baca-saja.
- Hak akhir `service_role`: `pemain` = SELECT, INSERT, UPDATE; `pengaturan` = SELECT saja (angka diubah lewat dashboard).
- Keputusan baru: satu fungsi SQL `public.simpan_nama_pemain(p_id uuid, p_nama text)` membuat baris pemain bila belum ada (umpan awal dari `pengaturan`, koin 0, waktu hitung = jam server) dan hanya mengganti nama bila baris sudah ada (umpan dan koin tidak tersentuh). Dipakai aksi `ganti_nama` supaya Edge Function tidak menulis ke tabel langsung. Nama dicek lagi di fungsi (3 sampai 20 karakter, huruf, angka, spasi, garis bawah).
- Keputusan baru: `pemain.id` terhubung ke akun login dengan hapus berantai (baris pemain ikut terhapus bila akun dihapus dari dashboard), supaya pembersihan akun dummy tidak macet. Alasan lain belum tercatat.
- Bukti: query cek 1 Nov 2026 menunjukkan RLS aktif di kedua tabel, 0 policy, tidak ada hak untuk `anon` dan `authenticated`, `EXECUTE` fungsi hanya `service_role`, pengaturan 10 / 20 / 60.

### 2026-11-02: TAS.01, jumlah tangkapan boleh 0, harga jual, fungsi jual

- Migration yang dijalankan di SQL Editor: `2026-11-02_tas-jual.sql`.
- Perubahan pada tabel yang sudah ada (disetujui ketua, 2 Nov 2026): aturan `tangkapan.jumlah` dari `> 0` menjadi `>= 0`. Bertentangan dengan SQL `2026-11-02_mancing-ikan-tangkapan.sql` (MCG.01) dan sesuai bagian 2 dokumen ini; yang paling akhir menang. Data lama tidak berubah.
- Ditambah: 4 baris harga di `pengaturan` (10 / 30 / 100 / 500) dan fungsi `public.jual(uuid, bigint, text)`, `SECURITY DEFINER`, `search_path` kosong, `EXECUTE` hanya `service_role`. Menulis ke `tangkapan` dan `pemain` lewat fungsi saja; hak tabel `service_role` tidak diubah (`tangkapan` tetap SELECT saja).
- Bukti: query cek 2 Nov 2026 menunjukkan aturan `CHECK (jumlah >= 0)`, pengaturan lengkap dan baris lama utuh, `EXECUTE` hanya `service_role`, dan hak `ikan` dan `tangkapan` tidak berubah. Perilaku fungsi `jual` baru diuji di TAS.04. Alasan lain belum tercatat.
