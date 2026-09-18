// ============================================================
// PUSAKA — lib inti frontend
// Tipe, konstanta, formatter id-ID, dan fetcher kontrak API
// ============================================================

// ---------- TIPE DATA (sesuai kontrak API) ----------

export type ProgramCategory = "PERUSAHAAN" | "PROFESI" | "IZIN";

export interface ProgramT {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: ProgramCategory | string;
  tagline: string;
  description: string;
  requirements: string; // JSON string array
  benefits: string; // JSON string array
  durationDays: number;
  price: number;
  seatsLeft: number;
  holderCount: number;
  passRate: number;
  accreditation: string; // JSON string array
  /** JSON string array {flag, country, detail} — cakupan negara program (kontrak baru). */
  countries: string | null;
  accentColor: string;
  featured: boolean;
  createdAt: string;
}

export interface InstitutionT {
  id: string;
  name: string;
  type: "PPIU" | "PIHK" | "BPW" | "IATA" | string;
  city: string;
  province: string;
  certNumber: string;
  programCode: string;
  status: "AKTIF" | "DIPERBARUI" | "KADALUARSA" | string;
  tier: "SILVER" | "GOLD" | "PLATINUM" | string;
  score: number;
  issuedAt: string;
  expiresAt: string;
  contact?: string | null;
  phone?: string | null;
  createdAt: string;
}

export interface ExpertT {
  id: string;
  name: string;
  field: string;
  expertise: string;
  category: string;
  licenseNo: string;
  experienceYears: number;
  organization: string;
  education: string;
  initials: string;
  featured: boolean;
  createdAt: string;
}

export interface NewsArticleT {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  publishedAt: string;
}

export interface StatsT {
  globalCountries: number;
  globalPartners: number;
  totals: {
    certificateHolders: number;
    institutions: number;
    experts: number;
    programs: number;
    verificationsToday: number;
    applicationsThisMonth: number;
  };
  programDistribution: { code: string; holders: number }[];
  tierDistribution: { tier: string; count: number }[];
  recentActivity: { certNumber: string; result: string; at: string }[];
  topProvinces: { province: string; count: number }[];
}

export interface ProgramCountryDetail {
  flag: string;
  country: string;
  detail: string;
}

export interface GlobalNodeT {
  id: string;
  kind: "KANTOR_PERWAKILAN" | "MITRA_INTERNASIONAL" | string;
  country: string;
  /** ISO-2, boleh duplikat (Arab Saudi 2 node). */
  countryCode: string;
  region:
    | "TIMUR_TENGAH"
    | "ASIA_TENGGARA"
    | "ASIA_SELATAN"
    | "ASIA_TIMUR"
    | "EROPA"
    | "AFRIKA"
    | "AMERIKA"
    | "OSEANIA"
    | string;
  city: string;
  /** emoji bendera */
  flag: string;
  title: string;
  orgName: string;
  description: string;
  /** JSON string array kode program — parse dengan safeParseJsonArray */
  scope: string;
  status: "AKTIF" | "MOU" | "APLIKASI" | string;
  /** tahun */
  since: string;
  contact: string | null;
  order: number;
}

export interface GlobalResp {
  nodes: GlobalNodeT[];
  summary: {
    totalCountries: number;
    totalNodes: number;
    offices: number;
    partners: number;
    regionCounts: { region: string; count: number }[];
  };
}

export type VerifyData =
  | { valid: true; institution: InstitutionT; program: { code: string; name: string } | null }
  | { valid: false };

export interface ApplicationResp {
  trackingCode: string;
  status: string;
}

export interface TrackLatestPaymentT {
  id: string;
  invoiceNo: string;
  method: string;
  methodId: string;
  provider: string;
  total: number;
  status: string;
  reference: string | null;
  paidAt: string | null;
  expiredAt: string;
}

export interface TrackResp {
  trackingCode: string;
  programCode: string;
  status: string;
  fullName: string;
  createdAt: string;
  statusHistory: { label: string; at: string | null; done: boolean }[];
  /** Status pembayaran: BELUM_BAYAR | MENUNGGU | LUNAS */
  paymentStatus: string;
  /** Nominal biaya program (IDR). */
  amountDue: number;
  /** Invoice terbaru untuk pengajuan ini (jika pernah dibuat). */
  latestPayment: TrackLatestPaymentT | null;
}

