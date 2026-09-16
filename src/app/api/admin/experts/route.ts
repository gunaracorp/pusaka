import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  expertCreateSchema,
  formatZodError,
  isUniqueConstraintError,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** GET /api/admin/experts — daftar seluruh dewan pakar (admin). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const experts = await db.expert.findMany({
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
    return NextResponse.json({ ok: true, data: experts });
  } catch (error) {
    console.error("[API /api/admin/experts GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar dewan pakar" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/experts — tambah dewan pakar baru. */
export async function POST(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

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

    const parsed = expertCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const duplicate = await db.expert.findUnique({
      where: { licenseNo: d.licenseNo },
    });
    if (duplicate) {
      return NextResponse.json(
        { ok: false, error: `Nomor lisensi "${d.licenseNo}" sudah terdaftar` },
        { status: 409 }
      );
    }

    const created = await db.expert.create({
      data: {
        name: d.name,
        field: d.field,
        expertise: d.expertise,
        category: d.category,
        licenseNo: d.licenseNo,
        experienceYears: d.experienceYears,
        organization: d.organization,
        education: d.education,
        initials: d.initials,
        featured: d.featured ?? false,
      },
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Nomor lisensi sudah terdaftar" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/experts POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menambahkan dewan pakar" },
      { status: 500 }
    );
  }
}
