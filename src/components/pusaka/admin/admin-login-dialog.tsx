"use client";

// ============================================================
// PUSAKA CMS — Dialog login admin
// ============================================================

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, LogIn, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/lib/admin-store";
import { toast } from "sonner";

const DEMO_ACCOUNTS = [
  { label: "Superadmin", username: "admin", password: "Pusaka2026!" },
  { label: "Staf", username: "editor", password: "Editor2026!" },
];

export function AdminLoginDialog() {
  const open = useAdminStore((s) => s.loginOpen);
  const setOpen = useAdminStore((s) => s.setLoginOpen);
  const login = useAdminStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset error saat dialog dibuka ulang (pola "adjust state during render")
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("User ID dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setError(null);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      setPassword("");
      toast.success("Berhasil masuk", {
        description: "Selamat datang di Panel Admin PUSAKA.",
      });
    } else {
      setError("User ID atau password salah. Silakan periksa kembali dan coba lagi.");
    }
  }

  function fillDemo(acc: (typeof DEMO_ACCOUNTS)[number]) {
    setUsername(acc.username);
    setPassword(acc.password);
    setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-amber-500 text-white shadow-md shadow-emerald-900/20">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <DialogTitle className="text-center font-display text-xl">Panel Admin PUSAKA</DialogTitle>
          <DialogDescription className="text-center">
            Masuk untuk mengelola program, institusi, pengajuan, dan konten situs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="admin-username">User ID</Label>
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                aria-hidden
              />
              <Input
                id="admin-username"
                name="username"
                autoComplete="username"
                placeholder="cth. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <KeyRound
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                aria-hidden
              />
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-100 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>

          {error ? (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Memproses…
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" aria-hidden />
                Masuk
              </>
            )}
          </Button>
        </form>

        {/* Hint kredensial demo — klik untuk isi otomatis */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Kredensial demo — klik untuk isi otomatis
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => fillDemo(acc)}
                className="rounded-md border border-emerald-300 bg-white px-3 py-2 text-left transition-colors hover:border-emerald-500 hover:bg-emerald-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <span className="block text-xs font-bold text-emerald-800">{acc.label}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-stone-600">
                  {acc.username} / {acc.password}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
