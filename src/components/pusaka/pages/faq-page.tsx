"use client";

// ============================================================
// PUSAKA — Halaman Pusat Bantuan / FAQ (#/p/faq)
// 8 butir beranda (faq.items) + 4 butir tambahan + JSON-LD FAQPage
// ============================================================

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageShell } from "@/components/pusaka/page-shell";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { SERVICE_ICONS } from "@/components/pusaka/pages/service-page";
import { JsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/components/pusaka/json-ld";
import { SITE_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n/provider";
import {
  SERVICE_PAGE_ORDER,
  pageHref,
  type ServiceSlug,
} from "@/lib/pages/registry";

const HOME_FAQ_COUNT = 8;
const EXTRA_FAQ_COUNT = 4;

export function FaqPage() {
  const { t } = useI18n();

  const homeFaq = Array.from({ length: HOME_FAQ_COUNT }, (_, i) => ({
    q: t(`faq.items.${i + 1}.q`),
    a: t(`faq.items.${i + 1}.a`),
  }));
  const extraFaq = Array.from({ length: EXTRA_FAQ_COUNT }, (_, i) => ({
    q: t(`pages.faqPage.e${i + 1}q`),
    a: t(`pages.faqPage.e${i + 1}a`),
  }));

  return (
    <>
      <JsonLd data={buildFaqJsonLd([...homeFaq, ...extraFaq])} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: t("pages.common.breadcrumbHome"), url: `${SITE_URL}/` },
          { name: t("pages.faqPage.title"), url: `${SITE_URL}/#/p/faq` },
        ])}
      />

      <PageShell
        eyebrow={t("pages.common.pageTypeInfo")}
        title={t("pages.faqPage.title")}
        tagline={t("pages.faqPage.tagline")}
        crumbs={[{ label: t("pages.faqPage.title") }]}
      >
        <FadeIn>
          <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            {t("pages.faqPage.intro")}
          </p>
        </FadeIn>

        {/* FAQ utama */}
        <FadeIn delay={0.08} className="mt-8">
          <Accordion type="single" collapsible className="space-y-3">
            {homeFaq.map((item, i) => (
              <AccordionItem
                key={i}
                value={`page-faq-${i}`}
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

        {/* Tambahan */}
        <FadeIn delay={0.05} className="mt-10">
          <h2 className="font-display flex items-center gap-2 text-xl font-bold text-foreground">
            <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            {t("pages.faqPage.extraTitle")}
          </h2>
          <Accordion type="single" collapsible className="mt-4 space-y-3">
            {extraFaq.map((item, i) => (
              <AccordionItem
                key={i}
                value={`page-faq-extra-${i}`}
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

        {/* Program terkait */}
        <div className="mt-14">
          <SectionHeading
            eyebrow="PUSAKA"
            title={t("pages.faqPage.relatedTitle")}
            subtitle={t("pages.faqPage.relatedDesc")}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PAGE_ORDER.map((slug: ServiceSlug) => {
              const Icon = SERVICE_ICONS[slug];
              return (
                <a
                  key={slug}
                  href={pageHref(slug)}
                  className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-md shadow-emerald-900/20 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-base font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {t(`pages.service.${slug}.navLabel`)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {t(`pages.service.${slug}.tagline`)}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </PageShell>
    </>
  );
}
