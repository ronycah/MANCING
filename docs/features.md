docs/features.md

# Features & UI Modules — Mancing Santuy

Peta besar semua fitur dan modul tampilan game **Mancing Santuy** (PWA). Dibaca sekali di awal sesi untuk orientasi. Detail kerja tiap fitur ada di dokumen fitur masing-masing (satu fitur = satu md + satu md tes, dokumen tes dibuat belakangan di sesi tes).

Status: **(ada)** = sudah diimplementasi, **(rencana)** = sudah diputuskan tapi belum dikerjakan, **(ditunda)** = sengaja belum dikerjakan.

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Semua fitur masih **(rencana)**. Perubahan status dan keputusan baru dari sesi kode dicatat sebagai blok di bagian 10 (append-only), bukan dengan menyunting bagian di atasnya. Struktur data ada di `docs/database.md`, aturan keamanan di `docs/security.md`.

---

## 1. Akun & Login (rencana) → `akun.md`

- Daftar dan login email + password lewat Supabase Auth; **tanpa verifikasi email**.
- Password: huruf dan angka saja, minimal 8 karakter.
- Nama tampilan (3 sampai 20 karakter), boleh sama antar pemain, bisa diganti.
- **Ganti password** (minta password lama). **Lupa password**: reset manual oleh tim (cadangan: daftar ulang dengan email lain). Versi tautan email ditunda.
- Pesan galat Bahasa Indonesia yang aman; teks lewat `textContent`.

## 2. Layar Utama & Pemandangan (rencana) → `pemandangan-ikan.md`

- Satu lokasi: **danau**, gaya **kartun flat**, ringan untuk HP biasa.
- Empat suasana mengikuti **jam WIB dari jam server**: pagi 05–10, siang 10–15, sore 15–18, malam 18–05.
- Menampilkan umpan, hitung mundur, koin, nama tampilan, tombol Lempar Kail.

## 3. Mancing (rencana) → `mancing.md`

- Lempar Kail → server memakai 1 umpan dan menentukan hasil: **ikan lepas** (tulisan "Ikan lepas!") atau **ikan dengan kelas** Common, Rare, Epic, Legendary.
- Semua pemain memakai umpan dan pancing yang **sama**; hasil hanya dari peluang di pengaturan. Ikan lepas tetap memakai umpan.
- Animasi gigitan **hanya tampilan**; hasil ditentukan server saat lempar.
- Ikan tertangkap langsung masuk tas.

## 4. Umpan (rencana) → `mancing.md`

- Maksimal 20, pulih 1 per jam, awal pemain baru 10; semua angka di `pengaturan`.
- Pemulihan dihitung server dari jam server, tetap jalan walau game ditutup.
- Umpan 0: tombol nonaktif dan tampil perkiraan waktu umpan berikutnya.

## 5. Tas Ikan, Jual, dan Koin (rencana) → `tas-jual.md`

- Tas berupa **album koleksi** 16 jenis; yang belum pernah didapat tampil sebagai siluet "???".
- Jual: pilih jenis, lalu **Jual 1** atau **Jual semua jenis ini**. Server menghitung koin dari **harga per kelas** (10 / 30 / 100 / 500).
- Koin di inti belum bisa dipakai membeli apa pun (berfungsi seperti skor).

## 6. Ikan & Rarity (rencana) → `mancing.md`, `pemandangan-ikan.md`

- Katalog di database (`ikan`): **16 ikan fantasi**, 4 per kelas, tidak terikat air tawar atau asin.
- Peluang awal: lepas 15%; Common 60, Rare 25, Epic 12, Legendary 3 (di `pengaturan`).
- Gambar ikan: satu SVG dasar yang diwarnai script (dibuat pihak di luar AI); pendekatan (a) recolor per kelas atau (b) empat gambar berbeda ditentukan setelah tahu kemampuan script.

## 7. Fondasi, Terbit, & PWA (rencana) → `fondasi.md`

- Repo public, GitHub Pages lewat GitHub Actions (menerbitkan `public/`), `manifest.json` dan `sw.js` network first. Nama aplikasi "Mancing Santuy" (pendek "Santuy").
- Offline: file game terbuka, tapi login dan aksi game butuh internet (pesan jelas).
- Semua path relatif terhadap `public/`.

## 8. Bonus (ditunda) → `bonus.md`

Antrean setelah inti stabil, urut: efek Epic/Legendary; papan peringkat, pencapaian, hadiah harian; Cara Main dan Tentang; suara dan musik; upgrade umpan/pancing; berat ikan; lupa password lewat tautan email.

## 9. Aturan Umum Tampilan & Pemeliharaan

- Semua teks dari server dan input pemain lewat `textContent`, bukan `innerHTML`.
- Bahasa UI dan komentar kode: Bahasa Indonesia.
- Teks dan angka yang bisa berubah (pengaturan, daftar ikan) disimpan di database, bukan di kode.
- Fitur yang sudah selesai dites dicatat statusnya lewat blok di bagian 10, bukan dengan menimpa isi bagian di atas.

---

## 10. Catatan Susulan (append-only, hanya di sesi kode)

> Tempel blok baru di bawah garis ini bila ada keputusan baru atau kejadian di lapangan. Format: `### YYYY-MM-DD: topik`. Yang paling akhir menang. Aturan lengkap: `AGENTS.md` bagian 2, aturan 7.

_(belum ada blok)_
