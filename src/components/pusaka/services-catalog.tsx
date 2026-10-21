"use client";

// ============================================================
// PUSAKA — Section Katalog 500 Layanan Sertifikasi & Akreditasi
// Section terang premium: stone-50 + aksen emerald/amber.
// Data: GET /api/services (server-side filter + pagination, 25 kategori).
// Milik: Task 11-a (Frontend Catalog Agent).
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Globe2,
  Layers,
  LayoutGrid,
  MapPin,
  Search,
  SearchX,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/pusaka/animated-counter";
import { FadeIn } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";
import { getServices, type ServiceT, type ServicesRespT } from "@/lib/pusaka";

// ---------- tipe helper & konstanta ----------

type TFn = (path: string, vars?: Record<string, string | number>) => string;

const SCHEME_OPTIONS = ["BADAN_USAHA", "PROFESIONAL"] as const;
const SCOPE_OPTIONS = ["INTERNASIONAL", "NASIONAL"] as const;

const SCHEME_ICON: Record<(typeof SCHEME_OPTIONS)[number], LucideIcon> = {
  BADAN_USAHA: Building2,
  PROFESIONAL: UserRound,
};
const SCOPE_ICON: Record<(typeof SCOPE_OPTIONS)[number], LucideIcon> = {
  INTERNASIONAL: Globe2,
  NASIONAL: MapPin,
};

/** Terjemahan kunci dinamis dengan fallback aman (pola metaT). */
function labelT(t: TFn, key: string, fallback: string): string {
  const value = t(key);
  return value === key ? fallback : value;
}

/** Label kategori: dict services.category.<slug>, fallback nama DB bila kunci tidak ada. */
function categoryLabel(t: TFn, slug: string, dbName: string): string {
  return labelT(t, `services.category.${slug}`, dbName);
}

/** Daftar halaman dengan ellipsis — maks 5 nomor + titik-titik. */
function buildPages(current: number, totalPages: number): (number | "dots")[] {
  const out: (number | "dots")[] = [];
  let prev = 0;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - current) <= 1) {
      if (p - prev > 1) out.push("dots");
      out.push(p);
      prev = p;
    }
  }
  return out;
}

// ---------- kartu layanan ----------

