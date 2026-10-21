import type { NamespaceDict } from "@/lib/i18n/types";
import { servicesADict } from "@/lib/i18n/dict/pages/servicesA";
import { servicesBDict } from "@/lib/i18n/dict/pages/servicesB";

// ============================================================
// PUSAKA — Kamus halaman layanan (gabungan A + B)
//   A: pihk, ppiu, bpw
//   B: iata, izin-umrah, izin-haji
// ============================================================

export const servicesDict: NamespaceDict = {
  id: { ...servicesADict.id, ...servicesBDict.id },
  en: { ...servicesADict.en, ...servicesBDict.en },
  ar: { ...servicesADict.ar, ...servicesBDict.ar },
};
