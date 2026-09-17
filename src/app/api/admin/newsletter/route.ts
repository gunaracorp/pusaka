import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/newsletter — daftar pelanggan newsletter (desc createdAt). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const [subscribers, total] = await Promise.all([
      db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
      db.newsletterSubscriber.count(),
    ]);

    return NextResponse.json(
      { ok: true, data: subscribers },
      { headers: { "X-Total-Count": String(total) } }
    );
  } catch (error) {
    console.error("[API /api/admin/newsletter GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar pelanggan" },
      { status: 500 }
    );
  }
}
