import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  expertUpdateSchema,
  formatZodError,
  isUniqueConstraintError,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PUT /api/admin/experts/[id] — perbarui dewan pakar (partial). */
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

    const parsed = expertUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.expert.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Dewan pakar tidak ditemukan" },
        { status: 404 }
      );
    }

    const d = parsed.data;
    if (d.licenseNo !== undefined && d.licenseNo !== existing.licenseNo) {
      const duplicate = await db.expert.findUnique({
        where: { licenseNo: d.licenseNo },
      });
      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: `Nomor lisensi "${d.licenseNo}" sudah terdaftar` },
          { status: 409 }
        );
      }
    }

    const updated = await db.expert.update({
      where: { id },
      data: {
        name: d.name,
        field: d.field,
        expertise: d.expertise,
        category: d.category,
        licenseNo: d.licenseNo,
        experienceYears: d.experienceYears,
        organization: d.organization,
        education: d.education,
        initials: d.initials,
        featured: d.featured,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Nomor lisensi sudah terdaftar" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/experts PUT] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui dewan pakar" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/experts/[id] — hapus dewan pakar. */
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
    const existing = await db.expert.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Dewan pakar tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.expert.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/experts DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus dewan pakar" },
      { status: 500 }
    );
  }
}
