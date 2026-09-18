import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "news" (Berita & Pengumuman)
// Judul/excerpt/isi artikel berasal dari DATABASE — tidak diterjemahkan.
// Hanya "chrome" UI (judul section, filter, label, status) yang dipetakan.
// ============================================================

export const newsDict: NamespaceDict = {
  id: {
    eyebrow: "Ruang Berita",
    title: "Kabar & Pengumuman Resmi",
    subtitle:
      "Rilis regulasi, kegiatan Dewan Pakar, dan kemitraan strategis terbaru dari lingkungan PUSAKA.",
    filter: {
      aria: "Filter kategori berita",
      all: "Semua",
    },
    categories: {
      PENGUMUMAN: "Pengumuman",
      REGULASI: "Regulasi",
      KEGIATAN: "Kegiatan",
      KEMITRAAN: "Kemitraan",
    },
    readMore: "Baca selengkapnya",
    empty: "Belum ada berita diterbitkan.",
    error: {
      load: "Gagal memuat berita.",
    },
  },
  en: {
    eyebrow: "Newsroom",
    title: "Official News & Announcements",
    subtitle:
      "Latest regulations, Expert Council activities, and strategic partnerships from PUSAKA.",
    filter: {
      aria: "Filter news by category",
      all: "All",
    },
    categories: {
      PENGUMUMAN: "Announcements",
      REGULASI: "Regulation",
      KEGIATAN: "Events",
      KEMITRAAN: "Partnership",
    },
    readMore: "Read more",
    empty: "No news published yet.",
    error: {
      load: "Failed to load news.",
    },
  },
  ar: {
    eyebrow: "غرفة الأخبار",
    title: "الأخبار والإعلانات الرسمية",
    subtitle:
      "أحدث اللوائح وأنشطة مجلس الخبراء والشراكات الاستراتيجية من بوساكا.",
    filter: {
      aria: "تصفية الأخبار حسب الفئة",
      all: "الكل",
    },
    categories: {
      PENGUMUMAN: "إعلانات",
      REGULASI: "لوائح",
      KEGIATAN: "فعاليات",
      KEMITRAAN: "شراكات",
    },
    readMore: "اقرأ المزيد",
    empty: "لا توجد أخبار منشورة بعد.",
    error: {
      load: "تعذر تحميل الأخبار.",
    },
  },
};
