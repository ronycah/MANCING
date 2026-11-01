/docs/fondasi.md

# 🧱 fondasi.md: Repo, Supabase, Terbit Online, dan PWA Dasar

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Dokumen fitur pertama; dokumen fitur lain bergantung pada ini.
> **Status:** F1 sampai F13 disepakati tim (ketua ikut di Zoom, 1 Nov 2026). Dosen (via WA, 1 Nov 2026) menyetujui GitHub Actions dan folder `.github/` (asal folder wajib tetap ada), menyatakan struktur `supabase/` sudah sesuai, dan meminta deploy Edge Function lewat terminal dengan `--no-verify-jwt`. Belum ada yang dikerjakan.
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini saja**. Kerjakan langkah di bagian 5 satu per satu. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 9 bila ada kejadian di lapangan.
> **Berkas yang diminta AI di awal sesi** (sebut nama dan alasan sekaligus, jangan menebak isinya): sesuai langkah yang dikerjakan, yaitu versi terbaru `public/index.html`, `public/config.js`, `public/sw.js`, `public/manifest.json`, atau `.github/workflows/pages.yml`.
> **Tanpa kode dan tanpa isi SQL.** Detail yang sudah ditangani GitHub atau Supabase tidak ditulis ulang.
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Menyiapkan **tempat berdiri** untuk semua fitur lain. Hasil akhir:

1. Repo GitHub (public) dengan struktur folder yang benar.
2. Project Supabase cloud (gratis) siap dipakai, dengan alat terminal (CLI) terpasang di laptop untuk deploy fungsi.
3. Halaman awal "Mancing Santuy" **terbuka online** di alamat GitHub Pages dan otomatis ter-update tiap ada perubahan di repo.
4. Game bisa **dipasang di layar utama HP** (PWA) dan versi baru muncul setelah update.

Belum ada login atau mancing. Halaman awal cukup berisi judul dan teks sederhana.

---

## 2. Keputusan

