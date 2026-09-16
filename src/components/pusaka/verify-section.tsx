"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Search, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CertificateCard } from "@/components/pusaka/certificate-card";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import {
  EXAMPLE_CERT_NUMBERS,
  getStats,
  postVerify,
  timeAgo,
  type StatsT,
  type VerifyData,
} from "@/lib/pusaka";

export function VerifySection() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<StatsT["recentActivity"]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const verify = useCallback(async (certNumber: string) => {
    if (!certNumber.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postVerify(certNumber);
      setResult(data);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Gagal memverifikasi sertifikat.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActivity = useCallback(async () => {
    try {
      const stats = await getStats();
      setActivity(stats.recentActivity);
    } catch {
      /* panel aktivitas bersifat pelengkap — abaikan kegagalan */
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActivity();
    const timer = setInterval(() => void loadActivity(), 10_000);
    return () => clearInterval(timer);
  }, [loadActivity]);

  return (
    <section id="verifikasi" className="scroll-mt-20 bg-stone-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Verifikasi Publik"
          title="Verifikasi Sertifikat Digital"
          subtitle="Setiap sertifikat PUSAKA dilengkapi tanda tangan digital & kode QR. Masukkan nomor sertifikat untuk melihat keaslian, status, dan skor audit lembaga."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* kiri: form verifikasi */}
          <FadeIn className="lg:col-span-3">
            <Card className="border-stone-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-emerald-700" aria-hidden />
                  Masukkan Nomor Sertifikat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void verify(value);
                  }}
                >
                  <label htmlFor="verify-input" className="sr-only">
                    Nomor sertifikat
                  </label>
                  <Input
                    id="verify-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Contoh: PPU-2025-0001"
                    className="h-12 flex-1 font-mono uppercase"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 min-w-40 bg-emerald-700 hover:bg-emerald-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Memeriksa…
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4 w-4" aria-hidden />
                        Verifikasi Sekarang
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span>Nomor contoh:</span>
                  {EXAMPLE_CERT_NUMBERS.map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setValue(num);
                        void verify(num);
                      }}
                      className="min-h-8 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 font-mono text-[11px] text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {error ? (
                  <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    <XCircle className="h-4 w-4 shrink-0" aria-hidden />
                    {error}
                  </p>
                ) : null}

                {loading ? (
                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-28 w-full rounded-xl" />
                  </div>
                ) : result ? (
                  result.valid ? (
                    <div className="mt-6">
                      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" aria-hidden />
                        Sertifikat ditemukan — status VALID
                      </p>
                      <CertificateCard
                        institution={result.institution}
                        programName={result.program?.name ?? null}
                      />
                    </div>
                  ) : (
                    <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50 py-10 text-center">
                      <XCircle className="h-10 w-10 text-red-500" aria-hidden />
                      <p className="font-display text-lg font-bold text-red-700">
                        Sertifikat Tidak Ditemukan
                      </p>
                      <p className="max-w-sm text-sm text-red-600/80">
                        Nomor yang Anda masukkan tidak terdaftar pada basis data PUSAKA.
                        Periksa kembali penulisan atau hubungi sekretariat.
                      </p>
                    </div>
                  )
                ) : (
                  <p className="mt-6 rounded-xl border border-dashed border-stone-300 bg-stone-100/60 px-4 py-8 text-center text-sm text-stone-400">
                    Hasil verifikasi akan muncul di sini dalam bentuk kartu sertifikat digital.
                  </p>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* kanan: aktivitas real-time */}
          <FadeIn delay={0.15} className="lg:col-span-2">
            <Card className="h-full border-emerald-100 bg-white/70 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  </span>
                  Aktivitas Verifikasi Real-time
                </CardTitle>
                <p className="text-xs text-stone-500">Diperbarui otomatis setiap 10 detik</p>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-11 w-full rounded-lg" />
                    ))}
                  </div>
                ) : activity.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-stone-300 py-8 text-center text-sm text-stone-400">
                    Belum ada aktivitas verifikasi terbaru.
                  </p>
                ) : (
                  <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {activity.map((item, idx) => (
                        <motion.li
                          key={`${item.certNumber}-${item.at}-${idx}`}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50/80 px-3 py-2.5"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            {item.result === "VALID" ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0 text-red-500" aria-hidden />
                            )}
                            <span className="truncate font-mono text-xs font-semibold text-stone-700">
                              {item.certNumber}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                item.result === "VALID" ? "text-emerald-700" : "text-red-600"
                              }`}
                            >
                              ✓ {item.result}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {timeAgo(item.at)}
                            </span>
                          </span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
