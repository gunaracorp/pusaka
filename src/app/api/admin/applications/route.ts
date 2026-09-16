import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/applications — seluruh pengajuan (desc createdAt).
 * Nama program di-resolve manual (tanpa relasi FK) → field `programName`.
 */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const [applications, programs] = await Promise.all([
      db.application.findMany({ orderBy: { createdAt: "desc" } }),
      db.program.findMany({ select: { code: true, name: true } }),
    ]);

    const programNameByCode = new Map(
      programs.map((p) => [p.code, p.name] as const)
    );

    const data = applications.map((application) => ({
      ...application,
      programName: programNameByCode.get(application.programCode) ?? null,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/admin/applications GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar pengajuan" },
      { status: 500 }
    );
  }
}
