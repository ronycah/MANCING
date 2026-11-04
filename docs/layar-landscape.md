# layar-landscape.md — Layar Landscape & Tata Letak Tombol

Dokumen fitur untuk **Mancing Santuy (PWA)**. Prefix ID sheet: **LAY**.

> Dibuat 4 Nov 2026 atas arahan dosen via Zoom pagi hari itu. Arahan ini dikerjakan di **versi pertama** (bukan ditunda ke versi kedua), karena waktu 2 minggu dinilai masih cukup panjang.
> Butir **bonus yang terkait aspek visual** (BNS.10, BNS.11, BNS.13) juga dikerjakan di versi 1, tetapi **dicatat di `bonus.md`**, bukan di dokumen ini (KL13 sampai KL17).
> Aturan di `AGENTS.md` tetap berlaku. Bila ada selisih, `AGENTS.md` yang menang.

---

## 1. Latar Belakang

Dosen menilai progres semua kelompok sudah bagus, tetapi ada hal yang perlu disesuaikan. Untuk game ini, dosen meminta:

1. Game **berbasis landscape**. Saat pemain pertama masuk, langsung memilih lokasi, lalu layar **dipaksa landscape**. Beberapa kelompok belum menerapkan ini, dan akibatnya tombol-tombol terasa membuat salah fokus.
2. **Tombol-tombol disatukan**, misalnya lewat ikon pengaturan.
3. **Animasi ikan tertangkap/lepas** tampil di tengah layar, di atas gambar lokasi.
4. Perubahan ini punya **md sendiri** (dokumen ini) dan ikut dinilai seperti md lain.
5. **Sheet TODO** disesuaikan dengan pola yang sudah ada.
6. Butir di `bonus.md` yang terkait **aspek visual** dikerjakan di **versi 1**, dan md-nya **digabungkan** (tidak membuat md baru). Tim mencatatnya dengan pola catatan susulan di bawah `bonus.md` (KL14).

Ini perubahan **tampilan dan tata letak saja**. Aturan permainan, server, dan database tidak berubah.

## 2. Tabel Keputusan

Kolom "Sumber" menunjukkan asal keputusan. Yang bertanda **pilihan bawaan penulis** belum ditanyakan ke tim dan boleh diganti.

| No   | Keputusan                                                                                                                                                                                                                                                                                                                                                                                          | Sumber                                                                                                                                                                           |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KL1  | Game berbasis **landscape**. Layar dipaksa landscape setelah pemain memilih lokasi.                                                                                                                                                                                                                                                                                                                | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL2  | Begitu pemain masuk, **langsung ke layar pilih lokasi**, tanpa layar perantara. Setelah lokasi dipilih, layar mancing tampil landscape. Melanjutkan VIS.09 (pilihan lokasi di layar utama).                                                                                                                                                                                                        | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL3  | **Kiri atas**: info nama tampilan, koin, dan jumlah umpan.                                                                                                                                                                                                                                                                                                                                         | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL4  | **Kanan atas**: ikon pengaturan dan ikon keluar.                                                                                                                                                                                                                                                                                                                                                   | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL5  | Ikon pengaturan membuka panel yang berisi **ganti nama** dan **ganti password**.                                                                                                                                                                                                                                                                                                                   | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL6  | Tombol **Keluar** menjadi **ikon saja** (tanpa teks).                                                                                                                                                                                                                                                                                                                                              | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL7  | Animasi ikan tertangkap atau lepas muncul **di tengah layar, di atas gambar lokasi**. Menggantikan posisi di bawah gambar pada tampilan portrait.                                                                                                                                                                                                                                                  | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL8  | Tombol lain yang sudah ada (misal Ganti lokasi, Tas/Album, Jual) **disesuaikan dengan kebutuhan** agar layar tidak ramai. Dosen menyerahkan penyesuaian ini ke tim.                                                                                                                                                                                                                                | Arahan dosen: "sesuaikan dengan kebutuhan"                                                                                                                                       |
| KL9  | Tombol **Ganti lokasi** dimasukkan ke panel pengaturan, sedangkan tombol utama permainan (lempar kail, album/tas) tetap terlihat di layar mancing.                                                                                                                                                                                                                                                 | Keputusan tim, 4 Nov 2026                                                                                                                                                        |
| KL10 | Pemaksaan landscape memakai **dua lapis**: (a) mengunci orientasi bila perangkat mendukung, (b) bila HP masih tegak, tampil layar pesan **"Putar HP ke posisi landscape"** yang menutup game sampai HP diputar.                                                                                                                                                                                    | Keputusan tim, 4 Nov 2026                                                                                                                                                        |
| KL11 | **Layar login** tidak diubah dalam pekerjaan ini. Landscape mulai berlaku dari layar pilih lokasi.                                                                                                                                                                                                                                                                                                 | Dosen menyatakan login boleh tetap (lisan, Zoom 4 Nov 2026); keputusan tim                                                                                                       |
| KL12 | Tidak ada perubahan database, Edge Function, atau aturan permainan. Semua butir bertipe **Low-Risk**.                                                                                                                                                                                                                                                                                              | Turunan aturan `AGENTS.md` bagian 9                                                                                                                                              |
| KL13 | Butir `bonus.md` yang terkait **aspek visual** dikerjakan di **versi 1**, tidak menunggu fitur inti selesai seperti aturan awal `bonus.md` bagian 1 dan 3.                                                                                                                                                                                                                                         | Arahan dosen (tambahan), 4 Nov 2026                                                                                                                                              |
| KL14 | Butir bonus visual **tidak digabung ke dokumen ini**. Polanya tetap: md fitur tidak ditulis ulang, revisi ditambahkan sebagai **blok catatan susulan di bagian bawah `bonus.md`**, dan butir yang dipilih masuk sheet dengan prefix **BNS**. Dokumen ini hanya untuk landscape dan tata letak tombol.                                                                                              | Keputusan tim, 4 Nov 2026 (tafsiran atas "md digabungkan" dari dosen)                                                                                                            |
| KL15 | Butir bonus visual yang dikerjakan di versi 1 (dicatat di `bonus.md`): **BNS.10** (filter dan urutan album), **BNS.11** (efek Epic dan Legendary), **BNS.13** (cuaca). BNS.15 (landscape) dikerjakan lewat dokumen ini. **Belum dikerjakan dan tetap bonus**: pencapaian (BNS.04), hadiah harian (BNS.05), Cara Main dan Tentang (BNS.14), suara (BNS.12), ikon aplikasi (BNS.22), dan butir lain. | Keputusan tim, 4 Nov 2026, mengacu `features.md` bag. 8. BNS.13 (cuaca) dikonfirmasi tim sebagai visual. BNS.10 dan BNS.22 adalah pilihan bawaan penulis, belum dikonfirmasi tim |
| KL16 | BNS.15 (tampilan mendatar) **sudah terjawab**: dosen meminta landscape. Dikerjakan lewat KL1 sampai KL7 (LAY.01 sampai LAY.03), bukan lagi menunggu jawaban.                                                                                                                                                                                                                                       | Arahan dosen, 4 Nov 2026                                                                                                                                                         |
| KL17 | Layar bonus yang dikerjakan nanti (pencapaian, hadiah harian, Cara Main dan Tentang) **juga memakai landscape**, dibuka lewat tombol ikon tambahan. Letak dan bentuk ikonnya belum diputuskan.                                                                                                                                                                                                     | Keputusan tim, 4 Nov 2026                                                                                                                                                        |

