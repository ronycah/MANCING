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

### 2026-11-02: Dosen minta tiga lokasi (danau, sungai, laut)

- Permintaan dosen (2 Nov 2026, siang): lokasi game menjadi tiga, yaitu danau, sungai, dan laut. Menggantikan VS1 ("satu lokasi: danau") dan butir "tema laut ditunda" di bagian 8. Yang paling akhir menang.
- Keputusan tim: lokasi hanya mengubah tampilan. Ikan, peluang, dan umpan sama di semua lokasi; tidak ada pencocokan ikan dengan lokasi dan tidak ada perubahan database.
- Urutan: danau dikerjakan dulu sesuai VIS.01 dan seterusnya. Sungai dan laut ditambahkan sebagai pekerjaan baru setelah danau selesai.
- Belum diputuskan: cara pemain memilih lokasi. Alasan lain belum tercatat.

### 2026-11-02: Pilihan lokasi di awal mancing dan boleh diganti

- Keputusan tim (2 Nov 2026): pemain memilih lokasi (danau, sungai, atau laut) di awal, sebelum mulai mancing, dan boleh menggantinya kapan saja lewat tombol Ganti lokasi di layar mancing, tanpa harus menutup game. Menjawab butir "belum diputuskan: cara pemain memilih lokasi" di blok tiga lokasi pada tanggal yang sama.
- Pilihan bawaan penulis, belum ditanyakan ke tim: lokasi hanya diingat selama game terbuka dan tidak disimpan di server (tidak ada perubahan database); layar pilih lokasi dikerjakan setelah ketiga pemandangan ada. Alasan lain belum tercatat.

### Handoff #1 | 2026-11-02 | [rac]

**Selesai: VIS.01 (danau satu suasana, statis).** Sudah dicek di HP lewat versi online (ronycah.github.io/MANCING).

- Berkas baru: `lokasi-danau.js`, `img/danau.svg`, dan `style.css` versi baru. Danau siang (langit biru, bukit, air, dermaga, matahari, awan) tampil di layar utama, di atas tombol Lempar Kail.
- `sw.js` diubah dengan OK ketua: hanya menambah `lokasi-danau.js` dan `img/danau.svg` di `BERKAS_DASAR`, tidak ada yang dihapus. `NAMA_CACHE` tetap `santuy-v1`. Di Cache storage, kedua berkas sudah terkonfirmasi tersimpan.
- Cek yang lolos: lempar kail jalan normal (hasil "Ikan lepas!" dan "Dapat ikan!", hitung mundur umpan tetap jalan); Tas Ikan terbuka dengan jumlah benar; kembali dari Tas Ikan, danau muncul lagi tanpa error di konsol.

**Belum dikerjakan:**

- VIS.02 ⚠️ (empat suasana dari waktu server). Bila `status` belum mengirim waktu server, penambahannya menyentuh Edge Function dan butuh penjelasan dampak plus "OK" ketua.
- VIS.03 sampai VIS.06, serta VIS.07 (sungai), VIS.08 (laut), VIS.09 (pilih lokasi) sesuai urutan di TODO sheet.

**Catatan untuk sesi berikutnya:**

- Layar utama jadi lebih panjang karena danau, dan ada jarak kosong antara danau dan teks hitung mundur sebelum lempar. Dibiarkan sampai VIS.05 (penyesuaian di HP).
- Ikon ikan di layar hasil dan album masih emoji 🐟 (sementara), menunggu script SVG di VIS.04.
- Setiap pemandangan baru (sungai, laut) berarti berkas JS dan SVG baru. Nama keduanya perlu ditambah ke `BERKAS_DASAR` di `sw.js` supaya tampil offline. Itu menyentuh `sw.js` lagi dan butuh "OK" ketua.
- Pilihan bawaan penulis di blok "Pilihan lokasi di awal mancing" (lokasi hanya diingat selama game terbuka, layar pilih lokasi setelah ketiga pemandangan ada) belum ditanyakan ke tim.
- Blok ini disusun dari laporan user dan screenshot hasil cek, bukan dari sesi kode aslinya. Isi persis perubahan di `index.html`/`mancing.js` untuk memasang danau tidak tercatat di sini, jadi AI berikutnya sebaiknya membaca berkas yang ada, bukan menebak.

### Handoff #2 | 2026-11-02 | [aik]

**Selesai: VIS.03 (animasi pelampung dan gigitan).** Low-Risk, tanpa OK ketua. Hasil test dilaporkan user OK.

- Berkas berubah (3), semuanya file utuh dan isi lama tidak dihapus:
  - `public/img/danau.svg`: menambah satu grup pelampung.
  - `public/style.css`: menambah blok animasi di bagian paling bawah.
  - `public/mancing.js`: menambah fungsi pengatur animasi dan memanggilnya saat lempar. Satu angka lama diubah dan diberi komentar: `JEDA_ANIMASI` dari 700 menjadi 2200.
- `sw.js` tidak berubah (tidak ada berkas baru). `NAMA_CACHE` tetap `santuy-v1`.
- Perilaku: setelah Lempar Kail, pelampung jatuh ke air dan mengapung dengan riak. Sekitar 1,5 detik kemudian ada gigitan (tersentak turun-naik), lalu hasil muncul dan pelampung hilang. Animasi hanya tampilan; hasil tetap ditentukan server saat lempar (MC1).
- Cek yang disusun di sesi: pelampung dan riak tampil; gigitan muncul sebelum hasil; hasil dan hitungan umpan tetap normal; tidak ada error di konsol; Lempar Kail dua kali beruntun, tombol tetap mati selama animasi.

