-- supabase/migrations/2026-11-02_mancing-ikan-tangkapan.sql
-- MCG.01: tabel ikan dan tangkapan, baris peluang di pengaturan, katalog awal 16 ikan,
-- fungsi atomik lempar. Tidak mengubah tabel pemain, baris umpan, status_pemain,
-- maupun simpan_nama_pemain. Aman dijalankan ulang (tabel dan baris tidak ditimpa).

begin;

-- 1. Katalog ikan (kode_gambar = nama berkas/kunci gambar, bisa diubah lewat database)
create table if not exists public.ikan (
  id          bigint generated always as identity primary key,
  nama        text not null unique,
  kelas       text not null check (kelas in ('Common', 'Rare', 'Epic', 'Legendary')),
  kode_gambar text not null,
  aktif       boolean not null default true
);

-- 2. Tangkapan pemain (satu baris unik per akun + ikan, jumlah bertambah tiap tangkapan)
create table if not exists public.tangkapan (
  akun_id      uuid   not null references public.pemain (id) on delete cascade,
  ikan_id      bigint not null references public.ikan (id),
  jumlah       integer not null check (jumlah > 0),
  pertama_pada timestamptz not null default now(),
  primary key (akun_id, ikan_id)
);

-- 3. RLS aktif tanpa policy: aplikasi (anon/authenticated) tidak bisa akses langsung
alter table public.ikan      enable row level security;
alter table public.tangkapan enable row level security;

-- 4. Cabut semua hak (termasuk hak otomatis service_role), lalu beri ulang hanya yang perlu.
--    Tulis ke tangkapan hanya lewat fungsi lempar (SECURITY DEFINER), jadi cukup SELECT.
revoke all on table public.ikan      from public, anon, authenticated, service_role;
revoke all on table public.tangkapan from public, anon, authenticated, service_role;
grant select on table public.ikan      to service_role;
grant select on table public.tangkapan to service_role;

-- 5. Baris peluang di pengaturan (baris umpan yang sudah ada tidak disentuh)
insert into public.pengaturan (nama, nilai) values
  ('peluang_lepas',      15),
  ('peluang_common',     60),
  ('peluang_rare',       25),
  ('peluang_epic',       12),
  ('peluang_legendary',   3)
on conflict (nama) do nothing;

-- 6. Katalog awal 16 ikan (4 per kelas)
insert into public.ikan (nama, kelas, kode_gambar) values
  ('Sisik Pasir',    'Common',    'sisik-pasir'),
  ('Biru Mungil',    'Common',    'biru-mungil'),
  ('Ekor Lincah',    'Common',    'ekor-lincah'),
  ('Si Gelembung',   'Common',    'si-gelembung'),
  ('Sirip Senja',    'Rare',      'sirip-senja'),
  ('Mata Zamrud',    'Rare',      'mata-zamrud'),
  ('Ekor Pelangi',   'Rare',      'ekor-pelangi'),
  ('Perak Bulan',    'Rare',      'perak-bulan'),
  ('Naga Mungil',    'Epic',      'naga-mungil'),
  ('Sirip Petir',    'Epic',      'sirip-petir'),
  ('Pari Kristal',   'Epic',      'pari-kristal'),
  ('Taring Badai',   'Epic',      'taring-badai'),
  ('Naga Emas',      'Legendary', 'naga-emas'),
  ('Dewa Air',       'Legendary', 'dewa-air'),
  ('Ratu Bintang',   'Legendary', 'ratu-bintang'),
  ('Raja Gelombang', 'Legendary', 'raja-gelombang')
on conflict (nama) do nothing;

