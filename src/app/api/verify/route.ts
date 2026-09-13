import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Kontrak data POST /api/verify */
export interface VerifyData {
  valid: boolean;
  institution?: {
    id: string;
    name: string;
    type: string;
    city: string;
    province: string;
    certNumber: string;
    programCode: string;
    status: string;
    tier: string;
    score: number;
    issuedAt: string;
    expiresAt: string;
    contact: string | null;
    phone: string | null;
  };
  program?: { code: string; name: string } | null;
}

const verifySchema = z.object({
  certNumber: z.string().min(1, "Nomor sertifikat wajib diisi"),
});

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

    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      const msg =
        parsed.error.issues[0]?.message ?? "Nomor sertifikat wajib diisi";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    // Normalisasi case-insensitive: trim + uppercase (SQLite tidak mendukung mode: "insensitive")
    const certNumber = parsed.data.certNumber.trim().toUpperCase();
    if (!certNumber) {
      return NextResponse.json(
        { ok: false, error: "Nomor sertifikat wajib diisi" },
        { status: 400 }
      );
    }

    const institution = await db.institution.findUnique({
      where: { certNumber },
    });

    if (!institution) {
      await db.verifyLog.create({
        data: { certNumber, result: "INVALID" },
      });
      const data: VerifyData = { valid: false };
      return NextResponse.json({ ok: true, data });
    }

    const program = await db.program.findUnique({
      where: { code: institution.programCode },
    });

    await db.verifyLog.create({
      data: { certNumber, result: "VALID" },
    });

    const data: VerifyData = {
      valid: true,
      institution: {
        id: institution.id,
        name: institution.name,
        type: institution.type,
        city: institution.city,
        province: institution.province,
        certNumber: institution.certNumber,
        programCode: institution.programCode,
        status: institution.status,
        tier: institution.tier,
        score: institution.score,
        issuedAt: institution.issuedAt.toISOString(),
        expiresAt: institution.expiresAt.toISOString(),
        contact: institution.contact,
        phone: institution.phone,
      },
      program: program ? { code: program.code, name: program.name } : null,
    };

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/verify] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memverifikasi sertifikat" },
      { status: 500 }
    );
  }
}