## 3. Alur Pemain

1. Pemain login (tampilan login tidak berubah, lihat KL11).
2. Langsung masuk **layar pilih lokasi** (danau, sungai, laut).
3. Pemain memilih lokasi. Layar mancing tampil dalam **landscape**.
4. Di layar mancing:
   - **Kiri atas**: nama tampilan, koin, jumlah umpan.
   - **Kanan atas**: ikon pengaturan dan ikon keluar.
   - **Tengah**: gambar lokasi, tempat lemparan dan gigitan terjadi.
5. Saat ikan tertangkap atau lepas, animasi hasil muncul **di tengah layar, di atas gambar lokasi**.
6. Ikon pengaturan dibuka: panel berisi ganti nama dan ganti password (ditambah Ganti lokasi, KL9). Panel bisa ditutup kembali ke permainan.

## 4. Aturan yang Paling Sering Terlanggar

1. **Jangan mengubah logika game.** Lemparan, umpan, rarity, koin, dan jual tetap dihitung di server. Pekerjaan ini hanya memindahkan dan menata tampilan.
2. **Fungsi lama tidak dihapus.** Ganti nama, ganti password, keluar, dan ganti lokasi tetap memakai fungsi yang sudah ada. Yang berubah hanya letak dan bentuk tombolnya (dari teks menjadi ikon, dari berserakan menjadi satu panel). Bila ada kode lama yang memang harus dihapus, sebut bagian mana dan kenapa, lalu tunggu "OK" (`AGENTS.md` bagian 2).
3. **Semua gaya tetap di `public/style.css`.** Tanpa CDN, tanpa pustaka ikon dari luar. Ikon dibuat dengan SVG atau karakter bawaan, konsisten dengan gaya kartun flat.
4. **Berkas JS atau berkas game baru** wajib ditambahkan ke daftar `BERKAS_DASAR` di `sw.js` (catatan 2 Nov 2026 di `AGENTS.md`). Menambah nama berkas dikerjakan tim sendiri; perubahan lain di `sw.js` tetap butuh "OK" ketua.
5. **Teks dari server dan input pemain** tetap lewat `textContent`, bukan `innerHTML`.
6. **Jam HP tidak dipakai** untuk apa pun (aturan waktu dari server tidak berubah).
7. **Tes tidak bisa dilakukan di iPhone** karena tim tidak punya perangkatnya (`AGENTS.md` bagian 9). Pemaksaan landscape dicek di HP Android dan di browser komputer. Dukungan kunci orientasi berbeda antar perangkat, itulah alasan KL10 memakai layar cadangan "Putar HP".

## 5. Urutan Pekerjaan (untuk Sheet TODO)

Semua butir **Low-Risk**. Status awal **Belum**. Kolom "Sumber" di sheet diisi `layar-landscape.md bag. 5`. Prioritas mengikuti `AGENTS.md` bagian 9.

