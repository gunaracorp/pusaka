"use client";

// ============================================================
// PUSAKA CMS — Beranda dashboard: 8 kartu statistik + grafik
// bulanan + daftar pengajuan & verifikasi terbaru
// ============================================================

import { useCallback, useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  Building2,
  FileStack,
  Inbox,
  Mail,
  Newspaper,
  ScanSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  getAdminStats,
  APPLICATION_STATUS_META,
  type AdminStatsT,
} from "@/lib/admin-api";
import { getStats, formatNumber, timeAgo, type StatsT } from "@/lib/pusaka";

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  tone: "emerald" | "amber" | "teal" | "orange" | "cyan" | "rose";
  badge?: { text: string; className: string };
}) {
  const toneClass: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    teal: "bg-teal-100 text-teal-700",
    orange: "bg-orange-100 text-orange-700",
    cyan: "bg-cyan-100 text-cyan-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClass[tone]}`}
          aria-hidden
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        {badge ? (
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.className}`}>
            {badge.text}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight text-stone-900">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-stone-500">{label}</p>
    </div>
  );
}

export function AdminDashboardHome() {
  const [stats, setStats] = useState<AdminStatsT | null>(null);
  const [publicStats, setPublicStats] = useState<StatsT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [adminData, pubData] = await Promise.allSettled([getAdminStats(), getStats()]);
      if (adminData.status === "fulfilled") setStats(adminData.value);
      if (pubData.status === "fulfilled") setPublicStats(pubData.value);
      if (adminData.status === "rejected" && pubData.status === "rejected") {
        throw adminData.reason;
      }
    } catch {
      setError("Gagal memuat statistik. Coba muat ulang.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Memuat statistik dashboard">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <Inbox className="h-10 w-10 text-stone-300" aria-hidden />
        <p className="text-sm text-stone-500">{error ?? "Data tidak tersedia."}</p>
        <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-800 hover:bg-emerald-50" onClick={load}>
          Muat Ulang
        </Button>
      </div>
    );
  }

  const t = stats.totals;
  const holders = publicStats?.totals.certificateHolders ?? 0;

  return (
    <div className="space-y-6">
      {/* 8 kartu statistik */}
      <section aria-label="Statistik ringkas">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Award} label="Total Program" value={t.programs} tone="emerald" />
          <StatCard icon={Building2} label="Institusi Terakreditasi" value={t.institutions} tone="amber" />
          <StatCard icon={Users} label="Dewan Pakar" value={t.experts} tone="teal" />
          <StatCard
            icon={BadgeCheck}
            label="Sertifikat Terbit"
            value={formatNumber(holders)}
            tone="emerald"
          />
          <StatCard
            icon={FileStack}
            label="Pengajuan"
            value={t.applications}
            tone="orange"
            badge={
              t.applicationsPending > 0
                ? {
                    text: `${t.applicationsPending} pending`,
                    className: "border-amber-200 bg-amber-50 text-amber-800",
                  }
                : undefined
            }
          />
          <StatCard icon={ScanSearch} label="Verifikasi Hari Ini" value={t.verificationsToday} tone="cyan" />
          <StatCard
            icon={Mail}
            label="Pesan"
            value={t.contactMessages}
            tone="amber"
            badge={
              t.contactUnread > 0
                ? {
                    text: `${t.contactUnread} belum dibaca`,
                    className: "border-rose-200 bg-rose-50 text-rose-700",
                  }
                : undefined
            }
          />
          <StatCard icon={Newspaper} label="Berita" value={t.news} tone="rose" />
        </div>
      </section>

      {/* Grafik pengajuan bulanan */}
      <section aria-label="Grafik pengajuan bulanan">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Pengajuan 6 Bulan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyApplications} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#78716c" }}
                    axisLine={{ stroke: "#e7e5e4" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#78716c" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(5, 150, 105, 0.06)" }}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #d1fae5",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" name="Pengajuan" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={42} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Daftar terbaru */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Aktivitas terbaru">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Pengajuan Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {stats.recentApplications.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-500">Belum ada pengajuan.</p>
            ) : (
              <ul className="divide-y">
                {stats.recentApplications.map((app) => {
                  const meta = APPLICATION_STATUS_META[app.status];
                  return (
                    <li key={app.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-800">{app.fullName}</p>
                        <p className="font-mono text-xs text-emerald-700">{app.trackingCode}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            meta?.badgeClass ?? "border-stone-200 bg-stone-100 text-stone-600"
                          }`}
                        >
                          {meta?.label ?? app.status}
                        </span>
                        <span className="text-[11px] text-stone-400">{timeAgo(app.createdAt)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Verifikasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            {stats.recentVerifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-500">Belum ada verifikasi.</p>
            ) : (
              <ul className="divide-y">
                {stats.recentVerifications.map((log) => {
                  const valid = log.result === "VALID";
                  return (
                    <li key={log.id} className="flex items-center justify-between gap-3 py-2.5">
                      <p className="min-w-0 truncate font-mono text-sm text-stone-700">{log.certNumber}</p>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          className={
                            valid
                              ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                              : "border-red-200 bg-red-100 text-red-700"
                          }
                        >
                          {log.result}
                        </Badge>
                        <span className="text-[11px] text-stone-400">{timeAgo(log.createdAt)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
