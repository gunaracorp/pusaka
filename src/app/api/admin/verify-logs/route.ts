import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/verify-logs — 200 log verifikasi terbaru (read-only). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const [logs, total] = await Promise.all([
      db.verifyLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      db.verifyLog.count(),
    ]);

    return NextResponse.json(
      { ok: true, data: logs },
      { headers: { "X-Total-Count": String(total) } }
    );
  } catch (error) {
    console.error("[API /api/admin/verify-logs GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat log verifikasi" },
      { status: 500 }
    );
  }
}
