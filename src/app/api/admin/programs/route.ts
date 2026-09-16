import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  programCreateSchema,
  formatZodError,
  isUniqueConstraintError,
  normalizeJsonList,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** GET /api/admin/programs — daftar seluruh program (admin). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const programs = await db.program.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ ok: true, data: programs });
  } catch (error) {
    console.error("[API /api/admin/programs GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar program" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/programs — buat program baru. */
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

    const parsed = programCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const duplicate = await db.program.findUnique({ where: { code: d.code } });
    if (duplicate) {
      return NextResponse.json(
        { ok: false, error: `Kode program "${d.code}" sudah digunakan` },
        { status: 409 }
      );
    }

    const created = await db.program.create({
      data: {
        code: d.code,
        name: d.name,
        shortName: d.shortName,
        category: d.category,
        tagline: d.tagline,
        description: d.description,
        requirements: normalizeJsonList(d.requirements),
        benefits: normalizeJsonList(d.benefits),
        accreditation: normalizeJsonList(d.accreditation),
        durationDays: d.durationDays,
        price: d.price,
        seatsLeft: d.seatsLeft,
        holderCount: d.holderCount,
        passRate: d.passRate,
        accentColor: d.accentColor,
        featured: d.featured ?? false,
      },
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Kode program sudah digunakan" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/programs POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal membuat program" },
      { status: 500 }
    );
  }
}
