"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";

const TESTIMONIALS = [
  {
    name: "H. Ahmad Fauzi Ridwan",
    role: "Pemegang Sertifikat PPIU",
    city: "Jakarta Selatan",
    rating: 5,
    quote:
      "Proses auditnya ketat tapi sangat profesional. Setelah terakreditasi PPIU PLATINUM, tingkat kepercayaan jemaah meningkat drastis dan pendaftaran paket naik hingga 40%. Sertifikat digitalnya juga gampang diverifikasi calon jemaah lewat QR.",
  },
  {
    name: "Siti Aminah Wibowo",
    role: "Pendamping Haji Khusus PIHK",
    city: "Surabaya",
    rating: 5,
    quote:
      "Kurikulum dari Dewan Pakar benar-benar mendalami fiqih manasik dan penanganan jemaah lansia. Ujiannya menantang, tetapi setelah lulus saya merasa jauh lebih siap mendampingi jemaah di lapangan.",
  },
  {
    name: "Ir. Bambang Setiawan",
    role: "Direktur BPW Terakreditasi",
    city: "Bandung",
    rating: 5,
    quote:
      "Kami mengikuti alur 5 langkah tanpa kendala — verifikasi berkas hanya satu hari kerja. Asesor lapangannya paham benar industri perjalanan wisata. Laporan auditnya detail dan menjadi bahan perbaikan internal kami.",
  },
  {
    name: "Rizky Pratama Halim",
    role: "Owner Agen Tiket IATA",
    city: "Makassar",
    rating: 5,
    quote:
      "Sertifikasi IATA via PUSAKA membuka akses GDS Amadeus dan Sabre untuk kami. Tim pendampingan membantu menyiapkan dokumen teknis aviasi yang selama ini kami anggap rumit. Layanan kelas dunia.",
  },
  {
    name: "Dra. Nurul Hidayati, M.M.",
    role: "Komisaris PPIU GOLD",
    city: "Yogyakarta",
    rating: 4,
    quote:
      "Yang paling saya hargai adalah transparansi skor audit dan tier. Perusahaan kami tahu persis indikator apa yang harus ditingkatkan untuk meraih tier PLATINUM. Sistem akreditasinya modern dan terukur.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function go(delta: number) {
    setDirection(delta);
    setIndex((i) => (i + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  const t = TESTIMONIALS[index];

  return (
    <section id="testimoni" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimoni"
          title="Cerita Para Pemegang Sertifikat"
          subtitle="Pengalaman nyata lembaga dan profesional yang telah terakreditasi PUSAKA."
        />

        <FadeIn delay={0.1} className="mt-10">
          <div className="relative">
            <Card className="overflow-hidden border-stone-200 shadow-lg shadow-emerald-900/5">
              <CardContent className="relative min-h-[300px] p-8 sm:p-10">
                <Quote
                  className="absolute right-6 top-6 h-16 w-16 text-emerald-100"
                  aria-hidden
                />
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: direction * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="flex items-center gap-1" aria-label={`Rating ${t.rating} dari 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < t.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-stone-200 text-stone-200"
                          }`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-base leading-relaxed text-stone-700 sm:text-lg">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-amber-500 font-display text-sm font-black text-white"
                        aria-hidden
                      >
                        {t.name
                          .split(" ")
                          .filter((w) => /^[A-Z]/.test(w) && !w.includes("."))
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-stone-900">{t.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-800">
                            {t.role}
                          </Badge>
                          <span className="text-xs text-stone-400">{t.city}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* kontrol */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={() => go(-1)}
                aria-label="Testimoni sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-emerald-700" : "w-2 bg-stone-300 hover:bg-emerald-300"
                    }`}
                    aria-label={`Ke testimoni ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={() => go(1)}
                aria-label="Testimoni berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
