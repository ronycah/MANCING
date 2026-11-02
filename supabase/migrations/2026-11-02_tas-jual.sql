-- supabase/migrations/2026-11-02_tas-jual.sql
-- TAS.01: jumlah tangkapan boleh 0, baris harga jual di pengaturan, fungsi atomik jual.
-- Perubahan aturan tabel tangkapan (jumlah > 0 menjadi jumlah >= 0) disetujui ketua 2 Nov 2026.
-- Tidak mengubah hak akses tabel, baris pengaturan lama, fungsi lempar, status_pemain,
-- maupun simpan_nama_pemain. Aman dijalankan ulang (baris harga tidak ditimpa).

begin;

-- 1. Jumlah tangkapan boleh 0 (TS1, TS6): jenis ikan tetap "terbuka" di album walau habis dijual.
--    Aturan lama (jumlah > 0) dilepas, lalu diganti aturan baru (jumlah >= 0). Data yang ada tidak berubah.
do $$
declare
  r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid = 'public.tangkapan'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%jumlah%'
  loop
    execute format('alter table public.tangkapan drop constraint %I', r.conname);
  end loop;
end
$$;

alter table public.tangkapan
  add constraint tangkapan_jumlah_check check (jumlah >= 0);

-- 2. Baris harga jual per ekor di pengaturan (baris lama tidak disentuh)
insert into public.pengaturan (nama, nilai) values
  ('harga_common',      10),
  ('harga_rare',        30),
  ('harga_epic',       100),
  ('harga_legendary',  500)
on conflict (nama) do nothing;

-- 3. Fungsi atomik jual: semua langkah dalam satu transaksi.
--    Gagal di mana pun = batal semua (ikan tidak berkurang, koin tidak bertambah).
--    p_pilihan hanya 'satu' atau 'semua'. Harga dan kelas dibaca di server, bukan dari aplikasi.
create or replace function public.jual(p_id uuid, p_ikan_id bigint, p_pilihan text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_baris      public.pemain;
  v_jumlah     integer;
  v_kelas      text;
  v_harga      numeric;
  v_terjual    integer;
  v_koin_dapat bigint;
  v_koin_baru  bigint;
  v_sisa       integer;
begin
  if p_id is null then
    raise exception 'ID_KOSONG';
  end if;

  if p_ikan_id is null then
    raise exception 'IKAN_TIDAK_VALID';
  end if;

  if p_pilihan is null or p_pilihan not in ('satu', 'semua') then
    raise exception 'PILIHAN_TIDAK_VALID';
  end if;

  -- Kunci baris pemain: dua penjualan bersamaan diproses satu per satu (urutan kunci sama dengan lempar)
  select * into v_baris
  from public.pemain
  where id = p_id
  for update;

  if not found then
    raise exception 'PEMAIN_TIDAK_ADA';
  end if;

  -- Kunci baris tangkapan jenis ini; jenis tidak dimiliki atau stok 0: tolak, tidak ada yang ditulis
  select jumlah into v_jumlah
  from public.tangkapan
  where akun_id = p_id and ikan_id = p_ikan_id
  for update;

  if not found or v_jumlah <= 0 then
    return jsonb_build_object(
      'status', 'tidak_dimiliki',
      'ikan_id', p_ikan_id,
      'koin', v_baris.koin,
      'jam_server', now()
    );
  end if;

  -- Kelas dari katalog (ikan nonaktif tetap boleh dijual)
  select kelas into v_kelas
  from public.ikan
  where id = p_ikan_id;

  if v_kelas is null then
    raise exception 'IKAN_TIDAK_VALID';
  end if;

  -- Harga per ekor dari pengaturan (harga_common, harga_rare, harga_epic, harga_legendary)
  select nilai into v_harga
  from public.pengaturan
  where nama = 'harga_' || lower(v_kelas);

  if v_harga is null then
    raise exception 'PENGATURAN_KURANG';
  end if;

  -- Harga wajib bilangan bulat tidak negatif
  if v_harga < 0 or v_harga <> trunc(v_harga) then
    raise exception 'HARGA_TIDAK_VALID';
  end if;

  if p_pilihan = 'semua' then
    v_terjual := v_jumlah;
  else
    v_terjual := 1;
  end if;

  v_koin_dapat := v_harga::bigint * v_terjual;
  v_sisa := v_jumlah - v_terjual;

  -- Kurangi ikan: baris tidak dihapus, jumlah boleh 0 (TS6)
  update public.tangkapan
  set jumlah = v_sisa
  where akun_id = p_id and ikan_id = p_ikan_id;

  -- Tambah koin
  update public.pemain
  set koin = koin + v_koin_dapat
  where id = p_id
  returning koin into v_koin_baru;

  return jsonb_build_object(
    'status', 'ok',
    'ikan_id', p_ikan_id,
    'terjual', v_terjual,
    'koin_didapat', v_koin_dapat,
    'jumlah_sisa', v_sisa,
    'koin', v_koin_baru,
    'jam_server', now()
  );
end;
$$;

-- EXECUTE hanya untuk service_role
revoke all on function public.jual(uuid, bigint, text) from public, anon, authenticated;
grant execute on function public.jual(uuid, bigint, text) to service_role;

commit;

-- ============================================================
-- QUERY CEK (baca-saja). Jalankan SETELAH migration di atas, satu per satu,
-- lalu tempel hasilnya ke chat sebagai bukti. JANGAN menjalankan jual di sini.
-- ============================================================

-- Cek 1: aturan jumlah (harapan: satu baris tangkapan_jumlah_check dengan CHECK (jumlah >= 0), tidak ada "> 0")
-- select conname, pg_get_constraintdef(oid) as aturan
-- from pg_constraint
-- where conrelid = 'public.tangkapan'::regclass and contype = 'c';

-- Cek 2: pengaturan (harapan: harga 10 / 30 / 100 / 500; baris umpan dan peluang lama tetap utuh)
-- select nama, nilai from public.pengaturan order by nama;

-- Cek 3: EXECUTE fungsi jual (harapan: hanya service_role = true)
-- select r.rolname,
--        has_function_privilege(r.rolname, 'public.jual(uuid, bigint, text)', 'execute') as boleh_execute
-- from (values ('anon'), ('authenticated'), ('service_role')) as r(rolname);

-- Cek 4: hak tabel tidak berubah (harapan: anon dan authenticated semua false; service_role hanya select = true)
-- select r.rolname, t.tbl,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'select') as can_select,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'insert') as can_insert,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'update') as can_update,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'delete') as can_delete
-- from (values ('anon'), ('authenticated'), ('service_role')) as r(rolname)
-- cross join (values ('ikan'), ('tangkapan')) as t(tbl)
-- order by t.tbl, r.rolname;
