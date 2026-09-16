import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Format email tidak valid"),
  subject: z.string().min(3, "Subjek minimal 3 karakter"),
  message: z.string().min(1, "Pesan wajib diisi"),
});

function formatZodError(error: z.ZodError): string {
  return (
    error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join("; ") || "Data kontak tidak valid"
  );
}

/** POST /api/contact — simpan pesan kontak. */
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

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    await db.contactMessage.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.trim(),
        subject: parsed.data.subject.trim(),
        message: parsed.data.message.trim(),
      },
    });

    return NextResponse.json({ ok: true, data: { received: true } });
  } catch (error) {
    console.error("[API /api/contact] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
