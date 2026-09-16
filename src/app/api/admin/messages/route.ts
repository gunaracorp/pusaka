import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/messages — seluruh pesan kontak (desc createdAt). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: messages });
  } catch (error) {
    console.error("[API /api/admin/messages GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar pesan" },
      { status: 500 }
    );
  }
}
