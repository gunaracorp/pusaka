"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, BadgeCheck, Landmark, ScrollText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/pusaka/animated-counter";
import { FALLBACK_STATS, getStats, qrPattern, type StatsT } from "@/lib/pusaka";

const HERO_STATS_FALLBACK = [
  { value: 14840, suffix: "+", label: "Sertifikat Terbit" },
  { value: 46, suffix: "", label: "Dewan Pakar" },
  { value: 7, suffix: "", label: "Program Sertifikasi" },
  { value: 9, suffix: "", label: "Bidang Keilmuan" },
];

const QR_BITS = qrPattern("PPU-2025-0001-PLATINUM");

function MiniQr() {
  return (
    <div
      className="grid grid-cols-5 gap-[3px] rounded-md bg-white p-2 shadow-inner"
      aria-hidden
    >
      {QR_BITS.map((on, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-[2px] ${on ? "bg-emerald-900" : "bg-stone-200"}`}
        />
      ))}
    </div>
  );
}

function CertificateMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
      whileHover={{ rotateX: -6, rotateY: 8, scale: 1.02 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className="animate-float relative w-full max-w-md rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 shadow-2xl shadow-emerald-950/60"
    >
      {/* kilau shine */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
        <div className="animate-shine absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-xl font-black text-white">
            P
          </span>
          <div>
            <p className="font-display text-sm font-extrabold tracking-wide text-white">PUSAKA</p>
            <p className="text-[10px] uppercase tracking-widest text-emerald-300/80">
              Sertifikat Digital
            </p>
          </div>
        </div>
        <span className="rounded-md border border-amber-400/60 bg-amber-400/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-amber-300">
          PLATINUM
        </span>
      </div>

      <div className="mt-6 rounded-lg border border-emerald-700/50 bg-emerald-950/60 p-4">
        <p className="font-mono text-xs tracking-widest text-emerald-400">NO. SERTIFIKAT</p>
        <p className="mt-1 font-mono text-lg font-bold tracking-wider text-white">
          PPU-2025-0001
        </p>
        <p className="mt-3 text-xs uppercase tracking-widest text-emerald-300/70">
          Diterbitkan kepada
        </p>
        <p className="font-display text-base font-bold text-white">
          PT Cahaya Thaif Travel Indonesia
        </p>
        <p className="mt-1 text-xs text-emerald-200/70">
          Program PPIU — Penyelenggara Perjalanan Umrah
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div className="flex items-center gap-2 text-emerald-300">
          <BadgeCheck className="h-5 w-5" aria-hidden />
          <div className="text-[10px] leading-tight text-emerald-200/80">
            <p className="font-semibold text-emerald-100">QR-Verified</p>
            <p>Berlaku s.d. 31 Des 2028</p>
          </div>
        </div>
        <MiniQr />
      </div>
    </motion.div>
  );
}

export function Hero() {
  const [stats, setStats] = useState<StatsT>(FALLBACK_STATS);

  useEffect(() => {
    let alive = true;
    getStats()
      .then((data) => {
        if (alive) setStats(data);
      })
      .catch(() => {
        /* fallback tetap dipakai */
      });
    return () => {
      alive = false;
    };
  }, []);

  const heroStats = [
    { value: stats.totals.certificateHolders, suffix: "+", label: "Sertifikat Terbit" },
    { value: stats.totals.experts, suffix: "", label: "Dewan Pakar" },
    { value: stats.totals.programs, suffix: "", label: "Program Sertifikasi" },
    { value: 9, suffix: "", label: "Bidang Keilmuan" },
  ];

  return (
    <section id="beranda" className="relative scroll-mt-20 overflow-hidden bg-emerald-950">
      {/* tekstur latar */}
      <Image
        src="/images/hero-bg.png"
        alt="Tekstur latar ornamen islami PUSAKA"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover opacity-15"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-950/85 to-emerald-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* kiri: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300">
                <Landmark className="h-3.5 w-3.5" aria-hidden />
                Terakreditasi • Berlaku Nasional &amp; Internasional
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
            >
              Pusat Sertifikasi &amp; Akreditasi{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Industri Perjalanan Wisata, Umrah &amp; Haji
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-emerald-100/80 sm:text-lg"
            >
              Lembaga sertifikasi profesi &amp; akreditasi resmi bagi penyelenggara{" "}
              <strong className="font-semibold text-emerald-50">PIHK</strong>,{" "}
              <strong className="font-semibold text-emerald-50">PPIU</strong>,{" "}
              <strong className="font-semibold text-emerald-50">BPW</strong>, dan{" "}
              <strong className="font-semibold text-emerald-50">IATA</strong> — dengan Dewan Pakar
              46 lintas bidang serta sertifikat digital QR-verified yang diakui lintas negara.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                asChild
                className="h-12 min-w-40 bg-amber-500 text-emerald-950 shadow-lg shadow-amber-500/25 hover:bg-amber-400"
              >
                <a href="#pendaftaran" className="gap-2 text-sm font-bold">
                  <Award className="h-4 w-4" aria-hidden />
                  Mulai Sertifikasi
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 min-w-40 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#verifikasi" className="gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Verifikasi Sertifikat
                </a>
              </Button>
            </motion.div>
          </div>

          {/* kanan: mockup kartu */}
          <div className="flex justify-center lg:justify-end" style={{ perspective: 1000 }}>
            <CertificateMockup />
          </div>
        </div>

        {/* strip statistik */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-emerald-800/60 bg-emerald-800/40 backdrop-blur lg:grid-cols-4"
        >
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 bg-emerald-950/80 px-4 py-6 text-center"
            >
              <span className="font-display text-3xl font-black text-amber-400 sm:text-4xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-emerald-200/70">
                <ScrollText className="h-3 w-3" aria-hidden />
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