function ServiceCard({ service }: { service: ServiceT }) {
  const { t, formatCurrency } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-600/10">
      <div className="flex items-start justify-between gap-2">
        <span
          dir="ltr"
          className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-[11px] font-bold tracking-wider text-emerald-700 dark:text-emerald-300"
        >
          {service.code}
        </span>
        {service.standard ? (
          <Badge
            variant="outline"
            dir="ltr"
            className="shrink-0 border-amber-500/40 bg-amber-500/10 text-[10px] font-bold tracking-wide text-amber-700 dark:border-amber-400/40 dark:text-amber-300"
          >
            {service.standard}
          </Badge>
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 font-display text-base font-bold leading-snug text-foreground">
        {service.name}
      </h3>
      <p className="mt-1 text-xs font-medium text-muted-foreground">
        {categoryLabel(t, service.categorySlug, service.category)}
      </p>

      <p
        className={`mt-2 text-sm leading-relaxed text-muted-foreground ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {service.description}
      </p>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-display text-lg font-black text-emerald-700 dark:text-emerald-300">
          {formatCurrency(service.price)}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {t("services.duration", { count: service.durationWeeks })}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className="border-border bg-muted/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
        >
          {labelT(t, `services.scheme.${service.scheme}`, service.scheme)}
        </Badge>
        <Badge
          variant="outline"
          className={`text-[10px] font-bold uppercase tracking-wider ${
            service.scope === "INTERNASIONAL"
              ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300"
              : "border-border bg-muted/60 text-muted-foreground"
          }`}
        >
          {labelT(t, `services.scope.${service.scope}`, service.scope)}
        </Badge>
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 text-[11px] leading-snug text-muted-foreground/80">
        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <span className="line-clamp-1">{service.issuer}</span>
      </p>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <Button
          asChild
          size="sm"
          className="h-9 flex-1 bg-emerald-700 font-bold hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          <a href="#pendaftaran" aria-label={t("services.applyAria", { name: service.name })}>
            {t("services.apply")}
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 border-border text-muted-foreground hover:text-foreground"
          aria-expanded={expanded}
          aria-label={t("services.detailAria", { name: service.name })}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
          {expanded ? t("services.detailHide") : t("services.detailShow")}
        </Button>
      </div>
    </article>
  );
}

// ---------- pill statistik ----------

function StatPill({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: number | undefined;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-2 pe-4 ps-2 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      {value === undefined ? (
        <Skeleton className="h-6 w-12" />
      ) : (
        <span className="font-display text-lg font-black leading-none text-foreground">
          <AnimatedCounter value={value} />
        </span>
      )}
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ---------- section utama ----------

export function ServicesCatalog() {
  const { t, formatNumber } = useI18n();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("");
  const [scheme, setScheme] = useState("");
  const [scope, setScope] = useState("");
  const [page, setPage] = useState(1);

  const [resp, setResp] = useState<ServicesRespT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqRef = useRef(0);

  // Debounce pencarian 350ms + reset ke halaman 1
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebounced(query);
      setPage(1);
    }, 350);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const load = useCallback(async () => {
    const reqId = ++reqRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await getServices({
        q: debounced || undefined,
        category: category || undefined,
        scheme: scheme || undefined,
        scope: scope || undefined,
        page,
      });
      // Abaikan hasil lama bila permintaan lebih baru sudah berjalan
      if (reqRef.current === reqId) setResp(data);
    } catch (e) {
      if (reqRef.current === reqId) setError(e instanceof Error ? e.message : "");
    } finally {
      if (reqRef.current === reqId) setLoading(false);
    }
  }, [debounced, category, scheme, scope, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const retry = () => void load();

  const resetFilters = () => {
    setQuery("");
    setDebounced("");
    setCategory("");
    setScheme("");
    setScope("");
    setPage(1);
  };

  const toggleScheme = (value: (typeof SCHEME_OPTIONS)[number]) => {
    setScheme((prev) => (prev === value ? "" : value));
    setPage(1);
  };
  const toggleScope = (value: (typeof SCOPE_OPTIONS)[number]) => {
    setScope((prev) => (prev === value ? "" : value));
    setPage(1);
  };
  const pickCategory = (slug: string) => {
    setCategory(slug);
    setPage(1);
  };

  const schemeCount = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of resp?.facets.schemes ?? []) map[f.scheme] = f.count;
    return map;
  }, [resp]);

  const intlCount = resp?.facets.scopes.find((s) => s.scope === "INTERNASIONAL")?.count;

  // Gaya pill/chip bersama
  const pillClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 ${
      active
        ? "border-emerald-700 bg-emerald-700 text-white"
        : "border-border bg-card text-muted-foreground hover:border-emerald-500/60 hover:text-foreground"
    }`;

  return (
    <section id="layanan" className="scroll-mt-28 bg-stone-50 py-16 dark:bg-stone-950 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
            {t("services.eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            <span
              dir="ltr"
              className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-amber-400"
            >
              {t("services.titleHighlight")}
            </span>{" "}
            {t("services.titleAfter")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {t("services.subtitle")}
          </p>
        </FadeIn>

        {/* Bar statistik mini */}
        <FadeIn delay={0.08} className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <StatPill icon={Layers} value={resp?.totalAll} label={t("services.stats.services")} />
            <StatPill
              icon={LayoutGrid}
              value={resp?.facets.categories.length}
              label={t("services.stats.fields")}
            />
            <StatPill icon={Globe2} value={intlCount} label={t("services.stats.international")} />
          </div>
        </FadeIn>

        {/* Kontrol: pencarian + filter skema/scope */}
        <FadeIn delay={0.12} className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("services.searchPlaceholder")}
                aria-label={t("services.searchAria")}
                className="h-11 ps-9"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  aria-label={t("services.clearSearch")}
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label={t("services.schemeFilterAria")}>
              {SCHEME_OPTIONS.map((s) => {
                const Icon = SCHEME_ICON[s];
                const active = scheme === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleScheme(s)}
                    aria-pressed={active}
                    className={pillClass(active)}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {labelT(t, `services.scheme.${s}`, s)}
                    {schemeCount[s] !== undefined ? (
                      <span className="opacity-70">({formatNumber(schemeCount[s])})</span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label={t("services.scopeFilterAria")}>
              {SCOPE_OPTIONS.map((s) => {
                const Icon = SCOPE_ICON[s];
                const active = scope === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleScope(s)}
                    aria-pressed={active}
                    className={pillClass(active)}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {labelT(t, `services.scope.${s}`, s)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chips kategori — horizontal scroll di mobile */}
          {resp !== null ? (
            <div
              className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
              role="group"
              aria-label={t("services.categoryFilterAria")}
            >
              <div className="flex w-max items-center gap-2 sm:w-auto sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => pickCategory("")}
                  aria-pressed={category === ""}
                  className={pillClass(category === "")}
                >
                  {t("services.categoryAll", { count: formatNumber(resp.totalAll) })}
                </button>
                {resp.facets.categories.map((c) => {
                  const active = category === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => pickCategory(active ? "" : c.slug)}
                      aria-pressed={active}
                      className={pillClass(active)}
                    >
                      {categoryLabel(t, c.slug, c.name)} ({formatNumber(c.count)})
                    </button>
                  );
                })}
              </div>
            </div>
          ) : !error ? (
            <div className="flex items-center gap-2 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 shrink-0 rounded-full" />
              ))}
            </div>
          ) : null}
        </FadeIn>

        {/* Konten: skeleton / error / grid / empty */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-20 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="mt-4 h-5 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-1.5 h-3 w-2/3" />
                <div className="mt-4 flex items-center gap-3">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="mt-5 flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : error !== null ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-red-300 bg-red-500/5 py-14 text-center dark:border-red-500/30 dark:bg-red-500/10">
            <X className="h-8 w-8 text-red-500" aria-hidden />
            <p className="max-w-md text-sm text-muted-foreground">
              {error === "" ? t("services.loadError") : error}
            </p>
            <Button variant="outline" size="sm" onClick={retry}>
              {t("services.retry")}
            </Button>
          </div>
        ) : resp && resp.items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card py-14 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground/50" aria-hidden />
            <p className="font-display text-base font-bold text-foreground">
              {t("services.emptyTitle")}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">{t("services.emptyDesc")}</p>
            <Button variant="outline" size="sm" className="mt-1" onClick={resetFilters}>
              {t("services.resetFilter")}
            </Button>
          </div>
        ) : resp ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {resp.items.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        {!loading && error === null && resp && resp.total > 0 ? (
          <FadeIn delay={0.1} className="mt-8">
            <nav
              aria-label={t("services.pagination.aria")}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={resp.page <= 1}
                  onClick={() => setPage(resp.page - 1)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  <span className="hidden sm:inline">{t("services.pagination.prev")}</span>
                </Button>
                {buildPages(resp.page, resp.totalPages).map((p, i) =>
                  p === "dots" ? (
                    <span key={`dots-${i}`} className="px-1 text-sm text-muted-foreground" aria-hidden>
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === resp.page ? "default" : "outline"}
                      size="sm"
                      aria-current={p === resp.page ? "page" : undefined}
                      aria-label={t("services.pagination.pageAria", { page: p })}
                      onClick={() => setPage(p)}
                      className={`h-8 min-w-8 px-2 ${
                        p === resp.page ? "bg-emerald-700 hover:bg-emerald-800" : ""
                      }`}
                    >
                      {p}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={resp.page >= resp.totalPages}
                  onClick={() => setPage(resp.page + 1)}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">{t("services.pagination.next")}</span>
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("services.pagination.showing", {
                  shown: formatNumber(resp.items.length),
                  total: formatNumber(resp.total),
                })}
              </p>
            </nav>
          </FadeIn>
        ) : null}

        {/* Pengumuman loading untuk screen reader */}
        {loading ? (
          <span className="sr-only" aria-live="polite">
            {t("services.loadingAria")}
          </span>
        ) : null}
      </div>
    </section>
  );
}
