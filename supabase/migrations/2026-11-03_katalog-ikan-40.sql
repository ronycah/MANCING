-- supabase/migrations/2026-11-03_katalog-ikan-40.sql
-- KAT.05: katalog ikan menjadi 40 ikan (Common 16, Rare 12, Epic 8, Legendary 4), satu gambar per ikan.
--   1) 16 ikan lama: kolom kode_gambar diganti dari kunci pendek (misal sisik-pasir) menjadi jalur
--      lengkap (misal img/ikan/sisik-pasir.webp). Nama, kelas, dan status aktif ikan lama TIDAK diubah.
--   2) 24 ikan baru ditambahkan (12 Common, 8 Rare, 4 Epic), semuanya aktif.
-- Tidak mengubah struktur tabel, hak akses, tabel pemain, tangkapan, pengaturan, maupun fungsi
-- (lempar, jual, status_pemain). Aman dijalankan ulang (ikan baru yang sudah ada dilewati).
-- Bila hitungan di akhir tidak cocok, seluruh skrip dibatalkan (tidak ada yang tersimpan).
-- Rujukan: docs/katalog-ikan.md (KT1 sampai KT9).

begin;

-- 1. Ganti kode_gambar 16 ikan lama menjadi jalur lengkap. Harus tepat 16 baris terpengaruh.
do $$
declare
  v_jumlah integer;
begin
  update public.ikan as i
  set kode_gambar = v.kode_gambar
  from (values
    ('Sisik Pasir', 'img/ikan/sisik-pasir.webp'),
    ('Biru Mungil', 'img/ikan/biru-mungil.webp'),
    ('Ekor Lincah', 'img/ikan/ekor-lincah.webp'),
    ('Si Gelembung', 'img/ikan/si-gelembung.webp'),
    ('Sirip Senja', 'img/ikan/sirip-senja.webp'),
    ('Mata Zamrud', 'img/ikan/mata-zamrud.webp'),
    ('Ekor Pelangi', 'img/ikan/ekor-pelangi.webp'),
    ('Perak Bulan', 'img/ikan/perak-bulan.webp'),
    ('Naga Mungil', 'img/ikan/naga-mungil.webp'),
    ('Sirip Petir', 'img/ikan/sirip-petir.webp'),
    ('Pari Kristal', 'img/ikan/pari-kristal.webp'),
    ('Taring Badai', 'img/ikan/taring-badai.webp'),
    ('Naga Emas', 'img/ikan/naga-emas.webp'),
    ('Dewa Air', 'img/ikan/dewa-air.webp'),
    ('Ratu Bintang', 'img/ikan/ratu-bintang.webp'),
    ('Raja Gelombang', 'img/ikan/raja-gelombang.webp')
  ) as v(nama, kode_gambar)
  where i.nama = v.nama;

  get diagnostics v_jumlah = row_count;
  if v_jumlah <> 16 then
    raise exception 'IKAN_LAMA_TIDAK_16: %', v_jumlah;
  end if;
end;
$$;

-- 2. Tambah 24 ikan baru (kolom aktif memakai nilai bawaan true).
--    Bila sudah ada (skrip dijalankan ulang), dilewati.
insert into public.ikan (nama, kelas, kode_gambar) values
  ('Bayangan Malam', 'Common', 'img/ikan/bayangan-malam.webp'),
  ('Merah Bara', 'Common', 'img/ikan/merah-bara.webp'),
  ('Penghuni Arus', 'Common', 'img/ikan/penghuni-arus.webp'),
  ('Kilau Senja', 'Common', 'img/ikan/kilau-senja.webp'),
  ('Jejak Emas', 'Common', 'img/ikan/jejak-emas.webp'),
  ('Belang Danio', 'Common', 'img/ikan/belang-danio.webp'),
  ('Pemburu Kelam', 'Common', 'img/ikan/pemburu-kelam.webp'),
  ('Keping Darah', 'Common', 'img/ikan/keping-darah.webp'),
  ('Benteng Karang', 'Common', 'img/ikan/benteng-karang.webp'),
  ('Sutra Berkilau', 'Common', 'img/ikan/sutra-berkilau.webp'),
  ('Penjelajah Gesit', 'Common', 'img/ikan/penjelajah-gesit.webp'),
  ('Nyala Api', 'Common', 'img/ikan/nyala-api.webp'),
  ('Kilat Samudra', 'Rare', 'img/ikan/kilat-samudra.webp'),
  ('Bayu Bajra', 'Rare', 'img/ikan/bayu-bajra.webp'),
  ('Pedang Ombak', 'Rare', 'img/ikan/pedang-ombak.webp'),
  ('Pangeran Samudra', 'Epic', 'img/ikan/pangeran-samudra.webp'),
  ('Penembak Jitu', 'Rare', 'img/ikan/penembak-jitu.webp'),
  ('Sirip Siluman', 'Rare', 'img/ikan/sirip-siluman.webp'),
  ('Lembayung Purba', 'Rare', 'img/ikan/lembayung-purba.webp'),
  ('Gembong Lautan', 'Rare', 'img/ikan/gembong-lautan.webp'),
  ('Penari Gelombang', 'Rare', 'img/ikan/penari-gelombang.webp'),
  ('Perisai Berlian', 'Epic', 'img/ikan/perisai-berlian.webp'),
  ('Penguasa Amazon', 'Epic', 'img/ikan/penguasa-amazon.webp'),
  ('Kuda Samudra', 'Epic', 'img/ikan/kuda-samudra.webp')
