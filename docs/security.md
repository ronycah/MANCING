docs/security.md

# Security & Known Limitations — Game Mancing

Aturan keamanan wajib (invarian), batasan yang diketahui, dan tes keamanan. Tanpa kode. Struktur data dan aturan akses ada di `docs/database.md`.

> **Status:** kerangka awal. Catatan susulan ditempel **append-only di bagian 4**; yang paling akhir menang.

---

## 1. ⚠️ Aturan Keamanan Wajib (Invarian)

1. **Tabel tertutup untuk aplikasi.** RLS aktif tanpa policy untuk aplikasi; semua akses lewat Edge Function (`service_role`, tanpa DELETE).
2. **Identitas dari server.** Pemain dikenali dari token login yang dibaca di server. Dilarang percaya ID, nama, umpan, koin, atau hasil yang dikirim aplikasi.
3. **Token diverifikasi paling awal.** Edge Function di-deploy `--no-verify-jwt`, jadi **fungsi itu sendiri wajib mengecek token** sebelum melakukan apa pun. Tanpa token atau token palsu: 401.
4. **Logika game di server dan atomik.** Cek umpan, kurangi umpan, undi hasil, dan simpan terjadi dalam satu fungsi SQL. Tidak ada tulis-database yang dikendalikan frontend atau dipecah di Edge Function.
5. **Fungsi SQL:** `SECURITY DEFINER`, `search_path` kosong, skema `public.` eksplisit, `EXECUTE` hanya untuk `service_role`.
6. **Waktu dari jam server.** Jam HP tidak boleh mempengaruhi umpan maupun tampilan waktu.
7. **Rahasia tidak masuk repo.** `service_role` key dan secret Edge Function hanya di dashboard. Repo ini **public**: tidak ada password, kunci rahasia, email, atau nomor HP pribadi di berkas mana pun, termasuk md dan riwayat commit. Yang boleh di `config.js` hanya URL project dan kunci publik (anon/publishable).
8. **Password hanya dikelola Supabase Auth.** Tidak pernah disimpan atau dicatat sendiri.
9. **Sanitasi output.** Teks dari server dan input pemain lewat `textContent`, bukan `innerHTML`.
10. **Galat aman.** Pesan galat mentah dari server tidak ditampilkan; tampilkan pesan Bahasa Indonesia yang umum.
11. **Service worker.** `sw.js` hanya menangani file game dari domain sendiri (GET), tidak mencegat atau meng-cache panggilan ke Supabase. Strategi network first.
12. **Free tier.** Tidak upgrade ke paket berbayar. Tidak memakai Docker, VPS, atau self-host.
13. **Perubahan berisiko** (RLS, fungsi SQL, Edge Function, pengaturan, `sw.js`, login, hapus data) wajib dijelaskan dampaknya dan "OK" ketua. Satu environment saja, jadi salinan SQL harus ada di repo sebelum dijalankan.
14. **Akun testing** memakai email dummy.

## 2. Batasan yang Diketahui (Diterima)

- **Hanya ada production.** Bug bisa langsung terlihat pemain. Diterima (arahan dosen) dan dijadikan bahan belajar; tiap crash dicatat (`AGENTS.md` bagian 2 butir 10).
- **Project gratis dijeda otomatis** bila lama tidak aktif. Mitigasi: buka rutin, cek sebelum penilaian, simpan SQL di repo.
- **Konfigurasi publik terlihat di kode web.** Normal; perlindungan ada di RLS dan pengecekan token di fungsi.
- **Tanpa rate limit khusus** selain bawaan Supabase. Ditunda.
- **Tanpa verifikasi email** untuk pendaftaran **[FINAL?]**. Ditunda.
- **Pemain bisa membuka devtools** dan memanggil fungsi berulang. Dampaknya dibatasi oleh umpan yang dihitung di server.

## 3. Tes Keamanan Wajib (butuh bukti)

Tes keamanan dan data pemain **wajib ada bukti** (hasil query, balasan server, atau tampilan dashboard); tanpa bukti jangan diberi lulus. Semuanya **P0**.

| ID     | Skenario                                                                 | Hasil yang benar                            |
| :----- | :----------------------------------------------------------------------- | :------------------------------------------ |
| SEC-01 | Panggil fungsi game tanpa token                                          | Ditolak 401                                 |
| SEC-02 | Panggil fungsi game dengan token palsu atau kedaluwarsa                  | Ditolak 401                                 |
| SEC-03 | Baca atau tulis tabel langsung memakai kunci publik (tanpa lewat fungsi) | Ditolak atau kosong, tidak ada data         |
| SEC-04 | Panggil fungsi SQL game langsung dengan kunci publik                     | Ditolak                                     |
| SEC-05 | Akun A memanggil `lempar`: data akun B tidak berubah                     | Hanya data A berubah                        |
| SEC-06 | Kirim `umpan`, `koin`, `rarity`, atau `hasil` palsu di isi permintaan    | Diabaikan                                   |
| SEC-07 | Lempar saat umpan 0                                                      | Ditolak, umpan tetap 0                      |
| SEC-08 | Dua lemparan hampir bersamaan saat umpan tersisa 1                       | Hanya satu berhasil, umpan tidak negatif    |
| SEC-09 | Ubah jam HP maju atau mundur                                             | Jumlah umpan dan jam tampilan tidak berubah |
| SEC-10 | Umpan tidak melebihi batas `umpan_maks` setelah lama tidak main          | Berhenti di batas                           |
| SEC-11 | Ikan lepas tetap mengurangi 1 umpan                                      | Umpan berkurang, tidak ada ikan masuk tas   |
| SEC-12 | Jual ikan yang tidak dimiliki atau jumlah melebihi stok                  | Ditolak                                     |
| SEC-13 | Ubah pengaturan peluang jadi total bukan 100                             | Ditolak oleh fungsi                         |
| SEC-14 | Ganti nama dengan teks panjang atau berisi tag HTML                      | Ditolak atau ditampilkan sebagai teks biasa |
| SEC-15 | Cari `service_role`, password, atau data pribadi di repo dan md          | Tidak ada                                   |
| SEC-16 | Login dan reset password di versi GitHub Pages                           | Berhasil                                    |

Kasus tes fitur lainnya ada di dokumen tes masing-masing fitur. Pengecekan sebaran rarity cukup kasar (misal 100 lemparan sekali jalan di akhir) dan tidak perlu bukti statistik ketat.

## 4. Catatan Susulan (append-only)

> Tempel blok baru di bawah garis ini. Format: `### YYYY-MM-DD: topik`. Temuan keamanan urgent tetap disampaikan langsung di chat. Yang paling akhir menang.

---
