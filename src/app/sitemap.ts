import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  INFO_SLUGS,
  SERVICE_SLUGS,
  pageHref,
} from "@/lib/pages/registry";

// ============================================================
// PUSAKA — Sitemap (Task 13)
// Halaman-halaman tersendiri dirender dalam rute "/" sebagai
// SPA deep-link (#/p/...), sehingga entri di bawah memuat
// fragment deep-link tersebut (didukung XML sitemap; Google
// mengabaikan fragment namun mesin/dokumentasi lain tetap
// mendapatkan peta seluruh halaman resmi).
// Ganti SITE_URL di src/lib/site.ts saat go-live produksi.
// ============================================================
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${pageHref(slug)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const infoPages: MetadataRoute.Sitemap = INFO_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${pageHref(slug)}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...servicePages,
    ...infoPages,
  ];
}
