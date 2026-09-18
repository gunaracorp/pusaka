import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createMemberToken,
  verifyPassword,
  MEMBER_COOKIE,
  MEMBER_MAX_AGE,
} from "@/lib/auth";
import {
  peekRateLimit,
  hitRateLimit,
  resetRateLimit,
  getClientIp,
} from "@/lib/rate-limit";

/** Batas percobaan gagal: 5 per 15 menit per IP. */
const LOGIN_RATE_LIMIT = 5;
const LOGIN_RATE_WINDOW_MS = 15 * 60_000;

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

/** POST /api/portal/login — autentikasi anggota lembaga (pemegang sertifikat). */
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
        { ok: false, error: "Email dan password wajib diisi dengan format yang benar" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const rateKey = `portal-login:${getClientIp(request)}`;
    const rate = peekRateLimit(rateKey, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json(
        { ok: false, error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." },
        { status: 429 }
      );
    }

    const account = await db.memberAccount.findUnique({
      where: { email },
      include: { institution: true },
    });
    // Pesan error identik agar tidak membocorkan keberadaan akun
    if (!account || !verifyPassword(password, account.passwordHash)) {
      hitRateLimit(rateKey, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
      return NextResponse.json(
        { ok: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    resetRateLimit(rateKey);

    const token = createMemberToken({
      accountId: account.id,
      email: account.email,
      name: account.name,
      institutionId: account.institutionId,
      institutionName: account.institution.name,
    });

    await db.memberAccount.update({
      where: { id: account.id },
      data: { lastLoginAt: new Date() },
    });

    const res = NextResponse.json({
      ok: true,
      data: {
        account: {
          id: account.id,
          email: account.email,
          name: account.name,
          position: account.position,
          createdAt: account.createdAt.toISOString(),
        },
        institution: {
          id: account.institution.id,
          name: account.institution.name,
          type: account.institution.type,
          city: account.institution.city,
          province: account.institution.province,
          certNumber: account.institution.certNumber,
          programCode: account.institution.programCode,
          status: account.institution.status,
          tier: account.institution.tier,
          score: account.institution.score,
          issuedAt: account.institution.issuedAt.toISOString(),
          expiresAt: account.institution.expiresAt.toISOString(),
          contact: account.institution.contact,
          phone: account.institution.phone,
          createdAt: account.institution.createdAt.toISOString(),
        },
      },
    });
    res.cookies.set(MEMBER_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: MEMBER_MAX_AGE,
    });
    return res;
  } catch (error) {
    console.error("[API /api/portal/login] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal melakukan login portal" },
      { status: 500 }
    );
  }
}
