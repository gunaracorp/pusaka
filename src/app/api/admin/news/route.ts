import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  newsCreateSchema,
  formatZodError,
  isUniqueConstraintError,
  slugify,
  parseIsoDate,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** GET /api/admin/news — daftar seluruh artikel berita (admin). */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const news = await db.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: news });
  } catch (error) {
    console.error("[API /api/admin/news GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar berita" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/news — publikasikan artikel berita baru. */
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

    const parsed = newsCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const d = parsed.data;
    // Slug: pakai yang dikirim, jika kosong auto-generate dari judul
    let slug = d.slug ? slugify(d.slug) : slugify(d.title);
    if (!slug) {
      slug = slugify(d.title);
    }
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Slug tidak dapat dibuat dari judul" },
        { status: 400 }
      );
    }

    const slugExists = await db.newsArticle.findUnique({ where: { slug } });
    if (slugExists) {
      return NextResponse.json(
        { ok: false, error: `Slug "${slug}" sudah digunakan` },
        { status: 409 }
      );
    }

    let publishedAt = new Date();
    if (d.publishedAt !== undefined) {
      const parsedDate = parseIsoDate(d.publishedAt);
      if (!parsedDate) {
        return NextResponse.json(
          { ok: false, error: "Format publishedAt tidak valid (ISO diperlukan)" },
          { status: 400 }
        );
      }
      publishedAt = parsedDate;
    }

    const created = await db.newsArticle.create({
      data: {
        title: d.title,
        slug,
        excerpt: d.excerpt,
        content: d.content,
        category: d.category,
        author: d.author,
        featured: d.featured ?? false,
        publishedAt,
      },
    });

    return NextResponse.json({ ok: true, data: created });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/news POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal membuat artikel berita" },
      { status: 500 }
    );
  }
}
