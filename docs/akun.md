/docs/akun.md

# 👤 akun.md: Daftar, Login, Nama Tampilan, Ganti dan Lupa Password

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Bergantung pada `fondasi.md` (repo, project Supabase, terbit online, CLI terpasang).
> **Status:** AK1 sampai AK14 disepakati tim (ketua ikut di Zoom, 1 Nov 2026). Butir bertanda **(bawaan)** adalah pilihan penulis yang tidak ditanyakan satu per satu; tim boleh mengubahnya sebelum dikerjakan. Belum ada yang dikerjakan.
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini saja**. Kerjakan langkah di bagian 5. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 9 bila ada kejadian di lapangan.
> **Berkas yang diminta AI di awal sesi** (sebut nama dan alasan sekaligus, jangan menebak isinya): `public/index.html` dan `public/config.js`, berkas migration terbaru di `supabase/migrations/`, `supabase/functions/mancing/index.ts` bila sudah ada, dan berkas JS akun bila sudah ada.
> **Tanpa kode dan tanpa isi SQL.** Detail yang sudah ditangani Supabase Auth (penyimpanan password, token, sesi, format email) tidak ditulis ulang.
> **Fitur ini High-Risk (P0):** login dan data pemain. Tes teliti dan wajib ada bukti (`AGENTS.md` bagian 9).
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Pemain bisa **mendaftar, masuk, memilih dan mengganti nama tampilan, mengganti password, keluar**, dan punya jalan keluar bila **lupa password**. Hasil akhirnya: tiap pemain punya satu baris data game (umpan, koin) yang hanya bisa diubah oleh server.

Fitur ini prasyarat Mancing: tanpa pemain yang dikenali server, tidak ada umpan yang bisa dihitung.

---

## 2. Keputusan

| No   | Keputusan                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Dasar                                                                                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AK1  | **Daftar dan login** memakai email dan password lewat **Supabase Auth**, dipanggil dari game dengan kunci publik. Tidak ada tabel akun buatan sendiri. Email hanya ada di Supabase Auth, tidak disalin ke tabel game.                                                                                                                                                                                                                                                       | `AGENTS.md` bagian 3; `database.md` bagian 2.                                                                                                          |
| AK2  | **Tanpa verifikasi email.** Pengaturan "Confirm email" di dashboard Supabase **dimatikan**, jadi pemain langsung bisa main setelah daftar.                                                                                                                                                                                                                                                                                                                                  | Keputusan tim 1 Nov 2026. Berisiko (login), butuh "OK" ketua.                                                                                          |
| AK3  | **Aturan password:** hanya huruf dan angka, minimal 8 karakter, tanpa syarat kerumitan lain (`zzzzzzzz` boleh). Panjang minimal juga diatur di Supabase Auth; aturan "hanya huruf dan angka" **hanya dicek di game**.                                                                                                                                                                                                                                                       | Keputusan tim 1 Nov 2026. Batasan diterima: yang memanggil Supabase langsung bisa membuat password bersimbol; dampaknya hanya ke akun sendiri.         |
| AK4  | **Nama tampilan** dipilih saat pertama masuk, boleh sama antar pemain, bisa diganti kapan saja lewat server (aksi `ganti_nama`). Aturan: **3 sampai 20 karakter**, hanya huruf, angka, spasi, dan garis bawah; selain itu ditolak. Ditampilkan lewat `textContent`.                                                                                                                                                                                                         | Keputusan tim 1 Nov 2026; `features.md`; SEC-14.                                                                                                       |
| AK5  | **Baris pemain dibuat oleh server** saat nama tampilan pertama disimpan (aksi `ganti_nama` membuat baris bila belum ada). Isi awal: **umpan 10** (dari `pengaturan`), **koin 0**, waktu hitung umpan = jam server saat itu. Satu baris per akun; pembuatan ulang tidak menggandakan.                                                                                                                                                                                        | Keputusan tim 1 Nov 2026. Cara pembuatan baris: bawaan.                                                                                                |
| AK6  | **Identitas selalu dari token login di server.** Fungsi server memverifikasi token paling awal; tanpa token atau token tidak valid dibalas 401. Aplikasi tidak pernah mengirim ID, umpan, atau koin.                                                                                                                                                                                                                                                                        | `security.md` aturan 2 dan 3.                                                                                                                          |
| AK7  | **Ganti password** (pemain yang sudah masuk): pemain mengisi **password lama** dan password baru; aplikasi login ulang dengan password lama dulu, baru mengganti. Tanpa email. Aturan password baru sama dengan AK3.                                                                                                                                                                                                                                                        | Fitur wajib (tim 1 Nov 2026). Login ulang dipilih supaya tidak memicu verifikasi lewat email yang tidak terkirim (AK8). Dicek di sesi tes.             |
| AK8  | **Lupa password: reset manual oleh tim.** Pemain menghubungi tim (kontak dibagikan di luar repo); tim mengatur ulang lewat dashboard Supabase; **password sementara** diberikan lewat WA/Telegram; pemain langsung menggantinya (AK7). Layar login punya tautan "Lupa password?" berisi petunjuk ini, **tanpa nomor atau email di repo**. Bila dashboard tidak punya pilihan atur password langsung: pemain **daftar ulang dengan email lain** (data akun lama tidak ikut). | Keputusan tim 1 Nov 2026: fitur wajib; versi tautan email ditunda karena pengiriman email bawaan Supabase hanya ke anggota tim dan terbatas 2 per jam. |
| AK9  | Ada tombol **Keluar**. Sesi login dikelola Supabase.                                                                                                                                                                                                                                                                                                                                                                                                                        | Kebutuhan dasar akun.                                                                                                                                  |
| AK10 | **Pesan galat aman**, Bahasa Indonesia ("Email atau password salah", "Gagal memuat", "Password minimal 8 karakter, hanya huruf dan angka"). Galat mentah tidak ditampilkan; semua teks lewat `textContent`.                                                                                                                                                                                                                                                                 | `security.md` aturan 9 dan 10.                                                                                                                         |
| AK11 | Tabel `pengaturan` dibuat **di sini**, berisi dulu baris umpan (`umpan_awal` 10, `umpan_maks` 20, `jeda_isi_umpan_menit` 60), karena baris pemain butuh `umpan_awal`. Mancing dan Tas nanti hanya **menambah** baris, tanpa mengubah yang ada.                                                                                                                                                                                                                              | Urutan pekerjaan dirapikan 1 Nov 2026.                                                                                                                 |
| AK12 | Fungsi server utama bernama **`mancing`** (satu fungsi, banyak aksi). Akun memakai `status` dan `ganti_nama`; Mancing menambah `lempar`; Tas menambah `jual` dan memperluas `status`. Di-deploy `supabase functions deploy mancing --use-api --no-verify-jwt`, dengan pengecekan token sendiri (AK6).                                                                                                                                                                       | `database.md` bagian 5; `fondasi.md` F11.                                                                                                              |
| AK13 | Tanpa rate limit khusus selain bawaan Supabase. Email pemain tidak tampil ke pemain lain.                                                                                                                                                                                                                                                                                                                                                                                   | `security.md` bagian 2.                                                                                                                                |
| AK14 | Akun uji memakai **email dummy**. Karena verifikasi email mati (AK2), email dummy cukup untuk daftar dan masuk.                                                                                                                                                                                                                                                                                                                                                             | `AGENTS.md` bagian 9; `security.md` aturan 14.                                                                                                         |

