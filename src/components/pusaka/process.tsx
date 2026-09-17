"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  FileSignature,
  GraduationCap,
  Hourglass,
  QrCode,
} from "lucide-react";
import { SectionHeading } from "@/components/pusaka/fade-in";

const STEPS = [
  {
    icon: FileSignature,
    title: "Pendaftaran Online",
    duration: "± 15 menit",
    desc: "Isi formulir pendaftaran dan unggah dokumen persyaratan melalui portal resmi PUSAKA.",
  },
  {
    icon: ClipboardCheck,
    title: "Verifikasi Berkas",
    duration: "1 × 24 jam",
    desc: "Tim admisi memeriksa kelengkapan & keabsahan dokumen, lalu menerbitkan surat penugasan asesor.",
  },
  {
    icon: GraduationCap,
    title: "Pelatihan & Ujian Kompetensi",
    duration: "3–7 hari",
    desc: "Kurikulum standar Dewan Pakar: kelas intensif, ujian tertulis, dan praktik wawancara.",
  },
  {
    icon: Hourglass,
    title: "Audit Lapangan / Assessment",
    duration: "2–5 hari",
    desc: "Asesor independen melakukan penilaian lapangan bagi perusahaan atau uji simulasi bagi individu.",
  },
  {
    icon: QrCode,
    title: "Sertifikat Terbit QR-Verified",
    duration: "1 hari kerja",
    desc: "Sertifikat digital diterbitkan dengan QR-verified dan tercatat permanen pada basis data nasional.",
  },
];

export function Process() {
  return (
    <section id="alur" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Prosedur"
          title="Alur Sertifikasi 5 Langkah"
          subtitle="Proses transparan dari pendaftaran hingga terbitnya sertifikat digital QR-verified — dipantau penuh oleh Dewan Pakar."
        />

        <div className="relative mt-14">
          {/* garis progress desktop */}
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 rounded-full bg-border lg:block" aria-hidden>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-amber-500"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </div>

          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="relative"
                >
                  {/* titik langkah */}
                  <div className="relative z-10 flex items-center gap-4 lg:flex-col lg:items-start">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-600 bg-card shadow-md shadow-emerald-900/10">
                      <Icon className="h-6 w-6 text-emerald-700 dark:text-emerald-400" aria-hidden />
                    </span>
                    <span className="flex items-center gap-2 lg:mt-3">
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        LANGKAH {idx + 1}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                        {step.duration}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 lg:mt-2 lg:pl-0">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
