# AGENTS.md — Game Mancing (PWA)

Panduan utama & aturan interaksi AI Agent untuk repository ini.

> 💡 **PENTING UNTUK AI AGENT**:
>
> 1. Dokumen ini adalah **Entry Point ringkas**. Isinya hanya aturan yang stabil. Status pekerjaan (sudah/belum jalan) tidak dicatat di sini.
> 2. Detail fitur ada di folder `docs/`. Buka dokumen yang relevan dengan fitur yang sedang dikerjakan; tim melampirkannya di awal sesi.
> 3. **Daftar pekerjaan (TODO) dipegang tim di Google Sheet dan tidak dibagikan ke AI** (kecuali berupa screenshot). Kerjakan apa yang diminta di chat saja.
> 4. Konteks: aplikasi ini **bukan aplikasi komersial**, tugas kuliah, jadi sesuaikan rekomendasi dan analisa dengan kondisi ini. Usahakan jawaban **ramping** supaya hemat token.
> 5. Bila ada selisih antara dokumen fitur dan `AGENTS.md`, `AGENTS.md` yang menang.

---

## 1. Latar Belakang Tim & Tujuan

- Tim 8 orang mahasiswa **Manajemen Komputer, bukan programmer**. Tidak ada yang paham coding. Semua kode ditulis AI, manusia hanya copas.
- Tujuan: **game mancing berbasis PWA** sebagai tugas kuliah. Pemain melempar kail, menangkap ikan dengan rarity **Common, Rare, Epic, Legendary**, lalu menjual ikan.
- Penilaian 50% hasil aplikasi, 50% dokumentasi dan proses. **Game kecil yang jalan stabil + md yang rapi** lebih baik daripada game besar yang berantakan.
- Pengerjaan **serial**: satu orang per giliran, satu laptop, satu akun GitHub, satu repo, tanpa branch. Deadline 2 minggu.
- Aturan permainan dasar (arahan dosen):
  - Semua pemain memakai umpan dan pancing yang **sama**. Hasil hanya ditentukan peluang rarity. Upgrade umpan/pancing adalah fitur belakangan (fitur 4 atau 5), jangan dikerjakan lebih awal.
  - Tiap lemparan memakai 1 umpan, **termasuk bila ikan lepas**. Umpan maksimal 20 dan pulih seiring waktu (awal usulan: 1 umpan per jam). Umpan habis = pemain menunggu.
  - Semua angka (jeda pulih, batas umpan, peluang rarity, peluang ikan lepas) **disimpan di database dan bisa diatur, tidak ditulis mati di kode**.
  - **Rarity dan hasil tangkapan diputuskan di server**, bukan di HP pemain.
  - Login dengan email, ada nama tampilan yang bisa diganti (boleh sama antar pemain), dan bisa ganti password.
  - Satu lokasi. Tampilan pemandangan menyesuaikan **waktu WIB**. Jam HP tidak boleh mempengaruhi jumlah umpan maupun tampilan waktu.
  - Ikan digambar dari satu SVG dasar yang warnanya diubah script sesuai rarity.

## 2. ⚠️ Aturan Interaksi AI (WAJIB)

