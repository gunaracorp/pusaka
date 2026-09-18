import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "programs" (section Program Sertifikasi)
// Milik: Task 9-b (Frontend i18n Program Agent)
// Catatan: nama program, tagline, description, requirements,
// benefits, accreditation & countries berasal dari DATABASE
// (proper noun / konten) — sengaja TIDAK diterjemahkan di sini.
// ============================================================

export const programsDict: NamespaceDict = {
  id: {
    eyebrow: "Program Sertifikasi",
    title: "7 Jalur Sertifikasi & Akreditasi Resmi",
    subtitle:
      "Dari pendamping haji khusus hingga agen tiket internasional — pilih jalur sertifikasi yang sesuai dengan profil lembaga atau profesi Anda.",
    tabs: {
      all: "Semua",
      company: "Perusahaan",
      profession: "Profesi",
      license: "Izin",
    },
    category: {
      PERUSAHAAN: "Perusahaan",
      PROFESI: "Profesi",
      IZIN: "Izin Resmi",
    },
    holders: "{count} pemegang",
    passRateChip: "Lolos {rate}%",
    daysCount: "{count} Hari",
    viewDetail: "Lihat Detail",
    emptyCategory: "Belum ada program pada kategori ini.",
    loadError: "Gagal memuat program.",
    retryLoad: "Coba muat ulang",
    loadingAria: "Memuat program…",
    dialog: {
      srDescription: "Detail program sertifikasi {name}",
      investment: "Investasi",
      duration: "Durasi",
      passRate: "Tingkat Kelulusan",
      requirements: "Persyaratan",
      benefits: "Manfaat Sertifikasi",
      accreditation: "Diakui & Diakreditasi oleh",
      internationalScope: "Cakupan Internasional",
      apply: "Daftar Program Ini",
    },
  },
  en: {
    eyebrow: "Certification Programs",
    title: "7 Official Certification & Accreditation Tracks",
    subtitle:
      "From dedicated hajj guides to international ticketing agents — choose the certification track that matches your institution's or profession's profile.",
    tabs: {
      all: "All",
      company: "Corporate",
      profession: "Professional",
      license: "Licenses",
    },
    category: {
      PERUSAHAAN: "Corporate",
      PROFESI: "Professional",
      IZIN: "Official License",
    },
    holders: "{count} holders",
    passRateChip: "{rate}% pass rate",
    daysCount: "{count} Days",
    viewDetail: "View Details",
    emptyCategory: "No programs available in this category yet.",
    loadError: "Failed to load programs.",
    retryLoad: "Try reloading",
    loadingAria: "Loading programs…",
    dialog: {
      srDescription: "Details of the {name} certification program",
      investment: "Investment",
      duration: "Duration",
      passRate: "Pass Rate",
      requirements: "Requirements",
      benefits: "Certification Benefits",
      accreditation: "Recognized & Accredited by",
      internationalScope: "International Coverage",
      apply: "Register for This Program",
    },
  },
  ar: {
    eyebrow: "برامج الاعتماد",
    title: "7 مسارات رسمية للاعتماد ومنح الشهادات",
    subtitle:
      "من مُرشدي الحج الخاصين إلى وكلاء التذاكر الدوليين — اختر مسار الاعتماد المناسب لملف مؤسستك أو مهنتك.",
    tabs: {
      all: "الكل",
      company: "الشركات",
      profession: "المهن",
      license: "التراخيص",
    },
    category: {
      PERUSAHAAN: "شركات",
      PROFESI: "مهن",
      IZIN: "ترخيص رسمي",
    },
    holders: "{count} من الحائزين",
    passRateChip: "نسبة النجاح {rate}٪",
    daysCount: "{count} يوم",
    viewDetail: "عرض التفاصيل",
    emptyCategory: "لا توجد برامج في هذه الفئة بعد.",
    loadError: "فشل تحميل البرامج.",
    retryLoad: "إعادة المحاولة",
    loadingAria: "جارٍ تحميل البرامج…",
    dialog: {
      srDescription: "تفاصيل برنامج الاعتماد {name}",
      investment: "الاستثمار",
      duration: "المدة",
      passRate: "نسبة النجاح",
      requirements: "المتطلبات",
      benefits: "مزايا الاعتماد",
      accreditation: "معترَف به ومعتمد من",
      internationalScope: "الانتشار الدولي",
      apply: "سجّل في هذا البرنامج",
    },
  },
};
