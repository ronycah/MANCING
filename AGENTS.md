# AGENTS.md — Mancing Santuy (PWA)

Panduan utama & aturan interaksi AI Agent untuk repository ini.

> 💡 **PENTING UNTUK AI AGENT**:
>
> 1. Dokumen ini adalah **Entry Point ringkas**. Isinya hanya aturan yang stabil. Status pekerjaan (sudah/belum jalan) tidak dicatat di sini.
> 2. Detail fitur ada di folder `docs/`. Buka dokumen yang relevan dengan fitur yang sedang dikerjakan; tim melampirkannya di awal sesi.
> 3. **Daftar pekerjaan (TODO) dipegang tim di Google Sheet dan tidak dibagikan ke AI** (kecuali berupa screenshot). Kerjakan apa yang diminta di chat saja.
> 4. Konteks: aplikasi ini **bukan aplikasi komersial**, tugas kuliah, jadi sesuaikan rekomendasi dan analisa dengan kondisi ini. Usahakan jawaban **ramping** supaya hemat token.
> 5. Bila ada selisih antara dokumen fitur dan `AGENTS.md`, `AGENTS.md` yang menang.
> 6. **Dokumen fitur sudah final dari sesi strategi.** Sesi kode **tidak merapikan, menulis ulang, atau menambah panjang md**. Md hanya ditambah blok catatan bila ada keputusan baru atau kejadian di lapangan (aturan 7).

---

## 1. Latar Belakang Tim & Tujuan

- Tim 8 orang mahasiswa **Manajemen Komputer, bukan programmer**. Tidak ada yang paham coding. Semua kode ditulis AI, manusia hanya copas.
- Tujuan: **game mancing berbasis PWA bernama "Mancing Santuy"** sebagai tugas kuliah. Pemain melempar kail, menangkap ikan dengan rarity **Common, Rare, Epic, Legendary**, mengisi album koleksi, lalu menjual ikan.
- Penilaian 50% hasil aplikasi, 50% dokumentasi dan proses. **Game kecil yang jalan stabil + md yang rapi** lebih baik daripada game besar yang berantakan.
- Pengerjaan **serial**: satu orang per giliran, satu laptop Mac bersama, satu akun GitHub, satu repo, tanpa branch. Deadline 2 minggu. Pekerjaan bisa berpindah tangan di tengah jalan lewat handoff.
- Aturan permainan dasar (arahan dosen dan keputusan tim):
  - Semua pemain memakai umpan dan pancing yang **sama**. Hasil hanya ditentukan peluang rarity. Upgrade umpan/pancing adalah fitur belakangan, jangan dikerjakan lebih awal.
  - Tiap lemparan memakai 1 umpan, **termasuk bila ikan lepas**. Umpan maksimal 20 dan pulih seiring waktu. Umpan habis = pemain menunggu.
  - Semua angka (jeda pulih, batas umpan, umpan awal, peluang rarity, peluang ikan lepas, harga jual) **disimpan di database dan bisa diatur, tidak ditulis mati di kode**. Nilai awal ada di `docs/database.md`.
  - **Rarity dan hasil tangkapan diputuskan di server**, bukan di HP pemain. Tap saat gigitan hanya animasi.
  - Login dengan email, ada nama tampilan yang bisa diganti (boleh sama antar pemain), bisa ganti password, dan ada jalan keluar bila lupa password (reset manual oleh tim).
  - Satu lokasi: **danau**, gaya visual **kartun flat**. Tampilan menyesuaikan **waktu WIB dari jam server**. Jam HP tidak boleh mempengaruhi jumlah umpan maupun tampilan waktu.
  - Ikan digambar dari satu SVG dasar yang warnanya diubah script (dibuat pihak di luar AI). Nama ikan bergaya fantasi, tidak terikat air tawar atau asin.

## 2. ⚠️ Aturan Interaksi AI (WAJIB)

