import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { applicationPatchSchema, formatZodError } from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PATCH /api/admin/applications/[id] — ubah status pengajuan. */
export async function PATCH(
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

    const parsed = applicationPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.application.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await db.application.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("[API /api/admin/applications PATCH] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui status pengajuan" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/applications/[id] — hapus pengajuan. */
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
    const existing = await db.application.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Pengajuan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.application.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/applications DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus pengajuan" },
      { status: 500 }
    );
  }
}