**Catatan koreksi dari Handoff #1:** VIS.02 (empat suasana dari waktu server) tercatat **Selesai** di TODO sheet (2 Nov 2026). Handoff #1 menulisnya belum dikerjakan; yang paling akhir menang. Menurut catatan sheet: `status_pemain` dan lempar sudah mengirim `jam_server`, jadi tanpa OK ketua. Sudah dites dengan jam perangkat diubah ke siang, tampilan tetap malam (SEC-09 terpenuhi). Berkas yang berubah di VIS.02 tidak tercatat di sini, jadi baca berkas yang ada, jangan menebak.

**Belum dikerjakan:**

- VIS.04 (script SVG ikan): menunggu script dari pembuatnya. Pertanyaan "bisa jenis berbeda dalam satu kelas?" (VS8) belum dipastikan sudah ditanyakan atau belum.
- VIS.05, VIS.06, VIS.07 (sungai), VIS.08 (laut), VIS.09 (pilih lokasi) sesuai TODO sheet.

**Catatan untuk sesi berikutnya:**

- Satu lemparan sekarang sekitar 2,2 detik (sebelumnya 0,7 detik) supaya gigitan terlihat. Bila terasa terlalu lama, kecilkan dua angka di `mancing.js` dan beri tahu ketua.
- Pelampung kecil di HP sempit (sekitar 14 piksel lebarnya). Bila kurang terlihat, besarkan saat VIS.05.
- Warna pelampung (merah, putih, kuning) sama di semua suasana termasuk malam. Ini pilihan penulis, belum ditanyakan ke tim.
- Efek Epic dan Legendary belum termasuk (bonus, lihat `bonus.md`).
- Layar utama panjang dan ada jarak kosong antara danau dan hitung mundur (dari Handoff #1), dibiarkan sampai VIS.05.
- Ikon ikan di layar hasil dan album masih emoji 🐟 sampai VIS.04.
- Setiap pemandangan baru (sungai, laut) menyentuh `BERKAS_DASAR` di `sw.js` dan butuh "OK" ketua.
- Blok ini disusun dari laporan sesi terakhir dan screenshot TODO sheet, bukan dari kode aslinya. Isi persis perubahan di `mancing.js` tidak tercatat, jadi AI berikutnya sebaiknya membaca berkas yang ada.

### 2026-11-02: Gambar ikan berupa 4 berkas WebP (menggantikan rencana script SVG di VS7 dan VS8)

- Pembuatan gambar: kakak teman tim mengubah gambar ke WebP dengan script Python di luar AI, sambil menambah efek glow. Yang diterima tim adalah berkas WebP jadi, **bukan script SVG yang dijalankan di game**. Ini menggantikan VS7 dan butir "script SVG bisa membuat jenis berbeda dalam satu kelas?" di bagian 8. Yang paling akhir menang.
- Sumber gambar asli: svgrepo.com, dengan lisensi CC0, dikonfirmasi oleh cocciplaz. Tidak wajib mencantumkan atribusi.
- Pendekatan VS8 yang terpakai: **(b) satu gambar per kelas**, 4 berkas. Efek sudah tertanam di berkas, tidak ada pewarnaan ulang oleh script. Sesuai VS9: gambar CC0, bukan milik pihak lain.
- Berkas (di `public/img/`, sudah di-push 2 Nov 2026), semuanya transparan dan total sekitar 150 KB:
  - `sisikpasir.webp` (500x222, glow abu-abu)
  - `birumungil.webp` (500x319, glow biru)
  - `babydragon.webp` (500x365, glow ungu)
  - `golddragon.webp` (500x421, glow oranye)
- Pemetaan ke kelas: sisikpasir = Common, birumungil = Rare, babydragon = Epic, golddragon = Legendary.
- Catatan tampilan: gaya gambar tidak seragam antar kelas (realistis, vektor flat, kartun, ornamen) dan berbeda dari kartun flat di VS1. Diterima tim karena dosen (1 Nov 2026) membolehkan berkreasi sesuai selera masing-masing dan tidak terikat gaya kartun. Dua gambar berupa naga; nama di katalog `ikan` disesuaikan dengan gambar (VS8 mengizinkan).
- Dampak ke langkah:
  - **VIS.04** menjadi "pasang 4 WebP di layar hasil dan album lewat kode gambar di katalog `ikan`", bukan integrasi script. Tidak ada perubahan server, database, atau peluang mancing.
  - Rasio gambar beda-beda (tinggi 222 sampai 421 piksel): tampilkan dalam kotak berukuran tetap dengan `object-fit: contain` supaya album rata dan layar hasil tidak loncat.
  - **VIS.05** (siluet album): belum diputuskan caranya. Karena semua berkas transparan, filter CSS (mis. `brightness(0)`) bisa dicoba. Glow ikut menjadi bayangan gelap sehingga siluet agak gembung; cek visual, bila mengganggu minta versi tanpa glow.
  - Keempat berkas perlu masuk `BERKAS_DASAR` di `sw.js` supaya tampil offline. Itu menyentuh `sw.js` dan butuh "OK" ketua. `NAMA_CACHE` perlu dipertimbangkan naik versi bila gambar tidak muncul karena cache lama.
- Blok ini disusun dari laporan user dan pengecekan berkas (ukuran, transparansi), bukan dari kode. Cara tampil gambar di `tas.js`/`mancing.js` belum dikerjakan, jadi AI berikutnya sebaiknya membaca berkas yang ada, bukan menebak.
