import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/news — berita sorted publishedAt desc. */
export async function GET() {
  try {
    const data = await db.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/news] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat berita" },
      { status: 500 }
    );
  }
}
