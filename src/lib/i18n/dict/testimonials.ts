import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "testimonials" (Testimoni)
// Konsumen: src/components/pusaka/testimonials.tsx
// Item diindeks manual: testimonials.items.1.role/.city/.quote (1..5)
// Nama orang DIBIARKAN di komponen (data lokal), tidak diterjemahkan.
// ============================================================

export const testimonialsDict: NamespaceDict = {
  id: {
    eyebrow: "Testimoni",
    title: "Cerita Para Pemegang Sertifikat",
    subtitle:
      "Pengalaman nyata lembaga dan profesional yang telah terakreditasi PUSAKA.",
    ratingAria: "Rating {rating} dari 5",
    prevAria: "Testimoni sebelumnya",
    nextAria: "Testimoni berikutnya",
    goToAria: "Ke testimoni {count}",
    items: {
      "1": {
        role: "Pemegang Sertifikat PPIU",
        city: "Jakarta Selatan",
        quote:
          "Proses auditnya ketat tapi sangat profesional. Setelah terakreditasi PPIU PLATINUM, tingkat kepercayaan jemaah meningkat drastis dan pendaftaran paket naik hingga 40%. Sertifikat digitalnya juga gampang diverifikasi calon jemaah lewat QR.",
      },
      "2": {
        role: "Pendamping Haji Khusus PIHK",
        city: "Surabaya",
        quote:
          "Kurikulum dari Dewan Pakar benar-benar mendalami fiqih manasik dan penanganan jemaah lansia. Ujiannya menantang, tetapi setelah lulus saya merasa jauh lebih siap mendampingi jemaah di lapangan.",
      },
      "3": {
        role: "Direktur BPW Terakreditasi",
        city: "Bandung",
        quote:
          "Kami mengikuti alur 5 langkah tanpa kendala — verifikasi berkas hanya satu hari kerja. Asesor lapangannya paham benar industri perjalanan wisata. Laporan auditnya detail dan menjadi bahan perbaikan internal kami.",
      },
      "4": {
        role: "Owner Agen Tiket IATA",
        city: "Makassar",
        quote:
          "Sertifikasi IATA via PUSAKA membuka akses GDS Amadeus dan Sabre untuk kami. Tim pendampingan membantu menyiapkan dokumen teknis aviasi yang selama ini kami anggap rumit. Layanan kelas dunia.",
      },
      "5": {
        role: "Komisaris PPIU GOLD",
        city: "Yogyakarta",
        quote:
          "Yang paling saya hargai adalah transparansi skor audit dan tier. Perusahaan kami tahu persis indikator apa yang harus ditingkatkan untuk meraih tier PLATINUM. Sistem akreditasinya modern dan terukur.",
      },
    },
  },
  en: {
    eyebrow: "Testimonials",
    title: "Stories from Our Certificate Holders",
    subtitle:
      "Real experiences of institutions and professionals accredited by PUSAKA.",
    ratingAria: "Rated {rating} out of 5",
    prevAria: "Previous testimonial",
    nextAria: "Next testimonial",
    goToAria: "Go to testimonial {count}",
    items: {
      "1": {
        role: "PPIU Certificate Holder",
        city: "South Jakarta",
        quote:
          "The audit process was rigorous yet highly professional. After earning PPIU PLATINUM accreditation, pilgrim trust rose dramatically and package bookings grew by 40%. The digital certificate is also easy for prospective pilgrims to verify via QR.",
      },
      "2": {
        role: "PIHK Special Hajj Companion",
        city: "Surabaya",
        quote:
          "The Expert Council curriculum goes deep into manasik jurisprudence and elderly pilgrim care. The exam was challenging, but after passing I felt far more prepared to accompany pilgrims in the field.",
      },
      "3": {
        role: "Director of an Accredited BPW",
        city: "Bandung",
        quote:
          "We went through the 5-step flow without a hitch — document verification took only one working day. The field assessors truly understand the travel industry. The audit report was detailed and became input for our internal improvements.",
      },
      "4": {
        role: "Owner of an IATA Ticketing Agency",
        city: "Makassar",
        quote:
          "IATA certification through PUSAKA opened access to the Amadeus and Sabre GDS for us. The support team helped us prepare the aviation technical documents we had always considered complicated. World-class service.",
      },
      "5": {
        role: "Commissioner of a PPIU GOLD Agency",
        city: "Yogyakarta",
        quote:
          "What I value most is the transparency of audit scores and tiers. Our company knows exactly which indicators to improve in order to reach the PLATINUM tier. The accreditation system is modern and measurable.",
      },
    },
  },
  ar: {
    eyebrow: "الشهادات",
    title: "قصص حاملي الشهادات",
    subtitle: "تجارب حقيقية لمؤسسات ومهنيين حصلوا على اعتماد بوساكا.",
    ratingAria: "التقييم {rating} من 5",
    prevAria: "الشهادة السابقة",
    nextAria: "الشهادة التالية",
    goToAria: "الانتقال إلى الشهادة {count}",
    items: {
      "1": {
        role: "حامل شهادة PPIU",
        city: "جنوب جاكرتا",
        quote:
          "كانت عملية التدقيق صارمة وفي الوقت نفسه مهنية للغاية. بعد الحصول على اعتماد PPIU بلاتيني، ارتفعت ثقة المعتمرين بشكل كبير وزاد تسجيل الباقات بنسبة 40%. كما يسهل على المعتمرين المحتملين التحقق من الشهادة الرقمية عبر رمز الاستجابة السريعة.",
      },
      "2": {
        role: "مرشدة حج خاصة PIHK",
        city: "سورابايا",
        quote:
          "تنال مناهج مجلس الخبراء تعمقاً حقيقياً في فقه المناسك والتعامل مع الحجاج المسنين. كان الاختبار متطلباً، لكنني بعد النجاح شعرت بجهوزية أكبر بكثير لمرافقة الحجاج في الميدان.",
      },
      "3": {
        role: "مدير وكالة سفر معتمدة BPW",
        city: "باندونغ",
        quote:
          "أكملنا المسار المكوَّن من خمس خطوات دون أي عوائق — استغرق التحقق من المستندات يوم عمل واحداً فقط. المقيّمون الميدانيون ملمّون تماماً بصناعة السفر، وكان تقرير التدقيق مفصلاً وأصبح مدخلاً لتحسيناتنا الداخلية.",
      },
      "4": {
        role: "مالك وكالة تذاكر معتمدة IATA",
        city: "ماكاسار",
        quote:
          "فتحت شهادة IATA عبر بوساكا لنا إمكانية الوصول إلى نظامي أماديوس وسابر. وساعدنا فريق الدعم في تجهيز المستندات الفنية للطيران التي كنا نعتبرها معقدة. خدمة بمستوى عالمي.",
      },
      "5": {
        role: "مفوضة شركة PPIU ذهبي",
        city: "يوغياكارتا",
        quote:
          "أكثر ما أقدّره هو شفافية نتائج التدقيق والمستويات. تعرف شركتنا بدقة المؤشرات التي يجب تحسينها للوصول إلى المستوى البلاتيني. نظام اعتماد حديث وقابل للقياس.",
      },
    },
  },
};