| No  | Keputusan                                                                                                                                                                                                                                                                                                                | Dasar                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| F1  | **Satu akun GitHub, satu repo public, tanpa branch.** Satu laptop Mac dipakai bersama.                                                                                                                                                                                                                                   | Aturan tugas dan tim.                                                                                     |
| F2  | Struktur folder: `public/` (isi game, termasuk `img/`), `docs/`, `archive/`, `supabase/` (isi `migrations/` dan `functions/`), ditambah `.github/workflows/` untuk penerbitan.                                                                                                                                           | Aturan dosen; `.github/` disetujui dosen 1 Nov 2026.                                                      |
| F3  | **Terbit lewat GitHub Pages dengan GitHub Actions.** Satu berkas `.github/workflows/pages.yml` menerbitkan folder `public/`; di Settings repo, sumber Pages diatur ke "GitHub Actions".                                                                                                                                  | GitHub Pages "dari cabang" hanya bisa root atau `/docs`, bukan `public/`.                                 |
| F4  | Semua path **relatif** terhadap `public/`, tidak diawali `/`. Nama berkas gambar dan kode: **huruf kecil semua, tanpa spasi** (misal `ikan-dasar.svg`).                                                                                                                                                                  | Alamat terbit berbentuk `akun.github.io/repo/`; GitHub Pages membedakan huruf besar dan kecil, Mac tidak. |
| F5  | **Berkas masuk ke GitHub lewat terminal** (cek `git status`, lalu `git add .`, `commit`, `push`). Berkas gambar dan SVG ditaruh langsung di `public/img/` dan ikut di-push bersama berkas lain. Kode dari AI tetap **dicopas dari chat** ke berkas, bukan ditulis langsung di editor.                                    | Keputusan tim 1 Nov 2026.                                                                                 |
| F6  | **Email commit memakai alamat privat bawaan GitHub (noreply)**, bukan email pribadi. Cek `git status` sebelum `git add .` supaya tidak ada berkas rahasia yang ikut.                                                                                                                                                     | Repo public; `security.md` aturan 7.                                                                      |
| F7  | **Supabase cloud, paket gratis**, dibuat di satu akun dari laptop bersama. **Wilayah server: Singapura** (nama persis dicek di dashboard saat memilih; sulit diubah setelah dibuat).                                                                                                                                     | `AGENTS.md` bagian 3; jarak terdekat dari Indonesia.                                                      |
| F8  | `public/config.js` hanya berisi **URL project dan kunci publik (anon/publishable)**. Pustaka Supabase dimuat dari CDN dengan **versi dipatok**, bukan "latest".                                                                                                                                                          | `AGENTS.md` bagian 3 dan 7; `security.md` aturan 7.                                                       |
| F9  | **PWA:** nama aplikasi **"Mancing Santuy"**, nama pendek (di bawah ikon HP) **"Santuy"**. `sw.js` strategi **network first**; hanya menangani berkas game dari domain sendiri (GET); **tidak meng-cache panggilan ke Supabase**.                                                                                         | Arahan dosen; keputusan tim 1 Nov 2026; `security.md` aturan 11.                                          |
| F10 | Alamat GitHub Pages didaftarkan di pengaturan URL Auth Supabase (Site URL dan Redirect URLs) **segera setelah alamat online ada**.                                                                                                                                                                                       | Syarat login di versi online (SEC-16).                                                                    |
| F11 | **Deploy Edge Function lewat terminal:** `supabase functions deploy <nama> --use-api --no-verify-jwt`. Supabase CLI dipasang di Mac; login satu kali memakai **token akses** akun pemilik project. Token itu rahasia: **tidak boleh** di chat, repo, atau md.                                                            | Dosen via WA 1 Nov 2026; `--use-api` supaya tidak butuh Docker.                                           |
| F12 | **Satu environment saja: production.** SQL disalin ke `supabase/migrations/` dulu, dijalankan manual di SQL Editor. Dilarang: Docker, VPS, self-host, setup lokal Supabase, dan **migration CLI** (misal `supabase db push`). Yang diizinkan dari CLI hanya `functions deploy` (F11).                                    | Arahan dosen dan tim.                                                                                     |
| F13 | Folder kosong tidak ikut ke GitHub, jadi `archive/`, `public/img/`, `supabase/migrations/`, dan `supabase/functions/` diberi **berkas kosong `.gitkeep`**. **Rutin membuka game atau dashboard** tiap beberapa hari dan sehari sebelum penilaian (project gratis dijeda otomatis bila sekitar 1 minggu tanpa aktivitas). | Sifat Git; aturan project gratis Supabase.                                                                |

---

## 3. Prasyarat

Dokumen pertama, jadi tanpa prasyarat dari dokumen lain. Yang disiapkan manusia: satu akun GitHub dan satu akun Supabase (boleh login lewat GitHub) dengan email tim, laptop Mac bersama dengan internet, dan komitmen bahwa **email, password, token, dan kunci rahasia tidak ditulis di chat, md, atau repo.**

---

## 4. Yang dibuat

| Komponen                      | Isi                                                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repo GitHub                   | Public; `AGENTS.md` di root; `docs/` berisi md; kerangka folder dengan `.gitkeep` (F2, F13).                                                       |
| `public/index.html`           | Halaman awal "Mancing Santuy": judul dan teks singkat Bahasa Indonesia; memuat `config.js`, pustaka Supabase (versi dipatok), dan `manifest.json`. |
| `public/config.js`            | URL project Supabase dan kunci publik saja (F8).                                                                                                   |
| `public/manifest.json`, ikon  | Nama, nama pendek, warna, ikon (F9). Ikon ditaruh di `public/img/` dan ikut di-push.                                                               |
| `public/sw.js`                | Service worker network first (F9). Berisiko, butuh "OK" ketua.                                                                                     |
| `.github/workflows/pages.yml` | Penerbitan folder `public/` (F3). Berisiko, butuh "OK" ketua.                                                                                      |
| Project Supabase              | Dibuat lewat dashboard; yang dicatat ke repo hanya URL project dan kunci publik.                                                                   |
| Supabase CLI di Mac           | Terpasang dan login (F11), dipakai hanya untuk deploy fungsi.                                                                                      |

