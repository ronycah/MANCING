docs/tas-jual-test.md

# Tes Tas & Jual — Mancing Santuy (TAS.04)

Kasus uji dan bukti untuk fitur tas dan jual (`docs/tas-jual.md`). Tanpa kode dan tanpa isi rahasia. Definisi SEC ada di `docs/security.md` bagian 3.

> **Sesi tes:** 2 Nov 2026, di production, akun dummy `tes1` (Penguji Satu) dan `tes2` (Penguji Dua ganti). Tes dijalankan dari Console browser laptop (Brave) dengan alat uji sementara yang hanya mencetak kode HTTP dan balasan server. **Tidak ada SQL yang mengubah data dan tidak ada perubahan pengaturan**, jadi tidak ada "OK" ketua yang diperlukan di sesi ini; semua perubahan data berasal dari aksi `jual` biasa pada akun dummy.
> **Aturan bukti:** keamanan dan data pemain wajib ada bukti (balasan server atau hasil query). Atas arahan dosen, tangkapan layar tidak disimpan sebagai berkas; bukti berasal dari pengamatan yang ditempel di sesi chat dan dicatat di sini.
> **Rujukan:** `docs/tas-jual.md` (Handoff #1 dan #2), `docs/security.md`, `docs/mancing-test.md`. Jam server dalam UTC.

---

## 1. Ringkasan

| Kelompok                                     | Hasil                                                          |
| :------------------------------------------- | :------------------------------------------------------------- |
| Jual ditolak (SEC-12)                        | Lulus, 13 kasus ditolak, data tidak berubah (query dan status) |
| Data palsu dari aplikasi (SEC-06)            | Lulus, bukti balasan server dan query database                 |
| Jual semua, album dan koin (SEC-18)          | Lulus, bukti tampilan dan query database                       |
| Dua jual bersamaan (atomik)                  | Lulus, bukti balasan server dan query database                 |
| Isolasi antar akun (SEC-05)                  | Lulus, bukti query database                                    |
| Tanpa token dan token palsu (SEC-01, SEC-02) | Lulus untuk aksi `jual`, bukti balasan server                  |
| Akses langsung database (SEC-03, SEC-04)     | Lulus, ditolak `permission denied`                             |
| Tampilan album dan koin                      | Lulus, cek visual                                              |
| Belum dites                                  | Lihat bagian 5                                                 |

## 2. Hasil Tes (sesi ini)

Kondisi awal `tes1` (query SQL baca-saja dan aksi `status`): koin 940, 13 baris tangkapan, album 16 entri. Stok: id 1 = 15, 2 = 7, 3 = 16, 4 = 13, 5 = 6, 6 = 0, 7 = 3, 8 = 6, 9 = 3, 10 sampai 12 = 0, 13 = 1; id 14 sampai 16 terkunci. `tes2`: koin 0, umpan 19, waktu hitung 05:15:16.971433, Perak Bulan 1.

| ID       | Skenario                                                                                                                                                          | Hasil yang benar                                                           | Hasil sebenarnya (bukti)                                                                                                                                                                                                                                                      | Status |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| SEC-12   | `jual` jenis tidak dimiliki (id 14 satu, id 15 semua), stok 0 (id 6 satu, id 10 semua), id 9999                                                                   | Ditolak, data tidak berubah                                                | Kelima kasus `KODE 400`, pesan umum "Ikan ini tidak bisa dijual. Muat ulang tas lalu coba lagi." Aksi `status` sesudahnya: koin tetap 940, semua stok sama dengan kondisi awal, id 14 sampai 16 tetap terkunci.                                                               | Lulus  |
| SEC-12   | `jual` dengan kiriman ngawur: id 0, -1, 1.5, teks `"3"`, tanpa id, pilihan `banyak`, `SEMUA`, tanpa pilihan                                                       | Ditolak, data tidak berubah                                                | Kedelapan kasus `KODE 400`, pesan umum "Permintaan tidak dikenal." Tanpa galat mentah. Data tidak berubah (pembuktian sama dengan baris di atas).                                                                                                                             | Lulus  |
| SEC-06   | `jual` Ekor Lincah (id 3) satu, dengan isi permintaan disusupi `koin: 9999`, `harga: 99999`, `kelas: legendary`, `rarity: legendary`, `jumlah: 50`, `hasil` palsu | Semua diabaikan, harga dari `pengaturan`                                   | `KODE 200`, `terjual` 1 (bukan 50), `koin_didapat` 10 (bukan 99999), `jumlah_sisa` 15, `koin` 950 (bukan 9999). Query database: koin 950, Ekor Lincah 15.                                                                                                                     | Lulus  |
| SEC-18   | "Jual semua jenis ini" lewat tombol di layar untuk Biru Mungil (id 2, Common) ×7, lalu cek album dan koin                                                         | Jumlah 0, jenis tetap terbuka, koin = harga kelas × jumlah                 | Layar: "Terjual 7 ekor. Koin +70", koin 950 menjadi 1020, Biru Mungil x0 pudar tapi tetap bernama, tombol jual mati. Query database: koin 1020, Biru Mungil jumlah 0 dengan baris tetap ada, jumlah baris tangkapan tetap 13 (tidak ada yang terhapus), Ekor Lincah tetap 15. | Lulus  |
| Atomik   | Dua `jual` Naga Emas (id 13, Legendary) satu, dikirim serentak saat stok tinggal 1                                                                                | Hanya satu berhasil, stok tidak negatif, koin naik sekali                  | Satu `KODE 200` (`terjual` 1, `koin_didapat` 500, `jumlah_sisa` 0, `koin` 1520) dan satu `KODE 400`. Query database: koin 1520 (bukan 2020), Naga Emas jumlah 0.                                                                                                              | Lulus  |
| SEC-05   | `tes1` menjual berkali-kali, data `tes2` dicek                                                                                                                    | Data `tes2` tidak berubah                                                  | Query database sesudah semua penjualan: `tes2` koin 0, umpan 19, waktu hitung 05:15:16.971433, Perak Bulan 1, identik dengan kondisi awal.                                                                                                                                    | Lulus  |
| SEC-01   | `jual` tanpa header Authorization                                                                                                                                 | Ditolak 401                                                                | `KODE 401`, "Silakan masuk dulu."                                                                                                                                                                                                                                             | Lulus  |
| SEC-02   | `jual` dengan token palsu, dan dengan kunci publik dipakai sebagai token                                                                                          | Ditolak 401                                                                | Keduanya `KODE 401`, "Sesi tidak valid. Silakan masuk lagi." (Kasus ini memakai id jenis yang tidak dimiliki, jadi tidak ada data yang bisa bergeser bila penjagaan bolong.)                                                                                                  | Lulus  |
| SEC-04   | Panggil fungsi SQL `jual` langsung memakai kunci publik lewat jalur REST                                                                                          | Ditolak                                                                    | `KODE 401`, kode 42501, "permission denied for function jual".                                                                                                                                                                                                                | Lulus  |
| SEC-03   | Baca tabel `pemain`, `tangkapan`, `pengaturan` langsung memakai kunci publik                                                                                      | Ditolak atau kosong                                                        | Ketiganya `KODE 401`, kode 42501, "permission denied for table ...". Tidak ada baris data yang bocor.                                                                                                                                                                         | Lulus  |
| Tampilan | Layar utama dan layar Tas setelah semua penjualan (cek visual, Low-Risk)                                                                                          | Koin sama di kedua layar, jenis habis tetap terbuka, siluet tetap terkunci | Koin 1520 di layar utama dan layar Tas. Biru Mungil, Mata Zamrud, Sirip Petir, Pari Kristal, Taring Badai, dan Naga Emas tampil pudar x0 dengan nama. Tiga kotak (id 14 sampai 16) tetap siluet "???". Tidak ada pesan galat.                                                 | Lulus  |

## 3. Data Uji dan Pemulihan

- **Tidak ada perubahan lewat SQL Editor.** Semua query yang dipakai hanya membaca. Pengaturan (`pengaturan`) tidak diubah.
- **Perubahan data `tes1` lewat aksi `jual`** (tidak dikembalikan, ikan yang terjual tidak bisa dikembalikan): koin 940 menjadi 1520. Stok akhir: Ekor Lincah 16 menjadi 15, Biru Mungil 7 menjadi 0, Naga Emas 1 menjadi 0; jenis lain sama dengan kondisi awal. Jumlah baris `tangkapan` tetap 13.
- **`tes2` tidak berubah** (dibuktikan di SEC-05).
- **Dibersihkan bersama akun tes sebelum demo** (butuh penjelasan dampak dan "OK" ketua), sama seperti di `mancing-test.md`.
- **Rahasia:** token login tidak pernah ditampilkan atau ditempel. Alat uji hanya mencetak kode HTTP dan balasan server. Saran "GRANT ... TO anon" di pesan galat Postgres sengaja tidak diikuti (akan membuka tabel dan melanggar aturan RLS tertutup).
- **Catatan alat uji:** alat uji di Console hilang setiap halaman dimuat ulang, jadi harus dipasang ulang bila halaman di-refresh di tengah tes.

## 4. Catatan Temuan

- Tidak ada temuan P0 atau P1 di sesi ini. Semua kasus sesuai hasil yang benar.
- Jual ikan dengan id yang tidak ada di katalog (9999) dijawab 400 dengan pesan yang sama seperti "tidak dimiliki" (bukan "Permintaan tidak dikenal"). Aman dan tidak membocorkan apa pun.
- Layar Tas saat ini **tidak memakai konfirmasi** sebelum "Jual semua jenis ini": satu ketukan langsung menjual. Keputusan perlu atau tidaknya konfirmasi masih terbuka (`tas-jual.md` bagian 8).

## 5. Belum Dites (dicatat jujur)

| Butir                                                                             | Prioritas | Alasan atau catatan                                                                                                         |
| :-------------------------------------------------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------- |
| Harga ikut berubah bila `pengaturan` diubah (misal `harga_common`)                | P0        | Butuh mengubah `pengaturan` di production (penjelasan dampak dan "OK" ketua). Tes ini membuktikan harga tidak ditulis mati. |
| `PEMAIN_TIDAK_ADA` pada `jual` (akun login tanpa baris pemain)                    | P1        | Butuh akun baru yang belum memilih nama.                                                                                    |
| Jual ikan yang dinonaktifkan (`aktif = false`)                                    | P1        | Butuh menonaktifkan ikan lewat SQL. Perilaku bawaan: tetap boleh dijual (`tas-jual.md` catatan 2 Nov).                      |
| Galat `PENGATURAN_KURANG` dan `HARGA_TIDAK_VALID` (harga hilang atau bukan angka) | P1        | Butuh merusak `pengaturan` sementara di production.                                                                         |
| Layar sesi habis (401) saat menjual lewat tombol                                  | P1        | Server terbukti 401; tampilan layar belum dilihat.                                                                          |
| Tes PWA dan offline setelah update `tas.js`                                       | P1        | Sudah dicek di TAS.03 (berkas ada di cache `santuy-v1`); belum diulang di sesi ini.                                         |
| Cek skala 100 user dan uji ramai-ramai                                            | P1        | Cek akhir proyek (`AGENTS.md` bagian 9 butir 5), bukan per fitur.                                                           |
| Tes di iPhone                                                                     | Batasan   | Tidak ada device (`AGENTS.md` bagian 9 butir 7).                                                                            |

## 6. Sisa Pekerjaan Setelah Sesi Ini

- Putuskan konfirmasi "Jual semua jenis ini" (tim, bagian 8 `tas-jual.md`).
- Gambar ikan dan siluet sungguhan lewat `pemandangan-ikan.md` (VIS.01) menggantikan emoji.
- Bersihkan akun tes dan data tangkapannya sebelum demo (butuh "OK" ketua).
