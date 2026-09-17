import { NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const FALLBACK_REPLY =
  "Mohon maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi beberapa saat, atau hubungi sekretariat di sekretariat@pusaka.go.id.";

const historyItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const assistantSchema = z.object({
  message: z
    .string()
    .min(1, "Pertanyaan wajib diisi")
    .max(1000, "Pertanyaan maksimal 1000 karakter"),
  history: z.array(historyItemSchema).max(8).optional(),
});

function formatZodError(error: z.ZodError): string {
  return (
    error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join("; ") || "Data tidak valid"
  );
}

/** System prompt dinamis: daftar program dari DB + pengetahuan statis PUSAKA. */
async function buildSystemPrompt(): Promise<string> {
  let programLines: string;
  try {
    const programs = await db.program.findMany({
      orderBy: { createdAt: "asc" },
    });
    const idr = new Intl.NumberFormat("id-ID");
    programLines = programs
      .map(
        (p) =>
          `[${p.code}] ${p.name} — ${p.category}, ${p.tagline}, biaya Rp ${idr.format(p.price)}, durasi ${p.durationDays} hari, pemegang sertifikat ${idr.format(p.holderCount)}`
      )
      .join("\n");
  } catch (error) {
    console.error("[API /api/assistant] Gagal memuat daftar program:", error);
    programLines = "(Data program sedang tidak tersedia.)";
  }

  return `Anda adalah "SAKA — Asisten Virtual resmi PUSAKA (Pusat Sertifikasi & Akreditasi Kompetensi)", lembaga sertifikasi industri perjalanan wisata, umrah & haji untuk program PIHK, PPIU, BPW, IATA, Izin Umrah, Izin Haji, dan BPW-Pro, didukung 46 Dewan Pakar Lintas Bidang. Jaringan global PUSAKA mencakup 32 negara di 8 kawasan: Timur Tengah, Asia Tenggara, Asia Selatan, Asia Timur, Eropa, Afrika, Amerika, dan Oceania.

Layanan utama PUSAKA:
- Verifikasi sertifikat publik tersedia di bagian #verifikasi situs (contoh nomor valid: PPU-2025-0001, BPW-2025-0102, IAT-2025-0201).
- Pelacakan pengajuan sertifikasi menggunakan kode tracking di bagian #lacak.
- Pendaftaran program dilakukan 3 langkah di bagian #pendaftaran.
- Kontak sekretariat: sekretariat@pusaka.go.id / +62 21 350 5075 / Gedung Pusdai Lt. 5, Jakarta Pusat.

Daftar program sertifikasi (data resmi saat ini — satu baris per program):
${programLines}

Aturan persona (WAJIB dipatuhi):
- Jawab dalam Bahasa Indonesia santai-profesional, selalu menyapa pengguna dengan "Anda".
- Maksimal sekitar 120 kata per jawaban; gunakan bullet singkat bila membantu.
- JANGAN PERNAH mengarang nomor sertifikat, harga, tanggal, atau data apa pun di luar data yang diberikan di atas. Jika tidak yakin, sarankan verifikasi di #verifikasi atau menghubungi sekretariat.
- Jika pertanyaan di luar lingkup PUSAKA, arahkan dengan sopan kembali ke layanan PUSAKA atau form kontak.`;
}

/** POST /api/assistant — SAKA, asisten virtual AI PUSAKA (backend-only SDK). */
export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(`assistant:${getClientIp(request)}`, 30, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Terlalu banyak pertanyaan. Tunggu sebentar lagi ya.",
        },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body request tidak valid (JSON diperlukan)" },
        { status: 400 }
      );
    }

    const parsed = assistantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { message, history = [] } = parsed.data;

    try {
      const systemPrompt = await buildSystemPrompt();
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: systemPrompt },
          ...history,
          { role: "user", content: message },
        ],
        thinking: { type: "disabled" },
      });

      const reply: string | undefined =
        completion?.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        console.error("[API /api/assistant] SDK mengembalikan reply kosong");
        return NextResponse.json({
          ok: true,
          data: { reply: FALLBACK_REPLY, fallback: true },
        });
      }

      return NextResponse.json({
        ok: true,
        data: { reply, fallback: false },
      });
    } catch (error) {
      // Jangan log isi pesan user; cukup penyebab teknisnya.
      console.error("[API /api/assistant] SDK error:", error);
      return NextResponse.json({
        ok: true,
        data: { reply: FALLBACK_REPLY, fallback: true },
      });
    }
  } catch (error) {
    console.error("[API /api/assistant] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memproses pertanyaan" },
      { status: 500 }
    );
  }
}
