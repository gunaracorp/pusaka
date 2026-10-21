import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "founder" (Section Pendiri: Gugun Gunara)
// Task 11-b (Frontend Branding Agent).
// Konvensi: nama "Gugun Gunara" & gelar "Master Polymath", "Sage Universal",
// "The Ultimate Problem Solver" adalah proper noun — TIDAK diterjemahkan
// (tetap literal di komponen & dalam teks kamus mana pun).
// ============================================================

export const founderDict: NamespaceDict = {
  id: {
    role: "Pendiri & Pemimpin Lembaga",
    vision:
      "Memimpin PUSAKA menyatukan 46 Dewan Pakar lintas bidang keilmuan dalam satu lembaga — membangun ekosistem layanan sertifikasi & akreditasi paling lengkap di dunia berstandar internasional, agar kompetensi lembaga Indonesia diakui hingga 32 negara.",
    quote:
      "Sertifikasi yang kuat lahir dari keilmuan yang menyeluruh — satu lembaga, semua bidang, standar dunia.",
    creds: {
      council: "46 Dewan Pakar Lintas Bidang",
      services: "500+ Layanan Sertifikasi",
      countries: "32 Negara Jaringan",
      standards: "Standar Internasional IAF/ILAC",
    },
  },
  en: {
    role: "Founder & Institute Leader",
    vision:
      "Leading PUSAKA to unite 46 cross-disciplinary Expert Councils within a single institution — building the world's most complete certification & accreditation ecosystem to international standards, so the competence of Indonesian institutions is recognized across 32 countries.",
    quote:
      "Strong certification is born from complete mastery — one institution, every field, world-class standards.",
    creds: {
      council: "46 Cross-Disciplinary Expert Councils",
      services: "500+ Certification Services",
      countries: "32 Network Countries",
      standards: "International Standards IAF/ILAC",
    },
  },
  ar: {
    role: "المؤسس وقائد المؤسسة",
    vision:
      "يقود بوساكا لتوحيد 46 مجلس خبراء من مختلف التخصصات في مؤسسة واحدة — لبناء أكبر منظومة خدمات التوثيق والاعتماد اكتمالًا في العالم وفق المعايير الدولية، حتى تُعترف بكفاءات المؤسسات الإندونيسية في 32 دولة.",
    quote:
      "الشهادة القوية تنبع من إلمام شامل — مؤسسة واحدة، وكل التخصصات، ومعايير عالمية.",
    creds: {
      council: "46 مجلس خبراء عبر التخصصات",
      services: "أكثر من 500 خدمة توثيق",
      countries: "32 دولة ضمن الشبكة",
      standards: "معايير دولية IAF/ILAC",
    },
  },
};
