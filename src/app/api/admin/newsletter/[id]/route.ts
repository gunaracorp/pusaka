import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const newsletterPatchSchema = z.object({
  isActive: z.boolean({ error: "isActive harus berupa boolean" }),
});

/** PATCH /api/admin/newsletter/[id] — aktif/nonaktifkan pelanggan. */
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

    const parsed = newsletterPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "isActive harus berupa boolean" },
        { status: 400 }
      );
    }

    const existing = await db.newsletterSubscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await db.newsletterSubscriber.update({
      where: { id },
      data: { isActive: parsed.data.isActive },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("[API /api/admin/newsletter PATCH] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui pelanggan" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/newsletter/[id] — hapus pelanggan newsletter. */
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
    const existing = await db.newsletterSubscriber.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Pelanggan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.newsletterSubscriber.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/newsletter DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus pelanggan" },
      { status: 500 }
    );
  }
}
