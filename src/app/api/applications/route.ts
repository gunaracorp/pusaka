import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Tahapan status pengajuan (urutan alur). */
const STATUS_STAGES: { stage: string; label: string }[] = [
  { stage: "SUBMITTED", label: "Pengajuan Diterima" },
  { stage: "REVIEW", label: "Review Berkas" },
  { stage: "VERIFIKASI", label: "Verifikasi Dokumen" },
  { stage: "ASSESSMENT", label: "Asesmen & Audit" },
  { stage: "APPROVED", label: "Disetujui & Terbit" },
];

export interface StatusHistoryItem {
  label: string;
  stage: string;
  at: string | null;
  done: boolean;
}

const applicationSchema = z.object({
  applicantType: z.enum(["PERUSAHAAN", "INDIVIDU"]),
  programCode: z.string().min(1, "Program sertifikasi wajib dipilih"),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.email("Format email tidak valid"),
  phone: z
    .string()
    .min(9, "Nomor telepon minimal 9 digit")
    .regex(/^[0-9+\-\s()]+$/, "Nomor telepon hanya boleh berisi angka"),
  institution: z.string().optional(),
  city: z.string().min(1, "Kota wajib diisi"),
  message: z.string().optional(),
});

function formatZodError(error: z.ZodError): string {
  return (
    error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join("; ") || "Data pengajuan tidak valid"
  );
}

function generateTrackingCode(): string {
  const random = Math.floor(10000 + Math.random() * 90000); // 10000-99999 (5 digit)
  return `PSK-${new Date().getFullYear()}-${random}`;
}

/** POST /api/applications — pengajuan sertifikasi baru. */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body request tidak valid (JSON diperlukan)" },
        { status: 400 }
      );
    }

    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const programCode = parsed.data.programCode.trim().toUpperCase();
    const program = await db.program.findUnique({ where: { code: programCode } });
    if (!program) {
      return NextResponse.json(
        {
          ok: false,
          error: `Program dengan kode "${programCode}" tidak ditemukan`,
        },
        { status: 400 }
      );
    }

    // Generate trackingCode unik (loop hingga tidak bentrok, dengan batas percobaan)
    let trackingCode: string | null = null;
    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = generateTrackingCode();
      const exists = await db.application.findUnique({
        where: { trackingCode: candidate },
      });
      if (!exists) {
        trackingCode = candidate;
        break;
      }
    }
    if (!trackingCode) {
      return NextResponse.json(
        { ok: false, error: "Gagal membuat kode tracking, coba lagi" },
        { status: 500 }
      );
    }

    const application = await db.application.create({
      data: {
        trackingCode,
        applicantType: parsed.data.applicantType,
        programCode,
        fullName: parsed.data.fullName.trim(),
        email: parsed.data.email.trim(),
        phone: parsed.data.phone.trim(),
        institution: parsed.data.institution?.trim() || null,
        city: parsed.data.city.trim(),
        message: parsed.data.message?.trim() || null,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({
      ok: true,
      data: { trackingCode: application.trackingCode, status: application.status },
    });
  } catch (error) {
    console.error("[API /api/applications POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan pengajuan" },
      { status: 500 }
    );
  }
}

/** GET /api/applications?code=PSK-2025-XXXXX — lacak status pengajuan. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = (searchParams.get("code") ?? "").trim();
    if (!code) {
      return NextResponse.json(
        { ok: false, error: "Parameter 'code' wajib diisi" },
        { status: 400 }
      );
    }

    // Case-insensitive: trackingCode tersimpan uppercase
    const application = await db.application.findUnique({
      where: { trackingCode: code.toUpperCase() },
    });
    if (!application) {
      return NextResponse.json(
        {
          ok: false,
          error: `Pengajuan dengan kode "${code}" tidak ditemukan`,
        },
        { status: 404 }
      );
    }

    const currentIndex = STATUS_STAGES.findIndex(
      (s) => s.stage === application.status.toUpperCase()
    );

    const statusHistory: StatusHistoryItem[] = STATUS_STAGES.map((s, idx) => ({
      label: s.label,
      stage: s.stage,
      // Tahap yang sudah dilewati pakai createdAt aplikasi; yang belum = null
      at: currentIndex >= 0 && idx <= currentIndex ? application.createdAt.toISOString() : null,
      done: currentIndex >= 0 && idx <= currentIndex,
    }));

    return NextResponse.json({
      ok: true,
      data: {
        trackingCode: application.trackingCode,
        programCode: application.programCode,
        status: application.status,
        fullName: application.fullName,
        createdAt: application.createdAt.toISOString(),
        statusHistory,
      },
    });
  } catch (error) {
    console.error("[API /api/applications GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal melacak pengajuan" },
      { status: 500 }
    );
  }
}
