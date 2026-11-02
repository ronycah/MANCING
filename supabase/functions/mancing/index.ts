// supabase/functions/mancing/index.ts
// Edge Function "mancing" versi pertama: aksi "status" dan "ganti_nama".
// MCG.02: ditambah aksi "lempar" (satu panggilan ke fungsi SQL atomik public.lempar).
// TAS.02: ditambah aksi "jual" (satu panggilan ke fungsi SQL atomik public.jual) dan
// aksi "status" diperluas dengan kunci "album" (daftar ikan dan tangkapan pemain, TS9).
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

// Album koleksi pemain (TS1, TS9). Hanya membaca, tidak menulis apa pun.
// - Pernah didapat (baris tangkapan ada, jumlah boleh 0): terbuka, kirim nama, kelas, kode gambar, jumlah.
//   Tetap tampil walau ikannya kemudian dinonaktifkan.
// - Belum pernah didapat dan ikan aktif: terkunci, kirim HANYA id dan kelas (tanpa nama dan kode gambar).
// - Belum pernah didapat dan ikan nonaktif: tidak dikirim.
// Mengembalikan null bila pembacaan gagal, supaya aksi "status" lama tetap jalan.
async function ambilAlbum(
  idPemain: string,
): Promise<Array<Record<string, unknown>> | null> {
  const [hasilIkan, hasilTangkapan] = await Promise.all([
    admin
      .from("ikan")
      .select("id, nama, kelas, kode_gambar, aktif")
      .order("id", { ascending: true }),
    admin.from("tangkapan").select("ikan_id, jumlah").eq("akun_id", idPemain),
  ]);

  if (
    hasilIkan.error ||
    hasilTangkapan.error ||
    !hasilIkan.data ||
    !hasilTangkapan.data
  ) {
    console.error(
      "album gagal:",
      hasilIkan.error?.message,
      hasilTangkapan.error?.message,
    );
    return null;
  }

  const jumlahPerIkan = new Map<number, number>();
  for (const t of hasilTangkapan.data) {
    jumlahPerIkan.set(Number(t.ikan_id), Number(t.jumlah));
  }

  const album: Array<Record<string, unknown>> = [];
  for (const i of hasilIkan.data) {
    const id = Number(i.id);
    if (jumlahPerIkan.has(id)) {
      album.push({
        id,
        terbuka: true,
        nama: i.nama,
        kelas: i.kelas,
        kode_gambar: i.kode_gambar,
        jumlah: jumlahPerIkan.get(id),
      });
    } else if (i.aktif) {
      album.push({ id, terbuka: false, kelas: i.kelas });
    }
  }
  return album;
}

// Aksi "status": baca status pemain dari fungsi SQL (jam server).
// TAS.02: ditambah kunci "album" (null bila album gagal dibaca; status lama tetap dibalas).
async function aksiStatus(idPemain: string): Promise<Response> {
  const { data, error } = await admin.rpc("status_pemain", { p_id: idPemain });
  if (error || !data) {
    console.error("status_pemain gagal:", error?.message);
    return galat(500, "Gagal memuat. Coba lagi.");
  }
  const album = await ambilAlbum(idPemain);
  return balas(200, { ok: true, status: data, album });
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

// Aksi "jual": satu panggilan atomik ke fungsi SQL public.jual (TS3, TS5).
// Aplikasi hanya mengirim id jenis ikan dan pilihan "satu" atau "semua".
// Harga, kelas, jumlah koin, dan jumlah ikan dihitung di server, tidak pernah dari aplikasi.
async function aksiJual(
  idPemain: string,
  idIkan: unknown,
  pilihan: unknown,
): Promise<Response> {
  if (
    typeof idIkan !== "number" ||
    !Number.isSafeInteger(idIkan) ||
    idIkan <= 0 ||
    (pilihan !== "satu" && pilihan !== "semua")
  ) {
    return galat(400, "Permintaan tidak dikenal.");
  }

  const { data, error } = await admin.rpc("jual", {
    p_id: idPemain,
    p_ikan_id: idIkan,
    p_pilihan: pilihan,
  });

  if (error) {
    const pesanDb = error.message ?? "";
    // Akun ada tapi baris pemain belum dibuat: arahkan ke layar Pilih nama.
    if (pesanDb.includes("PEMAIN_TIDAK_ADA")) {
      return galat(400, "Pilih nama tampilan dulu sebelum menjual.");
    }
    if (
      pesanDb.includes("IKAN_TIDAK_VALID") ||
      pesanDb.includes("PILIHAN_TIDAK_VALID")
    ) {
      return galat(400, "Permintaan tidak dikenal.");
    }
    // PENGATURAN_KURANG, HARGA_TIDAK_VALID, dan lainnya: detail hanya di log server.
    console.error("jual gagal:", pesanDb);
    return galat(500, "Gagal menjual. Coba lagi.");
  }

  if (!data || typeof data !== "object") {
    console.error("jual gagal: jawaban SQL kosong");
    return galat(500, "Gagal menjual. Coba lagi.");
  }

  // Jenis tidak dimiliki atau stok 0: data tidak berubah, pesan umum (TS7).
  if ((data as Record<string, unknown>).status !== "ok") {
    return galat(
      400,
      "Ikan ini tidak bisa dijual. Muat ulang tas lalu coba lagi.",
    );
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

  // 4. Jalankan aksi. Aplikasi hanya mengirim nama aksi (nama untuk ganti_nama;
  //    id ikan dan pilihan untuk jual).
  switch (isi?.aksi) {
    case "status":
      return aksiStatus(idPemain);
    case "ganti_nama":
      return aksiGantiNama(idPemain, isi.nama);
    case "lempar":
      return aksiLempar(idPemain);
    case "jual":
      return aksiJual(idPemain, isi.ikan_id, isi.pilihan);
    default:
      return galat(400, "Aksi tidak dikenal.");
  }
});