**Alur setelah fondasi jadi:** ubah berkas → `git status` → `git add .` → `commit` → `push` → GitHub menerbitkan otomatis (sekitar 1 sampai 2 menit) → buka alamat game → versi terbaru muncul di HP.

---

## 5. Urutan pekerjaan (untuk TODO sheet, prefix FND)

Satu langkah per giliran. Langkah ⚠️ butuh penjelasan dampak dan "OK" ketua (lewat WA/Telegram bila ketua tidak sedang giliran).

1. **FND.01** Repo public, kerangka folder dengan `.gitkeep`, `AGENTS.md` dan md di `docs/`. Atur git di Mac (nama, email noreply, cara masuk ke GitHub) dan push pertama.
2. **FND.02** Project Supabase (wilayah Singapura). Catat **hanya** URL project dan kunci publik.
3. **FND.03** `public/index.html` dan `public/config.js`.
4. **FND.04 ⚠️** `.github/workflows/pages.yml` dan sumber Pages "GitHub Actions". Hasil benar: halaman awal terbuka di alamat GitHub Pages.
5. **FND.05 ⚠️** Daftarkan alamat GitHub Pages di URL Auth Supabase (F10).
6. **FND.06** Pasang Supabase CLI di Mac dan login satu kali (F11). Uji dengan satu perintah baca-saja yang dipandu AI. Token tidak ditempel ke chat.
7. **FND.07 ⚠️** PWA: `manifest.json`, ikon, `sw.js`. Hasil benar: bisa dipasang di HP, update muncul, berkas game terbuka offline (login dan aksi game tetap butuh internet, pesannya jelas).
8. **FND.08** Cek repo bersih dari `service_role`, password, token, dan data pribadi (SEC-15), termasuk riwayat commit.

---

## 6. Aturan yang paling sering terlanggar

| Aturan                                                                                         | Akibat bila dilanggar                                                           |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Path diawali `/` atau nama berkas berhuruf besar/spasi                                         | Gambar dan skrip gagal termuat di versi online, padahal jalan di Mac.           |
| Berkas game di luar `public/`                                                                  | Tidak ikut terbit.                                                              |
| `git add .` tanpa `git status` dulu                                                            | Berkas rahasia atau sampah ikut terunggah ke repo public.                       |
| Menaruh `service_role`, password, token CLI, atau email pribadi di repo, `config.js`, md, chat | Repo public: kunci bocor; harus diganti di Supabase.                            |
| Email commit memakai email pribadi                                                             | Email terlihat di riwayat commit publik.                                        |
| Pustaka CDN tanpa versi dipatok                                                                | Game bisa rusak sendiri saat pustaka diperbarui.                                |
| `sw.js` meng-cache panggilan ke Supabase                                                       | Data pemain bisa tampil usang atau salah.                                       |
| Mengubah `sw.js`, `config.js`, atau `pages.yml` tanpa penjelasan dan "OK"                      | Game tidak terbit atau HP menyimpan versi rusak.                                |
| Memakai Docker, atau migration CLI (misal `supabase db push`)                                  | Dilarang; SQL dijalankan manual di SQL Editor, deploy fungsi pakai `--use-api`. |

---

## 7. Dampak dan pembatalan

- **`pages.yml` salah:** game tidak terbit; tidak ada data hilang. Perbaiki berkasnya, push ulang; versi sebelumnya ada di riwayat GitHub.
- **`sw.js` bermasalah:** HP bisa menyimpan versi lama atau rusak. Kembalikan `sw.js` ke versi sebelumnya; HP yang sudah terpasang mungkin perlu dibuka beberapa kali atau data situsnya dihapus.
- **Wilayah Supabase salah:** sulit diubah; solusinya project baru dan salin ulang `config.js`. Kerugian kecil bila ketahuan sebelum ada data pemain.
- **Kunci atau token rahasia terlanjur masuk repo:** ganti dulu di Supabase (dan buat token akses baru), baru lakukan hal lain, lalu lapor ke ketua. Menghapus berkas dari repo tidak cukup karena riwayat commit tetap menyimpannya.

