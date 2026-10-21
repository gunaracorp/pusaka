"use client";

// ============================================================
// PUSAKA — Halaman Tentang PUSAKA (#/p/tentang)
// Profil → Visi & Misi → Nilai → Identitas di Angka → Kepemimpinan
// ============================================================

import {
  BadgeCheck,
  Building2,
  Eye,
  Globe2,
  HeartHandshake,
  Languages,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/pusaka/page-shell";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";

const VALUE_ICONS = [Scale, BadgeCheck, ShieldCheck, HeartHandshake];
const NUMBER_ICONS = [Building2, Users2, Globe2, Languages];

export function AboutPage() {
  const { t } = useI18n();

  return (
    <PageShell
      eyebrow={t("pages.common.pageTypeInfo")}
      title={t("pages.about.title")}
      tagline={t("pages.about.tagline")}
      crumbs={[{ label: t("pages.about.title") }]}
    >
      {/* Profil */}
      <FadeIn>
        <section aria-label={t("pages.about.profileTitle")} className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <h2 className="font-display text-2xl font-bold text-foreground">{t("pages.about.profileTitle")}</h2>
          <p className="border-s-4 border-emerald-600 ps-4 text-foreground">{t("pages.about.profile1")}</p>
          <p className="ps-4">{t("pages.about.profile2")}</p>
          <p className="ps-4">{t("pages.about.profile3")}</p>
        </section>
      </FadeIn>

      {/* Visi & Misi */}
      <div className="mt-12 grid gap-6 lg:grid-cols-[2fr_3fr]">
        <FadeIn>
          <section aria-label={t("pages.about.visionTitle")} className="h-full rounded-2xl border border-emerald-600/20 bg-gradient-to-br from-emerald-950 to-emerald-800 p-6 text-emerald-50 shadow-lg">
            <h2 className="font-display flex items-center gap-2 text-xl font-bold">
              <Eye className="h-5 w-5 text-amber-400" aria-hidden />
              {t("pages.about.visionTitle")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90">{t("pages.about.vision")}</p>
          </section>
        </FadeIn>
        <FadeIn delay={0.08}>
          <section aria-label={t("pages.about.missionTitle")} className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display flex items-center gap-2 text-xl font-bold text-foreground">
              <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              {t("pages.about.missionTitle")}
            </h2>
            <ul className="mt-4 space-y-3">
              {["m1", "m2", "m3", "m4"].map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                  {t(`pages.about.${key}`)}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>
      </div>

      {/* Nilai */}
      <div className="mt-14">
        <SectionHeading eyebrow="PUSAKA" title={t("pages.about.valuesTitle")} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["v1", "v2", "v3", "v4"].map((key, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <FadeIn key={key} delay={i * 0.06}>
                <section
                  aria-label={t(`pages.about.${key}t`)}
                  className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-md shadow-emerald-900/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-base font-bold text-foreground">{t(`pages.about.${key}t`)}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t(`pages.about.${key}d`)}</p>
                </section>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Identitas di angka */}
      <div className="mt-14">
        <SectionHeading eyebrow="PUSAKA" title={t("pages.about.identityTitle")} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["i1", "i2", "i3", "i4"].map((key, i) => {
            const Icon = NUMBER_ICONS[i];
            return (
              <FadeIn key={key} delay={i * 0.06}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-emerald-600/15 bg-emerald-500/5 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="text-sm font-semibold leading-relaxed text-foreground">{t(`pages.about.${key}`)}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* Kepemimpinan */}
      <FadeIn delay={0.05}>
        <section aria-label={t("pages.about.founderTitle")} className="mt-14 rounded-3xl border border-amber-500/25 bg-amber-500/5 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-foreground">{t("pages.about.founderTitle")}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("pages.about.founderDesc")}
          </p>
          <Button asChild className="mt-5 h-11 bg-emerald-700 hover:bg-emerald-800">
            <a href="#pendiri" className="gap-2">
              <BadgeCheck className="h-4 w-4" aria-hidden />
              {t("pages.about.founderCta")}
            </a>
          </Button>
        </section>
      </FadeIn>
    </PageShell>
  );
}
