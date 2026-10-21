import type { NamespaceDict } from "@/lib/i18n/types";
import { pagesCommonDict } from "@/lib/i18n/dict/pages/common";
import { servicesDict } from "@/lib/i18n/dict/pages/services";
import { aboutDict } from "@/lib/i18n/dict/pages/about";
import { contactDict } from "@/lib/i18n/dict/pages/contact";
import { faqPageDict } from "@/lib/i18n/dict/pages/faqPage";
import { legalDict } from "@/lib/i18n/dict/pages/legal";

// ============================================================
// PUSAKA — Namespace "pages": seluruh halaman tersendiri
//   pages.common  → label bersama (breadcrumb, CTA, dll)
//   pages.service → 6 halaman layanan
//   pages.about / contact / faqPage / legal → halaman informasi
// ============================================================

export const pagesDict: NamespaceDict = {
  id: {
    common: pagesCommonDict.id,
    service: servicesDict.id,
    about: aboutDict.id,
    contact: contactDict.id,
    faqPage: faqPageDict.id,
    legal: legalDict.id,
  },
  en: {
    common: pagesCommonDict.en,
    service: servicesDict.en,
    about: aboutDict.en,
    contact: contactDict.en,
    faqPage: faqPageDict.en,
    legal: legalDict.en,
  },
  ar: {
    common: pagesCommonDict.ar,
    service: servicesDict.ar,
    about: aboutDict.ar,
    contact: contactDict.ar,
    faqPage: faqPageDict.ar,
    legal: legalDict.ar,
  },
};
