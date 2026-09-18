import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/portal/me — data lengkap sesi anggota (null bila belum login). */
export async function GET(request: Request) {
  try {
    const session = getMemberSession(request);
    if (!session) {
      return NextResponse.json({ ok: true, data: null });
    }

    const account = await db.memberAccount.findUnique({
      where: { id: session.accountId },
      include: { institution: true },
    });
    if (!account) {
      return NextResponse.json({ ok: true, data: null });
    }

    // Pengajuan milik lembaga: cocokkan email akun ATAU nama institusi
    const applications = await db.application.findMany({
      where: {
        OR: [
          { email: account.email },
          { institution: account.institution.name },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const appIds = applications.map((a) => a.id);
    const payments = appIds.length
      ? await db.payment.findMany({
          where: { applicationId: { in: appIds } },
          orderBy: { createdAt: "desc" },
          take: 50,
        })
      : [];

    return NextResponse.json({
      ok: true,
      data: {
        account: {
          id: account.id,
          email: account.email,
          name: account.name,
          position: account.position,
          createdAt: account.createdAt.toISOString(),
        },
        institution: {
          id: account.institution.id,
          name: account.institution.name,
          type: account.institution.type,
          city: account.institution.city,
          province: account.institution.province,
          certNumber: account.institution.certNumber,
          programCode: account.institution.programCode,
          status: account.institution.status,
          tier: account.institution.tier,
          score: account.institution.score,
          issuedAt: account.institution.issuedAt.toISOString(),
          expiresAt: account.institution.expiresAt.toISOString(),
          contact: account.institution.contact,
          phone: account.institution.phone,
          createdAt: account.institution.createdAt.toISOString(),
        },
        applications: applications.map((a) => ({
          id: a.id,
          trackingCode: a.trackingCode,
          programCode: a.programCode,
          fullName: a.fullName,
          status: a.status,
          paymentStatus: a.paymentStatus,
          createdAt: a.createdAt.toISOString(),
        })),
        payments: payments.map((p) => ({
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
        })),
      },
    });
  } catch (error) {
    console.error("[API /api/portal/me] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Gagal memuat data portal" },
      { status: 500 }
    );
  }
}
