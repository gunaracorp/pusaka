import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  programUpdateSchema,
  formatZodError,
  isUniqueConstraintError,
  normalizeJsonList,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PUT /api/admin/programs/[id] — perbarui program (partial). */
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

    const parsed = programUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.program.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Program tidak ditemukan" },
        { status: 404 }
      );
    }

    const d = parsed.data;
    if (d.code !== undefined && d.code !== existing.code) {
      const duplicate = await db.program.findUnique({ where: { code: d.code } });
      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: `Kode program "${d.code}" sudah digunakan` },
          { status: 409 }
        );
      }
    }

    const updated = await db.program.update({
      where: { id },
      data: {
        code: d.code,
        name: d.name,
        shortName: d.shortName,
        category: d.category,
        tagline: d.tagline,
        description: d.description,
        requirements:
          d.requirements !== undefined ? normalizeJsonList(d.requirements) : undefined,
        benefits: d.benefits !== undefined ? normalizeJsonList(d.benefits) : undefined,
        accreditation:
          d.accreditation !== undefined ? normalizeJsonList(d.accreditation) : undefined,
        durationDays: d.durationDays,
        price: d.price,
        seatsLeft: d.seatsLeft,
        holderCount: d.holderCount,
        passRate: d.passRate,
        accentColor: d.accentColor,
        featured: d.featured,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Kode program sudah digunakan" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/programs PUT] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui program" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/programs/[id] — hapus program. */
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
    const existing = await db.program.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Program tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.program.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/programs DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus program" },
      { status: 500 }
    );
  }
}
