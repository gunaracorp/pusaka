// ============================================================
// PUSAKA — Komponen & pembangun JSON-LD (Structured Data)
//
// <JsonLd data={...} /> merender <script type="application/ld+json">
// aman terhadap XSS (escape "<" → \u003c).
//
// Builder:
// - buildRootJsonLd()      → @graph Organization + WebSite + ProfessionalService
// - buildServiceJsonLd()   → schema.org/Service untuk halaman layanan
// - buildFaqJsonLd()       → schema.org/FAQPage
// - buildBreadcrumbJsonLd()→ schema.org/BreadcrumbList
// ============================================================

import { SITE_CONTACT, SITE_URL, ECOSYSTEM_SITES } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Graph struktural utama — dirender sekali di RootLayout (server). */
export function buildRootJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "PUSAKA",
        alternateName: "Pusat Sertifikasi & Akreditasi Kompetensi",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon.svg`,
        description:
          "Lembaga sertifikasi profesi & akreditasi resmi dengan 500+ layanan di 25 bidang profesional, didirikan dan dipimpin oleh Gugun Gunara, didukung 46 Dewan Pakar Lintas Bidang di 32 negara.",
        founder: {
          "@type": "Person",
          name: "Gugun Gunara",
          jobTitle: "Founder & Chairman",
          sameAs: ECOSYSTEM_SITES.map((s) => s.url),
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONTACT.streetAddress,
          addressLocality: SITE_CONTACT.addressLocality,
          postalCode: SITE_CONTACT.postalCode,
          addressCountry: SITE_CONTACT.addressCountry,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE_CONTACT.phoneE164,
          email: SITE_CONTACT.email,
          contactType: "customer service",
          availableLanguage: ["id", "en", "ar"],
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi",
        inLanguage: ["id", "en", "ar"],
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#professional-service`,
        name: "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi",
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/icon.svg`,
        priceRange: "$$",
        areaServed: "Worldwide",
        parentOrganization: { "@id": ORG_ID },
        telephone: SITE_CONTACT.phoneE164,
        email: SITE_CONTACT.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONTACT.streetAddress,
          addressLocality: SITE_CONTACT.addressLocality,
          postalCode: SITE_CONTACT.postalCode,
          addressCountry: SITE_CONTACT.addressCountry,
        },
      },
    ],
  };
}

interface ServiceJsonLdInput {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}

/** schema.org/Service untuk halaman layanan tersendiri. */
export function buildServiceJsonLd(
  input: ServiceJsonLdInput
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: input.url,
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
    availableLanguage: ["id", "en", "ar"],
  };
}

/** schema.org/FAQPage dari pasangan tanya-jawab. */
export function buildFaqJsonLd(
  faq: { q: string; a: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** schema.org/BreadcrumbList untuk navigasi remah roti. */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
