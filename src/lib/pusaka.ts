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

export type VerifyData =
  | { valid: true; institution: InstitutionT; program: { code: string; name: string } | null }
  | { valid: false };

export interface ApplicationResp {
  trackingCode: string;
  status: string;
}

export interface TrackResp {
  trackingCode: string;
  programCode: string;
  status: string;
  fullName: string;
  createdAt: string;
  statusHistory: { label: string; at: string | null; done: boolean }[];
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

export const FALLBACK_STATS: StatsT = {
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
