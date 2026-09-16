"use client";

// ============================================================
// PUSAKA CMS — Shell dashboard admin (sidebar + topbar + konten)
// ============================================================

import { useState } from "react";
import {
  Award,
  Building2,
  Eye,
  FileStack,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  ScanSearch,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAdminStore } from "@/lib/admin-store";
import { toast } from "sonner";
import { AdminDashboardHome } from "@/components/pusaka/admin/admin-dashboard-home";
import { AdminApplications } from "@/components/pusaka/admin/admin-applications";
import { AdminPrograms } from "@/components/pusaka/admin/admin-programs";
import { AdminInstitutions } from "@/components/pusaka/admin/admin-institutions";
import { AdminExperts } from "@/components/pusaka/admin/admin-experts";
import { AdminNews } from "@/components/pusaka/admin/admin-news";
import { AdminMessages } from "@/components/pusaka/admin/admin-messages";
import { AdminVerifyLogs } from "@/components/pusaka/admin/admin-verify-logs";

type MenuKey =
  | "dashboard"
  | "applications"
  | "programs"
  | "institutions"
  | "experts"
  | "news"
  | "messages"
  | "verify-logs";

interface MenuItem {
  key: MenuKey;
  label: string;
  icon: LucideIcon;
}

const MENU: MenuItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "applications", label: "Pengajuan", icon: FileStack },
  { key: "programs", label: "Program", icon: Award },
  { key: "institutions", label: "Institusi", icon: Building2 },
  { key: "experts", label: "Dewan Pakar", icon: Users },
  { key: "news", label: "Berita", icon: Newspaper },
  { key: "messages", label: "Pesan", icon: Mail },
  { key: "verify-logs", label: "Log Verifikasi", icon: ScanSearch },
];

function MenuList({
  active,
  onSelect,
}: {
  active: MenuKey;
  onSelect: (key: MenuKey) => void;
}) {
  return (
    <nav aria-label="Menu admin" className="flex flex-col gap-1">
      {MENU.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-r-lg border-l-2 px-4 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isActive
                ? "border-l-amber-400 bg-emerald-800/50 text-white"
                : "border-l-transparent text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function AdminBrand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-xl font-black text-white">
        P
      </span>
      <div className="leading-none">
        <p className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-white">
          PUSAKA
          <span className="rounded border border-amber-400/60 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-400">
            CMS
          </span>
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-emerald-400">
          Panel Manajemen
        </p>
      </div>
    </div>
  );
}

function renderSection(key: MenuKey) {
  switch (key) {
    case "dashboard":
      return <AdminDashboardHome />;
    case "applications":
      return <AdminApplications />;
    case "programs":
      return <AdminPrograms />;
    case "institutions":
      return <AdminInstitutions />;
    case "experts":
      return <AdminExperts />;
    case "news":
      return <AdminNews />;
    case "messages":
      return <AdminMessages />;
    case "verify-logs":
      return <AdminVerifyLogs />;
  }
}

export function AdminDashboard() {
  const user = useAdminStore((s) => s.user);
  const logout = useAdminStore((s) => s.logout);
  const setShowAdmin = useAdminStore((s) => s.setShowAdmin);
  const [active, setActive] = useState<MenuKey>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = MENU.find((m) => m.key === active) ?? MENU[0];
  const initial = (user?.name || user?.username || "A").charAt(0).toUpperCase();
  const roleLabel =
    user?.role === "SUPERADMIN" ? "Superadmin" : user?.role === "STAFF" ? "Staf" : user?.role ?? "";

  async function handleLogout() {
    await logout();
    toast.success("Anda telah keluar", { description: "Sesi admin PUSAKA diakhiri." });
  }

  return (
    <div className="fixed inset-0 z-[60] flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-emerald-950 md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-emerald-900 px-5">
          <AdminBrand />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <MenuList active={active} onSelect={setActive} />
        </div>
        <div className="shrink-0 border-t border-emerald-900 px-5 py-4">
          <p className="flex items-center gap-2 text-[11px] text-emerald-300/60">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden />
            Sesi aman • HMAC cookie
          </p>
        </div>
      </aside>

      {/* Kolom utama */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-stone-200 bg-background px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Hamburger mobile */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 md:hidden"
                  aria-label="Buka menu admin"
                >
                  <Menu className="h-5 w-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-emerald-900 bg-emerald-950 p-0">
                <SheetHeader className="border-b border-emerald-900 pb-4">
                  <SheetTitle className="text-left text-white">
                    <AdminBrand />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-[calc(100vh-8rem)] flex-col justify-between pb-safe">
                  <div className="overflow-y-auto p-3">
                    <MenuList
                      active={active}
                      onSelect={(key) => {
                        setActive(key);
                        setMobileOpen(false);
                      }}
                    />
                  </div>
                  <div className="border-t border-emerald-900 px-5 py-4">
                    <p className="flex items-center gap-2 text-[11px] text-emerald-300/60">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden />
                      Sesi aman • HMAC cookie
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-bold text-stone-900 sm:text-lg">
                {activeItem.label}
              </h1>
              <p className="hidden text-xs text-stone-500 sm:block">
                Panel Admin PUSAKA — Sertifikasi &amp; Akreditasi
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900"
              onClick={() => setShowAdmin(false)}
            >
              <Eye className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Lihat Situs</span>
              <span className="sm:hidden">Situs</span>
            </Button>

            <div className="flex items-center gap-2 rounded-lg border border-stone-200 py-1.5 pl-1.5 pr-2 sm:pl-2 sm:pr-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-amber-500 text-sm font-bold text-white"
                aria-hidden
              >
                {initial}
              </span>
              <span className="hidden flex-col leading-tight lg:flex">
                <span className="max-w-36 truncate text-xs font-bold text-stone-800">
                  {user?.name ?? "Admin"}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                  {roleLabel}
                </span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-stone-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Keluar dari panel admin"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </header>

        {/* Konten */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto w-full max-w-6xl">{renderSection(active)}</div>
        </main>
      </div>
    </div>
  );
}
