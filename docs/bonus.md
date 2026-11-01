/docs/pemandangan-ikan.md

# 🌅 pemandangan-ikan.md: Danau WIB, Gambar Ikan, dan Animasi

> **Versi 1.0 (1 Nov 2026), hasil sesi strategi.** Bergantung pada `mancing.md` (layar utama sederhana sudah ada) dan `tas-jual.md` (album butuh gambar ikan).
> **Status:** VS1 sampai VS9 disepakati tim (ketua ikut di Zoom, 1 Nov 2026). Butir bertanda **(bawaan)** adalah pilihan penulis yang tidak ditanyakan satu per satu; tim boleh mengubahnya sebelum dikerjakan. Belum ada yang dikerjakan.
> **Cara pakai sesi kode:** lampirkan **`AGENTS.md` + berkas ini saja**. Kerjakan langkah di bagian 5. Sesi kode **tidak merapikan atau menulis ulang berkas ini**; hanya menambah blok di bagian 9 bila ada kejadian di lapangan.
> **Berkas yang diminta AI di awal sesi** (sebut nama dan alasan sekaligus, jangan menebak isinya): berkas JS dan CSS layar utama dan tas yang sudah ada, `public/index.html`, dan script SVG ikan (bila sudah diterima dari pembuatnya).
> **Tanpa kode.**
> **Fitur ini Low-Risk** (tampilan): cukup visual sanity check, kecuali bagian waktu server yang menyentuh `status`.
> **Selisih:** `AGENTS.md` menang atas berkas ini. Yang paling akhir menang.

---

## 1. Tujuan

Layar utama berupa **satu danau bergaya kartun flat** yang berubah suasana mengikuti **waktu WIB dari jam server**, lengkap dengan animasi pelampung, dan **gambar ikan** yang konsisten untuk layar hasil dan album.

---

## 2. Keputusan

| No  | Keputusan                                                                                                                                                                                                                                                                                                                                                                                         | Dasar                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| VS1 | **Satu lokasi: danau.** Gaya visual **kartun flat** (bentuk sederhana, warna solid), dipakai konsisten oleh semua giliran. Dibuat dengan CSS/SVG/Canvas, ringan untuk HP biasa. Nama dan tampilan sengaja tidak terikat air tawar atau asin supaya bisa ditambah laut nanti.                                                                                                                      | Keputusan tim 1 Nov 2026.                            |
| VS2 | **Empat suasana mengikuti jam WIB:** pagi **05.00 sampai 10.00**, siang **10.00 sampai 15.00**, sore **15.00 sampai 18.00**, malam **18.00 sampai 05.00**.                                                                                                                                                                                                                                        | Keputusan tim 1 Nov 2026.                            |
| VS3 | **Waktu dari jam server**, bukan jam HP. Server mengirim waktu saat masuk dan setiap aksi; aplikasi menghitung waktu berjalan dari titik itu, tanpa membaca jam HP untuk menentukan suasana.                                                                                                                                                                                                      | `security.md` aturan 6; SEC-09. Cara hitung: bawaan. |
| VS4 | Suasana **hanya mengubah tampilan** (warna langit dan air, posisi matahari atau bulan, awan). Tidak mempengaruhi hasil mancing, peluang, atau umpan.                                                                                                                                                                                                                                              | Keputusan tim.                                       |
| VS5 | **Elemen layar utama:** langit, matahari (siang) atau bulan (malam), awan, air danau, pelampung, tombol Lempar Kail, jumlah umpan dan hitung mundur, koin, nama tampilan.                                                                                                                                                                                                                         | `features.md`.                                       |
| VS6 | **Animasi:** pelampung bergerak setelah lempar dan "gigitan" sebelum hasil muncul. Animasi gigitan **hanya tampilan**; hasil sudah ditentukan server saat lempar (`mancing.md` MC1). Efek khusus Epic dan Legendary: bonus.                                                                                                                                                                       | Keputusan tim 1 Nov 2026.                            |
| VS7 | **Gambar ikan: satu SVG dasar yang warnanya diubah script.** Script dibuat oleh pihak di luar AI (kakak salah satu anggota). Berlaku aturan "file utuh, jangan hapus kode lama". Nama pemegang dicatat di TODO sheet, bukan di repo.                                                                                                                                                              | Keputusan tim; aturan dosen.                         |
| VS8 | **Dua pendekatan gambar, diputuskan setelah tahu kemampuan script:** (a) satu SVG yang diwarnai ulang per kelas, atau (b) empat gambar berbeda per kelas dengan efek latar tambahan dari script. Katalog `ikan` punya kolom **kode gambar** supaya berganti pendekatan cukup mengubah isi katalog. Nama 16 ikan fantasi cocok untuk keduanya; bila gambar tidak tersedia, nama boleh disesuaikan. | Usulan teman tim 1 Nov 2026; `database.md`.          |
| VS9 | **Aset gambar** ditaruh langsung di `public/img/` (nama huruf kecil, tanpa spasi) dan ikut di-push dari terminal. Tidak memakai gambar bermerek atau milik pihak lain. Siluet album (belum pernah didapat) memakai bentuk yang sama dengan warna gelap.                                                                                                                                           | `fondasi.md` F4 dan F5.                              |

