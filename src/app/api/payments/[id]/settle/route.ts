import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generatePaymentReference } from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

/**
 * POST /api/payments/[id]/settle — SIMULASI pembayaran (mode demo sandbox).
 * Pada produksi, endpoint ini digantikan webhook payment gateway asli.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payment = await db.payment.findUnique({ where: { id } });
    if (!payment) {
      return NextResponse.json(
        { ok: false, error: "Invoice pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }
    if (payment.status === "BERHASIL") {
      return NextResponse.json({ ok: true, data: payment });
    }
    if (payment.status !== "MENUNGGU") {
      return NextResponse.json(
        { ok: false, error: `Invoice berstatus ${payment.status} — tidak dapat dibayar` },
        { status: 409 }
      );
    }

    const now = new Date();
    const updated = await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "BERHASIL",
        paidAt: now,
        reference: generatePaymentReference(),
      },
    });

    // Tandai pengajuan terkait LUNAS
    await db.application.updateMany({
      where: { trackingCode: payment.trackingCode },
      data: { paymentStatus: "LUNAS" },
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: updated.id,
        invoiceNo: updated.invoiceNo,
        trackingCode: updated.trackingCode,
        programCode: updated.programCode,
        method: updated.method,
        methodId: updated.methodId,
        provider: updated.provider,
        amount: updated.amount,
        fee: updated.fee,
        total: updated.total,
        status: updated.status,
        vaNumber: updated.vaNumber,
        qrPayload: updated.qrPayload,
        reference: updated.reference,
        paidAt: updated.paidAt ? updated.paidAt.toISOString() : null,
        expiredAt: updated.expiredAt.toISOString(),
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[API /api/payments/:id/settle] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memproses pembayaran" },
      { status: 500 }
    );
  }
}