export interface ApplicationBody {
  applicantType: "PERUSAHAAN" | "INDIVIDU";
  programCode: string;
  fullName: string;
  email: string;
  phone: string;
  institution?: string;
  city: string;
  message?: string;
}

export interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ---------- KONSTANTA ----------

export const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#program", label: "Program" },
  { href: "#jaringan-global", label: "Jaringan" },
  { href: "#verifikasi", label: "Verifikasi" },
  { href: "#direktori", label: "Direktori" },
  { href: "#dewan-pakar", label: "Dewan Pakar" },
  { href: "#pendaftaran", label: "Pendaftaran" },
  { href: "#berita", label: "Berita" },
] as const;

export const BIDANG_KEILMUAN_COUNT = 9;

export const EXAMPLE_CERT_NUMBERS = ["PPU-2025-0001", "BPW-2025-0102", "IAT-2025-0201"];
export const EXAMPLE_TRACK_CODE = "PSK-2025-83012";

export const TYPE_META: Record<string, { label: string; desc: string; badgeClass: string }> = {
  PPIU: {
    label: "PPIU",
    desc: "Penyelenggara Umrah",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  BPW: {
    label: "BPW",
    desc: "Biro Perjalanan Wisata",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  IATA: {
    label: "IATA",
    desc: "Agen Tiket Internasional",
    badgeClass: "bg-teal-100 text-teal-800 border-teal-200",
  },
  PIHK: {
    label: "PIHK",
    desc: "Pendamping Haji Khusus",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
  },
};

export const TIER_META: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  PLATINUM: {
    label: "PLATINUM",
    badgeClass:
      "border border-amber-400/60 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 text-amber-800",
    dotClass: "bg-amber-400",
  },
  GOLD: {
    label: "GOLD",
    badgeClass: "border border-amber-300 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  SILVER: {
    label: "SILVER",
    badgeClass: "border border-stone-300 bg-stone-100 text-stone-600",
    dotClass: "bg-stone-400",
  },
};

export const STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  AKTIF: { label: "AKTIF", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  DIPERBARUI: { label: "DIPERBARUI", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
  KADALUARSA: { label: "KADALUARSA", badgeClass: "bg-red-100 text-red-700 border-red-200" },
};

export const CATEGORY_LABEL: Record<string, string> = {
  PERUSAHAAN: "Perusahaan",
  PROFESI: "Profesi",
  IZIN: "Izin Resmi",
};

export const NEWS_CATEGORY_META: Record<string, string> = {
  PENGUMUMAN: "bg-emerald-100 text-emerald-800",
  REGULASI: "bg-amber-100 text-amber-800",
  KEGIATAN: "bg-teal-100 text-teal-800",
  KEMITRAAN: "bg-orange-100 text-orange-800",
};

export const GLOBAL_REGION_LABEL: Record<string, string> = {
  TIMUR_TENGAH: "Timur Tengah",
  ASIA_TENGGARA: "Asia Tenggara",
  ASIA_SELATAN: "Asia Selatan",
  ASIA_TIMUR: "Asia Timur",
  EROPA: "Eropa",
  AFRIKA: "Afrika",
  AMERIKA: "Amerika",
  OSEANIA: "Oseania",
};

export const GLOBAL_REGION_ORDER = [
  "TIMUR_TENGAH",
  "ASIA_TENGGARA",
  "ASIA_SELATAN",
  "ASIA_TIMUR",
  "EROPA",
  "AFRIKA",
  "AMERIKA",
  "OSEANIA",
];

export const GLOBAL_KIND_LABEL: Record<string, string> = {
  KANTOR_PERWAKILAN: "Kantor Perwakilan",
  MITRA_INTERNASIONAL: "Mitra Internasional",
};

export const GLOBAL_STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  AKTIF: { label: "Aktif Beroperasi", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  MOU: { label: "MoU Ditandatangani", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
  APLIKASI: { label: "Dalam Proses", badgeClass: "bg-stone-100 text-stone-600 border-stone-200" },
};

export const PROGRAM_LABELS: Record<string, string> = {
  PIHK: "Pendamping Haji Khusus",
  PPIU: "Perusahaan Perjalanan Umrah",
  BPW: "Biro Perjalanan Wisata",
  IATA: "Sertifikasi IATA",
  "IJIN-UMRAH": "Izin Umrah",
  "IJIN-HAJI": "Izin Haji",
  "BPW-PRO": "BPW Profesional",
};

export const FALLBACK_STATS: StatsT = {
  globalCountries: 32,
  globalPartners: 26,
  totals: {
    certificateHolders: 14840,
    institutions: 24,
    experts: 46,
    programs: 7,
    verificationsToday: 0,
    applicationsThisMonth: 0,
  },
  programDistribution: [
    { code: "PPIU", holders: 6841 },
    { code: "BPW", holders: 3210 },
    { code: "IATA", holders: 2045 },
    { code: "PIHK", holders: 1874 },
    { code: "BPW-PRO", holders: 412 },
    { code: "IJIN-UMRAH", holders: 310 },
    { code: "IJIN-HAJI", holders: 148 },
  ],
  tierDistribution: [
    { tier: "PLATINUM", count: 5 },
    { tier: "GOLD", count: 9 },
    { tier: "SILVER", count: 10 },
  ],
  recentActivity: [],
  topProvinces: [],
};

// ---------- HELPER FORMAT id-ID ----------

const nfID = new Intl.NumberFormat("id-ID");

export function formatNumber(n: number): string {
  return nfID.format(n);
}

export function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateShortFmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | Date): string {
  return dateFmt.format(new Date(value));
}

export function formatDateShort(value: string | Date): string {
  return dateShortFmt.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFmt.format(new Date(value));
}

/** Waktu relatif sederhana dalam Bahasa Indonesia. */
export function timeAgo(value: string | Date): string {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "-";
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  return `${months} bulan lalu`;
}

/** Parse kolom JSON-string (requirements, benefits, accreditation) dengan aman. */
export function safeParseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

/** Parse kolom JSON-string cakupan negara program ({flag,country,detail}[]) dengan aman. */
export function safeParseCountryList(raw: string | null | undefined): ProgramCountryDetail[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ProgramCountryDetail =>
        !!x &&
        typeof x === "object" &&
        typeof (x as ProgramCountryDetail).country === "string"
    );
  } catch {
    return [];
  }
}

