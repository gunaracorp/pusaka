import { NextResponse } from "next/server";
import { PAYMENT_METHODS } from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

/** GET /api/payments/methods — daftar channel pembayaran aktif. */
export async function GET() {
  try {
    const methods = PAYMENT_METHODS.filter((m) => m.fee !== -1 || m.type === "CREDIT_CARD");
    return NextResponse.json({ ok: true, data: methods });
  } catch (error) {
    console.error("[API /api/payments/methods] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat metode pembayaran" },
      { status: 500 }
    );
  }
}
