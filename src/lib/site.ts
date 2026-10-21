// ============================================================
// PUSAKA — Konstanta situs (sumber tunggal untuk SEO & JSON-LD)
// - SITE_URL: ganti dengan domain produksi final saat go-live.
//   Semua canonical/sitemap/robots/OG/JSON-LD mengacu ke sini.
// ============================================================

export const SITE_URL = "https://pusaka.or.id";

export const SITE_NAME = "PUSAKA";

export const SITE_TAGLINE = "Pusat Sertifikasi & Akreditasi Kompetensi";

export const SITE_TITLE =
  "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi | 500+ Layanan Global oleh Gugun Gunara";

export const SITE_DESCRIPTION =
  "Lembaga sertifikasi profesi & akreditasi resmi — 500+ layanan sertifikasi dan akreditasi internasional di 25 bidang profesional (PIHK, PPIU, BPW, IATA, Izin Umrah/Haji, ISO, dst). Didirikan & dipimpin Gugun Gunara — Master Polymath, Sage Universal, The Ultimate Problem Solver — didukung 46 Dewan Pakar Lintas Bidang di 32 negara.";

export const SITE_LOCALE = "id_ID";

/** Situs ekosistem yang dipimpin pendiri (untuk JSON-LD sameAs & kredit). */
export const ECOSYSTEM_SITES = [
  { name: "Gunara", url: "https://gunara.web.id" },
  { name: "Pusat Perizinan", url: "https://pusatperizinan.com" },
  { name: "GoHajj", url: "https://gohajj.web.id" },
] as const;

/** Data kontak resmi (sesuai footer & halaman kontak). */
export const SITE_CONTACT = {
  streetAddress: "Gedung Pusdai Lt. 5, Jl. Lapangan Banteng Selatan No. 3",
  addressLocality: "Jakarta Pusat",
  postalCode: "10710",
  addressCountry: "ID",
  email: "sekretariat@pusaka.go.id",
  phone: "+62 21 350 5075",
  phoneE164: "+62213505075",
} as const;

/** Tautan berbagi (share) dengan pesan terlokalisasi via dict pages.common. */
export function shareUrl(href: string): string {
  return `${SITE_URL}/${href}`;
}
