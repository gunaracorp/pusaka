import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "contact" (CTA Kontak + Form Pesan)
// Alamat fisik & email tetap literal (proper noun/fakta).
// ============================================================

export const contactDict: NamespaceDict = {
  id: {
    cta: {
      title1: "Siap Menjadi Lembaga",
      titleAccent: "Terakreditasi?",
      desc: "Bergabunglah bersama ribuan lembaga & profesional yang telah memegang sertifikat PUSAKA. Tim konsultasi kami siap membantu memilih jalur sertifikasi yang tepat untuk profil Anda — gratis.",
      footnote:
        "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi • Terakreditasi berlaku nasional & internasional",
    },
    info: {
      addressLabel: "Kantor Sekretariat",
      emailLabel: "Email Resmi",
      phoneLabel: "Telepon / WhatsApp",
      phoneValue: "+62 21 350 5075 (hotline 24 jam)",
      hoursLabel: "Jam Layanan",
      hoursValue:
        "Senin – Jumat, 08.00 – 16.00 WIB (layanan verifikasi daring 24 jam)",
    },
    form: {
      title: "Kirim Pesan",
      desc: "Pertanyaan seputar program, biaya, atau jadwal audit — kami siap membantu.",
      name: "Nama *",
      namePlaceholder: "Nama Anda",
      email: "Email *",
      emailPlaceholder: "nama@email.com",
      subject: "Subjek *",
      subjectPlaceholder: "mis. Konsultasi akreditasi BPW",
      message: "Pesan *",
      messagePlaceholder: "Tulis pertanyaan Anda…",
      send: "Kirim Pesan",
      sending: "Mengirim…",
    },
    valid: {
      name: "Nama minimal 3 karakter.",
      email: "Alamat email tidak valid.",
      subject: "Subjek minimal 3 karakter.",
      message: "Pesan minimal 10 karakter.",
    },
    success: {
      sent: "Pesan terkirim! Tim kami membalas maksimal 1 × 24 jam kerja.",
    },
    error: {
      send: "Gagal mengirim pesan.",
    },
  },
  en: {
    cta: {
      title1: "Ready to Become an",
      titleAccent: "Accredited Institution?",
      desc: "Join thousands of institutions & professionals holding PUSAKA certificates. Our consultation team is ready to help you choose the right certification path for your profile — free of charge.",
      footnote:
        "PUSAKA — Center for Competency Certification & Accreditation • Accreditations valid nationally & internationally",
    },
    info: {
      addressLabel: "Secretariat Office",
      emailLabel: "Official Email",
      phoneLabel: "Phone / WhatsApp",
      phoneValue: "+62 21 350 5075 (24-hour hotline)",
      hoursLabel: "Service Hours",
      hoursValue:
        "Monday – Friday, 08.00 – 16.00 WIB (online verification available 24 hours)",
    },
    form: {
      title: "Send a Message",
      desc: "Questions about programs, fees, or audit schedules — we are ready to help.",
      name: "Name *",
      namePlaceholder: "Your name",
      email: "Email *",
      emailPlaceholder: "name@email.com",
      subject: "Subject *",
      subjectPlaceholder: "e.g. BPW accreditation consultation",
      message: "Message *",
      messagePlaceholder: "Write your question…",
      send: "Send Message",
      sending: "Sending…",
    },
    valid: {
      name: "Name must be at least 3 characters.",
      email: "Please enter a valid email address.",
      subject: "Subject must be at least 3 characters.",
      message: "Message must be at least 10 characters.",
    },
    success: {
      sent: "Message sent! Our team replies within 1 × 24 business hours.",
    },
    error: {
      send: "Failed to send your message.",
    },
  },
  ar: {
    cta: {
      title1: "هل أنتم جاهزون لأن تصبحوا مؤسسة",
      titleAccent: "معتمدة؟",
      desc: "انضموا إلى آلاف المؤسسات والمهنيين الحاصلين على شهادات بوساكا. فريق الاستشارات لدينا جاهز لمساعدتكم في اختيار مسار الاعتماد الأنسب لملفكم — مجانًا.",
      footnote:
        "بوساكا — المركز الوطني لاعتماد الكفاءات ومنح الشهادات • الاعتماد ساري وطنيًا ودوليًا",
    },
    info: {
      addressLabel: "مكتب الأمانة",
      emailLabel: "البريد الإلكتروني الرسمي",
      phoneLabel: "الهاتف / واتساب",
      phoneValue: "+62 21 350 5075 (خط ساخن على مدار الساعة)",
      hoursLabel: "ساعات الخدمة",
      hoursValue:
        "الاثنين – الجمعة، 08.00 – 16.00 (خدمة التحقق الإلكترونية متاحة على مدار 24 ساعة)",
    },
    form: {
      title: "أرسل رسالة",
      desc: "للاستفسارات حول البرامج أو الرسوم أو جداول التدقيق — نحن جاهزون لمساعدتكم.",
      name: "الاسم *",
      namePlaceholder: "اسمكم",
      email: "البريد الإلكتروني *",
      emailPlaceholder: "name@email.com",
      subject: "الموضوع *",
      subjectPlaceholder: "مثال: استشارة اعتماد BPW",
      message: "الرسالة *",
      messagePlaceholder: "اكتبوا استفساركم…",
      send: "إرسال الرسالة",
      sending: "جارٍ الإرسال…",
    },
    valid: {
      name: "يجب ألا يقل الاسم عن 3 أحرف.",
      email: "يرجى إدخال بريد إلكتروني صحيح.",
      subject: "يجب ألا يقل الموضوع عن 3 أحرف.",
      message: "يجب ألا تقل الرسالة عن 10 أحرف.",
    },
    success: {
      sent: "تم إرسال الرسالة! يرد فريقنا خلال 24 ساعة عمل كحد أقصى.",
    },
    error: {
      send: "تعذر إرسال الرسالة.",
    },
  },
};
