import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  globalNodeUpdateSchema,
  formatZodError,
  normalizeJsonList,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PUT /api/admin/global-nodes/[id] — perbarui node jaringan global (partial). */
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

    const parsed = globalNodeUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.globalNode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Node jaringan global tidak ditemukan" },
        { status: 404 }
      );
    }

    const d = parsed.data;
    const updated = await db.globalNode.update({
      where: { id },
      data: {
        kind: d.kind,
        country: d.country,
        countryCode: d.countryCode,
        region: d.region,
        city: d.city,
        flag: d.flag,
        title: d.title,
        orgName: d.orgName,
        description: d.description,
        scope: d.scope !== undefined ? normalizeJsonList(d.scope) : undefined,
        status: d.status,
        since: d.since,
        contact: d.contact,
        order: d.order,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    console.error("[API /api/admin/global-nodes PUT] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui node jaringan global" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/global-nodes/[id] — hapus node jaringan global. */
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
    const existing = await db.globalNode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Node jaringan global tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.globalNode.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/global-nodes DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus node jaringan global" },
      { status: 500 }
    );
  }
}
