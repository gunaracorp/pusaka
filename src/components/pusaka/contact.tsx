"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn } from "@/components/pusaka/fade-in";
import { postContact } from "@/lib/pusaka";
import { useI18n } from "@/lib/i18n/provider";
import { toast } from "sonner";

export function ContactCTA() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  // Info kontak kiri — label & nilai "hidup" diterjemahkan; alamat & email tetap literal.
  const CONTACT_INFO = [
    {
      key: "address",
      icon: MapPin,
      label: t("contact.info.addressLabel"),
      value: "Gedung Pusdai Lt. 5, Jl. Lapangan Banteng Selatan No. 3, Jakarta Pusat 10710",
    },
    {
      key: "email",
      icon: Mail,
      label: t("contact.info.emailLabel"),
      value: "sekretariat@pusaka.go.id",
    },
    {
      key: "phone",
      icon: Phone,
      label: t("contact.info.phoneLabel"),
      value: t("contact.info.phoneValue"),
    },
    {
      key: "hours",
      icon: Clock,
      label: t("contact.info.hoursLabel"),
      value: t("contact.info.hoursValue"),
    },
  ];

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    if (form.name.trim().length < 3) {
      toast.error(t("contact.valid.name"));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error(t("contact.valid.email"));
      return false;
    }
    if (form.subject.trim().length < 3) {
      toast.error(t("contact.valid.subject"));
      return false;
    }
    if (form.message.trim().length < 10) {
      toast.error(t("contact.valid.message"));
      return false;
    }
    return true;
  }

  async function submit() {
    if (!validate()) return;
    setSending(true);
    try {
      await postContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast.success(t("contact.success.sent"));
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("contact.error.send"));
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="kontak" className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* kiri: CTA gelap */}
          <FadeIn>
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-8 sm:p-10">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"
                aria-hidden
              />
              <div>
                <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
                  {t("contact.cta.title1")}{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {t("contact.cta.titleAccent")}
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100/80 sm:text-base">
                  {t("contact.cta.desc")}
                </p>

                <ul className="mt-8 space-y-4">
                  {CONTACT_INFO.map((info) => {
                    const Icon = info.icon;
                    return (
                      <li key={info.key} className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-700/60 bg-emerald-800/40 text-amber-400">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                            {info.label}
                          </p>
                          <p className="mt-0.5 text-sm leading-relaxed text-emerald-50">
                            {info.value}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="mt-10 border-t border-emerald-800/60 pt-5 text-xs text-emerald-300/60">
                {t("contact.cta.footnote")}
              </p>
            </div>
          </FadeIn>

          {/* kanan: form kontak */}
          <FadeIn delay={0.12}>
            <Card className="h-full border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {t("contact.form.title")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("contact.form.desc")}
                </p>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">{t("contact.form.name")}</Label>
                      <Input
                        id="contact-name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder={t("contact.form.namePlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">{t("contact.form.email")}</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder={t("contact.form.emailPlaceholder")}
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">{t("contact.form.subject")}</Label>
                    <Input
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      placeholder={t("contact.form.subjectPlaceholder")}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">{t("contact.form.message")}</Label>
                    <Textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder={t("contact.form.messagePlaceholder")}
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="h-12 w-full bg-emerald-700 text-base font-bold hover:bg-emerald-800"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                    {sending ? t("contact.form.sending") : t("contact.form.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
