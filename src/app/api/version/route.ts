import { NextResponse } from "next/server";
import {
  CHANGELOG,
  FIRST_RELEASE,
  OS_CHANNEL,
  OS_CODENAME,
  OS_NAME,
  OS_RELEASE_DATE,
  OS_SPEC,
  OS_VERSION,
  RELEASE_COUNTS,
  TOTAL_RELEASES,
  compareSemVer,
  isValidSemVer,
  nextVersionProjections,
  parseSemVer,
  type ChangelogEntry,
  type ReleaseType,
} from "@/lib/version";

export const dynamic = "force-dynamic";

/** Kontrak response GET /api/version (lihat VERSIONING.md §8). */
export interface VersionData {
  name: string;
  version: string;
  codename: string;
  channel: string;
  spec: string;
  releasedAt: string;
  semver: { major: number; minor: number; patch: number } | null;
  projections: Record<ReleaseType, string>;
  totals: {
    releases: number;
    byType: Record<ReleaseType, number>;
    bullets: { added: number; changed: number; removed: number; fixed: number; security: number };
  };
  history: { first: string; current: string };
  changelog: ChangelogEntry[];
  returned: number;
}

const VALID_TYPES: ReleaseType[] = ["major", "minor", "patch"];

function countBullets() {
  let added = 0,
    changed = 0,
    removed = 0,
    fixed = 0,
    security = 0;
  for (const e of CHANGELOG) {
    added += e.added?.length ?? 0;
    changed += e.changed?.length ?? 0;
    removed += e.removed?.length ?? 0;
    fixed += e.fixed?.length ?? 0;
    security += e.security?.length ?? 0;
  }
  return { added, changed, removed, fixed, security };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter ?type= major|minor|patch
    const typeParam = searchParams.get("type");
    if (typeParam && !VALID_TYPES.includes(typeParam as ReleaseType)) {
      return NextResponse.json(
        { ok: false, error: "Parameter 'type' harus salah satu dari: major, minor, patch" },
        { status: 400 }
      );
    }

    // Filter ?limit= (1..50)
    const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const limit =
      Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 0;

    // Filter ?q= pencarian teks (versi, judul, ringkasan, butir, task)
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();

    let entries = [...CHANGELOG];
    if (typeParam) entries = entries.filter((e) => e.type === typeParam);
    if (q) {
      entries = entries.filter((e) =>
        JSON.stringify(e).toLowerCase().includes(q)
      );
    }
    const matched = entries.length;
    if (limit) entries = entries.slice(0, limit);

    // Validasi kesehatan registri (self-audit) — versi berjalan harus terdaftar
    const registered = CHANGELOG.some(
      (e) => e.version === OS_VERSION && compareSemVer(e.version, OS_VERSION) === 0
    );

    const data: VersionData = {
      name: OS_NAME,
      version: OS_VERSION,
      codename: OS_CODENAME,
      channel: OS_CHANNEL,
      spec: OS_SPEC,
      releasedAt: OS_RELEASE_DATE,
      semver: parseSemVer(OS_VERSION),
      projections: nextVersionProjections(OS_VERSION),
      totals: {
        releases: TOTAL_RELEASES,
        byType: RELEASE_COUNTS,
        bullets: countBullets(),
      },
      history: { first: FIRST_RELEASE, current: OS_VERSION },
      changelog: entries,
      returned: entries.length,
    };

    return NextResponse.json(
      {
        ok: true,
        data,
        meta: {
          registryHealthy: registered,
          semverValid: isValidSemVer(OS_VERSION),
          matched,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[API /api/version] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data versi" },
      { status: 500 }
    );
  }
}
