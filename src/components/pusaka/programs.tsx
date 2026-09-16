"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  FileCheck,
  Globe2,
  HeartHandshake,
  Loader2,
  Plane,
  Stamp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import {
  CATEGORY_LABEL,
  formatIDR,
  formatNumber,
  getPrograms,
  safeParseJsonArray,
  type ProgramT,
} from "@/lib/pusaka";

const PROGRAM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  PIHK: HeartHandshake,
  PPIU: Building2,
  BPW: Plane,
  IATA: Globe2,
  "IJIN-UMRAH": FileCheck,
  "IJIN-HAJI": Stamp,
  "BPW-PRO": UserCheck,
};

const CATEGORY_TABS = [
  { value: "SEMUA", label: "Semua" },
  { value: "PERUSAHAAN", label: "Perusahaan" },
  { value: "PROFESI", label: "Profesi" },
  { value: "IZIN", label: "Izin" },
];

function ProgramDetailDialog({
  program,
  onClose,
}: {
  program: ProgramT | null;
  onClose: () => void;
}) {
  const requirements = safeParseJsonArray(program?.requirements);
  const benefits = safeParseJsonArray(program?.benefits);
  const accreditation = safeParseJsonArray(program?.accreditation);
  const Icon = program ? PROGRAM_ICON[program.code] ?? Globe2 : Globe2;

  function handleApply(code: string) {
    window.dispatchEvent(new CustomEvent("pusaka:select-program", { detail: code }));
    onClose();
    document.getElementById("pendaftaran")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Dialog open={!!program} onOpenChange={(open) => (open ? undefined : onClose())}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {program ? (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3 pr-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <DialogTitle className="font-display text-left text-xl font-bold">
                    {program.name}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-stone-500">{program.tagline}</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5">
              <p className="text-sm leading-relaxed text-stone-600">{program.description}</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-stone-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">Investasi</p>
                  <p className="mt-0.5 text-sm font-bold text-emerald-700">
                    {formatIDR(program.price)}
                  </p>
                </div>
                <div className="rounded-lg border bg-stone-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">Durasi</p>
                  <p className="mt-0.5 text-sm font-bold text-stone-800">
                    {program.durationDays} Hari
                  </p>
                </div>
                <div className="rounded-lg border bg-stone-50 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">
                    Tingkat Kelulusan
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-amber-600">{program.passRate}%</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-stone-500">
                  Persyaratan
                </h4>
                <ul className="space-y-1.5">
                  {requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-stone-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-stone-500">
                  Manfaat Sertifikasi
                </h4>
                <ul className="space-y-1.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-stone-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {accreditation.length > 0 ? (
                <div>
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-widest text-stone-500">
                    Diakui &amp; Diakreditasi oleh
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {accreditation.map((a) => (
                      <Badge
                        key={a}
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-800"
                      >
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <Button
                onClick={() => handleApply(program.code)}
                className="h-12 w-full bg-emerald-700 text-base font-bold hover:bg-emerald-800"
              >
                Daftar Program Ini
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function Programs() {
  const [programs, setPrograms] = useState<ProgramT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState("SEMUA");
  const [selected, setSelected] = useState<ProgramT | null>(null);

  useEffect(() => {
    let alive = true;
    getPrograms()
      .then((data) => {
        if (alive) setPrograms(data);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "Gagal memuat program.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(
    () => (tab === "SEMUA" ? programs : programs.filter((p) => p.category === tab)),
    [programs, tab]
  );

  return (
    <section id="program" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Program Sertifikasi"
          title="7 Jalur Sertifikasi & Akreditasi Resmi"
          subtitle="Dari pendamping haji khusus hingga agen tiket internasional — pilih jalur sertifikasi yang sesuai dengan profil lembaga atau profesi Anda."
        />

        <FadeIn delay={0.1} className="mt-8 flex justify-center">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-11 bg-stone-100 p-1">
              {CATEGORY_TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="min-h-9 px-4 data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </FadeIn>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="mt-4 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-4/5" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-5 h-10 w-full rounded-md" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-14 text-center">
            <X className="h-8 w-8 text-red-400" aria-hidden />
            <p className="text-sm text-stone-500">{error}</p>
            <Button variant="outline" size="sm" onClick={() => setTab(tab)}>
              Coba muat ulang
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, idx) => {
              const Icon = PROGRAM_ICON[p.code] ?? Globe2;
              return (
                <FadeIn key={p.id} delay={Math.min(idx * 0.05, 0.3)}>
                  <Card className="group h-full border-stone-200 p-0 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/10">
                    <CardContent className="flex h-full flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-md shadow-emerald-900/20 transition-transform group-hover:scale-105">
                          <Icon className="h-6 w-6" aria-hidden />
                        </span>
                        <Badge
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 text-[10px] font-bold uppercase tracking-wider text-emerald-800"
                        >
                          {CATEGORY_LABEL[p.category] ?? p.category}
                        </Badge>
                      </div>

                      <h3 className="font-display mt-4 text-lg font-bold text-stone-900">
                        {p.shortName}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">{p.tagline}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                        <span className="font-semibold text-emerald-700">
                          {formatIDR(p.price)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                          {p.durationDays} Hari
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" aria-hidden />
                          {formatNumber(p.holderCount)} pemegang
                        </span>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                          Lolos {p.passRate}%
                        </span>
                      </div>

                      <div className="mt-auto pt-5">
                        <Button
                          variant="outline"
                          className="h-10 w-full border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900"
                          onClick={() => setSelected(p)}
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-stone-500">
            Belum ada program pada kategori ini.
          </p>
        ) : null}
      </div>

      <ProgramDetailDialog program={selected} onClose={() => setSelected(null)} />
      {loading ? (
        <span className="sr-only" aria-live="polite">
          <Loader2 className="animate-spin" /> Memuat program…
        </span>
      ) : null}
    </section>
  );
}
