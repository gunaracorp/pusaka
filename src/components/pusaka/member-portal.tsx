"use client";

// ============================================================
// PUSAKA — Portal Anggota Lembaga (dialog, Task 9-f)
// - Dibuka dari Navbar via CustomEvent "pusaka:open-portal".
// - Guest: form login (demo account siap isi otomatis).
// - Authed: header institusi + 4 tab (Sertifikat / Pengajuan /
//   Pembayaran / Profil).
// - Invoice MENUNGGU → tombol "Bayar Sekarang" mengirim event
//   "pusaka:autofill-track" { detail: trackingCode } lalu menutup
//   dialog; TrackSection (halaman lacak) mengisi & melacak otomatis.
// ============================================================

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Award,
  BadgeCheck,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileStack,
  Gauge,
  Inbox,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  ReceiptText,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/provider";
import { usePortalStore } from "@/lib/portal-store";
import {
  PROGRAM_LABELS,
  STATUS_META,
  TIER_META,
  TYPE_META,
  portalChangePassword,
  portalMe,
  type PaymentT,
  type PortalApplicationT,
} from "@/lib/pusaka";
import { cn } from "@/lib/utils";

// ---------- Pola anti-hydration (sama dengan theme-toggle) ----------
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// ---------- Akun demo portal ----------
const DEMO_EMAIL = "finance@zahratour.co.id";
const DEMO_PASSWORD = "pusaka123";

// ---------- Pemetaan status → kunci i18n & warna ----------
const INSTITUTION_STATUS_I18N: Record<string, string> = {
  AKTIF: "common.status.active",
  DIPERBARUI: "common.status.updated",
  KADALUARSA: "common.status.expired",
};

const COMMON_TIER_I18N: Record<string, string> = {
  PLATINUM: "common.tiers.PLATINUM",
  GOLD: "common.tiers.GOLD",
  SILVER: "common.tiers.SILVER",
};

const APPLICATION_STATUS_I18N: Record<string, string> = {
  SUBMITTED: "portal.status.SUBMITTED",
  REVIEW: "portal.status.REVIEW",
  VERIFIKASI: "portal.status.VERIFIKASI",
  ASSESSMENT: "portal.status.ASSESSMENT",
  APPROVED: "portal.status.APPROVED",
};

const APPLICATION_STATUS_BADGE: Record<string, string> = {
  SUBMITTED: "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  REVIEW: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  VERIFIKASI: "border-teal-600/30 bg-teal-500/10 text-teal-800 dark:text-teal-300",
  ASSESSMENT: "border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  APPROVED: "border-emerald-600/40 bg-emerald-600/15 text-emerald-800 dark:text-emerald-300",
};

const APPLICATION_PAYMENT_STATE_I18N: Record<string, string> = {
  BELUM_BAYAR: "common.status.unpaid",
  MENUNGGU: "common.status.waiting",
  LUNAS: "common.status.paid",
};

const APPLICATION_PAYMENT_STATE_BADGE: Record<string, string> = {
  BELUM_BAYAR:
    "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  MENUNGGU:
    "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  LUNAS:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const PAYMENT_STATUS_I18N: Record<string, string> = {
  MENUNGGU: "portal.payStatus.MENUNGGU",
  BERHASIL: "portal.payStatus.BERHASIL",
  GAGAL: "portal.payStatus.GAGAL",
  KADALUARSA: "portal.payStatus.KADALUARSA",
};

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  MENUNGGU: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  BERHASIL: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  GAGAL: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
  KADALUARSA: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
};

// Scrollbar halus untuk area scroll (dialog + daftar panjang)
const SCROLLBAR_CLASS =
  "[scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-600/25 [&::-webkit-scrollbar-thumb:hover]:bg-emerald-600/45 dark:[&::-webkit-scrollbar-thumb]:bg-emerald-400/20 dark:[&::-webkit-scrollbar-thumb:hover]:bg-emerald-400/40";

/** Ambil label dari peta i18n; fallback ke nilai mentah (data, bukan UI copy). */
function labelFor(
  map: Record<string, string>,
  key: string,
  t: (path: string) => string
): string {
  const path = map[key];
  return path ? t(path) : key;
}

// ---------- Komponen kecil presentasional ----------
function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
      </span>
      <p className="max-w-xs text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