on conflict (nama) do nothing;

-- 3. Pemeriksaan akhir. Bila ada yang tidak cocok, skrip dibatalkan.
do $$
declare
  v_total   integer;
  v_common  integer;
  v_rare    integer;
  v_epic    integer;
  v_legend  integer;
  v_salah   integer;
begin
  select count(*) into v_total  from public.ikan where aktif;
  select count(*) into v_common from public.ikan where aktif and kelas = 'Common';
  select count(*) into v_rare   from public.ikan where aktif and kelas = 'Rare';
  select count(*) into v_epic   from public.ikan where aktif and kelas = 'Epic';
  select count(*) into v_legend from public.ikan where aktif and kelas = 'Legendary';
  select count(*) into v_salah  from public.ikan
    where aktif and kode_gambar !~ '^img/ikan/[a-z0-9-]+\.webp$';

  if v_total <> 40 or v_common <> 16 or v_rare <> 12 or v_epic <> 8 or v_legend <> 4 then
    raise exception 'SEBARAN_TIDAK_SESUAI: total %, common %, rare %, epic %, legendary %',
      v_total, v_common, v_rare, v_epic, v_legend;
  end if;
  if v_salah <> 0 then
    raise exception 'KODE_GAMBAR_BUKAN_JALUR: % baris', v_salah;
  end if;
end;
$$;

commit;

-- ============================================================
-- QUERY CEK (baca-saja). Jalankan SETELAH skrip di atas, satu per satu,
-- lalu tempel hasilnya ke chat sebagai bukti. JANGAN menjalankan lempar di sini.
-- ============================================================

-- Cek 1: sebaran (harapan: Common 16, Epic 8, Legendary 4, Rare 12; total 40)
-- select kelas, count(*) as jumlah from public.ikan where aktif group by kelas order by kelas;

-- Cek 2: seluruh katalog (harapan: 40 baris, kode_gambar semuanya berbentuk img/ikan/nama.webp)
-- select id, nama, kelas, kode_gambar, aktif from public.ikan order by id;

-- Cek 3: baris yang kode_gambar-nya BUKAN jalur yang benar (harapan: 0 baris)
-- select id, nama, kode_gambar from public.ikan
-- where kode_gambar !~ '^img/ikan/[a-z0-9-]+\.webp$';

-- Cek 4: nama kembar (harapan: 0 baris)
-- select nama, count(*) from public.ikan group by nama having count(*) > 1;

-- Cek 5: hak tabel ikan tidak berubah (harapan: anon dan authenticated semua false; service_role hanya select = true)
-- select r.rolname,
--        has_table_privilege(r.rolname, 'public.ikan', 'select') as can_select,
--        has_table_privilege(r.rolname, 'public.ikan', 'insert') as can_insert,
--        has_table_privilege(r.rolname, 'public.ikan', 'update') as can_update,
--        has_table_privilege(r.rolname, 'public.ikan', 'delete') as can_delete
-- from (values ('anon'), ('authenticated'), ('service_role')) as r(rolname)
-- order by r.rolname;

-- ============================================================
-- PEMULIHAN (hanya bila perlu; jalankan SEBAGAI SKRIP BARU, jangan bersama skrip di atas).
-- Mengembalikan keadaan sebelum KAT.05 tanpa menghapus baris:
--   a) ikan baru dinonaktifkan (tidak ikut undian, tidak tampil di album yang belum didapat),
--   b) kode_gambar 16 ikan lama dikembalikan ke kunci pendek.
-- Pemain yang sempat menangkap ikan baru tetap menyimpan tangkapannya (baris tidak dihapus).
-- ============================================================
-- begin;
-- update public.ikan set aktif = false where nama in ('Bayangan Malam', 'Merah Bara', 'Penghuni Arus', 'Kilau Senja', 'Jejak Emas', 'Belang Danio', 'Pemburu Kelam', 'Keping Darah', 'Benteng Karang', 'Sutra Berkilau', 'Penjelajah Gesit', 'Nyala Api', 'Kilat Samudra', 'Bayu Bajra', 'Pedang Ombak', 'Pangeran Samudra', 'Penembak Jitu', 'Sirip Siluman', 'Lembayung Purba', 'Gembong Lautan', 'Penari Gelombang', 'Perisai Berlian', 'Penguasa Amazon', 'Kuda Samudra');
-- update public.ikan as i set kode_gambar = v.kode_gambar
-- from (values
--     ('Sisik Pasir', 'sisik-pasir'),
--     ('Biru Mungil', 'biru-mungil'),
--     ('Ekor Lincah', 'ekor-lincah'),
--     ('Si Gelembung', 'si-gelembung'),
--     ('Sirip Senja', 'sirip-senja'),
--     ('Mata Zamrud', 'mata-zamrud'),
--     ('Ekor Pelangi', 'ekor-pelangi'),
--     ('Perak Bulan', 'perak-bulan'),
--     ('Naga Mungil', 'naga-mungil'),
--     ('Sirip Petir', 'sirip-petir'),
--     ('Pari Kristal', 'pari-kristal'),
--     ('Taring Badai', 'taring-badai'),
--     ('Naga Emas', 'naga-emas'),
--     ('Dewa Air', 'dewa-air'),
--     ('Ratu Bintang', 'ratu-bintang'),
--     ('Raja Gelombang', 'raja-gelombang')
-- ) as v(nama, kode_gambar) where i.nama = v.nama;
-- commit;
