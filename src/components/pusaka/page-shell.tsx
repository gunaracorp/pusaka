"use client";

// ============================================================
// PUSAKA — PageShell: cangkang bersama halaman tersendiri
// (breadcrumb aria + hero hijau-emas + konten max-w-6xl)
// ============================================================

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageShellProps {
  eyebrow: string;
  title: string;
  tagline: string;
  crumbs: Crumb[];
  children: ReactNode;
}

export function PageShell({ eyebrow, title, tagline, crumbs, children }: PageShellProps) {
  const { t } = useI18n();

  return (
    <article>
      {/* Breadcrumb */}
      <nav
        aria-label={t("pages.common.breadcrumbAria")}
        className="border-b bg-muted/40"
      >
        <ol className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1.5 px-4 py-3 text-xs sm:px-6 lg:px-8">
          <li>
            <a
              href="#beranda"
              className="rounded px-1 py-0.5 font-medium text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              {t("pages.common.breadcrumbHome")}
            </a>
          </li>
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight
                className="h-3 w-3 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                aria-hidden
              />
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="rounded px-1 py-0.5 font-medium text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {crumb.label}
                </a>
              ) : (
                <span aria-current="page" className="px-1 py-0.5 font-semibold text-foreground">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Hero */}
      <header className="border-b border-emerald-900/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-emerald-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
            {eyebrow}
          </p>
          <h1 className="font-display mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-emerald-100/85 sm:text-lg">
            {tagline}
          </p>
        </div>
      </header>

      {/* Konten */}
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {children}
      </div>
    </article>
  );
}