// ============================================================
// Komponen utama — render <MemberPortal /> sekali di page.tsx
// ============================================================
export function MemberPortal() {
  const { t, formatCurrency, formatDate } = useI18n();
  const account = usePortalStore((s) => s.account);
  const institution = usePortalStore((s) => s.institution);
  const status = usePortalStore((s) => s.status);
  const init = usePortalStore((s) => s.init);
  const login = usePortalStore((s) => s.login);
  const logout = usePortalStore((s) => s.logout);

  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState<PortalApplicationT[]>([]);
  const [payments, setPayments] = useState<PaymentT[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Form login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form ganti password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Guard mount (pola useSyncExternalStore — bebas set-state-in-effect)
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  // Reset error form ganti password saat dialog dibuka ulang
  // (pola "adjust state during render" dari admin-login-dialog)
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setPwError(null);
  }

  const authed = mounted && status === "authed" && account !== null && institution !== null;

  // MOUNT: init sesi + dengarkan event "pusaka:open-portal" dari navbar
  useEffect(() => {
    void init();
    const onOpenPortal = () => setOpen(true);
    window.addEventListener("pusaka:open-portal", onOpenPortal);
    return () => window.removeEventListener("pusaka:open-portal", onOpenPortal);
  }, [init]);

  // DATA: refetch portalMe setiap dialog terbuka / status berubah authed
  // (setState hanya di dalam .then/.finally — pola sama dengan news.tsx)
  useEffect(() => {
    if (!open || status !== "authed") return;
    let alive = true;
    portalMe()
      .then((data) => {
        if (!alive) return;
        if (data) {
          setApplications(data.applications);
          setPayments(data.payments);
        }
      })
      .catch(() => {
        // diam — data lama / empty state tetap tampil
      })
      .finally(() => {
        if (alive) setDataLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [open, status]);

  const handleLogin = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);
      const ok = await login(email, password);
      if (ok) {
        setPassword("");
        setShowPassword(false);
        toast.success(t("portal.login.success"));
      } else {
        toast.error(t("portal.login.error"));
      }
      setSubmitting(false);
    },
    [email, password, login, submitting, t]
  );

  const fillDemo = useCallback(() => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }, []);

  const handleCopy = useCallback(
    (value: string) => {
      const fail = () => toast.error(t("portal.misc.copyError"));
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard
          .writeText(value)
          .then(() => toast.success(t("common.actions.copied")))
          .catch(fail);
      } else {
        fail();
      }
    },
    [t]
  );

  // "Verifikasi & Unduh": tutup dialog + arahkan ke anchor #verifikasi
  const handleVerifyClick = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => {
      window.location.hash = "#verifikasi";
    }, 250);
  }, []);

  // Invoice MENUNGGU → kirim kode ke halaman lacak (TrackSection autofill)
  const handlePayNow = useCallback((trackingCode: string) => {
    window.dispatchEvent(
      new CustomEvent("pusaka:autofill-track", { detail: trackingCode })
    );
    setOpen(false);
    toast.info(t("portal.pay.redirectTrack"));
  }, [t]);

  const handleLogout = useCallback(async () => {
    await logout();
    setApplications([]);
    setPayments([]);
    setDataLoaded(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwError(null);
    toast.success(t("portal.profile.logoutSuccess"));
  }, [logout, t]);

  const handleChangePassword = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (savingPassword) return;
      if (!currentPassword) {
        setPwError(t("portal.profile.emptyCurrent"));
        return;
      }
      if (newPassword.length < 8) {
        setPwError(t("portal.profile.minChars"));
        return;
      }
      if (newPassword !== confirmPassword) {
        setPwError(t("portal.profile.mismatch"));
        return;
      }
      setPwError(null);
      setSavingPassword(true);
      try {
        await portalChangePassword({ currentPassword, newPassword });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success(t("portal.profile.success"));
      } catch {
        toast.error(t("portal.profile.error"));
      } finally {
        setSavingPassword(false);
      }
    },
    [confirmPassword, currentPassword, newPassword, savingPassword, t]
  );

  // ---------- Ringkasan pembayaran ----------
  const totalPaid = payments
    .filter((p) => p.status === "BERHASIL")
    .reduce((sum, p) => sum + p.total, 0);
  const activeDue = payments
    .filter((p) => p.status === "MENUNGGU")
    .reduce((sum, p) => sum + p.total, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={`w-[min(94vw,760px)] max-h-[85vh] gap-5 overflow-y-auto ${SCROLLBAR_CLASS}`}
      >
        {!authed || !account || !institution ? (
          // ================= VIEW GUEST / LOADING =================
          <>
            <DialogHeader className="items-center text-center">
              <div
                className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-amber-500 text-white shadow-md shadow-emerald-900/20"
                aria-hidden
              >
                <UserRound className="h-7 w-7" />
              </div>
              <DialogTitle className="text-center font-display text-xl">
                {t("portal.login.title")}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t("portal.login.subtitle")}
              </DialogDescription>
            </DialogHeader>

            {mounted && status === "loading" ? (
              <div className="flex flex-col items-center gap-3 py-10" role="status" aria-live="polite">
                <Loader2
                  className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                <p className="text-sm text-muted-foreground">{t("common.actions.loading")}</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="portal-email">{t("portal.login.emailLabel")}</Label>
                    <Input
                      id="portal-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={t("portal.login.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portal-password">{t("portal.login.passwordLabel")}</Label>
                    <div className="relative">
                      <Input
                        id="portal-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        disabled={submitting}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:text-emerald-300"
                        aria-label={
                          showPassword
                            ? t("portal.login.hidePassword")
                            : t("portal.login.showPassword")
                        }
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-11 w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        {t("portal.login.submitting")}
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" aria-hidden />
                        {t("portal.login.submit")}
                      </>
                    )}
                  </Button>
                </form>

                {/* Hint akun demo */}
                <div className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 p-3">
                  <div className="flex items-start gap-2">
                    <KeyRound
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                        {t("portal.login.demoHint")}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                        <code className="min-w-0 break-all font-mono text-[11px] text-amber-900 dark:text-amber-100">
                          {DEMO_EMAIL} / {DEMO_PASSWORD}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 shrink-0 gap-1.5 px-2 text-xs text-amber-700 hover:bg-amber-500/20 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                          onClick={fillDemo}
                          aria-label={`${t("portal.login.useAccount")} ${DEMO_EMAIL}`}
                        >
                          {t("portal.login.useAccount")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          // ================= VIEW AUTHED =================
          <>
            {/* Header institusi */}
            <div className="rounded-xl border border-emerald-600/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 p-4 dark:border-emerald-500/30">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-lg font-black text-white shadow-sm"
                    aria-hidden
                  >
                    {institution.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <DialogTitle className="font-display text-lg font-bold leading-tight text-foreground">
                      {institution.name}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      {t("portal.login.title")}
                    </DialogDescription>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {institution.certNumber}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      TYPE_META[institution.type]?.badgeClass ??
                        "border-border bg-muted text-foreground"
                    )}
                  >
                    {institution.type}
                  </Badge>
                  <Badge variant="outline" className={TIER_META[institution.tier]?.badgeClass}>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        TIER_META[institution.tier]?.dotClass ?? "bg-muted-foreground"
                      )}
                      aria-hidden
                    />
                    {labelFor(COMMON_TIER_I18N, institution.tier, t)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={STATUS_META[institution.status]?.badgeClass}
                  >
                    {labelFor(INSTITUTION_STATUS_I18N, institution.status, t)}
                  </Badge>
                  <span
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-300"
                    aria-label={t("portal.cert.auditScore")}
                    title={t("portal.cert.auditScore")}
                  >
                    <Gauge className="h-3 w-3" aria-hidden />
                    {institution.score} / 100
                  </span>
                </div>
              </div>
            </div>

            {!dataLoaded ? (
              <p className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
                <Loader2
                  className="h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                {t("common.actions.loading")}
              </p>
            ) : null}

            {/* 4 Tab utama */}
            <Tabs defaultValue="certificate" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-4 p-1">
                <TabsTrigger
                  value="certificate"
                  className="gap-1.5 px-1 py-1.5 text-xs sm:text-sm"
                >
                  <Award className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{t("portal.tabs.certificate")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="gap-1.5 px-1 py-1.5 text-xs sm:text-sm"
                >
                  <FileStack className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{t("portal.tabs.applications")}</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="gap-1.5 px-1 py-1.5 text-xs sm:text-sm">
                  <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{t("portal.tabs.payments")}</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-1.5 px-1 py-1.5 text-xs sm:text-sm">
                  <UserRound className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{t("portal.tabs.profile")}</span>
                </TabsTrigger>
              </TabsList>

              {/* ---- Tab 1: SERTIFIKAT ---- */}
              <TabsContent value="certificate" className="mt-3">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BadgeCheck
                        className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                      {t("portal.cert.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 p-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t("portal.cert.number")}
                        </p>
                        <p className="truncate font-mono text-base font-bold text-emerald-800 dark:text-emerald-300">
                          {institution.certNumber}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleCopy(institution.certNumber)}
                        aria-label={t("portal.cert.copyNumber")}
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      </Button>
                    </div>

                    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                      <InfoRow label={t("portal.cert.program")}>
                        {PROGRAM_LABELS[institution.programCode] ?? institution.programCode}
                      </InfoRow>
                      <InfoRow label={t("portal.cert.type")}>{institution.type}</InfoRow>
                      <InfoRow label={t("portal.cert.tier")}>
                        {labelFor(COMMON_TIER_I18N, institution.tier, t)}
                      </InfoRow>
                      <InfoRow label={t("portal.cert.issued")}>
                        {formatDate(institution.issuedAt)}
                      </InfoRow>
                      <InfoRow label={t("portal.cert.validUntil")}>
                        <span className="inline-flex flex-wrap items-center gap-2">
                          {formatDate(institution.expiresAt)}
                          <Badge
                            variant="outline"
                            className={STATUS_META[institution.status]?.badgeClass}
                          >
                            {labelFor(INSTITUTION_STATUS_I18N, institution.status, t)}
                          </Badge>
                        </span>
                      </InfoRow>
                      <InfoRow label={t("portal.cert.auditScore")}>
                        {institution.score} / 100
                      </InfoRow>
                    </dl>

                    <div className="flex justify-end border-t pt-4">
                      <Button
                        asChild
                        className="h-11 w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
                      >
                        <a
                          href="#verifikasi"
                          onClick={handleVerifyClick}
                          aria-label={t("portal.cert.verifyDownload")}
                        >
                          <ShieldCheck className="h-4 w-4" aria-hidden />
                          {t("portal.cert.verifyDownload")}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- Tab 2: PENGAJUAN ---- */}
              <TabsContent value="applications" className="mt-3">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileStack
                        className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                      {t("portal.apps.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {applications.length === 0 ? (
                      <EmptyState icon={Inbox} text={t("portal.apps.empty")} />
                    ) : (
                      <ul className={`max-h-72 space-y-2 overflow-y-auto pr-1 ${SCROLLBAR_CLASS}`}>
                        {applications.map((app) => (
                          <li
                            key={app.id}
                            className="rounded-lg border bg-muted/40 p-3 transition-colors hover:border-emerald-600/30 dark:hover:border-emerald-500/30"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                              <div className="min-w-0">
                                <p className="truncate font-mono text-sm font-bold text-emerald-800 dark:text-emerald-300">
                                  {app.trackingCode}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {PROGRAM_LABELS[app.programCode] ?? app.programCode}
                                  {" · "}
                                  {t("portal.apps.registeredAt")} {formatDate(app.createdAt)}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    APPLICATION_STATUS_BADGE[app.status] ??
                                      "border-border bg-muted text-foreground"
                                  )}
                                >
                                  {labelFor(APPLICATION_STATUS_I18N, app.status, t)}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    APPLICATION_PAYMENT_STATE_BADGE[app.paymentStatus] ??
                                      "border-border bg-muted text-foreground"
                                  )}
                                >
                                  {labelFor(
                                    APPLICATION_PAYMENT_STATE_I18N,
                                    app.paymentStatus,
                                    t
                                  )}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleCopy(app.trackingCode)}
                                  aria-label={`${t("portal.apps.copyTracking")} ${app.trackingCode}`}
                                >
                                  <Copy className="h-3 w-3" aria-hidden />
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- Tab 3: PEMBAYARAN ---- */}
              <TabsContent value="payments" className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-emerald-600/20 bg-emerald-500/10 p-3 dark:border-emerald-500/30">
                    <p className="text-xs text-muted-foreground">{t("portal.pay.summaryPaid")}</p>
                    <p className="mt-0.5 font-display text-base font-bold text-emerald-800 dark:text-emerald-300">
                      {formatCurrency(totalPaid)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
                    <p className="text-xs text-muted-foreground">{t("portal.pay.summaryDue")}</p>
                    <p className="mt-0.5 font-display text-base font-bold text-amber-700 dark:text-amber-300">
                      {formatCurrency(activeDue)}
                    </p>
                  </div>
                </div>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ReceiptText
                        className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                      {t("portal.pay.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <EmptyState icon={ReceiptText} text={t("portal.pay.empty")} />
                    ) : (
                      <ul className={`max-h-72 space-y-2 overflow-y-auto pr-1 ${SCROLLBAR_CLASS}`}>
                        {payments.map((payment) => (
                          <li
                            key={payment.id}
                            className="rounded-lg border bg-muted/40 p-3 transition-colors hover:border-emerald-600/30 dark:hover:border-emerald-500/30"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <p className="truncate font-mono text-sm font-bold text-foreground">
                                    {payment.invoiceNo}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(payment.invoiceNo)}
                                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:hover:text-emerald-300"
                                    aria-label={`${t("portal.pay.copyInvoice")} ${payment.invoiceNo}`}
                                  >
                                    <Copy className="h-3.5 w-3.5" aria-hidden />
                                  </button>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {payment.provider}
                                  {" · "}
                                  {payment.methodId}
                                  {" · "}
                                  {formatDate(payment.createdAt)}
                                </p>
                                {payment.status === "MENUNGGU" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 h-8 gap-1.5 border-amber-500/50 text-amber-700 hover:bg-amber-500/15 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
                                    onClick={() => handlePayNow(payment.trackingCode)}
                                    aria-label={`${t("portal.pay.payNow")} ${payment.invoiceNo}`}
                                  >
                                    <CreditCard className="h-3.5 w-3.5" aria-hidden />
                                    {t("portal.pay.payNow")}
                                  </Button>
                                ) : null}
                              </div>
                              <div className="flex flex-col items-start gap-1 sm:items-end">
                                <span className="text-sm font-bold text-foreground">
                                  {formatCurrency(payment.total)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    PAYMENT_STATUS_BADGE[payment.status] ??
                                      PAYMENT_STATUS_BADGE.KADALUARSA,
                                    payment.status === "MENUNGGU" && "animate-pulse-amber"
                                  )}
                                >
                                  {labelFor(PAYMENT_STATUS_I18N, payment.status, t)}
                                </Badge>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ---- Tab 4: PROFIL ---- */}
              <TabsContent value="profile" className="mt-3">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <UserRound
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        {t("portal.profile.title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <InfoRow label={t("portal.profile.name")}>{account.name}</InfoRow>
                        <InfoRow label={t("portal.profile.position")}>
                          {account.position ?? "-"}
                        </InfoRow>
                        <InfoRow label={t("portal.profile.email")}>{account.email}</InfoRow>
                        <InfoRow label={t("portal.profile.memberSince")}>
                          {formatDate(account.createdAt)}
                        </InfoRow>
                      </dl>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <KeyRound
                          className="h-5 w-5 text-amber-600 dark:text-amber-400"
                          aria-hidden
                        />
                        {t("portal.profile.changePassword")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleChangePassword} className="space-y-3" noValidate>
                        <div className="space-y-1.5">
                          <Label htmlFor="portal-current-password">
                            {t("portal.profile.currentPassword")}
                          </Label>
                          <Input
                            id="portal-current-password"
                            name="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={savingPassword}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="portal-new-password">
                            {t("portal.profile.newPassword")}
                          </Label>
                          <Input
                            id="portal-new-password"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={savingPassword}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="portal-confirm-password">
                            {t("portal.profile.confirmPassword")}
                          </Label>
                          <Input
                            id="portal-confirm-password"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={savingPassword}
                            required
                          />
                        </div>

                        {pwError ? (
                          <p
                            role="alert"
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-700 dark:text-red-300"
                          >
                            {pwError}
                          </p>
                        ) : null}

                        <Button
                          type="submit"
                          disabled={savingPassword}
                          className="h-10 w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
                        >
                          {savingPassword ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                              {t("portal.profile.submitting")}
                            </>
                          ) : (
                            <>
                              <KeyRound className="h-4 w-4" aria-hidden />
                              {t("portal.profile.submit")}
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 flex justify-center border-t pt-4 sm:justify-end">
                  <Button
                    variant="outline"
                    className="h-10 gap-2 border-red-500/40 text-red-700 hover:bg-red-500/10 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                    onClick={() => void handleLogout()}
                    aria-label={t("portal.profile.logoutAria")}
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    {t("portal.profile.logout")}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
