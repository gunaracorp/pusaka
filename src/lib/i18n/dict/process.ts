import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "process" (Alur Sertifikasi 5 Langkah)
// Milik: Task 9-b (Frontend i18n Program Agent)
// ============================================================

export const processDict: NamespaceDict = {
  id: {
    eyebrow: "Prosedur",
    title: "Alur Sertifikasi 5 Langkah",
    subtitle:
      "Proses transparan dari pendaftaran hingga terbitnya sertifikat digital QR-verified — dipantau penuh oleh Dewan Pakar.",
    stepLabel: "LANGKAH {n}",
    steps: {
      register: {
        title: "Pendaftaran Online",
        duration: "± 15 menit",
        desc: "Isi formulir pendaftaran dan unggah dokumen persyaratan melalui portal resmi PUSAKA.",
      },
      verification: {
        title: "Verifikasi Berkas",
        duration: "1 × 24 jam",
        desc: "Tim admisi memeriksa kelengkapan & keabsahan dokumen, lalu menerbitkan surat penugasan asesor.",
      },
      training: {
        title: "Pelatihan & Ujian Kompetensi",
        duration: "3–7 hari",
        desc: "Kurikulum standar Dewan Pakar: kelas intensif, ujian tertulis, dan praktik wawancara.",
      },
      audit: {
        title: "Audit Lapangan / Assessment",
        duration: "2–5 hari",
        desc: "Asesor independen melakukan penilaian lapangan bagi perusahaan atau uji simulasi bagi individu.",
      },
      certificate: {
        title: "Sertifikat Terbit QR-Verified",
        duration: "1 hari kerja",
        desc: "Sertifikat digital diterbitkan dengan QR-verified dan tercatat permanen pada basis data nasional.",
      },
    },
  },
  en: {
    eyebrow: "Procedure",
    title: "5-Step Certification Process",
    subtitle:
      "A transparent process from registration to the issuance of a QR-verified digital certificate — fully monitored by the Expert Council.",
    stepLabel: "STEP {n}",
    steps: {
      register: {
        title: "Online Registration",
        duration: "± 15 minutes",
        desc: "Fill in the registration form and upload the required documents through the official PUSAKA portal.",
      },
      verification: {
        title: "Document Verification",
        duration: "1 × 24 hours",
        desc: "The admissions team checks document completeness & validity, then issues the assessor assignment letter.",
      },
      training: {
        title: "Training & Competency Exam",
        duration: "3–7 days",
        desc: "Expert Council standard curriculum: intensive classes, written exams, and interview practice.",
      },
      audit: {
        title: "Field Audit / Assessment",
        duration: "2–5 days",
        desc: "Independent assessors conduct on-site assessments for companies or simulation tests for individuals.",
      },
      certificate: {
        title: "QR-Verified Certificate Issued",
        duration: "1 business day",
        desc: "The digital certificate is issued with QR verification and permanently recorded in the national database.",
      },
    },
  },
  ar: {
    eyebrow: "الإجراءات",
    title: "مسار الاعتماد في 5 خطوات",
    subtitle:
      "عملية شفافة من التسجيل حتى إصدار الشهادة الرقمية الموثقة برمز QR — تحت إشراف كامل من مجلس الخبراء.",
    stepLabel: "الخطوة {n}",
    steps: {
      register: {
        title: "التسجيل عبر الإنترنت",
        duration: "± 15 دقيقة",
        desc: "املأ نموذج التسجيل وارفع المستندات المطلوبة عبر بوابة PUSAKA الرسمية.",
      },
      verification: {
        title: "التحقق من المستندات",
        duration: "1 × 24 ساعة",
        desc: "يتحقق فريق القبول من اكتمال المستندات وصحتها، ثم يُصدر كتاب تكليف المقيّمين.",
      },
      training: {
        title: "التدريب واختبار الكفاءة",
        duration: "3–7 أيام",
        desc: "منهج بمعايير مجلس الخبراء: صفوف مكثفة واختبارات تحريرية وتدريب على المقابلات.",
      },
      audit: {
        title: "التدقيق الميداني / التقييم",
        duration: "2–5 أيام",
        desc: "يقوم المقيّمون المستقلون بالتقييم الميداني للشركات أو اختبار محاكاة للأفراد.",
      },
      certificate: {
        title: "إصدار الشهادة الموثقة برمز QR",
        duration: "يوم عمل واحد",
        desc: "تُصدر الشهادة الرقمية موثقة برمز QR وتُسجَّل بشكل دائم في قاعدة البيانات الوطنية.",
      },
    },
  },
};
