"use client";

// ============================================================
// PUSAKA — Section Tutorial Hub (Pusat Panduan & Tutorial)
// 4 jalur panduan interaktif via Tabs shadcn: Verifikasi,
// Pendaftaran & Pembayaran, Pelacakan Status, Portal Anggota & Admin.
// Chip kode demo dapat diklik → copy clipboard + toast sonner.
// Milik: Task 11-a (Frontend Catalog Agent).
// ============================================================

import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  Copy,
  CreditCard,
  Lightbulb,
  Route,
  Shield,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";

// ---------- konstanta data (bukan terjemahan) ----------

type TabKey = "verify" | "register" | "track" | "portal";

const TAB_META: { key: TabKey; icon: LucideIcon }[] = [
  { key: "verify", icon: ShieldCheck },
  { key: "register", icon: CreditCard },
  { key: "track", icon: Route },
  { key: "portal", icon: UserRound },
];

const VERIFY_STEPS = ["s1", "s2", "s3", "s4"] as const;
const REGISTER_STEPS = ["s1", "s2", "s3", "s4"] as const;
const TRACK_STEPS = ["s1", "s2", "s3"] as const;
const PORTAL_STEPS = ["s1", "s2", "s3"] as const;

const DEMO_CERTS = ["PPU-2025-0001", "BPW-2025-0102", "IAT-2025-0201"];
const TRACK_FORMAT = "PSK-YYYY-XXXXX";
const DEMO_TRACK_CODE = "PSK-2025-83012";
const TRACK_STAGES = ["SUBMITTED", "REVIEW", "VERIFIKASI", "ASSESSMENT", "APPROVED"];
const PAYMENT_CHANNELS = ["QRIS", "Virtual Account"];
const DEMO_MEMBER = { user: "finance@zahratour.co.id", pass: "pusaka123" };
const DEMO_ADMIN = { user: "admin", pass: "Pusaka2026!" };

// ---------- sub-komponen ----------

/** Chip mono yang bisa diklik → salin ke clipboard + toast. */
function CopyChip({ value }: { value: string }) {
  const { t } = useI18n();
  const copy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(value)
        .then(() => toast.success(t("common.actions.copied")))
        .catch(() => toast.error(t("tutorial.copyError")));
    } else {
      toast.error(t("tutorial.copyError"));
    }
  };
  return (
    <button
      type="button"
      dir="ltr"
      onClick={copy}
      title={t("tutorial.copyHint")}
      aria-label={t("tutorial.copyAria", { value })}
      className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:border-emerald-500/30 dark:text-emerald-300"
    >
      {value}
      <Copy className="h-3 w-3 opacity-60" aria-hidden />
    </button>
  );
}

