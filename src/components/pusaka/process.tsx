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
import { useI18n } from "@/lib/i18n/provider";

const STEPS: { key: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "register", icon: FileSignature },
  { key: "verification", icon: ClipboardCheck },
  { key: "training", icon: GraduationCap },
  { key: "audit", icon: Hourglass },
  { key: "certificate", icon: QrCode },
];

export function Process() {
  const { t } = useI18n();

  return (
    <section id="alur" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("process.eyebrow")}
          title={t("process.title")}
          subtitle={t("process.subtitle")}
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
                  key={step.key}
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
                        {t("process.stepLabel", { n: idx + 1 })}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                        {t(`process.steps.${step.key}.duration`)}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 lg:mt-2 lg:pl-0">
                    <h3 className="font-display text-base font-bold text-foreground">
                      {t(`process.steps.${step.key}.title`)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {t(`process.steps.${step.key}.desc`)}
                    </p>
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
