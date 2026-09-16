import crypto from "crypto";

/**
 * Helper autentikasi CMS PUSAKA (backend-only).
 * - Password: scrypt (node:crypto), format "salt:hash" (hex).
 * - Sesi: token HMAC-SHA256 "base64url(payload).sig" di cookie httpOnly.
 * - Cookie diparse manual dari header request (JANGAN next/headers).
 */

export const SESSION_COOKIE = "pusaka_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 jam (detik)

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "pusaka-super-secret-key-2026";

/** Payload sesi admin yang disimpan di dalam token. */
export interface SessionPayload {
  username: string;
  name: string;
  role: string;
  /** Kedaluwarsa sesi (epoch milidetik). */
  exp: number;
}

/** Hash password dengan scrypt → "salt:hash" (hex). */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/** Verifikasi password terhadap hash "salt:hash" — timing-safe. */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, "hex");
    if (expected.length === 0) return false;
    // keylen = panjang hash tersimpan agar selalu cocok untuk timingSafeEqual
    const candidate = crypto.scryptSync(password, salt, expected.length);
    return crypto.timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

/** Buat token sesi: base64url(JSON(payload)) + "." + HMAC-SHA256(base64url). */
export function createSessionToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

/** Verifikasi token sesi: signature + kedaluwarsa (exp epoch ms atau ISO string). */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const dot = token.indexOf(".");
    if (dot <= 0) return null;
    const body = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    if (!body || !sig) return null;

    const expected = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(body)
      .digest("base64url");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const decoded = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as Record<string, unknown>;
    if (!decoded || typeof decoded !== "object") return null;

    const { username, name, role, exp } = decoded;
    if (
      typeof username !== "string" ||
      typeof name !== "string" ||
      typeof role !== "string"
    ) {
      return null;
    }

    // exp bisa epoch ms (number) atau ISO string
    let expMs: number;
    if (typeof exp === "number") {
      expMs = exp;
    } else if (typeof exp === "string") {
      expMs = new Date(exp).getTime();
    } else {
      return null;
    }
    if (!Number.isFinite(expMs) || expMs <= Date.now()) return null;

    return { username, name, role, exp: expMs };
  } catch {
    return null;
  }
}

/** Ambil sesi admin dari header Cookie request (parse manual, tanpa next/headers). */
export function getAdminSession(request: Request): SessionPayload | null {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;
    for (const part of cookieHeader.split(";")) {
      const eq = part.indexOf("=");
      if (eq === -1) continue;
      const key = part.slice(0, eq).trim();
      if (key !== SESSION_COOKIE) continue;
      const raw = part.slice(eq + 1).trim();
      if (!raw) return null;
      let token = raw;
      try {
        token = decodeURIComponent(raw);
      } catch {
        // nilai mentah dipakai jika bukan URL-encoded
      }
      return verifySessionToken(token);
    }
    return null;
  } catch {
    return null;
  }
}
