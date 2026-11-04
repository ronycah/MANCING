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
