/**
 * Rate limiter in-memory sederhana untuk API PUSAKA (tanpa dependensi).
 * - Bucket per-key dengan jendela waktu tetap (fixed window).
 * - Lazy cleanup: bucket kadaluarsa dihapus saat diakses.
 * - Cocok untuk single-instance dev/production sederhana (bukan distributed).
 */

interface Bucket {
  /** Jumlah hit dalam jendela aktif. */
  count: number;
  /** Epoch milidetik saat jendela berakhir. */
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  /** Detik sampai counter reset (0 jika allowed). */
  retryAfterSec: number;
}

/** Ambil bucket aktif; hapus & abaikan jika sudah kadaluarsa (lazy cleanup). */
function getActiveBucket(key: string): Bucket | undefined {
  const bucket = buckets.get(key);
  if (bucket && bucket.resetAt <= Date.now()) {
    buckets.delete(key);
    return undefined;
  }
  return bucket;
}

function retryAfter(bucket: Bucket): number {
  return Math.max(1, Math.ceil((bucket.resetAt - Date.now()) / 1000));
}

/**
 * Cek + hitung hit dalam satu panggilan (untuk endpoint publik biasa).
 * - Bucket belum ada / kadaluarsa → buat baru (count=1), allowed.
 * - count < limit → count++, allowed.
 * - count >= limit → !allowed + retryAfterSec dari resetAt.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  return hitRateLimit(key, limit, windowMs);
}

/**
 * Increment counter (buat bucket bila perlu) TANPA cek dulu.
 * Dipanggil HANYA saat percobaan gagal (mis. login gagal) agar
 * percobaan sukses tidak ikut menghitung.
 */
export function hitRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const bucket = getActiveBucket(key);
  if (!bucket) {
    buckets.set(key, { count: 1, resetAt: Date.now() + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSec: retryAfter(bucket) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Cek TANPA menambah counter / membuat bucket (peek).
 * Untuk pre-check login: blokir jika sudah lewat limit, tapi jangan
 * menghitung percobaan yang belum tentu gagal.
 */
export function peekRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const bucket = getActiveBucket(key);
  if (!bucket) return { allowed: true, retryAfterSec: 0 };
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSec: retryAfter(bucket) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

/** Hapus bucket (reset counter) — dipanggil saat login sukses. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/** IP klien dari header proxy umum; fallback "anon". */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();
  return "anon";
}