---

## 3. Prasyarat

Dari `fondasi.md`: repo dan terbit online jalan (FND.04), project Supabase dibuat, alamat GitHub Pages terdaftar di URL Auth (FND.05), `config.js` berisi URL dan kunci publik, Supabase CLI terpasang dan login (FND.06).

---

## 4. Yang dibuat

**Alur pemain:**

1. **Pemain baru:** layar Daftar (email, password) → langsung masuk → layar **Pilih nama tampilan** → server membuat baris pemain → layar utama.
2. **Pemain lama:** layar Masuk → game memanggil `status` → layar utama dengan umpan dan koin.
3. **Akun ada tapi baris pemain belum ada** (aplikasi ditutup sebelum memilih nama): setelah masuk, layar Pilih nama muncul lagi.
4. **Menu akun:** Ganti nama, Ganti password (AK7), Keluar.
5. **Lupa password:** tautan di layar Masuk menampilkan petunjuk menghubungi tim (AK8).

**Komponen:**

| Komponen                        | Isi                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Pengaturan Auth di dashboard    | "Confirm email" mati; panjang minimal password 8; cek pengaturan "Secure password change" (bagian 8).            |
| Tabel `pengaturan` dan `pemain` | Skema di `database.md`. RLS aktif tanpa policy; hak `service_role` per tabel, tanpa DELETE.                      |
| Fungsi SQL pembuat pemain       | Atomik: buat baris bila belum ada, isi awal dari `pengaturan`. Pola keamanan fungsi sesuai `AGENTS.md` bagian 7. |
| Edge Function `mancing`         | Versi pertama: aksi `status` dan `ganti_nama`, hanya untuk pemain yang login.                                    |
| Berkas JS dan CSS akun          | Layar Daftar, Masuk, Pilih nama, menu akun. Satu berkas kecil per fitur (di bawah ~300 baris).                   |

---

## 5. Urutan pekerjaan (untuk TODO sheet, prefix AKN)

Langkah ⚠️ butuh penjelasan dampak dan "OK" ketua.

1. **AKN.01 ⚠️** Pengaturan Auth di dashboard (AK2, AK3). Cek juga "Secure password change".
2. **AKN.02 ⚠️** Migration: tabel `pengaturan` (baris umpan) dan `pemain`, hak, RLS, fungsi pembuat pemain. SQL disalin ke `supabase/migrations/` dulu, baru dijalankan.
3. **AKN.03 ⚠️** Edge Function `mancing` versi pertama (`status`, `ganti_nama`), satu berkas utuh, deploy dengan perintah di AK12; sebut nama fungsinya.
4. **AKN.04** Layar Daftar, Masuk, Keluar.
5. **AKN.05** Layar Pilih nama dan Ganti nama.
6. **AKN.06** Ganti password dan tautan "Lupa password?". Di langkah ini AI juga memandu tim melihat menu pengguna di dashboard untuk prosedur reset manual (AK8).
7. **AKN.07** Sesi tes akun (dokumen `akun-test.md` dibuat di sesi tes), memakai 1 sampai 3 akun dummy.

---

## 6. Aturan yang paling sering terlanggar

