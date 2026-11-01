-- supabase/migrations/2026-11-01_cabut-hak-berlebih.sql
-- AKN.02 (perbaikan): cabut hak berlebih service_role di pemain dan pengaturan.
-- Aturan: tanpa DELETE (AGENTS.md bagian 7). Tidak mengubah data, hanya hak akses.
-- Aman dijalankan ulang.

begin;

-- pemain: server boleh baca, tambah, dan ubah baris. Tidak boleh hapus.
revoke all on table public.pemain from service_role;
grant select, insert, update on table public.pemain to service_role;

-- pengaturan: server hanya boleh baca. Perubahan angka lewat dashboard dengan OK ketua.
revoke all on table public.pengaturan from service_role;
grant select on table public.pengaturan to service_role;

commit;
