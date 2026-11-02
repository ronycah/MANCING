docs/akun-test.md

# Tes Akun — Mancing Santuy (AKN.07)

Kasus uji dan bukti untuk fitur akun (`docs/akun.md`). Tanpa kode dan tanpa isi rahasia. Definisi SEC ada di `docs/security.md` bagian 3.

> **Sesi tes:** 2 Nov 2026, di production, akun dummy `tes1` (email dummy). Persetujuan "OK" ketua untuk mengubah data `tes1` diberikan di sesi dan dibatasi pada tes yang belum pernah dilakukan.
> **Aturan bukti:** keamanan dan data pemain wajib ada bukti (balasan server atau hasil query). Yang hanya tampilan cukup dipercaya. Tes yang sudah lulus dengan bukti di sesi AKN.06 tidak diulang; dirujuk ke handoff.
> **Rujukan:** `docs/akun.md` (Handoff #5 dan #6), `docs/security.md`, `docs/database.md`.

---

## 1. Ringkasan

| Kelompok                           | Hasil                                         |
| :--------------------------------- | :-------------------------------------------- |
| Keamanan server (SEC-01 sampai 04) | Lulus semua, bukti balasan server             |
| Nama (SEC-14)                      | Lulus, bukti balasan server                   |
| Password (SEC-16, SEC-17)          | Lulus                                         |
| Pemulihan umpan dan batas (SEC-10) | Lulus, bukti balasan server dan query         |
| Reset password lewat email         | Lulus di sesi AKN.06, dirujuk (tidak diulang) |
| Belum dites                        | Lihat bagian 4                                |

## 2. Hasil Tes (sesi ini)

| ID / Butir      | Skenario                                                                                               | Hasil yang benar                                   | Hasil sebenarnya (bukti)                                                                                                            | Status |
| :-------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :----- |
| SEC-01          | Panggil fungsi `mancing` tanpa token                                                                   | Ditolak 401                                        | Balasan "Silakan masuk dulu.", kode HTTP 401                                                                                        | Lulus  |
| SEC-02          | Token palsu berbentuk tiga potong; kunci publik dipakai sebagai token                                  | Ditolak 401                                        | Keduanya dibalas "Sesi tidak valid. Silakan masuk lagi.", kode 401                                                                  | Lulus  |
| SEC-03 (baca)   | Baca tabel `pengaturan` dan `pemain` langsung dengan kunci publik                                      | Ditolak, tidak ada data                            | Galat 42501 "permission denied for table", kode 401, tanpa satu baris data                                                          | Lulus  |
| SEC-03 (tulis)  | Ubah dan hapus baris `pemain` langsung dengan kunci publik (ID karangan, nol baris cocok)              | Ditolak                                            | PATCH dan DELETE sama-sama "permission denied for table pemain", kode 401                                                           | Lulus  |
| SEC-04          | Panggil fungsi SQL `status_pemain` dan `simpan_nama_pemain` langsung dengan kunci publik (ID karangan) | Ditolak                                            | Keduanya "permission denied for function", kode 401                                                                                 | Lulus  |
| SEC-14          | Ganti nama: 21 karakter, bersimbol, berisi tag HTML                                                    | Ditolak, nama tidak berubah                        | Ketiganya kode 400 dengan pesan aturan nama; status sebelum dan sesudah identik (nama, umpan, koin sama)                            | Lulus  |
| SEC-16          | Login di versi GitHub Pages                                                                            | Berhasil                                           | Login `tes1` berhasil di alamat GitHub Pages (tampak di bilah alamat). Ganti password yang berhasil dirujuk ke Handoff #6 (AKN.06c) | Lulus  |
| SEC-17          | Ganti password dengan password lama yang salah                                                         | Ditolak, password tidak berubah                    | Pesan "Password lama salah"; sesudah Keluar, Masuk dengan password asli tetap berhasil                                              | Lulus  |
| Pemulihan umpan | Umpan 5, waktu hitung digeser 150 menit lalu                                                           | Umpan 7 (jeda 60 menit per umpan), dari jam server | `status` membalas umpan 7, `umpan_maks` 20, sisa 1745 detik (cocok dengan selisih waktu), kode 200                                  | Lulus  |
| SEC-10 (akun)   | Umpan 15, waktu hitung digeser 10 jam lalu                                                             | Berhenti di batas 20                               | `status` membalas umpan 20 (bukan 25), sisa 0 detik, kode 200                                                                       | Lulus  |

**Data uji:** untuk dua tes terakhir, kolom umpan dan waktu hitung baris `tes1` diubah lewat SQL Editor (dengan "OK" ketua), lalu **dikembalikan** ke nilai awal (umpan 10, waktu hitung 1 Nov 2026 12:17 UTC, koin 0) dan dicek ulang. Akun lain dan tabel lain tidak tersentuh. Token login dibersihkan dari Terminal setelah tes.

## 3. Dirujuk dari Sesi AKN.06 (tidak diulang)

Bukti ada di blok catatan susulan `docs/akun.md` dan `docs/security.md` tanggal 2 Nov 2026, Handoff #5 dan #6.

| Butir                                                                                  | Sumber            |
| :------------------------------------------------------------------------------------- | :---------------- |
| Link pemulihan membuka layar Buat password baru, bukan layar utama                     | Handoff #5        |
| Password kurang dari 8 karakter, dua kolom beda, dan password sama dengan lama ditolak | Handoff #5 dan #6 |
| Setelah reset, password lama ditolak dan password baru berhasil                        | Handoff #5        |
| Link bekas ditolak dengan pesan; tombol Batal tidak meninggalkan sesi                  | Handoff #5        |
| Alamat browser bersih dari token                                                       | Handoff #5        |
| Email reset berbahasa Indonesia masuk Inbox akun Gmail anggota lain                    | Handoff #6        |
| Ganti password yang berhasil (login ulang dengan password lama dulu)                   | Handoff #6        |

## 4. Belum Dites (dicatat jujur)

| Butir                                            | Prioritas | Alasan atau catatan                                                               |
| :----------------------------------------------- | :-------- | :-------------------------------------------------------------------------------- |
| Sesi habis (401) di layar aplikasi               | P1        | Server sudah terbukti membalas 401 (SEC-01, 02); perilaku layar belum dilihat.    |
| Jalur `password.js` gagal termuat                | P2        | Hanya cadangan tampilan; dites sekilas bila sempat.                               |
| Masa berlaku link reset                          | Info      | Dicek di dashboard dengan screenshot.                                             |
| Nilai "Secure password change"                   | Info      | Handoff #1 mencatat mati, Handoff #5 menulis belum dilihat; cek ulang bila perlu. |
| Tes di iPhone                                    | Batasan   | Tidak ada device (`AGENTS.md` bagian 9 butir 7).                                  |
| SEC-15 (cari rahasia di repo dan riwayat commit) | P0        | Bukan cakupan sesi ini; dikerjakan sebelum penilaian.                             |

## 5. Sisa Pekerjaan Setelah Sesi Ini

- Bersihkan 4 akun tes sebelum demo: `tes1`, `tes2` (email dummy), akun tes Gmail tim, dan akun tes Gmail anggota. Menghapus akun butuh penjelasan dampak dan "OK" ketua. Jangan dihapus sebelum semua tes yang memakainya selesai.
- Dari handoff sebelumnya masih berlaku: jawaban dosen soal `_headers`, 2FA GitHub dan Supabase ketua belum aktif, token GitHub classic belum dicek.
