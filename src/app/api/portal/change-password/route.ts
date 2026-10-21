import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getMemberSession, hashPassword, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
  newPassword: z
    .string()
    .min(8, "Password baru minimal 8 karakter")
    .max(72, "Password baru maksimal 72 karakter"),
});

/** POST /api/portal/change-password — ganti password akun anggota. */
export async function POST(request: Request) {
  try {
    const session = getMemberSession(request);
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body request tidak valid (JSON diperlukan)" },
        { status: 400 }
      );
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            parsed.error.issues[0]?.message ?? "Data perubahan password tidak valid",
        },
        { status: 400 }
      );
    }

    const account = await db.memberAccount.findUnique({
      where: { id: session.accountId },
    });
    if (!account) {
      return NextResponse.json(
        { ok: false, error: "Akun tidak ditemukan" },
        { status: 404 }
      );
    }

    if (!verifyPassword(parsed.data.currentPassword, account.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "Password saat ini salah" },
        { status: 400 }
      );
    }

    await db.memberAccount.update({
      where: { id: account.id },
      data: { passwordHash: hashPassword(parsed.data.newPassword) },
    });

    return NextResponse.json({ ok: true, data: { changed: true } });
  } catch (error) {
    console.error("[API /api/portal/change-password] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengganti password" },
      { status: 500 }
    );
  }
}
