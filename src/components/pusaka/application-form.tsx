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
import {
  formatIDR,
  getPrograms,
  postApplication,
  type ProgramT,
} from "@/lib/pusaka";
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

const STEP_LABELS = ["Data Pemohon", "Pilih Program", "Ringkasan"];

export function ApplicationForm() {
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
      toast.error("Nama lengkap minimal 3 karakter.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Alamat email tidak valid.");
      return false;
    }
    if (form.phone.replace(/\D/g, "").length < 9) {
      toast.error("Nomor telepon minimal 9 digit.");
      return false;
    }
    if (form.applicantType === "PERUSAHAAN" && form.institution.trim().length < 3) {
      toast.error("Nama institusi/perusahaan wajib diisi untuk pemohon perusahaan.");
      return false;
    }
    if (form.city.trim().length < 2) {
      toast.error("Kota/domisili wajib diisi.");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!form.programCode) {
      toast.error("Silakan pilih program sertifikasi terlebih dahulu.");
      return false;
    }
    return true;
  }

  function validateStep3(): boolean {
    if (!form.agree) {
      toast.error("Anda harus menyetujui syarat & ketentuan sertifikasi.");
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
      toast.success("Pendaftaran berhasil dikirim!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengirim pendaftaran.");
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
      <section id="pendaftaran" className="scroll-mt-20 bg-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card className="border-emerald-200 shadow-xl shadow-emerald-900/10">
              <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:p-12">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <PartyPopper className="h-8 w-8" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-black text-stone-900 sm:text-3xl">
                    Pendaftaran Berhasil Dikirim
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Tim admisi kami akan memverifikasi berkas dalam 1 × 24 jam. Simpan kode
                    pelacakan berikut untuk memantau status pendaftaran Anda.
                  </p>
                </div>

                <div className="w-full rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Kode Pelacakan Anda
                  </p>
                  <p className="mt-2 font-mono text-3xl font-black tracking-wider text-emerald-800 sm:text-4xl">
                    {successCode}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(successCode)
                        .then(() => toast.success("Kode pelacakan disalin ke papan klip."))
                        .catch(() => toast.error("Gagal menyalin — salin manual."));
                    }}
                  >
                    <ClipboardCopy className="h-4 w-4" aria-hidden />
                    Salin Kode
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    asChild
                    className="h-11 bg-emerald-700 hover:bg-emerald-800"
                  >
                    <a href="#lacak">Lacak Status Sekarang</a>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={resetForm}
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Daftar Lagi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    );
  }

  // ---------- FORM MULTI-STEP ----------
  return (
    <section id="pendaftaran" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pendaftaran"
          title="Formulir Pendaftaran Sertifikasi"
          subtitle="Tiga langkah singkat menuju sertifikat digital PUSAKA. Data Anda dijaga kerahasiaannya sesuai regulasi perlindungan data."
        />

        {/* stepper */}
        <FadeIn delay={0.1} className="mt-10">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={label} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-colors ${
                        done
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : active
                            ? "border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/30"
                            : "border-stone-300 bg-white text-stone-400"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : n}
                    </span>
                    <span
                      className={`text-center text-[10px] font-semibold uppercase tracking-wider sm:text-xs ${
                        active ? "text-emerald-800" : "text-stone-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {n < 3 ? (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full sm:mx-4 ${
                        step > n ? "bg-emerald-600" : "bg-stone-200"
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
          <Card className="border-stone-200 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {/* LANGKAH 1 */}
              {step === 1 ? (
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-semibold">Tipe Pemohon</Label>
                    <RadioGroup
                      value={form.applicantType}
                      onValueChange={(v) => set("applicantType", v as FormState["applicantType"])}
                      className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                      {(
                        [
                          { value: "PERUSAHAAN", label: "Perusahaan / Lembaga", desc: "PPIU, BPW, PIHK, IATA", icon: Building2 },
                          { value: "INDIVIDU", label: "Individu / Profesi", desc: "Profesional & komisaris", icon: User },
                        ] as const
                      ).map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <Label
                            key={opt.value}
                            htmlFor={`type-${opt.value}`}
                            className={`flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                              form.applicantType === opt.value
                                ? "border-emerald-600 bg-emerald-50"
                                : "border-stone-200 hover:border-emerald-300"
                            }`}
                          >
                            <RadioGroupItem value={opt.value} id={`type-${opt.value}`} className="mt-1" />
                            <span>
                              <span className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
                                <Icon className="h-4 w-4 text-emerald-700" aria-hidden />
                                {opt.label}
                              </span>
                              <span className="mt-0.5 block text-xs text-stone-500">{opt.desc}</span>
                            </span>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        placeholder="Nama sesuai dokumen resmi"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="nama@email.com"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Nomor Telepon / WhatsApp *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">Kota / Domisili *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        placeholder="mis. Jakarta Selatan"
                        className="h-11"
                      />
                    </div>
                  </div>

                  {form.applicantType === "PERUSAHAAN" ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="institution">Nama Institusi / Perusahaan *</Label>
                      <Input
                        id="institution"
                        value={form.institution}
                        onChange={(e) => set("institution", e.target.value)}
                        placeholder="mis. PT Cahaya Thaif Travel Indonesia"
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
                    <Label htmlFor="program">Program Sertifikasi *</Label>
                    <Select
                      value={form.programCode}
                      onValueChange={(v) => set("programCode", v)}
                    >
                      <SelectTrigger id="program" className="h-12 w-full">
                        <SelectValue placeholder="Pilih program sertifikasi…" />
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
                        Daftar program gagal dimuat — muat ulang halaman.
                      </p>
                    ) : null}
                  </div>

                  {selectedProgram ? (
                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:grid-cols-3">
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          <FileText className="h-3 w-3" aria-hidden /> Investasi
                        </p>
                        <p className="mt-1 font-display text-lg font-black text-emerald-700">
                          {formatIDR(selectedProgram.price)}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          <CalendarDays className="h-3 w-3" aria-hidden /> Durasi
                        </p>
                        <p className="mt-1 font-display text-lg font-black text-stone-800">
                          {selectedProgram.durationDays} Hari
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          Tingkat Kelulusan
                        </p>
                        <p className="mt-1 font-display text-lg font-black text-amber-600">
                          {selectedProgram.passRate}%
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed text-stone-500 sm:col-span-3">
                        {selectedProgram.tagline}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* LANGKAH 3 */}
              {step === 3 ? (
                <div className="space-y-5">
                  <div className="rounded-xl border bg-stone-50 p-4">
                    <h4 className="font-display text-sm font-bold uppercase tracking-widest text-stone-500">
                      Ringkasan Pendaftaran
                    </h4>
                    <dl className="mt-3 space-y-2 text-sm">
                      {[
                        ["Tipe Pemohon", form.applicantType === "PERUSAHAAN" ? "Perusahaan / Lembaga" : "Individu / Profesi"],
                        ["Nama Lengkap", form.fullName],
                        ["Email", form.email],
                        ["Telepon", form.phone],
                        ["Kota", form.city],
                        ["Institusi", form.applicantType === "PERUSAHAAN" ? form.institution : "—"],
                        [
                          "Program",
                          selectedProgram
                            ? `${selectedProgram.shortName} (${formatIDR(selectedProgram.price)} • ${selectedProgram.durationDays} hari)`
                            : form.programCode,
                        ],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 border-b border-stone-200/70 pb-2 last:border-0">
                          <dt className="shrink-0 text-stone-500">{k}</dt>
                          <dd className="text-right font-medium text-stone-800">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Catatan Tambahan (opsional)</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Informasi tambahan untuk tim admisi…"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                    <Checkbox
                      id="agree"
                      checked={form.agree}
                      onCheckedChange={(v) => set("agree", v === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="agree" className="cursor-pointer text-xs leading-relaxed text-stone-600">
                      Saya menyatakan data yang diisi benar & menyetujui syarat dan ketentuan
                      sertifikasi PUSAKA, termasuk kebijakan biaya, jadwal audit, dan kode etik
                      lembaga terakreditasi.
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
                  Kembali
                </Button>
                {step < 3 ? (
                  <Button
                    className="h-11 min-w-32 bg-emerald-700 hover:bg-emerald-800"
                    onClick={next}
                  >
                    Lanjut ke {STEP_LABELS[step]}
                  </Button>
                ) : (
                  <Button
                    className="h-11 min-w-36 bg-amber-500 font-bold text-emerald-950 hover:bg-amber-400"
                    disabled={submitting}
                    onClick={() => void submit()}
                  >
                    {submitting ? "Mengirim…" : "Kirim Pendaftaran"}
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
