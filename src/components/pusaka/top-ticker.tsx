"use client";

// ============================================================
// PUSAKA — Top ticker: kalender Hijriah + pengumuman berputar
// Diletakkan orchestrator DI ATAS <Navbar/> (sengaja scroll away).
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, MoonStar } from "lucide-react";
import { getNews } from "@/lib/pusaka";
import { useI18n } from "@/lib/i18n/provider";
import { LANG_LOCALES } from "@/lib/i18n/types";

export function TopTicker() {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [newsTitles, setNewsTitles] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  // Tandai mounted lewat timeout agar bebas react-hooks/set-state-in-effect.
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Ambil 4 berita terbaru untuk pengumuman berputar (gagal → item statis saja).
  useEffect(() => {
    let cancelled = false;
    getNews()
      .then((articles) => {
        if (cancelled) return;
        const titles = articles
          .slice(0, 4)
          .map((a) => a.title.trim())
          .filter(Boolean);
        setNewsTitles(titles);
      })
      .catch(() => {
        /* ticker tetap jalan dengan pengumuman statis */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pengumuman statis dari kamus + judul berita dari DB (tidak diterjemahkan).
  const items = useMemo(() => {
    const merged = [
      t("topTicker.items.batch2026"),
      t("topTicker.items.services"),
      t("topTicker.items.verify247"),
    ];
    for (const title of newsTitles) {
      if (!merged.includes(title)) merged.push(title);
    }
    return merged;
  }, [newsTitles, t]);

  // Rotasi tiap 4 detik.
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4_000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  // Kalender Hijriah mengikuti locale bahasa aktif — client-computed setelah
  // mounted (bebas hydration mismatch). Dibungkus try/catch: bila kalender
  // islamic-umalqura tak didukung, badge disembunyikan isinya.
  const hijriDate = useMemo(() => {
    if (!mounted) return "—";
    try {
      const fmt = new Intl.DateTimeFormat(LANG_LOCALES[lang], {
        calendar: "islamic-umalqura",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return `${fmt.format(new Date())} ${t("topTicker.hijriSuffix")}`;
    } catch {
      return "";
    }
  }, [mounted, lang, t]);

  const current = items[index % items.length];

  return (
    <section
      aria-label={t("topTicker.ariaLabel")}
      aria-live="polite"
      className="w-full border-b border-emerald-900/60 bg-emerald-950 text-emerald-100"
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4 text-xs">
        {/* Kalender Hijriah — client-computed setelah mounted (bebas hydration mismatch) */}
        <span className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-emerald-800 bg-emerald-900/40 px-2.5 py-1 font-medium text-emerald-200 sm:flex">
          <MoonStar className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          <span className="sr-only">{t("topTicker.hijriLabel")}</span>
          {hijriDate}
        </span>

        {/* Pengumuman berputar */}
        <Megaphone className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
        <span className="hidden shrink-0 text-[11px] font-bold uppercase tracking-widest text-amber-300/90 md:inline">
          {t("topTicker.label")}
        </span>
        <div className="relative min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.a
              key={`${index}-${current}`}
              href="#berita"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="block truncate text-emerald-100/85 transition-colors hover:text-amber-300"
            >
              {current}
            </motion.a>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
