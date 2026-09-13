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
  const typeMeta = TYPE_META[inst.type];
  const tierMeta = TIER_META[inst.tier] ?? TIER_META.SILVER;
  const statusMeta = STATUS_META[inst.status];
  const expired = inst.status === "KADALUARSA";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-emerald-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display truncate text-sm font-bold text-stone-900">{inst.name}</p>
          {typeMeta ? (
            <Badge variant="outline" className={`text-[10px] ${typeMeta.badgeClass}`}>
              {typeMeta.label}
            </Badge>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
          <span className="font-mono font-semibold text-emerald-700">{inst.certNumber}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden />
            {inst.city}, {inst.province}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:w-72 sm:justify-end">
        <Badge variant="outline" className={`text-[10px] font-bold tracking-wider ${tierMeta.badgeClass}`}>
          <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden />
          {tierMeta.label}
        </Badge>
        <div className="w-28">
          <div className="mb-1 flex items-center justify-between text-[10px] text-stone-400">
            <span>Skor Audit</span>
            <span className="font-mono font-bold text-stone-600">{inst.score}</span>
          </div>
          <Progress
            value={inst.score}
            className={`h-1.5 ${expired ? "opacity-40" : ""} [&>div]:bg-emerald-600`}
          />
        </div>
        {statusMeta ? (
          <Badge
            variant="outline"
            className={`text-[10px] font-bold ${expired ? statusMeta.badgeClass : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
          >
            {statusMeta.label}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

export function Directory() {
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
      setError(e instanceof Error ? e.message : "Gagal memuat direktori.");
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

  return (
    <section id="direktori" className="scroll-mt-20 bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Direktori Nasional"
          title="Direktori Lembaga Teruji"
          subtitle="Seluruh pemegang sertifikat & akreditasi PUSAKA telah melalui audit independen. Gunakan pencarian untuk memverifikasi mitra bisnis Anda."
        />

        {/* toolbar */}
        <FadeIn delay={0.1} className="mt-8">
          <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama lembaga atau nomor sertifikat…"
                className="h-11 pl-9"
                aria-label="Cari lembaga"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100"
                  aria-label="Bersihkan pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="flex gap-3">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11 w-full min-w-36 md:w-40" aria-label="Filter jenis lembaga">
                  <SelectValue placeholder="Jenis" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "SEMUA" ? "Semua Jenis" : TYPE_META[t]?.desc ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="h-11 w-full min-w-32 md:w-36" aria-label="Filter tier">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "SEMUA" ? "Semua Tier" : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-stone-500">
            <span>
              Menampilkan{" "}
              <strong className="text-stone-700">{summary.total}</strong> lembaga
              {loading ? " — memuat…" : ""}
            </span>
            <span>
              {summary.platinum} berstatus tier PLATINUM
            </span>
          </div>
        </FadeIn>

        {/* daftar */}
        <FadeIn delay={0.15} className="mt-4">
          <div className="max-h-[560px] space-y-3 overflow-y-auto rounded-2xl border border-stone-200 bg-white/60 p-4 shadow-inner">
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
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-14 text-center">
                <Loader2 className="h-8 w-8 text-stone-300" aria-hidden />
                <p className="text-sm text-stone-500">{error}</p>
                <Button variant="outline" size="sm" onClick={() => void load()}>
                  Muat ulang
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <SearchX className="h-10 w-10 text-stone-300" aria-hidden />
                <p className="font-display text-base font-bold text-stone-600">
                  Tidak ada lembaga yang cocok
                </p>
                <p className="text-sm text-stone-400">
                  Ubah kata kunci atau reset filter jenis &amp; tier.
                </p>
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
