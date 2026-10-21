"use client";

// ============================================================
// PUSAKA — Hook rute hash untuk halaman tersendiri (SPA)
// - State awal SELALU "home" agar hydration aman (SSR & client sama).
// - Setelah mount, sinkronkan dengan location.hash (mendukung deep-link).
// - Mendengarkan hashchange (back/forward browser ikut bekerja).
// - Saat pindah ke halaman tersendiri, scroll ke atas.
// ============================================================

import { useEffect, useState } from "react";
import { parseHash, type ParsedRoute } from "@/lib/pages/registry";

export function useHashRoute(): ParsedRoute {
  const [route, setRoute] = useState<ParsedRoute>({ kind: "home" });

  // Sinkronisasi awal + langganan hashchange
  useEffect(() => {
    const sync = () => {
      const next = parseHash(window.location.hash);
      setRoute(next);
      if (next.kind === "page") {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return route;
}
