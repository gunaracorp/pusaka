"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { getExperts, type ExpertT } from "@/lib/pusaka";

const CATEGORY_ORDER = [
  "IBADAH",
  "HUKUM",
  "AVIASI",
  "MANAJEMEN",
  "KEUANGAN",
  "TEKNOLOGI",
  "KESEHATAN",
  "BAHASA",
  "LOGISTIK",
];

export function Experts() {
  const [experts, setExperts] = useState<ExpertT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("SEMUA");
  const [selected, setSelected] = useState<ExpertT | null>(null);

  useEffect(() => {
    let alive = true;
    getExperts()
      .then((data) => {
        if (alive) setExperts(data);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "Gagal memuat dewan pakar.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of experts) map[e.category] = (map[e.category] ?? 0) + 1;
    return map;
  }, [experts]);

  const categories = useMemo(() => {
    const present = CATEGORY_ORDER.filter((c) => counts[c]);
    const extra = Object.keys(counts).filter((c) => !CATEGORY_ORDER.includes(c));
    return ["SEMUA", ...present, ...extra];
  }, [counts]);

  const filtered = useMemo(
    () => (category === "SEMUA" ? experts : experts.filter((e) => e.category === category)),
    [experts, category]
  );

  return (
    <section id="dewan-pakar" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dewan Pakar"
          title="46 Dewan Pakar Lintas Bidang"
          subtitle="Standardisasi kurikulum dan instrumen uji kompetensi ditetapkan oleh 46 ahli nasional dari 9 bidang keilmuan — memastikan sertifikasi relevan & berkelas dunia."
        />

        {/* chip filter */}
        <FadeIn delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-wider transition-all ${
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                    : "border-border bg-card text-muted-foreground hover:border-emerald-500/40 hover:bg-emerald-500/10"
                }`}
                aria-pressed={active}
              >
                {c === "SEMUA" ? "Semua" : c}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c === "SEMUA" ? experts.length : counts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </FadeIn>

        {loading ? (
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
            <Loader2 className="h-8 w-8 text-muted-foreground/50" aria-hidden />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setCategory("SEMUA")}>
              Coba muat ulang
            </Button>
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-5xl">
            <div className="max-h-[600px] space-y-3 overflow-y-auto rounded-2xl border border-border bg-muted/40 p-4 shadow-inner">
              {filtered.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelected(e)}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
                >
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 via-emerald-600 to-amber-500 font-display text-base font-black text-white shadow-md"
                    aria-hidden
                  >
                    {e.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-sm font-bold text-foreground">
                      {e.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {e.field} — {e.organization}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{e.licenseNo}</p>
                  </div>
                  <Badge className="shrink-0 border-transparent bg-amber-500/15 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    {e.experienceYears} Thn
                  </Badge>
                </button>
              ))}
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Tidak ada pakar pada kategori ini.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* dialog profil */}
      <Dialog open={!!selected} onOpenChange={(open) => (open ? undefined : setSelected(null))}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {selected ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 pr-8">
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 via-emerald-600 to-amber-500 font-display text-xl font-black text-white shadow-lg"
                    aria-hidden
                  >
                    {selected.initials}
                  </span>
                  <div>
                    <DialogTitle className="font-display text-left text-xl font-bold">
                      {selected.name}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selected.field} • {selected.organization}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="border-emerald-600/30 bg-emerald-500/10 text-[10px] text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-300">
                        {selected.category}
                      </Badge>
                      <Badge className="border-transparent bg-amber-500/15 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        {selected.experienceYears} Tahun Pengalaman
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Nomor Lisensi Dewan Pakar
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    {selected.licenseNo}
                  </p>
                </div>

                <div>
                  <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <GraduationCap className="h-4 w-4" aria-hidden />
                    Pendidikan
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selected.education}</p>
                </div>

                <div>
                  <h4 className="mb-1.5 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Ruang Lingkup Keahlian
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selected.expertise}</p>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