1. **Dilarang menulis kode tanpa permintaan eksplisit.** Jangan menghasilkan blok kode, SQL, atau implementasi lengkap kecuali user meminta (contoh: "buatkan kodenya", "gas"). Fokus awal sesi: diskusi singkat.
2. **Dilarang menghapus atau menimpa kode lama.** Jangan hapus _dead code_, komentar, atau variabel tidak terpakai tanpa perintah eksplisit. Bila perubahan memang butuh menghapus, sebut bagian mana dan kenapa, lalu tunggu "OK".
3. **Metode share code: 1 file utuh** berdasarkan versi _latest_ yang ditempel user (berlaku untuk kode, SQL, dan konfigurasi). Tanpa placeholder seperti `// ...kode lain tetap sama...`. Satu file = satu blok kode, diawali path lengkapnya. Di awal jawaban, sebut daftar file yang berubah (idealnya 1 sampai 3 per giliran). Kode **wajib dicopas dari chat**, tidak ditulis langsung di editor.
4. **Jangan menebak isi file.** Bila butuh file yang belum ditempel, minta ke user di awal sesi (sebut nama dan alasannya sekaligus).
5. **Konfirmasi sebelum eksekusi.** Perubahan berisiko (skema tabel, fungsi SQL, RLS, Edge Function, `sw.js`, `pages.yml`, login, pengaturan di database) wajib dijelaskan dampaknya dalam bahasa awam, lalu tunggu "OK".
6. **Bahasa UI & komentar kode: Bahasa Indonesia.**
7. **Dokumen (`docs/`) final dari sesi strategi dan tidak dirapikan di sesi kode.** Dokumen hanya ditambah bila ada **keputusan baru atau kejadian di lapangan** saat sesi kode. Caranya: AI **bertanya atau meringkas dulu**, lalu setelah user setuju menulis **satu blok pendek siap tempel** berjudul `### YYYY-MM-DD: topik`, lengkap dengan nama file tujuan, yang ditempel di bagian **Catatan Susulan** di akhir file itu (append-only). Bila blok baru bertentangan dengan isi lama, **yang paling akhir menang**, dan AI menyebut pertentangannya ke user. Jangan mengarang alasan keputusan; bila tidak tahu, tulis "alasan belum tercatat".
8. **Pekerjaan selesai = pengingat centang.** AI cukup menyebut: "butir ini sudah selesai, silakan dicentang di sheet". Pekerjaan lanjutan disebut "butir baru yang perlu ditambah ke sheet".
9. **Handoff** dibuat hanya bila user memintanya ("handoff" atau "update sesi"), misalnya saat pekerjaan akan diteruskan anggota lain. Format: `### Handoff #N | tanggal | nama PIC`; isi: tugas, file yang diubah, keputusan baru, masalah yang belum beres, saran giliran berikutnya. Ringkas, tanpa log tes panjang. Ditempel di bagian akhir dokumen fitur terkait.
10. **Crash di produksi dicatat sebagai bahan belajar.** Karena hanya ada satu environment (bagian 3), bila aplikasi rusak, AI membantu memperbaikinya, lalu menulis satu blok catatan singkat: apa yang rusak, penyebab, perbaikan, dan cara mencegahnya.

## 3. Tech Stack

