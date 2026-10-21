// ============================================================
// PUSAKA — Definisi channel payment gateway (shared backend & frontend)
// Sandbox: pembayaran disimulasikan (endpoint settle mode demo)
// ============================================================

export type PaymentMethodType =
  | "QRIS"
  | "VIRTUAL_ACCOUNT"
  | "E_WALLET"
  | "CREDIT_CARD";

export interface PaymentMethodDef {
  id: string;
  label: string;
  provider: string;
  type: PaymentMethodType;
  /** Biaya layanan channel flat (IDR). Untuk CC dihitung persentase di server. */
  fee: number;
  /** Catatan singkat untuk UI. */
  note: string;
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    id: "QRIS",
    label: "QRIS",
    provider: "QRIS",
    type: "QRIS",
    fee: 2500,
    note: "Pindai sekali, bayar dari semua e-wallet & m-banking",
  },
  {
    id: "VA-BCA",
    label: "Virtual Account BCA",
    provider: "BCA",
    type: "VIRTUAL_ACCOUNT",
    fee: 4000,
    note: "Transfer via ATM / m-BCA / KlikBCA",
  },
  {
    id: "VA-MANDIRI",
    label: "Virtual Account Mandiri",
    provider: "Mandiri",
    type: "VIRTUAL_ACCOUNT",
    fee: 4000,
    note: "Transfer via Livin' by Mandiri / ATM",
  },
  {
    id: "VA-BNI",
    label: "Virtual Account BNI",
    provider: "BNI",
    type: "VIRTUAL_ACCOUNT",
    fee: 4000,
    note: "Transfer via BNI Mobile Banking / ATM",
  },
  {
    id: "VA-BRI",
    label: "Virtual Account BRI",
    provider: "BRI",
    type: "VIRTUAL_ACCOUNT",
    fee: 4000,
    note: "Transfer via BRImo / ATM BRI",
  },
  {
    id: "EWALLET-GOPAY",
    label: "GoPay",
    provider: "GoPay",
    type: "E_WALLET",
    fee: 2500,
    note: "Bayar langsung dari aplikasi Gojek",
  },
  {
    id: "EWALLET-OVO",
    label: "OVO",
    provider: "OVO",
    type: "E_WALLET",
    fee: 2500,
    note: "Bayar dari aplikasi OVO",
  },
  {
    id: "EWALLET-DANA",
    label: "DANA",
    provider: "DANA",
    type: "E_WALLET",
    fee: 2500,
    note: "Bayar dari aplikasi DANA",
  },
  {
    id: "CC",
    label: "Kartu Kredit / Debit",
    provider: "Kartu Kredit",
    type: "CREDIT_CARD",
    fee: -1, // dihitung: 2,9% + Rp2.000 (diresolve server)
    note: "Visa, Mastercard, JCB — 3D Secure",
  },
];

/** Prefix nomor virtual account per provider (dekoratif, mode demo). */
export const VA_PREFIX: Record<string, string> = {
  BCA: "88080",
  Mandiri: "89503",
  BNI: "9881",
  BRI: "88770",
};

/** Resolve biaya layanan channel (CC pakai 2,9% + Rp2.000). */
export function resolveMethodFee(method: PaymentMethodDef, amount: number): number {
  if (method.type === "CREDIT_CARD") {
    return Math.round(amount * 0.029) + 2000;
  }
  return Math.max(0, method.fee);
}

/** Generate nomor virtual account dekoratif untuk mode demo. */
export function generateVaNumber(provider: string): string {
  const prefix = VA_PREFIX[provider] ?? "88080";
  const digits = 15 - prefix.length;
  let rand = "";
  for (let i = 0; i < digits; i++) {
    rand += Math.floor(Math.random() * 10).toString();
  }
  return prefix + rand;
}

/** Generate payload string QRIS dekoratif (di-encode menjadi QR sungguhan di client). */
export function generateQrPayload(invoiceNo: string, total: number): string {
  return `PUSAKA-QRIS|INV:${invoiceNo}|AMT:${total}|MID:ID1024PUSAKA2026|CRC:04A1`;
}

/** Generate nomor invoice: INV-YYYYMMDD-XXXXXX. */
export function generateInvoiceNo(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${y}${m}${d}-${rand}`;
}

/** Nomor referensi pembayaran (mode demo). */
export function generatePaymentReference(): string {
  return `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}
