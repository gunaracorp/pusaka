import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import {
  newsUpdateSchema,
  formatZodError,
  isUniqueConstraintError,
  slugify,
  parseIsoDate,
} from "@/lib/admin-validation";

export const dynamic = "force-dynamic";

/** PUT /api/admin/news/[id] — perbarui artikel berita (partial). */
export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const { id } = await ctx.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body request tidak valid (JSON diperlukan)" },
        { status: 400 }
      );
    }

    const parsed = newsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const existing = await db.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Artikel berita tidak ditemukan" },
        { status: 404 }
      );
    }

    const d = parsed.data;
    // Slug opsional: jika dikirim kosong → generate ulang dari title (baru atau lama)
    let slug: string | undefined;
    if (d.slug !== undefined) {
      slug = d.slug.trim() ? slugify(d.slug) : slugify(d.title || existing.title);
      if (!slug) {
        return NextResponse.json(
          { ok: false, error: "Slug tidak dapat dibuat dari judul" },
          { status: 400 }
        );
      }
      if (slug !== existing.slug) {
        const slugExists = await db.newsArticle.findUnique({ where: { slug } });
        if (slugExists) {
          return NextResponse.json(
            { ok: false, error: `Slug "${slug}" sudah digunakan` },
            { status: 409 }
          );
        }
      }
    }

    const publishedAt =
      d.publishedAt !== undefined ? parseIsoDate(d.publishedAt) : undefined;
    if (publishedAt === null) {
      return NextResponse.json(
        { ok: false, error: "Format publishedAt tidak valid (ISO diperlukan)" },
        { status: 400 }
      );
    }

    const updated = await db.newsArticle.update({
      where: { id },
      data: {
        title: d.title,
        slug,
        excerpt: d.excerpt,
        content: d.content,
        category: d.category,
        author: d.author,
        featured: d.featured,
        publishedAt,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { ok: false, error: "Slug sudah digunakan" },
        { status: 409 }
      );
    }
    console.error("[API /api/admin/news PUT] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memperbarui artikel berita" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/news/[id] — hapus artikel berita. */
export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const { id } = await ctx.params;
    const existing = await db.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Artikel berita tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.newsArticle.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: { id } });
  } catch (error) {
    console.error("[API /api/admin/news DELETE] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal menghapus artikel berita" },
      { status: 500 }
    );
  }
}
