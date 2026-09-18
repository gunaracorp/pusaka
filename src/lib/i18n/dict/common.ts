import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus BERSAMA (semua bahasa, dipakai lintas komponen)
// Dikelola orchestrator. Agent: JANGAN mengedit file ini.
// ============================================================

export const commonDict: NamespaceDict = {
  id: {
    brand: "PUSAKA",
    brandFull: "Pusat Sertifikasi & Akreditasi Kompetensi",
    tagline: "Lembaga Sertifikasi & Akreditasi Industri Perjalanan Wisata, Umrah & Haji",
    actions: {
      learnMore: "Selengkapnya",
      language: "Pilih Bahasa",
      close: "Tutup",
      copy: "Salin",
      copied: "Tersalin",
      retry: "Coba Lagi",
      viewAll: "Lihat Semua",
      loading: "Memuat…",
      back: "Kembali",
      submit: "Kirim",
    },
    status: {
      active: "AKTIF",
      updated: "DIPERBARUI",
      expired: "KADALUARSA",
      unpaid: "Belum Bayar",
      waiting: "Menunggu Pembayaran",
      paid: "Lunas",
    },
    tiers: {
      PLATINUM: "PLATINUM",
      GOLD: "GOLD",
      SILVER: "SILVER",
    },
    units: {
      days: "Hari",
      percent: "%",
      people: "orang",
      institutions: "lembaga",
    },
    misc: {
      example: "Contoh",
      optional: "opsional",
      required: "wajib",
      demoNote: "Mode demo — pembayaran disimulasikan di lingkungan sandbox.",
    },
    theme: {
      toDark: "Aktifkan mode gelap",
      toLight: "Aktifkan mode terang",
    },
  },
  en: {
    brand: "PUSAKA",
    brandFull: "Center for Competency Certification & Accreditation",
    tagline:
      "Certification & Accreditation Body for the Travel, Umrah & Hajj Industry",
    actions: {
      learnMore: "Learn more",
      language: "Choose Language",
      close: "Close",
      copy: "Copy",
      copied: "Copied",
      retry: "Try Again",
      viewAll: "View All",
      loading: "Loading…",
      back: "Back",
      submit: "Submit",
    },
    status: {
      active: "ACTIVE",
      updated: "RENEWED",
      expired: "EXPIRED",
      unpaid: "Unpaid",
      waiting: "Awaiting Payment",
      paid: "Paid",
    },
    tiers: {
      PLATINUM: "PLATINUM",
      GOLD: "GOLD",
      SILVER: "SILVER",
    },
    units: {
      days: "Days",
      percent: "%",
      people: "people",
      institutions: "institutions",
    },
    misc: {
      example: "Example",
      optional: "optional",
      required: "required",
      demoNote: "Demo mode — payments are simulated in this sandbox environment.",
    },
    theme: {
      toDark: "Switch to dark mode",
      toLight: "Switch to light mode",
    },
  },
  ar: {
    brand: "بوساكا",
    brandFull: "المركز الوطني لاعتماد الكفاءات ومنح الشهادات",
    tagline: "هيئة اعتماد وتوثيق قطاع السفر والحج والعمرة",
    actions: {
      learnMore: "اعرف المزيد",
      language: "اختر اللغة",
      close: "إغلاق",
      copy: "نسخ",
      copied: "تم النسخ",
      retry: "حاول مرة أخرى",
      viewAll: "عرض الكل",
      loading: "جارٍ التحميل…",
      back: "رجوع",
      submit: "إرسال",
    },
    status: {
      active: "ساري",
      updated: "مُجدَّد",
      expired: "منتهي",
      unpaid: "غير مدفوع",
      waiting: "بانتظار الدفع",
      paid: "مدفوع",
    },
    tiers: {
      PLATINUM: "بلاتيني",
      GOLD: "ذهبي",
      SILVER: "فضي",
    },
    units: {
      days: "يوم",
      percent: "٪",
      people: "شخص",
      institutions: "مؤسسة",
    },
    misc: {
      example: "مثال",
      optional: "اختياري",
      required: "إلزامي",
      demoNote: "وضع تجريبي — تُحاكى المدفوعات في بيئة الاختبار.",
    },
    theme: {
      toDark: "التبديل إلى الوضع الداكن",
      toLight: "التبديل إلى الوضع الفاتح",
    },
  },
};
