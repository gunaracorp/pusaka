"use client";

// ============================================================
// PUSAKA — Section Pendiri (id="pendiri") — Task 11-b
// Branding Gugun Gunara: avatar GG, gelar (proper noun, literal),
// visi lembaga, chip kredibilitas & kutipan. Section gelap
// emerald-950 dengan aksen radial emerald/amber.
// Nama & gelar "Master Polymath", "Sage Universal",
// "The Ultimate Problem Solver" TIDAK diterjemahkan.
// ============================================================

import { Award, BadgeCheck, Brain, Crown, Globe, Quote, Sparkles, Users } from "lucide-react";
import { FadeIn } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";

/** Gelar founder — proper noun, tampil literal di semua bahasa. */
const TITLES = [
  { icon: Crown, label: "Master Polymath" },
  { icon: Brain, label: "Sage Universal" },
  { icon: Sparkles, label: "The Ultimate Problem Solver" },
] as const;

export function FounderSection() {
  const { t } = useI18n();

  /** Chip kredibilitas — teks via dict founder.creds.*. */
  const creds = [
    { key: "council", icon: Users, text: t("founder.creds.council") },
    { key: "services", icon: BadgeCheck, text: t("founder.creds.services") },
    { key: "countries", icon: Globe, text: t("founder.creds.countries") },
    { key: "standards", icon: Award, text: t("founder.creds.standards") },
  ] as const;

  return (
    <section
      id="pendiri"
      aria-labelledby="founder-title"
      className="relative scroll-mt-28 overflow-hidden bg-emerald-950 py-16 text-emerald-50 sm:py-20"
    >
      {/* Aksen dekoratif radial emerald/amber — halus, non-interaktif */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 start-[8%] h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-28 end-[6%] h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute start-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
          {/* Kiri: avatar + nama + gelar */}
          <FadeIn className="lg:col-span-2">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <span
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-3xl font-black text-white ring-4 ring-amber-500/40 sm:h-24 sm:w-24 sm:text-4xl"
                aria-hidden
              >
                GG
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {t("founder.role")}
                </p>
                <h2
                  id="founder-title"
                  className="mt-1 font-display text-3xl font-black tracking-tight text-white sm:text-4xl"
                >
                  GUGUN GUNARA
                </h2>
              </div>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TITLES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <li
                    key={badge.label}
                    className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {badge.label}
                  </li>
                );
              })}
            </ul>
          </FadeIn>

          {/* Kanan: visi + chip kredibilitas + kutipan */}
          <FadeIn delay={0.12} className="lg:col-span-3">
            <p className="text-base leading-relaxed text-emerald-100/80 sm:text-lg">
              {t("founder.vision")}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {creds.map((c) => {
                const Icon = c.icon;
                return (
                  <li
                    key={c.key}
                    className="flex items-center gap-3 rounded-xl border border-emerald-800 bg-emerald-900/40 px-4 py-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-emerald-50">{c.text}</span>
                  </li>
                );
              })}
            </ul>
            <blockquote className="relative mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 ps-14">
              <Quote className="absolute start-4 top-5 h-7 w-7 text-amber-500/50" aria-hidden />
              <p className="text-sm italic leading-relaxed text-emerald-100/90 sm:text-base">
                &ldquo;{t("founder.quote")}&rdquo;
              </p>
              <footer className="mt-3 font-display text-sm font-bold italic text-amber-300">
                — Gugun Gunara
              </footer>
            </blockquote>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
