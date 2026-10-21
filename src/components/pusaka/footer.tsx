"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/pusaka";
import { useAdminStore } from "@/lib/admin-store";
import { useI18n } from "@/lib/i18n/provider";
import { VersionBadge } from "@/components/pusaka/version-badge";

/** Tautan kolom Program → halaman tersendiri (Task 13) — label via footer.links.*. */
const PROGRAM_LINKS = [
  { href: "#/p/layanan/ppiu", key: "ppiu" },
  { href: "#/p/layanan/bpw", key: "bpw" },
  { href: "#/p/layanan/pihk", key: "pihk" },
  { href: "#/p/layanan/iata", key: "iata" },
  { href: "#/p/layanan/izin-umrah", key: "umrahHaji" },
  { href: "#/p/layanan/izin-haji", key: "haji" },
] as const;

/** Tautan kolom Layanan — label diterjemahkan via footer.links.*. */
const SERVICE_LINKS = [
  { href: "#verifikasi", key: "verify" },
  { href: "#direktori", key: "directory" },
  { href: "#layanan", key: "layanan" },
  { href: "#tutorial", key: "tutorial" },
  { href: "#lacak", key: "track" },
  { href: "#dewan-pakar", key: "experts" },
  { href: "#/p/faq", key: "faq" },
] as const;

/** Jaringan situs ekosistem (Task 11-b) — brand & domain literal,
 *  aria-label via footer.network.items.<key>.aria. */
const NETWORK_SITES = [
  { key: "gunara", brand: "Gunara", domain: "gunara.web.id", href: "https://gunara.web.id" },
  {
    key: "perizinan",
    brand: "Pusat Perizinan",
    domain: "pusatperizinan.com",
    href: "https://pusatperizinan.com",
  },
  { key: "gohajj", brand: "GoHajj", domain: "gohajj.web.id", href: "https://gohajj.web.id" },
] as const;

const SOCIALS = [
  { icon: Facebook, key: "facebook" },
  { icon: Instagram, key: "instagram" },
  { icon: Twitter, key: "twitter" },
  { icon: Youtube, key: "youtube" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Footer() {
  const { t } = useI18n();
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen);
  const setShowAdmin = useAdminStore((s) => s.setShowAdmin);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const openAdminPanel = () => {
    const authed = useAdminStore.getState().status === "authed";
    if (authed) setShowAdmin(true);
    else setLoginOpen(true);
  };

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      toast.error(t("footer.newsletter.invalidEmail"));
      return;
    }
    if (subscribing) return;
    setSubscribing(true);
    try {
      const data = await subscribeNewsletter(trimmed);
      toast.success(
        data?.already ? t("footer.newsletter.already") : t("footer.newsletter.success"),
      );
      setEmail("");
      setSubscribed(true);
    } catch {
      toast.error(t("footer.newsletter.failed"));
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <footer className="mt-auto bg-emerald-950 pb-safe text-emerald-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-xl font-black text-white">
                P
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-white">PUSAKA</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                  {t("footer.brand.tagline")}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-emerald-200/70">
              {t("footer.brand.description")}
            </p>
            <p className="mt-3 border-s-2 border-amber-500/40 ps-3 text-xs leading-relaxed text-emerald-300/70">
              {t("footer.brand.founderCredit")}
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.key}
                    href="#beranda"
                    aria-label={t(`footer.socials.${s.key}`)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-800 bg-emerald-900/40 text-emerald-300 transition-colors hover:border-amber-500/60 hover:text-amber-400"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>

          {/* program */}
          <nav aria-label={t("footer.nav.programAria")}>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              {t("footer.nav.program")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PROGRAM_LINKS.map((l) => (
                <li key={l.key}>
                  <a
                    href={l.href}
                    className="text-sm text-emerald-200/75 transition-colors hover:text-white"
                  >
                    {t(`footer.links.${l.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* layanan */}
          <nav aria-label={t("footer.nav.servicesAria")}>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              {t("footer.nav.services")}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.key}>
                  <a
                    href={l.href}
                    className="text-sm text-emerald-200/75 transition-colors hover:text-white"
                  >
                    {t(`footer.links.${l.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* kontak */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              {t("footer.nav.contact")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-200/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                Gedung Pusdai Lt. 5, Jl. Lapangan Banteng Selatan No. 3, Jakarta Pusat 10710
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                sekretariat@pusaka.go.id
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                +62 21 350 5075
              </li>
            </ul>
          </div>

          {/* newsletter */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              {t("footer.newsletter.title")}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-emerald-200/70">
              {t("footer.newsletter.desc")}
            </p>
            <form className="mt-4 flex gap-2" onSubmit={handleSubscribe} noValidate>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribed) setSubscribed(false);
                }}
                placeholder={t("footer.newsletter.placeholder")}
                aria-label={t("footer.newsletter.emailAria")}
                autoComplete="email"
                disabled={subscribing}
                className="h-11 flex-1 rounded-lg border-emerald-800 bg-emerald-900/40 text-white placeholder:text-emerald-300/40"
              />
              <Button
                type="submit"
                aria-label={t("footer.newsletter.subscribeAria")}
                disabled={subscribing}
                className="h-11 shrink-0 gap-1.5 rounded-lg bg-amber-500 px-3 font-bold text-emerald-950 hover:bg-amber-600"
              >
                {subscribing ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                <span className="hidden sm:inline">{t("footer.newsletter.send")}</span>
              </Button>
            </form>
            {subscribed ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {t("footer.newsletter.subscribed")}
              </p>
            ) : null}
            <p className="mt-2 text-[11px] text-emerald-300/50">
              {t("footer.newsletter.privacy")}
            </p>
          </div>
        </div>
      </div>

      {/* jaringan situs ekosistem (Task 11-b) */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-t border-emerald-900 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              {t("footer.network.title")}
            </h3>
            <p className="mt-1 text-xs text-emerald-300/50">{t("footer.network.desc")}</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {NETWORK_SITES.map((site) => (
              <li key={site.key}>
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`footer.network.items.${site.key}.aria`)}
                  className="flex h-11 items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-900/40 px-3 transition-colors hover:border-amber-500/60"
                >
                  <span className="text-sm font-semibold text-emerald-100">{site.brand}</span>
                  <span className="font-mono text-xs text-emerald-400" dir="ltr">
                    {site.domain}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* bar bawah */}
      <div className="border-t border-emerald-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-emerald-300/60 sm:flex-row sm:px-6 lg:px-8">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="#/p/kebijakan-privasi"
              className="rounded-md px-2 py-1 underline-offset-2 transition-colors hover:text-emerald-100 hover:underline"
            >
              {t("footer.legal.privacy")}
            </a>
            <span aria-hidden className="text-emerald-800">·</span>
            <a
              href="#/p/syarat-ketentuan"
              className="rounded-md px-2 py-1 underline-offset-2 transition-colors hover:text-emerald-100 hover:underline"
            >
              {t("footer.legal.terms")}
            </a>
            <VersionBadge />
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-amber-400" aria-hidden />
              ISO 9001:2015
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-amber-400" aria-hidden />
              BNSP Listed
            </span>
            <button
              type="button"
              onClick={openAdminPanel}
              aria-label={t("footer.admin.aria")}
              className="rounded-md px-2 py-1 text-[11px] text-emerald-300/30 transition-colors hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {t("footer.admin.panel")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