/** Pola QR 5x5 deterministik dari string (untuk dekorasi sertifikat digital). */
export function qrPattern(seed: string): boolean[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const bits: boolean[] = [];
  for (let i = 0; i < 25; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    bits.push((h & 1) === 1);
  }
  // paksa corner squares ala QR finder
  bits[0] = bits[4] = bits[20] = bits[24] = true;
  bits[2] = bits[10] = bits[14] = bits[22] = false;
  return bits;
}

// ---------- FETCHER KONTRAK API (relative path) ----------

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  const json = (await res.json().catch(() => null)) as
    | { ok: true; data: T }
    | { ok: false; error?: string }
    | null;
  if (!res.ok || !json || json.ok !== true) {
    const message =
      json && json.ok === false && "error" in json && json.error
        ? json.error
        : `Terjadi kesalahan pada server (kode ${res.status}).`;
    throw new Error(message);
  }
  return json.data;
}

// 1. GET /api/stats
export const getStats = () => apiRequest<StatsT>("/api/stats");

// 2. GET /api/programs
export const getPrograms = () => apiRequest<ProgramT[]>("/api/programs");

// 3. POST /api/verify
export const postVerify = (certNumber: string) =>
  apiRequest<VerifyData>("/api/verify", {
    method: "POST",
    body: JSON.stringify({ certNumber }),
  });

// 4. GET /api/directory
export function getDirectory(params: {
  q?: string;
  type?: string;
  tier?: string;
}): Promise<InstitutionT[]> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.type && params.type !== "SEMUA") qs.set("type", params.type);
  if (params.tier && params.tier !== "SEMUA") qs.set("tier", params.tier);
  const query = qs.toString();
  return apiRequest<InstitutionT[]>(`/api/directory${query ? `?${query}` : ""}`);
}

