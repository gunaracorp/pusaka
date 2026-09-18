// ============================================================
// PUSAKA — Indeks kamus i18n
// Menggabungkan semua namespace ke satu pohon per bahasa:
//   t("navbar.links.program") → navbarDict.en.links.program
// Konvensi: setiap file dict mengekspor const <ns>Dict: NamespaceDict
// ============================================================

import type { DictTree, Lang } from "@/lib/i18n/types";
import { commonDict } from "@/lib/i18n/dict/common";
import { navbarDict } from "@/lib/i18n/dict/navbar";
import { heroDict } from "@/lib/i18n/dict/hero";
import { trustMarqueeDict } from "@/lib/i18n/dict/trustMarquee";
import { topTickerDict } from "@/lib/i18n/dict/topTicker";
import { quickVerifyDict } from "@/lib/i18n/dict/quickVerify";
import { programsDict } from "@/lib/i18n/dict/programs";
import { globalNetworkDict } from "@/lib/i18n/dict/globalNetwork";
import { verifySectionDict } from "@/lib/i18n/dict/verifySection";
import { processDict } from "@/lib/i18n/dict/process";
import { directoryDict } from "@/lib/i18n/dict/directory";
import { expertsDict } from "@/lib/i18n/dict/experts";
import { statsDict } from "@/lib/i18n/dict/stats";
import { faqDict } from "@/lib/i18n/dict/faq";
import { testimonialsDict } from "@/lib/i18n/dict/testimonials";
import { newsDict } from "@/lib/i18n/dict/news";
import { contactDict } from "@/lib/i18n/dict/contact";
import { footerDict } from "@/lib/i18n/dict/footer";
import { sakaDict } from "@/lib/i18n/dict/saka";
import { applicationFormDict } from "@/lib/i18n/dict/applicationForm";
import { trackDict } from "@/lib/i18n/dict/track";
import { paymentDict } from "@/lib/i18n/dict/payment";
import { portalDict } from "@/lib/i18n/dict/portal";

const NAMESPACES: Record<string, { id: DictTree; en: DictTree; ar: DictTree }> = {
  common: commonDict,
  navbar: navbarDict,
  hero: heroDict,
  trustMarquee: trustMarqueeDict,
  topTicker: topTickerDict,
  quickVerify: quickVerifyDict,
  programs: programsDict,
  globalNetwork: globalNetworkDict,
  verifySection: verifySectionDict,
  process: processDict,
  directory: directoryDict,
  experts: expertsDict,
  stats: statsDict,
  faq: faqDict,
  testimonials: testimonialsDict,
  news: newsDict,
  contact: contactDict,
  footer: footerDict,
  saka: sakaDict,
  applicationForm: applicationFormDict,
  track: trackDict,
  payment: paymentDict,
  portal: portalDict,
};

function buildLang(lang: Lang): DictTree {
  const tree: DictTree = {};
  for (const [ns, dict] of Object.entries(NAMESPACES)) {
    tree[ns] = dict[lang];
  }
  return tree;
}

export const dictionaries: Record<Lang, DictTree> = {
  id: buildLang("id"),
  en: buildLang("en"),
  ar: buildLang("ar"),
};
