import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "versionControl" (PUSAKA)
// Lencana versi + dialog Riwayat Versi (Task 12).
// Konvensi: "PUSAKA" & nomor versi adalah proper noun — TIDAK
// diterjemahkan; konten entri changelog kanonik Bahasa Indonesia.
// ============================================================

export const versionControlDict: NamespaceDict = {
  id: {
    badge: {
      aria: "Lihat riwayat versi PUSAKA",
    },
    dialog: {
      title: "Riwayat Versi PUSAKA",
      subtitle:
        "Setiap perubahan tercatat sistematis — fitur yang ditambahkan, disempurnakan, maupun dihapus — mengikuti standar internasional.",
      channelLabel: "Stabil",
      releasedOn: "Diterbitkan",
      tasksLabel: "Task",
      currentBadge: "Rilis Berjalan",
      totalLabel: "{count} rilis terdokumentasi",
      legendTitle: "Cara membaca nomor versi",
      legendMajor: "MAJOR — lompatan generasi: subsistem besar atau perubahan mendasar",
      legendMinor: "MINOR — fitur baru yang kompatibel dengan versi sebelumnya",
      legendPatch: "PATCH — perbaikan bug & penyempurnaan tanpa fitur baru",
      sections: {
        added: "Ditambahkan",
        changed: "Diubah",
        deprecated: "Ditidakberlakukan",
        removed: "Dihapus",
        fixed: "Diperbaiki",
        security: "Keamanan",
      },
      sourceNote:
        "Sumber kebenaran: src/lib/version.ts · Standar: VERSIONING.md · Catatan: CHANGELOG.md · API: /api/version",
      closeAria: "Tutup riwayat versi",
    },
  },
  en: {
    badge: {
      aria: "View PUSAKA version history",
    },
    dialog: {
      title: "PUSAKA Version History",
      subtitle:
        "Every change is systematically recorded — features added, refined, or removed — following international standards.",
      channelLabel: "Stable",
      releasedOn: "Released",
      tasksLabel: "Task",
      currentBadge: "Current Release",
      totalLabel: "{count} documented releases",
      legendTitle: "How to read the version number",
      legendMajor: "MAJOR — generational leap: major subsystem or fundamental change",
      legendMinor: "MINOR — new features, backward compatible",
      legendPatch: "PATCH — bug fixes & refinements, no new features",
      sections: {
        added: "Added",
        changed: "Changed",
        deprecated: "Deprecated",
        removed: "Removed",
        fixed: "Fixed",
        security: "Security",
      },
      sourceNote:
        "Source of truth: src/lib/version.ts · Standard: VERSIONING.md · Notes: CHANGELOG.md · API: /api/version",
      closeAria: "Close version history",
    },
  },
  ar: {
    badge: {
      aria: "عرض سجل إصدارات PUSAKA",
    },
    dialog: {
      title: "سجل إصدارات PUSAKA",
      subtitle:
        "كل تغيير موثّق بشكل منهجي — الميزات المضافة والمحسّنة والمُزالة — وفق المعايير الدولية.",
      channelLabel: "مستقر",
      releasedOn: "تاريخ الإصدار",
      tasksLabel: "المهمة",
      currentBadge: "الإصدار الحالي",
      totalLabel: "{count} إصدارًا موثّقًا",
      legendTitle: "كيفية قراءة رقم الإصدار",
      legendMajor: "MAJOR — قفزة جيل: نظام فرعي كبير أو تغيير جوهري",
      legendMinor: "MINOR — ميزات جديدة متوافقة مع الإصدارات السابقة",
      legendPatch: "PATCH — إصلاحات الأخطاء والتحسينات دون ميزات جديدة",
      sections: {
        added: "مضاف",
        changed: "معدَّل",
        deprecated: "ملغى تدريجيًا",
        removed: "محذوف",
        fixed: "مُصلَّح",
        security: "الأمن",
      },
      sourceNote:
        "مصدر الحقيقة: src/lib/version.ts · المعيار: VERSIONING.md · السجل: CHANGELOG.md · الواجهة البرمجية: /api/version",
      closeAria: "إغلاق سجل الإصدارات",
    },
  },
};
