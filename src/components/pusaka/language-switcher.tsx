"use client";

// ============================================================
// PUSAKA — Language Switcher (ID / EN / AR)
// Dipasang di Navbar (desktop + Sheet mobile) oleh Task 9-a.
// ============================================================

import { Check, Globe, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/provider";
import { LANG_LABELS, LANG_SHORT, type Lang } from "@/lib/i18n/types";

const LANGS: Lang[] = ["id", "en", "ar"];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 gap-1.5 px-2.5 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
          aria-label={`${t("common.actions.language")}: ${LANG_LABELS[lang]}`}
        >
          <Globe className="h-4 w-4" aria-hidden />
          <span className="text-sm font-semibold">{LANG_SHORT[lang]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLang(l)}
            className={`flex items-center justify-between gap-2 ${
              l === lang ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : ""
            }`}
            aria-current={l === lang ? "true" : undefined}
          >
            <span className="flex items-center gap-2">
              {l === "ar" ? (
                <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
              ) : (
                <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
              )}
              <span className="text-sm font-medium" dir={l === "ar" ? "rtl" : undefined}>
                {LANG_LABELS[l]}
              </span>
              {!compact ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {LANG_SHORT[l]}
                </span>
              ) : null}
            </span>
            {l === lang ? <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
