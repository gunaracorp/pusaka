import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Kontrak baris layanan (ServiceRow) */
export interface ServiceRow {
  id: string;
  code: string;
  name: string;
  category: string;
  categorySlug: string;
  standard: string;
  description: string;
  price: number;
  durationWeeks: number;
  scheme: "BADAN_USAHA" | "PROFESIONAL";
  scope: "NASIONAL" | "INTERNASIONAL";
  issuer: string;
}

/** Kontrak response GET /api/services */
export interface ServicesData {
  items: ServiceRow[];
  total: number; // hasil filter
  page: number;
  pageSize: number;
  totalPages: number;
  totalAll: number; // seluruh katalog (tanpa filter)
  facets: {
    categories: { slug: string; name: string; count: number }[];
    schemes: { scheme: string; count: number }[];
    scopes: { scope: string; count: number }[];
  };
}

const SCHEME_ORDER = ["BADAN_USAHA", "PROFESIONAL"];
const SCOPE_ORDER = ["INTERNASIONAL", "NASIONAL"];

/**
 * GET /api/services?q=&category=<slug>&scheme=&scope=&page=&pageSize=
 * Katalog 500 layanan sertifikasi & akreditasi lintas bidang.
 * - q: contains case-insensitive pada name/standard/category/code
 * - category: slug bidang exact (mis. "manajemen-mutu")
 * - scheme: BADAN_USAHA | PROFESIONAL ; scope: NASIONAL | INTERNASIONAL
 * - page (1-based), pageSize default 12 max 48
 * - Facet dihitung dari SELURUH dataset (bukan hasil filter), urutan sesuai data.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    const category = (searchParams.get("category") ?? "").trim().toLowerCase();
    const scheme = (searchParams.get("scheme") ?? "").trim().toUpperCase();
    const scope = (searchParams.get("scope") ?? "").trim().toUpperCase();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(48, Math.max(6, parseInt(searchParams.get("pageSize") ?? "12", 10) || 12));

    const all = await db.service.findMany({
      where: { active: true },
      orderBy: { code: "asc" },
    });

    // ===== Facet dari seluruh dataset =====
    const catMap = new Map<string, { slug: string; name: string; count: number }>();
    for (const s of all) {
      const cur = catMap.get(s.categorySlug);
      if (cur) cur.count++;
      else catMap.set(s.categorySlug, { slug: s.categorySlug, name: s.category, count: 1 });
    }
    const schemeMap = new Map<string, number>();
    const scopeMap = new Map<string, number>();
    for (const s of all) {
      schemeMap.set(s.scheme, (schemeMap.get(s.scheme) ?? 0) + 1);
      scopeMap.set(s.scope, (scopeMap.get(s.scope) ?? 0) + 1);
    }

    // ===== Filter in-memory (SQLite) =====
    const filtered = all.filter((s) => {
      if (category && s.categorySlug !== category) return false;
      if (scheme && s.scheme !== scheme) return false;
      if (scope && s.scope !== scope) return false;
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.standard.toLowerCase().includes(q) &&
        !s.category.toLowerCase().includes(q) &&
        !s.code.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const items: ServiceRow[] = filtered
      .slice((safePage - 1) * pageSize, safePage * pageSize)
      .map((s) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        category: s.category,
        categorySlug: s.categorySlug,
        standard: s.standard,
        description: s.description,
        price: s.price,
        durationWeeks: s.durationWeeks,
        scheme: s.scheme === "PROFESIONAL" ? "PROFESIONAL" : "BADAN_USAHA",
        scope: s.scope === "NASIONAL" ? "NASIONAL" : "INTERNASIONAL",
        issuer: s.issuer,
      }));

    const data: ServicesData = {
      items,
      total,
      page: safePage,
      pageSize,
      totalPages,
      totalAll: all.length,
      facets: {
        categories: [...catMap.values()],
        schemes: SCHEME_ORDER.map((k) => ({ scheme: k, count: schemeMap.get(k) ?? 0 })),
        scopes: SCOPE_ORDER.map((k) => ({ scope: k, count: scopeMap.get(k) ?? 0 })),
      },
    };

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/services] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat katalog layanan" },
      { status: 500 }
    );
  }
}
