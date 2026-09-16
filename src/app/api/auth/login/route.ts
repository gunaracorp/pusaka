import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createSessionToken,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

/** POST /api/auth/login — autentikasi admin & set cookie sesi. */
export async function POST(request: Request) {
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

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const username = parsed.data.username.trim();
    const password = parsed.data.password;
    if (!username) {
      return NextResponse.json(
        { ok: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const admin = await db.adminUser.findUnique({ where: { username } });
    // Pesan error identik utk user tak ditemukan / password salah (jangan bocorkan)
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "User ID atau password salah" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      username: admin.username,
      name: admin.name,
      role: admin.role,
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    });

    await db.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const res = NextResponse.json({
      ok: true,
      data: { user: { username: admin.username, name: admin.name, role: admin.role } },
    });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch (error) {
    console.error("[API /api/auth/login] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal melakukan login" },
      { status: 500 }
    );
  }
}