1. **Dilarang menulis kode tanpa permintaan eksplisit.** Jangan menghasilkan blok kode, SQL, atau implementasi lengkap kecuali user meminta (contoh: "buatkan kodenya", "gas"). Fokus awal sesi: diskusi strategi.
2. **Dilarang menghapus atau menimpa kode lama.** Jangan hapus _dead code_, komentar, atau variabel tidak terpakai tanpa perintah eksplisit. Bila perubahan memang butuh menghapus, sebut bagian mana dan kenapa, lalu tunggu "OK".
3. **Metode share code: 1 file utuh** berdasarkan versi _latest_ yang ditempel user (berlaku untuk kode, SQL, dan konfigurasi). Tanpa placeholder seperti `// ...kode lain tetap sama...`. Satu file = satu blok kode, diawali path lengkapnya. Di awal jawaban, sebut daftar file yang berubah (idealnya 1 sampai 3 per giliran).
4. **Jangan menebak isi file.** Bila butuh file yang belum ditempel, minta ke user di awal sesi (sebut nama dan alasannya sekaligus).
5. **Konfirmasi sebelum eksekusi.** Perubahan berisiko (skema tabel, fungsi SQL, RLS, Edge Function, `sw.js`, login, pengaturan di database) wajib dijelaskan dampaknya dalam bahasa awam, lalu tunggu "OK".
6. **Bahasa UI & komentar kode: Bahasa Indonesia.**
7. **Dokumen (`docs/`) hanya diubah bila ada keputusan atau struktur data baru.** AI menulis **satu blok pendek siap tempel** berjudul `### YYYY-MM-DD: topik`, lengkap dengan nama file tujuan, yang ditempel user di **akhir** file itu (append-only). Bila blok baru bertentangan dengan isi lama, **yang paling akhir menang**, dan AI menyebut pertentangannya ke user. Jangan mengarang alasan keputusan; bila tidak tahu, tulis "alasan belum tercatat".
8. **Pekerjaan selesai = pengingat centang.** AI cukup menyebut: "butir ini sudah selesai, silakan dicentang di sheet". Pekerjaan lanjutan disebut "butir baru yang perlu ditambah ke sheet".
9. **Handoff** dibuat hanya bila user memintanya ("handoff" atau "update sesi"). Format: `### Handoff #N | tanggal | nama PIC`; isi: tugas, file yang diubah, keputusan baru, masalah yang belum beres, saran giliran berikutnya. Ringkas, tanpa log tes panjang.
10. **Crash di produksi dicatat sebagai bahan belajar.** Karena hanya ada satu environment (bagian 3), bila aplikasi rusak, AI membantu memperbaikinya, lalu menulis satu blok catatan singkat: apa yang rusak, penyebab, perbaikan, dan cara mencegahnya.

## 3. Tech Stack

- **Frontend**: Vanilla HTML + JS + CSS. **Tanpa build tool, tanpa npm, tanpa framework.**
- **Backend & DB**: **Supabase versi cloud (supabase.com), paket gratis**: Postgres, Auth (email + password), RLS, dan Edge Functions. Password dikelola Supabase, tidak pernah disimpan sendiri.
- **Hosting**: GitHub Pages dari repo ini. Semua path **relatif** terhadap `public/`, tidak diawali `/`.
- **PWA**: `manifest.json` + service worker `sw.js` dengan strategi **network first** (ambil dari internet dulu, cache hanya cadangan saat offline).
- **Pustaka Supabase** dimuat dari CDN dengan **versi dipatok** (bukan "latest").
- **Satu environment saja: production.** Tidak ada development/testing terpisah (arahan dosen: kelompok kecil, sekaligus belajar kenapa perusahaan butuh dev/test). Karena itu perubahan berisiko wajib dijelaskan dulu dan ada salinan SQL di repo sebelum dijalankan.
- **Dilarang menyarankan Docker, VPS, atau self-host.** Tidak ada setup lokal berbasis Docker (termasuk Supabase local development). Semua kerja langsung ke project Supabase cloud lewat dashboard.
- Tampilan pemandangan air dan matahari: CSS/SVG/Canvas. Gaya visual: **[ISI SETELAH SESI STRATEGI]**, dipakai konsisten oleh semua giliran.

## 4. Skala & Rekomendasi

- **Asumsi skala: maksimal 100 concurrent user.** Gunakan free tier. Jangan menyarankan arsitektur kompleks atau berbayar.
- Hemat panggilan ke server: baca status pemain **sekali saat masuk**, pegang di memori game, dan panggil server hanya saat ada aksi (lempar kail, jual ikan, ganti nama). Tidak ada polling terus-menerus.
- **Project Supabase gratis dijeda otomatis bila sekitar 1 minggu tanpa aktivitas.** Buka game atau dashboard rutin tiap beberapa hari, dan sehari sebelum penilaian. Cek aturan gratis terbaru di situs resmi Supabase sebelum final.
- Simpan salinan SQL (skema, fungsi, pengaturan) di `supabase/` sebagai cadangan.

## 5. Peta Dokumentasi

Pola dari dosen: **satu fitur = satu dokumen md + satu dokumen tes** (hanya dilampirkan di sesi tes). Daftar fitur dan nama berkas ditentukan di sesi strategi.

