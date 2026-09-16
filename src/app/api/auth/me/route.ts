import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me — info sesi admin saat ini.
 * Session valid → {ok:true,data:{user}}; tanpa/expired → {ok:true,data:null} (HTTP 200).
 */
export async function GET(request: Request) {
  try {
    const session = getAdminSession(request);
    if (!session) {
      return NextResponse.json({ ok: true, data: null });
    }
    return NextResponse.json({
      ok: true,
      data: {
        user: { username: session.username, name: session.name, role: session.role },
      },
    });
  } catch (error) {
    console.error("[API /api/auth/me] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengambil informasi sesi" },
      { status: 500 }
    );
  }
}
