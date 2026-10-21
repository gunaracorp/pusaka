import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus namespace "track" (TrackSection)
// Key dipakai sebagai t("track.<path>") di track.tsx
// Catatan: label timeline (statusHistory[].label) berasal dari
// server dan sengaja TIDAK diterjemahkan di sini.
// ============================================================

export const trackDict: NamespaceDict = {
  id: {
    eyebrow: "Lacak Status",
    title: "Lacak Pendaftaran Anda",
    subtitle:
      "Masukkan kode pelacakan yang Anda terima setelah mendaftar untuk melihat progres verifikasi berkas hingga terbit sertifikat.",
    cardTitle: "Kode Pelacakan",
    srInput: "Kode pelacakan",
    placeholder: "PSK-2025-XXXXX",
    button: "Lacak Status",
    searching: "Mencari…",
    example: "Contoh:",
    emptyCodeToast: "Masukkan kode pelacakan terlebih dahulu.",
    notFoundTitle: "Kode Tidak Ditemukan",
    notFoundDesc:
      "Pastikan penulisan kode sesuai (format PSK-2025-XXXXX). Bila lupa, hubungi sekretariat dengan menyertakan email pendaftaran.",
    registeredAt: "Didaftarkan {date}",
    applicantLine: "{name} — program {code}",
    currentBadge: "Sedang Diproses",
    done: "Selesai",
    waitingPrev: "Menunggu tahap sebelumnya",
    paidBox: "Biaya pendaftaran telah LUNAS. Terima kasih telah menyelesaikan pembayaran.",
    unpaidBox:
      "Biaya pendaftaran belum dibayar. Selesaikan pembayaran agar proses verifikasi berkas dapat dilanjutkan.",
    amountDue: "Total tagihan: {amount}",
    payButton: "Selesaikan Pembayaran",
    payInvoice: "No. Invoice",
    payProvider: "Metode",
    payTotal: "Total",
    payDate: "Dibayar",
    payRef: "No. Referensi",
  },
  en: {
    eyebrow: "Track Status",
    title: "Track Your Application",
    subtitle:
      "Enter the tracking code you received after registering to follow the verification progress until your certificate is issued.",
    cardTitle: "Tracking Code",
    srInput: "Tracking code",
    placeholder: "PSK-2025-XXXXX",
    button: "Track Status",
    searching: "Searching…",
    example: "Example:",
    emptyCodeToast: "Please enter your tracking code first.",
    notFoundTitle: "Code Not Found",
    notFoundDesc:
      "Make sure the code is written correctly (PSK-2025-XXXXX format). If you forgot it, contact the secretariat with the email used at registration.",
    registeredAt: "Registered {date}",
    applicantLine: "{name} — program {code}",
    currentBadge: "In Progress",
    done: "Completed",
    waitingPrev: "Awaiting previous stage",
    paidBox: "The registration fee has been PAID. Thank you for completing your payment.",
    unpaidBox:
      "The registration fee has not been paid yet. Complete the payment so the document verification can continue.",
    amountDue: "Total due: {amount}",
    payButton: "Complete Payment",
    payInvoice: "Invoice No.",
    payProvider: "Method",
    payTotal: "Total",
    payDate: "Paid on",
    payRef: "Reference No.",
  },
  ar: {
    eyebrow: "تتبّع الحالة",
    title: "تتبّع حالة تسجيلك",
    subtitle:
      "أدخل رمز التتبّع الذي استلمته بعد التسجيل للاطّلاع على مراحل التحقق من المستندات حتى إصدار الشهادة.",
    cardTitle: "رمز التتبّع",
    srInput: "رمز التتبّع",
    placeholder: "PSK-2025-XXXXX",
    button: "تتبّع الحالة",
    searching: "جارٍ البحث…",
    example: "مثال:",
    emptyCodeToast: "يرجى إدخال رمز التتبّع أولاً.",
    notFoundTitle: "الرمز غير موجود",
    notFoundDesc:
      "تأكّد من كتابة الرمز بشكل صحيح (بصيغة PSK-2025-XXXXX). إذا نسيته، فيرجى التواصل مع الأمانة العامة مع ذكر البريد الإلكتروني المستخدم في التسجيل.",
    registeredAt: "تم التسجيل في {date}",
    applicantLine: "{name} — برنامج {code}",
    currentBadge: "قيد المعالجة",
    done: "مكتمل",
    waitingPrev: "بانتظار المرحلة السابقة",
    paidBox: "تم سداد رسوم التسجيل بالكامل. شكرًا لإتمام الدفع.",
    unpaidBox:
      "لم تُسدَّد رسوم التسجيل بعد. يُرجى إتمام الدفع كي تستمر عملية التحقق من المستندات.",
    amountDue: "إجمالي المستحق: {amount}",
    payButton: "إتمام الدفع",
    payInvoice: "رقم الفاتورة",
    payProvider: "الطريقة",
    payTotal: "الإجمالي",
    payDate: "تاريخ الدفع",
    payRef: "الرقم المرجعي",
  },
};
