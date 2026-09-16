import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Urutan kawasan tetap sesuai kontrak. */
const REGION_ORDER = [
  "TIMUR_TENGAH",
  "ASIA_TENGGARA",
  "ASIA_SELATAN",
  "ASIA_TIMUR",
  "EROPA",
  "AFRIKA",
  "AMERIKA",
  "OSEANIA",
] as const;

/**
 * GET /api/global?region=&kind=&q=
 * Jaringan global PUSAKA (kantor perwakilan & mitra internasional).
 * - region exact match, kind exact match, q = contains case-insensitive pada country/city/title/orgName.
 * - Sorted order asc. `scope` dikembalikan sebagai string JSON (parse di client).
 * - Summary dihitung dari SELURUH dataset (bukan hasil filter).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = (searchParams.get("region") ?? "").trim();
    const kind = (searchParams.get("kind") ?? "").trim();
    const q = (searchParams.get("q") ?? "").trim();

    const allNodes = await db.globalNode.findMany({ orderBy: { order: "asc" } });

    // ===== Summary dari seluruh dataset =====
    const countryCodes = new Set(allNodes.map((n) => n.countryCode));
    const regionCounts = REGION_ORDER.map((r) => ({
      region: r,
      count: allNodes.filter((n) => n.region.toUpperCase() === r).length,
    }));

    const summary = {
      totalCountries: countryCodes.size,
      totalNodes: allNodes.length,
      offices: allNodes.filter((n) => n.kind === "KANTOR_PERWAKILAN").length,
      partners: allNodes.filter((n) => n.kind === "MITRA_INTERNASIONAL").length,
      regionCounts,
    };

    // ===== Filter in-memory (SQLite) =====
    const regionUpper = region.toUpperCase();
    const kindUpper = kind.toUpperCase();
    const qLower = q.toLowerCase();

    const nodes = allNodes.filter((node) => {
      if (regionUpper && node.region.toUpperCase() !== regionUpper) return false;
      if (kindUpper && node.kind.toUpperCase() !== kindUpper) return false;
      if (
        qLower &&
        !node.country.toLowerCase().includes(qLower) &&
        !node.city.toLowerCase().includes(qLower) &&
        !node.title.toLowerCase().includes(qLower) &&
        !node.orgName.toLowerCase().includes(qLower)
      ) {
        return false;
      }
      return true;
    });

    return NextResponse.json({ ok: true, data: { nodes, summary } });
  } catch (error) {
    console.error("[API /api/global] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat jaringan global" },
      { status: 500 }
    );
  }
}
