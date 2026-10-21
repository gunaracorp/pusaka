"use client";

// ============================================================
// PUSAKA — Dispatcher halaman tersendiri (dipakai oleh Home)
// SEO (usePageSeo) dikelola TERPUSAT di Home — bukan di sini —
// agar hanya ada satu penulis title/meta per render.
// ============================================================

import { isServiceSlug, type PageSlug } from "@/lib/pages/registry";
import { ServicePage } from "@/components/pusaka/pages/service-page";
import { AboutPage } from "@/components/pusaka/pages/about-page";
import { ContactPage } from "@/components/pusaka/pages/contact-page";
import { FaqPage } from "@/components/pusaka/pages/faq-page";
import { LegalPage } from "@/components/pusaka/pages/legal-page";

export function PageView({ slug }: { slug: PageSlug }) {

  if (isServiceSlug(slug)) return <ServicePage slug={slug} />;
  switch (slug) {
    case "tentang":
      return <AboutPage />;
    case "kontak":
      return <ContactPage />;
    case "faq":
      return <FaqPage />;
    case "kebijakan-privasi":
      return <LegalPage doc="privacy" />;
    case "syarat-ketentuan":
      return <LegalPage doc="terms" />;
    default:
      return null;
  }
}
