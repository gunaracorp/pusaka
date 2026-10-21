"use client";

// ============================================================
// PUSAKA — Halaman Kontak (#/p/kontak)
// Info kantor + jam operasional + kartu bantuan cepat
// ============================================================

import {
  BadgeCheck,
  Bot,
  Clock,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  SearchCheck,
} from "lucide-react";
import { PageShell } from "@/components/pusaka/page-shell";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";
import { SITE_CONTACT } from "@/lib/site";

const HELP_LINKS = [
  { key: "helpRegister", href: "#pendaftaran", icon: BadgeCheck },
  { key: "helpTrack", href: "#lacak", icon: SearchCheck },
  { key: "helpVerify", href: "#verifikasi", icon: BadgeCheck },
  { key: "helpFaq", href: "#/p/faq", icon: HelpCircle },
  { key: "helpTutorial", href: "#tutorial", icon: GraduationCap },
  { key: "helpAi", href: "#/", icon: Bot },
] as const;

export function ContactPage() {
  const { t } = useI18n();

  return (
    <PageShell
      eyebrow={t("pages.common.pageTypeInfo")}
      title={t("pages.contact.title")}
      tagline={t("pages.contact.tagline")}
      crumbs={[{ label: t("pages.contact.title") }]}
    >
      {/* Info kontak */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: MapPin, label: t("pages.contact.addressLabel"), value: `${SITE_CONTACT.streetAddress}, ${SITE_CONTACT.addressLocality} ${SITE_CONTACT.postalCode}` },
          { icon: Phone, label: t("pages.contact.phoneLabel"), value: SITE_CONTACT.phone, dir: "ltr" as const, href: `tel:${SITE_CONTACT.phoneE164}` },
          { icon: Mail, label: t("pages.contact.emailLabel"), value: SITE_CONTACT.email, dir: "ltr" as const, href: `mailto:${SITE_CONTACT.email}` },
          { icon: Clock, label: t("pages.contact.hoursLabel"), value: `${t("pages.contact.hoursWeekday")} · ${t("pages.contact.hoursWeekend")}` },
        ].map((item, i) => (
          <FadeIn key={item.label} delay={i * 0.05}>
            <section aria-label={item.label} className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 text-white shadow-md shadow-emerald-900/20">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="font-display mt-4 text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {item.label}
              </h2>
              {item.href ? (
                <a
                  href={item.href}
                  dir={item.dir}
                  className="mt-1.5 block text-sm font-medium leading-relaxed text-foreground transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground" dir={item.dir}>
                  {item.value}
                </p>
              )}
            </section>
          </FadeIn>
        ))}
      </div>

      {/* Bantuan cepat */}
      <div className="mt-14">
        <SectionHeading
          eyebrow="PUSAKA"
          title={t("pages.contact.quickHelpTitle")}
          subtitle={t("pages.contact.quickHelpDesc")}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <FadeIn key={link.key} delay={i * 0.05}>
                <a
                  href={link.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-emerald-600" aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-base font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {t(`pages.contact.${link.key}`)}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {t(`pages.contact.${link.key}Desc`)}
                  </p>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>

      <FadeIn delay={0.05}>
        <p className="mt-10 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-muted-foreground">
          {t("pages.contact.responseNote")}
        </p>
      </FadeIn>
    </PageShell>
  );
}
