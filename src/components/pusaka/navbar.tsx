"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, Menu, Shield, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/pusaka";
import { useAdminStore } from "@/lib/admin-store";
import { ThemeToggle } from "@/components/pusaka/theme-toggle";
import { LanguageSwitcher } from "@/components/pusaka/language-switcher";
import { useI18n } from "@/lib/i18n/provider";

/** Peta href → key kamus (label diterjemahkan via t("navbar.links.<key>")). */
const LINK_KEYS: Record<(typeof NAV_LINKS)[number]["href"], string> = {
  "#beranda": "beranda",
  "#program": "program",
  "#jaringan-global": "jaringan",
  "#verifikasi": "verifikasi",
  "#direktori": "direktori",
  "#dewan-pakar": "dewanPakar",
  "#pendaftaran": "pendaftaran",
  "#berita": "berita",
};

/** Link tambahan section baru (Task 11-b) — desktop tampil mulai xl,
 *  mobile Sheet selalu tampil. Nav lg+ tidak berubah (8 link lama). */
const EXTRA_LINKS = [
  { href: "#layanan", key: "layanan", extra: true },
  { href: "#tutorial", key: "tutorial", extra: true },
] as const;

/** Gabungan link nav: NAV_LINKS + 2 link baru disisipkan setelah "#program". */
const ALL_LINKS: { href: string; key: string; extra?: boolean }[] = [
  ...NAV_LINKS.slice(0, 2).map((l) => ({ href: l.href, key: LINK_KEYS[l.href] })),
  ...EXTRA_LINKS.map((l) => ({ href: l.href, key: l.key, extra: l.extra })),
  ...NAV_LINKS.slice(2).map((l) => ({ href: l.href, key: LINK_KEYS[l.href] })),
];

/** Halaman tersendiri (Task 13) — deep-link #/p/... */
const PAGE_LINKS = [
  { href: "#/p/tentang", key: "tentang" },
  { href: "#/p/kontak", key: "kontak" },
  { href: "#/p/faq", key: "faq" },
  { href: "#/p/kebijakan-privasi", key: "privasi" },
  { href: "#/p/syarat-ketentuan", key: "terms" },
] as const;

const NAV_LINK_CLASS =
  "rounded-md px-1.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen);
  const setShowAdmin = useAdminStore((s) => s.setShowAdmin);
  const openAdminPanel = () => {
    // Jika sudah login, langsung tampilkan dashboard; jika belum, buka dialog login
    const authed = useAdminStore.getState().status === "authed";
    if (authed) setShowAdmin(true);
    else setLoginOpen(true);
  };
  const openMemberPortal = () => {
    // Didengarkan oleh MemberPortal (Task 9-f)
    window.dispatchEvent(new CustomEvent("pusaka:open-portal"));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-shadow ${
        scrolled ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="#beranda" className="flex items-center gap-3" aria-label={t("navbar.brandAria")}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-amber-500 font-display text-xl font-black text-white shadow-md shadow-emerald-900/20">
            P
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
              PUSAKA
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              {t("navbar.subtitle")}
            </span>
          </span>
        </a>

        {/* Menu desktop */}
        <nav aria-label={t("navbar.navAria")} className="hidden items-center gap-0 lg:flex">
          {ALL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={link.extra ? `hidden xl:inline-flex ${NAV_LINK_CLASS}` : NAV_LINK_CLASS}
            >
              {t(`navbar.links.${link.key}`)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-1 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                aria-label={t("navbar.pagesMenuAria")}
              >
                {t("navbar.pagesMenu")}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {PAGE_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <a href={link.href}>{t(`navbar.pages.${link.key}`)}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
            aria-label={t("navbar.adminAria")}
            onClick={openAdminPanel}
          >
            <Shield className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
            aria-label={t("navbar.portalAria")}
            onClick={openMemberPortal}
          >
            <UserRound className="h-4 w-4" aria-hidden />
          </Button>
          <Button asChild className="h-10 min-w-40 bg-emerald-700 px-3 hover:bg-emerald-800">
            <a href="#pendaftaran" className="gap-2">
              <BadgeCheck className="h-4 w-4" aria-hidden />
              {t("navbar.register")}
            </a>
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 lg:hidden"
              aria-label={t("navbar.menuAria")}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader className="border-b">
              <SheetTitle className="flex items-center gap-2 text-start">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-700 to-amber-500 font-display text-lg font-black text-white">
                  P
                </span>
                PUSAKA
              </SheetTitle>
            </SheetHeader>
            <nav aria-label={t("navbar.navMobileAria")} className="flex flex-col gap-1 p-4">
              {ALL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  {t(`navbar.links.${link.key}`)}
                </a>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t("navbar.pagesMenu")}
                </p>
                {PAGE_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    {t(`navbar.pages.${link.key}`)}
                  </a>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-foreground">{t("navbar.theme")}</span>
                  <ThemeToggle />
                </div>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-foreground">{t("navbar.language")}</span>
                  <LanguageSwitcher compact />
                </div>
                <Button
                  variant="outline"
                  className="mb-2 h-11 w-full gap-2 border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10 dark:border-emerald-500/40 dark:text-emerald-300"
                  onClick={() => {
                    setOpen(false);
                    openMemberPortal();
                  }}
                >
                  <UserRound className="h-4 w-4" aria-hidden />
                  {t("navbar.portal")}
                </Button>
                <Button
                  variant="outline"
                  className="mb-2 h-11 w-full gap-2 border-emerald-600/30 text-emerald-800 hover:bg-emerald-500/10 dark:border-emerald-500/40 dark:text-emerald-300"
                  onClick={() => {
                    setOpen(false);
                    openAdminPanel();
                  }}
                >
                  <Shield className="h-4 w-4" aria-hidden />
                  {t("navbar.admin")}
                </Button>
                <Button asChild className="h-11 w-full bg-emerald-700 hover:bg-emerald-800">
                  <a href="#pendaftaran" onClick={() => setOpen(false)} className="gap-2">
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                    {t("navbar.register")}
                  </a>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