// 5. GET /api/experts
export const getExperts = () => apiRequest<ExpertT[]>("/api/experts");

// 6. GET /api/news
export const getNews = () => apiRequest<NewsArticleT[]>("/api/news");

// 7. POST /api/applications
export const postApplication = (body: ApplicationBody) =>
  apiRequest<ApplicationResp>("/api/applications", {
    method: "POST",
    body: JSON.stringify(body),
  });

// 8. GET /api/applications?code=
export const getApplication = (code: string) =>
  apiRequest<TrackResp>(`/api/applications?code=${encodeURIComponent(code.trim())}`);

// 9. POST /api/contact
export const postContact = (body: ContactBody) =>
  apiRequest<{ received: boolean }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });

// 10. GET /api/global
export const getGlobal = () => apiRequest<GlobalResp>("/api/global");

// 11. POST /api/newsletter
export interface NewsletterResult {
  subscribed: boolean;
  already?: boolean;
}

export const subscribeNewsletter = (email: string) =>
  apiRequest<NewsletterResult>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

// ============================================================
// 12. PAYMENT GATEWAY — /api/payments/*
// ============================================================

export type PaymentMethodTypeT = "QRIS" | "VIRTUAL_ACCOUNT" | "E_WALLET" | "CREDIT_CARD";

export interface PaymentMethodT {
  id: string;
  label: string;
  provider: string;
  type: PaymentMethodTypeT;
  fee: number;
  note: string;
}

export type PaymentStatusT = "MENUNGGU" | "BERHASIL" | "GAGAL" | "KADALUARSA";

export interface PaymentT {
  id: string;
  invoiceNo: string;
  trackingCode: string;
  programCode: string;
  method: PaymentMethodTypeT;
  methodId: string;
  provider: string;
  amount: number;
  fee: number;
  total: number;
  status: PaymentStatusT;
  vaNumber: string | null;
  qrPayload: string | null;
  reference: string | null;
  paidAt: string | null;
  expiredAt: string;
  createdAt: string;
}

/** GET /api/payments/methods — daftar channel pembayaran. */
export const getPaymentMethods = () =>
  apiRequest<PaymentMethodT[]>("/api/payments/methods");

/** POST /api/payments — buat invoice pembayaran untuk kode pelacakan. */
export const createPayment = (body: { trackingCode: string; methodId: string }) =>
  apiRequest<PaymentT>("/api/payments", {
    method: "POST",
    body: JSON.stringify(body),
  });

/** POST /api/payments/:id/settle — simulasi pembayaran (mode demo). */
export const settlePayment = (id: string) =>
  apiRequest<PaymentT>(`/api/payments/${id}/settle`, { method: "POST" });

/** GET /api/payments?trackingCode= — daftar invoice untuk satu pengajuan. */
export const listPayments = (trackingCode: string) =>
  apiRequest<PaymentT[]>(`/api/payments?trackingCode=${encodeURIComponent(trackingCode)}`);

// ============================================================
// 13. PORTAL ANGGOTA LEMBAGA — /api/portal/*
// ============================================================

export interface PortalApplicationT {
  id: string;
  trackingCode: string;
  programCode: string;
  fullName: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface PortalMeData {
  account: {
    id: string;
    email: string;
    name: string;
    position: string | null;
    createdAt: string;
  };
  institution: InstitutionT;
  applications: PortalApplicationT[];
  payments: PaymentT[];
}

/** POST /api/portal/login — login pemegang sertifikat. */
export const portalLogin = (body: { email: string; password: string }) =>
  apiRequest<{ account: PortalMeData["account"]; institution: InstitutionT }>(
    "/api/portal/login",
    { method: "POST", body: JSON.stringify(body) }
  );

/** POST /api/portal/logout. */
export const portalLogout = () =>
  apiRequest<{ loggedOut: boolean }>("/api/portal/logout", { method: "POST" });

/** GET /api/portal/me — data lengkap sesi anggota. */
export const portalMe = () => apiRequest<PortalMeData | null>("/api/portal/me");

/** POST /api/portal/change-password. */
export const portalChangePassword = (body: {
  currentPassword: string;
  newPassword: string;
}) =>
  apiRequest<{ changed: boolean }>("/api/portal/change-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