| Dokumen                    | Isi & Fungsi                                                                                                                                   |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **`docs/features.md`**     | Ringkasan semua fitur dan modul tampilan, status (ada/rencana/ditunda), dan catatan susulan append-only. Dokumen fitur besar dirinci terpisah. |
| **`docs/[fitur].md`**      | **[ISI]** Satu dokumen per fitur: keputusan, alur, data, keamanan, ditunda, urutan pekerjaan, handoff di bagian akhir.                         |
| **`docs/[fitur]-test.md`** | **[ISI]** Kasus uji fitur. Hanya dilampirkan di sesi tes.                                                                                      |
| **`docs/database.md`**     | Skema Supabase, RLS, fungsi SQL, pengaturan, dan workflow SQL manual.                                                                          |
| **`docs/security.md`**     | Aturan keamanan wajib dan tes keamanan.                                                                                                        |
| **`archive/`**             | Kosong sampai penilaian 2, lalu berisi md versi append-only. Bukan sumber kebenaran; tidak dilampirkan kecuali diminta.                        |

Daftar pekerjaan (TODO) ada di Google Sheet tim, bukan di repo.

## 6. Struktur Repo

```text
/AGENTS.md
/public            (root web; semua file game)
├── index.html, manifest.json, sw.js, config.js
├── *.js, *.css    (satu fitur = satu berkas kecil, usahakan di bawah ~300 baris)
└── img/           (aset gambar)
/docs              (md fitur, database, security, tes)
/archive           (md versi append-only, diisi saat penilaian 2)
/supabase          (salinan SQL dan Edge Function; struktur dikonfirmasi dosen)
├── migrations/    (SQL untuk membuat tabel dan fungsi RPC, berurutan, dijalankan manual)
└── functions/     (kode Edge Function, satu subfolder per fungsi)
```

**Dua fase penilaian md:**

- **Fase 1:** md di `docs/` berupa versi append-only (catatan hanya ditambah di bawah, yang terakhir menang).
- **Fase 2:** versi append-only **dipindah ke `archive/`**, lalu `docs/` diisi md versi rapi (catatan sudah diserap ke atas, riwayat usang dipangkas). Perapian hanya bila user meminta, satu dokumen per giliran. Keputusan dan aturan yang masih berlaku tidak boleh berubah atau hilang.

## 7. Larangan Khusus (Keamanan)

- **Tabel tertutup total untuk aplikasi.** RLS aktif tanpa policy untuk aplikasi. Semua akses lewat Edge Function (`service_role`, hak per tabel, **tanpa DELETE**). Jangan membuat aturan RLS yang rumit.
- **Logika game dihitung di server**, dalam fungsi SQL (`SECURITY DEFINER`, `search_path` kosong, skema `public.` eksplisit, `EXECUTE` hanya untuk `service_role`) yang bekerja **atomik**: cek umpan, kurangi umpan, undi hasil, simpan. Tidak ada tulis-database yang dikendalikan langsung oleh frontend atau dipecah di Edge Function.
- **Aplikasi tidak pernah mengirim** jumlah umpan, koin, rarity, atau hasil. Aplikasi hanya mengirim aksi (misal "lempar", "jual"). Identitas pemain **selalu dibaca di server dari token login**.
- **Waktu hanya dari jam server database** (`now()`). Jam HP tidak dipakai untuk menghitung umpan.
- **Edge Function di-deploy dengan `--no-verify-jwt`** (arahan dosen supaya tidak ribet), **tetapi tiap fungsi wajib memverifikasi token login sendiri paling awal**. Tanpa token atau token tidak valid: balas 401. Sebut nama fungsinya saat memandu deploy. "No JWT" artinya pengecekan dipindah ke dalam fungsi, **bukan tidak ada pengecekan**.
- **Jangan jalankan perintah migration CLI** (misal `supabase db push`). SQL dijalankan manual di SQL Editor, lalu salinannya disimpan di `supabase/migrations/`.
- **Rahasia:** `service_role` key dan secret Edge Function hanya di dashboard Supabase. **Repo ini public.** Dilarang menaruh password, `service_role`, atau data pribadi di repo, kode, md, maupun chat. Hanya URL project dan kunci publik (anon/publishable) yang boleh ada di `public/config.js`.
- Perubahan pada tabel, fungsi, atau pengaturan yang **sudah ada**, dan penghapusan data, wajib dijelaskan dampaknya dulu dan menunggu "OK".
- Semua teks dari server dan input pemain lewat `textContent`, bukan `innerHTML`. Galat mentah tidak ditampilkan ke layar.
- Daftarkan alamat GitHub Pages di pengaturan URL Auth Supabase (Site URL dan Redirect URLs), supaya login dan reset password jalan di versi online.
- Jangan ubah `sw.js`, login, atau `config.js` tanpa alasan dan konfirmasi "OK".
- Menambah gambar di `public/img/` lewat upload file di GitHub, bukan copas teks.

