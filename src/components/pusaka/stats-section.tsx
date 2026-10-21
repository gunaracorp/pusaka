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
import { Award, BadgeCheck, FileSearch, Globe2, Handshake, Layers, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/pusaka/animated-counter";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";
import { FALLBACK_STATS, getStats, type StatsT } from "@/lib/pusaka";

const PIE_COLORS: Record<string, string> = {
  PLATINUM: "#f59e0b",
  GOLD: "#d97706",
  SILVER: "#a8a29e",
};

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
} as const;

export function StatsSection() {
  const { t, formatNumber } = useI18n();
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

  /** Label tier via dict (common.tiers), fallback ke kode mentah. */
  function tierLabel(raw: string): string {
    const key = `common.tiers.${raw}`;
    const translated = t(key);
    return translated === key ? raw : translated;
  }

  const counters = [
    { icon: Award, label: t("stats.counters.certificates"), value: s.totals.certificateHolders, suffix: "+" },
    { icon: BadgeCheck, label: t("stats.counters.services"), value: s.totals.services, suffix: "+" },
    { icon: Layers, label: t("stats.counters.institutions"), value: s.totals.institutions, suffix: "" },
    { icon: Users, label: t("stats.counters.experts"), value: s.totals.experts, suffix: "" },
    { icon: FileSearch, label: t("stats.counters.verifications"), value: s.totals.verificationsToday, suffix: "" },
    { icon: Globe2, label: t("stats.counters.countries"), value: s.globalCountries ?? 32, suffix: "" },
    { icon: Handshake, label: t("stats.counters.partners"), value: s.globalPartners ?? 26, suffix: "" },
  ];

  return (
    <section id="statistik" className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("stats.eyebrow")}
          title={t("stats.title")}
          subtitle={t("stats.subtitle")}
        />

        {/* 7 counter besar */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {counters.map((c, idx) => {
            const Icon = c.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.08}>
                <Card className="border-border text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700 dark:text-emerald-400">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="font-display text-3xl font-black text-foreground sm:text-4xl">
                      <AnimatedCounter value={c.value} suffix={c.suffix} />
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
            <Card className="h-full border-border">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-bold">
                  {t("stats.charts.programs")}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72 pt-4">
                {stats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={s.programDistribution} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#a8a29e" strokeOpacity={0.35} vertical={false} />
                      <XAxis
                        dataKey="code"
                        tick={{ fontSize: 11, fill: "#a8a29e" }}
                        tickLine={false}
                        axisLine={{ stroke: "#a8a29e", strokeOpacity: 0.35 }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#a8a29e" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => formatNumber(v)}
                      />
                      <Tooltip
                        formatter={(value: unknown) =>
                          [formatNumber(Number(value)), t("stats.tooltip.holders")] as [string, string]
                        }
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ fill: "rgba(120,113,108,0.12)" }}
                      />
                      <Bar dataKey="holders" radius={[6, 6, 0, 0]} fill="#10b981" maxBarSize={44} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="h-full w-full rounded-xl" />
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card className="h-full border-border">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-bold">{t("stats.charts.tiers")}</CardTitle>
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
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: unknown, name: unknown) =>
                          [
                            t("stats.tooltip.institutions", { count: formatNumber(Number(value)) }),
                            tierLabel(String(name)),
                          ] as [string, string]
                        }
                        contentStyle={TOOLTIP_STYLE}
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

        {/* provinsi top */}
        {s.topProvinces.length > 0 ? (
          <FadeIn delay={0.25} className="mt-6">
            <Card className="border-border">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-bold">{t("stats.charts.provinces")}</CardTitle>
              </CardHeader>
              <CardContent className="h-64 pt-4">
                {stats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={s.topProvinces}
                      layout="vertical"
                      margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#a8a29e" strokeOpacity={0.35} horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "#a8a29e" }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tickFormatter={(v: number) => formatNumber(v)}
                      />
                      <YAxis
                        type="category"
                        dataKey="province"
                        width={110}
                        tick={{ fontSize: 11, fill: "#a8a29e" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value: unknown) =>
                          [
                            t("stats.tooltip.institutions", { count: formatNumber(Number(value)) }),
                            t("stats.tooltip.institutionName"),
                          ] as [string, string]
                        }
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ fill: "rgba(120,113,108,0.12)" }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#d97706" maxBarSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Skeleton className="h-full w-full rounded-xl" />
                )}
              </CardContent>
            </Card>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
