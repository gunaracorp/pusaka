"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCopy,
  FileText,
  PartyPopper,
  RotateCcw,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";
import { PaymentPanel } from "@/components/pusaka/payment-panel";
import { useI18n } from "@/lib/i18n/provider";
import { getPrograms, postApplication, type ProgramT } from "@/lib/pusaka";
import { toast } from "sonner";

interface FormState {
  applicantType: "PERUSAHAAN" | "INDIVIDU";
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  programCode: string;
  message: string;
  agree: boolean;
}

const INITIAL: FormState = {
  applicantType: "PERUSAHAAN",
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  city: "",
  programCode: "",
  message: "",
  agree: false,
};

/** Kunci langkah stepper → t(`applicationForm.step.<key>`). */
const STEP_KEYS = ["dataPemohon", "pilihProgram", "ringkasan"] as const;

export function ApplicationForm() {
  const { t, formatCurrency } = useI18n();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [programs, setPrograms] = useState<ProgramT[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getPrograms()
      .then((data) => {
        if (alive) setPrograms(data);
      })
      .catch(() => {
        /* select akan menampilkan pesan bila kosong */
      });
    return () => {
      alive = false;
    };
  }, []);

  // dengarkan pilihan program dari dialog detail
  useEffect(() => {
    const handler = (e: Event) => {
      const code = (e as CustomEvent<string>).detail;
      if (typeof code === "string") {
        setForm((f) => ({ ...f, programCode: code }));
        setStep((s) => (s === 1 ? 2 : s));
      }
    };
    window.addEventListener("pusaka:select-program", handler);
    return () => window.removeEventListener("pusaka:select-program", handler);
  }, []);

  const selectedProgram = useMemo(
    () => programs.find((p) => p.code === form.programCode) ?? null,
    [programs, form.programCode]
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateStep1(): boolean {
    if (form.fullName.trim().length < 3) {
      toast.error(t("applicationForm.errName"));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error(t("applicationForm.errEmail"));
      return false;
    }
    if (form.phone.replace(/\D/g, "").length < 9) {
      toast.error(t("applicationForm.errPhone"));
      return false;
    }
    if (form.applicantType === "PERUSAHAAN" && form.institution.trim().length < 3) {
      toast.error(t("applicationForm.errInstitution"));
      return false;
    }
    if (form.city.trim().length < 2) {
      toast.error(t("applicationForm.errCity"));
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!form.programCode) {
      toast.error(t("applicationForm.errProgram"));
      return false;
    }
    return true;
  }

  function validateStep3(): boolean {
    if (!form.agree) {
      toast.error(t("applicationForm.errAgree"));
      return false;
    }
    return true;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(3, s + 1));
  }

  async function submit() {
    if (!validateStep3()) return;
    setSubmitting(true);
    try {
      const res = await postApplication({
        applicantType: form.applicantType,
        programCode: form.programCode,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        institution: form.applicantType === "PERUSAHAAN" ? form.institution.trim() : undefined,
        city: form.city.trim(),
        message: form.message.trim() || undefined,
      });
      setSuccessCode(res.trackingCode);
      toast.success(t("applicationForm.successToast"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("applicationForm.failToast"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(INITIAL);
    setStep(1);
    setSuccessCode(null);
  }

  const progressValue = successCode ? 100 : (step / 3) * 100;

  // ---------- LAYAR SUKSES ----------
  if (successCode) {
    return (
      <section id="pendaftaran" className="scroll-mt-20 bg-card py-16 sm:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card className="border-emerald-600/30 shadow-xl shadow-emerald-900/10 dark:border-emerald-500/30">
              <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:p-12">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <PartyPopper className="h-8 w-8" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-black text-foreground sm:text-3xl">
                    {t("applicationForm.successTitle")}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("applicationForm.successDesc")}
                  </p>
                </div>

                <div className="w-full rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-500/10 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                    {t("applicationForm.trackingLabel")}
                  </p>
                  <p className="mt-2 font-mono text-3xl font-black tracking-wider text-emerald-800 sm:text-4xl dark:text-emerald-300">
                    {successCode}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-emerald-500/40 text-emerald-800 hover:bg-emerald-500/10 dark:text-emerald-300"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(successCode)
                        .then(() => toast.success(t("applicationForm.copiedToast")))
                        .catch(() => toast.error(t("applicationForm.copyErrorToast")));
                    }}
                  >
                    <ClipboardCopy className="h-4 w-4" aria-hidden />
                    {t("applicationForm.copyCode")}
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    asChild
                    className="h-11 bg-emerald-700 hover:bg-emerald-800"
                  >
                    <a href="#lacak">{t("applicationForm.trackNow")}</a>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={resetForm}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    {t("applicationForm.registerAgain")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Pembayaran biaya sertifikasi — panel mandiri di bawah kartu kode pelacakan */}
          <FadeIn delay={0.1} className="mt-6">
            <section
              aria-labelledby="payment-heading"
              className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <h3
                id="payment-heading"
                className="font-display text-lg font-bold text-foreground"
              >
                {t("applicationForm.paymentTitle")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("applicationForm.paymentSubtitle")}
              </p>
              <PaymentPanel
                className="mt-5"
                trackingCode={successCode}
                amountDue={selectedProgram?.price}
                onPaid={() => toast.success(t("applicationForm.paymentDoneToast"))}
              />
            </section>
          </FadeIn>
        </div>
      </section>
    );
  }

  // ---------- FORM MULTI-STEP ----------
  return (
    <section id="pendaftaran" className="scroll-mt-20 bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("applicationForm.eyebrow")}
          title={t("applicationForm.title")}
          subtitle={t("applicationForm.subtitle")}
        />

        {/* stepper */}
        <FadeIn delay={0.1} className="mt-10">
          <div className="flex items-center justify-between">
            {STEP_KEYS.map((key, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              const label = t(`applicationForm.step.${key}`);
              return (
                <div key={key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-colors ${
                        done
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : active
                            ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/30"
                            : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : n}
                    </span>
                    <span
                      className={`text-center text-[10px] font-semibold uppercase tracking-wider sm:text-xs ${
                        active ? "text-emerald-800 dark:text-emerald-300" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {n < 3 ? (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full sm:mx-4 ${
                        step > n ? "bg-emerald-600" : "bg-border"
                      }`}
                      aria-hidden
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <Progress value={progressValue} className="mt-4 h-1.5 [&>div]:bg-emerald-600" />
        </FadeIn>

        <FadeIn delay={0.15} className="mt-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {/* LANGKAH 1 */}
              {step === 1 ? (
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-semibold">
                      {t("applicationForm.typeLabel")}
                    </Label>
                    <RadioGroup
                      value={form.applicantType}
                      onValueChange={(v) => set("applicantType", v as FormState["applicantType"])}
                      className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {(
                        [
                          {
                            value: "PERUSAHAAN",
                            label: t("applicationForm.typeCompany"),
                            desc: t("applicationForm.typeCompanyDesc"),
                            icon: Building2,
                          },
                          {
                            value: "INDIVIDU",
                            label: t("applicationForm.typeIndividual"),
                            desc: t("applicationForm.typeIndividualDesc"),
                            icon: User,
                          },
                        ] as const
                      ).map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <Label
                            key={opt.value}
                            htmlFor={`type-${opt.value}`}
                            className={`flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                              form.applicantType === opt.value
                                ? "border-emerald-600 bg-emerald-500/10"
                                : "border-border hover:border-emerald-500/40"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={`type-${opt.value}`} className="mt-1" />
                            <span>
                              <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden />
                                {opt.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-muted-foreground">{opt.desc}</span>
                            </span>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">{t("applicationForm.fullName")}</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        placeholder={t("applicationForm.fullNamePlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">{t("applicationForm.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder={t("applicationForm.emailPlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">{t("applicationForm.phone")}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder={t("applicationForm.phonePlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">{t("applicationForm.city")}</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        placeholder={t("applicationForm.cityPlaceholder")}
                        className="h-11"
                      />
                    </div>
                  </div>

                  {form.applicantType === "PERUSAHAAN" ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="institution">{t("applicationForm.institution")}</Label>
                      <Input
                        id="institution"
                        value={form.institution}
                        onChange={(e) => set("institution", e.target.value)}
                        placeholder={t("applicationForm.institutionPlaceholder")}
                        className="h-11"
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* LANGKAH 2 */}
              {step === 2 ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="program">{t("applicationForm.programLabel")}</Label>
                    <Select
                      value={form.programCode}
                      onValueChange={(v) => set("programCode", v)}
                    >
                      <SelectTrigger id="program" className="h-12 w-full">
                        <SelectValue placeholder={t("applicationForm.programPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((p) => (
                          <SelectItem key={p.id} value={p.code}>
                            {p.shortName} — {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {programs.length === 0 ? (
                      <p className="text-xs text-red-500">
                        {t("applicationForm.programLoadError")}
                      </p>
                    ) : null}
                  </div>

                  {selectedProgram ? (
                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4 sm:grid-cols-3">
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <FileText className="h-3 w-3" aria-hidden /> {t("applicationForm.investLabel")}
                        </p>
                        <p className="mt-1 font-display text-lg font-black text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(selectedProgram.price)}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          <CalendarDays className="h-3 w-3" aria-hidden /> {t("applicationForm.durationLabel")}
                        </p>
                        <p className="mt-1 font-display text-lg font-black text-foreground">
                          {selectedProgram.durationDays} {t("applicationForm.dayUnit")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {t("applicationForm.passRateLabel")}
                        </p>
                        <p className="mt-1 font-display text-lg font-black text-amber-600 dark:text-amber-400">
                          {selectedProgram.passRate}%
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-3">
                        {selectedProgram.tagline}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* LANGKAH 3 */}
              {step === 3 ? (
                <div className="space-y-5">
                  <div className="rounded-xl border bg-muted/50 p-4">
                    <h4 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      {t("applicationForm.summaryTitle")}
                    </h4>
                    <dl className="mt-3 space-y-2 text-sm">
                      {[
                        [
                          t("applicationForm.rowType"),
                          form.applicantType === "PERUSAHAAN"
                            ? t("applicationForm.typeCompany")
                            : t("applicationForm.typeIndividual"),
                        ],
                        [t("applicationForm.rowName"), form.fullName],
                        [t("applicationForm.rowEmail"), form.email],
                        [t("applicationForm.rowPhone"), form.phone],
                        [t("applicationForm.rowCity"), form.city],
                        [
                          t("applicationForm.rowInstitution"),
                          form.applicantType === "PERUSAHAAN" ? form.institution : "—",
                        ],
                        [
                          t("applicationForm.rowProgram"),
                          selectedProgram
                            ? `${selectedProgram.shortName} (${formatCurrency(selectedProgram.price)} • ${selectedProgram.durationDays} ${t("applicationForm.dayUnit")})`
                            : form.programCode,
                        ],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 border-b border-border/70 pb-2 last:border-0">
                          <dt className="shrink-0 text-muted-foreground">{k}</dt>
                          <dd className="text-right font-medium text-foreground">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">{t("applicationForm.messageLabel")}</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder={t("applicationForm.messagePlaceholder")}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <Checkbox
                      id="agree"
                      checked={form.agree}
                      onCheckedChange={(v) => set("agree", v === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="agree" className="cursor-pointer text-xs leading-relaxed text-muted-foreground">
                      {t("applicationForm.agreeLabel")}
                    </Label>
                  </div>
                </div>
              ) : null}

              {/* navigasi */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  className="h-11 min-w-28"
                  disabled={step === 1 || submitting}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  {t("applicationForm.back")}
                </Button>
                {step < 3 ? (
                  <Button
                    className="h-11 min-w-32 bg-emerald-700 hover:bg-emerald-800"
                    onClick={next}
                  >
                    {t("applicationForm.nextTo", {
                      step: t(`applicationForm.step.${STEP_KEYS[step]}`),
                    })}
                  </Button>
                ) : (
                  <Button
                    className="h-11 min-w-36 bg-amber-500 font-bold text-emerald-950 hover:bg-amber-400"
                    disabled={submitting}
                    onClick={() => void submit()}
                  >
                    {submitting ? t("applicationForm.sending") : t("applicationForm.submit")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
