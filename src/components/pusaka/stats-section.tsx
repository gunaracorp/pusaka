"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, FileSearch, Layers, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/pusaka/animated-counter";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { FALLBACK_STATS, getStats, type StatsT } from "@/lib/pusaka";

const PIE_COLORS: Record<string, string> = {
  PLATINUM: "#f59e0b",
  GOLD: "#d97706",
  SILVER: "#a8a29e",
};

function formatNumberID(v: unknown): string {
  return new Intl.NumberFormat("id-ID").format(Number(v));
}

function barTooltip(value: unknown): [string, string] {
  return [formatNumberID(value), "Pemegang"];
}

function tierTooltip(value: unknown, name: unknown): [string, string] {
  return [`${formatNumberID(value)} lembaga`, String(name)];
}

const TOOLTIP_STYLE = { borderRadius: 12, border: "1px solid #d6d3d1", fontSize: 12 } as const;

export function StatsSection() {
  const [stats, setStats] = useState<StatsT | null>(null);

  useEffect(() => {
    let alive = true;
    getStats()
      .then((data) => {
        if (alive) setStats(data);
      })
      .catch(() => {
        if (alive) setStats(FALLBACK_STATS);
      });
    return () => {
      alive = false;
    };
  }, []);

  const s = stats ?? FALLBACK_STATS;

  const counters = [
    { icon: Award, label: "Sertifikat Terbit", value: s.totals.certificateHolders, suffix: "+" },
    { icon: Layers, label: "Lembaga Terakreditasi", value: s.totals.institutions, suffix: "" },
    { icon: Users, label: "Dewan Pakar", value: s.totals.experts, suffix: "" },
    { icon: FileSearch, label: "Verifikasi Hari Ini", value: s.totals.verificationsToday, suffix: "" },
  ];

  return (
    <section id="statistik" className="scroll-mt-20 bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Data & Statistik"
          title="Transparansi dalam Angka"
          subtitle="Kinerja sertifikasi & akreditasi PUSAKA diperbarui langsung dari basis data operasional — terbuka untuk publik."
        />

        {/* 4 counter besar */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {counters.map((c, idx) => {
            const Icon = c.icon;
            return (
              <FadeIn key={c.label} delay={idx * 0.08}>
                <Card className="border-stone-200 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="font-display text-3xl font-black text-stone-900 sm:text-4xl">
                      <AnimatedCounter value={c.value} suffix={c.suffix} />
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-stone-500">
                      {c.label}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* charts */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <FadeIn delay={0.1} className="lg:col-span-3">
            <Card className="h-full border-stone-200">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-bold">
                  Distribusi Pemegang per Program
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 pt-4">
                {stats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={s.programDistribution} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                      <XAxis
                        dataKey="code"
                        tick={{ fontSize: 11, fill: "#78716c" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e7e5e4" }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#78716c" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => formatNumberID(v)}
                      />
                      <Tooltip
                        formatter={barTooltip}
                        contentStyle={TOOLTIP_STYLE}
                      />
                      <Bar dataKey="holders" radius={[6, 6, 0, 0]} fill="#047857" maxBarSize={44} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="h-full w-full rounded-xl" />
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card className="h-full border-stone-200">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-bold">Distribusi Tier Lembaga</CardTitle>
              </CardHeader>
              <CardContent className="h-72 pt-4">
                {stats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={s.tierDistribution}
                        dataKey="count"
                        nameKey="tier"
                        innerRadius={52}
                        outerRadius={84}
                        paddingAngle={3}
                        strokeWidth={2}
                      >
                        {s.tierDistribution.map((entry) => (
                          <Cell
                            key={entry.tier}
                            fill={PIE_COLORS[entry.tier] ?? "#57534e"}
                            stroke="#ffffff"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={tierTooltip}
                        contentStyle={{ borderRadius: 12, border: "1px solid #d6d3d1", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="h-full w-full rounded-xl" />
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
