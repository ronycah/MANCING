// supabase/functions/mancing/index.ts
// Edge Function "mancing" versi pertama: aksi "status" dan "ganti_nama".
// MCG.02: ditambah aksi "lempar" (satu panggilan ke fungsi SQL atomik public.lempar).
// Deploy dengan --no-verify-jwt, jadi fungsi ini memverifikasi token SENDIRI paling awal.
// Kunci service_role dibaca dari lingkungan Supabase, tidak ditulis di kode.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const URL_PROJECT = Deno.env.get("SUPABASE_URL") ?? "";
const KUNCI_SERVER = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const admin = createClient(URL_PROJECT, KUNCI_SERVER, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Header CORS: akses dijaga token Bearer, bukan cookie.
const HEADER_CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function balas(status: number, isi: Record<string, unknown>): Response {
  return new Response(JSON.stringify(isi), {
    status,
    headers: {
      ...HEADER_CORS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function galat(status: number, pesan: string): Response {
  return balas(status, { ok: false, pesan });
}

// Ambil token dari header "Authorization: Bearer <token>"
function ambilToken(req: Request): string | null {
  const header = req.headers.get("Authorization") ?? "";
  const cocok = header.match(/^Bearer\s+(\S+)$/i);
  return cocok ? cocok[1] : null;
}

// Aksi "status": baca status pemain dari fungsi SQL (jam server).
async function aksiStatus(idPemain: string): Promise<Response> {
  const { data, error } = await admin.rpc("status_pemain", { p_id: idPemain });
  if (error || !data) {
    console.error("status_pemain gagal:", error?.message);
    return galat(500, "Gagal memuat. Coba lagi.");
  }
  return balas(200, { ok: true, status: data });
}

// Aksi "ganti_nama": buat baris pemain bila belum ada, atau ganti nama.
async function aksiGantiNama(
  idPemain: string,
  nama: unknown,
): Promise<Response> {
  if (typeof nama !== "string") {
    return galat(
      400,
      "Nama harus 3 sampai 20 karakter: huruf, angka, spasi, atau garis bawah.",
    );
  }

  const { error } = await admin.rpc("simpan_nama_pemain", {
    p_id: idPemain,
    p_nama: nama,
  });

  if (error) {
    const pesanDb = error.message ?? "";
    if (pesanDb.includes("NAMA_TIDAK_VALID")) {
      return galat(
        400,
        "Nama harus 3 sampai 20 karakter: huruf, angka, spasi, atau garis bawah.",
      );
    }
    console.error("simpan_nama_pemain gagal:", pesanDb);
    return galat(500, "Gagal menyimpan nama. Coba lagi.");
  }

  // Balas dengan status terbaru supaya aplikasi tidak perlu memanggil lagi.
  return aksiStatus(idPemain);
}

// Aksi "lempar": satu panggilan atomik ke fungsi SQL public.lempar (MC1, MC2).
// Aplikasi tidak mengirim apa pun selain nama aksi; hasil sepenuhnya ditentukan server (MC12).
// Status dari SQL: "ok", "lepas", "umpan_habis", atau "kolam_kosong" (diteruskan apa adanya).
async function aksiLempar(idPemain: string): Promise<Response> {
  const { data, error } = await admin.rpc("lempar", { p_id: idPemain });

  if (error) {
    const pesanDb = error.message ?? "";
    // Akun ada tapi baris pemain belum dibuat: arahkan ke layar Pilih nama.
    if (pesanDb.includes("PEMAIN_TIDAK_ADA")) {
      return galat(400, "Pilih nama tampilan dulu sebelum memancing.");
    }
    // PELUANG_TIDAK_VALID, PENGATURAN_KURANG, dan lainnya: detail hanya di log server.
    console.error("lempar gagal:", pesanDb);
    return galat(500, "Gagal melempar kail. Coba lagi.");
  }

  if (!data || typeof data !== "object") {
    console.error("lempar gagal: jawaban SQL kosong");
    return galat(500, "Gagal melempar kail. Coba lagi.");
  }

  return balas(200, { ok: true, hasil: data });
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Permintaan "izin dulu" dari browser: dijawab kosong, tidak membuka data apa pun.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: HEADER_CORS });
  }

  // 1. Verifikasi token PALING AWAL. Tanpa token atau token tidak valid: 401.
  const token = ambilToken(req);
  if (!token) {
    return galat(401, "Silakan masuk dulu.");
  }

  const { data: dataUser, error: galatUser } = await admin.auth.getUser(token);
  if (galatUser || !dataUser?.user?.id) {
    return galat(401, "Sesi tidak valid. Silakan masuk lagi.");
  }
  // Identitas pemain SELALU dari token, bukan dari kiriman aplikasi.
  const idPemain = dataUser.user.id;

  // 2. Hanya metode POST.
  if (req.method !== "POST") {
    return galat(405, "Permintaan tidak dikenal.");
  }

  // 3. Baca isi permintaan.
  let isi: Record<string, unknown>;
  try {
    isi = await req.json();
  } catch {
    return galat(400, "Permintaan tidak dikenal.");
  }

  // 4. Jalankan aksi. Aplikasi hanya mengirim nama aksi (dan nama untuk ganti_nama).
  switch (isi?.aksi) {
    case "status":
      return aksiStatus(idPemain);
    case "ganti_nama":
      return aksiGantiNama(idPemain, isi.nama);
    case "lempar":
      return aksiLempar(idPemain);
    default:
      return galat(400, "Aksi tidak dikenal.");
  }
});
