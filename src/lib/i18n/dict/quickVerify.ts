import type { NamespaceDict } from "@/lib/i18n/types";

// ============================================================
// PUSAKA — Kamus Quick Verify (label, placeholder, tombol,
// pesan sukses/error/hint). Contoh nomor sertifikat tetap.
// ============================================================

export const quickVerifyDict: NamespaceDict = {
  id: {
    ariaLabel: "Verifikasi cepat sertifikat",
    title: "Verifikasi Cepat",
    subtitle: "Cek keaslian sertifikat digital",
    inputLabel: "Nomor sertifikat",
    placeholder: "Masukkan nomor sertifikat, mis. PPU-2025-0001",
    checking: "Memeriksa…",
    button: "Verifikasi",
    tryExample: "Coba contoh:",
    errorFallback: "Gagal memverifikasi sertifikat.",
    badgeValid: "✓ VALID",
    badgeInvalid: "TIDAK VALID",
    notFound:
      "Nomor sertifikat tidak ditemukan dalam basis data PUSAKA. Hubungi sekretariat bila merasa ada kekeliruan.",
    validUntil: "Berlaku s.d. {date}",
  },
  en: {
    ariaLabel: "Quick certificate verification",
    title: "Quick Verify",
    subtitle: "Check the authenticity of a digital certificate",
    inputLabel: "Certificate number",
    placeholder: "Enter a certificate number, e.g. PPU-2025-0001",
    checking: "Checking…",
    button: "Verify",
    tryExample: "Try an example:",
    errorFallback: "Failed to verify the certificate.",
    badgeValid: "✓ VALID",
    badgeInvalid: "NOT VALID",
    notFound:
      "The certificate number was not found in the PUSAKA database. Please contact the secretariat if you believe this is a mistake.",
    validUntil: "Valid through {date}",
  },
  ar: {
    ariaLabel: "تحقق سريع من الشهادة",
    title: "تحقق سريع",
    subtitle: "تحقق من صحة الشهادة الرقمية",
    inputLabel: "رقم الشهادة",
    placeholder: "أدخل رقم الشهادة، مثال: PPU-2025-0001",
    checking: "جارٍ الفحص…",
    button: "تحقق",
    tryExample: "جرّب مثالاً:",
    errorFallback: "تعذّر التحقق من الشهادة.",
    badgeValid: "✓ سارية",
    badgeInvalid: "غير صالحة",
    notFound:
      "لم يتم العثور على رقم الشهادة في قاعدة بيانات بوساكا. يُرجى التواصل مع الأمانة العامة إذا كنت تعتقد أن هناك خطأً.",
    validUntil: "سارية حتى {date}",
  },
};
