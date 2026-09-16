import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  institutionUpdateSchema,
  formatZodError,
  isUniqueConstraintError,
  parseIsoDate,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PUT /api/admin/institutions/[id] — perbarui lembaga (partial). */
export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const { id } = await ctx.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body request tidak valid (JSON diperlukan)" },
        { status: 400 }
      );
    }

    const parsed = institutionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.institution.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Lembaga tidak ditemukan" },
        { status: 404 }
      );
    }

    const d = parsed.data;
    if (d.certNumber !== undefined && d.certNumber !== existing.certNumber) {
      const duplicate = await db.institution.findUnique({
        where: { certNumber: d.certNumber },
      });
      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: `Nomor sertifikat "${d.certNumber}" sudah terdaftar` },
          { status: 409 }
        );
      }
    }

    const issuedAt = d.issuedAt !== undefined ? parseIsoDate(d.issuedAt) : undefined;
    const expiresAt = d.expiresAt !== undefined ? parseIsoDate(d.expiresAt) : undefined;
    if (issuedAt === null || expiresAt === null) {
      return NextResponse.json(
        { ok: false, error: "Format tanggal tidak valid (ISO diperlukan)" },
        { status: 400 }
      );
    }

    const updated = await db.institution.update({
      where: { id },
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
        contact: d.contact === undefined ? undefined : d.contact || null,
        phone: d.phone === undefined ? undefined : d.phone || null,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Nomor sertifikat sudah terdaftar" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/institutions PUT] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui lembaga" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/institutions/[id] — hapus lembaga. */
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const { id } = await ctx.params;
    const existing = await db.institution.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Lembaga tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.institution.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/institutions DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus lembaga" },
      { status: 500 }
    );
  }
}
