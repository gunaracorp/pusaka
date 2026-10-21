import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "verifySection" (Verifikasi Sertifikat)
// Milik: Task 9-b (Frontend i18n Program Agent)
// Catatan: kunci "card.*" menyiapkan label Kartu Sertifikat Digital
// (dipakai certificate-card.tsx, milik agent lain) — Diterbitkan,
// Berlaku s.d., Skor, Tier, dst. Nama lembaga/program berasal dari
// DATABASE (proper noun) — TIDAK diterjemahkan di sini.
// ============================================================

export const verifySectionDict: NamespaceDict = {
  id: {
    eyebrow: "Verifikasi Publik",
    title: "Verifikasi Sertifikat Digital",
    subtitle:
      "Setiap sertifikat PUSAKA dilengkapi tanda tangan digital & kode QR. Masukkan nomor sertifikat untuk melihat keaslian, status, dan skor audit lembaga.",
    inputTitle: "Masukkan Nomor Sertifikat",
    inputSrLabel: "Nomor sertifikat",
    placeholder: "Contoh: {code}",
    checkInProgress: "Memeriksa…",
    verifyNow: "Verifikasi Sekarang",
    examplesLabel: "Nomor contoh:",
    errorGeneric: "Gagal memverifikasi sertifikat.",
    validMessage: "Sertifikat ditemukan — status VALID",
    permalink: "Tautan permanen:",
    invalidTitle: "Sertifikat Tidak Ditemukan",
    invalidBody:
      "Nomor yang Anda masukkan tidak terdaftar pada basis data PUSAKA. Periksa kembali penulisan atau hubungi sekretariat.",
    emptyResult:
      "Hasil verifikasi akan muncul di sini dalam bentuk kartu sertifikat digital.",
    activity: {
      title: "Aktivitas Verifikasi Real-time",
      subtitle: "Diperbarui otomatis setiap 10 detik",
      latest: "Verifikasi terbaru",
      empty: "Belum ada aktivitas verifikasi terbaru.",
    },
    result: {
      valid: "VALID",
      invalid: "TIDAK VALID",
    },
    card: {
      officialTitle: "Sertifikat Digital Resmi",
      certNumber: "Nomor Sertifikat",
      issuedTo: "Diterbitkan kepada",
      orgType: "Jenis Lembaga",
      region: "Wilayah",
      program: "Program",
      score: "Skor Audit",
      issued: "Diterbitkan",
      validUntil: "Berlaku s.d.",
      tier: "Tier",
      verifiedBy: "Diverifikasi oleh PUSAKA",
      download: "Unduh Sertifikat",
    },
  },
  en: {
    eyebrow: "Public Verification",
    title: "Digital Certificate Verification",
    subtitle:
      "Every PUSAKA certificate carries a digital signature & QR code. Enter the certificate number to view its authenticity, status, and the institution's audit score.",
    inputTitle: "Enter Certificate Number",
    inputSrLabel: "Certificate number",
    placeholder: "Example: {code}",
    checkInProgress: "Checking…",
    verifyNow: "Verify Now",
    examplesLabel: "Sample numbers:",
    errorGeneric: "Failed to verify the certificate.",
    validMessage: "Certificate found — status VALID",
    permalink: "Permanent link:",
    invalidTitle: "Certificate Not Found",
    invalidBody:
      "The number you entered is not registered in the PUSAKA database. Please check the spelling or contact the secretariat.",
    emptyResult:
      "Verification results will appear here as a digital certificate card.",
    activity: {
      title: "Real-time Verification Activity",
      subtitle: "Auto-refreshed every 10 seconds",
      latest: "Latest verifications",
      empty: "No recent verification activity yet.",
    },
    result: {
      valid: "VALID",
      invalid: "NOT FOUND",
    },
    card: {
      officialTitle: "Official Digital Certificate",
      certNumber: "Certificate Number",
      issuedTo: "Issued to",
      orgType: "Institution Type",
      region: "Region",
      program: "Program",
      score: "Audit Score",
      issued: "Issued",
      validUntil: "Valid until",
      tier: "Tier",
      verifiedBy: "Verified by PUSAKA",
      download: "Download Certificate",
    },
  },
  ar: {
    eyebrow: "التحقق العام",
    title: "التحقق من الشهادات الرقمية",
    subtitle:
      "كل شهادة من PUSAKA مزوّدة بتوقيع رقمي ورمز QR. أدخل رقم الشهادة للاطلاع على صحتها وحالتها ونتيجة تدقيق المؤسسة.",
    inputTitle: "أدخل رقم الشهادة",
    inputSrLabel: "رقم الشهادة",
    placeholder: "مثال: {code}",
    checkInProgress: "جارٍ التحقق…",
    verifyNow: "تحقق الآن",
    examplesLabel: "أرقام للتجربة:",
    errorGeneric: "فشل التحقق من الشهادة.",
    validMessage: "تم العثور على الشهادة — الحالة سارية",
    permalink: "الرابط الدائم:",
    invalidTitle: "الشهادة غير موجودة",
    invalidBody:
      "الرقم الذي أدخلته غير مسجَّل في قاعدة بيانات PUSAKA. يرجى التحقق من الكتابة أو التواصل مع الأمانة.",
    emptyResult: "ستظهر نتيجة التحقق هنا على شكل بطاقة شهادة رقمية.",
    activity: {
      title: "نشاط التحقق المباشر",
      subtitle: "يُحدَّث تلقائيًا كل 10 ثوانٍ",
      latest: "أحدث عمليات التحقق",
      empty: "لا يوجد نشاط تحقق حديث بعد.",
    },
    result: {
      valid: "سارية",
      invalid: "غير موجودة",
    },
    card: {
      officialTitle: "شهادة رقمية رسمية",
      certNumber: "رقم الشهادة",
      issuedTo: "صادرة لـ",
      orgType: "نوع المؤسسة",
      region: "المنطقة",
      program: "البرنامج",
      score: "نتيجة التدقيق",
      issued: "تاريخ الإصدار",
      validUntil: "سارية حتى",
      tier: "المستوى",
      verifiedBy: "موثَّقة من PUSAKA",
      download: "تنزيل الشهادة",
    },
  },
};
