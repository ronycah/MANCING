-- supabase/migrations/2026-11-01_akun-pemain-pengaturan.sql
-- AKN.02: tabel pengaturan dan pemain, hak akses, RLS, fungsi simpan nama pemain.
-- Aman dijalankan ulang: tabel dan baris pengaturan tidak ditimpa bila sudah ada.

begin;

-- 1. Tabel pengaturan (angka-angka game yang bisa diatur, bukan ditulis mati di kode)
create table if not exists public.pengaturan (
  nama  text primary key,
  nilai numeric not null
);

insert into public.pengaturan (nama, nilai) values
  ('umpan_awal', 10),
  ('umpan_maks', 20),
  ('jeda_isi_umpan_menit', 60)
on conflict (nama) do nothing;

-- 2. Tabel pemain (satu baris per akun; email dan password TIDAK disimpan di sini)
create table if not exists public.pemain (
  id                  uuid primary key references auth.users (id) on delete cascade,
  nama_tampilan       text not null
                      check (char_length(nama_tampilan) between 3 and 20
                             and nama_tampilan ~ '^[A-Za-z0-9_ ]+$'),
  umpan               integer not null check (umpan >= 0),
  umpan_dihitung_pada timestamptz not null,
  koin                bigint not null default 0 check (koin >= 0),
  dibuat_pada         timestamptz not null default now()
);

-- 3. RLS aktif, tanpa policy: aplikasi (anon/authenticated) tidak bisa akses langsung
alter table public.pengaturan enable row level security;
alter table public.pemain     enable row level security;

revoke all on table public.pengaturan from public, anon, authenticated;
revoke all on table public.pemain     from public, anon, authenticated;

-- 4. Hak service_role per tabel, TANPA DELETE
grant select                 on table public.pengaturan to service_role;
grant select, insert, update on table public.pemain     to service_role;

-- 5. Fungsi atomik: buat baris pemain bila belum ada, atau ganti nama bila sudah ada
create or replace function public.simpan_nama_pemain(p_id uuid, p_nama text)
returns public.pemain
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nama       text := btrim(p_nama);
  v_umpan_awal integer;
  v_baris      public.pemain;
begin
  if p_id is null then
    raise exception 'ID_KOSONG';
  end if;

  -- Aturan nama (AK4): 3 sampai 20 karakter, hanya huruf, angka, spasi, garis bawah
  if v_nama is null
     or char_length(v_nama) < 3
     or char_length(v_nama) > 20
     or v_nama !~ '^[A-Za-z0-9_ ]+$' then
    raise exception 'NAMA_TIDAK_VALID';
  end if;

  select nilai::integer into v_umpan_awal
  from public.pengaturan
  where nama = 'umpan_awal';

  if v_umpan_awal is null then
    raise exception 'PENGATURAN_KURANG';
  end if;

  -- Baris baru: umpan awal dari pengaturan, koin 0, waktu hitung = jam server.
  -- Baris lama: hanya nama yang berubah, umpan dan koin tidak tersentuh.
  insert into public.pemain (id, nama_tampilan, umpan, umpan_dihitung_pada)
  values (p_id, v_nama, v_umpan_awal, now())
  on conflict (id) do update
    set nama_tampilan = excluded.nama_tampilan
  returning * into v_baris;

  return v_baris;
end;
$$;

-- 6. EXECUTE hanya untuk service_role
revoke all on function public.simpan_nama_pemain(uuid, text) from public, anon, authenticated;
grant execute on function public.simpan_nama_pemain(uuid, text) to service_role;

commit;
