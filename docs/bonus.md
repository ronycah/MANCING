/docs/bonus.md

# ⭐ bonus.md: Antrean Fitur Tambahan

> **Versi 1.0 (2 Nov 2026).** Bergantung pada fitur inti yang sudah stabil (`akun.md`, `mancing.md`, `tas-jual.md`, `pemandangan-ikan.md`, `fondasi.md`).
> **Status:** antrean fitur tambahan. Butir disusun dari bagian "Ditunda" di dokumen fitur lain dan dari `features.md` bagian 8. **Butir mana yang dikerjakan, dan urutannya, belum diputuskan tim.** Belum ada yang dikerjakan.
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini + dokumen fitur yang disebut di kolom Sumber** untuk butir yang dipilih. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 8 bila ada keputusan baru atau kejadian di lapangan.
> **Tanpa kode dan tanpa isi SQL.**
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Menampung fitur tambahan yang **sengaja belum dikerjakan** supaya fokus tetap pada game kecil yang stabil. Bonus dikerjakan **hanya setelah semua fitur inti jalan dan lolos tes**, dan tidak boleh mengganggu fitur inti.

---

## 2. Daftar butir

Prefix ID sheet: **BNS**. Kolom Risiko adalah penilaian penulis (bawaan), bukan keputusan tim.

### A. Permainan dan ekonomi

| ID     | Butir                                                                                                                          | Sumber                                            | Risiko    |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | --------- |
| BNS.01 | **Berat ikan dan harga berdasarkan berat.** Saat ini harga hanya menurut kelas.                                                | `tas-jual.md` TS4 dan bag. 8; `mancing.md` bag. 8 | High-Risk |
| BNS.02 | **Upgrade umpan atau pancing dengan koin.** Saat ini koin berfungsi seperti skor.                                              | `tas-jual.md` TS8 dan bag. 8; `mancing.md` bag. 8 | High-Risk |
| BNS.03 | **Papan peringkat** antar pemain.                                                                                              | `features.md` bag. 8; `tas-jual.md` bag. 8        | High-Risk |
| BNS.04 | **Pencapaian.**                                                                                                                | `features.md` bag. 8                              | High-Risk |
| BNS.05 | **Hadiah harian.**                                                                                                             | `features.md` bag. 8                              | High-Risk |
| BNS.06 | **Tap tepat waktu yang mempengaruhi hasil.** Butuh dua tahap dan keputusan baru, karena sekarang hasil ditentukan saat lempar. | `mancing.md` bag. 8                               | High-Risk |
| BNS.07 | **Kunci pengulangan lemparan.**                                                                                                | `mancing.md` bag. 8                               | High-Risk |
| BNS.08 | **Riwayat lemparan.** Saat ini hasil yang lepas tidak disimpan.                                                                | `mancing.md` bag. 8; `database.md` bag. 2         | High-Risk |
| BNS.09 | **Penjelasan alasan ikan lepas.**                                                                                              | `mancing.md` bag. 8                               | High-Risk |

### B. Tampilan dan tas

| ID     | Butir                                                                                                 | Sumber                                             | Risiko   |
| ------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------- |
| BNS.10 | **Filter dan urutan album** (misalnya per kelas atau yang dimiliki saja).                             | `tas-jual.md` bag. 8                               | Low-Risk |
| BNS.11 | **Efek khusus Epic dan Legendary** saat ikan tertangkap (hanya tampilan).                             | `features.md` bag. 8; `pemandangan-ikan.md` VS6    | Low-Risk |
| BNS.12 | **Suara dan musik.**                                                                                  | `features.md` bag. 8; `pemandangan-ikan.md` bag. 8 | Low-Risk |
| BNS.13 | **Cuaca** di pemandangan (hanya tampilan).                                                            | `pemandangan-ikan.md` bag. 8                       | Low-Risk |
| BNS.14 | **Layar Cara Main dan Tentang.**                                                                      | `features.md` bag. 8                               | Low-Risk |
| BNS.15 | **Tampilan mendatar (landscape)** saat di area mancing. **Menunggu jawaban dosen**; belum diputuskan. | Usulan tim, 2 Nov 2026                             | Low-Risk |

