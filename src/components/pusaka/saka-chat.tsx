"use client";

// ============================================================
// PUSAKA — SAKA, Asisten AI mengambang (floating chat widget)
// POST /api/assistant { message, history } → { ok, data: { reply } }
// Warna memakai token semantik shadcn agar ikut dark mode,
// kecuali header panel yang memang dark-identity emerald.
// Chrome teks diterjemahkan via useI18n (saka.*); logika POST,
// typing indicator, dan auto-scroll tidak diubah.
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Chip cepat — key dict stabil dipakai sebagai React key & teks diterjemahkan. */
const QUICK_CHIP_KEYS = ["saka.chips.about", "saka.chips.programs", "saka.chips.verify", "saka.chips.services"] as const;

/** Widget chat mengambang SAKA — pasang tanpa props: <SakaChat /> */
export function SakaChat() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t("saka.welcome") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Pesan sambutan mengikuti bahasa aktif — hanya diganti saat belum ada percakapan.
  const welcome = useMemo<ChatMessage>(
    () => ({ role: "assistant", content: t("saka.welcome") }),
    [t]
  );
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "assistant" ? [welcome] : prev
    );
  }, [welcome]);

  // Auto-scroll ke bawah saat pesan/typing berubah (scroll DOM imperatif — tanpa setState di effect)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  // Escape menutup panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const errorReply = t("saka.errorReply");
    // history = maks 8 pesan terakhir SEBELUM pesan user ini, tanpa pesan sambutan (index 0)
    const history = messages.slice(1).slice(-8);
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok: true; data: { reply?: string } }
        | { ok: false; error?: string }
        | null;
      const reply = json && json.ok === true ? (json.data?.reply ?? "") : "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply || errorReply },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: errorReply }]);
    } finally {
      setLoading(false);
    }
  }

  function toggleOpen() {
    if (!open) setHasOpened(true);
    setOpen(!open);
  }

  return (
    <>
      {/* Tombol trigger */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={open ? t("saka.aria.toggleClose") : t("saka.aria.toggleOpen")}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white shadow-xl shadow-emerald-900/30 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Bot className="h-6 w-6" aria-hidden />}
        {!hasOpened && !open ? (
          <span
            className="animate-pulse-amber absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-background bg-amber-500"
            aria-hidden
          />
        ) : null}
      </button>

      {/* Panel chat */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="saka-panel"
            role="dialog"
            aria-label={t("saka.aria.dialog")}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "100% 100%" }}
            className="fixed bottom-20 right-4 z-50 flex h-[min(68vh,540px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:right-5"
          >
            {/* Header — selalu dark identity */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950 to-emerald-900 p-4 text-white">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 font-display text-lg font-bold"
                aria-hidden
              >
                S
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold">SAKA — {t("saka.header.role")}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-emerald-100/80">
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"
                    aria-hidden
                  />
                  {t("saka.header.status")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("saka.aria.toggleClose")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Area pesan */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) =>
                m.role === "assistant" ? (
                  <div
                    key={i}
                    className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5 text-sm text-card-foreground"
                  >
                    {m.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-emerald-700 px-3.5 py-2.5 text-sm text-white"
                  >
                    {m.content}
                  </div>
                )
              )}

              {/* typing indicator */}
              {loading ? (
                <div
                  className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-md bg-muted px-3.5 py-3"
                  aria-label={t("saka.aria.typing")}
                  aria-live="polite"
                >
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 delay-100 [animation-delay:100ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 delay-200 [animation-delay:200ms]" />
                </div>
              ) : null}

              {/* quick chips — hanya saat baru sambutan */}
              {!loading && messages.length <= 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_CHIP_KEYS.map((chipKey) => (
                    <button
                      key={chipKey}
                      type="button"
                      onClick={() => void send(t(chipKey))}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-emerald-300"
                    >
                      {t(chipKey)}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Input row */}
            <form
              className="flex gap-2 border-t border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <label htmlFor="saka-input" className="sr-only">
                {t("saka.input.label")}
              </label>
              <Input
                id="saka-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("saka.input.placeholder")}
                maxLength={500}
                autoComplete="off"
                aria-label={t("saka.input.aria")}
                className="flex-1 rounded-full"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                aria-label={t("saka.aria.send")}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
