"use client";

// ============================================================
// PUSAKA — VersionBadge & ChangelogDialog (PUSAKA) — Task 12
// Lencana versi di footer: klik → dialog Riwayat Versi interaktif.
// Data: src/lib/version.ts (sumber kebenaran) — tidak melakukan fetch.
// i18n penuh (id/en/ar), RTL-safe (utilitas logis), dark-mode token.
// ============================================================

import { useState } from "react";
import {
  AlertCircle,
  GitBranch,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/provider";
import {
  CHANGELOG,
  OS_CHANNEL,
  OS_CODENAME,
  OS_NAME,
  OS_SPEC,
  OS_VERSION,
  TOTAL_RELEASES,
  type ChangelogEntry,
  type ChangelogKind,
  type ReleaseType,
} from "@/lib/version";

/** Gaya lencana jenis rilis. */
const TYPE_BADGE: Record<ReleaseType, { label: string; className: string }> = {
  major: { label: "MAJOR", className: "border-transparent bg-emerald-700 text-white" },
  minor: {
    label: "MINOR",
    className:
      "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:border-amber-500/40 dark:text-amber-300",
  },
  patch: { label: "PATCH", className: "border-border bg-muted text-muted-foreground" },
};

/** Ikon + warna per kategori perubahan (Keep a Changelog). */
const KIND_META: Record<
  ChangelogKind,
  { icon: LucideIcon; className: string; i18nKey: string }
> = {
  added: {
    icon: Plus,
    className: "text-emerald-600 dark:text-emerald-400",
    i18nKey: "versionControl.dialog.sections.added",
  },
  changed: {
    icon: RefreshCw,
    className: "text-amber-600 dark:text-amber-400",
    i18nKey: "versionControl.dialog.sections.changed",
  },
  deprecated: {
    icon: AlertCircle,
    className: "text-orange-600 dark:text-orange-400",
    i18nKey: "versionControl.dialog.sections.deprecated",
  },
  removed: {
    icon: Minus,
    className: "text-rose-600 dark:text-rose-400",
    i18nKey: "versionControl.dialog.sections.removed",
  },
  fixed: {
    icon: Wrench,
    className: "text-violet-600 dark:text-violet-400",
    i18nKey: "versionControl.dialog.sections.fixed",
  },
  security: {
    icon: ShieldCheck,
    className: "text-teal-600 dark:text-teal-400",
    i18nKey: "versionControl.dialog.sections.security",
  },
};

const KIND_ORDER: ChangelogKind[] = [
  "added",
  "changed",
  "deprecated",
  "removed",
  "fixed",
  "security",
];

function ReleaseCard({ entry, isCurrent }: { entry: ChangelogEntry; isCurrent: boolean }) {
  const { t, formatDateShort } = useI18n();
  const typeBadge = TYPE_BADGE[entry.type];

  return (
    <li
      className={`rounded-xl border bg-card p-4 shadow-sm transition-colors ${
        isCurrent
          ? "border-amber-500/60 ring-1 ring-amber-500/40"
          : "border-border hover:border-emerald-600/30"
      }`}
    >
      {/* baris kepala: versi + jenis + kode nama + tanggal */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span className="font-mono text-base font-black text-foreground" dir="ltr">
          v{entry.version}
        </span>
        <Badge
          variant="outline"
          className={`px-1.5 py-0 font-mono text-[9px] font-bold tracking-widest ${typeBadge.className}`}
        >
          {typeBadge.label}
        </Badge>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground" dir="ltr">
          “{entry.codename}”
        </span>
        {isCurrent ? (
          <Badge className="border-transparent bg-amber-500 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-emerald-950">
            {t("versionControl.dialog.currentBadge")}
          </Badge>
        ) : null}
        <span className="ms-auto text-[11px] text-muted-foreground">
          {t("versionControl.dialog.releasedOn")} {formatDateShort(entry.date)}
        </span>
      </div>

      <p className="mt-1.5 font-display text-sm font-bold text-foreground">{entry.title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{entry.summary}</p>

      {/* ketertelusuran task worklog */}
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("versionControl.dialog.tasksLabel")}:
        </span>
        {entry.tasks.map((task) => (
          <span
            key={task}
            className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300"
            dir="ltr"
          >
            #{task}
          </span>
        ))}
      </div>

      {/* butir perubahan per kategori */}
      <div className="mt-3 space-y-2.5">
        {KIND_ORDER.map((kind) => {
          const items = entry[kind];
          if (!items || items.length === 0) return null;
          const meta = KIND_META[kind];
          const Icon = meta.icon;
          return (
            <div key={kind}>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                <Icon className={`h-3.5 w-3.5 ${meta.className}`} aria-hidden />
                <span className={meta.className}>{t(meta.i18nKey)}</span>
                <span className="font-mono text-[10px] font-normal text-muted-foreground">
                  ×{items.length}
                </span>
              </p>
              <ul className="mt-1 space-y-1 ps-1">
                {items.map((item, idx) => (
                  <li key={`${kind}-${idx}`} className="flex gap-2 text-xs leading-relaxed text-foreground/85">
                    <span
                      className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${meta.className} bg-current`}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </li>
  );
}

export function VersionBadge() {
  const { t, formatNumber } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* lencana di bar bawah footer */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t("versionControl.badge.aria")} — ${OS_NAME} v${OS_VERSION}`}
        title={`${OS_NAME} v${OS_VERSION} “${OS_CODENAME}”`}
        className="flex min-h-8 items-center gap-1.5 rounded-md border border-emerald-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300/70 transition-colors hover:border-amber-500/60 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        dir="ltr"
      >
        <GitBranch className="h-3 w-3 text-amber-400" aria-hidden />
        <span>{OS_NAME}</span>
        <span className="font-bold text-emerald-100">v{OS_VERSION}</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" aria-hidden />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
        </span>
      </button>

      {/* dialog riwayat versi */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden p-0 sm:max-w-2xl lg:max-w-3xl">
          <DialogHeader className="items-start gap-1.5 border-b bg-muted/40 p-5 text-start">
            <DialogTitle className="flex flex-wrap items-center gap-2 font-display text-lg font-extrabold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-amber-500 text-white">
                <GitBranch className="h-4 w-4" aria-hidden />
              </span>
              {t("versionControl.dialog.title")}
              <Badge variant="outline" className="border-emerald-600/40 bg-emerald-600/10 px-1.5 py-0 font-mono text-[9px] uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                {OS_SPEC}
              </Badge>
              <Badge variant="outline" className="px-1.5 py-0 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {OS_CHANNEL}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              {t("versionControl.dialog.subtitle")}
            </DialogDescription>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono font-bold text-emerald-700 dark:text-emerald-300" dir="ltr">
                v{OS_VERSION}
              </span>
              <span className="rounded-md border border-border bg-background px-2 py-0.5" dir="ltr">
                “{OS_CODENAME}”
              </span>
              <span>·</span>
              <span>{t("versionControl.dialog.totalLabel", { count: formatNumber(TOTAL_RELEASES) })}</span>
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5">
            {/* legenda cara membaca versi */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                {t("versionControl.dialog.legendTitle")}
              </p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-foreground/85">
                <li className="flex flex-wrap items-center gap-2">
                  <Badge className="border-transparent bg-emerald-700 px-1.5 py-0 font-mono text-[9px] font-bold tracking-widest text-white">MAJOR</Badge>
                  {t("versionControl.dialog.legendMajor")}
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-amber-500/60 bg-amber-500/10 px-1.5 py-0 font-mono text-[9px] font-bold tracking-widest text-amber-700 dark:text-amber-300">MINOR</Badge>
                  {t("versionControl.dialog.legendMinor")}
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-border bg-muted px-1.5 py-0 font-mono text-[9px] font-bold tracking-widest text-muted-foreground">PATCH</Badge>
                  {t("versionControl.dialog.legendPatch")}
                </li>
              </ul>
            </div>

            {/* lini masa rilis — terbaru di atas */}
            <ol className="mt-4 space-y-3">
              {CHANGELOG.map((entry) => (
                <ReleaseCard
                  key={entry.version}
                  entry={entry}
                  isCurrent={entry.version === OS_VERSION}
                />
              ))}
            </ol>
          </div>

          {/* catatan sumber kebenaran */}
          <div className="border-t bg-muted/30 px-5 py-3">
            <p className="text-[10px] leading-relaxed text-muted-foreground" dir="ltr">
              {t("versionControl.dialog.sourceNote")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
