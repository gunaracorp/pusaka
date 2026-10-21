import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus Top Ticker (aria label, badge Pengumuman,
// label kalender Hijriah, dan pengumuman statis).
// Judul berita dari DB TIDAK diterjemahkan di sini.
// ============================================================

export const topTickerDict: NamespaceDict = {
  id: {
    ariaLabel: "Pengumuman PUSAKA",
    label: "Pengumuman",
    hijriLabel: "Kalender Hijriah",
    hijriSuffix: "H",
    items: {
      batch2026: "Pendaftaran batch sertifikasi 2026 resmi dibuka",
      services:
        "500+ Layanan Sertifikasi & Akreditasi Internasional — 25 Bidang Profesional",
      verify247: "Verifikasi sertifikat kini online 24/7",
    },
  },
  en: {
    ariaLabel: "PUSAKA announcements",
    label: "Announcements",
    hijriLabel: "Hijri calendar",
    hijriSuffix: "H",
    items: {
      batch2026: "Registration for the 2026 certification batch is officially open",
      services:
        "500+ International Certification & Accreditation Services — 25 Professional Fields",
      verify247: "Certificate verification is now online 24/7",
    },
  },
  ar: {
    ariaLabel: "إعلانات بوساكا",
    label: "إعلانات",
    hijriLabel: "التقويم الهجري",
    hijriSuffix: "هـ",
    items: {
      batch2026: "التسجيل في دفعة شهادات عام 2026 مفتوح رسميًا",
      services:
        "أكثر من 500 خدمة توثيق واعتماد دولي — 25 مجالًا مهنيًا",
      verify247: "التحقق من الشهادات متاح الآن عبر الإنترنت على مدار الساعة",
    },
  },
};
