"use client";

// ============================================================
// PUSAKA — Top ticker: kalender Hijriah + pengumuman berputar
// Diletakkan orchestrator DI ATAS <Navbar/> (sengaja scroll away).
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Megaphone, MoonStar } from "lucide-react";
import { getNews } from "@/lib/pusaka";

const STATIC_ITEMS = [
  "Pendaftaran batch sertifikasi 2026 resmi dibuka",
  "Verifikasi sertifikat kini online 24/7",
];

// Dibungkus try/catch: bila kalender islamic-umalqura tak didukung, badge disembunyikan isinya.
let hijriFmt: Intl.DateTimeFormat | null = null;
try {
  hijriFmt = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
} catch {
  hijriFmt = null;
}

export function TopTicker() {
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

  const items = useMemo(() => {
    const merged = [...STATIC_ITEMS];
    for (const title of newsTitles) {
      if (!merged.includes(title)) merged.push(title);
    }
    return merged;
  }, [newsTitles]);

  // Rotasi tiap 4 detik.
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4_000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const hijriDate = useMemo(() => {
    if (!mounted || !hijriFmt) return "—";
    try {
      return `${hijriFmt.format(new Date())} H`;
    } catch {
      return "";
    }
  }, [mounted]);

  const current = items[index % items.length];

  return (
    <section
      aria-label="Pengumuman PUSAKA"
      aria-live="polite"
      className="w-full border-b border-emerald-900/60 bg-emerald-950 text-emerald-100"
    >
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4 text-xs">
        {/* Kalender Hijriah — client-computed setelah mounted (bebas hydration mismatch) */}
        <span className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-emerald-800 bg-emerald-900/40 px-2.5 py-1 font-medium text-emerald-200 sm:flex">
          <MoonStar className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          {hijriDate}
        </span>

        {/* Pengumuman berputar */}
        <Megaphone className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />
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