---

## 8. Ditunda dan belum diketahui

**Ditunda:** README di root, domain sendiri, ikon yang dipoles, notifikasi.

**Belum diketahui (dicek, bukan ditebak):**

- Apakah **Homebrew** atau **Node** sudah ada di Mac tim (menentukan cara memasang Supabase CLI). Dicek di FND.06.
- Nama persis wilayah Singapura di dashboard Supabase. Dicek di FND.02.
- Siapa yang membuat **ikon aplikasi** dan gambarnya seperti apa. Diputuskan sebelum FND.07.
- Aturan paket gratis GitHub Actions dan Supabase terbaru: dicek di situs resmi sebelum final penilaian.

---

## 9. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_

### Handoff #1 | 2026-11-01 | (isi nama PIC yang berhenti)

**Tugas:** FND.01 (repo, kerangka folder, git di Mac) dan FND.02 (project Supabase). Status di sheet: keduanya **Berjalan**, belum Selesai.

**Sudah beres:**

- Git di Mac terpasang (versi 2.39.0).
- Repo GitHub MANCING (public, cabang `main` saja) sudah dibuat dan berisi `AGENTS.md`, folder `docs/`, dan satu berkas uji `todo-kartu.tsv`.
- Project Supabase `mancingpwa` sudah dibuat, wilayah `ap-southeast-1` (Singapura), paket gratis.
- Semua md versi final sudah disalin ke folder MANCING di Mac, **belum di-commit**.

**File yang diubah:** tidak ada yang di-commit. Perubahan baru ada di folder lokal (5 md menimpa yang lama, 5 md baru).

**Keputusan baru:**

- Akun GitHub dan Supabase memakai **akun ketua**, dibuka lewat profil browser khusus supaya tanpa mengetik password.
- Laptop Mac milik keluarga teman tim. **Dilarang** mengubah folder atau pengaturan milik pemilik: jangan jalankan `git config --global ...`, jangan menyentuh folder di luar MANCING.
- Pengaturan email git hanya boleh diubah khusus untuk folder MANCING (tanpa `--global`).

**Masalah yang belum beres (jangan commit dulu):**

1. **Email commit bukan alamat noreply GitHub.** Kedua commit lama di repo public memakai email yang berasal dari pengaturan global Mac. Belum diketahui email siapa. Jangan `git add .`, `commit`, atau `push` sebelum email khusus folder ini diatur.
2. **Alamat repo di Mac memuat teks panjang sebelum `@`** (kemungkinan token akses). Jangan jalankan `git remote -v` atau menempel alamat repo ke chat. Jenis dan masa berlaku token belum dicek.
3. Keputusan **user Mac baru (A)** atau **tetap di user pemilik dengan hati-hati (B)** belum dijawab.
4. **URL project dan kunci publik Supabase** belum dicatat (bagian dari FND.02).
5. **`todo-kartu.tsv`** di repo bukan bagian rancangan; menghapusnya butuh "OK" ketua.
6. 2FA di akun GitHub dan Supabase ketua belum diaktifkan.

**Saran giliran berikutnya (satu langkah per giliran):**

1. Di Terminal, folder MANCING: `git log -1 --format=%ae`. Baca di layar, **jangan ditempel ke chat**. Tanya pemilik Mac atau ketua itu email siapa.
2. Putuskan bersama ketua: terima riwayat apa adanya, atau buat ulang repo (baru 2 commit; menghapus data, butuh "OK" ketua).
3. Atur email noreply khusus folder MANCING (alamatnya ada di GitHub, Settings, Emails). Cek hasilnya tanpa menampilkan email.
4. Cek jenis dan masa berlaku token tanpa menampilkannya.
5. Baru lalu: kerangka folder dengan `.gitkeep`, `git status`, `git add .`, `commit`, `push`. Tutup FND.01.
6. Catat URL project dan kunci publik Supabase (hanya kunci publik). Tutup FND.02.
7. Jalankan FND.03 (`index.html` dan `config.js`).