---

## 3. Prasyarat

Dari `mancing.md`: layar utama sederhana dan layar hasil sudah ada. Dari `tas-jual.md`: album butuh gambar dan siluet. Server sudah mengirim waktu server di `status` (**bila belum, aksi `status` ditambah di langkah VIS.02 dengan "OK" ketua**).

---

## 4. Yang dibuat

| Komponen                      | Isi                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| Pemandangan danau             | Langit, air, matahari atau bulan, awan; empat suasana (VS2).                                             |
| Pengatur suasana              | Menentukan suasana dari waktu server (VS3), tanpa polling terus-menerus.                                 |
| Animasi pelampung dan gigitan | Hanya tampilan (VS6).                                                                                    |
| Gambar ikan                   | Script SVG dari pembuatnya, dipanggil dengan kode gambar dari katalog. Ditempel sesuai aturan file utuh. |
| Siluet album                  | Bentuk ikan versi gelap untuk jenis yang belum pernah didapat.                                           |
| Aset di `public/img/`         | Ikon aplikasi, SVG, dan gambar pendukung.                                                                |

---

## 5. Urutan pekerjaan (untuk TODO sheet, prefix VIS)

Langkah ⚠️ butuh penjelasan dampak dan "OK" ketua.

1. **VIS.01** Pemandangan danau satu suasana (statis) di layar utama.
2. **VIS.02 ⚠️** Empat suasana dari waktu server. Bila `status` belum mengirim waktu server, tambahkan di sini (menyentuh Edge Function).
3. **VIS.03** Animasi pelampung dan gigitan.
4. **VIS.04** Integrasi script SVG ikan: layar hasil dan album. Menunggu script dari pembuatnya.
5. **VIS.05** Siluet album dan penyesuaian tampilan di HP.
6. **VIS.06** Cek ringan di beberapa HP (visual sanity check; tidak butuh bukti).

---

## 6. Aturan yang paling sering terlanggar

| Aturan                                              | Akibat bila dilanggar                                            |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| Menentukan suasana dari jam HP                      | Tampilan waktu bisa dipalsukan; melanggar aturan dosen (SEC-09). |
| Animasi gigitan mempengaruhi hasil                  | Melanggar keputusan tim (MC1).                                   |
| Mengubah atau menimpa script SVG tanpa file utuh    | Script pembuat bisa rusak dan tidak bisa dilacak.                |
| Nama berkas gambar berhuruf besar atau berspasi     | Tidak muncul di versi online.                                    |
| Memakai animasi atau Canvas berat                   | HP biasa lambat atau panas.                                      |
| Nama atau teks dari server lewat `innerHTML`        | Teks bisa menjalankan skrip.                                     |
| Mengganti gaya visual tidak konsisten antar giliran | Tampilan campur aduk.                                            |

---

## 7. Dampak dan pembatalan

- Hampir seluruhnya tampilan; bila ada glitch, perbaiki berkasnya dan push ulang. Tidak ada data pemain yang terpengaruh.
- Satu-satunya bagian yang menyentuh server adalah penambahan waktu server di `status` (VIS.02): bila bermasalah, deploy ulang versi sebelumnya.

---

## 8. Ditunda dan belum diketahui

**Ditunda (lihat `bonus.md`):** efek Epic dan Legendary, suara dan musik, banyak lokasi atau cuaca, tema laut.

**Belum diketahui (dicek, bukan ditebak):**

- Apakah script SVG bisa membuat jenis berbeda dalam satu kelas (VS8): **ditanyakan ke pembuat script**, jawabannya dicatat di sini sebagai blok susulan.
- Siapa yang membuat ikon aplikasi dan bentuknya (dibutuhkan sebelum FND.07).
- Warna dan palet final: ditentukan saat VIS.01 dan dipakai konsisten setelahnya.

---

## 9. Catatan susulan dan Handoff

_(Kosong. Diisi hanya di sesi kode, bila ada keputusan baru atau kejadian di lapangan, atau saat user meminta handoff. Format blok: `### YYYY-MM-DD: topik` atau `### Handoff #N | tanggal | nama PIC`, ditempel di bawah (append-only). Bila blok baru bertentangan dengan isi di atas, yang paling akhir menang dan AI menyebut pertentangannya ke user.)_
