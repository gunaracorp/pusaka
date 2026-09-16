// ============================================================
// PUSAKA CMS — Fetcher API admin (kontrak KONTRAK API CMS)
// Semua path relatif, format { ok, data } / { ok, error }
// ============================================================

import {
  apiRequest,
  type ExpertT,
  type InstitutionT,
  type NewsArticleT,
  type ProgramT,
} from "@/lib/pusaka";
import type { AdminUserT } from "@/lib/admin-store";

// ---------- TIPE DATA ADMIN ----------

export interface AdminApplicationT {
  id: string;
  trackingCode: string;
  applicantType: string; // PERUSAHAAN | INDIVIDU
  programCode: string;
  programName?: string | null;
  fullName: string;
  email: string;
  phone: string;
  institution?: string | null;
  city: string;
  message?: string | null;
  status: string;
  createdAt: string;
}

export interface AdminVerifyLogT {
  id: string;
  certNumber: string;
  result: string; // VALID | INVALID
  createdAt: string;
}

export interface AdminMessageT {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

export interface AdminStatsT {
  totals: {
    programs: number;
    institutions: number;
    experts: number;
    news: number;
    applications: number;
    applicationsPending: number;
    verificationsToday: number;
    contactMessages: number;
    contactUnread: number;
  };
  recentApplications: AdminApplicationT[];
  recentVerifications: AdminVerifyLogT[];
  monthlyApplications: { month: string; count: number }[];
}

export interface ProgramPayload {
  code: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  accreditation: string[];
  durationDays: number;
  price: number;
  seatsLeft: number;
  holderCount: number;
  passRate: number;
  accentColor: string;
  featured: boolean;
}

export interface InstitutionPayload {
  name: string;
  certNumber: string;
  type: string;
  programCode: string;
  tier: string;
  status: string;
  city: string;
  province: string;
  score: number;
  issuedAt: string;
  expiresAt: string;
  contact?: string;
  phone?: string;
}

export interface ExpertPayload {
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
}

export interface NewsPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  publishedAt?: string;
}

// ---------- META STATUS PENGAJUAN (dipakai dashboard & tabel) ----------

export const APPLICATION_STATUS_META: Record<string, { label: string; badgeClass: string }> = {
  SUBMITTED: { label: "Diajukan", badgeClass: "bg-stone-100 text-stone-700 border-stone-200" },
  REVIEW: { label: "Review", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
  VERIFIKASI: { label: "Verifikasi", badgeClass: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  ASSESSMENT: { label: "Asesmen", badgeClass: "bg-orange-100 text-orange-800 border-orange-200" },
  APPROVED: { label: "Disetujui", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export const APPLICATION_STATUSES = ["SUBMITTED", "REVIEW", "VERIFIKASI", "ASSESSMENT", "APPROVED"];

// ---------- AUTH ----------

export const getAdminMe = () =>
  apiRequest<{ user: AdminUserT | null } | null>("/api/auth/me");

// ---------- STATISTIK ADMIN ----------

export const getAdminStats = () => apiRequest<AdminStatsT>("/api/admin/stats");

// ---------- PROGRAMS ----------

export const listAdminPrograms = () => apiRequest<ProgramT[]>("/api/admin/programs");

export const createAdminProgram = (body: ProgramPayload) =>
  apiRequest<ProgramT>("/api/admin/programs", { method: "POST", body: JSON.stringify(body) });

export const updateAdminProgram = (id: string, body: ProgramPayload) =>
  apiRequest<ProgramT>(`/api/admin/programs/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteAdminProgram = (id: string) =>
  apiRequest<{ deleted: boolean }>(`/api/admin/programs/${id}`, { method: "DELETE" });

// ---------- INSTITUTIONS ----------

export const listAdminInstitutions = () =>
  apiRequest<InstitutionT[]>("/api/admin/institutions");

export const createAdminInstitution = (body: InstitutionPayload) =>
  apiRequest<InstitutionT>("/api/admin/institutions", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateAdminInstitution = (id: string, body: InstitutionPayload) =>
  apiRequest<InstitutionT>(`/api/admin/institutions/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteAdminInstitution = (id: string) =>
  apiRequest<{ deleted: boolean }>(`/api/admin/institutions/${id}`, { method: "DELETE" });

// ---------- EXPERTS ----------

export const listAdminExperts = () => apiRequest<ExpertT[]>("/api/admin/experts");

export const createAdminExpert = (body: ExpertPayload) =>
  apiRequest<ExpertT>("/api/admin/experts", { method: "POST", body: JSON.stringify(body) });

export const updateAdminExpert = (id: string, body: ExpertPayload) =>
  apiRequest<ExpertT>(`/api/admin/experts/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteAdminExpert = (id: string) =>
  apiRequest<{ deleted: boolean }>(`/api/admin/experts/${id}`, { method: "DELETE" });

// ---------- NEWS ----------

export const listAdminNews = () => apiRequest<NewsArticleT[]>("/api/admin/news");

export const createAdminNews = (body: NewsPayload) =>
  apiRequest<NewsArticleT>("/api/admin/news", { method: "POST", body: JSON.stringify(body) });

export const updateAdminNews = (id: string, body: NewsPayload) =>
  apiRequest<NewsArticleT>(`/api/admin/news/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteAdminNews = (id: string) =>
  apiRequest<{ deleted: boolean }>(`/api/admin/news/${id}`, { method: "DELETE" });

// ---------- APPLICATIONS ----------

export const listAdminApplications = () =>
  apiRequest<AdminApplicationT[]>("/api/admin/applications");

export const updateAdminApplicationStatus = (id: string, status: string) =>
  apiRequest<AdminApplicationT>(`/api/admin/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteAdminApplication = (id: string) =>
  apiRequest<{ deleted: boolean }>(`/api/admin/applications/${id}`, { method: "DELETE" });

// ---------- MESSAGES ----------

export const listAdminMessages = () => apiRequest<AdminMessageT[]>("/api/admin/messages");

export const updateAdminMessage = (id: string, handled: boolean) =>
  apiRequest<AdminMessageT>(`/api/admin/messages/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ handled }),
  });

export const deleteAdminMessage = (id: string) =>
  apiRequest<{ deleted: boolean }>(`/api/admin/messages/${id}`, { method: "DELETE" });

// ---------- VERIFY LOGS (read-only) ----------

/** GET /api/admin/verify-logs — toleran bentuk: array langsung ATAU { logs, total }. */
export async function listAdminVerifyLogs(): Promise<AdminVerifyLogT[]> {
  const raw = await apiRequest<unknown>("/api/admin/verify-logs");
  if (Array.isArray(raw)) return raw as AdminVerifyLogT[];
  if (raw && typeof raw === "object" && Array.isArray((raw as { logs?: unknown }).logs)) {
    return (raw as { logs: AdminVerifyLogT[] }).logs;
  }
  return [];
}