| ID     | Fitur             | Tugas                                                                                               | Prioritas | Tipe     | Catatan untuk sheet                                                                                                                   |
| :----- | :---------------- | :-------------------------------------------------------------------------------------------------- | :-------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| LAY.01 | Layar landscape   | Setelah login, pemain langsung masuk layar pilih lokasi tanpa layar perantara (KL2).                | P1        | Low-Risk | Melanjutkan VIS.09.                                                                                                                   |
| LAY.02 | Layar landscape   | Paksa landscape: kunci orientasi bila didukung, ditambah layar "Putar HP" saat posisi tegak (KL10). | P1        | Low-Risk | Cek di Android dan browser komputer. iPhone tidak bisa dites.                                                                         |
| LAY.03 | Layar landscape   | Tata letak layar pilih lokasi dan layar mancing disesuaikan ke landscape.                           | P1        | Low-Risk | Setelah LAY.02. Hanya tampilan.                                                                                                       |
| LAY.04 | Tata letak tombol | Info nama, koin, dan jumlah umpan di kiri atas (KL3).                                               | P1        | Low-Risk | Setelah LAY.03.                                                                                                                       |
| LAY.05 | Tata letak tombol | Ikon pengaturan di kanan atas, membuka panel ganti nama dan ganti password (KL4, KL5).              | P1        | Low-Risk | Fungsi lama dipakai ulang, tidak ditulis ulang.                                                                                       |
| LAY.06 | Tata letak tombol | Tombol Keluar menjadi ikon saja di kanan atas, di samping ikon pengaturan (KL4, KL6).               | P2        | Low-Risk | Setelah LAY.05.                                                                                                                       |
| LAY.07 | Tata letak tombol | Rapikan tombol lain (Ganti lokasi, Tas/Album, Jual) sesuai kebutuhan (KL8, KL9).                    | P2        | Low-Risk | Bila KL9 diganti tim, ikuti keputusan tim.                                                                                            |
| LAY.08 | Animasi           | Animasi ikan tertangkap atau lepas tampil di tengah layar, di atas gambar lokasi (KL7).             | P1        | Low-Risk | Hanya tampilan, tidak mempengaruhi hasil. Setelah LAY.03.                                                                             |
| LAY.09 | Penutup           | Visual sanity check landscape di beberapa HP, dan cek PWA: versi baru muncul setelah update.        | P2        | Low-Risk | Dikerjakan paling akhir, setelah BNS.10, BNS.11, dan BNS.13. Tidak perlu bukti. Bila ada berkas baru, cek sudah masuk `BERKAS_DASAR`. |

## 6. Hubungan dengan Dokumen Lain

- **`pemandangan-ikan.md`**: letak animasi tangkapan (VIS.03, VIS.05b) berubah dari "di bawah gambar" menjadi "di tengah, di atas gambar lokasi" (KL7). Bila ada pertentangan, **catatan paling akhir menang**.
- **`akun.md`**: ganti nama dan ganti password hanya **pindah tempat** ke panel pengaturan. Aturan akunnya tidak berubah.
- **`mancing.md`** dan **`tas-jual.md`**: aturan tidak berubah. Hanya letak tombol dan tampilannya yang disesuaikan.
- **`bonus.md`**: BNS.15 (landscape) dikerjakan lewat dokumen ini. Butir bonus visual BNS.10, BNS.11, dan BNS.13 dicatat di blok catatan susulan `bonus.md`, bukan di sini (KL14).
- **VIS.09** (pilihan lokasi di layar utama, sudah selesai 4 Nov 2026): dasar alur KL2.

## 7. Ditunda / Belum Diputuskan

- Bentuk akhir ikon (pengaturan dan keluar) dan isi lengkap panel pengaturan: diputuskan saat pengerjaan, dicatat di Catatan Susulan.
- Penempatan tombol Tas/Album dan Jual (KL8): diputuskan saat pengerjaan.
- Letak dan bentuk ikon tambahan untuk layar bonus nanti (KL17).
- Konfirmasi tim: BNS.10 (filter album) dihitung visual, dan BNS.22 (ikon aplikasi) tetap di bonus (KL15).

---

## Catatan Susulan

_(Bagian ini hanya ditambah di akhir, tidak ada yang dihapus. Format: `### YYYY-MM-DD: topik`. Bila bertentangan dengan isi di atas, yang paling akhir menang.)_

### 2026-11-04: Lokasi dilupakan setiap pemain baru masuk (LAY.01)

- Kejadian di lapangan: saat tes LAY.01, akun baru yang masuk di tab yang sama langsung tiba di danau tanpa layar pilih lokasi. Penyebabnya, lokasi yang dipilih disimpan di variabel `lokasiTerpilih` (`mancing.js`) dan tidak dikosongkan saat Keluar, sehingga terbawa ke akun berikutnya.
- Keputusan: lokasi dikosongkan setiap kali pemain masuk (`mulai()` di `nama.js` memanggil `lupakanLokasi()` dari `mancing.js`). Setelah login pemain selalu memilih lokasi dulu, sesuai KL2. Membuka Tas Ikan lalu kembali tetap mengingat lokasi.
- Bertentangan dengan catatan 2 Nov 2026 di `AGENTS.md` ("lokasi hanya diingat selama game terbuka") untuk kasus pergantian akun di tab yang sama. Yang paling akhir menang: lokasi tetap diingat selama satu sesi login, tapi tidak terbawa ke login berikutnya. Tidak ada perubahan database.
- Tambahan LAY.01: selama layar pilih lokasi tampil, judul Halo, Umpan, Koin, serta tombol Tas Ikan, Ganti nama, dan Ganti password disembunyikan. Tombol Keluar tetap tampil sampai LAY.06 mengubahnya menjadi ikon.
- Alasan keputusan selain di atas belum tercatat.