### C. Akun

| ID     | Butir                                          | Sumber           | Risiko    |
| ------ | ---------------------------------------------- | ---------------- | --------- |
| BNS.16 | **Verifikasi email** saat daftar.              | `akun.md` bag. 8 | High-Risk |
| BNS.17 | **Ganti email.**                               | `akun.md` bag. 8 | High-Risk |
| BNS.18 | **Hapus akun.**                                | `akun.md` bag. 8 | High-Risk |
| BNS.19 | **Login lewat Google.**                        | `akun.md` bag. 8 | High-Risk |
| BNS.20 | **Rate limit khusus** di luar bawaan Supabase. | `akun.md` bag. 8 | High-Risk |
| BNS.21 | **Foto profil.**                               | `akun.md` bag. 8 | High-Risk |

### D. Fondasi dan penerbitan

| ID     | Butir                           | Sumber              | Risiko    |
| ------ | ------------------------------- | ------------------- | --------- |
| BNS.22 | **Ikon aplikasi yang dipoles.** | `fondasi.md` bag. 8 | Low-Risk  |
| BNS.23 | **README di root repo.**        | `fondasi.md` bag. 8 | Low-Risk  |
| BNS.24 | **Domain sendiri.**             | `fondasi.md` bag. 8 | High-Risk |
| BNS.25 | **Notifikasi.**                 | `fondasi.md` bag. 8 | High-Risk |

Catatan risiko:

- **High-Risk** bila menyentuh koin, umpan, peluang, harga, balasan server, login, data pemain, atau pengaturan penerbitan. Wajib dijelaskan dampaknya dan menunggu "OK" ketua. Semua angka tetap disimpan di database, bukan ditulis mati di kode.
- **Low-Risk** bila hanya tampilan atau dokumen; cukup visual sanity check.
- Urutan di `features.md` bagian 8 (efek, papan peringkat dan pencapaian dan hadiah harian, Cara Main dan Tentang, suara, upgrade, berat ikan) adalah urutan usulan awal, belum final.

---

## 3. Aturan umum bonus

1. Mulai **hanya setelah** fitur inti selesai dan lolos tes, termasuk cek skala 100 user.
2. **Satu butir per giliran.** Butir yang dipilih ditambahkan ke Google Sheet dengan prefix BNS, lalu dibuatkan bagian "Urutan pekerjaan" di blok catatan susulan.
3. Butir High-Risk mengikuti aturan keamanan di `AGENTS.md` bagian 7: logika dihitung di server, aplikasi hanya mengirim aksi, tabel tertutup untuk aplikasi. Tabel baru wajib mencabut semua hak `service_role` lalu memberi ulang hanya yang perlu (`database.md` bagian 8).
4. Berkas JS atau aset baru wajib didaftarkan di `BERKAS_DASAR` di `sw.js` (butuh "OK" ketua), supaya game tetap bisa dibuka offline.
5. Gambar dan suara tidak memakai materi bermerek atau milik pihak lain. Aset ditaruh di `public/` (nama huruf kecil, tanpa spasi) dan ikut di-push dari terminal.

---

## 4. Aturan yang paling sering terlanggar

| Aturan                                                        | Akibat bila dilanggar                                     |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| Mengerjakan bonus sebelum fitur inti stabil                   | Game inti terganggu; nilai proses dan hasil turun.        |
| Mengubah harga, umpan, atau peluang tanpa penjelasan dan "OK" | Ekonomi semua pemain berubah tanpa disadari.              |
| Menulis angka game langsung di kode                           | Tidak bisa diatur tanpa mengubah kode.                    |
| Menambah berkas baru tanpa mendaftarkannya di `sw.js`         | Game offline bisa setengah rusak tanpa langsung ketahuan. |
| Memakai gambar atau suara milik pihak lain                    | Melanggar aturan aset tim.                                |
| Mengerjakan beberapa butir bonus sekaligus dalam satu giliran | Sulit dites dan sulit dibatalkan.                         |
| Mengaktifkan kembali "Confirm email" tanpa keputusan baru     | Pendaftaran macet bila email verifikasi tidak terkirim.   |

