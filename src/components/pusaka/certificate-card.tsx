"use client";

import { BadgeCheck, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_META, TIER_META, TYPE_META, formatDate, qrPattern } from "@/lib/pusaka";
import type { InstitutionT } from "@/lib/pusaka";

/** Kartu Sertifikat Digital premium — dipakai di hasil verifikasi. */
export function CertificateCard({
  institution,
  programName,
}: {
  institution: InstitutionT;
  programName?: string | null;
}) {
  const bits = qrPattern(`${institution.certNumber}-${institution.tier}`);
  const tierMeta = TIER_META[institution.tier] ?? TIER_META.SILVER;
  const statusMeta = STATUS_META[institution.status];
  const typeMeta = TYPE_META[institution.type];
  const today = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const expired = institution.status === "KADALUARSA";

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 shadow-2xl shadow-emerald-950/40">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-shine absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-500 font-display text-xl font-black text-white">
            P
          </span>
          <div>
            <p className="font-display text-sm font-extrabold tracking-wide text-white">
              PUSAKA
            </p>
            <p className="text-[10px] uppercase tracking-widest text-emerald-300/80">
              Sertifikat Digital Resmi
            </p>
          </div>
        </div>
        <Badge variant="outline" className={`font-mono text-[10px] font-bold tracking-widest ${tierMeta.badgeClass}`}>
          {tierMeta.label}
        </Badge>
      </div>

      {/* nomor & institusi */}
      <div className="mt-6 rounded-xl border border-emerald-700/50 bg-emerald-950/70 p-4">
        <p className="text-[10px] uppercase tracking-widest text-emerald-400">
          Nomor Sertifikat
        </p>
        <p className="mt-1 font-mono text-xl font-bold tracking-wider text-white sm:text-2xl">
          {institution.certNumber}
        </p>

        <p className="mt-4 text-[10px] uppercase tracking-widest text-emerald-300/70">
          Diterbitkan kepada
        </p>
        <p className="font-display text-lg font-bold leading-snug text-white">
          {institution.name}
        </p>

        <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
          <p className="text-emerald-100/80">
            <span className="block text-[10px] uppercase tracking-widest text-emerald-400/70">
              Jenis Lembaga
            </span>
            {typeMeta ? `${typeMeta.label} — ${typeMeta.desc}` : institution.type}
          </p>
          <p className="text-emerald-100/80">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-emerald-400/70">
              <Building2 className="h-3 w-3" aria-hidden /> Wilayah
            </span>
            {institution.city}, {institution.province}
          </p>
          {programName ? (
            <p className="text-emerald-100/80">
              <span className="block text-[10px] uppercase tracking-widest text-emerald-400/70">
                Program
              </span>
              {programName}
            </p>
          ) : null}
          <p className="text-emerald-100/80">
            <span className="block text-[10px] uppercase tracking-widest text-emerald-400/70">
              Skor Audit
            </span>
            <span className="font-mono text-sm font-bold text-amber-300">
              {institution.score}
            </span>
            <span className="text-emerald-300/60"> / 100</span>
          </p>
        </div>
      </div>

      {/* tanggal + QR */}
      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="space-y-1.5 text-xs text-emerald-100/80">
          <p>
            <span className="text-emerald-400/80">Diterbitkan:</span>{" "}
            {formatDate(institution.issuedAt)}
          </p>
          <p>
            <span className="text-emerald-400/80">Berlaku s.d.:</span>{" "}
            {formatDate(institution.expiresAt)}
          </p>
          <p className="pt-1">
            {statusMeta ? (
              <Badge
                className={`border px-2 py-0.5 text-[10px] font-bold ${
                  expired ? statusMeta.badgeClass : "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {expired ? "✕ KADALUARSA" : `✓ ${statusMeta.label}`}
              </Badge>
            ) : null}
          </p>
        </div>
        <div
          className="grid shrink-0 grid-cols-5 gap-[3px] rounded-md bg-white p-2 shadow-inner"
          aria-hidden
        >
          {bits.map((on, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-[2px] ${on ? "bg-emerald-900" : "bg-stone-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-emerald-800/60 pt-3 text-[10px] uppercase tracking-widest text-emerald-300/70">
        <BadgeCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden />
        Diverifikasi oleh PUSAKA • {today}
      </div>
    </div>
  );
}
