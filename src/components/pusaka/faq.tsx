"use client";

import { Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";

const FAQ_COUNT = 8;

export function FAQ() {
  const { t } = useI18n();
  const numbers = Array.from({ length: FAQ_COUNT }, (_, i) => i + 1);

  return (
    <section id="faq" className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          subtitle={t("faq.subtitle")}
        />

        <FadeIn delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {numbers.map((n) => (
              <AccordionItem
                key={n}
                value={`faq-${n}`}
                className="rounded-xl border border-border bg-card px-5 shadow-sm last:border-b"
              >
                <AccordionTrigger className="py-4 text-start text-sm font-bold text-foreground hover:no-underline hover:text-emerald-700 dark:hover:text-emerald-300 [&[data-state=open]>svg]:text-emerald-700 dark:[&[data-state=open]>svg]:text-emerald-300">
                  {t(`faq.items.${n}.q`)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {t(`faq.items.${n}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>

        {/* ikon accordion default hanya plus/minus; beri petunjuk visual tambahan */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground" aria-hidden>
          <Plus className="h-3 w-3" />
          <Minus className="h-3 w-3" />
          <span>{t("faq.hint")}</span>
        </div>
      </div>
    </section>
  );
}
