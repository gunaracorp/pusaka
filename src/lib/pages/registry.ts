// ============================================================
// PUSAKA — Registri halaman tersendiri (SPA deep-link)
//
// Karena pratinjau hanya menyajikan rute "/", halaman-halaman
// tersendiri diakses via deep-link hash:
//   Beranda              → /#/            (atau anchor section lama #program dll.)
//   Halaman layanan      → /#/p/layanan/<slug>
//   Halaman informasi    → /#/p/<slug>
// Fungsi parseHash() memetakan location.hash → ParsedRoute agar
// komponen dapat merender halaman yang tepat.
// ============================================================

export const SERVICE_SLUGS = [
  "pihk",
  "ppiu",
  "bpw",
  "iata",
  "izin-umrah",
  "izin-haji",
] as const;

export const INFO_SLUGS = [
  "tentang",
  "kontak",
  "faq",
  "kebijakan-privasi",
  "syarat-ketentuan",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type InfoPageSlug = (typeof INFO_SLUGS)[number];
export type PageSlug = ServiceSlug | InfoPageSlug;

const SERVICE_SET: ReadonlySet<string> = new Set(SERVICE_SLUGS);
const INFO_SET: ReadonlySet<string> = new Set(INFO_SLUGS);

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SET.has(slug);
}

export function isPageSlug(slug: string): slug is PageSlug {
  return SERVICE_SET.has(slug) || INFO_SET.has(slug);
}

export const SERVICE_ROUTE_PREFIX = "layanan/";

/** Bangun href deep-link halaman (hash-based). */
export function pageHref(slug: PageSlug): string {
  if (isServiceSlug(slug)) return `#/p/layanan/${slug}`;
  return `#/p/${slug}`;
}

export type ParsedRoute =
  | { kind: "home" }
  | { kind: "page"; slug: PageSlug };

/** Parse location.hash menjadi rute halaman atau beranda. */
export function parseHash(hash: string): ParsedRoute {
  if (!hash.startsWith("#/p/")) return { kind: "home" };
  const rest = hash.slice(4).replace(/\/+$/, "");
  const slug = rest.startsWith(SERVICE_ROUTE_PREFIX)
    ? rest.slice(SERVICE_ROUTE_PREFIX.length)
    : rest;
  if (isPageSlug(slug)) return { kind: "page", slug };
  return { kind: "home" };
}

/**
 * Key-path kamus i18n untuk metadata SEO per halaman
 * (t(`pages.<path>.metaTitle`) / metaDescription).
 */
export function pageSeoKeyPath(slug: PageSlug): string {
  switch (slug) {
    case "tentang":
      return "about";
    case "kontak":
      return "contact";
    case "faq":
      return "faqPage";
    case "kebijakan-privasi":
      return "legal.privacy";
    case "syarat-ketentuan":
      return "legal.terms";
    default:
      return `service.${slug}`;
  }
}

/** Slug layanan terkait (internal linking antar halaman layanan). */
export const RELATED_SERVICES: Record<ServiceSlug, ServiceSlug[]> = {
  pihk: ["izin-haji", "izin-umrah", "ppiu"],
  ppiu: ["izin-umrah", "bpw", "pihk"],
  bpw: ["iata", "ppiu", "pihk"],
  iata: ["bpw", "ppiu", "pihk"],
  "izin-umrah": ["ppiu", "izin-haji", "pihk"],
  "izin-haji": ["pihk", "izin-umrah", "ppiu"],
};

/** Halaman layanan berurutan untuk kartu navigasi (FAQ, Tentang, dll). */
export const SERVICE_PAGE_ORDER: ServiceSlug[] = [...SERVICE_SLUGS];
