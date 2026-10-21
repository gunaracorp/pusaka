"use client";

// ============================================================
// PUSAKA — SEO dinamis per halaman (title, meta, canonical, OG)
//
// Halaman tersendiri dirender di dalam rute "/" (SPA hash),
// sehingga hook ini menuliskan metadata dokumen secara dinamis
// saat rute/bahasa berubah — terbaca oleh crawler yang
// mengeksekusi JavaScript (Googlebot): document.title, meta
// description, link rel=canonical, og:title/description/url,
// twitter:title/description.
// ============================================================

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import {
  pageHref,
  pageSeoKeyPath,
  type PageSlug,
} from "@/lib/pages/registry";

const HOME_DESCRIPTION =
  "Lembaga sertifikasi profesi & akreditasi resmi — 500+ layanan sertifikasi dan akreditasi internasional di 25 bidang profesional. Didirikan & dipimpin Gugun Gunara, didukung 46 Dewan Pakar Lintas Bidang di 32 negara.";

function upsertMeta(
  attr: "name" | "property",
  key: string,
  value: string
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertCanonical(url: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(
    "link[rel='canonical']"
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function usePageSeo(slug: PageSlug | null): void {
  const { t, lang } = useI18n();

  useEffect(() => {
    const title = slug
      ? `${t(`pages.${pageSeoKeyPath(slug)}.metaTitle`)} | ${SITE_NAME}`
      : SITE_TITLE;
    const description = slug
      ? t(`pages.${pageSeoKeyPath(slug)}.metaDescription`)
      : HOME_DESCRIPTION;
    const canonical = `${SITE_URL}/${slug ? pageHref(slug) : ""}`;

    const apply = () => {
      document.title = title;
      upsertMeta("name", "description", description);
      upsertCanonical(canonical);
      upsertMeta("property", "og:title", title);
      upsertMeta("property", "og:description", description);
      upsertMeta("property", "og:url", canonical);
      upsertMeta("property", "og:site_name", SITE_NAME);
      upsertMeta("name", "twitter:title", title);
      upsertMeta("name", "twitter:description", description);
    };

    apply();

    // Pengaman v6.1.0: runtime head Next.js (hydration/HMR) dapat membuat
    // ulang elemen <title> dengan nilai SSR setelah efek kita berjalan —
    // observer ini menegaskan kembali metadata bila title berbeda dari
    // nilai yang kita tetapkan. Guard `document.title !== title` mencegah loop.
    const observer = new MutationObserver(() => {
      if (document.title !== title) apply();
    });
    observer.observe(document.head, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [slug, t, lang]);
}
