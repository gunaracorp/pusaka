import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/** 6 bulan terakhir (termasuk bulan berjalan) → [{ month: "Sep 2026", count }] */
function buildMonthlyApplications(createdAts: Date[]): { month: string; count: number }[] {
  const now = new Date();
  const buckets: { key: string; month: string; count: number }[] = [];
  const indexByKey = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    indexByKey.set(key, buckets.length);
    buckets.push({
      key,
      month: `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`,
      count: 0,
    });
  }
  for (const createdAt of createdAts) {
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const idx = indexByKey.get(key);
    if (idx !== undefined) buckets[idx].count += 1;
  }
  return buckets.map(({ month, count }) => ({ month, count }));
}

/** GET /api/admin/stats — ringkasan dashboard admin. */
export async function GET(request: Request) {
  const session = getAdminSession(request);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      programs,
      institutions,
      experts,
      news,
      applicationsTotal,
      applicationsPending,
      verificationsToday,
      contactMessages,
      contactUnread,
      recentApplications,
      recentVerifications,
      applicationDates,
    ] = await Promise.all([
      db.program.count(),
      db.institution.count(),
      db.expert.count(),
      db.newsArticle.count(),
      db.application.count(),
      db.application.count({ where: { status: { not: "APPROVED" } } }),
      db.verifyLog.count({ where: { createdAt: { gte: startOfToday } } }),
      db.contactMessage.count(),
      db.contactMessage.count({ where: { handled: false } }),
      db.application.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.verifyLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      db.application.findMany({ select: { createdAt: true } }),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        totals: {
          programs,
          institutions,
          experts,
          news,
          applications: applicationsTotal,
          applicationsPending,
          verificationsToday,
          contactMessages,
          contactUnread,
        },
        recentApplications,
        recentVerifications,
        monthlyApplications: buildMonthlyApplications(
          applicationDates.map((a) => a.createdAt)
        ),
      },
    });
  } catch (error) {
    console.error("[API /api/admin/stats] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat statistik admin" },
      { status: 500 }
    );
  }
}