/** Daftar langkah bernomor dengan lingkaran emerald. */
function StepList({ ns, steps }: { ns: TabKey; steps: readonly string[] }) {
  const { t } = useI18n();
  return (
    <ol className="space-y-5">
      {steps.map((k, i) => (
        <li key={k} className="flex gap-3.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-display text-sm font-black text-white shadow-sm"
            aria-hidden
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <h4 className="font-display text-base font-bold text-foreground">
              {t(`tutorial.${ns}.steps.${k}.title`)}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(`tutorial.${ns}.steps.${k}.desc`)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Kartu tips amber (AlertCircle/Lightbulb). */
function TipsCard({ ns }: { ns: TabKey }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
        <Lightbulb className="h-4 w-4 shrink-0" aria-hidden />
        {t(`tutorial.${ns}.tipsTitle`)}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80">
        {t(`tutorial.${ns}.tips`)}
      </p>
    </div>
  );
}

/** Kartu demo + CTA kolom samping. */
function SidePanel({
  ns,
  ctaHref,
  children,
}: {
  ns: TabKey;
  ctaHref: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <TipsCard ns={ns} />
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-sm font-bold text-foreground">{t(`tutorial.${ns}.demoTitle`)}</p>
        <div className="mt-2.5">{children}</div>
      </div>
      <Button
        asChild
        className="mt-auto h-11 bg-emerald-700 text-base font-bold hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
      >
        <a href={ctaHref} aria-label={t(`tutorial.${ns}.ctaAria`)}>
          {t(`tutorial.${ns}.cta`)}
          <ArrowRight className="rtl:rotate-180" aria-hidden />
        </a>
      </Button>
    </div>
  );
}

/** Baris info kecil (label → chip) untuk kartu demo portal. */
function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <CopyChip value={value} />
    </div>
  );
}

// ---------- section utama ----------

export function TutorialHub() {
  const { t } = useI18n();

  return (
    <section id="tutorial" className="scroll-mt-28 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("tutorial.eyebrow")}
          title={t("tutorial.title")}
          subtitle={t("tutorial.subtitle")}
        />

        <FadeIn delay={0.1} className="mt-10">
          <Tabs defaultValue="verify">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 lg:grid-cols-4">
              {TAB_META.map(({ key, icon: Icon }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="h-auto gap-1.5 px-2 py-2 text-xs data-[state=active]:bg-emerald-700 data-[state=active]:text-white sm:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{t(`tutorial.tabs.${key}`)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ---- Tab 1: Verifikasi Sertifikat ---- */}
            <TabsContent value="verify" className="mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                  <StepList ns="verify" steps={VERIFY_STEPS} />
                  <SidePanel ns="verify" ctaHref="#verifikasi">
                    <div className="flex flex-wrap gap-2">
                      {DEMO_CERTS.map((c) => (
                        <CopyChip key={c} value={c} />
                      ))}
                    </div>
                  </SidePanel>
                </div>
              </div>
            </TabsContent>

            {/* ---- Tab 2: Pendaftaran & Pembayaran ---- */}
            <TabsContent value="register" className="mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                  <StepList ns="register" steps={REGISTER_STEPS} />
                  <SidePanel ns="register" ctaHref="#pendaftaran">
                    <div className="flex flex-wrap items-center gap-2">
                      <CopyChip value={TRACK_FORMAT} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {PAYMENT_CHANNELS.map((ch) => (
                        <span
                          key={ch}
                          dir="ltr"
                          className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </SidePanel>
                </div>
              </div>
            </TabsContent>

            {/* ---- Tab 3: Pelacakan Status ---- */}
            <TabsContent value="track" className="mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                  <StepList ns="track" steps={TRACK_STEPS} />
                  <SidePanel ns="track" ctaHref="#lacak">
                    <div className="flex flex-wrap gap-2">
                      <CopyChip value={DEMO_TRACK_CODE} />
                    </div>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t("tutorial.track.stagesTitle")}
                    </p>
                    <div
                      dir="ltr"
                      className="mt-1.5 flex flex-wrap items-center gap-x-1 gap-y-1.5 font-mono text-[11px] font-semibold text-emerald-800 dark:text-emerald-300"
                    >
                      {TRACK_STAGES.map((stage, i) => (
                        <span key={stage} className="flex items-center gap-1">
                          {i > 0 ? (
                            <ChevronRight
                              className="h-3 w-3 text-muted-foreground rtl:rotate-180"
                              aria-hidden
                            />
                          ) : null}
                          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5">{stage}</span>
                        </span>
                      ))}
                    </div>
                  </SidePanel>
                </div>
              </div>
            </TabsContent>

            {/* ---- Tab 4: Portal Anggota & Admin ---- */}
            <TabsContent value="portal" className="mt-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                  <StepList ns="portal" steps={PORTAL_STEPS} />
                  <SidePanel ns="portal" ctaHref="#verifikasi">
                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-background p-3">
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          <UserRound className="h-3.5 w-3.5" aria-hidden />
                          {t("tutorial.portal.memberLabel")}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          <DemoRow label={t("tutorial.portal.userLabel")} value={DEMO_MEMBER.user} />
                          <DemoRow label={t("tutorial.portal.passLabel")} value={DEMO_MEMBER.pass} />
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-background p-3">
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                          <Shield className="h-3.5 w-3.5" aria-hidden />
                          {t("tutorial.portal.adminLabel")}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          <DemoRow label={t("tutorial.portal.userLabel")} value={DEMO_ADMIN.user} />
                          <DemoRow label={t("tutorial.portal.passLabel")} value={DEMO_ADMIN.pass} />
                        </div>
                      </div>
                    </div>
                  </SidePanel>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </section>
  );
}
