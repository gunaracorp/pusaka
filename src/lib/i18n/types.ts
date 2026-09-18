// ============================================================
// PUSAKA — Tipe i18n (ID / EN / AR)
// ============================================================

export type Lang = "id" | "en" | "ar";

/** Pohon kamus bersarang; daun berupa string. */
export interface DictTree {
  [key: string]: string | DictTree;
}

/** Kamus per-namespace, wajib menyediakan ketiga bahasa. */
export interface NamespaceDict {
  id: DictTree;
  en: DictTree;
  ar: DictTree;
}

/** Locale Intl per bahasa (uang tetap IDR). */
export const LANG_LOCALES: Record<Lang, string> = {
  id: "id-ID",
  en: "en-US",
  // latn agar angka tetap latin (mudah dibaca untuk nominal rupiah)
  ar: "ar-SA-u-nu-latn",
};

export const LANG_LABELS: Record<Lang, string> = {
  id: "Bahasa Indonesia",
  en: "English",
  ar: "العربية",
};

export const LANG_SHORT: Record<Lang, string> = {
  id: "ID",
  en: "EN",
  ar: "ع",
};