### Handoff #1 | 2026-11-04 | [fren]

- **Tugas:** LAY.01 selesai dan sudah dites (akun lama langsung ke pilih lokasi, akun baru isi nama lalu pilih lokasi, Keluar lalu masuk akun lain, buka Tas Ikan lalu kembali). LAY.02 belum dikerjakan, baru direncanakan.
- **File yang diubah:** `public/nama.js` dan `public/mancing.js`. `style.css`, `sw.js`, dan `manifest.json` tidak diubah.
- **Keputusan baru:**
  - Lokasi dilupakan setiap pemain baru masuk (lihat blok 2026-11-04 di Catatan Susulan).
  - Rencana LAY.02, pilihan bawaan penulis, belum dikonfirmasi tim: (1) kunci orientasi lewat JS setelah masuk layar permainan, dilepas saat keluar; (2) layar "Putar HP" lewat CSS `orientation: portrait`; (3) layar Pilih nama untuk akun baru boleh tetap tegak; (4) `manifest.json` tidak diubah supaya login tidak ikut terkunci landscape (KL11).
- **Masalah yang belum beres:** tidak ada untuk LAY.01. Catatan untuk LAY.02: aturan sembunyi `[hidden]` di `style.css` hanya berlaku di dalam `.mancing`, jadi elemen di luar itu tidak mempan disembunyikan lewat `hidden`. Kunci orientasi di browser biasa sering gagal (butuh layar penuh atau PWA terpasang), itulah alasan layar "Putar HP". iPhone tidak bisa dites.
- **Saran giliran berikutnya:** lampirkan `AGENTS.md`, `layar-landscape.md` (beserta catatan susulan), `nama.js`, `akun.js`, `style.css`, dan `index.html` terbaru. `akun.js` wajib dibaca dulu untuk menemukan semua jalan kembali ke layar login (Keluar, sesi habis, reset password), supaya layar "Putar HP" dan kunci orientasi pasti dilepas di semua jalan itu. Setelah LAY.02, lanjut LAY.03.

### 2026-11-04: Cara paksa landscape bekerja (LAY.02)

