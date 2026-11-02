docs/mancing-test.md

# Tes Mancing — Mancing Santuy (MCG.04)

Kasus uji dan bukti untuk fitur mancing (`docs/mancing.md`). Tanpa kode dan tanpa isi rahasia. Definisi SEC ada di `docs/security.md` bagian 3.

> **Sesi tes:** 2 Nov 2026, di production, akun dummy `tes1` (Penguji Satu) dan `tes2` (Penguji Dua ganti). "OK" ketua diberikan di sesi untuk tiap perubahan data: umpan `tes1` (SEC-07, SEC-08, sebaran) dan `peluang_common` di `pengaturan` (SEC-13).
> **Aturan bukti:** keamanan dan data pemain wajib ada bukti (balasan server atau hasil query). Atas arahan dosen, tangkapan layar tidak disimpan sebagai berkas; bukti berasal dari pengamatan yang ditempel di sesi chat dan dicatat di sini.
> **Rujukan:** `docs/mancing.md` (Handoff #1 dan #2), `docs/security.md`, `docs/akun-test.md`. Jam server dalam UTC.

---

## 1. Ringkasan

| Kelompok                                  | Hasil                                               |
| :---------------------------------------- | :-------------------------------------------------- |
| Lempar dan umpan (SEC-07, SEC-08, SEC-11) | Lulus semua, bukti balasan server                   |
| Isolasi dan data palsu (SEC-05, SEC-06)   | Lulus, bukti balasan server dan tampilan            |
| Waktu (SEC-09)                            | Lulus, bukti tampilan setelah muat ulang            |
| Peluang kelas bukan 100 (SEC-13)          | Lulus, bukti balasan server dan query               |
| Batas umpan (SEC-10)                      | Dirujuk dari `akun-test.md` (lewat `status`)        |
| Sebaran kelas (cek kasar)                 | Masuk akal, Legendary belum muncul (lihat bagian 3) |
| Belum dites                               | Lihat bagian 5                                      |

## 2. Hasil Tes (sesi ini)

| ID     | Skenario                                                                                                                     | Hasil yang benar                         | Hasil sebenarnya (bukti)                                                                                                                                                                                                                     | Status          |
| :----- | :--------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| SEC-11 | Lempar sampai ikan lepas                                                                                                     | Umpan berkurang 1, tidak ada ikan        | Umpan 11 menjadi 10. Balasan server `status: lepas`, tanpa bagian `ikan`. Layar hanya menulis "Ikan lepas!".                                                                                                                                 | Lulus           |
| SEC-09 | Jam Mac dimajukan ke 3 Nov, lalu dimundurkan ke 1 Nov (muat ulang paksa tiap kali)                                           | Umpan dan hitung mundur tidak berubah    | Umpan tetap 10/20 di kedua kondisi. Hitung mundur turun wajar (14:02, 10:21, 09:41), tidak melompat. Jam Mac dikembalikan ke otomatis.                                                                                                       | Lulus           |
| SEC-05 | `tes2` melempar, data `tes1` dicek (peran A dan B terbalik dari rencana awal karena salah ketuk)                             | Hanya data pelempar yang berubah         | `tes2`: umpan 20 menjadi 19, dapat Perak Bulan (Rare), dimiliki 1. `tes1` setelah muat ulang paksa: umpan 10/20 dan koin 0, sama seperti sebelumnya. Tidak ada tanda data `tes1` ikut berubah.                                               | Lulus           |
| SEC-06 | Kirim `umpan: 999`, `koin: 9999`, `harga`, `rarity`, `kelas: legendary`, `hasil`, `ikan_id` palsu di isi permintaan `lempar` | Semua diabaikan                          | Kode 200, `umpan` 11 menjadi 10 (bukan 999), ikan hasil undian server Sisik Pasir (Common), bukan Legendary. Setelah muat ulang paksa: umpan 10/20, koin 0 (bukan 9999). Sesuai kode: `index.ts` hanya meneruskan ID dari token.             | Lulus           |
| SEC-07 | Umpan `tes1` diatur 0 lewat SQL, lalu `lempar` dipanggil langsung dari Console (tombol dilewati)                             | Ditolak, umpan tetap 0                   | Kode 200, `status: umpan_habis`, `umpan: 0`, tanpa bagian `ikan`. Tombol di layar nonaktif dan menulis "Umpan habis. +1 umpan dalam ...". Setelah muat ulang paksa: tetap 0/20, tanpa kartu ikan.                                            | Lulus           |
| SEC-08 | Umpan `tes1` diatur 1, lalu dua permintaan `lempar` dikirim bersamaan                                                        | Hanya satu berhasil, umpan tidak negatif | Lemparan 1: `umpan_habis`, umpan 0. Lemparan 2: `ok`, dapat Sisik Pasir (jumlah dimiliki 2), umpan 0. Jam server kedua balasan beda sepersekian milidetik (05:32:25.643917 dan .643927). Setelah muat ulang paksa: 0/20.                     | Lulus           |
| SEC-13 | `peluang_common` diubah 60 menjadi 70 (total 110), lalu `lempar` dipanggil dari Console                                      | Ditolak oleh fungsi                      | Kode 500, `ok: false`, pesan umum "Gagal melempar kail. Coba lagi.", tanpa `ikan` dan tanpa galat mentah. Query sesudah dikembalikan ke 60: jumlah peluang kelas 100, `common` 60, umpan `tes1` tetap 1 (umpan tidak terpakai saat ditolak). | Lulus           |
| SEC-10 | Umpan tidak melebihi `umpan_maks` setelah lama tidak main                                                                    | Berhenti di batas                        | Dirujuk dari `akun-test.md` (lewat aksi `status`: umpan 15 dan 10 jam lalu menjadi 20). Rumus `lempar` sama dengan `status_pemain` menurut kode, tetapi **belum dibuktikan lewat `lempar`** (lihat bagian 5).                                | Lulus (rujukan) |

## 3. Sebaran Kelas (cek kasar)

Rencana 100 lemparan sekali jalan oleh `tes1` (umpan diatur 100 lewat SQL), satu per satu dengan jeda 300 ms. Berhenti di lemparan ke-84 karena satu panggilan dibalas **502 (Bad Gateway)** dari gerbang server Supabase, sehingga yang terhitung **83 lemparan**. Umpan akhir 17 dan layar menunjukkan 17/20, cocok dengan 100 dikurangi 83, jadi lemparan yang gagal tidak memotong umpan. Penyebab 502 belum diketahui.

| Hasil      | Jumlah | Persen                    | Target |
| :--------- | :----- | :------------------------ | :----- |
| Lepas      | 12     | 14,5% dari semua lemparan | 15%    |
| Dapat ikan | 71     |                           |        |
| Common     | 45     | 63,4% dari ikan           | 60%    |
| Rare       | 14     | 19,7%                     | 25%    |
| Epic       | 12     | 16,9%                     | 12%    |
| Legendary  | 0      | 0%                        | 3%     |

**Kesimpulan kasar:** urutan Common, Rare, Epic wajar dan peluang lepas sangat dekat target. Legendary belum muncul dari 71 ikan; dengan peluang 3%, kejadian ini wajar (kira-kira satu dari sembilan kali). Sampel kecil, tidak dipakai sebagai bukti statistik (sesuai `mancing.md` butir MCG.04).

## 4. Data Uji dan Pemulihan

- **Perubahan lewat SQL Editor (dengan "OK" ketua):** umpan dan waktu hitung baris `tes1` (diatur 0, 1, 1, lalu 100) dan satu baris `pengaturan` (`peluang_common` 70, hanya beberapa menit).
- **Dikembalikan dan dicek ulang:** `tes1` kembali ke umpan 10, waktu hitung 2 Nov 2026 05:18:43.277748 UTC, koin 0. `peluang_common` kembali 60; delapan baris `pengaturan` sesuai nilai awal (60, 25, 12, 3, lepas 15, umpan awal 10, umpan maks 20, jeda 60 menit).
- **Tidak dikembalikan:** ikan hasil tes di tabel `tangkapan` (tabel tanpa DELETE untuk aplikasi). `tes1` memegang puluhan ikan hasil tes, `tes2` memegang Perak Bulan 1. Dibersihkan bersama akun tes sebelum demo (butuh penjelasan dampak dan "OK" ketua).
- **Rahasia:** token login tidak pernah ditampilkan atau ditempel; perintah Console hanya menampilkan kode HTTP dan balasan server.
- **Catatan tampilan:** lemparan lewat Console tidak memperbarui layar sebelum dimuat ulang (wajar). Layar sempat menampilkan "Umpan: 100 / 20" setelah SQL; itu dari data uji yang sengaja melewati batas, pemain asli tidak bisa sampai situ.

## 5. Belum Dites (dicatat jujur)

| Butir                                                             | Prioritas | Alasan atau catatan                                                                                                                                |
| :---------------------------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pemulihan dan batas umpan 20 lewat aksi `lempar` (bukan `status`) | P0        | SEC-10 baru terbukti lewat `status`. Bisa dites: umpan 19 dan waktu hitung lama, lempar, lihat umpan akhir tidak melebihi 19 atau 20 sesuai rumus. |
| Penyebab 502 di lemparan ke-84                                    | P1        | Belum diketahui (server sibuk atau fungsi lambat). Lihat log Edge Function bila terulang.                                                          |
| Legendary belum terlihat di cek sebaran                           | Info      | Sampel kecil; cek ulang bila ada lemparan lain.                                                                                                    |
| `kolam_kosong` (kelas tanpa ikan aktif)                           | P1        | Butuh menonaktifkan ikan lewat SQL; tidak dites di sesi ini.                                                                                       |
| `PEMAIN_TIDAK_ADA` (akun tanpa baris pemain memanggil `lempar`)   | P1        | Tidak dites.                                                                                                                                       |
| Tes di iPhone                                                     | Batasan   | Tidak ada device (`AGENTS.md` bagian 9 butir 7).                                                                                                   |
| Layar sesi habis (401) di game                                    | P1        | Server terbukti 401 di `akun-test.md`; tampilan belum dilihat.                                                                                     |

## 6. Sisa Pekerjaan Setelah Sesi Ini

- Bersihkan akun tes dan data tangkapannya sebelum demo (butuh "OK" ketua).
- Dari `mancing.md` Handoff #2 masih berlaku: ruang kosong besar di kartu sebelum lemparan (`min-height: 150px`, kosmetik).
