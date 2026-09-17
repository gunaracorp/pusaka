"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Deteksi "sudah ter-mount" tanpa setState di dalam effect
 * (aman dari aturan lint react-hooks/set-state-in-effect).
 * Server/hydration → false; setelah mount di klien → true.
 */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Tombol toggle mode gelap/terang PUSAKA (next-themes, attribute="class"). */
export function ThemeToggle() {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-hidden={!mounted || undefined}
      tabIndex={mounted ? 0 : -1}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform duration-300" aria-hidden />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300" aria-hidden />
      )}
    </Button>
  );
}