| Aturan                                                            | Akibat bila dilanggar                                                  |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Mengaktifkan kembali "Confirm email"                              | Pendaftaran macet: email verifikasi tidak terkirim ke pemain biasa.    |
| Ganti password tanpa login ulang dengan password lama             | Supabase bisa meminta verifikasi lewat email yang tidak akan terkirim. |
| Memercayai ID, nama, umpan, atau koin dari kiriman aplikasi       | Pemain bisa menyamar atau menambah umpan (SEC-05, SEC-06).             |
| Menyimpan email atau password di tabel game                       | Data pribadi bocor; password sudah dikelola Supabase.                  |
| Menampilkan galat mentah Supabase                                 | Pemain bingung; bisa membocorkan detail.                               |
| Memasang nama tampilan lewat `innerHTML`                          | Nama berisi tag bisa menjalankan skrip (SEC-14).                       |
| Menulis password sementara di chat AI, repo, atau md              | Repo public: akun pemain bisa diambil alih.                            |
| Menaruh nomor WA atau email tim di repo, `config.js`, atau md     | Data pribadi di repo public (`security.md` aturan 7).                  |
| Tabel tanpa RLS, atau hak diberikan ke `anon` dan `authenticated` | Pemain bisa membaca atau menulis tabel langsung (SEC-03).              |

---

## 7. Dampak dan pembatalan

- **Pengaturan Auth** (AK2, AK3): bisa dikembalikan di dashboard kapan saja; tidak menghapus data.
- **Migration `pengaturan` dan `pemain`:** hanya menambah tabel baru. Bila dibatalkan, tabel dibiarkan tidak terpakai; data akun uji boleh dibersihkan lewat SQL Editor dengan penjelasan dampak dan "OK".
- **Edge Function `mancing`:** bila bermasalah, deploy ulang versi sebelumnya (salinan di repo).
- **Reset manual (AK8):** mengubah password akun pemain dari akun pemilik project; dikerjakan dengan sepengetahuan ketua. Tim tidak bisa membuktikan identitas peminta (batasan diterima; saran: tanyakan nama tampilan dan perkiraan koin).

---

## 8. Ditunda dan belum diketahui

**Ditunda (lihat `bonus.md`):** lupa password lewat tautan email (butuh SMTP sendiri), verifikasi email, ganti email, hapus akun, login lewat Google, rate limit khusus, foto profil.

**Belum diketahui (dicek, bukan ditebak):**

- Apakah dashboard Supabase punya pilihan **atur password baru langsung**. Dicek di AKN.06 dengan screenshot; bila tidak ada, berlaku cadangan AK8.
- Apakah **"Secure password change"** membuat ganti password butuh email. Dicek di AKN.01 dan sesi tes; alur AK7 dibuat untuk menghindarinya.

---

## 9. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_

### Handoff #1 | 2026-11-01 | (miemoe)

**Tugas:** AKN.01 (pengaturan Auth di dashboard Supabase). Selesai, tinggal dicentang di sheet.

**File yang diubah:** tidak ada. Semua dikerjakan di dashboard Supabase (project `mancingpwa`), tidak ada berkas repo yang dibuat atau diubah.

**Hasil (dicek lewat refresh, sudah tersimpan):**

- "Confirm email" **dimatikan** (AK2). "Allow new users to sign up" tetap menyala; "Allow manual linking" dan "Allow anonymous sign-ins" tetap mati.
- "Minimum password length" diubah dari **6 menjadi 8** (AK3). "Password requirements" dibiarkan kosong, sesuai AK3 (tanpa syarat kerumitan).
- "Secure password change" dicek: **mati**, jadi ganti password tidak butuh verifikasi email. Tidak diubah. Alur AK7 (login ulang dengan password lama) tetap dipakai karena "Require current password when updating" juga mati dan pengecekan password lama dilakukan di game.
- "Prevent use of leaked passwords" hanya tersedia di paket Pro; diabaikan.
- Persetujuan "OK" ketua untuk AKN.01 diberikan langsung di tempat (1 Nov 2026).

**Keputusan baru:** tidak ada. Metode pendaftaran tetap signup mandiri dari game (bukan Add user di dashboard); menu Add user hanya dipakai untuk akun dummy tes dan reset manual (AK8, AK14).

**Masalah yang belum beres:**

1. Jawaban dosen soal `_headers` belum ada. Penjelasan ke dosen: GitHub Pages tidak membaca `_headers`; cache ditangani `sw.js` network first, keamanan lewat RLS dan Edge Function. Bila dosen meminta pengaturan header (misal lewat tag `<meta>` di `index.html`), itu keputusan baru dan butuh "OK" ketua.
2. Dari handoff fondasi yang masih berlaku: token GitHub classic belum dicek jenis dan kedaluwarsanya, 2FA GitHub dan Supabase ketua belum aktif, teks "(tes update)" masih di `index.html`, dan pustaka Supabase dari CDN tidak ikut cache saat offline.

**Saran giliran berikutnya (satu langkah per giliran):**

1. Mulai **AKN.02 ⚠️** (migration tabel `pengaturan` dan `pemain`, hak, RLS, fungsi pembuat pemain). Lampirkan `AGENTS.md`, `docs/akun.md`, dan `docs/database.md`. Butuh penjelasan dampak dan "OK" ketua.
2. SQL disalin dulu ke `supabase/migrations/`, baru dijalankan manual di SQL Editor.
3. Sebelum tiap `git add .`, jalankan `git status` dulu.

### 2026-11-01: AKN.03 selesai, fungsi status_pemain dan Edge Function mancing versi pertama

