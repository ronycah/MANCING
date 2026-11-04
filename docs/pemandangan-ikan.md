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

### 2026-11-03: Satu nama ikan, satu gambar (menggantikan satu gambar per kelas)

- Aturan dosen (WA, 3 Nov 2026): saat penilaian, tim minimal punya 40 gambar ikan yang mewakili 40 nama ikan, semuanya CC0 supaya tidak ada urusan atribusi. Tim berdelapan boleh menugaskan satu orang khusus mencari gambar. Selama development, berkas gambar lain (misalnya ikan1) boleh dipakai sebagai placeholder untuk ikan yang gambarnya belum ada. Menggantikan pendekatan satu gambar per kelas (VS8 butir b) dan blok 4 WebP tanggal 2 Nov 2026. Yang paling akhir menang.
- Detail katalog ikan (jumlah, jalur gambar, placeholder, penambahan ikan) ada di `katalog-ikan.md`. Empat WebP yang sudah ada tetap dipakai sebagai gambar cadangan di sana.

- Status pekerjaan gambar ikan dan handoff terbaru ada di `katalog-ikan.md` bagian 10.

### 2026-11-03: VIS.04 digantikan KAT.04 (gambar ikan sudah terpasang)

- VIS.04 di bagian 5 ("integrasi script SVG ikan") tidak dikerjakan sebagai butir sendiri. Rencana script SVG sudah gugur sejak blok 2 Nov 2026 (yang diterima WebP jadi), lalu aturan dosen 3 Nov 2026 mengubahnya menjadi satu gambar per ikan. Pemasangan gambar di layar hasil dan album dikerjakan lewat KAT.04 (`tas.js`, `mancing.js`, `style.css`); lihat `katalog-ikan.md` bagian 10. Yang paling akhir menang.
- Cek visual dengan akun dummy (3 Nov 2026) lolos: album menampilkan 40 kotak, gambar per ikan tampil di album, di kartu "Dapat ikan!", dan di popup detail ikan.
- Diketahui, sengaja dibiarkan dulu: gambar Pari Kristal dan Perak Bulan kemungkinan tertukar. Menunggu teman tim yang paham detail ikan; perbaikannya cukup tukar nama dua berkas `.webp` lalu push, tanpa SQL.
- Berikutnya: VIS.05. Album sekarang menampilkan "???" berwarna sesuai kelas untuk ikan yang belum didapat; belum diputuskan apakah itu cukup atau tetap memakai siluet gelap. Alasan lain belum tercatat.

### 2026-11-03: Album tetap memakai "???" berwarna kelas, tanpa siluet