-- 7. Fungsi atomik lempar: semua langkah dalam satu transaksi.
--    Gagal di mana pun = batal semua (umpan tidak terpakai).
create or replace function public.lempar(p_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_baris        public.pemain;
  v_ikan         public.ikan;
  v_jeda_menit   numeric;
  v_umpan_maks   integer;
  v_p_lepas      numeric;
  v_p_common     numeric;
  v_p_rare       numeric;
  v_p_epic       numeric;
  v_p_legendary  numeric;
  v_jeda_detik   bigint;
  v_lewat        bigint;
  v_tambah       bigint;
  v_umpan        integer;   -- umpan terkini sebelum lempar
  v_umpan_baru   integer;   -- umpan setelah dipakai
  v_waktu        timestamptz;
  v_sisa         bigint;
  v_acak         numeric;
  v_kelas        text;
  v_jumlah       integer;
begin
  if p_id is null then
    raise exception 'ID_KOSONG';
  end if;

  -- Kunci baris pemain: dua lemparan bersamaan diproses satu per satu (SEC-08)
  select * into v_baris
  from public.pemain
  where id = p_id
  for update;

  if not found then
    raise exception 'PEMAIN_TIDAK_ADA';
  end if;

  -- Semua angka dari pengaturan, bukan tertulis di kode
  select nilai into v_jeda_menit   from public.pengaturan where nama = 'jeda_isi_umpan_menit';
  select nilai::integer into v_umpan_maks from public.pengaturan where nama = 'umpan_maks';
  select nilai into v_p_lepas      from public.pengaturan where nama = 'peluang_lepas';
  select nilai into v_p_common     from public.pengaturan where nama = 'peluang_common';
  select nilai into v_p_rare       from public.pengaturan where nama = 'peluang_rare';
  select nilai into v_p_epic       from public.pengaturan where nama = 'peluang_epic';
  select nilai into v_p_legendary  from public.pengaturan where nama = 'peluang_legendary';

  if v_jeda_menit is null or v_umpan_maks is null or v_jeda_menit <= 0
     or v_p_lepas is null or v_p_common is null or v_p_rare is null
     or v_p_epic is null or v_p_legendary is null then
    raise exception 'PENGATURAN_KURANG';
  end if;

  -- Peluang kelas wajib berjumlah 100 (SEC-13); peluang lepas wajib 0 sampai 100
  if v_p_common < 0 or v_p_rare < 0 or v_p_epic < 0 or v_p_legendary < 0
     or v_p_lepas < 0 or v_p_lepas > 100
     or (v_p_common + v_p_rare + v_p_epic + v_p_legendary) <> 100 then
    raise exception 'PELUANG_TIDAK_VALID';
  end if;

  -- Umpan terkini dari jam server (rumus sama dengan status_pemain)
  v_jeda_detik := round(v_jeda_menit * 60)::bigint;
  v_lewat  := greatest(0, floor(extract(epoch from (now() - v_baris.umpan_dihitung_pada)))::bigint);
  v_tambah := v_lewat / v_jeda_detik;

  if v_baris.umpan >= v_umpan_maks then
    v_umpan := v_baris.umpan;
  else
    v_umpan := least(v_umpan_maks::bigint, v_baris.umpan + v_tambah)::integer;
  end if;

  -- Sisa detik ke umpan berikutnya (kondisi sebelum lempar; dipakai bila ditolak)
  if v_umpan >= v_umpan_maks then
    v_sisa := 0;
  else
    v_sisa := v_jeda_detik - (v_lewat % v_jeda_detik);
  end if;

  -- Umpan habis: tolak, tidak ada yang ditulis
  if v_umpan <= 0 then
    return jsonb_build_object(
      'status', 'umpan_habis',
      'umpan', 0,
      'umpan_maks', v_umpan_maks,
      'detik_ke_umpan_berikutnya', v_sisa,
      'jam_server', now()
    );
  end if;

  -- Undi: lepas atau tidak (random() menghasilkan 0 sampai kurang dari 1)
  v_acak := (random() * 100)::numeric;
  v_umpan_baru := v_umpan - 1;

  -- Waktu hitung baru: bila umpan sudah penuh, hitungan mulai dari sekarang.
  -- Bila belum penuh, majukan hanya sebesar umpan yang sudah pulih, sisa progres tidak hilang.
  if v_umpan >= v_umpan_maks then
    v_waktu := now();
  else
    v_waktu := v_baris.umpan_dihitung_pada
               + (v_tambah * v_jeda_detik)::double precision * interval '1 second';
  end if;

  if v_acak < v_p_lepas then
    -- Ikan lepas: umpan tetap terpakai, tidak ada ikan disimpan (MC3)
    update public.pemain
    set umpan = v_umpan_baru,
        umpan_dihitung_pada = v_waktu
    where id = p_id;

    v_lewat := greatest(0, floor(extract(epoch from (now() - v_waktu)))::bigint);
    if v_umpan_baru >= v_umpan_maks then
      v_sisa := 0;
    else
      v_sisa := v_jeda_detik - (v_lewat % v_jeda_detik);
    end if;

    return jsonb_build_object(
      'status', 'lepas',
      'umpan', v_umpan_baru,
      'umpan_maks', v_umpan_maks,
      'detik_ke_umpan_berikutnya', v_sisa,
      'jam_server', now()
    );
  end if;

  -- Undi kelas
  v_acak := (random() * 100)::numeric;
  if v_acak < v_p_common then
    v_kelas := 'Common';
  elsif v_acak < v_p_common + v_p_rare then
    v_kelas := 'Rare';
  elsif v_acak < v_p_common + v_p_rare + v_p_epic then
    v_kelas := 'Epic';
  else
    v_kelas := 'Legendary';
  end if;

  -- Undi jenis ikan aktif dalam kelas itu, sama rata (MC6)
  select * into v_ikan
  from public.ikan
  where kelas = v_kelas and aktif
  order by random()
  limit 1;

  -- Kolam kosong: batalkan, umpan tidak terpakai, tidak ada yang ditulis (MC13)
  if not found then
    return jsonb_build_object(
      'status', 'kolam_kosong',
      'umpan', v_umpan,
      'umpan_maks', v_umpan_maks,
      'detik_ke_umpan_berikutnya', v_sisa,
      'jam_server', now()
    );
  end if;

  -- Pakai 1 umpan
  update public.pemain
  set umpan = v_umpan_baru,
      umpan_dihitung_pada = v_waktu
  where id = p_id;

  -- Tambah ke tangkapan pemain (baris baru, atau jumlah + 1)
  insert into public.tangkapan as t (akun_id, ikan_id, jumlah)
  values (p_id, v_ikan.id, 1)
  on conflict (akun_id, ikan_id) do update
    set jumlah = t.jumlah + 1
  returning t.jumlah into v_jumlah;

  v_lewat := greatest(0, floor(extract(epoch from (now() - v_waktu)))::bigint);
  if v_umpan_baru >= v_umpan_maks then
    v_sisa := 0;
  else
    v_sisa := v_jeda_detik - (v_lewat % v_jeda_detik);
  end if;

  return jsonb_build_object(
    'status', 'ok',
    'umpan', v_umpan_baru,
    'umpan_maks', v_umpan_maks,
    'detik_ke_umpan_berikutnya', v_sisa,
    'jam_server', now(),
    'ikan', jsonb_build_object(
      'id', v_ikan.id,
      'nama', v_ikan.nama,
      'kelas', v_ikan.kelas,
      'kode_gambar', v_ikan.kode_gambar,
      'jumlah_dimiliki', v_jumlah
    )
  );
end;
$$;

-- EXECUTE hanya untuk service_role
revoke all on function public.lempar(uuid) from public, anon, authenticated;
grant execute on function public.lempar(uuid) to service_role;

commit;

-- ============================================================
-- QUERY CEK (baca-saja). Jalankan SETELAH migration di atas, satu per satu,
-- lalu tempel hasilnya ke chat sebagai bukti. JANGAN menjalankan lempar di sini.
-- ============================================================

-- Cek 1: RLS aktif di kedua tabel (harapan: relrowsecurity = true untuk ikan dan tangkapan)
-- select c.relname, c.relrowsecurity
-- from pg_class c join pg_namespace n on n.oid = c.relnamespace
-- where n.nspname = 'public' and c.relname in ('ikan', 'tangkapan');

-- Cek 2: hak tabel (harapan: anon dan authenticated semua false; service_role hanya select = true)
-- select r.rolname, t.tbl,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'select') as can_select,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'insert') as can_insert,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'update') as can_update,
--        has_table_privilege(r.rolname, 'public.' || t.tbl, 'delete') as can_delete
-- from (values ('anon'), ('authenticated'), ('service_role')) as r(rolname)
-- cross join (values ('ikan'), ('tangkapan')) as t(tbl)
-- order by t.tbl, r.rolname;

-- Cek 3: EXECUTE fungsi lempar (harapan: hanya service_role = true)
-- select r.rolname,
--        has_function_privilege(r.rolname, 'public.lempar(uuid)', 'execute') as boleh_execute
-- from (values ('anon'), ('authenticated'), ('service_role')) as r(rolname);

-- Cek 4: jumlah peluang kelas (harapan: 100) dan baris umpan lama tetap utuh
-- select nama, nilai from public.pengaturan order by nama;
-- select sum(nilai) as jumlah_peluang_kelas from public.pengaturan
-- where nama in ('peluang_common', 'peluang_rare', 'peluang_epic', 'peluang_legendary');

-- Cek 5: katalog (harapan: 4 ikan aktif per kelas, total 16)
-- select kelas, count(*) as jumlah from public.ikan where aktif group by kelas order by kelas;
