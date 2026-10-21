"use client";

// ============================================================
// PUSAKA — Halaman legal generik (#/p/kebijakan-privasi, #/p/syarat-ketentuan)
// 7 bagian per dokumen; tanggal pembaruan = tanggal rilis berjalan.
// ============================================================

import { FileText } from "lucide-react";
import { PageShell } from "@/components/pusaka/page-shell";
import { FadeIn } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";
import { OS_RELEASE_DATE } from "@/lib/version";

export type LegalDoc = "privacy" | "terms";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t, formatDate } = useI18n();
  const base = `pages.legal.${doc}`;

  const sections = Array.from({ length: 7 }, (_, i) => ({
    title: t(`${base}.s${i + 1}t`),
    desc: t(`${base}.s${i + 1}d`),
  }));

  return (
    <PageShell
      eyebrow={t("pages.common.pageTypeInfo")}
      title={t(`${base}.title`)}
      tagline={t(`${base}.intro`)}
      crumbs={[{ label: t(`${base}.navLabel`) }]}
    >
      <FadeIn>
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
          {t("pages.common.lastUpdated")}: {formatDate(OS_RELEASE_DATE)}
        </p>
      </FadeIn>

      <div className="mt-8 space-y-4">
        {sections.map((section, i) => (
          <FadeIn key={i} delay={Math.min(i * 0.04, 0.2)}>
            <section
              aria-label={section.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="font-display flex items-center gap-3 text-lg font-bold text-foreground">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-amber-500 text-xs font-black text-white" aria-hidden>
                  {i + 1}
                </span>
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.desc}</p>
            </section>
          </FadeIn>
        ))}
      </div>
    </PageShell>
  );
}
