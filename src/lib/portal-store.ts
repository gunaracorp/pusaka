"use client";

// ============================================================
// PUSAKA CMS — Store Portal Anggota Lembaga (zustand)
// Sesi pemegang sertifikat via /api/portal/* (cookie pusaka_member_session)
// ============================================================

import { create } from "zustand";
import { apiRequest, type InstitutionT } from "@/lib/pusaka";

export interface PortalAccountT {
  id: string;
  email: string;
  name: string;
  position: string | null;
  createdAt: string;
}

interface PortalStoreState {
  account: PortalAccountT | null;
  institution: InstitutionT | null;
  status: "loading" | "authed" | "guest";
  /** Dipanggil saat komponen portal mount — cek sesi via GET /api/portal/me */
  init: () => Promise<void>;
  /** POST /api/portal/login → true jika sukses */
  login: (email: string, password: string) => Promise<boolean>;
  /** POST /api/portal/logout → kembali guest */
  logout: () => Promise<void>;
}

export const usePortalStore = create<PortalStoreState>()((set) => ({
  account: null,
  institution: null,
  status: "loading",

  init: async () => {
    try {
      const data = await apiRequest<{
        account: PortalAccountT;
        institution: InstitutionT;
      } | null>("/api/portal/me");
      if (data?.account && data.institution) {
        set({ account: data.account, institution: data.institution, status: "authed" });
      } else {
        set({ account: null, institution: null, status: "guest" });
      }
    } catch {
      set({ account: null, institution: null, status: "guest" });
    }
  },

  login: async (email, password) => {
    try {
      const data = await apiRequest<{
        account: PortalAccountT;
        institution: InstitutionT;
      }>("/api/portal/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      set({ account: data.account, institution: data.institution, status: "authed" });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await apiRequest<{ loggedOut: boolean }>("/api/portal/logout", { method: "POST" });
    } catch {
      // tetap bersihkan state lokal meskipun request gagal
    }
    set({ account: null, institution: null, status: "guest" });
  },
}));
