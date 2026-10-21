"use client";

// ============================================================
// PUSAKA — I18n Provider (ID / EN / AR) + hook useI18n
// - Bahasa tersimpan di localStorage ("pusaka-lang"), default "id"
// - Saat "ar": html[dir=rtl] + lang=ar (font Arab via globals.css)
// - t(path) dengan fallback: bahasa aktif → "id" → path mentah
// - formatCurrency/formatDate/... otomatis ikut locale bahasa aktif
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LANG_LOCALES,
  type DictTree,
  type Lang,
} from "@/lib/i18n/types";
import { dictionaries } from "@/lib/i18n/dict";

const STORAGE_KEY = "pusaka-lang";
export type { Lang };

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  /** Terjemahkan berdasarkan dot-path, mis. t("hero.title"). Mendukung interpolasi {var}. */
  t: (path: string, vars?: Record<string, string | number>) => string;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
  formatDate: (value: string | Date) => string;
  formatDateShort: (value: string | Date) => string;
  formatDateTime: (value: string | Date) => string;
  /** Waktu relatif terlokalisasi ("3 jam lalu" / "3 hours ago" / "قبل 3 ساعة"). */
  timeAgo: (value: string | Date) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Telusuri dot-path di pohon kamus. */
function lookup(tree: DictTree | undefined, parts: string[]): string | undefined {
  let node: string | DictTree | undefined = tree;
  for (const part of parts) {
    if (!node || typeof node === "string") return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** Ganti placeholder {nama} pada string terjemahan. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match
  );
}

function resolve(
  path: string,
  lang: Lang,
  vars?: Record<string, string | number>
): string {
  const parts = path.split(".");
  const active = lookup(dictionaries[lang], parts);
  if (active !== undefined) return interpolate(active, vars);
  const fallback = lookup(dictionaries.id, parts);
  if (fallback !== undefined) return interpolate(fallback, vars);
  return interpolate(path, vars);
}

/** Waktu relatif terlokalisasi. */
function relativeTime(value: string | Date, lang: Lang): string {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "-";
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  if (lang === "en") {
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  if (lang === "ar") {
    if (minutes < 1) return "الآن";
    if (minutes < 60) return `قبل ${minutes} دقيقة`;
    if (hours < 24) return `قبل ${hours} ساعة`;
    if (days < 30) return `قبل ${days} يوم`;
    return `قبل ${months} شهر`;
  }
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 30) return `${days} hari lalu`;
  return `${months} bulan lalu`;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("id");

  // Muat bahasa tersimpan SEKALI setelah mount (hindari hydration mismatch).
  // v6.0.1: efek [lang] TIDAK lagi menulis ke storage saat mount — preferensi
  // tersimpan tidak lagi tertimpa default "id"; penulisan hanya di setLang().
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "id" || saved === "en" || saved === "ar") {
          setLangState(saved);
        }
      } catch {
        /* localStorage tidak tersedia — pakai default */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Sinkronkan atribut dokumen setiap kali bahasa berubah
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // v6.0.1: tulis ke localStorage HANYA saat pengguna benar-benar mengganti bahasa
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* abaikan */
    }
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => resolve(path, lang, vars),
    [lang]
  );

  const value = useMemo<I18nContextValue>(() => {
    const locale = LANG_LOCALES[lang];
    const currencyFmt = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });
    const numberFmt = new Intl.NumberFormat(locale);
    const dateFmt = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateShortFmt = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const dateTimeFmt = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return {
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      t,
      formatCurrency: (n: number) => currencyFmt.format(n),
      formatNumber: (n: number) => numberFmt.format(n),
      formatDate: (v: string | Date) => dateFmt.format(new Date(v)),
      formatDateShort: (v: string | Date) => dateShortFmt.format(new Date(v)),
      formatDateTime: (v: string | Date) => dateTimeFmt.format(new Date(v)),
      timeAgo: (v: string | Date) => relativeTime(v, lang),
    };
  }, [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Hook i18n utama — gunakan di semua komponen publik PUSAKA. */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback aman bila provider belum terpasang (mis. di modul uji)
    return {
      lang: "id",
      dir: "ltr",
      setLang: () => undefined,
      t: (path, vars) => resolve(path, "id", vars),
      formatCurrency: (n) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(n),
      formatNumber: (n) => new Intl.NumberFormat("id-ID").format(n),
      formatDate: (v) => new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(v)),
      formatDateShort: (v) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(v)),
      formatDateTime: (v) => new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(v)),
      timeAgo: (v) => relativeTime(v, "id"),
    };
  }
  return ctx;
}