- Migration baru: `supabase/migrations/2026-11-01_status-pemain.sql`, berisi fungsi SQL baca-saja `public.status_pemain(p_id uuid)`. Fungsi ini menghitung umpan terkini dari jam server (`now()`), dibatasi `umpan_maks`, dan mengembalikan nama, umpan, koin, sisa detik ke umpan berikutnya, serta jam server. Bila baris pemain belum ada, hasilnya `ada: false` (supaya layar Pilih nama muncul lagi). `EXECUTE` hanya untuk `service_role`. Alasan fungsi ini dibuat terpisah: waktu hanya boleh dari jam server database.
- Edge Function `mancing` versi pertama di-deploy: `supabase/functions/mancing/index.ts`, aksi `status` dan `ganti_nama`. Token diverifikasi paling awal (401 bila tanpa token atau tidak valid). Pengecualian: permintaan OPTIONS (izin dari browser) dijawab kosong sebelum cek token. `ganti_nama` memanggil `simpan_nama_pemain`, lalu membalas status terbaru.
- Keputusan baru: CORS dibuka `*` karena akses dijaga token Bearer, bukan cookie. Bila nanti dikunci ke alamat GitHub Pages saja, itu keputusan baru. Alasan lain belum tercatat.
- Kejadian: instruksi deploy awal dari AI sempat tidak mengikuti aturan Mac bersama (Handoff #4 `fondasi.md`) karena sesi akun tidak melampirkan `fondasi.md`. Terdeteksi sebelum ada perintah deploy yang dijalankan. Pencegahan: aturan deploy di Mac bersama sudah ditambahkan ke `AGENTS.md` bagian 3.
- Bukti tes (1 Nov 2026, akun dummy `tes1@example.com`): tanpa token, token palsu, dan kunci publik (anon) sebagai token semuanya 401. Dengan token sah: `status` sebelum punya nama = `ada:false`; nama `<b>x</b>` ditolak 400; `ganti_nama` "Penguji Satu" = 200 dengan umpan 10, `umpan_maks` 20, koin 0, sisa 3600 detik; `status` sesudahnya konsisten; aksi `tambah_koin` ditolak 400 ("Aksi tidak dikenal").
- Belum terbukti: pemulihan umpan seiring waktu (butuh menunggu atau mengubah waktu hitung di akun dummy). Dites di AKN.07 dengan penjelasan dampak dan "OK".
- Token akses CLI sudah dibersihkan dari jendela Terminal setelah deploy (dicek `[]`).

### Handoff #2 | 2026-11-01 | (fren)

**Tugas:** AKN.02 (migration tabel, hak, RLS, fungsi) dan AKN.03 (Edge Function `mancing` versi pertama). Keduanya selesai dengan bukti, tinggal dicentang di sheet.

**File yang diubah (semua sudah di-push):**

- `supabase/migrations/2026-11-01_akun-pemain-pengaturan.sql` (baru): tabel `pengaturan` (baris umpan) dan `pemain`, RLS tanpa policy, fungsi `simpan_nama_pemain`.
- `supabase/migrations/2026-11-01_cabut-hak-berlebih.sql` (baru): mencabut hak berlebih `service_role` (DELETE dan lainnya). Hak akhir: `pemain` = SELECT, INSERT, UPDATE; `pengaturan` = SELECT.
- `supabase/migrations/2026-11-01_status-pemain.sql` (baru): fungsi baca-saja `status_pemain`.
- `supabase/functions/mancing/index.ts` (baru): aksi `status` dan `ganti_nama`, sudah di-deploy ke project `mancingpwa`.
- `AGENTS.md` (bagian 3): ditambah aturan deploy di Mac bersama.
- `docs/database.md` dan `docs/akun.md`: blok catatan susulan.

**Keputusan baru:** fungsi `simpan_nama_pemain` (buat pemain dan ganti nama dalam satu fungsi), `pemain.id` terhubung ke akun login dengan hapus berantai, CORS Edge Function dibuka `*` (akses dijaga token Bearer). Rinciannya ada di blok catatan susulan `database.md` dan `akun.md`.

**Hasil:** semua tes lulus dan sudah dicatat di blok catatan susulan: hak dan RLS terbukti lewat query cek, serta tanpa token, token palsu, dan kunci publik semuanya 401. Dengan akun dummy, nama berisi tag ditolak 400, `ganti_nama` dan `status` konsisten (umpan 10, koin 0), dan aksi `tambah_koin` ditolak 400.

**Kejadian di lapangan:** Supabase otomatis memberi `service_role` semua hak di tabel baru, jadi tiap migration tabel baru wajib mencabut hak berlebih dan dicek dengan query baca-saja. Instruksi deploy awal dari AI sempat tidak sesuai aturan Mac bersama karena `fondasi.md` tidak dilampirkan. Terdeteksi sebelum ada perintah yang dijalankan, dan aturannya sudah masuk `AGENTS.md`.

**Masalah yang belum beres:**

1. Pemulihan umpan seiring waktu belum terbukti. Dites di AKN.07 (mengubah waktu hitung akun dummy lewat SQL Editor, butuh penjelasan dampak dan "OK").
2. Akun dummy `tes1@example.com` dan baris pemainnya masih ada, dipakai lagi di AKN.07. Passwordnya tidak ada di repo, chat, atau md; tanyakan ke pembuatnya.
3. Token CLI `mancing-deploy` kedaluwarsa 30 Jan 2027 dan dihapus setelah penilaian. Di jendela Terminal sudah dicek bersih (`[]`).
4. Dari handoff sebelumnya masih berlaku: jawaban dosen soal `_headers`, 2FA GitHub dan Supabase ketua belum aktif, token GitHub classic belum dicek, teks "(tes update)" masih di `index.html`, dan pustaka Supabase dari CDN tidak ikut cache saat offline (kode login harus tahan bila pustakanya tidak ada).

**Saran giliran berikutnya (satu langkah per giliran):**

1. Mulai **AKN.04 ⚠️** (layar Daftar, Masuk, Keluar). Lampirkan `AGENTS.md`, `docs/akun.md`, `public/index.html`, `public/config.js`, dan `public/sw.js`. Butuh "OK" ketua.
2. Berkas JS dan CSS baru wajib didaftarkan di daftar berkas dasar `sw.js` supaya terbuka offline. Mengubah `sw.js` butuh "OK" ketua.
3. Semua teks dari server dan input pemain lewat `textContent`. Pesan galat memakai Bahasa Indonesia tanpa galat mentah.
4. Deploy fungsi (bila ada) mengikuti aturan Mac bersama di `AGENTS.md` bagian 3. Jangan jalankan `supabase login`.
5. Sebelum tiap `git add .`, jalankan `git status` dulu.

### Handoff #3 | 2026-11-01 | (kevin)

**Tugas:** AKN.04 (layar Daftar, Masuk, Keluar). Selesai dengan bukti, tinggal dicentang di sheet.

**File yang diubah (semua perlu di-push bila belum):**

- `public/style.css` (baru): CSS terpusat semua layar, ditulis sendiri tanpa CDN.
- `public/akun.js` (baru): layar Daftar, Masuk, Keluar. Klien Supabase disimpan di `window.MANCING_KLIEN` untuk dipakai fitur berikutnya.
- `public/index.html`: teks "Segera hadir! (tes update)" diganti wadah `#akun`; ditambah `style.css` dan `akun.js`.
- `public/sw.js`: hanya menambah `style.css` dan `akun.js` ke daftar berkas dasar.
- `AGENTS.md` (bagian 3 dan 6) dan `docs/akun.md`: disesuaikan untuk CSS terpusat.

**Keputusan baru:** semua CSS terpusat di satu berkas `public/style.css`, tanpa CDN, atas saran dosen. Menggantikan "satu fitur = satu berkas CSS". Alasan lain belum tercatat. Persetujuan "OK" ketua untuk perubahan ini, `index.html`, dan `sw.js` sudah diberikan di sesi.

**Hasil:** semua tes lulus di production dengan akun dummy `tes2@example.com`: password pendek ditolak di game, daftar langsung masuk, Keluar, password salah ditolak dengan pesan aman, Masuk benar, sesi tersimpan, dan offline menampilkan "Butuh internet" lalu pulih saat internet menyala.

**Masalah yang belum beres:**

1. Jarak kalimat dan tombol di kartu "Butuh internet" terlalu rapat (P2, tampilan saja; bisa dibereskan di `style.css` bersama perubahan CSS berikutnya).
2. Layar sesudah masuk masih sementara ("Kamu sudah masuk"); diganti di AKN.05.
3. Akun dummy `tes1@example.com` dan `tes2@example.com` masih ada. Passwordnya tidak ada di repo, chat, atau md; tanyakan ke pembuatnya.
4. Pemulihan umpan seiring waktu belum terbukti (dites di AKN.07).
5. Dari handoff sebelumnya masih berlaku: jawaban dosen soal `_headers`, 2FA GitHub dan Supabase ketua belum aktif, dan token GitHub classic belum dicek. Pustaka Supabase dari CDN tidak ikut cache offline sudah ditangani (layar "Butuh internet").

**Saran giliran berikutnya (satu langkah per giliran):**

1. Mulai **AKN.05** (Pilih nama dan Ganti nama). Lampirkan `AGENTS.md`, `docs/akun.md`, `public/index.html`, `public/config.js`, `public/sw.js`, `public/style.css`, `public/akun.js`, dan `supabase/functions/mancing/index.ts` (untuk memastikan bentuk kiriman aksi `status` dan `ganti_nama`).
2. Layar Pilih nama menggantikan layar sementara di `akun.js`. Panggil `status` sekali setelah masuk; bila `ada: false`, tampilkan layar Pilih nama (aturan 3 sampai 20 karakter: huruf, angka, spasi, garis bawah). Token login dikirim sebagai Bearer; aplikasi tidak pernah mengirim ID, umpan, atau koin.
3. Berkas JS baru wajib didaftarkan di `sw.js` (butuh "OK" ketua). Semua teks dari server dan input pemain lewat `textContent`, pesan galat Bahasa Indonesia tanpa galat mentah.
4. Sebelum tiap `git add .`, jalankan `git status` dulu.

### Handoff #4 | 2026-11-01 | (baby)

**Tugas:** AKN.05 (layar Pilih nama dan Ganti nama). Selesai dengan bukti tampilan, tinggal dicentang di sheet.

**File yang diubah (semua sudah di-copas; push bila belum):**

- `public/nama.js` (baru): layar Pilih nama, Ganti nama, dan layar utama sederhana (nama, umpan, koin, tombol Ganti nama dan Keluar). Memanggil Edge Function `mancing` (aksi `status` sekali setelah masuk, `ganti_nama` saat simpan) dengan token login sebagai Bearer; aplikasi hanya mengirim nama aksi dan nama.
- `public/akun.js`: `tampilSudahMasuk` sekarang menyerahkan layar sesudah masuk ke `window.MANCING_NAMA.mulai(...)`. Layar sementara "Kamu sudah masuk" tetap ada sebagai cadangan bila `nama.js` tidak termuat. Tidak ada kode lama yang dihapus.
- `public/index.html`: ditambah `<script src="nama.js">` sebelum `akun.js`.
- `public/sw.js`: hanya menambah `nama.js` ke daftar berkas dasar. Versi cache tetap `santuy-v1`.
- `public/style.css`: ditambah `.aksi`, `.statistik`, dan jarak teks/pesan di dalam kartu (sekalian membereskan catatan P2 Handoff #3 soal kartu "Butuh internet").

**Keputusan baru:** fitur nama dibuat di berkas baru `nama.js`, bukan di `akun.js`, supaya `akun.js` tidak melewati ~300 baris. Persetujuan "OK" ketua untuk `index.html` dan `sw.js` diberikan di sesi (1 Nov 2026). Alasan lain belum tercatat.

**Hasil (tes di production, akun dummy `tes2@example.com`):** akun tanpa nama memunculkan layar Pilih nama; nama `ab` dan `<b>x</b>` ditolak dengan pesan aturan nama; nama valid membuka layar utama (umpan 10/20, koin 0); Ganti nama berhasil; refresh dan Keluar lalu Masuk lagi langsung ke layar utama dengan nama tersimpan (sesi tersimpan, tidak diminta nama lagi).

**Masalah yang belum beres:**

1. Belum dites: jalur sesi habis (401), galat internet saat `status`, dan tombol Keluar dari layar Pilih nama. Masuk ke sesi tes AKN.07.
2. PWA di iPhone (ikon layar utama) menyimpan sesi terpisah dari Safari; belum dites di HP.
3. Pemulihan umpan seiring waktu belum terbukti (AKN.07).
4. Akun dummy `tes1` dan `tes2` masih ada; password tidak ada di repo/chat/md, tanyakan ke pembuatnya.
5. Dari handoff sebelumnya masih berlaku: jawaban dosen soal `_headers`, 2FA GitHub dan Supabase ketua belum aktif, dan token GitHub classic belum dicek.

**Saran giliran berikutnya (satu langkah per giliran):**

1. Mulai **AKN.06 ⚠️** (Ganti password dan tautan "Lupa password?"). Lampirkan `AGENTS.md`, `docs/akun.md`, `public/akun.js`, `public/nama.js`, `public/style.css`, dan `public/index.html`. Butuh penjelasan dampak dan "OK" ketua.
2. Tombol Ganti password cocoknya ditaruh di layar utama (`nama.js`) di samping Ganti nama; alurnya login ulang dengan password lama dulu (AK7).
3. Cek di dashboard Supabase (menu pengguna) apakah ada pilihan atur password langsung, minta screenshot (AK8).
4. Bila berkas JS baru ditambah, daftarkan di `sw.js` (butuh "OK" ketua). Sebelum tiap `git add .`, jalankan `git status`.

### 2026-11-02: AK8 diganti, reset password lewat link email

**Keputusan baru (ketua):** menggantikan AK8. Reset manual lewat dashboard tidak mungkin (tidak ada pilihan atur password langsung, dicek lewat screenshot). Diganti reset lewat link email dengan Gmail SMTP tim. Rincian aturan keamanan ada di blok `security.md` tanggal yang sama.

**Alur:** pemain hubungi tim, ketua tekan "Send password recovery" di dashboard, pemain klik link di email, layar **Buat password baru**, lalu masuk dengan password baru. Aturan password baru sama dengan AK3.

**Menggantikan isi lama:** AK8 dan bagian 5 butir 5. Tautan "Lupa password?" di layar Masuk tetap berisi petunjuk menghubungi tim, **tanpa menyebut daftar ulang** dan tanpa nomor atau email di repo. AK2 dan AK13 tetap berlaku.

**Halaman tujuan:** layar baru di `index.html` yang sama (bukan berkas HTML terpisah), ditampilkan saat kejadian pemulihan dari `supabase-js` muncul. Perlu dibuktikan di tes.

**Rencana (⚠️ semua butuh "OK" ketua, urutan usulan, ID sheet ditentukan tim):**

1. Ganti password (AK7): `password.js` baru, tombol di layar utama (`nama.js`), `index.html`, `sw.js`.
2. Dashboard: pasang SMTP Gmail tim, isi Site URL dan Redirect URL dengan alamat GitHub Pages.
3. Layar Buat password baru (pemulihan): `akun.js` menangkap kejadian pemulihan sebelum menampilkan layar utama; layar bisa dipakai bersama `password.js`.
4. Tes di sesi tes (AKN.07): reset penuh dengan akun dummy dan bukti.

**Belum diputuskan:** jumlah dan nama berkas pasti; nama berkas JS menyusul saat dikerjakan.

### 2026-11-02: AKN.06 sebagian, reset password lewat link email

**Keputusan baru (ketua):** reset password memakai link email lewat Gmail SMTP tim, menggantikan AK8 (reset manual oleh tim) dan bagian 5 butir 5. Pemain yang lupa menghubungi tim, ketua menekan "Send password recovery" di dashboard, pemain klik link dan membuat password baru. Teks tautan "Lupa password?" tidak menyebut daftar ulang. Alasan: dashboard tidak punya pilihan atur password langsung; alasan lain belum tercatat. "OK" ketua diberikan di sesi (2 Nov 2026) untuk perubahan login dan `sw.js`.

**Berkas yang berubah:**

- `public/password.js` (baru): layar Buat password baru (dua kolom, aturan AK3, Simpan, Batal). Memakai `updateUser` ke Supabase Auth; pesan galat Bahasa Indonesia.
- `public/akun.js`: alamat dibaca di awal untuk mengenali link pemulihan; link itu membuka layar Buat password baru, bukan layar utama. Bila `password.js` tidak termuat, game keluar dan menampilkan "Gagal memuat". Link kedaluwarsa atau sudah dipakai menampilkan pesan di layar Masuk. Tidak ada kode lama yang dihapus. Sekarang 414 baris (di atas patokan ~300).
- `public/index.html`: ditambah `<script src="password.js">` sebelum `akun.js`.
- `public/sw.js`: hanya menambah `password.js` ke daftar berkas dasar. Versi cache tetap `santuy-v1`.

**Pengaturan dashboard (tanpa kode):** custom SMTP Gmail tim aktif; Site URL dan Redirect URLs sudah berisi alamat GitHub Pages dan tidak diubah.

**Hasil tes di production (akun tes dengan alamat Gmail tim):**

1. Link pemulihan dari email (masuk Inbox) membuka layar Buat password baru.
2. Password kurang dari 8 karakter ditolak dengan pesan aturan.
3. Dua password berbeda ditolak ("Kedua password harus sama").
4. Password valid tersimpan, masuk ke layar utama, alamat di browser bersih dari token.
5. Setelah Keluar: password lama ditolak ("Email atau password salah"), password baru berhasil.
6. Link yang sama dibuka lagi: layar Masuk dengan pesan link kedaluwarsa atau sudah dipakai.
7. Link baru lalu Batal: kembali ke layar Masuk; setelah refresh tetap layar Masuk.
8. Setelah push `sw.js` dan deploy, PWA terbuka normal tanpa galat.

**Masalah yang belum beres:**

1. **Layar Ganti password (AK7, minta password lama) belum dibuat.** AKN.06 belum selesai.
2. Email baru dites ke akun Gmail yang sama dengan pengirim. Belum dites ke Gmail lain (bisa masuk Spam).
3. Nilai setelan "Secure password change" belum dilihat (tes di atas lolos tanpa masalah).
4. Template email masih bahasa Inggris (bisa diterjemahkan di dashboard, tab Templates, tanpa kode).
5. Belum dites di HP/PWA iPhone dan jalur `password.js` gagal termuat.

### Handoff #5 | 2026-11-02 | (Antok)

**Tugas:** AKN.06 sebagian. Reset password lewat link email menggantikan reset manual (AK8). Selesai: AKN.06a (SMTP Gmail tim di dashboard) dan AKN.06b (layar Buat password baru). Belum: 06c, 06d, 06e.

**File yang diubah (sudah di-push, PWA dicek normal tanpa galat):**

- `public/password.js` (baru): layar Buat password baru, dua kolom, aturan AK3, tombol Simpan dan Batal. Direncanakan dipakai juga oleh layar Ganti password (AK7).
- `public/akun.js`: mengenali link pemulihan dari alamat, menampilkan layar Buat password baru (bukan layar utama), pesan link kedaluwarsa di layar Masuk, dan cadangan bila `password.js` tidak termuat. Sekarang 414 baris (di atas patokan ~300).
- `public/index.html`: ditambah `<script src="password.js">` sebelum `akun.js`.
- `public/sw.js`: `password.js` ditambah ke `BERKAS_DASAR`. Versi cache tetap `santuy-v1`.
- Dashboard Supabase (tanpa kode): custom SMTP Gmail tim aktif; Site URL dan Redirect URLs sudah berisi alamat GitHub Pages dan tidak diubah. Batas daftar/masuk 30 per 5 menit per IP tidak diubah. Setelan lain tidak disentuh.

**Keputusan baru:**

- Reset password lewat link email dengan Gmail SMTP tim, ditekan ketua dari dashboard (fase dev: siapa saja yang membuka laptop ketua; setelah fase dev: hanya ketua). Menggantikan AK8 dan butir password sementara. Tidak ada tombol kirim email di game.
- Halaman tujuan link = layar baru di `index.html` yang sama, bukan berkas HTML terpisah.
- Teks "Lupa password?" tidak menyebut daftar ulang.
- Prosedur darurat akun sampah (matikan "Allow new users to sign up" sementara lalu bersihkan) dan penolakan captcha dicatat di blok `security.md`; batas bawaan Supabase tidak diubah.
- Alasan lain belum tercatat.

**Bukti:** tes reset 1 sampai 7 lulus di production dengan screenshot (link membuka layar baru, validasi password, password lama ditolak dan baru berhasil, link bekas ditolak, Batal tidak meninggalkan sesi, alamat browser bersih). Rinciannya ada di blok susulan `akun.md` dan `security.md` tanggal 2 Nov.

**Masalah yang belum beres:**

1. **Tautan "Lupa password?" di layar Masuk belum ada** (AKN.06e). Pemain belum punya petunjuk apa pun di layar Masuk.
2. **Layar Ganti password (AK7, minta password lama) belum dibuat** (AKN.06c). SEC-17 bergantung padanya.
3. Email baru dites ke akun Gmail yang sama dengan pengirim; belum dites ke Gmail lain (bisa masuk Spam) (AKN.06d). Template email masih bahasa Inggris (terjemahan lewat dashboard, tab Templates, tanpa kode).
4. Nilai setelan "Secure password change" belum dilihat. Masa berlaku link belum dicek.
5. Belum dites: PWA di iPhone, dan jalur `password.js` gagal termuat.
6. Akun dummy `tes1` dan `tes2` masih ada; password tidak ada di repo/chat/md, tanyakan ke pembuatnya. Akun tes dengan alamat Gmail tim dibuat di sesi ini dan perlu dibersihkan sebelum demo.
7. Dari handoff sebelumnya masih berlaku: jawaban dosen soal `_headers`, 2FA GitHub dan Supabase ketua belum aktif (disarankan aktif sebelum fase dev selesai), dan token GitHub classic belum dicek.
8. Blok susulan 2 Nov di `AGENTS.md`, `security.md`, dan `akun.md` perlu dipastikan sudah ditempel (cek di bagian akhir tiap berkas).

**Saran giliran berikutnya (satu langkah per giliran):**

1. **AKN.06e ⚠️:** tautan "Lupa password?" di layar Masuk. Lampirkan `AGENTS.md`, `docs/akun.md`, `public/akun.js`, `public/style.css`, dan `public/index.html`. Butuh penjelasan dampak dan "OK" ketua.
2. **AKN.06c ⚠️:** layar Ganti password di layar utama (`nama.js`), memakai `password.js`: login ulang dengan password lama dulu, baru ganti (AK7). Lampirkan juga `nama.js` dan `sw.js`. Butuh "OK" ketua.
3. **AKN.06d:** tes email reset ke Gmail anggota tim lain (dengan izin) dan terjemahkan template email di dashboard.
4. Baru **AKN.07** (sesi tes, termasuk reset via email, SEC-16, SEC-17, PWA iPhone).
5. Sebelum tiap `git add .`, jalankan `git status`. Jangan tulis password atau app password di chat, md, atau repo.

### Handoff #6 | 2026-11-02 | (cocciplaz)

**Tugas:** melanjutkan AKN.06 dari Handoff #5. Selesai dengan bukti: AKN.06c, AKN.06d, dan AKN.06e. Dengan itu seluruh AKN.06 (06a sampai 06e) sudah selesai, tinggal dicentang di sheet.

**File yang diubah (copas dari chat; push bila belum):**

- `public/akun.js`: tautan "Lupa password?" di tab Masuk (bukan di tab Daftar) dan kartu petunjuk dengan tombol "Kembali ke Masuk" (AKN.06e). Tidak ada kode lama yang dihapus. Sekarang sekitar 445 baris (di atas patokan ~300).
- `public/style.css`: ditambah gaya `.tautan` (tombol bertampilan tautan). Gaya lain tidak diubah.
- `public/password.js`: ditambah fungsi `tampilGanti` untuk layar Ganti password (AKN.06c). Layar Buat password baru dari link email tidak diubah.
- `public/nama.js`: tombol "Ganti password" di layar utama, dan pesan "Password berhasil diganti" setelah berhasil.
- `public/sw.js` dan `public/index.html`: tidak berubah (tidak ada berkas baru).
- Dashboard Supabase (tanpa kode): template email Reset Password diterjemahkan ke Bahasa Indonesia (subjek dan isi). Bagian link `{{ .ConfirmationURL }}` dan tag HTML dibiarkan utuh. Teks asli bahasa Inggris disimpan pribadi sebagai cadangan.

**Keputusan baru:**

- Ganti password memakai alur AK7: aplikasi login ulang dengan password lama dulu, baru memanggil `updateUser`. Password lama salah = berhenti, password tidak berubah.
- Isi kartu "Lupa password?": hubungi tim lewat kontak di luar aplikasi, tim mengirim email berisi link, cek juga folder Spam. Tanpa nomor atau email di repo, tanpa menyebut daftar ulang (sesuai keputusan 2 Nov).
- Persetujuan "OK" ketua diberikan di sesi untuk perubahan login (`akun.js`, `nama.js`, `password.js`, `style.css`) dan template email.
- Alasan lain belum tercatat.

**Bukti (tes di production, screenshot):**

- Tautan "Lupa password?" muncul di tab Masuk; kartu petunjuk dan tombol Kembali berfungsi.
- Ganti password: password lama salah ditolak ("Password lama salah") dan login dengan password yang berlaku sesudahnya tetap berhasil (SEC-17); kurang dari 8 karakter, dua kolom tidak sama, dan password baru sama dengan lama masing-masing ditolak; password valid berhasil, password lama ditolak saat Masuk, password baru diterima.
- Email reset dengan template baru masuk **Inbox** di Gmail tim dan di Gmail anggota lain (bukan pengirim), pengirim "Mancing Santuy App", isi Bahasa Indonesia, tautan ada.

**Masalah yang belum beres:**

1. Jalur `password.js` gagal termuat belum dites. Masuk sesi tes AKN.07.
2. Pengetesan di iPhone tidak bisa dilakukan (tidak ada device, `AGENTS.md` bagian 9 butir 7); dicatat sebagai batasan.
3. Masa berlaku link reset belum dicek. Setelan "Secure password change" tercatat mati di Handoff #1 (1 Nov); Handoff #5 menulis belum dilihat, jadi cek ulang bila perlu.
4. Ada 4 akun tes yang perlu dibersihkan sebelum demo: `tes1` dan `tes2` (email dummy), akun tes Gmail tim, dan akun tes Gmail anggota. Jangan tulis alamat atau password di repo. Password `tes1` dan `tes2` tidak ada di repo/chat/md, tanyakan ke pembuatnya. Menghapus akun butuh penjelasan dampak dan "OK" ketua. Jangan dihapus sebelum AKN.07 selesai.
5. Dari handoff sebelumnya masih berlaku: jawaban dosen soal `_headers`, 2FA GitHub dan Supabase ketua belum aktif, token GitHub classic belum dicek, dan pemulihan umpan seiring waktu belum terbukti (AKN.07).

**Saran giliran berikutnya (satu langkah per giliran):**

1. **AKN.07:** sesi tes akun (buat `akun-test.md` di sesi tes), 1 sampai 3 akun dummy. Cakupan: reset via email, SEC-01 sampai SEC-04, SEC-14, SEC-16, SEC-17, jalur `password.js` gagal termuat, sesi habis (401), dan pemulihan umpan (mengubah waktu hitung akun dummy lewat SQL Editor butuh penjelasan dampak dan "OK" ketua). Lampirkan `AGENTS.md`, `docs/akun.md`, `docs/security.md`, dan berkas JS bila perlu.
2. Setelah AKN.07, bersihkan 4 akun tes dengan "OK" ketua.
3. Sebelum tiap `git add .`, jalankan `git status`. Jangan tulis password atau app password di chat, md, atau repo.