## 8. Cara Memandu (Pengguna Bukan Programmer)

1. Anggap yang mengobrol **bukan programmer**. Bahasa sehari-hari; jelaskan istilah teknis sekali dengan perumpamaan singkat.
2. **Satu langkah per giliran.** Tunggu hasilnya (ditempel atau di-screenshot) sebelum lanjut.
3. Tiap langkah sebutkan: buka apa, klik atau ketik apa, hasil yang benar seperti apa, dan apa yang perlu ditempel balik ke chat.
4. Sebelum mengubah apa pun, jelaskan apa yang berubah dan apakah bisa dibatalkan.
5. Kalau ada yang ambigu, **tanya dulu**. Jangan menebak.
6. Persetujuan "OK" untuk perubahan berisiko dipegang **ketua tim**. Bila yang sedang giliran bukan ketua, AI memberi **ringkasan singkat yang bisa diteruskan lewat WhatsApp** (apa yang berubah, dampaknya, bisa dibatalkan atau tidak), lalu menunggu kabar persetujuan.
7. Langkah di dashboard Supabase (SQL Editor, Edge Functions) dikerjakan dari satu akun yang sama di laptop bersama.
8. Setelah copas: nama file dan lokasi benar, isi lama benar-benar tergantikan, game terbuka di browser tanpa error.

## 9. Aturan Pengetesan

Aplikasi non-komersial, jadi pengetesan **disederhanakan**. Tes dilakukan langsung di production dengan akun dummy.

1. **Low-Risk** (tampilan, layout, CSS, animasi, teks): cukup _visual sanity check_. Bila ada glitch kecil, langsung perbaiki kodenya.
2. **High-Risk** (login, RLS, fungsi SQL, Edge Function, umpan dan koin, rarity, `sw.js`): tes teliti dan terstruktur. Keamanan dan data pemain **wajib ada bukti** (hasil query atau balasan server); tanpa bukti jangan diberi lulus. Yang hanya tampilan tidak perlu bukti.
3. **Prioritas temuan:** P0 (data, login, keamanan, umpan, koin) wajib dites dan langsung dilaporkan bila gagal. P1 (fitur pendukung) dilaporkan satu baris. P2 (tampilan, teks) dites sekilas dan tidak dibahas kecuali fitur mati total. Ragu yang menyangkut data atau akses akun: anggap P0.
4. **Tes awal ringan:** 1 sampai 3 akun dummy. Tidak perlu simulasi 100 user di tiap giliran.
5. **Cek skala 100 user di akhir:** perkirakan jumlah panggilan per sesi pemain terhadap batas free tier, lalu uji ramai-ramai sederhana (beberapa HP dan akun bersamaan).
6. Tes PWA: setelah update, versi baru muncul di HP (network first), dan game tetap bisa dibuka offline (login dan aksi game tetap butuh internet).

## 10. Pola Sesi

- **Sesi pertama = diskusi strategi, belum coding.** Hasil yang dituju: md fitur, md database dan security, serta urutan pekerjaan untuk TODO sheet. Jangan buru-buru ke kode. Usahakan sesi ini tidak terpotong.
- Sesi kode: lampirkan `AGENTS.md` + dokumen fitur terkait + file terbaru yang relevan. Tes: tambah dokumen tes. Handoff hanya bila diminta.
- Awal sesi, AI membaca: `AGENTS.md`, dokumen fitur, catatan susulan, lalu handoff paling akhir.
- Satu giliran = satu tugas kecil dan 1 sampai 3 file.
