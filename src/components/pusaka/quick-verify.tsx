"use client";

import { useState } from "react";
import { BadgeCheck, Loader2, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  EXAMPLE_CERT_NUMBERS,
  TIER_META,
  postVerify,
  type VerifyData,
} from "@/lib/pusaka";
import { useI18n } from "@/lib/i18n/provider";

export function QuickVerify() {
  const { t, formatDateShort } = useI18n();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(input?: string) {
    const certNumber = (input ?? value).trim();
    if (!certNumber) return;
    setValue(certNumber);
    setLoading(true);
    setError(null);
    try {
      const data = await postVerify(certNumber);
      setResult(data);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t("quickVerify.errorFallback"));
    } finally {
      setLoading(false);
    }
  }

  const tierMeta = result?.valid ? TIER_META[result.institution.tier] : undefined;

  return (
    <section
      aria-label={t("quickVerify.ariaLabel")}
      className="relative z-10 mx-auto -mt-0 w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-emerald-600/20 bg-card p-5 shadow-xl shadow-emerald-900/5 dark:border-emerald-500/20 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 lg:min-w-56">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <BadgeCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-display text-base font-bold text-foreground">
                {t("quickVerify.title")}
              </p>
              <p className="text-xs text-muted-foreground">{t("quickVerify.subtitle")}</p>
            </div>
          </div>

          <form
            className="flex flex-1 flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void handleVerify();
            }}
          >
            <label htmlFor="quick-verify-input" className="sr-only">
              {t("quickVerify.inputLabel")}
            </label>
            <Input
              id="quick-verify-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("quickVerify.placeholder")}
              className="h-11 flex-1 font-mono uppercase"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 min-w-36 bg-emerald-700 hover:bg-emerald-800"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("quickVerify.checking")}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" aria-hidden />
                  {t("quickVerify.button")}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* hint */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{t("quickVerify.tryExample")}</span>
          {EXAMPLE_CERT_NUMBERS.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => void handleVerify(num)}
              className="min-h-8 rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] text-emerald-700 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 dark:text-emerald-300"
            >
              {num}
            </button>
          ))}
        </div>

        {/* hasil */}
        {error ? (
          <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300">
            <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        ) : null}

        {result && !error ? (
          result.valid ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 dark:border-emerald-500/30">
              <Badge className="border-emerald-600 bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white">
                {t("quickVerify.badgeValid")}
              </Badge>
              <span className="text-sm font-semibold text-foreground">
                {result.institution.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {result.institution.certNumber}
              </span>
              {tierMeta ? (
                <Badge variant="outline" className={`text-[10px] ${tierMeta.badgeClass}`}>
                  {t(`common.tiers.${result.institution.tier}`)}
                </Badge>
              ) : null}
              <span className="text-xs text-muted-foreground">
                {t("quickVerify.validUntil", {
                  date: formatDateShort(result.institution.expiresAt),
                })}
              </span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-950/40">
              <Badge className="border-red-600 bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                {t("quickVerify.badgeInvalid")}
              </Badge>
              <span className="text-sm text-red-700 dark:text-red-300">
                {t("quickVerify.notFound")}
              </span>
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
