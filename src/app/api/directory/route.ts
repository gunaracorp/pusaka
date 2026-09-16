import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/directory?q=&type=&tier=&city=
 * Filter opsional; q = nama ATAU certNumber contains.
 * Sorted: tier PLATINUM > GOLD > SILVER, lalu score desc. Max 50.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const type = (searchParams.get("type") ?? "").trim();
    const tier = (searchParams.get("tier") ?? "").trim();
    const city = (searchParams.get("city") ?? "").trim();

    const institutions = await db.institution.findMany();

    const qLower = q.toLowerCase();
    const typeUpper = type.toUpperCase();
    const tierUpper = tier.toUpperCase();
    const cityLower = city.toLowerCase();

    const filtered = institutions.filter((inst) => {
      if (
        qLower &&
        !inst.name.toLowerCase().includes(qLower) &&
        !inst.certNumber.toLowerCase().includes(qLower)
      ) {
        return false;
      }
      if (typeUpper && inst.type.toUpperCase() !== typeUpper) return false;
      if (tierUpper && inst.tier.toUpperCase() !== tierUpper) return false;
      if (cityLower && !inst.city.toLowerCase().includes(cityLower)) return false;
      return true;
    });

    const tierRank: Record<string, number> = {
      PLATINUM: 3,
      GOLD: 2,
      SILVER: 1,
    };

    const data = filtered
      .sort((a, b) => {
        const rankDiff =
          (tierRank[b.tier.toUpperCase()] ?? 0) -
          (tierRank[a.tier.toUpperCase()] ?? 0);
        if (rankDiff !== 0) return rankDiff;
        return b.score - a.score;
      })
      .slice(0, 50);

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/directory] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat direktori institusi" },
      { status: 500 }
    );
  }
}
