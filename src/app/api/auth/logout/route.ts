import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST /api/auth/logout — hapus cookie sesi admin. */
export async function POST() {
  try {
    const res = NextResponse.json({ ok: true, data: { loggedOut: true } });
    res.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (error) {
    console.error("[API /api/auth/logout] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal melakukan logout" },
      { status: 500 }
    );
  }
}
