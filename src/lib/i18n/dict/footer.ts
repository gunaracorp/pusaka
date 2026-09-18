import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "footer" (Footer: brand, tautan,
// kontak, newsletter, baris bawah). Layout sticky-footer (mt-auto)
// tidak diubah — hanya teks.
// ============================================================

export const footerDict: NamespaceDict = {
  id: {
    brand: {
      tagline: "Sertifikasi & Akreditasi",
      description:
        "Pusat Sertifikasi & Akreditasi Kompetensi untuk industri perjalanan wisata, umrah & haji Indonesia — dengan Dewan Pakar 46 lintas bidang dan sertifikat digital QR-verified.",
    },
    nav: {
      program: "Program",
      services: "Layanan",
      contact: "Kontak",
      programAria: "Tautan program",
      servicesAria: "Tautan layanan",
    },
    links: {
      ppiu: "Akreditasi PPIU",
      bpw: "Akreditasi BPW",
      pihk: "Sertifikasi PIHK",
      iata: "Sertifikasi IATA",
      umrahHaji: "Izin Umrah & Haji",
      verify: "Verifikasi Sertifikat",
      directory: "Direktori Lembaga",
      track: "Lacak Pendaftaran",
      experts: "Dewan Pakar",
      faq: "Tanya Jawab",
    },
    socials: {
      facebook: "Facebook PUSAKA",
      instagram: "Instagram PUSAKA",
      twitter: "Twitter / X PUSAKA",
      youtube: "YouTube PUSAKA",
    },
    newsletter: {
      title: "Newsletter",
      desc: "Pengumuman kuota, regulasi terbaru, dan jadwal asesmen — langsung ke email Anda.",
      placeholder: "nama@email.com",
      emailAria: "Alamat email",
      subscribeAria: "Berlangganan newsletter",
      send: "Kirim",
      invalidEmail: "Masukkan alamat email yang valid.",
      already: "Email Anda sudah terdaftar.",
      success: "Berhasil berlangganan! Terima kasih.",
      failed: "Gagal berlangganan. Coba lagi nanti.",
      subscribed: "Terdaftar — terima kasih!",
      privacy: "Kami menghormati privasi Anda. Berhenti kapan saja.",
    },
    copyright: "© {year} PUSAKA • Terdaftar & Diawasi oleh Dewan Pakar Nasional",
    admin: {
      panel: "Panel Admin",
      aria: "Buka Panel Admin PUSAKA",
    },
  },
  en: {
    brand: {
      tagline: "Certification & Accreditation",
      description:
        "Center for Competency Certification & Accreditation for Indonesia's travel, umrah & hajj industry — backed by a 46-member cross-disciplinary Expert Council and QR-verified digital certificates.",
    },
    nav: {
      program: "Programs",
      services: "Services",
      contact: "Contact",
      programAria: "Program links",
      servicesAria: "Service links",
    },
    links: {
      ppiu: "PPIU Accreditation",
      bpw: "BPW Accreditation",
      pihk: "PIHK Certification",
      iata: "IATA Certification",
      umrahHaji: "Umrah & Hajj License",
      verify: "Verify Certificate",
      directory: "Institution Directory",
      track: "Track Application",
      experts: "Expert Council",
      faq: "FAQ",
    },
    socials: {
      facebook: "PUSAKA on Facebook",
      instagram: "PUSAKA on Instagram",
      twitter: "PUSAKA on Twitter / X",
      youtube: "PUSAKA on YouTube",
    },
    newsletter: {
      title: "Newsletter",
      desc: "Quota announcements, latest regulations, and assessment schedules — straight to your inbox.",
      placeholder: "you@email.com",
      emailAria: "Email address",
      subscribeAria: "Subscribe to the newsletter",
      send: "Send",
      invalidEmail: "Please enter a valid email address.",
      already: "This email is already subscribed.",
      success: "Subscribed successfully! Thank you.",
      failed: "Subscription failed. Please try again later.",
      subscribed: "Subscribed — thank you!",
      privacy: "We respect your privacy. Unsubscribe anytime.",
    },
    copyright: "© {year} PUSAKA • Registered & Supervised by the National Expert Council",
    admin: {
      panel: "Admin Panel",
      aria: "Open the PUSAKA Admin Panel",
    },
  },
  ar: {
    brand: {
      tagline: "الاعتماد والتصديق",
      description:
        "المركز الوطني لاعتماد الكفاءات لصناعة السفر والعمرة والحج الإندونيسي — بدعم من مجلس خبراء يضم 46 عضوًا من مختلف التخصصات وشهادات رقمية موثقة برمز QR.",
    },
    nav: {
      program: "البرامج",
      services: "الخدمات",
      contact: "اتصل بنا",
      programAria: "روابط البرامج",
      servicesAria: "روابط الخدمات",
    },
    links: {
      ppiu: "اعتماد PPIU",
      bpw: "اعتماد BPW",
      pihk: "شهادة PIHK",
      iata: "شهادة IATA",
      umrahHaji: "ترخيص العمرة والحج",
      verify: "التحقق من الشهادات",
      directory: "دليل المؤسسات",
      track: "تتبع طلب التسجيل",
      experts: "مجلس الخبراء",
      faq: "الأسئلة الشائعة",
    },
    socials: {
      facebook: "فيسبوك بوساكا",
      instagram: "إنستغرام بوساكا",
      twitter: "تويتر / إكس بوساكا",
      youtube: "يوتيوب بوساكا",
    },
    newsletter: {
      title: "النشرة البريدية",
      desc: "إعلانات الحصص وأحدث اللوائح وجداول التقييم — مباشرة إلى بريدكم الإلكتروني.",
      placeholder: "name@email.com",
      emailAria: "البريد الإلكتروني",
      subscribeAria: "الاشتراك في النشرة البريدية",
      send: "إرسال",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      already: "هذا البريد الإلكتروني مسجل بالفعل.",
      success: "تم الاشتراك بنجاح! شكرًا لكم.",
      failed: "تعذر الاشتراك. يرجى المحاولة لاحقًا.",
      subscribed: "تم التسجيل — شكرًا لكم!",
      privacy: "نحترم خصوصيتكم. يمكنكم إلغاء الاشتراك في أي وقت.",
    },
    copyright: "© {year} بوساكا • مسجل وخاضع لإشراف مجلس الخبراء الوطني",
    admin: {
      panel: "لوحة الإدارة",
      aria: "افتح لوحة إدارة بوساكا",
    },
  },
};
