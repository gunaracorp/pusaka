import { NextResponse } from "next/server";
import { MEMBER_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST /api/portal/logout — hapus cookie sesi anggota. */
export async function POST() {
  const res = NextResponse.json({ ok: true, data: { loggedOut: true } });
  res.cookies.set(MEMBER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
