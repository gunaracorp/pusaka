import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/experts — 46 dewan pakar lintas bidang.
 * Sorted: featured desc, lalu name asc.
 */
export async function GET() {
  try {
    const data = await db.expert.findMany({
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/experts] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat dewan pakar" },
      { status: 500 }
    );
  }
}
