"use client";

// ============================================================
// PUSAKA — Halaman layanan tersendiri (data-driven, 6 program)
// Struktur: hero (PageShell) → intro → manfaat+lingkup →
// persyaratan → alur proses → FAQ → layanan terkait → CTA.
// SEO: JSON-LD Service + FAQPage + BreadcrumbList.
// ============================================================

import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  HandHeart,
  ListChecks,
  MoonStar,
  Plane,
  Route,
  Tent,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageShell } from "@/components/pusaka/page-shell";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { JsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildServiceJsonLd } from "@/components/pusaka/json-ld";
import { SITE_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n/provider";
import {
  RELATED_SERVICES,
  isServiceSlug,
  pageHref,
  type ServiceSlug,
} from "@/lib/pages/registry";

export const SERVICE_ICONS: Record<ServiceSlug, LucideIcon> = {
  pihk: HandHeart,
  ppiu: ClipboardCheck,
  bpw: Compass,
  iata: Plane,
  "izin-umrah": MoonStar,
  "izin-haji": Tent,
};

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const { t } = useI18n();
  const base = `pages.service.${slug}`;
  const iconLabel = t(`${base}.title`);

  const faq = range(4).map((n) => ({
    q: t(`${base}.q${n}`),
    a: t(`${base}.a${n}`),
  }));

  const related = RELATED_SERVICES[slug].filter(isServiceSlug);

  return (
    <>
      {/* JSON-LD: Service + FAQPage + BreadcrumbList */}
      <JsonLd
        data={buildServiceJsonLd({
          name: iconLabel,
          description: t(`${base}.metaDescription`),
          url: `${SITE_URL}/${pageHref(slug)}`,
          serviceType: t(`${base}.navLabel`),
        })}
      />
      <JsonLd data={buildFaqJsonLd(faq)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: t("pages.common.breadcrumbHome"), url: `${SITE_URL}/` },
          { name: t("pages.common.breadcrumbServices"), url: `${SITE_URL}/#layanan` },
          { name: t(`${base}.navLabel`), url: `${SITE_URL}/${pageHref(slug)}` },
        ])}
      />

      <PageShell
        eyebrow={t("pages.common.pageTypeService")}
        title={t(`${base}.title`)}
        tagline={t(`${base}.tagline`)}
        crumbs={[{ label: t("pages.common.breadcrumbServices"), href: "#layanan" }, { label: t(`${base}.navLabel`) }]}
      >
        {/* Intro */}
        <FadeIn className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p className="border-s-4 border-emerald-600 ps-4 text-foreground">{t(`${base}.intro1`)}</p>
            <p className="ps-4">{t(`${base}.intro2`)}</p>
          </div>
          <div className="flex flex-row gap-2 lg:flex-col">
            <Button asChild className="h-11 bg-emerald-700 hover:bg-emerald-800">
              <a href="#pendaftaran" className="gap-2">
                <BadgeCheck className="h-4 w-4" aria-hidden />
                {t("pages.common.registerCta")}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10 dark:border-emerald-500/40 dark:text-emerald-300"
            >
              <a href="#layanan" className="gap-2">
                <ListChecks className="h-4 w-4" aria-hidden />
                {t("pages.common.catalogCta")}
              </a>
            </Button>
          </div>
        </FadeIn>

        {/* Manfaat + Lingkup */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <section
              aria-label={t("pages.common.benefitsTitle")}
              className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="font-display flex items-center gap-2 text-xl font-bold text-foreground">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                {t("pages.common.benefitsTitle")}
              </h2>
              <ul className="mt-4 space-y-3">
                {range(4).map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                    {t(`${base}.b${n}`)}
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
          <FadeIn delay={0.08}>
            <section
              aria-label={t("pages.common.scopeTitle")}
              className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="font-display flex items-center gap-2 text-xl font-bold text-foreground">
                <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                {t("pages.common.scopeTitle")}
              </h2>
              <ul className="mt-4 space-y-3">
                {range(6).map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-300" aria-hidden>
                      {n}
                    </span>
                    {t(`${base}.s${n}`)}
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        </div>

        {/* Persyaratan */}
        <FadeIn delay={0.05}>
          <section
            aria-label={t("pages.common.requirementsTitle")}
            className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="font-display flex items-center gap-2 text-xl font-bold text-foreground">
              <ClipboardCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              {t("pages.common.requirementsTitle")}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {range(5).map((n) => (
                <li key={n} className="flex items-start gap-2.5 rounded-xl bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[10px] font-bold text-amber-700 dark:text-amber-400" aria-hidden>
                    {n}
                  </span>
                  {t(`${base}.r${n}`)}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        {/* Alur proses */}
        <FadeIn delay={0.05}>
          <section aria-label={t("pages.common.processTitle")} className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display flex items-center gap-2 text-xl font-bold text-foreground">
              <Route className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              {t("pages.common.processTitle")}
            </h2>
            <ol className="mt-5 grid gap-4 md:grid-cols-5">
              {range(5).map((n) => (
                <li key={n} className="relative rounded-xl border border-emerald-600/15 bg-emerald-500/5 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-amber-500 text-xs font-black text-white shadow" aria-hidden>
                    {n}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`${base}.p${n}`)}</p>
                </li>
              ))}
            </ol>
          </section>
        </FadeIn>

        {/* FAQ */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="FAQ"
            title={t("pages.common.faqTitle")}
            subtitle={t(`${base}.title`)}
          />
          <FadeIn delay={0.1} className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faq.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`svc-faq-${i}`}
                  className="rounded-xl border border-border bg-card px-5 shadow-sm last:border-b"
                >
                  <AccordionTrigger className="py-4 text-start text-sm font-bold text-foreground hover:no-underline hover:text-emerald-700 dark:hover:text-emerald-300">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>

        {/* Layanan terkait */}
        <div className="mt-14">
          <SectionHeading
            eyebrow={t("pages.common.pageTypeService")}
            title={t("pages.common.relatedTitle")}
            subtitle={t("pages.common.relatedDesc")}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((rel) => {
              const Icon = SERVICE_ICONS[rel];
              return (
                <a
                  key={rel}
                  href={pageHref(rel)}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-md shadow-emerald-900/20 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-base font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {t(`pages.service.${rel}.navLabel`)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {t(`pages.service.${rel}.tagline`)}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <FadeIn delay={0.05}>
          <section className="mt-14 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-8 text-center text-emerald-50 shadow-xl sm:p-10">
            <h2 className="font-display text-2xl font-black sm:text-3xl">
              {t("pages.common.ctaBandTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-emerald-100/85 sm:text-base">
              {t("pages.common.ctaBandDesc")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 bg-amber-500 px-6 font-bold text-emerald-950 hover:bg-amber-600">
                <a href="#pendaftaran" className="gap-2">
                  <BadgeCheck className="h-5 w-5" aria-hidden />
                  {t("pages.common.registerCta")}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-emerald-400/40 bg-transparent px-6 text-emerald-100 hover:bg-emerald-500/10 hover:text-white"
              >
                <a href="#kontak">{t("pages.common.contactCta")}</a>
              </Button>
            </div>
          </section>
        </FadeIn>
      </PageShell>
    </>
  );
}
