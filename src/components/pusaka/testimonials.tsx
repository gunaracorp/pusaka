"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { useI18n } from "@/lib/i18n/provider";

/** Nama & rating adalah data lokal (nama tidak diterjemahkan); role/city/quote via dict. */
const TESTIMONIAL_META = [
  { name: "H. Ahmad Fauzi Ridwan", rating: 5 },
  { name: "Siti Aminah Wibowo", rating: 5 },
  { name: "Ir. Bambang Setiawan", rating: 5 },
  { name: "Rizky Pratama Halim", rating: 5 },
  { name: "Dra. Nurul Hidayati, M.M.", rating: 4 },
];

const TESTIMONIAL_COUNT = TESTIMONIAL_META.length;

export function Testimonials() {
  const { t, dir } = useI18n();
  const rtl = dir === "rtl";
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function go(delta: number) {
    setDirection(delta);
    setIndex((i) => (i + delta + TESTIMONIAL_COUNT) % TESTIMONIAL_COUNT);
  }

  const item = TESTIMONIAL_META[index];
  const n = index + 1;
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <section id="testimoni" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("testimonials.eyebrow")}
          title={t("testimonials.title")}
          subtitle={t("testimonials.subtitle")}
        />

        <FadeIn delay={0.1} className="mt-10">
          <div className="relative">
            <Card className="overflow-hidden border-border shadow-lg shadow-emerald-900/5">
              <CardContent className="relative min-h-[300px] p-8 sm:p-10">
                <Quote
                  className="absolute end-6 top-6 h-16 w-16 text-emerald-500/15"
                  aria-hidden
                />
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: direction * 60 * (rtl ? -1 : 1) }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -60 * (rtl ? -1 : 1) }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative"
                  >
                    <div
                      className="flex items-center gap-1"
                      aria-label={t("testimonials.ratingAria", { rating: item.rating })}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < item.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted-foreground/25 text-muted-foreground/25"
                          }`}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-base leading-relaxed text-foreground/90 sm:text-lg">
                      &ldquo;{t(`testimonials.items.${n}.quote`)}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-amber-500 font-display text-sm font-black text-white"
                        aria-hidden
                      >
                        {item.name
                          .split(" ")
                          .filter((w) => /^[A-Z]/.test(w) && !w.includes("."))
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-foreground">{item.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="border-emerald-600/30 bg-emerald-500/10 text-[10px] text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-300">
                            {t(`testimonials.items.${n}.role`)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {t(`testimonials.items.${n}.city`)}
                          </span>
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
                aria-label={t("testimonials.prevAria")}
              >
                <PrevIcon className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-1.5">
                {TESTIMONIAL_META.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-emerald-700" : "w-2 bg-muted-foreground/30 hover:bg-emerald-500/50"
                    }`}
                    aria-label={t("testimonials.goToAria", { count: i + 1 })}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={() => go(1)}
                aria-label={t("testimonials.nextAria")}
              >
                <NextIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
