import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "faq" (Tanya Jawab)
// Konsumen: src/components/pusaka/faq.tsx
// Item diindeks manual: faq.items.1.q / faq.items.1.a, dst. (1..8)
// ============================================================

export const faqDict: NamespaceDict = {
  id: {
    eyebrow: "Tanya Jawab",
    title: "Pertanyaan yang Sering Diajukan",
    subtitle:
      "Tidak menemukan jawaban? Hubungi sekretariat melalui form kontak di bagian bawah halaman.",
    hint: "klik pertanyaan untuk membuka jawaban",
    items: {
      "1": {
        q: "Apa perbedaan sertifikasi PIHK dan PPIU?",
        a: "PIHK (Pendamping Haji Khusus) adalah sertifikasi bagi individu yang mendampingi jemaah haji secara khusus, sedangkan PPIU (Perusahaan Penyelenggara Perjalanan Umrah) adalah akreditasi bagi badan usaha yang menyelenggarakan perjalanan umrah. PIHK menitikberatkan kompetensi ritual & pendampingan individu, PPIU menilai sistem manajemen perusahaan, keuangan, dan perlindungan jemaah.",
      },
      "2": {
        q: "Berapa lama masa berlaku sertifikat PUSAKA?",
        a: "Sertifikat profesi berlaku 3 tahun, sedangkan akreditasi lembaga (PPIU, BPW, IATA, PIHK) berlaku 3 tahun dengan audit pemantauan tahunan. Pembaruan dapat diajukan paling lambat 90 hari sebelum masa berlaku habis melalui portal pendaftaran.",
      },
      "3": {
        q: "Bagaimana cara memverifikasi keaslian sertifikat?",
        a: "Buka menu Verifikasi di situs ini, lalu masukkan nomor sertifikat (contoh: PPU-2025-0001) atau pindai QR code yang tercetak pada sertifikat digital. Sistem akan menampilkan status, tier, skor audit, dan masa berlaku secara real-time.",
      },
      "4": {
        q: "Berapa biaya sertifikasi dan bagaimana skema pembayarannya?",
        a: "Biaya berbeda tiap program, mulai dari Rp 3,5 juta untuk sertifikasi individu hingga Rp 25 juta untuk akreditasi lembaga internasional. Pembayaran dapat dicicil 2 tahap: 50% saat pendaftaran dan 50% sebelum pelatihan. Kwitansi resmi diterbitkan otomatis oleh sistem.",
      },
      "5": {
        q: "Apakah biaya pendaftaran dapat dikembalikan (refund)?",
        a: "Ya. Pengembalian 100% diberikan bila pembatalan dilakukan sebelum jadwal verifikasi berkas. Setelah peserta mengikuti pelatihan, refund tidak tersedia, namun jadwal dapat ditunda satu kali dalam 12 bulan ke depan tanpa biaya tambahan.",
      },
      "6": {
        q: "Dokumen apa saja yang perlu disiapkan?",
        a: "Dokumen umum meliputi: KTP/paspor, NPWP (untuk badan usaha), akta pendirian & izin usaha (SIUJK/SIUPTO untuk PPIU/BPW), foto profil perusahaan, serta daftar tenaga ahli. Daftar lengkap per program tersedia pada dialog detail program di bagian Program Sertifikasi.",
      },
      "7": {
        q: "Apakah sertifikasi PUSAKA diakui oleh Kementerian Agama?",
        a: "Ya. PUSAKA bekerja di bawah kerangka regulasi Kemenag RI untuk aspek penyelenggaraan umrah & haji khusus, serta berkoordinasi dengan BNSP untuk skema sertifikasi kompetensi. Sertifikat kami juga diakui mitra internasional seperti IATA.",
      },
      "8": {
        q: "Bagaimana cara menjadi anggota Dewan Pakar PUSAKA?",
        a: "Kandidat dewan pakar diusulkan lembaga profesi atau diundang langsung berdasarkan rekam jejak minimal 10 tahun di bidang ibadah, hukum, aviasi, manajemen, keuangan, teknologi, kesehatan, bahasa, atau logistik. Kirim CV dan publikasi ke sekretariat melalui form kontak; Dewan akan melakukan vetting dua tahap.",
      },
    },
  },
  en: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    subtitle:
      "Couldn't find your answer? Contact the secretariat through the contact form at the bottom of the page.",
    hint: "click a question to open its answer",
    items: {
      "1": {
        q: "What is the difference between PIHK and PPIU certification?",
        a: "PIHK (Special Hajj Companion) is a certification for individuals who specifically accompany Hajj pilgrims, while PPIU (Umrah Travel Operator Company) is an accreditation for businesses that organize Umrah trips. PIHK focuses on ritual competency and individual guidance, whereas PPIU assesses corporate management systems, finance, and pilgrim protection.",
      },
      "2": {
        q: "How long is a PUSAKA certificate valid?",
        a: "Professional certificates are valid for 3 years, while institution accreditations (PPIU, BPW, IATA, PIHK) are valid for 3 years with annual monitoring audits. Renewals may be submitted no later than 90 days before expiry through the registration portal.",
      },
      "3": {
        q: "How do I verify the authenticity of a certificate?",
        a: "Open the Verify menu on this site, then enter the certificate number (e.g., PPU-2025-0001) or scan the QR code printed on the digital certificate. The system will display the status, tier, audit score, and validity period in real time.",
      },
      "4": {
        q: "How much does certification cost and what are the payment options?",
        a: "Fees vary by program, from IDR 3.5 million for individual certification up to IDR 25 million for international institution accreditation. Payments can be made in 2 installments: 50% upon registration and 50% before training. Official receipts are issued automatically by the system.",
      },
      "5": {
        q: "Is the registration fee refundable?",
        a: "Yes. A 100% refund is granted if the cancellation is made before the document verification schedule. Once a participant has attended the training, refunds are no longer available; however, the schedule may be postponed once within the next 12 months at no extra cost.",
      },
      "6": {
        q: "Which documents do I need to prepare?",
        a: "General documents include: ID card/passport, taxpayer number (NPWP) for businesses, articles of incorporation & business licenses (SIUJK/SIUPTO for PPIU/BPW), a company profile photo, and a list of expert staff. The complete list per program is available in the program detail dialog in the Certification Programs section.",
      },
      "7": {
        q: "Is PUSAKA certification recognized by the Ministry of Religious Affairs?",
        a: "Yes. PUSAKA operates under the regulatory framework of the Indonesian Ministry of Religious Affairs (Kemenag RI) for the organization of Umrah & special Hajj, and coordinates with BNSP for competency certification schemes. Our certificates are also recognized by international partners such as IATA.",
      },
      "8": {
        q: "How can I join the PUSAKA Expert Council?",
        a: "Expert Council candidates are nominated by professional associations or invited directly based on a track record of at least 10 years in worship, law, aviation, management, finance, technology, health, language, or logistics. Send your CV and publications to the secretariat via the contact form; the Council will conduct a two-stage vetting process.",
      },
    },
  },
  ar: {
    eyebrow: "الأسئلة والأجوبة",
    title: "الأسئلة المتكررة",
    subtitle:
      "لم تجد الإجابة؟ تواصل مع الأمانة عبر نموذج التواصل في أسفل الصفحة.",
    hint: "انقر على السؤال لعرض الإجابة",
    items: {
      "1": {
        q: "ما الفرق بين توثيق PIHK واعتماد PPIU؟",
        a: "شهادة PIHK (المرشد الخاص للحج) مخصصة للأفراد الذين يرافقون حجاج بيت الله بشكل خاص، بينما اعتماد PPIU (شركة تنظيم رحلات العمرة) مخصص للكيانات التجارية التي تنظم رحلات العمرة. تركز PIHK على كفاءة الشعائر ومرافقة الأفراد، فيما تقيّم PPIU منظومة إدارة الشركة والمالية وحماية الحجاج.",
      },
      "2": {
        q: "ما مدة صلاحية شهادة بوساكا؟",
        a: "تكون صلاحية الشهادات المهنية ثلاث سنوات، أما اعتمادات المؤسسات (PPIU وBPW وIATA وPIHK) فتكون صالحة ثلاث سنوات مع تدقيق رقابة سنوي. ويمكن تقديم طلب التجديد قبل انتهاء الصلاحية بمدة لا تقل عن 90 يوماً عبر بوابة التسجيل.",
      },
      "3": {
        q: "كيف أتحقق من صحة الشهادة؟",
        a: "افتح قائمة التحقق في هذا الموقع، ثم أدخل رقم الشهادة (مثال: PPU-2025-0001) أو امسح رمز الاستجابة السريعة (QR) المطبوع على الشهادة الرقمية. سيعرض النظام الحالة والمستوى ونتيجة التدقيق ومدة الصلاحية مباشرةً.",
      },
      "4": {
        q: "ما قيمة رسوم الاعتماد وما نظام الدفع؟",
        a: "تختلف الرسوم حسب البرنامج، من 3.5 مليون روبية للتوثيق الفردي إلى 25 مليون روبية لاعتماد المؤسسات الدولية. ويمكن الدفع على قسطين: 50% عند التسجيل و50% قبل التدريب. وتُصدَر الإيصالات الرسمية تلقائياً من النظام.",
      },
      "5": {
        q: "هل يمكن استرداد رسوم التسجيل؟",
        a: "نعم. يُمنَح استرداد كامل بنسبة 100% إذا تم الإلغاء قبل موعد التحقق من المستندات. وبعد مشاركة المتدرب في التدريب لا يتوفر الاسترداد، مع إمكانية تأجيل الموعد مرة واحدة خلال 12 شهراً القادمة دون رسوم إضافية.",
      },
      "6": {
        q: "ما المستندات التي يجب تجهيزها؟",
        a: "تشمل المستندات العامة: بطاقة الهوية/جواز السفر، البطاقة الضريبية (NPWP) للكيانات التجارية، عقد التأسيس وترخيص النشاط (SIUJK/SIUPTO لجهات PPIU/BPW)، صورة الملف التعريفي للشركة، وقائمة الكوادر الخبيرة. وتتاح القائمة الكاملة لكل برنامج في نافذة تفاصيل البرنامج ضمن قسم برامج الاعتماد.",
      },
      "7": {
        q: "هل تُعترف وزارة الشؤون الدينية باعتمادات بوساكا؟",
        a: "نعم. تعمل بوساكا ضمن الإطار التنظيمي لوزارة الشؤون الدينية الإندونيسية (Kemenag RI) فيما يتعلق بتنظيم العمرة والحج الخاص، وتنسق مع هيئة BNSP بشأن مخططات توثيق الكفاءات. كما تُعترَف شهاداتنا لدى شركاء دوليين مثل IATA.",
      },
      "8": {
        q: "كيف أصبح عضواً في مجلس خبراء بوساكا؟",
        a: "يُرشَّح أعضاء مجلس الخبراء من قبل الجمعيات المهنية أو يُدعَون مباشرةً بناءً على سجل أعمال لا يقل عن 10 سنوات في مجال العبادات أو القانون أو الطيران أو الإدارة أو المالية أو التقنية أو الصحة أو اللغة أو الخدمات اللوجستية. أرسل سيرتك الذاتية وأعمالك المنشورة إلى الأمانة عبر نموذج التواصل؛ وسيجري المجلس عملية فرز على مرحلتين.",
      },
    },
  },
};
