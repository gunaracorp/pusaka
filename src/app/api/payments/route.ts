import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  PAYMENT_METHODS,
  resolveMethodFee,
  generateVaNumber,
  generateQrPayload,
  generateInvoiceNo,
} from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  trackingCode: z.string().min(1, "Kode pelacakan wajib diisi"),
  methodId: z.string().min(1, "Metode pembayaran wajib dipilih"),
});

/** Durasi kedaluwarsa invoice (mode demo: 2 jam). */
const INVOICE_TTL_MS = 2 * 60 * 60 * 1000;

function serializePayment(p: {
  id: string;
  invoiceNo: string;
  trackingCode: string;
  programCode: string;
  method: string;
  methodId: string;
  provider: string;
  amount: number;
  fee: number;
  total: number;
  status: string;
  vaNumber: string | null;
  qrPayload: string | null;
  reference: string | null;
  paidAt: Date | null;
  expiredAt: Date;
  createdAt: Date;
}) {
  return {
    id: p.id,
    invoiceNo: p.invoiceNo,
    trackingCode: p.trackingCode,
    programCode: p.programCode,
    method: p.method,
    methodId: p.methodId,
    provider: p.provider,
    amount: p.amount,
    fee: p.fee,
    total: p.total,
    status: p.status,
    vaNumber: p.vaNumber,
    qrPayload: p.qrPayload,
    reference: p.reference,
    paidAt: p.paidAt ? p.paidAt.toISOString() : null,
    expiredAt: p.expiredAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  };
}

/** POST /api/payments — buat invoice pembayaran untuk satu pengajuan. */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body request tidak valid (JSON diperlukan)" },
        { status: 400 }
      );
    }

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Data pembayaran tidak valid",
        },
        { status: 400 }
      );
    }

    const trackingCode = parsed.data.trackingCode.trim().toUpperCase();
    const application = await db.application.findUnique({
      where: { trackingCode },
    });
    if (!application) {
      return NextResponse.json(
        { ok: false, error: `Pengajuan dengan kode "${trackingCode}" tidak ditemukan` },
        { status: 404 }
      );
    }

    if (application.paymentStatus === "LUNAS") {
      return NextResponse.json(
        { ok: false, error: "Biaya pendaftaran untuk pengajuan ini sudah lunas" },
        { status: 409 }
      );
    }

    const method = PAYMENT_METHODS.find((m) => m.id === parsed.data.methodId);
    if (!method) {
      return NextResponse.json(
        { ok: false, error: "Metode pembayaran tidak dikenal" },
        { status: 400 }
      );
    }

    const program = await db.program.findUnique({
      where: { code: application.programCode },
    });
    if (!program) {
      return NextResponse.json(
        { ok: false, error: "Program sertifikasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const amount = program.price;
    const fee = resolveMethodFee(method, amount);
    const total = amount + fee;
    const expiredAt = new Date(Date.now() + INVOICE_TTL_MS);

    // Satu invoice MENUNGGU aktif per pengajuan: tandai invoice lama KADALUARSA
    await db.payment.updateMany({
      where: { trackingCode, status: "MENUNGGU" },
      data: { status: "KADALUARSA" },
    });

    const payment = await db.payment.create({
      data: {
        invoiceNo: generateInvoiceNo(),
        trackingCode,
        applicationId: application.id,
        programCode: application.programCode,
        method: method.type,
        methodId: method.id,
        provider: method.provider,
        amount,
        fee,
        total,
        status: "MENUNGGU",
        vaNumber:
          method.type === "VIRTUAL_ACCOUNT" || method.type === "E_WALLET"
            ? generateVaNumber(method.provider)
            : null,
        qrPayload: method.type === "QRIS" ? generateQrPayload("PENDING", total) : null,
        expiredAt,
      },
    });

    // Payload QR berisi nomor invoice final (dibuat setelah create pertama tidak
    // memungkinkan karena invoiceNo dibutuhkan saat create) — perbarui di sini.
    if (method.type === "QRIS") {
      const finalPayload = generateQrPayload(payment.invoiceNo, total);
      await db.payment.update({
        where: { id: payment.id },
        data: { qrPayload: finalPayload },
      });
      payment.qrPayload = finalPayload;
    }

    await db.application.update({
      where: { id: application.id },
      data: { paymentStatus: "MENUNGGU" },
    });

    return NextResponse.json({ ok: true, data: serializePayment(payment) });
  } catch (error) {
    console.error("[API /api/payments POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal membuat invoice pembayaran" },
      { status: 500 }
    );
  }
}

/** GET /api/payments?trackingCode= — daftar invoice untuk satu pengajuan. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingCode = (searchParams.get("trackingCode") ?? "").trim().toUpperCase();
    if (!trackingCode) {
      return NextResponse.json(
        { ok: false, error: "Parameter 'trackingCode' wajib diisi" },
        { status: 400 }
      );
    }

    const payments = await db.payment.findMany({
      where: { trackingCode },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ ok: true, data: payments.map(serializePayment) });
  } catch (error) {
    console.error("[API /api/payments GET] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat daftar pembayaran" },
      { status: 500 }
    );
  }
}
