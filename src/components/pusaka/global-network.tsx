"use client";

// ============================================================
// PUSAKA — Section Jaringan Global (layanan di 32 negara)
// Section gelap premium: emerald-950 + ornamen radial + aksen amber.
// Data: GET /api/global (fetch sekali, filter di client-side).
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Globe2,
  Handshake,
  Landmark,
  Loader2,
  MapPin,
  Network,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/pusaka/fade-in";
import { AnimatedCounter } from "@/components/pusaka/animated-counter";
import { useI18n } from "@/lib/i18n/provider";
import {
  GLOBAL_KIND_LABEL,
  GLOBAL_REGION_LABEL,
  GLOBAL_REGION_ORDER,
  GLOBAL_STATUS_META,
  PROGRAM_LABELS,
  getGlobal,
  safeParseJsonArray,
  type GlobalNodeT,
  type GlobalResp,
} from "@/lib/pusaka";

// ---------- meta stat pill ----------

const STAT_META: {
  key: "totalCountries" | "totalNodes" | "offices" | "partners";
  icon: LucideIcon;
}[] = [
  { key: "totalCountries", icon: Globe2 },
  { key: "totalNodes", icon: Network },
  { key: "offices", icon: Landmark },
  { key: "partners", icon: Handshake },
];

/** Terjemahan kunci dinamis; label meta jadi fallback bila kunci kamus tidak ada. */
function metaT(
  t: (path: string, vars?: Record<string, string | number>) => string,
  key: string,
  fallback: string
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

/** Summary cadangan bila backend belum mengirim objek summary. */
function computeSummary(nodes: GlobalNodeT[]): GlobalResp["summary"] {
  const regionCounts = new Map<string, number>();
  const countries = new Set<string>();
  let offices = 0;
  let partners = 0;
  for (const n of nodes) {
    countries.add(n.countryCode);
    regionCounts.set(n.region, (regionCounts.get(n.region) ?? 0) + 1);
    if (n.kind === "KANTOR_PERWAKILAN") offices += 1;
    if (n.kind === "MITRA_INTERNASIONAL") partners += 1;
  }
  return {
    totalCountries: countries.size,
    totalNodes: nodes.length,
    offices,
    partners,
    regionCounts: [...regionCounts.entries()].map(([region, count]) => ({ region, count })),
  };
}

// ---------- dialog detail node ----------

function NodeDetailDialog({
  node,
  onClose,
}: {
  node: GlobalNodeT | null;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const scope = safeParseJsonArray(node?.scope);
  const statusMeta = node ? GLOBAL_STATUS_META[node.status] : undefined;

  function handleApply() {
    const code = scope[0];
    if (code) {
      window.dispatchEvent(new CustomEvent("pusaka:select-program", { detail: code }));
    }
    onClose();
    document.getElementById("pendaftaran")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Dialog open={!!node} onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {node ? (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3 pr-8">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl leading-none"
                  aria-hidden
                >
                  {node.flag}
                </span>
                <div className="min-w-0">
                  <DialogTitle className="font-display text-start text-xl font-bold">
                    {node.country}
                    <span className="ms-2 text-sm font-semibold text-muted-foreground">{node.city}</span>
                  </DialogTitle>
                  {statusMeta ? (
                    <Badge variant="outline" className={`mt-1.5 ${statusMeta.badgeClass}`}>
                      {metaT(t, `globalNetwork.status.${node.status}`, statusMeta.label)}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </DialogHeader>
            <DialogDescription className="sr-only">
              {t("globalNetwork.dialog.srDescription", { country: node.country, city: node.city })}
            </DialogDescription>

            <div className="space-y-5">
              <p className="font-display text-base font-bold text-emerald-800 dark:text-emerald-300">{node.title}</p>
              <p className="-mt-3 text-sm font-medium text-muted-foreground">{node.orgName}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{node.description}</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("globalNetwork.dialog.region")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">
                    {metaT(t, `globalNetwork.region.${node.region}`, GLOBAL_REGION_LABEL[node.region] ?? node.region)}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("globalNetwork.dialog.city")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">{node.city}</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("globalNetwork.dialog.kind")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">
                    {metaT(t, `globalNetwork.kind.${node.kind}`, GLOBAL_KIND_LABEL[node.kind] ?? node.kind)}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("globalNetwork.dialog.sinceLabel")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">{node.since}</p>
                </div>
                <div className="col-span-2 rounded-lg border bg-muted/50 p-3 sm:col-span-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("globalNetwork.dialog.contact")}
                  </p>
                  {node.contact ? (
                    <a
                      href={`mailto:${node.contact}`}
                      className="mt-0.5 block break-all text-sm font-bold text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300"
                    >
                      {node.contact}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-bold text-muted-foreground">—</p>
                  )}
                </div>
              </div>

              {scope.length > 0 ? (
                <div>
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {t("globalNetwork.dialog.scopeTitle")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scope.map((code) => (
                      <Badge
                        key={code}
                        variant="outline"
                        className="border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-300"
                      >
                        {PROGRAM_LABELS[code] ?? code}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={handleApply}
                  className="h-12 flex-1 bg-emerald-700 text-base font-bold hover:bg-emerald-800"
                >
                  {t("globalNetwork.dialog.applyRegion")}
                </Button>
                {node.contact ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10 hover:text-emerald-900 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    <a
                      href={`mailto:${node.contact}`}
                      aria-label={t("globalNetwork.dialog.emailOfficeAria", { country: node.country })}
                    >
                      {t("globalNetwork.dialog.contactOffice")}
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// ---------- section utama ----------

export function GlobalNetwork() {
  const { t, formatNumber } = useI18n();
  const [resp, setResp] = useState<GlobalResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("SEMUA");
  const [region, setRegion] = useState("SEMUA");
  const [selected, setSelected] = useState<GlobalNodeT | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Ref agar fetch awal tidak perlu t sebagai dependency (identitas t berubah saat ganti bahasa).
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    let alive = true;
    getGlobal()
      .then((data) => {
        if (alive) setResp(data);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : tRef.current("globalNetwork.loadError"));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  const nodes = resp?.nodes ?? [];
  const summary = resp?.summary ?? computeSummary(nodes);

  const regionCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const rc of summary.regionCounts) map[rc.region] = rc.count;
    return map;
  }, [summary]);

  // daftar bendera unik (32 negara) untuk marquee
  const flags = useMemo(() => {
    const seen = new Set<string>();
    const out: { code: string; flag: string; country: string }[] = [];
    for (const n of nodes) {
      if (seen.has(n.countryCode)) continue;
      seen.add(n.countryCode);
      out.push({ code: n.countryCode, flag: n.flag, country: n.country });
    }
    return out;
  }, [nodes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return nodes.filter((n) => {
      if (kind !== "SEMUA" && n.kind !== kind) return false;
      if (region !== "SEMUA" && n.region !== region) return false;
      if (q) {
        const hay = `${n.country} ${n.city} ${n.orgName} ${n.title}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [nodes, kind, region, query]);

  return (
    <section
      id="jaringan-global"
      className="relative scroll-mt-20 overflow-hidden bg-emerald-950 py-16 sm:py-20"
    >
      {/* ornamen latar gelap — selaras hero */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 left-1/2 h-[420px] w-[860px] max-w-[140vw] -translate-x-1/2 rounded-full bg-emerald-900/50 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-emerald-800/40 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading (varian dark dari SectionHeading — warna disesuaikan bg emerald-950) */}
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
            {t("globalNetwork.eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t("globalNetwork.titleBefore")}{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {t("globalNetwork.titleHighlight")}
            </span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-emerald-100/80">
            {t("globalNetwork.subtitle")}
          </p>
        </FadeIn>

        {/* 4 stat pill */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STAT_META.map((s, idx) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.key} delay={idx * 0.06}>
                <div className="flex h-full items-center gap-3 rounded-2xl border border-emerald-800/60 bg-emerald-900/40 px-4 py-4 backdrop-blur">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-800/70 text-amber-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    {loading ? (
                      <Skeleton className="h-8 w-14 rounded-md bg-emerald-800/80" />
                    ) : (
                      <p className="font-display text-2xl font-black text-white sm:text-3xl">
                        <AnimatedCounter value={summary[s.key]} />
                      </p>
                    )}
                    <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-emerald-200/70">
                      {t(`globalNetwork.stats.${s.key}`)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* marquee bendera */}
        {flags.length > 0 ? (
          <FadeIn delay={0.15}>
            <div
              className="marquee-hover-pause relative mt-8 overflow-hidden rounded-2xl border border-emerald-800/60 bg-emerald-900/30 py-4"
              aria-label={t("globalNetwork.marqueeAria")}
            >
              <div className="animate-marquee flex w-max items-center gap-8 px-2">
                {[...flags, ...flags].map((f, i) => (
                  <span
                    key={`${f.code}-${i}`}
                    className="flex items-center gap-2 whitespace-nowrap"
                    aria-hidden={i >= flags.length}
                  >
                    <span className="text-2xl" aria-hidden>
                      {f.flag}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200/80">
                      {f.country}
                    </span>
                  </span>
                ))}
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-emerald-950 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-emerald-950 to-transparent"
                aria-hidden
              />
            </div>
          </FadeIn>
        ) : null}

        {/* kontrol filter */}
        <FadeIn delay={0.2} className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300/60"
                aria-hidden
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("globalNetwork.searchPlaceholder")}
                aria-label={t("globalNetwork.searchPlaceholder")}
                className="h-11 border-emerald-700/70 bg-emerald-900/40 ps-9 text-emerald-50 placeholder:text-emerald-300/50 focus-visible:ring-amber-400/60"
              />
            </div>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger
                aria-label={t("globalNetwork.filterKindAria")}
                className="h-11 w-full border-emerald-700/70 bg-emerald-900/40 text-emerald-50 data-[placeholder]:text-emerald-300/50 sm:w-64"
              >
                <SelectValue placeholder={t("globalNetwork.kindAll")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEMUA">{t("globalNetwork.kindAll")}</SelectItem>
                <SelectItem value="KANTOR_PERWAKILAN">
                  {t("globalNetwork.kind.KANTOR_PERWAKILAN")}
                </SelectItem>
                <SelectItem value="MITRA_INTERNASIONAL">
                  {t("globalNetwork.kind.MITRA_INTERNASIONAL")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* chip kawasan — horizontal scroll di mobile */}
          <div
            className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
            role="group"
            aria-label={t("globalNetwork.regionFilterAria")}
          >
            <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
              <button
                type="button"
                onClick={() => setRegion("SEMUA")}
                aria-pressed={region === "SEMUA"}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  region === "SEMUA"
                    ? "bg-amber-400 text-emerald-950"
                    : "border border-emerald-700 text-emerald-100 hover:border-amber-400/60 hover:text-white"
                }`}
              >
                {t("globalNetwork.regionAll", { count: formatNumber(summary.totalNodes) })}
              </button>
              {GLOBAL_REGION_ORDER.map((r) => {
                const count = regionCountMap[r] ?? nodes.filter((n) => n.region === r).length;
                const isActive = region === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    aria-pressed={isActive}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? "bg-amber-400 text-emerald-950"
                        : "border border-emerald-700 text-emerald-100 hover:border-amber-400/60 hover:text-white"
                    }`}
                  >
                    {metaT(t, `globalNetwork.region.${r}`, GLOBAL_REGION_LABEL[r] ?? r)} (
                    {formatNumber(count)})
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* konten: skeleton / error / grid / empty */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-800/60 bg-emerald-900/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-10 rounded-xl bg-emerald-800/80" />
                  <Skeleton className="h-5 w-24 rounded-full bg-emerald-800/80" />
                </div>
                <Skeleton className="mt-4 h-5 w-2/3 bg-emerald-800/80" />
                <Skeleton className="mt-2 h-3 w-1/2 bg-emerald-800/80" />
                <Skeleton className="mt-3 h-3 w-3/4 bg-emerald-800/80" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full bg-emerald-800/80" />
                  <Skeleton className="h-6 w-20 rounded-full bg-emerald-800/80" />
                </div>
                <Skeleton className="mt-5 h-5 w-1/2 rounded-full bg-emerald-800/80" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-emerald-800 bg-emerald-900/30 py-14 text-center">
            <X className="h-8 w-8 text-red-400" aria-hidden />
            <p className="max-w-md text-sm text-emerald-100/80">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-700 text-emerald-100 hover:bg-emerald-900 hover:text-white"
              onClick={retry}
            >
              {t("globalNetwork.retry")}
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-emerald-800 bg-emerald-900/30 py-14 text-center">
            <Globe2 className="h-8 w-8 text-emerald-500" aria-hidden />
            <p className="max-w-md text-sm text-emerald-100/80">
              {t("globalNetwork.emptyFiltered")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-700 text-emerald-100 hover:bg-emerald-900 hover:text-white"
              onClick={() => {
                setQuery("");
                setKind("SEMUA");
                setRegion("SEMUA");
              }}
            >
              {t("globalNetwork.resetFilter")}
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((n, idx) => {
              const scope = safeParseJsonArray(n.scope);
              const statusMeta = GLOBAL_STATUS_META[n.status];
              return (
                <FadeIn key={n.id} delay={Math.min(idx * 0.04, 0.28)} className="h-full">
                  <button
                    type="button"
                    onClick={() => setSelected(n)}
                    aria-label={t("globalNetwork.cardAria", { org: n.orgName, country: n.country })}
                    className="flex h-full w-full flex-col rounded-2xl border border-emerald-800/60 bg-emerald-900/40 p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-xl hover:shadow-emerald-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-4xl leading-none" aria-hidden>
                        {n.flag}
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-amber-400/60 bg-amber-400/10 text-[10px] font-bold uppercase tracking-wider text-amber-300"
                      >
                        {metaT(t, `globalNetwork.kind.${n.kind}`, GLOBAL_KIND_LABEL[n.kind] ?? n.kind)}
                      </Badge>
                    </div>

                    <h3 className="mt-4 flex items-center gap-1.5 font-display text-lg font-bold text-white">
                      {n.country}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-200/70">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                      {n.city}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-emerald-50">
                      {n.title}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-emerald-300/70">{n.orgName}</p>

                    {scope.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {scope.slice(0, 4).map((code) => (
                          <span
                            key={code}
                            className="rounded-full bg-emerald-800/60 px-2 py-0.5 text-[10px] font-medium text-emerald-100"
                          >
                            {PROGRAM_LABELS[code] ?? code}
                          </span>
                        ))}
                        {scope.length > 4 ? (
                          <span className="rounded-full bg-emerald-800/60 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                            +{scope.length - 4}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      {statusMeta ? (
                        <Badge variant="outline" className={`${statusMeta.badgeClass} text-[10px]`}>
                          {metaT(t, `globalNetwork.status.${n.status}`, statusMeta.label)}
                        </Badge>
                      ) : (
                        <span />
                      )}
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300/60">
                        {t("globalNetwork.since", { year: n.since })}
                      </span>
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length > 0 ? (
          <p className="mt-6 text-center text-xs text-emerald-300/60">
            {t("globalNetwork.showing", {
              shown: formatNumber(filtered.length),
              total: formatNumber(nodes.length),
            })}
          </p>
        ) : null}

        {loading ? (
          <span className="sr-only" aria-live="polite">
            <Loader2 className="animate-spin" /> {t("globalNetwork.loadingAria")}
          </span>
        ) : null}
      </div>

      <NodeDetailDialog node={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
