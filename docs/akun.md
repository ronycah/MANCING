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

### Handoff #1 | 2026-11-01 | (isi nama PIC yang berhenti)

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
