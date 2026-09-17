"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { BadgeCheck, Building2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_META, TIER_META, TYPE_META, formatDate, type InstitutionT } from "@/lib/pusaka";

const CERT_FONT = '"Plus Jakarta Sans", system-ui, sans-serif';
const CERT_MONO = 'ui-monospace, "Courier New", monospace';
const CERT_GOLD = "#D4AF37";
const CERT_W = 1600;
const CERT_H = 1130;

/** Potong teks menjadi maksimal `maxLines` baris sesuai lebar maksimum (greedy wrap). */
function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.includes(" ") && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, last.lastIndexOf(" "));
    }
    kept[maxLines - 1] = `${last}…`;
    return kept;
  }
  return lines;
}

/** canvas letterSpacing hanya di browser modern — set bila didukung, abaikan bila tidak. */
function setLetterSpacing(ctx: CanvasRenderingContext2D, px: number): void {
  if ("letterSpacing" in ctx) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
  }
}

/** roundRect dengan fallback arcTo sederhana untuk browser lama. */
function pathRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface CertDrawOptions {
  institution: InstitutionT;
  programName?: string | null;
  qrImage: HTMLImageElement;
  verifyUrl: string;
}

/** Gambar sertifikat digital lengkap pada canvas 1600×1130. */
function drawCertificate(ctx: CanvasRenderingContext2D, opts: CertDrawOptions): void {
  const { institution, programName, qrImage, verifyUrl } = opts;
  const cx = CERT_W / 2;

  // Background: gradasi vertikal emerald-950 → emerald-900 → emerald-950
  const bg = ctx.createLinearGradient(0, 0, 0, CERT_H);
  bg.addColorStop(0, "#022c22");
  bg.addColorStop(0.5, "#064e3b");
  bg.addColorStop(1, "#022c22");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // Border ganda: luar 10px gold (margin 24), dalam 2px gold transparan (margin 40)
  ctx.strokeStyle = CERT_GOLD;
  ctx.lineWidth = 10;
  ctx.strokeRect(24, 24, CERT_W - 48, CERT_H - 48);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, CERT_W - 80, CERT_H - 80);

  // Ornamen sudut kecil garis gold
  ctx.strokeStyle = CERT_GOLD;
  ctx.lineWidth = 3;
  const o = 56;
  const oLen = 70;
  const corners: [number, number, number, number][] = [
    [o, o, 1, 1],
    [CERT_W - o, o, -1, 1],
    [o, CERT_H - o, 1, -1],
    [CERT_W - o, CERT_H - o, -1, -1],
  ];
  for (const [x, y, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x + dx * oLen, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * oLen);
    ctx.stroke();
  }

  // Kiri-atas: logo lingkaran gradient emerald→amber berisi "P" + brand
  const logoX = 122;
  const logoY = 130;
  const logoR = 36;
  const logoGrad = ctx.createLinearGradient(logoX - logoR, logoY - logoR, logoX + logoR, logoY + logoR);
  logoGrad.addColorStop(0, "#059669");
  logoGrad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = logoGrad;
  ctx.beginPath();
  ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 40px ${CERT_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("P", logoX, logoY + 2);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 44px ${CERT_FONT}`;
  setLetterSpacing(ctx, 4);
  ctx.fillText("PUSAKA", logoX + logoR + 20, logoY - 2);
  ctx.fillStyle = "#6ee7b7"; // emerald-300
  ctx.font = `600 16px ${CERT_FONT}`;
  setLetterSpacing(ctx, 3);
  ctx.fillText("SERTIFIKASI & AKREDITASI KOMPETENSI", logoX + logoR + 20, logoY + 28);
  setLetterSpacing(ctx, 0);

  // Judul tengah
  ctx.textAlign = "center";
  ctx.fillStyle = CERT_GOLD;
  ctx.font = `800 54px ${CERT_FONT}`;
  setLetterSpacing(ctx, 14);
  ctx.fillText("SERTIFIKAT DIGITAL RESMI", cx + 7, 300);
  setLetterSpacing(ctx, 0);

  // Penerima
  ctx.fillStyle = "rgba(167, 243, 208, 0.7)"; // emerald-200/70
  ctx.font = `500 18px ${CERT_FONT}`;
  ctx.fillText("Diberikan kepada", cx, 372);

  ctx.font = `800 64px ${CERT_FONT}`;
  const nameLines = wrapTextLines(ctx, institution.name, 1100, 2);
  let y = 448;
  ctx.fillStyle = "#ffffff";
  for (const line of nameLines) {
    ctx.fillText(line, cx, y);
    y += 78;
  }

  if (programName) {
    ctx.fillStyle = "#d1fae5"; // emerald-100
    ctx.font = `600 24px ${CERT_FONT}`;
    ctx.fillText(programName, cx, y + 4);
    y += 44;
  }
  ctx.fillStyle = "rgba(167, 243, 208, 0.8)"; // emerald-200/80
  ctx.font = `500 20px ${CERT_FONT}`;
  ctx.fillText(`${institution.city}, ${institution.province}`, cx, y + 6);
  y += 46;

  // Grid meta 2 kolom
  ctx.textAlign = "left";
  const col1X = 170;
  const col2X = 860;
  const typeMeta = TYPE_META[institution.type];
  const rowH = 88;
  let rowY = Math.max(y + 44, 640);
  const drawLabel = (text: string, x: number, yy: number) => {
    ctx.fillStyle = "#34d399"; // emerald-400
    ctx.font = `700 14px ${CERT_FONT}`;
    setLetterSpacing(ctx, 2);
    ctx.fillText(text.toUpperCase(), x, yy);
    setLetterSpacing(ctx, 0);
  };
  const drawValue = (text: string, x: number, yy: number, font?: string, color = "#ffffff") => {
    ctx.fillStyle = color;
    ctx.font = font ?? `600 22px ${CERT_FONT}`;
    ctx.fillText(text, x, yy);
  };

  drawLabel("Nomor Sertifikat", col1X, rowY);
  drawValue(institution.certNumber, col1X, rowY + 34, `700 22px ${CERT_MONO}`);
  drawLabel("Jenis Lembaga", col2X, rowY);
  drawValue(
    typeMeta ? `${typeMeta.label} — ${typeMeta.desc}` : institution.type,
    col2X,
    rowY + 34,
  );

  rowY += rowH;
  drawLabel("Program", col1X, rowY);
  drawValue(programName ?? institution.programCode, col1X, rowY + 34);
  drawLabel("Skor Audit", col2X, rowY);
  drawValue(`${institution.score} / 100`, col2X, rowY + 34, `700 22px ${CERT_FONT}`, "#fcd34d");

  rowY += rowH;
  drawLabel("Diterbitkan", col1X, rowY);
  drawValue(formatDate(institution.issuedAt), col1X, rowY + 34);
  drawLabel("Berlaku s.d.", col2X, rowY);
  drawValue(formatDate(institution.expiresAt), col2X, rowY + 34);
  const metaEnd = rowY + 34;

  // QR sungguhan di kanan-bawah area meta
  const qrSize = 160;
  const qrX = 1390;
  const frameY = metaEnd + 26 - qrSize - 20;
  const qrY = frameY + 10;
  ctx.fillStyle = "#ffffff";
  pathRoundRect(ctx, qrX - 10, frameY, qrSize + 20, qrSize + 20, 10);
  ctx.fill();
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(167, 243, 208, 0.75)";
  ctx.font = `500 12px ${CERT_FONT}`;
  ctx.fillText("Pindai untuk verifikasi", qrX + qrSize / 2, frameY + qrSize + 26);

  // Badge tier — kanan-atas sejajar brand
  const tierLabel = TIER_META[institution.tier]?.label ?? institution.tier;
  ctx.font = `800 20px ${CERT_FONT}`;
  setLetterSpacing(ctx, 3);
  const tierW = ctx.measureText(tierLabel).width + 48;
  const tierH = 46;
  const tierX = CERT_W - 80 - tierW;
  pathRoundRect(ctx, tierX, 88, tierW, tierH, tierH / 2);
  ctx.strokeStyle = CERT_GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = CERT_GOLD;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tierLabel, tierX + tierW / 2, 88 + tierH / 2 + 1.5);
  setLetterSpacing(ctx, 0);
  ctx.textBaseline = "alphabetic";

  // Footer: garis emerald-800 + teks verifikasi + URL permanen
  ctx.strokeStyle = "#065f46"; // emerald-800
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 1020);
  ctx.lineTo(CERT_W - 140, 1020);
  ctx.stroke();

  ctx.textAlign = "center";
  const todayLabel = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  ctx.fillStyle = "rgba(167, 243, 208, 0.7)";
  ctx.font = `500 16px ${CERT_FONT}`;
  ctx.fillText(
    `Diverifikasi oleh PUSAKA • Dewan Pakar 46 Lintas Bidang • ${todayLabel}`,
    cx,
    1054,
  );
  ctx.fillStyle = "rgba(110, 231, 183, 0.55)";
  ctx.font = `400 13px ${CERT_MONO}`;
  ctx.fillText(verifyUrl, cx, 1080);
}

/** Kartu Sertifikat Digital premium — dipakai di hasil verifikasi. */
export function CertificateCard({
  institution,
  programName,
}: {
  institution: InstitutionT;
  programName?: string | null;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const tierMeta = TIER_META[institution.tier] ?? TIER_META.SILVER;
  const statusMeta = STATUS_META[institution.status];
  const typeMeta = TYPE_META[institution.type];
  const today = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const expired = institution.status === "KADALUARSA";

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(`${window.location.origin}/?cert=${institution.certNumber}`, {
      width: 240,
      margin: 1,
      color: { dark: "#064e3b", light: "#ffffff" },
    })
      .then((url: string) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        /* QR gagal dibuat — biarkan skeleton tampil */
      });
    return () => {
      cancelled = true;
    };
  }, [institution.certNumber]);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const verifyUrl = `${window.location.origin}/?cert=${institution.certNumber}`;
      const qrSource =
        qrDataUrl ??
        (await QRCode.toDataURL(verifyUrl, {
          width: 320,
          margin: 1,
          color: { dark: "#064e3b", light: "#ffffff" },
        }));
      const qrImage = new Image();
      qrImage.src = qrSource;
      await new Promise<void>((resolve, reject) => {
        qrImage.onload = () => resolve();
        qrImage.onerror = () => reject(new Error("Gagal memuat gambar QR."));
      });

      const canvas = document.createElement("canvas");
      canvas.width = CERT_W;
      canvas.height = CERT_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak tersedia di browser ini.");
      drawCertificate(ctx, { institution, programName, qrImage, verifyUrl });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("Gagal menghasilkan berkas PNG.");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${institution.certNumber}-PUSAKA.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Sertifikat berhasil diunduh");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membuat berkas sertifikat.");
    } finally {
      setDownloading(false);
    }
  }

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
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR verifikasi sertifikat ${institution.certNumber}`}
            className="h-20 w-20 shrink-0 rounded-md bg-white p-1 shadow-inner"
          />
        ) : (
          <div
            className="h-20 w-20 shrink-0 animate-pulse rounded-md bg-white/60 shadow-inner"
            aria-hidden
          />
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-800/60 pt-3">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-300/70">
          <BadgeCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          Diverifikasi oleh PUSAKA • {today}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={downloading}
          onClick={() => void handleDownload()}
          className="gap-2 border-amber-400/60 bg-transparent text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 dark:border-amber-400/60 dark:bg-transparent dark:text-amber-300 dark:hover:bg-amber-500/10"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Download className="h-4 w-4" aria-hidden />
          )}
          Unduh Sertifikat
        </Button>
      </div>
    </div>
  );
}
