"use client";

// ============================================================
// PUSAKA CMS — Store admin (zustand)
// Mengelola sesi admin: init / login / logout + visibility CMS
// ============================================================

import { create } from "zustand";
import { apiRequest } from "@/lib/pusaka";

export interface AdminUserT {
  username: string;
  name: string;
  role: string; // SUPERADMIN | STAFF
}

interface AdminStoreState {
  user: AdminUserT | null;
  status: "loading" | "authed" | "guest";
  loginOpen: boolean;
  showAdmin: boolean;
  /** Dipanggil sekali saat app mount — cek sesi via GET /api/auth/me */
  init: () => Promise<void>;
  /** POST /api/auth/login → true jika sukses (state di-set di dalam) */
  login: (username: string, password: string) => Promise<boolean>;
  /** POST /api/auth/logout → kembali guest */
  logout: () => Promise<void>;
  setLoginOpen: (open: boolean) => void;
  setShowAdmin: (show: boolean) => void;
}

export const useAdminStore = create<AdminStoreState>()((set) => ({
  user: null,
  status: "loading",
  loginOpen: false,
  showAdmin: true,

  init: async () => {
    try {
      const data = await apiRequest<{ user: AdminUserT | null } | null>("/api/auth/me");
      const user = data?.user ?? null;
      set({ user, status: user ? "authed" : "guest" });
    } catch {
      set({ user: null, status: "guest" });
    }
  },

  login: async (username, password) => {
    try {
      const data = await apiRequest<{ user: AdminUserT }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      set({ user: data.user, status: "authed", loginOpen: false });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await apiRequest<{ loggedOut: boolean }>("/api/auth/logout", { method: "POST" });
    } catch {
      // tetap bersihkan state lokal meskipun request gagal
    }
    set({ user: null, status: "guest" });
  },

  setLoginOpen: (open) => set({ loginOpen: open }),
  setShowAdmin: (show) => set({ showAdmin: show }),
}));
