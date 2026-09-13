"use client";

import { ShieldCheck } from "lucide-react";

const PARTNERS = [
  "Kemenag RI",
  "BNSP",
  "Kemenparekraf",
  "IATA Montreal",
  "ASITA",
  "Kemenkumham",
  "GDS Amadeus",
  "GDS Sabre",
];

export function TrustMarquee() {
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <div
      className="marquee-hover-pause relative overflow-hidden border-y border-stone-200 bg-stone-50 py-4"
      aria-label="Mitra dan lembaga kemitraan PUSAKA"
    >
      <div className="animate-marquee flex w-max items-center gap-10">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-stone-500"
            aria-hidden={i >= PARTNERS.length}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
            {name}
            <span className="ml-6 h-1.5 w-1.5 rounded-full bg-amber-500/60" aria-hidden />
          </span>
        ))}
      </div>
      {/* tepi pudar */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-stone-50 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-stone-50 to-transparent" aria-hidden />
    </div>
  );
}
