-- supabase/migrations/2026-11-01_status-pemain.sql
-- AKN.03 (bagian SQL): fungsi baca-saja status pemain.
-- Menghitung umpan terkini dari jam server (now()), bukan jam HP.
-- Tidak mengubah data. Aman dijalankan ulang.

begin;

create or replace function public.status_pemain(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_baris       public.pemain;
  v_jeda_menit  numeric;
  v_umpan_maks  integer;
  v_jeda_detik  bigint;
  v_lewat       bigint;
  v_tambah      bigint;
  v_umpan       integer;
  v_sisa        bigint;
begin
  if p_id is null then
    raise exception 'ID_KOSONG';
  end if;

  select * into v_baris
  from public.pemain
  where id = p_id;

  -- Akun ada tapi baris pemain belum dibuat: layar Pilih nama harus muncul lagi
  if not found then
    return jsonb_build_object('ada', false, 'jam_server', now());
  end if;

  select nilai into v_jeda_menit
  from public.pengaturan
  where nama = 'jeda_isi_umpan_menit';

  select nilai::integer into v_umpan_maks
  from public.pengaturan
  where nama = 'umpan_maks';

  if v_jeda_menit is null or v_umpan_maks is null or v_jeda_menit <= 0 then
    raise exception 'PENGATURAN_KURANG';
  end if;

  v_jeda_detik := round(v_jeda_menit * 60)::bigint;
  v_lewat := greatest(0, floor(extract(epoch from (now() - v_baris.umpan_dihitung_pada)))::bigint);
  v_tambah := v_lewat / v_jeda_detik;

  -- Pemulihan dibatasi umpan_maks. Bila umpan tersimpan sudah di atas batas, tidak dikurangi.
  if v_baris.umpan >= v_umpan_maks then
    v_umpan := v_baris.umpan;
  else
    v_umpan := least(v_umpan_maks::bigint, v_baris.umpan + v_tambah)::integer;
  end if;

  -- Sisa detik ke umpan berikutnya (0 bila sudah penuh)
  if v_umpan >= v_umpan_maks then
    v_sisa := 0;
  else
    v_sisa := v_jeda_detik - (v_lewat % v_jeda_detik);
  end if;

  return jsonb_build_object(
    'ada', true,
    'nama_tampilan', v_baris.nama_tampilan,
    'umpan', v_umpan,
    'umpan_maks', v_umpan_maks,
    'koin', v_baris.koin,
    'detik_ke_umpan_berikutnya', v_sisa,
    'jam_server', now()
  );
end;
$$;

-- EXECUTE hanya untuk service_role
revoke all on function public.status_pemain(uuid) from public, anon, authenticated;
grant execute on function public.status_pemain(uuid) to service_role;

commit;