- **Frontend**: Vanilla HTML + JS + CSS. **Tanpa build tool, tanpa npm, tanpa framework.**
- **Backend & DB**: **Supabase versi cloud (supabase.com), paket gratis, wilayah Singapura**: Postgres, Auth (email + password), RLS, dan Edge Functions. Password dikelola Supabase, tidak pernah disimpan sendiri.
- **Hosting**: **GitHub Pages lewat GitHub Actions** (`.github/workflows/pages.yml` menerbitkan folder `public/`; disetujui dosen). Semua path **relatif** terhadap `public/`, tidak diawali `/`. Nama berkas huruf kecil, tanpa spasi.
- **PWA**: `manifest.json` + service worker `sw.js` dengan strategi **network first** (ambil dari internet dulu, cache hanya cadangan saat offline). Nama aplikasi "Mancing Santuy", nama pendek "Santuy".
- **Pustaka Supabase** dimuat dari CDN dengan **versi dipatok** (bukan "latest").
- **Satu environment saja: production.** Tidak ada development/testing terpisah (arahan dosen). Karena itu perubahan berisiko wajib dijelaskan dulu dan ada salinan SQL di repo sebelum dijalankan.
- **Dilarang menyarankan Docker, VPS, atau self-host.** Tidak ada setup lokal Supabase. Semua kerja langsung ke project Supabase cloud lewat dashboard.
- **CLI:** hanya satu perintah yang diizinkan, **`supabase functions deploy <nama> --use-api --no-verify-jwt`** (arahan dosen). Migration CLI (misal `supabase db push`) dilarang.
- **Deploy di Mac bersama (aturan Handoff #4 `fondasi.md`, menang atas "login satu kali" di F11):** Mac ini juga dipakai pemilik laptop untuk project Supabase miliknya yang sudah login di CLI. **Dilarang** menjalankan `supabase login`, `supabase projects list`, `supabase link`, dan `brew upgrade` (abaikan pemberitahuan "versi CLI baru"). Urutan deploy, satu langkah per giliran, dari folder MANCING:
  1. Ambil kode project: `PROJECT_REF=$(grep -o '[a-z0-9]*\.supabase\.co' public/config.js | cut -d. -f1)`, lalu cek hasilnya.
  2. Ketua menempel token akses dari penyimpanan amannya, hanya di satu jendela Terminal, tanpa tampil di layar: `read -rs "SUPABASE_ACCESS_TOKEN?Tempel token lalu tekan Enter: "; export SUPABASE_ACCESS_TOKEN; echo`. Token **tidak boleh** ditempel ke chat, repo, atau md.
  3. Deploy: `supabase functions deploy <nama> --use-api --no-verify-jwt --project-ref "$PROJECT_REF"`. Perintah ini wajib memakai `--project-ref` supaya tidak nyasar ke project pemilik laptop.
  4. Tutup jendela Terminal, lalu cek di jendela baru: `echo "[${SUPABASE_ACCESS_TOKEN:+ada}]"` harus menampilkan `[]`.
     AI tidak boleh memberi perintah deploy tanpa urutan ini.
- **Git lewat terminal** di Mac bersama (`git status`, `git add .`, `commit`, `push`). Gambar ikut di-push dari terminal bersama berkas lain.
- Tampilan: CSS/SVG/Canvas, gaya **kartun flat**, dipakai konsisten oleh semua giliran. **CSS ditulis sendiri tanpa CDN** (tanpa Bootstrap, Tailwind, atau Google Fonts; font bawaan sistem), dan **semua gaya terpusat di satu berkas `public/style.css`** supaya tampilan konsisten dan mudah dirawat (arahan dosen, 1 Nov 2026).

## 4. Skala & Rekomendasi

- **Asumsi skala: maksimal 100 concurrent user.** Gunakan free tier. Jangan menyarankan arsitektur kompleks atau berbayar.
- Hemat panggilan ke server: baca status pemain **sekali saat masuk**, pegang di memori game, dan panggil server hanya saat ada aksi (lempar kail, jual ikan, ganti nama). Tidak ada polling terus-menerus.
- **Project Supabase gratis dijeda otomatis bila sekitar 1 minggu tanpa aktivitas.** Buka game atau dashboard rutin tiap beberapa hari, dan sehari sebelum penilaian. Cek aturan gratis terbaru di situs resmi Supabase sebelum final.
- Simpan salinan SQL (skema, fungsi, pengaturan) di `supabase/` sebagai cadangan.

## 5. Peta Dokumentasi

Pola dari dosen: **satu fitur = satu dokumen md + satu dokumen tes** (hanya dilampirkan di sesi tes; dibuat belakangan di sesi tes, setelah kodenya jalan). Dokumen yang sudah ada:

| Dokumen                        | Isi & Fungsi                                                                                                     | Prefix ID sheet |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------- | :-------------- |
| **`docs/features.md`**         | Peta besar semua fitur, status, aturan umum tampilan. Dibaca sekali untuk orientasi.                             | —               |
| **`docs/fondasi.md`**          | Repo, Supabase, terbit online, PWA dasar, CLI.                                                                   | FND             |
| **`docs/akun.md`**             | Daftar, login, nama tampilan, ganti dan lupa password.                                                           | AKN             |
| **`docs/mancing.md`**          | Lempar kail, umpan, ikan lepas, kelas, katalog 16 ikan.                                                          | MCG             |
| **`docs/tas-jual.md`**         | Tas/album koleksi, jual, koin.                                                                                   | TAS             |
| **`docs/pemandangan-ikan.md`** | Danau WIB, gambar SVG ikan, animasi.                                                                             | VIS             |
| **`docs/bonus.md`**            | Antrean fitur tambahan (setelah inti stabil).                                                                    | BNS             |
| **`docs/[fitur]-test.md`**     | Kasus uji per fitur. Hanya dilampirkan di sesi tes.                                                              | —               |
| **`docs/database.md`**         | Skema Supabase, RLS, pengaturan, fungsi server, workflow SQL.                                                    | —               |
| **`docs/security.md`**         | Aturan keamanan wajib dan tes keamanan SEC-01 sampai SEC-18.                                                     | —               |
| **`archive/`**                 | Kosong sampai penilaian 2, lalu berisi md versi lama. Bukan sumber kebenaran; tidak dilampirkan kecuali diminta. | —               |

Tiap dokumen fitur memuat tabel keputusan bernomor, alur, **"aturan yang paling sering terlanggar"**, urutan pekerjaan (untuk TODO sheet), dan ditunda. Daftar pekerjaan (TODO) ada di Google Sheet tim, bukan di repo.

## 6. Struktur Repo

```text
/AGENTS.md
/.github/workflows/pages.yml  (penerbitan folder public/ ke GitHub Pages)
/public            (root web; semua file game)
├── index.html, manifest.json, sw.js, config.js
├── style.css      (CSS terpusat semua layar, ditulis sendiri, tanpa CDN)
├── *.js           (satu fitur = satu berkas kecil, usahakan di bawah ~300 baris)
└── img/           (aset gambar)
/docs              (md fitur, database, security, tes)
/archive           (md versi lama, diisi saat penilaian 2)
/supabase          (salinan SQL dan Edge Function)
├── migrations/    (SQL untuk membuat tabel dan fungsi RPC, berurutan, dijalankan manual)
└── functions/     (kode Edge Function, satu subfolder per fungsi)
```

**Dua fase penilaian md:**

- **Fase 1:** md di `docs/` seperti adanya (dokumen final dari sesi strategi, ditambah blok catatan susulan dari sesi kode, hanya bila ada).
- **Fase 2:** versi fase 1 **dipindah ke `archive/`**, lalu `docs/` diisi md versi rapi oleh Qwen (catatan susulan sudah diserap ke atas, riwayat usang dipangkas). Perapian hanya bila user meminta, satu dokumen per giliran. Keputusan dan aturan yang masih berlaku tidak boleh berubah atau hilang.

## 7. Larangan Khusus (Keamanan)

- **Tabel tertutup total untuk aplikasi.** RLS aktif tanpa policy untuk aplikasi. Semua akses lewat Edge Function (`service_role`, hak per tabel, **tanpa DELETE**). Jangan membuat aturan RLS yang rumit.
- **Logika game dihitung di server**, dalam fungsi SQL (`SECURITY DEFINER`, `search_path` kosong, skema `public.` eksplisit, `EXECUTE` hanya untuk `service_role`) yang bekerja **atomik**: cek umpan, kurangi umpan, undi hasil, simpan (dan jual: cek stok, kurangi, tambah koin). Tidak ada tulis-database yang dikendalikan langsung oleh frontend atau dipecah di Edge Function.
- **Aplikasi tidak pernah mengirim** jumlah umpan, koin, harga, rarity, atau hasil. Aplikasi hanya mengirim aksi (misal "lempar", "jual"). Identitas pemain **selalu dibaca di server dari token login**.
- **Waktu hanya dari jam server database** (`now()`). Jam HP tidak dipakai untuk menghitung umpan maupun menentukan tampilan waktu.
- **Edge Function di-deploy dengan `--no-verify-jwt`** (arahan dosen), **tetapi tiap fungsi wajib memverifikasi token login sendiri paling awal**. Tanpa token atau token tidak valid: balas 401. Sebut nama fungsinya saat memandu deploy. "No JWT" artinya pengecekan dipindah ke dalam fungsi, **bukan tidak ada pengecekan**.
- **Jangan jalankan migration CLI** (misal `supabase db push`). SQL dijalankan manual di SQL Editor, lalu salinannya disimpan di `supabase/migrations/`.
- **Rahasia:** `service_role` key, secret Edge Function, **token akses Supabase CLI**, dan password sementara hanya di dashboard atau di Mac tim. **Repo ini public.** Dilarang menaruh password, `service_role`, token, email atau nomor pribadi di repo, kode, md, maupun chat. Hanya URL project dan kunci publik (anon/publishable) yang boleh ada di `public/config.js`. Email commit memakai alamat noreply GitHub. Cek `git status` sebelum `git add .`.
- Perubahan pada tabel, fungsi, atau pengaturan yang **sudah ada**, dan penghapusan data, wajib dijelaskan dampaknya dulu dan menunggu "OK".
- Semua teks dari server dan input pemain lewat `textContent`, bukan `innerHTML`. Galat mentah tidak ditampilkan ke layar.
- Alamat GitHub Pages didaftarkan di pengaturan URL Auth Supabase (Site URL dan Redirect URLs).
- Pengaturan "Confirm email" di Supabase **dimatikan** (tanpa verifikasi email). Jangan diaktifkan kembali tanpa keputusan baru.
- Jangan ubah `sw.js`, `pages.yml`, login, atau `config.js` tanpa alasan dan konfirmasi "OK".
- Gambar masuk ke `public/img/` sebagai berkas (nama huruf kecil, tanpa spasi) dan ikut di-push dari terminal, bukan dicopas sebagai teks.

## 8. Cara Memandu (Pengguna Bukan Programmer)

1. Anggap yang mengobrol **bukan programmer**. Bahasa sehari-hari; jelaskan istilah teknis sekali dengan perumpamaan singkat.
2. **Satu langkah per giliran.** Tunggu hasilnya (ditempel atau di-screenshot) sebelum lanjut.
3. Tiap langkah sebutkan: buka apa, klik atau ketik apa, hasil yang benar seperti apa, dan apa yang perlu ditempel balik ke chat.
4. Sebelum mengubah apa pun, jelaskan apa yang berubah dan apakah bisa dibatalkan.
5. Kalau ada yang ambigu, **tanya dulu**. Jangan menebak.
6. Persetujuan "OK" untuk perubahan berisiko dipegang **ketua tim**. Bila yang sedang giliran bukan ketua, AI memberi **ringkasan singkat yang bisa diteruskan lewat WhatsApp atau Telegram** (apa yang berubah, dampaknya, bisa dibatalkan atau tidak), lalu menunggu kabar persetujuan. Zoom bersama tidak wajib.
7. Langkah di dashboard Supabase (SQL Editor, Edge Functions) dikerjakan dari satu akun yang sama di laptop Mac bersama.
8. Setelah copas: nama file dan lokasi benar, isi lama benar-benar tergantikan, game terbuka di browser tanpa error.

## 9. Aturan Pengetesan

Aplikasi non-komersial, jadi pengetesan **disederhanakan**. Tes dilakukan langsung di production dengan akun dummy.

1. **Low-Risk** (tampilan, layout, CSS, animasi, teks): cukup _visual sanity check_. Bila ada glitch kecil, langsung perbaiki kodenya.
2. **High-Risk** (login, RLS, fungsi SQL, Edge Function, umpan, koin, jual, rarity, `sw.js`): tes teliti dan terstruktur. Keamanan dan data pemain **wajib ada bukti** (hasil query atau balasan server); tanpa bukti jangan diberi lulus. Yang hanya tampilan tidak perlu bukti.
3. **Prioritas temuan:** P0 (data, login, keamanan, umpan, koin) wajib dites dan langsung dilaporkan bila gagal. P1 (fitur pendukung) dilaporkan satu baris. P2 (tampilan, teks) dites sekilas dan tidak dibahas kecuali fitur mati total. Ragu yang menyangkut data atau akses akun: anggap P0.
4. **Tes awal ringan:** 1 sampai 3 akun dummy. Tidak perlu simulasi 100 user di tiap giliran.
5. **Cek skala 100 user di akhir:** perkirakan jumlah panggilan per sesi pemain terhadap batas free tier, lalu uji ramai-ramai sederhana (beberapa HP dan akun bersamaan).
6. Tes PWA: setelah update, versi baru muncul di HP (network first), dan game tetap bisa dibuka offline (login dan aksi game tetap butuh internet).
7. Pengetesan tidak bisa dilakukan di iphone karena tidak ada device

## 10. Pola Sesi

- **Sesi strategi = tanya jawab singkat, belum coding.** Satu pertanyaan per giliran dengan opsi dan rekomendasi; ringkasan pendek, bukan draf panjang. Hasil akhirnya dikirim sekali sebagai md final (bisa berupa berkas yang diunduh). Hanya dipakai bila ada fitur baru yang belum punya dokumen.
- **Sesi kode:** lampirkan `AGENTS.md` + dokumen fitur terkait + file terbaru yang relevan. Kerjakan langkah dari bagian "Urutan pekerjaan" dokumen fitur. Tes: tambah dokumen tes. Handoff hanya bila diminta.
- Awal sesi, AI membaca: `AGENTS.md`, dokumen fitur, lalu catatan susulan dan handoff paling akhir.
- Satu giliran = satu tugas kecil dan 1 sampai 3 file.

### 2026-11-02: Reset password lewat email (menggantikan "reset manual oleh tim")

Keputusan ketua: reset password lewat link email dengan Gmail SMTP tim, ditekan dari dashboard Supabase. Menggantikan butir "reset manual oleh tim" di bagian 1 (goal akun) dan aturan password sementara. "Confirm email" tetap mati (bagian 8). App password Gmail termasuk rahasia (bagian 7): hanya di dashboard Supabase. Rincian di blok `akun.md` dan `security.md` tanggal yang sama.

### 2026-11-02: Berkas JS baru wajib didaftarkan di cache `sw.js`

Keputusan ketua: tiap berkas JS (atau berkas game lain) yang ditambahkan ke `public/` wajib ikut ditambahkan ke daftar `BERKAS_DASAR` di `sw.js`, supaya tersimpan di cache dan game tetap bisa dibuka offline. Berkas yang lupa didaftarkan membuat game offline bisa setengah rusak tanpa langsung ketahuan. Muncul dari MCG.03, saat `mancing.js` ditambahkan. Mengubah `sw.js` tetap butuh "OK" ketua (bagian 7), dan cukup menambah satu nama berkas di daftar tanpa menghapus yang lama. Cek setelah terbit: berkas baru muncul di DevTools > Application > Cache Storage > `santuy-v1`, dan halaman tetap terbuka saat Network diset Offline. Alasan lain belum tercatat.
