"use client";

import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Twitter, Youtube } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";

const PROGRAM_LINKS = [
  { href: "#program", label: "Akreditasi PPIU" },
  { href: "#program", label: "Akreditasi BPW" },
  { href: "#program", label: "Sertifikasi PIHK" },
  { href: "#program", label: "Sertifikasi IATA" },
  { href: "#program", label: "Izin Umrah & Haji" },
];

const SERVICE_LINKS = [
  { href: "#verifikasi", label: "Verifikasi Sertifikat" },
  { href: "#direktori", label: "Direktori Lembaga" },
  { href: "#lacak", label: "Lacak Pendaftaran" },
  { href: "#dewan-pakar", label: "Dewan Pakar" },
  { href: "#faq", label: "Tanya Jawab" },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook PUSAKA" },
  { icon: Instagram, label: "Instagram PUSAKA" },
  { icon: Twitter, label: "Twitter / X PUSAKA" },
  { icon: Youtube, label: "YouTube PUSAKA" },
];

export function Footer() {
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen);
  const setShowAdmin = useAdminStore((s) => s.setShowAdmin);
  const openAdminPanel = () => {
    const authed = useAdminStore.getState().status === "authed";
    if (authed) setShowAdmin(true);
    else setLoginOpen(true);
  };

  return (
    <footer className="mt-auto bg-emerald-950 pb-safe text-emerald-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-xl font-black text-white">
                P
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-white">PUSAKA</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                  Sertifikasi &amp; Akreditasi
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-emerald-200/70">
              Pusat Sertifikasi &amp; Akreditasi Kompetensi untuk industri perjalanan wisata,
              umrah &amp; haji Indonesia — dengan Dewan Pakar 46 lintas bidang dan sertifikat
              digital QR-verified.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#beranda"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-800 bg-emerald-900/40 text-emerald-300 transition-colors hover:border-amber-500/60 hover:text-amber-400"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>

          {/* program */}
          <nav aria-label="Tautan program">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              Program
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PROGRAM_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-emerald-200/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* layanan */}
          <nav aria-label="Tautan layanan">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              Layanan
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-emerald-200/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* kontak */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-amber-400">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-200/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                Gedung Pusdai Lt. 5, Jl. Lapangan Banteng Selatan No. 3, Jakarta Pusat 10710
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                sekretariat@pusaka.go.id
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                +62 21 350 5075
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* bar bawah */}
      <div className="border-t border-emerald-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-emerald-300/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} PUSAKA • Terdaftar &amp; Diawasi oleh Dewan Pakar Nasional
          </p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-amber-400" aria-hidden />
              ISO 9001:2015
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3 text-amber-400" aria-hidden />
              BNSP Listed
            </span>
            <button
              type="button"
              onClick={openAdminPanel}
              aria-label="Buka Panel Admin PUSAKA"
              className="rounded-md px-2 py-1 text-[11px] text-emerald-300/30 transition-colors hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Panel Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