- Keputusan tim (3 Nov 2026): ikan yang belum didapat tetap tampil sebagai "???" sesuai warna kelas seperti sekarang. Siluet gelap bentuk ikan tidak dikerjakan. Menggantikan butir siluet di VS9, bagian 4 (komponen "Siluet album"), dan langkah VIS.05. Yang paling akhir menang.
- Alasan (kata user): belum ada perintah dosen untuk mengubahnya. Alasan lain belum tercatat.
- VIS.05 menyisakan penyesuaian tampilan di HP. Dari handoff sebelumnya, ada dua catatan: jarak kosong antara danau dan hitung mundur di layar utama (Handoff #1), dan pelampung yang kecil di HP sempit (Handoff #2).

### 2026-11-03: Dosen minta card dan album lebih "wow" (dikerjakan sebelum VIS.06)

- Arahan dosen (3 Nov 2026, pagi): tampilan card "Dapat ikan!" dan kotak album dibuat lebih menarik, dikerjakan **sebelum VIS.06**. Butir baru di sheet (usulan ID VIS.05b), Low-Risk, hanya CSS dan tampilan; tidak ada perubahan server, database, atau `sw.js`.
- Card "Dapat ikan!": latar gradasi lembut dan bayangan menyala sesuai warna kelas; gambar ikan di atas "panggung" cahaya lembut; teks kelas menjadi lencana berwarna seperti di popup; card muncul dengan gerak singkat (membesar sedikit lalu mantap) dan gerak itu ikut mati bila HP mengaktifkan reduce-motion.
- Kotak album: bingkai lebih tebal dengan bayangan sesuai kelas; panggung cahaya di belakang gambar dan lencana kelas. Kotak "???" dibiarkan seperti sekarang.
- Ikan habis (x0): yang diredupkan hanya gambar dan teksnya; bingkai dan lencana kelas tetap jelas.
- Batasan: tidak ada glow tambahan di belakang gambar, supaya tidak dobel dengan glow bawaan WebP. "Panggung" hanya berupa warna latar lembut.
- Tidak bertentangan dengan blok sebelumnya (lencana kelas mengikuti yang sudah ada di popup). Alasan lain belum tercatat.

### Handoff #3 | 2026-11-03 | [aik]

**Selesai: VIS.05b (card "Dapat ikan!" dan kotak album lebih "wow", arahan dosen 3 Nov 2026).** Low-Risk. Sudah dicek lewat screenshot versi online dengan akun dummy; hasil sesuai arahan.

- Berkas berubah (1): `public/style.css`, file utuh, blok baru "VIS.05b" ditambah di paling bawah (1054 jadi 1204 baris). Isi lama tidak dihapus. `tas.js`, `mancing.js`, dan `sw.js` tidak berubah; tidak ada berkas baru, jadi tidak ada yang perlu didaftarkan di `BERKAS_DASAR`.
- Hasil: card punya gradasi, bayangan menyala sesuai kelas, panggung warna lembut, lencana kelas, dan gerak muncul (mati bila reduce-motion). Kotak album punya bingkai lebih tebal, bayangan, panggung, dan lencana. Ikan x0: hanya gambar dan teks nama/jumlah yang pudar, bingkai dan lencana tetap jelas. Kotak "???" tidak diubah. Tanpa glow tambahan di belakang gambar.
- Gerak muncul card hanya dicek lewat screenshot diam; gerakannya dan reduce-motion belum dicek langsung di HP.

**Catatan:**

- Bercak abu-abu gelap di belakang ikan Common (misal Nyala Api, Si Gelembung) berasal dari glow bawaan WebP, bukan dari panggung. Dibiarkan sesuai aturan "tanpa glow tambahan". Bila dosen minta Common lebih hidup, cukup geser warna Common di blok VIS.05b.
- ID di sheet ditulis `VIS.05b` (huruf kecil).
- VIS.05 tercatat Selesai di sheet (3 Nov 2026). Dua catatan lama untuknya (jarak kosong antara danau dan hitung mundur di Handoff #1; pelampung kecil di HP sempit di Handoff #2) belum dipastikan sudah dicek atau sengaja dibiarkan. Diputuskan dibahas saat VIS.06.

**Belum dikerjakan / saran giliran berikutnya:**

- VIS.06 (cek visual ringan di beberapa HP, tanpa bukti). Sekalian cek gerak card, reduce-motion, dan dua catatan VIS.05 di atas.
- VIS.07 (sungai), VIS.08 (laut), VIS.09 (pilih lokasi) sesuai TODO sheet.
- Blok ini disusun dari sesi dan screenshot, tanpa log tes panjang.

### Handoff #4 | 2026-11-04 | [germano]

**Selesai: VIS.07 (sungai) dan VIS.08 (laut), masing-masing satu suasana statis, lalu suasana pagi, sore, malam untuk keduanya.** Low-Risk, hanya tampilan. Dicek lewat render Chrome (pratinjau gambar), belum dicek langsung di HP.

- Berkas baru (4): `public/img/sungai.svg`, `public/img/laut.svg`, `public/lokasi-sungai.js`, `public/lokasi-laut.js`. Cetakan JS sama dengan `lokasi-danau.js` (`LokasiSungai.buat()` dan `LokasiLaut.buat()`; kelas wadah `sungai` dan `laut`).
- Berkas berubah (1): `public/style.css`, file utuh, isi lama tidak dihapus (1204 jadi 1665 baris). Blok baru di paling bawah: SUNGAI, pelampung sungai, LAUT, pelampung laut, lalu suasana pagi/sore/malam untuk sungai dan laut. Pelampung memakai keyframes milik danau.
- `img/sungai.svg`: air diperpanjang ke bawah untuk menutup celah tipis di tepi bawah yang tembus ke warna langit (terlihat di sore dan malam).
- `sw.js`: yang perlu ditambah ke `BERKAS_DASAR` (dikerjakan tim sendiri, AI memandu; tanpa OK baru): `lokasi-sungai.js`, `lokasi-laut.js`, `img/sungai.svg`, `img/laut.svg`. sw.js: sudah ditambah tim sendiri (4 Nov 2026) di BERKAS_DASAR: lokasi-sungai.js, lokasi-laut.js, img/sungai.svg, img/laut.svg. NAMA_CACHE tetap santuy-v1. Tidak ada entri lama yang dihapus.
- `index.html` dan `mancing.js` **tidak diubah**. Sungai dan laut belum tampil di game sampai VIS.09.

**Keputusan baru (ketua, 4 Nov 2026):** VIS.06 (cek visual ringan di beberapa HP) **ditunda sampai setelah VIS.09**. Ini menggantikan saran di Handoff #3 yang menaruh VIS.06 sebagai langkah berikutnya, dan menggantikan urutan di bagian 5 (VIS.06 sebelum VIS.07). Yang paling akhir menang. Urutan sekarang: VIS.09, lalu VIS.06. Alasan belum tercatat.

**Pilihan bawaan penulis, belum ditanyakan ke tim:**

- Palet warna sungai dan laut (semua suasana) dan bentuk pemandangannya. Sungai: aliran menyamping, pohon dan batu di tepian, dermaga kecil. Laut: pulau di cakrawala, perahu layar, camar, pantai pasir di dua sudut bawah. Camar hilang saat malam.
- Dua catatan lama VIS.05 (jarak kosong antara danau dan hitung mundur; pelampung kecil di HP sempit) belum disentuh. Ikut dibahas di VIS.06.

**Belum dikerjakan / saran giliran berikutnya:**

- **VIS.09** (layar pilih lokasi plus tombol Ganti lokasi). Menyentuh `mancing.js` dan `index.html`. Hal yang perlu diketahui:
  - `mancing.js` sekarang memasang danau saja: memanggil `window.LokasiDanau` dan tempat sementara berkelas `danau`. Kelas `lempar`, `gigit`, serta suasana (`pagi`, `sore`, `malam`) dipasang ke wadah aktif, jadi bekerja juga untuk `sungai` dan `laut` karena CSS-nya sudah disiapkan.
  - `index.html` perlu tag `<script src="lokasi-sungai.js">` dan `<script src="lokasi-laut.js">` sebelum `mancing.js`.
  - Pilihan bawaan di blok "Pilihan lokasi di awal mancing" (2 Nov 2026): lokasi hanya diingat selama game terbuka, tanpa perubahan database. Belum ditanyakan ke tim.
- **VIS.06** setelah VIS.09, sekalian cek tiga lokasi di HP, gerak card, dan reduce-motion.
- Blok ini disusun dari sesi, bukan dari log tes di HP. Isi persis `mancing.js` yang akan diubah di VIS.09 sebaiknya dibaca dari berkas yang ada, bukan ditebak.
