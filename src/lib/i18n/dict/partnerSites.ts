import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "partnerSites" (Jaringan Situs Ekosistem)
// gunara.web.id / pusatperizinan.com / gohajj.web.id
// Task 11-b (Frontend Branding Agent).
// Konvensi: domain & brand situs adalah proper noun — TIDAK diterjemahkan
// (tetap literal di komponen; aria-label memuat domain apa adanya).
// ============================================================

export const partnerSitesDict: NamespaceDict = {
  id: {
    eyebrow: "Ekosistem Digital",
    title: "Jaringan Situs Ekosistem",
    subtitle:
      "Tiga platform digital terpadu di bawah satu jaringan — dikelola langsung oleh Gugun Gunara.",
    cta: "Kunjungi Situs",
    footnote: "Ekosistem digital terpadu — satu jaringan, layanan saling terhubung.",
    sites: {
      gunara: {
        desc: "Hub konsultasi & solusi bisnis lintas bidang oleh Gugun Gunara — pemetaan masalah, strategi, hingga eksekusi.",
        aria: "Kunjungi gunara.web.id — Gunara",
      },
      perizinan: {
        desc: "Layanan perizinan & legalitas usaha terpadu — pengurusan izin cepat, transparan, dan terpandu.",
        aria: "Kunjungi pusatperizinan.com — Pusat Perizinan",
      },
      gohajj: {
        desc: "Platform layanan haji & umrah digital — pendampingan perjalanan ibadah dari awal hingga selesai.",
        aria: "Kunjungi gohajj.web.id — GoHajj",
      },
    },
  },
  en: {
    eyebrow: "Digital Ecosystem",
    title: "Partner Sites Network",
    subtitle:
      "Three integrated digital platforms under one network — led directly by Gugun Gunara.",
    cta: "Visit Site",
    footnote: "An integrated digital ecosystem — one network, connected services.",
    sites: {
      gunara: {
        desc: "Cross-field business consulting & solutions hub by Gugun Gunara — from problem mapping to strategy and execution.",
        aria: "Visit gunara.web.id — Gunara",
      },
      perizinan: {
        desc: "Integrated business licensing & legality services — fast, transparent, fully guided permit processing.",
        aria: "Visit pusatperizinan.com — Pusat Perizinan",
      },
      gohajj: {
        desc: "Digital hajj & umrah services platform — guided worship travel from start to finish.",
        aria: "Visit gohajj.web.id — GoHajj",
      },
    },
  },
  ar: {
    eyebrow: "المنظومة الرقمية",
    title: "شبكة المواقع الشريكة",
    subtitle:
      "ثلاث منصات رقمية متكاملة ضمن شبكة واحدة — بإدارة مباشرة من Gugun Gunara.",
    cta: "زيارة الموقع",
    footnote: "منظومة رقمية متكاملة — شبكة واحدة وخدمات مترابطة.",
    sites: {
      gunara: {
        desc: "مركز استشارات وحلول أعمال عبر المجالات بإشراف Gugun Gunara — من رسم المشكلات إلى الاستراتيجية والتنفيذ.",
        aria: "زيارة gunara.web.id — Gunara",
      },
      perizinan: {
        desc: "خدمات متكاملة للتراخيص والشأن القانوني للأعمال — إنجاز سريع وشفاف ومُوجَّه.",
        aria: "زيارة pusatperizinan.com — Pusat Perizinan",
      },
      gohajj: {
        desc: "منصة رقمية لخدمات الحج والعمرة — مرافقة كاملة لرحلة العبادة من البداية إلى النهاية.",
        aria: "زيارة gohajj.web.id — GoHajj",
      },
    },
  },
};
