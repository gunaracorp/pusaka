import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  globalNodeCreateSchema,
  formatZodError,
  normalizeJsonList,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** GET /api/admin/global-nodes — daftar seluruh node jaringan global (order asc). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const nodes = await db.globalNode.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ ok: true, data: nodes });
  } catch (error) {
    console.error("[API /api/admin/global-nodes GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar node jaringan global" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/global-nodes — buat node jaringan global baru. */
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

    const parsed = globalNodeCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const created = await db.globalNode.create({
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
        scope: normalizeJsonList(d.scope),
        status: d.status,
        since: d.since,
        contact: d.contact ?? null,
        order: d.order,
      },
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    console.error("[API /api/admin/global-nodes POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal membuat node jaringan global" },
      { status: 500 }
    );
  }
}
