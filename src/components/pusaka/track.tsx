"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileSearch,
  Gavel,
  Loader2,
  SearchX,
  Send,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { PaymentPanel } from "@/components/pusaka/payment-panel";
import { useI18n } from "@/lib/i18n/provider";
import { EXAMPLE_TRACK_CODE, getApplication, type TrackResp } from "@/lib/pusaka";
import { toast } from "sonner";

const STEP_ICONS = [Send, ClipboardList, FileSearch, Gavel, CheckCircle2];

export function TrackSection() {
  const { t, formatCurrency, formatDate, formatDateTime } = useI18n();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackResp | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showPay, setShowPay] = useState(false);

  const track = useCallback(
    async (input: string) => {
      const trackingCode = input.trim();
      if (!trackingCode) {
        toast.error(t("track.emptyCodeToast"));
        return;
      }
      setCode(trackingCode);
      setLoading(true);
      setNotFound(false);
      setData(null);
      setShowPay(false);
      try {
        const res = await getApplication(trackingCode);
        setData(res);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  // Event lintas-agent: MemberPortal (9-f) mengirim "pusaka:autofill-track"
  // {detail: trackingCode} → isi kode + lacak otomatis + scroll ke #lacak
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.trim()) {
        document
          .getElementById("lacak")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        void track(detail);
      }
    };
    window.addEventListener("pusaka:autofill-track", handler);
    return () => window.removeEventListener("pusaka:autofill-track", handler);
  }, [track]);

  return (
    <section id="lacak" className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("track.eyebrow")}
          title={t("track.title")}
          subtitle={t("track.subtitle")}
        />

        <FadeIn delay={0.1} className="mt-8">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("track.cardTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  void track(code);
                }}
              >
                <label htmlFor="track-input" className="sr-only">
                  {t("track.srInput")}
                </label>
                <Input
                  id="track-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("track.placeholder")}
                  className="h-12 flex-1 font-mono uppercase"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 min-w-36 bg-emerald-700 hover:bg-emerald-800"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      {t("track.searching")}
                    </>
                  ) : (
                    <>
                      <FileSearch className="h-4 w-4" aria-hidden />
                      {t("track.button")}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{t("track.example")}</span>
                <button
                  type="button"
                  onClick={() => void track(EXAMPLE_TRACK_CODE)}
                  className="min-h-8 rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] text-emerald-700 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 dark:text-emerald-300"
                >
                  {EXAMPLE_TRACK_CODE}
                </button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <Card className="border-border">
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-1/3" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-1/4" />
                        <Skeleton className="h-3 w-1/5" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ) : notFound ? (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <Card className="border-dashed border-red-500/30 bg-red-500/10">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                  <SearchX className="h-10 w-10 text-red-400" aria-hidden />
                  <p className="font-display text-lg font-bold text-red-700 dark:text-red-300">
                    {t("track.notFoundTitle")}
                  </p>
                  <p className="max-w-sm text-sm text-red-600/80 dark:text-red-300/80">
                    {t("track.notFoundDesc")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : data ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              <Card className="border-emerald-600/30 shadow-md shadow-emerald-900/5 dark:border-emerald-500/30">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="font-mono text-xl font-black text-emerald-800 dark:text-emerald-300">
                        {data.trackingCode}
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("track.applicantLine", { name: data.fullName, code: data.programCode })}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("track.registeredAt", { date: formatDate(data.createdAt) })}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ol className="relative space-y-0 border-l-2 border-border pl-6">
                    {data.statusHistory.map((h, idx) => {
                      const Icon = STEP_ICONS[idx] ?? CheckCircle2;
                      const current =
                        !h.done && idx > 0 && (data.statusHistory[idx - 1]?.done ?? false);
                      return (
                        <li key={h.label} className="relative pb-7 last:pb-0">
                          <span
                            className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                              h.done
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : current
                                  ? "animate-pulse-amber border-amber-500 bg-amber-500 text-white"
                                  : "border-border bg-card text-muted-foreground/50"
                            }`}
                          >
                            {h.done ? (
                              <Check className="h-4 w-4" aria-hidden />
                            ) : (
                              <Icon className="h-4 w-4" aria-hidden />
                            )}
                          </span>
                          <div className="pt-1">
                            <p
                              className={`text-sm font-bold ${
                                h.done
                                  ? "text-emerald-800 dark:text-emerald-300"
                                  : current
                                    ? "text-amber-700 dark:text-amber-300"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {h.label}
                              {current ? (
                                <span className="ms-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                                  {t("track.currentBadge")}
                                </span>
                              ) : null}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {h.at
                                ? formatDate(h.at)
                                : h.done
                                  ? t("track.done")
                                  : t("track.waitingPrev")}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  {/* ---------- BOX PEMBAYARAN ---------- */}
                  {data.paymentStatus === "LUNAS" ? (
                    <div
                      role="status"
                      className="mt-8 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4 dark:border-emerald-500/30"
                    >
                      <div className="flex items-start gap-3">
                        <BadgeCheck
                          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                            {t("track.paidBox")}
                          </p>
                          {data.latestPayment ? (
                            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
                              <div className="flex justify-between gap-3 sm:block">
                                <dt className="text-muted-foreground">{t("track.payInvoice")}</dt>
                                <dd className="font-mono font-semibold text-foreground">
                                  {data.latestPayment.invoiceNo}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-3 sm:block">
                                <dt className="text-muted-foreground">{t("track.payProvider")}</dt>
                                <dd className="font-semibold text-foreground">
                                  {data.latestPayment.provider}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-3 sm:block">
                                <dt className="text-muted-foreground">{t("track.payTotal")}</dt>
                                <dd className="font-semibold tabular-nums text-foreground">
                                  {formatCurrency(data.latestPayment.total)}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-3 sm:block">
                                <dt className="text-muted-foreground">{t("track.payDate")}</dt>
                                <dd className="font-semibold text-foreground">
                                  {data.latestPayment.paidAt
                                    ? formatDateTime(data.latestPayment.paidAt)
                                    : "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-3 sm:col-span-2 sm:block">
                                <dt className="text-muted-foreground">{t("track.payRef")}</dt>
                                <dd className="font-mono font-semibold text-foreground">
                                  {data.latestPayment.reference ?? "—"}
                                </dd>
                              </div>
                            </dl>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      role="status"
                      className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 dark:border-amber-500/30"
                    >
                      <div className="flex items-start gap-3">
                        <Clock
                          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                            {t("track.unpaidBox")}
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {t("track.amountDue", { amount: formatCurrency(data.amountDue) })}
                          </p>
                          {!showPay ? (
                            <Button
                              className="mt-3 h-11 bg-amber-500 font-bold text-emerald-950 hover:bg-amber-400"
                              aria-expanded={showPay}
                              onClick={() => setShowPay(true)}
                            >
                              <Wallet className="h-4 w-4" aria-hidden />
                              {t("track.payButton")}
                            </Button>
                          ) : null}
                        </div>
                      </div>
                      {showPay ? (
                        <div className="mt-4">
                          <PaymentPanel
                            trackingCode={data.trackingCode}
                            amountDue={data.amountDue}
                            onPaid={() => void track(data.trackingCode)}
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
