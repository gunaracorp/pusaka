import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Kontrak response GET /api/stats */
export interface StatsData {
  totals: {
    certificateHolders: number;
    institutions: number;
    experts: number;
    programs: number;
    verificationsToday: number;
    applicationsThisMonth: number;
    /** Katalog layanan global: jumlah layanan aktif (model Service). */
    services: number;
  };
  programDistribution: { code: string; holders: number }[];
  tierDistribution: { tier: string; count: number }[];
  recentActivity: { certNumber: string; result: string; at: string }[];
  topProvinces: { province: string; count: number }[];
  /** Jaringan global: jumlah negara unik (distinct countryCode GlobalNode). */
  globalCountries: number;
  /** Jaringan global: jumlah mitra internasional (kind=MITRA_INTERNASIONAL). */
  globalPartners: number;
}

const TIER_ORDER: string[] = ["SILVER", "GOLD", "PLATINUM"];

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      holderAgg,
      institutionCount,
      expertCount,
      programCount,
      verificationsToday,
      applicationsThisMonth,
      programs,
      tierGroups,
      provinceGroups,
      recentLogs,
      servicesCount,
    ] = await Promise.all([
      db.program.aggregate({ _sum: { holderCount: true } }),
      db.institution.count(),
      db.expert.count(),
      db.program.count(),
      db.verifyLog.count({ where: { createdAt: { gte: startOfToday } } }),
      db.application.count({ where: { createdAt: { gte: startOfMonth } } }),
      db.program.findMany({ select: { code: true, holderCount: true } }),
      db.institution.groupBy({ by: ["tier"], _count: { tier: true } }),
      db.institution.groupBy({ by: ["province"], _count: { province: true } }),
      db.verifyLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { certNumber: true, result: true, createdAt: true },
      }),
      db.service.count({ where: { active: true } }),
    ]);

    // Statistik jaringan global — try/catch terpisah agar tetap aman (default 0)
    // jika tabel GlobalNode kosong/belum ada.
    let globalCountries = 0;
    let globalPartners = 0;
    try {
      const globalNodes = await db.globalNode.findMany({
        select: { countryCode: true, kind: true },
      });
      globalCountries = new Set(globalNodes.map((n) => n.countryCode)).size;
      globalPartners = globalNodes.filter(
        (n) => n.kind === "MITRA_INTERNASIONAL"
      ).length;
    } catch (globalError) {
      console.error("[API /api/stats] Global node query error:", globalError);
    }

    const data: StatsData = {
      totals: {
        certificateHolders: holderAgg._sum.holderCount ?? 0,
        institutions: institutionCount,
        experts: expertCount,
        programs: programCount,
        verificationsToday,
        applicationsThisMonth,
        services: servicesCount,
      },
      programDistribution: programs
        .map((p) => ({ code: p.code, holders: p.holderCount }))
        .sort((a, b) => b.holders - a.holders),
      tierDistribution: TIER_ORDER.map((tier) => ({
        tier,
        count: tierGroups.find((g) => g.tier.toUpperCase() === tier)?._count.tier ?? 0,
      })),
      recentActivity: recentLogs.map((log) => ({
        certNumber: log.certNumber,
        result: log.result,
        at: log.createdAt.toISOString(),
      })),
      topProvinces: provinceGroups
        .map((g) => ({ province: g.province, count: g._count.province }))
        .sort((a, b) => b.count - a.count || a.province.localeCompare(b.province))
        .slice(0, 6),
      globalCountries,
      globalPartners,
    };

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[API /api/stats] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
