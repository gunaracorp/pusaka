import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "tutorial" (Pusat Panduan & Tutorial)
// Milik: Task 11-a (Frontend Catalog Agent)
// Konvensi: kode demo (PPU-2025-0001, PSK-2025-83012, kredensial)
// adalah KONSTANTA DATA — ditulis di komponen, bukan di kamus.
// ============================================================

export const tutorialDict: NamespaceDict = {
  id: {
    eyebrow: "Pusat Panduan",
    title: "Tutorial & Panduan Interaktif",
    subtitle:
      "Empat jalur panduan langkah demi langkah — verifikasi sertifikat, pendaftaran & pembayaran, pelacakan status, hingga portal anggota & admin.",
    tabs: {
      verify: "Verifikasi Sertifikat",
      register: "Pendaftaran & Pembayaran",
      track: "Pelacakan Status",
      portal: "Portal Anggota & Admin",
    },
    verify: {
      steps: {
        s1: {
          title: "Buka Halaman Verifikasi",
          desc: "Gulir ke bagian Verifikasi Sertifikat di halaman ini (#verifikasi).",
        },
        s2: {
          title: "Masukkan Nomor Sertifikat",
          desc: "Ketik nomor sertifikat pada kolom yang tersedia, mis. PPU-2025-0001.",
        },
        s3: {
          title: "Klik \"Periksa\"",
          desc: "Sistem mencocokkan nomor dengan database pemegang sertifikat PUSAKA secara real-time.",
        },
        s4: {
          title: "Lihat Hasil & QR",
          desc: "Hasil VALID menampilkan kartu digital berisi QR code, pemegang, program, dan masa berlaku.",
        },
      },
      tipsTitle: "Tips",
      tips: "Nomor sertifikat tidak peka huruf besar/kecil — PPU-2025-0001 dan ppu-2025-0001 memberikan hasil yang sama.",
      demoTitle: "Contoh Nomor Sertifikat",
      cta: "Verifikasi Sekarang",
      ctaAria: "Buka bagian verifikasi sertifikat",
    },
    register: {
      steps: {
        s1: {
          title: "Isi Formulir 3 Langkah",
          desc: "Lengkapi data pemohon di bagian Pendaftaran (#pendaftaran): identitas, program, lalu ringkasan.",
        },
        s2: {
          title: "Pilih Program Sertifikasi",
          desc: "Tentukan program PIHK, PPIU, BPW, atau IATA yang sesuai dengan kebutuhan lembaga Anda.",
        },
        s3: {
          title: "Terima Kode Pelacakan",
          desc: "Setelah dikirim, kode pelacakan berformat PSK-YYYY-XXXXX langsung ditampilkan di layar.",
        },
        s4: {
          title: "Bayar & Lunas Otomatis",
          desc: "Selesaikan pembayaran via QRIS atau Virtual Account pada panel pembayaran; status berubah LUNAS otomatis.",
        },
      },
      tipsTitle: "Tips",
      tips: "Simpan kode pelacakan dengan baik — kode tersebut dibutuhkan untuk memantau status dan menyelesaikan pembayaran.",
      demoTitle: "Format Kode Pelacakan",
      cta: "Mulai Pendaftaran",
      ctaAria: "Buka bagian formulir pendaftaran",
    },
    track: {
      steps: {
        s1: {
          title: "Buka Bagian Pelacakan",
          desc: "Arahkan ke bagian Lacak Status (#lacak) pada halaman ini.",
        },
        s2: {
          title: "Masukkan Kode PSK",
          desc: "Ketik kode pelacakan Anda, mis. kode demo PSK-2025-83012, lalu klik Lacak.",
        },
        s3: {
          title: "Pantau Stepper & Pembayaran",
          desc: "Lima tahap (SUBMITTED → REVIEW → VERIFIKASI → ASSESSMENT → APPROVED) beserta riwayat pembayaran tampil seketika.",
        },
      },
      tipsTitle: "Tips",
      tips: "Kode pelacakan tidak peka huruf besar/kecil. Gunakan tombol salin pada layar sukses pendaftaran agar kode tersimpan rapi.",
      demoTitle: "Kode Demo",
      stagesTitle: "Alur Tahapan",
      cta: "Lacak Status",
      ctaAria: "Buka bagian pelacakan status",
    },
    portal: {
      steps: {
        s1: {
          title: "Masuk Portal Anggota",
          desc: "Pemegang sertifikat menekan tombol Portal Anggota (ikon User) di navbar, lalu masuk dengan email lembaga.",
        },
        s2: {
          title: "Kelola Sertifikat & Pembayaran",
          desc: "Pantau sertifikat digital, pengajuan, invoice, dan profil lembaga dalam satu dashboard.",
        },
        s3: {
          title: "Kelola Konten via Admin CMS",
          desc: "Admin memakai panel CMS (ikon Shield) untuk mengelola program, lembaga, pakar, berita, dan node jaringan global.",
        },
      },
      tipsTitle: "Tips",
      tips: "Akun demo di samping hanya untuk uji coba — jangan gunakan kredensial produksi di luar sandbox ini.",
      demoTitle: "Akun Demo",
      memberLabel: "Portal Anggota",
      adminLabel: "Admin CMS",
      userLabel: "Email / Username",
      passLabel: "Kata Sandi",
      cta: "Masuk Portal Anggota",
      ctaAria: "Buka panduan masuk portal anggota",
    },
    copyHint: "Klik untuk menyalin",
    copyAria: "Salin {value}",
    copyError: "Gagal menyalin ke clipboard.",
  },
  en: {
    eyebrow: "Guide Center",
    title: "Tutorials & Interactive Guides",
    subtitle:
      "Four step-by-step guide paths — certificate verification, registration & payment, status tracking, up to the member & admin portal.",
    tabs: {
      verify: "Certificate Verification",
      register: "Registration & Payment",
      track: "Status Tracking",
      portal: "Member & Admin Portal",
    },
    verify: {
      steps: {
        s1: {
          title: "Open the Verification Page",
          desc: "Scroll to the Certificate Verification section on this page (#verifikasi).",
        },
        s2: {
          title: "Enter the Certificate Number",
          desc: "Type the certificate number into the provided field, e.g. PPU-2025-0001.",
        },
        s3: {
          title: "Click \"Check\"",
          desc: "The system matches the number against the PUSAKA certificate holder database in real time.",
        },
        s4: {
          title: "View the Result & QR",
          desc: "A VALID result shows a digital card with a QR code, holder, program, and validity period.",
        },
      },
      tipsTitle: "Tip",
      tips: "Certificate numbers are case-insensitive — PPU-2025-0001 and ppu-2025-0001 return the same result.",
      demoTitle: "Sample Certificate Numbers",
      cta: "Verify Now",
      ctaAria: "Open the certificate verification section",
    },
    register: {
      steps: {
        s1: {
          title: "Complete the 3-Step Form",
          desc: "Fill in the applicant data in the Registration section (#pendaftaran): identity, program, then summary.",
        },
        s2: {
          title: "Choose a Certification Program",
          desc: "Pick the PIHK, PPIU, BPW, or IATA program that suits your institution.",
        },
        s3: {
          title: "Receive Your Tracking Code",
          desc: "After submitting, a tracking code in the PSK-YYYY-XXXXX format appears on screen instantly.",
        },
        s4: {
          title: "Pay & Settle Automatically",
          desc: "Complete the payment via QRIS or Virtual Account in the payment panel; the status turns PAID automatically.",
        },
      },
      tipsTitle: "Tip",
      tips: "Keep your tracking code safe — you need it to monitor the status and complete the payment.",
      demoTitle: "Tracking Code Format",
      cta: "Start Registration",
      ctaAria: "Open the registration form section",
    },
    track: {
      steps: {
        s1: {
          title: "Open the Tracking Section",
          desc: "Go to the Status Tracking section (#lacak) on this page.",
        },
        s2: {
          title: "Enter the PSK Code",
          desc: "Type your tracking code, e.g. the demo code PSK-2025-83012, then click Track.",
        },
        s3: {
          title: "Watch the Stepper & Payments",
          desc: "Five stages (SUBMITTED → REVIEW → VERIFIKASI → ASSESSMENT → APPROVED) plus the payment history appear instantly.",
        },
      },
      tipsTitle: "Tip",
      tips: "Tracking codes are case-insensitive. Use the copy button on the registration success screen to keep the code handy.",
      demoTitle: "Demo Code",
      stagesTitle: "Stage Flow",
      cta: "Track Status",
      ctaAria: "Open the status tracking section",
    },
    portal: {
      steps: {
        s1: {
          title: "Sign in to the Member Portal",
          desc: "Certificate holders press the Member Portal button (User icon) in the navbar, then sign in with the institution email.",
        },
        s2: {
          title: "Manage Certificates & Payments",
          desc: "Monitor digital certificates, applications, invoices, and the institution profile in one dashboard.",
        },
        s3: {
          title: "Manage Content via the Admin CMS",
          desc: "Admins use the CMS panel (Shield icon) to manage programs, institutions, experts, news, and global network nodes.",
        },
      },
      tipsTitle: "Tip",
      tips: "The demo accounts beside this are for testing only — never use production credentials outside this sandbox.",
      demoTitle: "Demo Accounts",
      memberLabel: "Member Portal",
      adminLabel: "Admin CMS",
      userLabel: "Email / Username",
      passLabel: "Password",
      cta: "Open Member Portal",
      ctaAria: "Open the member portal sign-in guide",
    },
    copyHint: "Click to copy",
    copyAria: "Copy {value}",
    copyError: "Failed to copy to clipboard.",
  },
  ar: {
    eyebrow: "مركز الإرشاد",
    title: "الدروس والأدلة التفاعلية",
    subtitle:
      "أربعة مسارات إرشادية خطوة بخطوة — التحقق من الشهادات، التسجيل والدفع، تتبع الحالة، وصولًا إلى بوابة الأعضاء والإدارة.",
    tabs: {
      verify: "التحقق من الشهادة",
      register: "التسجيل والدفع",
      track: "تتبع الحالة",
      portal: "بوابة الأعضاء والإدارة",
    },
    verify: {
      steps: {
        s1: {
          title: "افتح صفحة التحقق",
          desc: "انتقل إلى قسم التحقق من الشهادات في هذه الصفحة (#verifikasi).",
        },
        s2: {
          title: "أدخل رقم الشهادة",
          desc: "اكتب رقم الشهادة في الحقل المتوفر، مثل PPU-2025-0001.",
        },
        s3: {
          title: "انقر «تحقق»",
          desc: "يطابق النظام الرقم مع قاعدة بيانات حاملي شهادات PUSAKA في الوقت الفعلي.",
        },
        s4: {
          title: "اعرض النتيجة ورمز QR",
          desc: "تُظهر النتيجة سارية بطاقة رقمية تتضمن رمز QR والحامل والبرنامج وفترة الصلاحية.",
        },
      },
      tipsTitle: "نصيحة",
      tips: "أرقام الشهادات غير حساسة لحالة الأحرف — PPU-2025-0001 وppu-2025-0001 يعطيان النتيجة نفسها.",
      demoTitle: "أمثلة أرقام الشهادات",
      cta: "تحقق الآن",
      ctaAria: "افتح قسم التحقق من الشهادات",
    },
    register: {
      steps: {
        s1: {
          title: "أكمل نموذج الخطوات الثلاث",
          desc: "املأ بيانات مقدم الطلب في قسم التسجيل (#pendaftaran): الهوية، ثم البرنامج، ثم الملخص.",
        },
        s2: {
          title: "اختر برنامج الاعتماد",
          desc: "حدد برنامج PIHK أو PPIU أو BPW أو IATA المناسب لمؤسستك.",
        },
        s3: {
          title: "استلم رمز التتبع",
          desc: "بعد الإرسال، يظهر رمز تتبع بصيغة PSK-YYYY-XXXXX على الشاشة فورًا.",
        },
        s4: {
          title: "ادفع ويتم السداد تلقائيًا",
          desc: "أكمل الدفع عبر QRIS أو الحساب الافتراضي في لوحة الدفع؛ تتحول الحالة إلى مدفوع تلقائيًا.",
        },
      },
      tipsTitle: "نصيحة",
      tips: "احتفظ برمز التتبع في مكان آمن — ستحتاجه لمتابعة الحالة وإتمام الدفع.",
      demoTitle: "صيغة رمز التتبع",
      cta: "ابدأ التسجيل",
      ctaAria: "افتح قسم نموذج التسجيل",
    },
    track: {
      steps: {
        s1: {
          title: "افتح قسم التتبع",
          desc: "انتقل إلى قسم تتبع الحالة (#lacak) في هذه الصفحة.",
        },
        s2: {
          title: "أدخل رمز PSK",
          desc: "اكتب رمز التتبع الخاص بك، مثل الرمز التجريبي PSK-2025-83012، ثم انقر تتبع.",
        },
        s3: {
          title: "راقب مسار المراحل والدفع",
          desc: "تظهر خمس مراحل (SUBMITTED → REVIEW → VERIFIKASI → ASSESSMENT → APPROVED) مع سجل المدفوعات فورًا.",
        },
      },
      tipsTitle: "نصيحة",
      tips: "رموز التتبع غير حساسة لحالة الأحرف. استخدم زر النسخ في شاشة نجاح التسجيل للاحتفاظ بالرمز بسهولة.",
      demoTitle: "رمز تجريبي",
      stagesTitle: "تسلسل المراحل",
      cta: "تتبع الحالة",
      ctaAria: "افتح قسم تتبع الحالة",
    },
    portal: {
      steps: {
        s1: {
          title: "سجّل الدخول إلى بوابة الأعضاء",
          desc: "يضغط حاملو الشهادات على زر بوابة الأعضاء (أيقونة User) في شريط التنقل، ثم يدخلون ببريد المؤسسة.",
        },
        s2: {
          title: "أدر الشهادات والمدفوعات",
          desc: "راقب الشهادات الرقمية والطلبات والفواتير وملف المؤسسة في لوحة واحدة.",
        },
        s3: {
          title: "أدر المحتوى عبر نظام الإدارة",
          desc: "يستخدم المدراء لوحة CMS (أيقونة Shield) لإدارة البرامج والمؤسسات والخبراء والأخبار وعقد الشبكة العالمية.",
        },
      },
      tipsTitle: "نصيحة",
      tips: "الحسابات التجريبية المجاورة للاختبار فقط — لا تستخدم بيانات الإنتاج خارج هذه البيئة التجريبية.",
      demoTitle: "حسابات تجريبية",
      memberLabel: "بوابة الأعضاء",
      adminLabel: "نظام الإدارة",
      userLabel: "البريد / اسم المستخدم",
      passLabel: "كلمة المرور",
      cta: "الدخول إلى بوابة الأعضاء",
      ctaAria: "افتح إرشادات الدخول إلى بوابة الأعضاء",
    },
    copyHint: "انقر للنسخ",
    copyAria: "نسخ {value}",
    copyError: "فشل النسخ إلى الحافظة.",
  },
};
