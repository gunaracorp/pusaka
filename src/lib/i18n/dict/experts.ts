import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "experts" (Dewan Pakar)
// Konsumen: src/components/pusaka/experts.tsx
// ============================================================

export const expertsDict: NamespaceDict = {
  id: {
    eyebrow: "Dewan Pakar",
    title: "46 Dewan Pakar Lintas Bidang",
    subtitle:
      "Standardisasi kurikulum dan instrumen uji kompetensi ditetapkan oleh 46 ahli nasional dari 9 bidang keilmuan — memastikan sertifikasi relevan & berkelas dunia.",
    all: "Semua",
    categories: {
      IBADAH: "Ibadah",
      HUKUM: "Hukum",
      AVIASI: "Aviasi",
      MANAJEMEN: "Manajemen",
      KEUANGAN: "Keuangan",
      TEKNOLOGI: "Teknologi",
      KESEHATAN: "Kesehatan",
      BAHASA: "Bahasa",
      LOGISTIK: "Logistik",
    },
    yearsShort: "{count} Thn",
    showingOf: "Menampilkan {count} dari {total} pakar",
    error: "Gagal memuat dewan pakar.",
    retry: "Coba muat ulang",
    empty: "Tidak ada pakar pada kategori ini.",
    dialog: {
      field: "Bidang",
      organization: "Organisasi",
      experience: "Pengalaman",
      yearsValue: "{count} tahun",
      yearsBadge: "{count} Tahun Pengalaman",
      license: "Nomor Lisensi Dewan Pakar",
      education: "Pendidikan",
      expertise: "Ruang Lingkup Keahlian",
    },
  },
  en: {
    eyebrow: "Expert Council",
    title: "46-Member Multidisciplinary Expert Council",
    subtitle:
      "Curriculum standards and competency assessment instruments are set by 46 national experts across 9 fields of study — keeping certifications relevant & world-class.",
    all: "All",
    categories: {
      IBADAH: "Worship",
      HUKUM: "Law",
      AVIASI: "Aviation",
      MANAJEMEN: "Management",
      KEUANGAN: "Finance",
      TEKNOLOGI: "Technology",
      KESEHATAN: "Health",
      BAHASA: "Language",
      LOGISTIK: "Logistics",
    },
    yearsShort: "{count} yrs",
    showingOf: "Showing {count} of {total} experts",
    error: "Failed to load the expert council.",
    retry: "Try reloading",
    empty: "No experts in this category.",
    dialog: {
      field: "Field",
      organization: "Organization",
      experience: "Experience",
      yearsValue: "{count} years",
      yearsBadge: "{count} Years of Experience",
      license: "Expert Council License No.",
      education: "Education",
      expertise: "Area of Expertise",
    },
  },
  ar: {
    eyebrow: "مجلس الخبراء",
    title: "46 خبيراً في مختلف المجالات",
    subtitle:
      "تُوضَع معايير المناهج وأدوات اختبار الكفاءة بواسطة 46 خبيراً وطنياً من 9 مجالات علمية — لضمان شهادات ملائمة وبمستوى عالمي.",
    all: "الكل",
    categories: {
      IBADAH: "العبادات",
      HUKUM: "القانون",
      AVIASI: "الطيران",
      MANAJEMEN: "الإدارة",
      KEUANGAN: "المالية",
      TEKNOLOGI: "التقنية",
      KESEHATAN: "الصحة",
      BAHASA: "اللغة",
      LOGISTIK: "الخدمات اللوجستية",
    },
    yearsShort: "{count} سنة",
    showingOf: "يعرض {count} من أصل {total} خبيراً",
    error: "فشل تحميل مجلس الخبراء.",
    retry: "حاول إعادة التحميل",
    empty: "لا يوجد خبراء في هذا التصنيف.",
    dialog: {
      field: "المجال",
      organization: "المؤسسة",
      experience: "الخبرة",
      yearsValue: "{count} سنة",
      yearsBadge: "خبرة {count} سنة",
      license: "رقم ترخيص مجلس الخبراء",
      education: "المؤهل العلمي",
      expertise: "مجالات الخبرة",
    },
  },
};
