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
import { toast } from "sonner";

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Kantor Sekretariat",
    value: "Gedung Pusdai Lt. 5, Jl. Lapangan Banteng Selatan No. 3, Jakarta Pusat 10710",
  },
  { icon: Mail, label: "Email Resmi", value: "sekretariat@pusaka.go.id" },
  { icon: Phone, label: "Telepon / WhatsApp", value: "+62 21 350 5075 (hotline 24 jam)" },
  {
    icon: Clock,
    label: "Jam Layanan",
    value: "Senin – Jumat, 08.00 – 16.00 WIB (layanan verifikasi daring 24 jam)",
  },
];

export function ContactCTA() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    if (form.name.trim().length < 3) {
      toast.error("Nama minimal 3 karakter.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Alamat email tidak valid.");
      return false;
    }
    if (form.subject.trim().length < 3) {
      toast.error("Subjek minimal 3 karakter.");
      return false;
    }
    if (form.message.trim().length < 10) {
      toast.error("Pesan minimal 10 karakter.");
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
      toast.success("Pesan terkirim! Tim kami membalas maksimal 1 × 24 jam kerja.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="kontak" className="scroll-mt-20 bg-stone-50 py-16 sm:py-20">
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
                  Siap Menjadi Lembaga{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                    Terakreditasi?
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-100/80 sm:text-base">
                  Bergabunglah bersama ribuan lembaga & profesional yang telah memegang sertifikat
                  PUSAKA. Tim konsultasi kami siap membantu memilih jalur sertifikasi yang tepat
                  untuk profil Anda — gratis.
                </p>

                <ul className="mt-8 space-y-4">
                  {CONTACT_INFO.map((info) => {
                    const Icon = info.icon;
                    return (
                      <li key={info.label} className="flex items-start gap-3">
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
                PUSAKA — Pusat Sertifikasi &amp; Akreditasi Kompetensi • Terakreditasi berlaku
                nasional &amp; internasional
              </p>
            </div>
          </FadeIn>

          {/* kanan: form kontak */}
          <FadeIn delay={0.12}>
            <Card className="h-full border-stone-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-stone-900">Kirim Pesan</h3>
                <p className="mt-1 text-sm text-stone-500">
                  Pertanyaan seputar program, biaya, atau jadwal audit — kami siap membantu.
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
                      <Label htmlFor="contact-name">Nama *</Label>
                      <Input
                        id="contact-name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Nama Anda"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="nama@email.com"
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">Subjek *</Label>
                    <Input
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      placeholder="mis. Konsultasi akreditasi BPW"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Pesan *</Label>
                    <Textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tulis pertanyaan Anda…"
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="h-12 w-full bg-emerald-700 text-base font-bold hover:bg-emerald-800"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                    {sending ? "Mengirim…" : "Kirim Pesan"}
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
