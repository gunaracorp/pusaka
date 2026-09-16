import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/programs — daftar 7 program sertifikasi PUSAKA.
 * `requirements`, `benefits`, `accreditation` berupa string JSON (parse di client).
 */
export async function GET() {
  try {
    const data = await db.program.findMany();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/programs] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar program" },
      { status: 500 }
    );
  }
}
