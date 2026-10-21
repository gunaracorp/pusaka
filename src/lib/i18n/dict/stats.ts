import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "stats" (Statistik publik)
// Konsumen: src/components/pusaka/stats-section.tsx
// ============================================================

export const statsDict: NamespaceDict = {
  id: {
    eyebrow: "Data & Statistik",
    title: "Transparansi dalam Angka",
    subtitle:
      "Kinerja sertifikasi & akreditasi PUSAKA diperbarui langsung dari basis data operasional — terbuka untuk publik.",
    counters: {
      certificates: "Sertifikat Terbit",
      services: "Layanan Sertifikasi",
      institutions: "Lembaga Terakreditasi",
      experts: "Dewan Pakar",
      verifications: "Verifikasi Hari Ini",
      countries: "Negara Mitra",
      partners: "Mitra Internasional",
    },
    charts: {
      programs: "Distribusi Pemegang per Program",
      tiers: "Distribusi Tier Lembaga",
      provinces: "Provinsi dengan Lembaga Terbanyak",
    },
    tooltip: {
      holders: "Pemegang",
      institutions: "{count} lembaga",
      institutionName: "Lembaga",
    },
  },
  en: {
    eyebrow: "Data & Statistics",
    title: "Transparency in Numbers",
    subtitle:
      "PUSAKA certification & accreditation performance is updated directly from the operational database — open to the public.",
    counters: {
      certificates: "Certificates Issued",
      services: "Certification Services",
      institutions: "Accredited Institutions",
      experts: "Expert Council",
      verifications: "Verifications Today",
      countries: "Partner Countries",
      partners: "International Partners",
    },
    charts: {
      programs: "Holders by Program",
      tiers: "Institution Tier Distribution",
      provinces: "Provinces with the Most Institutions",
    },
    tooltip: {
      holders: "Holders",
      institutions: "{count} institutions",
      institutionName: "Institutions",
    },
  },
  ar: {
    eyebrow: "البيانات والإحصاءات",
    title: "الشفافية بالأرقام",
    subtitle:
      "تُحدَّث بيانات أداء الاعتماد والتوثيق في بوساكا مباشرةً من قاعدة البيانات التشغيلية — ومتاحة للجمهور.",
    counters: {
      certificates: "الشهادات الصادرة",
      services: "خدمات الاعتماد",
      institutions: "المؤسسات المعتمدة",
      experts: "مجلس الخبراء",
      verifications: "عمليات التحقق اليوم",
      countries: "الدول الشريكة",
      partners: "الشركاء الدوليون",
    },
    charts: {
      programs: "توزيع الحاملين حسب البرنامج",
      tiers: "توزيع مستويات المؤسسات",
      provinces: "المقاطعات الأكثر احتواءً على المؤسسات",
    },
    tooltip: {
      holders: "حامل",
      institutions: "{count} مؤسسة",
      institutionName: "مؤسسات",
    },
  },
};
