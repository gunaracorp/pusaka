"use client";

// ============================================================
// PUSAKA — Jaringan Situs Ekosistem (id="ekosistem") — Task 11-b
// 3 kartu partner site: gunara.web.id / pusatperizinan.com /
// gohajj.web.id. Domain & brand = proper noun — TIDAK diterjemahkan.
// Link eksternal hanya pada tombol CTA (target _blank + noopener).
// ============================================================

import { ArrowRight, ExternalLink, FileCheck, Lightbulb, PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";

/** Situs ekosistem — brand & domain literal; deskripsi/aria via dict. */
const SITES = [
  {
    key: "gunara",
    brand: "Gunara",
    domain: "gunara.web.id",
    href: "https://gunara.web.id",
    icon: Lightbulb,
  },
  {
    key: "perizinan",
    brand: "Pusat Perizinan",
    domain: "pusatperizinan.com",
    href: "https://pusatperizinan.com",
    icon: FileCheck,
  },
  {
    key: "gohajj",
    brand: "GoHajj",
    domain: "gohajj.web.id",
    href: "https://gohajj.web.id",
    icon: PlaneTakeoff,
  },
] as const;

export function PartnerSites() {
  const { t } = useI18n();

  return (
    <section id="ekosistem" className="scroll-mt-28 bg-background py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("partnerSites.eyebrow")}
          title={t("partnerSites.title")}
          subtitle={t("partnerSites.subtitle")}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SITES.map((site, idx) => {
            const Icon = site.icon;
            return (
              <FadeIn key={site.key} delay={idx * 0.08} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 text-white shadow-md shadow-emerald-900/20">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                    {site.brand}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground" dir="ltr">
                    {site.domain}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`partnerSites.sites.${site.key}.desc`)}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-5 h-11 w-full gap-2 border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10 hover:text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300 sm:w-auto"
                  >
                    <a
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`partnerSites.sites.${site.key}.aria`)}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden />
                      {t("partnerSites.cta")}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                    </a>
                  </Button>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("partnerSites.footnote")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
