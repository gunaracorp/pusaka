import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  institutionCreateSchema,
  formatZodError,
  isUniqueConstraintError,
  parseIsoDate,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** GET /api/admin/institutions — daftar seluruh lembaga (admin). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const institutions = await db.institution.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: institutions });
  } catch (error) {
    console.error("[API /api/admin/institutions GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar lembaga" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/institutions — tambah lembaga baru. */
export async function POST(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

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

    const parsed = institutionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const duplicate = await db.institution.findUnique({
      where: { certNumber: d.certNumber },
    });
    if (duplicate) {
      return NextResponse.json(
        { ok: false, error: `Nomor sertifikat "${d.certNumber}" sudah terdaftar` },
        { status: 409 }
      );
    }

    const issuedAt = parseIsoDate(d.issuedAt);
    const expiresAt = parseIsoDate(d.expiresAt);
    if (!issuedAt || !expiresAt) {
      return NextResponse.json(
        { ok: false, error: "Format tanggal tidak valid (ISO diperlukan)" },
        { status: 400 }
      );
    }

    const created = await db.institution.create({
      data: {
        name: d.name,
        type: d.type,
        city: d.city,
        province: d.province,
        certNumber: d.certNumber,
        programCode: d.programCode,
        status: d.status,
        tier: d.tier,
        score: d.score,
        issuedAt,
        expiresAt,
        contact: d.contact || null,
        phone: d.phone || null,
      },
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Nomor sertifikat sudah terdaftar" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/institutions POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menambahkan lembaga" },
      { status: 500 }
    );
  }
}
