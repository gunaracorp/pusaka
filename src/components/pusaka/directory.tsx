"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Search, SearchX, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";
import {
  STATUS_META,
  TIER_META,
  TYPE_META,
  getDirectory,
  type InstitutionT,
} from "@/lib/pusaka";

const TIER_OPTIONS = ["SEMUA", "PLATINUM", "GOLD", "SILVER"];
const TYPE_OPTIONS = ["SEMUA", "PPIU", "BPW", "IATA", "PIHK"];

function InstitutionRow({ inst }: { inst: InstitutionT }) {
  const { t, formatDateShort } = useI18n();
  const typeMeta = TYPE_META[inst.type];
  const tierMeta = TIER_META[inst.tier] ?? TIER_META.SILVER;
  const statusMeta = STATUS_META[inst.status];
  const expired = inst.status === "KADALUARSA";

  // Label tier & status via i18n (common.*) — warna tetap dari META
  const tierKey = `common.tiers.${inst.tier}`;
  const tierLabel = t(tierKey) === tierKey ? String(inst.tier) : t(tierKey);
  const statusKey =
    inst.status === "AKTIF"
      ? "common.status.active"
      : inst.status === "DIPERBARUI"
        ? "common.status.updated"
        : "common.status.expired";
  const statusLabel = t(statusKey);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-emerald-500/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display truncate text-sm font-bold text-foreground">{inst.name}</p>
          {typeMeta ? (
            <Badge variant="outline" className={`text-[10px] ${typeMeta.badgeClass}`}>
              {typeMeta.label}
            </Badge>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">{inst.certNumber}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden />
            {inst.city}, {inst.province}
          </span>
          <span className={expired ? "line-through opacity-60" : ""}>
            {t("directory.validUntil")} {formatDateShort(inst.expiresAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:w-72 sm:justify-end">
        <Badge variant="outline" className={`text-[10px] font-bold tracking-wider ${tierMeta.badgeClass}`}>
          <span className={`me-1.5 inline-block h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden />
          {tierLabel}
        </Badge>
        <div className="w-28">
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{t("directory.scoreLabel")}</span>
            <span className="font-mono font-bold text-foreground">{inst.score}</span>
          </div>
          <Progress
            value={inst.score}
            className={`h-1.5 ${expired ? "opacity-40" : ""} [&>div]:bg-emerald-600`}
          />
        </div>
        {statusMeta ? (
          <Badge
            variant="outline"
            className={`text-[10px] font-bold ${expired ? statusMeta.badgeClass : "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300"}`}
          >
            {statusLabel}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

export function Directory() {
  const { t, formatNumber } = useI18n();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [type, setType] = useState("SEMUA");
  const [tier, setTier] = useState("SEMUA");
  const [items, setItems] = useState<InstitutionT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce pencarian 400ms
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(search), 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDirectory({ q: debounced, type, tier });
      setItems(data);
    } catch (e) {
      // "" = gagal generik → diterjemahkan saat render; string lain = pesan API
      setError(e instanceof Error ? e.message : "");
    } finally {
      setLoading(false);
    }
  }, [debounced, type, tier]);

  useEffect(() => {
    void load();
  }, [load]);

  const summary = useMemo(
    () => ({ total: items.length, platinum: items.filter((i) => i.tier === "PLATINUM").length }),
    [items]
  );

  function resetFilters() {
    setSearch("");
    setType("SEMUA");
    setTier("SEMUA");
  }

  /** Label jenis lembaga via dict, fallback ke kode mentah. */
  function typeLabel(opt: string): string {
    const key = `directory.types.${opt}`;
    const translated = t(key);
    return translated === key ? opt : translated;
  }

  return (
    <section id="direktori" className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("directory.eyebrow")}
          title={t("directory.title")}
          subtitle={t("directory.subtitle")}
        />

        {/* toolbar */}
        <FadeIn delay={0.1} className="mt-8">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("directory.searchPlaceholder")}
                className="h-11 ps-9"
                aria-label={t("directory.searchAria")}
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  aria-label={t("directory.clearSearch")}
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="flex gap-3">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11 w-full min-w-36 md:w-40" aria-label={t("directory.filterTypeAria")}>
                  <SelectValue placeholder={t("directory.placeholderType")} />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === "SEMUA" ? t("directory.allTypes") : typeLabel(opt)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="h-11 w-full min-w-32 md:w-36" aria-label={t("directory.filterTierAria")}>
                  <SelectValue placeholder={t("directory.placeholderTier")} />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === "SEMUA" ? t("directory.allTiers") : t(`common.tiers.${opt}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
            <span>
              {t("directory.found", { count: formatNumber(summary.total) })}
              {loading ? t("directory.loadingSuffix") : ""}
            </span>
            <span>
              {t("directory.platinumSummary", { count: formatNumber(summary.platinum) })}
            </span>
          </div>
        </FadeIn>

        {/* daftar */}
        <FadeIn delay={0.15} className="mt-4">
          <div className="max-h-[560px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-card/60 p-4 shadow-inner">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 rounded-xl border p-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
                </div>
              ))
            ) : error !== null ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <Loader2 className="h-8 w-8 text-muted-foreground/50" aria-hidden />
                <p className="text-sm text-muted-foreground">{error === "" ? t("directory.error") : error}</p>
                <Button variant="outline" size="sm" onClick={() => void load()}>
                  {t("directory.retry")}
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <SearchX className="h-10 w-10 text-muted-foreground/50" aria-hidden />
                <p className="font-display text-base font-bold text-foreground">
                  {t("directory.emptyTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("directory.emptyDesc")}
                </p>
                <Button variant="outline" size="sm" className="mt-1" onClick={resetFilters}>
                  {t("directory.reset")}
                </Button>
              </div>
            ) : (
              items.map((inst) => <InstitutionRow key={inst.id} inst={inst} />)
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
