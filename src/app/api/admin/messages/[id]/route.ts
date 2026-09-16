import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { messagePatchSchema, formatZodError } from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PATCH /api/admin/messages/[id] — tandai pesan sudah/lengkap ditangani. */
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

    const parsed = messagePatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Pesan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data: { handled: parsed.data.handled },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("[API /api/admin/messages PATCH] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui status pesan" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/messages/[id] — hapus pesan kontak. */
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
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Pesan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/messages DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus pesan" },
      { status: 500 }
    );
  }
}
