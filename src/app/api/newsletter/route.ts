import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Format email tidak valid")),
});

function formatZodError(error: z.ZodError): string {
  return (
    error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join("; ") || "Data tidak valid"
  );
}

/** POST /api/newsletter — berlangganan newsletter (idempotent). */
export async function POST(request: Request) {
  try {
    const rate = checkRateLimit(`newsletter:${getClientIp(request)}`, 10, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Terlalu banyak permintaan. Coba lagi dalam satu menit.",
        },
        { status: 429 }
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

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const email = parsed.data.email;

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({
        ok: true,
        data: { subscribed: true, already: true },
      });
    }

    await db.newsletterSubscriber.create({ data: { email } });
    return NextResponse.json({ ok: true, data: { subscribed: true } });
  } catch (error) {
    // Race antar-request bersamaan pada email unique → anggap sudah terdaftar.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2002"
    ) {
      return NextResponse.json({
        ok: true,
        data: { subscribed: true, already: true },
      });
    }
    console.error("[API /api/newsletter] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mendaftarkan email" },
      { status: 500 }
    );
  }
}