- Keputusan (pilihan bawaan penulis dari Handoff #1, dipakai tanpa perubahan): kunci orientasi dicoba lewat JS (`screen.orientation.lock`), dan layar "Putar HP" menutup game lewat CSS saat HP tegak (KL10). `manifest.json` tidak diubah supaya layar login tidak ikut terkunci (KL11).
- Cakupan: landscape wajib berlaku selama pemain di layar permainan, yaitu layar utama (termasuk pilih lokasi), Tas Ikan, Ganti nama, dan Ganti password. Layar login dan layar Pilih nama untuk akun baru boleh tegak. Tempatnya di `nama.js` (kelas `wajib-landscape` di body, layar `.putar-hp` dibuat dari JS); gayanya di akhir `style.css`. Tidak ada berkas baru.
- Dilepas saat kembali ke layar Masuk: tombol Keluar, sesi habis, login baru (`mulai()`), dan sesi berakhir dari tab lain (pendengar `SIGNED_OUT`). `akun.js` tidak diubah.
- Efek samping yang diketahui: saat HP tegak, layar "Putar HP" menutup seluruh layar, termasuk tombol Keluar. Pemain harus memutar HP dulu untuk keluar.
- Hasil tes: browser komputer (emulasi iPhone 16, tegak dan mendatar) sesuai harapan. HP Android: layar "Putar HP" dan Keluar berjalan. Sekali muncul glitch sesaat setelah Keluar lalu memutar HP ke tegak (tombol sempat hilang, fokus ketikan lepas tiap huruf), hilang sendiri dan tidak muncul pada percobaan ulang; dianggap kebiasaan Chrome saat rotasi, bukan kesalahan kode. iPhone tidak dites (KL10).
- Alasan keputusan selain di atas belum tercatat.

### Handoff #2 | 2026-11-04 | [KEN]

- **Tugas:** LAY.02 selesai dan sudah dites (browser komputer dan HP Android). LAY.03 belum dikerjakan.
- **File yang diubah:** `public/nama.js` dan `public/style.css`. `akun.js`, `index.html`, `sw.js`, dan `manifest.json` tidak diubah. Tidak ada berkas baru, jadi `BERKAS_DASAR` tidak perlu diubah.
- **Keputusan baru:** lihat blok "Cara paksa landscape bekerja (LAY.02)" di atas.
- **Masalah yang belum beres:**
  - Di landscape, layar pilih lokasi dan layar mancing masih tampil bertumpuk satu kolom dan harus digulir. Itu pekerjaan LAY.03.
  - Kunci orientasi di tab Chrome biasa sering ditolak; yang bekerja layar "Putar HP". Hasil di PWA terpasang belum dilaporkan.
  - Tombol Keluar tertutup saat HP tegak (lihat efek samping di atas). Ubah hanya bila tim memutuskan lain.
  - Glitch fokus sekali setelah rotasi (lihat hasil tes di atas): pantau, kejar hanya bila sering muncul.
- **Saran giliran berikutnya:** lampirkan `AGENTS.md`, `layar-landscape.md` (beserta catatan susulan), `nama.js`, `style.css`, `index.html`, `mancing.js`, `lokasi-danau.js`, `lokasi-sungai.js`, dan `lokasi-laut.js` terbaru. Lanjut LAY.03 (tata letak pilih lokasi dan layar mancing di landscape), lalu LAY.04.

### 2026-11-04: Layar mancing penuh seperti game pada umumnya (revisi tata letak LAY.03 sampai LAY.08)

- Keputusan: gambar lokasi tampil **layar penuh** di landscape, dan semua tombol berada **di atas gambar itu** (melayang), bukan di kolom terpisah. Menggantikan tata letak dua kolom (gambar kiri, kontrol kanan) yang dibuat di LAY.03, dan menggantikan "gambar di tengah" di Alur Pemain no. 4.
- Tombol **Lempar Kail** menjadi tombol **bulat, transparan, di kanan bawah**. Info nama, koin, dan umpan tetap di kiri atas (KL3). Ikon pengaturan dan keluar tetap di kanan atas (KL4). Tombol lain disimpan di dalam panel pengaturan, mirip game pada umumnya. Kartu hasil tetap muncul di tengah gambar (KL7).
- Tombol **Tas Ikan tidak masuk panel pengaturan**: tetap terlihat di layar, sejajar dengan tombol Lempar Kail (di sebelah kirinya, kanan bawah), berbentuk ikon emoji tas. Sesuai KL9 (tombol utama permainan tetap terlihat). Keputusan tim, 4 Nov 2026. Letak persisnya (di kiri tombol Lempar) adalah tafsiran penulis atas "sejajar dengan Lempar".
- Sumber: ingatan anggota tim dari Zoom dosen 4 Nov 2026, dikonfirmasi ketua. Tidak ada rekaman atau screenshot. Pemicu: kelompok lain yang sudah landscape tetapi gambar lokasinya tidak penuh diminta revisi.
- Dikonfirmasi tim (4 Nov 2026): panel pengaturan berisi **ganti nama, ganti password, dan Ganti lokasi** (KL9), dibuka lewat ikon/emoji gerigi. Ikon **keluar** sejajar dengan ikon pengaturan di kanan atas. Bentuk bulat dan transparan tombol Lempar Kail serta letak Tas Ikan dianggap sesuai, tetapi masih berupa bayangan tim; tingkat transparan dan ukurannya boleh disesuaikan setelah dilihat langsung di HP.
- Temuan tes LAY.03 di HP (4 Nov 2026): album Tas Ikan di landscape masih satu kolom sempit (2 kotak per baris) dan memanjang ke bawah. Ditambahkan butir baru **LAY.08a** (ubah tampilan album di landscape, misal 4 kolom), hanya tampilan; isi album dan aturan jual (`tas-jual.md`) tidak berubah.
- Dampak: LAY.03 versi dua kolom diganti; LAY.04 sampai LAY.08 dikerjakan dengan gaya melayang ini. Tetap hanya tampilan, tanpa perubahan database atau aturan permainan (KL12).
- Alasan keputusan selain di atas belum tercatat.

### Handoff #3 | 2026-11-04 | [RAC]

- **Tugas:** LAY.03 versi dua kolom (gambar lokasi di kiri, kontrol di kanan) dikerjakan dan dites di browser komputer dan HP. Hasilnya berjalan, tetapi **arah tata letak berubah** setelah tim mengonfirmasi arahan Zoom (lihat blok "Layar mancing penuh seperti game pada umumnya" di atas), jadi LAY.03 belum dicentang dan versi dua kolom hanya tahap antara. Belum ada kode untuk tata letak baru.
- **File yang diubah:** hanya `public/style.css` (dua blok ditambah di paling bawah: "TATA LETAK LANDSCAPE ... (LAY.03)" dan "LAY.03 (lanjutan)"). `nama.js`, `mancing.js`, `index.html`, `sw.js`, dan `manifest.json` tidak diubah. Tidak ada berkas baru, jadi `BERKAS_DASAR` tidak perlu diubah.
- **Keputusan baru:** gambar lokasi layar penuh dengan semua tombol melayang di atasnya; Lempar Kail bulat transparan di kanan bawah dengan Tas Ikan 🎒 di sebelah kirinya; ikon gerigi ⚙️ (isi: ganti nama, ganti password, Ganti lokasi) dan ikon keluar di kanan atas; info nama, koin, dan umpan di kiri atas. Rincian di blok catatan susulan 2026-11-04. Butir baru LAY.08a (album Tas Ikan di landscape) sudah ditambah ke sheet.
- **Masalah yang belum beres:**
  - Dua blok landscape di `style.css` memakai tata letak dua kolom. Giliran berikutnya cukup menimpanya dengan blok baru di bawahnya; menghapus blok lama butuh penjelasan bagian mana dan "OK" (`AGENTS.md` bagian 2).
  - Pembuatan ikon gerigi, panel pengaturan, dan tombol melayang hampir pasti butuh mengubah `nama.js` dan `mancing.js` (letak tombol), bukan CSS saja.
  - Diputuskan tim (4 Nov 2026, rapat 4 anggota, mengikuti saran penulis): layar Tas Ikan, Ganti nama, dan Ganti password **tetap berupa kartu putih** seperti sekarang; hanya layar mancing dan layar pilih lokasi yang penuh. Alasan lain belum tercatat.
  - Bentuk bulat, ukuran, dan tingkat transparan tombol Lempar Kail masih bayangan tim; setel setelah dilihat langsung di HP (diputuskan tim: disetel belakangan).
  - Efek samping lama masih berlaku: tombol Keluar tertutup saat HP tegak (Handoff #2). iPhone tidak bisa dites.
- **Saran giliran berikutnya:** lampirkan `AGENTS.md`, `layar-landscape.md` (beserta semua catatan susulan), `nama.js`, `mancing.js`, `tas.js`, `password.js`, `style.css`, dan `index.html` terbaru. Kerjakan berurutan: gambar layar penuh dan tombol Lempar bulat dulu (LAY.03 revisi), lalu info kiri atas (LAY.04), ikon gerigi dan panel (LAY.05), ikon keluar (LAY.06), Tas Ikan di samping Lempar (LAY.07), hasil di tengah gambar (LAY.08), lalu album (LAY.08a).

<!-- Tempel di PALING BAWAH docs/layar-landscape.md (setelah Handoff #3). Dua blok, urut dari atas ke bawah. Ganti [NAMA] dengan nama PIC. -->

### 2026-11-04: LAY.03 versi layar penuh selesai, potongan gambar condong ke bawah

- Dikerjakan sesuai blok "Layar mancing penuh seperti game pada umumnya": di landscape, gambar lokasi (danau, sungai, laut) tampil **layar penuh**, kartu putih di layar mancing hilang, dan semua tombol serta info melayang di atas gambar. Tombol Lempar Kail bulat transparan di kanan bawah; hasil tangkapan tampil di tengah gambar (versi dasar, animasi masih LAY.08). Hanya `public/style.css` yang berubah (blok baru di paling bawah). Blok dua kolom lama tidak dihapus, hanya tertimpa.
- Cara kerja gambar: SVG lokasi (4:3) diperbesar sampai menutup layar dan kelebihannya dipotong ("cover"). Berkas SVG dan `lokasi-*.js` tidak diubah.
- Kejadian di lapangan (tes HP Android, layar sangat lebar sekitar 2,1:1): dengan potongan di tengah, dermaga di bagian bawah gambar nyaris tidak terlihat, paling parah di sungai (dermaga sungai mulai lebih rendah dari danau dan laut). Perbaikan: potongan dibuat **condong ke bawah** (gambar diposisikan 80% dari atas, bukan 50% tengah). Akibatnya dermaga dan pelampung terlihat, tetapi langit paling atas lebih banyak terpotong, sehingga **matahari atau bulan bisa tidak terlihat di HP yang sangat lebar**. Warna langit (pagi, siang, sore, malam) tetap terlihat. Ini pilihan bawaan penulis dan boleh disetel tim (misal 65% bila ingin matahari terlihat, dengan dermaga lebih sedikit).
- Masih sementara (dikerjakan di butir berikutnya): info nama, umpan, dan koin di kiri atas serta tombol Tas Ikan, Ganti nama, Ganti password, Keluar, dan Ganti lokasi masih berupa teks kecil melayang di pojok (menunggu LAY.05 sampai LAY.07). Ukuran (88px) dan transparan (55%) tombol Lempar Kail masih bayangan tim, boleh disetel setelah dilihat di HP.
- Hasil tes: browser komputer (emulasi Pixel 9 mendatar) untuk danau, sungai, dan laut sesuai: gambar penuh, pelampung muncul dan tersentak, kartu hasil di tengah, Ganti lokasi kembali ke layar pilih lokasi. HP Android: tampilan sesuai setelah perbaikan dermaga. iPhone tidak dites (KL10).
- Alasan keputusan selain di atas belum tercatat.

### Handoff #4 | 2026-11-04 | [antok]

- **Tugas:** LAY.03 (versi layar penuh) selesai dan dites di browser komputer dan HP Android. LAY.04 secara tampilan sudah terpenuhi sementara (info kiri atas ada); tim yang memutuskan apakah dicentang atau menunggu perapian. LAY.05 sampai LAY.08a belum dikerjakan.
- **File yang diubah:** hanya `public/style.css` (blok "LAY.03 (revisi 4 Nov 2026)" ditambah di paling bawah, sekitar 380 baris). `nama.js`, `mancing.js`, `tas.js`, `password.js`, `index.html`, `sw.js`, dan `manifest.json` tidak diubah. Tidak ada berkas baru, jadi `BERKAS_DASAR` tidak perlu diubah.
- **Keputusan baru:** lihat blok 2026-11-04 di atas (potongan gambar condong ke bawah).
- **Masalah yang belum beres:**
  - Tombol akun (Tas Ikan, Ganti nama, Ganti password, Keluar) dan Ganti lokasi masih teks kecil di kanan atas. Di HP kecil barisan atas bisa melipat jadi dua baris dan menimpa Ganti lokasi; hilang setelah LAY.05.
  - Dua blok landscape lama (dua kolom) masih ada di `style.css` dan tertimpa blok baru. Dibiarkan; menghapusnya butuh penjelasan bagian mana dan "OK" (`AGENTS.md` bagian 2).
  - Layar pilih lokasi masih memakai tata letak lama (kartu putih, tiga tombol berjajar), tidak diubah.
  - Album Tas Ikan di landscape masih dua kolom sempit (LAY.08a).
  - Efek samping lama masih berlaku: tombol Keluar tertutup saat HP tegak. iPhone tidak bisa dites.
- **Saran giliran berikutnya:** lampirkan `AGENTS.md`, `layar-landscape.md` (beserta semua catatan susulan), `nama.js`, `mancing.js`, `tas.js`, `password.js`, `style.css` terbaru, dan `index.html`. Kerjakan LAY.05 dan LAY.06 bersama: ikon gerigi ⚙️ dan ikon keluar di kanan atas, panel berisi ganti nama, ganti password, dan Ganti lokasi (fungsi lama dipakai ulang; butuh ubah `nama.js` dan `mancing.js`, dan tombol Ganti lokasi pindah ke panel). Lanjut LAY.07 (Tas Ikan 🎒 di kiri tombol Lempar), LAY.08 (animasi hasil), lalu LAY.08a (album).

### 2026-11-04: Ikon pengaturan, panel, dan ikon keluar selesai (LAY.05 dan LAY.06)

- Dikerjakan sesuai blok "Layar mancing penuh seperti game pada umumnya". Di layar mancing landscape, kanan atas berisi tombol Tas Ikan (masih teks sementara, menunggu LAY.07), ikon gerigi ⚙️, dan ikon keluar ❌. Ketuk gerigi membuka panel Pengaturan berisi **Ganti nama, Ganti password, dan Ganti lokasi** (KL5, KL9). Panel menutup lewat ketuk di luar panel, tombol Esc, atau ketuk area gerigi lagi. Tombol Keluar menjadi ikon saja (KL6) dan juga tampil di kanan atas layar pilih lokasi; gerigi disembunyikan di layar pilih lokasi (LAY.01).
- Cara kerja: Ganti nama dan Ganti password memakai tombol lama yang dipindah ke panel, jadi fungsinya tidak ditulis ulang. Ganti lokasi menekan tombol milik `mancing.js` (class `tombol-ganti-lokasi`) yang disembunyikan lewat CSS di layar mancing landscape. Dengan begitu aturan "tidak bisa ganti lokasi saat lemparan berjalan" tetap berlaku (Ganti lokasi di panel ikut mati selama lemparan). `mancing.js` tidak diubah. Yang berubah hanya `public/nama.js` dan `public/style.css`; CSS ditambah di paling bawah, blok lama tidak dihapus.
- Ikon keluar memakai emoji silang ❌ (bukan pintu 🚪), dan ukuran emoji dinaikkan menjadi 1.7rem karena versi awal terlalu kecil dan kurang menarik. Keputusan penguji (AIK) setelah tes di HP, 4 Nov 2026; belum dikonfirmasi anggota tim lain. Urutan ikon (gerigi, lalu keluar paling kanan) adalah pilihan bawaan penulis.
- Kejadian di lapangan: kenaikan ukuran emoji awalnya tidak berpengaruh di layar mancing, karena aturan tombol akun lama (`.aksi .tombol`, 0.8rem) lebih kuat daripada aturan ikon yang baru. Diperbaiki dengan selector `.tombol.tombol-ikon.sekunder` di blok landscape paling bawah. Pelajaran: bila aturan CSS baru tidak mempan, cek dulu apakah ada aturan lama yang lebih kuat di blok layar penuh LAY.03 (revisi). Terpisah dari itu, setelah push berkas lama bisa tertahan di cache; paksa muat ulang sebelum menyimpulkan kodenya salah.
- Tidak ada pertentangan dengan catatan sebelumnya. Blok ini melengkapi blok "Lokasi dilupakan setiap pemain baru masuk (LAY.01)" (Keluar menjadi ikon, seperti yang dijanjikan di sana) dan blok "Layar mancing penuh seperti game pada umumnya".
- Hasil tes (AIK): ikon, panel, dan Keluar berjalan di browser komputer dan HP Android. iPhone tidak dites (KL10).
- Alasan keputusan selain di atas belum tercatat.

### Handoff #5 | 2026-11-04 | [AIK]

- **Tugas:** LAY.05 dan LAY.06 selesai dan sudah dites (browser komputer dan HP Android). LAY.04 tampilannya sudah OK menurut tim, centangnya menunggu LAY.07 dan layar utuh terlihat. LAY.07 sampai LAY.09 belum dikerjakan.
- **File yang diubah:** `public/nama.js` dan `public/style.css` (blok "LAY.05 dan LAY.06" ditambah di paling bawah). `mancing.js`, `tas.js`, `password.js`, `index.html`, `sw.js`, dan `manifest.json` tidak diubah. Tidak ada berkas baru, jadi `BERKAS_DASAR` tidak perlu diubah. Di `nama.js` hanya tiga baris lama yang disentuh (tanda tangan `buatTombolKeluar`, daftar `bagianUtama`, pemanggilan Keluar), tanpa penghapusan; baris lama yang diganti penguji dibiarkan sebagai komentar.
- **Keputusan baru:** lihat blok "Ikon pengaturan, panel, dan ikon keluar selesai (LAY.05 dan LAY.06)" di atas.
- **Masalah yang belum beres:**
  - Tas Ikan masih tombol teks di kanan atas (menunggu LAY.07).
  - Dua blok landscape lama (dua kolom) masih ada di `style.css` dan tertimpa blok baru. Menghapusnya butuh penjelasan bagian mana dan "OK" ketua (`AGENTS.md` bagian 2).
  - Layar pilih lokasi masih memakai tata letak lama (kartu putih, tiga tombol berjajar).
  - Album Tas Ikan di landscape masih dua kolom sempit (LAY.08a).
  - Panel pengaturan tidak menutup otomatis saat lemparan mulai (hanya Ganti lokasi di dalamnya yang mati). Menutup otomatis butuh ubah `mancing.js`.
  - Ukuran ikon (1.7rem) serta ukuran dan transparan tombol Lempar Kail (88px, 55%) masih boleh disetel di HP.
  - Efek samping lama masih berlaku: Keluar tertutup saat HP tegak, dan glitch fokus sekali setelah rotasi (pantau). iPhone tidak bisa dites.
- **Saran giliran berikutnya:** lampirkan `AGENTS.md`, `layar-landscape.md` (beserta semua catatan susulan), `nama.js`, `mancing.js`, `tas.js`, `style.css` terbaru, dan `index.html`. Kerjakan LAY.07 (Tas Ikan 🎒 jadi tombol ikon di kiri tombol Lempar Kail, kanan bawah; tombolnya dibuat di `nama.js` dalam kelompok `.aksi`, jadi kemungkinan perlu ubah `nama.js` dan CSS). Lanjut LAY.08 (animasi hasil di tengah gambar), LAY.08a (album), lalu LAY.09 (penutup, paling akhir). Setelah LAY.07, LAY.04 bisa dicentang.

<!-- Tempel di PALING BAWAH docs/layar-landscape.md (setelah Handoff #5). Ganti [NAMA] dengan nama PIC. -->

### Handoff #6 | 2026-11-04 | [kevin]

- **Tugas:** LAY.07 selesai dan sudah dites (browser komputer dan HP Android, juga dicek beberapa anggota tim). LAY.04 sudah bisa dicentang, karena syaratnya (layar utuh terlihat setelah LAY.07) terpenuhi. LAY.08 sampai LAY.09 belum dikerjakan.
- **File yang diubah:** `public/nama.js` dan `public/style.css` (blok "LAY.07" ditambah di paling bawah). `mancing.js`, `tas.js`, `password.js`, `index.html`, `sw.js`, dan `manifest.json` tidak diubah. Tidak ada berkas baru, jadi `BERKAS_DASAR` tidak perlu diubah. Di `nama.js` tidak ada yang dihapus: dua baris lama (pembuatan tombol teks "Tas Ikan" dan `aksi.appendChild(tas)`) dibiarkan sebagai komentar.
- **Keputusan baru:**
  - Tombol Tas Ikan menjadi ikon 🎒 (tanpa teks, dengan `aria-label` "Tas Ikan"). Tombolnya dipasang langsung di kartu utama (bukan di `.aksi`), kelas `tombol-tas`, supaya bisa melayang di kanan bawah. Fungsi kliknya tidak berubah. Saat layar pilih lokasi tampil, tombol tetap disembunyikan lewat daftar `bagianUtama` (LAY.01).
  - Usulan ketua (4 Nov 2026, setelah dilihat di HP): Tas Ikan dan Lempar Kail **dibuat sama besar**, karena Tas versi awal (56px) terlihat jauh lebih kecil dari Lempar (88px). Ukuran akhir **72px** untuk keduanya, jarak 12px, rata bawah. Teks "Lempar Kail" turun jadi dua baris supaya muat. Ukuran 88px di blok LAY.03 (revisi) tidak dihapus, hanya ditimpa blok LAY.07 (menimpa catatan "88px" di blok LAY.03 revisi dan Handoff #3 sampai #5; yang paling akhir menang).
  - Angka 72px dan transparan 55% dipilih setelah dilihat di HP dan dianggap sudah pas oleh penguji dan teman-teman. Alasan lain belum tercatat.
- **Masalah yang belum beres:**
  - Dua blok landscape lama (dua kolom) masih ada di `style.css` dan tertimpa blok baru. Menghapusnya butuh penjelasan bagian mana dan "OK" ketua (`AGENTS.md` bagian 2).
  - Layar pilih lokasi masih memakai tata letak lama (kartu putih, tiga tombol berjajar).
  - Album Tas Ikan di landscape masih dua kolom sempit (LAY.08a).
  - Panel pengaturan tidak menutup otomatis saat lemparan mulai (hanya Ganti lokasi di dalamnya yang mati); menutup otomatis butuh ubah `mancing.js`.
  - Efek samping lama masih berlaku: Keluar tertutup saat HP tegak, dan glitch fokus sekali setelah rotasi (pantau). iPhone tidak bisa dites.
- **Saran giliran berikutnya:** lampirkan `AGENTS.md`, `layar-landscape.md` (beserta semua catatan susulan), `nama.js`, `mancing.js`, `tas.js`, `style.css` terbaru, dan `index.html`. Kerjakan LAY.08 (animasi ikan tertangkap atau lepas di tengah layar, di atas gambar lokasi; kartu hasil sudah di tengah versi dasar, tinggal animasinya, murni tampilan). Lanjut LAY.08a (album Tas Ikan di landscape, misal 4 kolom; butuh `tas.js` dan `style.css`), lalu LAY.09 (penutup, paling akhir setelah BNS.10, BNS.11, dan BNS.13).
