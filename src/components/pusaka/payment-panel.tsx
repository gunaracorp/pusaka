"use client";

// ============================================================
// PUSAKA — PaymentPanel
// Panel pembayaran mandiri (3 fase): choose → invoice → paid.
// - Fase ditentukan dari listPayments(trackingCode) saat mount
//   (MENUNGGU → invoice, BERHASIL → paid, selain itu choose)
// - QRIS: QR sungguhan digenerate client-side via `qrcode`
// - VA/E-WALLET: nomor VA + instruksi; CREDIT_CARD: info redirect
// - Tombol amber = simulasi pembayaran demo (settlePayment)
// Semua teks via t("payment.*") — dict: src/lib/i18n/dict/payment.ts
// ============================================================

import { useCallback, useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import {
  CheckCircle2,
  ClipboardCopy,
  Copy,
  CreditCard,
  Landmark,
  Loader2,
  QrCode,
  RefreshCw,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/provider";
import {
  createPayment,
  getPaymentMethods,
  listPayments,
  settlePayment,
  type PaymentMethodT,
  type PaymentMethodTypeT,
  type PaymentT,
} from "@/lib/pusaka";
import { toast } from "sonner";

type Phase = "choose" | "invoice" | "paid";

/** Ikon lucide per tipe channel pembayaran. */
const METHOD_ICON: Record<string, LucideIcon> = {
  QRIS: QrCode,
  VIRTUAL_ACCOUNT: Landmark,
  E_WALLET: Wallet,
  CREDIT_CARD: CreditCard,
};

const TYPE_LABEL_KEY: Record<PaymentMethodTypeT, string> = {
  QRIS: "payment.typeQRIS",
  VIRTUAL_ACCOUNT: "payment.typeVA",
  E_WALLET: "payment.typeEWallet",
  CREDIT_CARD: "payment.typeCreditCard",
};

/** Detik sisa → format HH:MM:SS. */
function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function PaymentPanel({
  trackingCode,
  amountDue,
  onPaid,
  className,
}: {
  trackingCode: string;
  /** Harga program (IDR) untuk info di fase pilih metode (opsional). */
  amountDue?: number;
  /** Dipanggil setelah pembayaran BERHASIL. */
  onPaid?: () => void;
  className?: string;
}) {
  const { t, formatCurrency, formatDateTime } = useI18n();

  const [booted, setBooted] = useState(false);
  const [phase, setPhase] = useState<Phase>("choose");
  const [payment, setPayment] = useState<PaymentT | null>(null);
  const [methods, setMethods] = useState<PaymentMethodT[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [settling, setSettling] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [qr, setQr] = useState<{ id: string; url: string } | null>(null);

  // ---------- MOUNT: tentukan fase awal dari riwayat invoice ----------
  useEffect(() => {
    let alive = true;
    listPayments(trackingCode)
      .then((payments) => {
        if (!alive) return;
        const pending = payments.find((p) => p.status === "MENUNGGU");
        if (pending) {
          setPayment(pending);
          setPhase("invoice");
        } else {
          const paid = payments
            .filter((p) => p.status === "BERHASIL")
            .sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];
          if (paid) {
            setPayment(paid);
            setPhase("paid");
          }
        }
        setBooted(true);
      })
      .catch(() => {
        if (alive) setBooted(true);
      });
    return () => {
      alive = false;
    };
  }, [trackingCode]);

  // ---------- Fase choose: muat daftar metode ----------
  useEffect(() => {
    if (phase !== "choose" || methods !== null) return;
    let alive = true;
    getPaymentMethods()
      .then((list) => {
        if (alive) setMethods(list);
      })
      .catch(() => {
        if (alive) {
          setMethods([]);
          toast.error(t("payment.methodsError"));
        }
      });
    return () => {
      alive = false;
    };
  }, [phase, methods, t]);

  // ---------- Fase invoice: countdown LIVE (interval 1s, pola aman lint) ----------
  useEffect(() => {
    if (phase !== "invoice" || !payment) return;
    const target = new Date(payment.expiredAt).getTime();
    if (Number.isNaN(target)) return;
    let intervalId: number | undefined;
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    // setTimeout 0: hindari set-state sinkron di body effect (pola aman)
    const timeoutId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 1000);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [phase, payment]);

  // ---------- Fase invoice + QRIS: generate QR sungguhan (client-side) ----------
  useEffect(() => {
    if (phase !== "invoice" || !payment || payment.method !== "QRIS" || !payment.qrPayload) {
      return;
    }
    let cancelled = false;
    const paymentId = payment.id;
    const payload = payment.qrPayload;
    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: { dark: "#064e3b", light: "#ffffff" },
    })
      .then((url: string) => {
        if (!cancelled) setQr({ id: paymentId, url });
      })
      .catch(() => {
        /* QR gagal dibuat — biarkan skeleton tampil */
      });
    return () => {
      cancelled = true;
    };
  }, [phase, payment]);

  const copyValue = useCallback(
    (value: string) => {
      void navigator.clipboard
        .writeText(value)
        .then(() => toast.success(t("payment.copiedToast")))
        .catch(() => toast.error(t("payment.copyErrorToast")));
    },
    [t]
  );

  async function createInvoice() {
    if (!selectedId || creating) return;
    setCreating(true);
    try {
      const created = await createPayment({ trackingCode, methodId: selectedId });
      setPayment(created);
      setPhase("invoice");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("payment.createError"));
    } finally {
      setCreating(false);
    }
  }

  async function settle() {
    if (!payment || settling) return;
    setSettling(true);
    try {
      const settled = await settlePayment(payment.id);
      setPayment(settled);
      setPhase("paid");
      toast.success(t("payment.successToast"));
      onPaid?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("payment.settleError"));
    } finally {
      setSettling(false);
    }
  }

  function backToChoose() {
    setPhase("choose");
    setPayment(null);
    setSecondsLeft(null);
    setSelectedId(null);
  }

  // ---------- Konten ----------
  let content: ReactNode;

  if (!booted) {
    // Skeleton awal
    content = (
      <CardContent className="p-6 sm:p-8">
        <Skeleton className="h-5 w-1/3" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-5 h-12 w-full rounded-md" />
      </CardContent>
    );
  } else if (phase === "choose") {
    const methodsLoading = methods === null;
    const methodsEmpty = methods !== null && methods.length === 0;
    content = (
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-foreground">
            {t("payment.selectMethod")}
          </h3>
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          >
            {t("payment.demoBadge")}
          </Badge>
        </div>

        {typeof amountDue === "number" ? (
          <p className="mt-3 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-300">
            {t("payment.amountDueInfo", { amount: formatCurrency(amountDue) })}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("payment.demoNote")}
        </p>

        {methodsLoading ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : methodsEmpty ? (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("payment.methodsError")}</p>
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-600/40 text-emerald-800 hover:bg-emerald-500/10 dark:text-emerald-300"
              onClick={() => setMethods(null)}
            >
              {t("payment.retry")}
            </Button>
          </div>
        ) : (
          <div
            role="radiogroup"
            aria-label={t("payment.selectMethod")}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {(methods ?? []).map((m) => {
              const Icon = METHOD_ICON[m.type] ?? Wallet;
              const active = selectedId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedId(m.id)}
                  className={`min-h-24 rounded-xl border-2 p-4 text-start transition-all ${
                    active
                      ? "border-emerald-600 bg-emerald-500/10 shadow-sm dark:border-emerald-500"
                      : "border-border bg-card hover:border-emerald-500/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm font-bold text-foreground">{m.label}</span>
                  </span>
                  {m.note ? (
                    <span className="mt-1.5 block text-xs leading-snug text-muted-foreground">
                      {m.note}
                    </span>
                  ) : null}
                  <span className="mt-1.5 block text-xs font-semibold text-amber-700 dark:text-amber-300">
                    + {formatCurrency(m.fee)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <Button
          className="mt-5 h-12 w-full bg-emerald-700 text-base font-bold hover:bg-emerald-800"
          disabled={!selectedId || creating}
          onClick={() => void createInvoice()}
        >
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t("payment.creating")}
            </>
          ) : (
            t("payment.createButton")
          )}
        </Button>
      </CardContent>
    );
  } else if (phase === "invoice" && payment) {
    const expired = secondsLeft !== null && secondsLeft <= 0;
    const qrReady = qr !== null && qr.id === payment.id;
    content = (
      <CardContent className="p-6 sm:p-8">
        {/* header invoice */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-bold text-foreground">
                {t("payment.invoiceTitle")}
              </h3>
              <Badge
                variant="outline"
                className="border-emerald-600/40 text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-300"
              >
                {t(TYPE_LABEL_KEY[payment.method] ?? "payment.typeVA")}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold tracking-wider text-muted-foreground">
                {payment.invoiceNo}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-300"
                aria-label={t("payment.copyInvoiceNo")}
                onClick={() => copyValue(payment.invoiceNo)}
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("payment.payVia", { provider: payment.provider })}
            </p>
          </div>

          <div className="text-end">
            {expired ? (
              <Badge className="border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300">
                {t("payment.expiredBadge")}
              </Badge>
            ) : (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t("payment.expiryLabel")}
                </p>
                <p
                  role="timer"
                  aria-live="off"
                  className="font-mono text-lg font-black tabular-nums text-amber-700 dark:text-amber-300"
                >
                  {secondsLeft === null ? "--:--:--" : formatCountdown(secondsLeft)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* QRIS */}
        {payment.method === "QRIS" ? (
          <div className="mt-5">
            {qrReady && qr ? (
              <img
                src={qr.url}
                alt={t("payment.qrisAlt")}
                width={220}
                height={220}
                className="mx-auto rounded-lg border bg-white p-2"
              />
            ) : (
              <Skeleton className="mx-auto h-[236px] w-[236px] rounded-lg" />
            )}
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {t("payment.qrisCaption")}
            </p>
          </div>
        ) : null}

        {/* VIRTUAL_ACCOUNT / E_WALLET */}
        {payment.method === "VIRTUAL_ACCOUNT" || payment.method === "E_WALLET" ? (
          <div className="mt-5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4 text-center dark:border-emerald-500/30">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("payment.vaLabel")}
            </p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="break-all font-mono text-2xl font-black tracking-wider text-emerald-800 dark:text-emerald-300 sm:text-3xl">
                {payment.vaNumber ?? "—"}
              </span>
              {payment.vaNumber ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-300"
                  aria-label={t("payment.copyVa")}
                  onClick={() => copyValue(payment.vaNumber as string)}
                >
                  <ClipboardCopy className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {payment.method === "VIRTUAL_ACCOUNT"
                ? t("payment.vaInstruction", { provider: payment.provider })
                : t("payment.ewalletInstruction", { provider: payment.provider })}
            </p>
          </div>
        ) : null}

        {/* CREDIT_CARD */}
        {payment.method === "CREDIT_CARD" ? (
          <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm leading-relaxed text-amber-800 dark:text-amber-200">
            {t("payment.cardRedirect")}
          </p>
        ) : null}

        {/* rincian biaya */}
        <dl className="mt-5 space-y-1.5 rounded-xl border bg-muted/40 p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t("payment.subtotal")}</dt>
            <dd className="font-medium tabular-nums text-foreground">
              {formatCurrency(payment.amount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t("payment.feeLabel")}</dt>
            <dd className="font-medium tabular-nums text-foreground">
              {formatCurrency(payment.fee)}
            </dd>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4 border-t border-border pt-2.5">
            <dt className="font-bold text-foreground">{t("payment.total")}</dt>
            <dd className="text-lg font-black tabular-nums text-emerald-700 dark:text-emerald-300">
              {formatCurrency(payment.total)}
            </dd>
          </div>
        </dl>

        {/* aksi */}
        <div className="mt-5 space-y-3">
          {expired ? (
            <Button
              variant="outline"
              className="h-12 w-full border-amber-500/50 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
              onClick={backToChoose}
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              {t("payment.recreate")}
            </Button>
          ) : null}
          <Button
            className="h-12 w-full bg-amber-500 font-bold text-emerald-950 hover:bg-amber-400"
            disabled={settling}
            onClick={() => void settle()}
          >
            {settling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t("payment.simulating")}
              </>
            ) : (
              t("payment.simulate")
            )}
          </Button>
        </div>
      </CardContent>
    );
  } else if (phase === "paid" && payment) {
    content = (
      <CardContent
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-4 p-6 text-center sm:p-8"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {t("payment.paidTitle")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("payment.paidDesc")}</p>
        </div>

        <dl className="w-full space-y-2 rounded-xl border bg-muted/40 p-4 text-sm text-start">
          <div className="flex items-center justify-between gap-3">
            <dt className="shrink-0 text-muted-foreground">{t("payment.reference")}</dt>
            <dd className="flex min-w-0 items-center gap-1.5">
              <span className="truncate font-mono font-bold text-emerald-800 dark:text-emerald-300">
                {payment.reference ?? "—"}
              </span>
              {payment.reference ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-300"
                  aria-label={t("payment.copyRef")}
                  onClick={() => copyValue(payment.reference as string)}
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                </Button>
              ) : null}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-2">
            <dt className="shrink-0 text-muted-foreground">{t("payment.invoiceNoLabel")}</dt>
            <dd className="min-w-0 truncate font-mono font-medium text-foreground">
              {payment.invoiceNo}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-2">
            <dt className="shrink-0 text-muted-foreground">{t("payment.total")}</dt>
            <dd className="text-lg font-black tabular-nums text-emerald-700 dark:text-emerald-300">
              {formatCurrency(payment.total)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-2">
            <dt className="shrink-0 text-muted-foreground">{t("payment.paidAtLabel")}</dt>
            <dd className="min-w-0 text-end font-medium text-foreground">
              {payment.paidAt ? formatDateTime(payment.paidAt) : "—"}
            </dd>
          </div>
        </dl>
      </CardContent>
    );
  } else {
    // Fallback aman (harusnya tak terjadi)
    content = (
      <CardContent className="p-6 sm:p-8">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="mt-4 h-24 rounded-xl" />
      </CardContent>
    );
  }

  return (
    <div className={className}>
      <Card className="border-border shadow-sm" data-payment-panel="">
        {content}
      </Card>
    </div>
  );
}