---

## 5. Dampak dan pembatalan

- Butir tampilan dan dokumen (Low-Risk): bila ada glitch, perbaiki berkasnya dan push ulang. Tidak ada data pemain yang terpengaruh.
- Butir High-Risk: menyentuh tabel, fungsi SQL, Edge Function, atau pengaturan Auth. Salinan SQL disimpan di `supabase/migrations/` sebelum dijalankan; bila bermasalah, deploy ulang versi sebelumnya. Tidak ada environment uji terpisah (hanya production), jadi dampak dijelaskan dulu.

---

## 6. Sudah pindah ke inti (bukan bonus lagi)

- **Album koleksi** (fishdex): `tas-jual.md` TS1.
- **Konfirmasi sebelum "Jual semua jenis ini":** TAS.06.
- **Tiga lokasi (danau, sungai, laut):** `pemandangan-ikan.md` bagian 9 dan VIS.07 sampai VIS.09.
- **Lupa password lewat link email:** `akun.md` blok 2 Nov 2026 (AKN.06), menggantikan reset manual (AK8).

---

## 7. Belum diketahui

- Butir mana yang dipilih tim dan urutannya.
- Jawaban dosen soal tampilan mendatar (BNS.15).

---

## 8. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_

### 2026-11-04: Butir bonus visual dikerjakan di versi 1

Arahan dosen (Zoom, 4 Nov 2026): butir bonus yang terkait aspek visual dikerjakan di versi 1, dan md-nya digabungkan. Keputusan tim: tidak membuat md baru dan tidak menggabung ke dokumen lain; revisi ditambahkan di bagian bawah berkas ini sebagai catatan susulan.

- **Dikerjakan di versi 1:** BNS.10, BNS.11, BNS.13. Ini menggantikan aturan bagian 1 dan 3 (bonus hanya setelah fitur inti stabil), khusus tiga butir ini. BNS.13 (cuaca) dikonfirmasi tim sebagai visual. BNS.10 dihitung visual berdasarkan pilihan bawaan penulis, belum dikonfirmasi tim.
- **BNS.15 (tampilan mendatar) pindah ke inti** dan dikerjakan di `docs/layar-landscape.md`. Tidak lagi menunggu jawaban dosen (bagian 7): dosen meminta landscape.
- **Tetap bonus, belum dikerjakan:** pencapaian (BNS.04), hadiah harian (BNS.05), Cara Main dan Tentang (BNS.14), suara (BNS.12), ikon aplikasi (BNS.22), dan butir lain. Bila dikerjakan nanti, layarnya memakai landscape dan dibuka lewat tombol ikon tambahan; letak dan bentuk ikon belum diputuskan.
  **Urutan pekerjaan** (semua Low-Risk, hanya tampilan, prefix sheet BNS):

1. **BNS.10 Filter dan urutan album.** Memakai data yang sudah ada di memori game, tanpa panggilan server baru. Setelah LAY.03. Sumber awal: `tas-jual.md` bag. 8.
2. **BNS.11 Efek khusus Epic dan Legendary.** Hanya tampilan dan tidak mengubah rarity (diputuskan server). Setelah LAY.08 (animasi hasil di tengah layar). Sumber awal: `pemandangan-ikan.md` VS6.
3. **BNS.13 Cuaca.** Hanya hiasan: tanpa data cuaca dari luar, tanpa CDN, tidak dipakai menghitung apa pun. Setelah LAY.03. Sumber awal: `pemandangan-ikan.md` bag. 8.
   Berkas baru wajib didaftarkan di `BERKAS_DASAR` di `sw.js` (aturan bagian 3 butir 4). Alasan lain belum tercatat.
