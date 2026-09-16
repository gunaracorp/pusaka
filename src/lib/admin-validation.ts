import { z } from "zod";

/**
 * Skema zod + helper bersama untuk API Admin CMS PUSAKA.
 * Kolom JSON-list (requirements/benefits/accreditation) dinormalisasi
 * menjadi string JSON array-of-strings agar konsisten dengan data publik.
 */

/* ============================= HELPER UMUM ============================= */

/** Gabungkan issues zod menjadi satu pesan error ringkas. */
export function formatZodError(error: z.ZodError): string {
  return (
    error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join("; ") || "Data tidak valid"
  );
}

/** Deteksi error unique constraint Prisma (P2002). */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

/**
 * Normalisasi field list (requirements/benefits/accreditation) → string JSON array.
 * - array of string → JSON.stringify
 * - string valid JSON array-of-strings → biarkan apa adanya
 * - string biasa → pecah per baris baru → JSON.stringify
 */
export function normalizeJsonList(value: string | string[]): string {
  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map((v) => String(v).trim()).filter((v) => v.length > 0)
    );
  }
  const trimmed = value.trim();
  if (trimmed) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        return trimmed; // sudah JSON string array-of-strings — biarkan
      }
    } catch {
      // bukan JSON → perlakukan sebagai teks biasa per baris
    }
  }
  return JSON.stringify(
    value
      .split(/\r?\n/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
  );
}

/** Slug dari judul: lowercase, spasi→"-", buang non-alfanumerik. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Parse string tanggal ISO → Date, atau null jika invalid. */
export function parseIsoDate(value: string): Date | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/* ============================ BUILDING BLOCKS ============================ */

export const stringListField = z.union([z.string(), z.array(z.string())]);

export const codeField = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .pipe(
    z
      .string()
      .min(2, "Kode minimal 2 karakter")
      .regex(/^[A-Z0-9-]+$/, "Kode hanya boleh huruf kapital, angka, dan tanda hubung")
  );

export const certNumberField = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .pipe(
    z
      .string()
      .min(1, "Nomor sertifikat wajib diisi")
      .regex(/^[A-Z0-9-]+$/, "Nomor sertifikat hanya boleh huruf kapital, angka, dan tanda hubung")
  );

export const isoDateField = z
  .string()
  .min(1, "Tanggal wajib diisi")
  .refine((v) => parseIsoDate(v) !== null, "Format tanggal tidak valid (ISO diperlukan)");

/* ================================ PROGRAM ================================ */

export const programCreateSchema = z.object({
  code: codeField,
  name: z.string().trim().min(3, "Nama program minimal 3 karakter"),
  shortName: z.string().trim().min(1, "Nama singkat wajib diisi"),
  category: z.enum(["PERUSAHAAN", "PROFESI", "IZIN"]),
  tagline: z.string().trim().min(1, "Tagline wajib diisi"),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
  requirements: stringListField,
  benefits: stringListField,
  accreditation: stringListField,
  durationDays: z.coerce.number().int("Durasi harus bilangan bulat"),
  price: z.coerce.number().int("Harga harus bilangan bulat"),
  seatsLeft: z.coerce.number().int("Kuota harus bilangan bulat"),
  holderCount: z.coerce.number().int("Jumlah pemegang harus bilangan bulat"),
  passRate: z.coerce.number().int("Persentase kelulusan harus bilangan bulat"),
  accentColor: z.string().trim().min(1, "Warna aksen wajib diisi"),
  featured: z.boolean().optional(), // default false di handler
});

export const programUpdateSchema = programCreateSchema.partial();

/* ============================== INSTITUTION ============================== */

export const institutionCreateSchema = z.object({
  name: z.string().trim().min(2, "Nama lembaga minimal 2 karakter"),
  type: z.enum(["PPIU", "PIHK", "BPW", "IATA"]),
  city: z.string().trim().min(1, "Kota wajib diisi"),
  province: z.string().trim().min(1, "Provinsi wajib diisi"),
  certNumber: certNumberField,
  programCode: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(z.string().min(1, "Kode program wajib diisi")),
  status: z.enum(["AKTIF", "DIPERBARUI", "KADALUARSA"]),
  tier: z.enum(["SILVER", "GOLD", "PLATINUM"]),
  score: z.coerce
    .number()
    .int("Skor harus bilangan bulat")
    .min(0, "Skor minimal 0")
    .max(100, "Skor maksimal 100"),
  issuedAt: isoDateField,
  expiresAt: isoDateField,
  contact: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

export const institutionUpdateSchema = institutionCreateSchema.partial();

/* ================================ EXPERT ================================= */

export const expertCreateSchema = z.object({
  name: z.string().trim().min(3, "Nama pakar minimal 3 karakter"),
  field: z.string().trim().min(1, "Bidang utama wajib diisi"),
  expertise: z.string().trim().min(1, "Deskripsi keahlian wajib diisi"),
  category: z.enum([
    "HUKUM",
    "IBADAH",
    "AVIASI",
    "MANAJEMEN",
    "KEUANGAN",
    "TEKNOLOGI",
    "KESEHATAN",
    "BAHASA",
    "LOGISTIK",
  ]),
  licenseNo: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(z.string().min(1, "Nomor lisensi wajib diisi")),
  experienceYears: z.coerce
    .number()
    .int("Pengalaman harus bilangan bulat")
    .min(0, "Pengalaman minimal 0 tahun")
    .max(60, "Pengalaman maksimal 60 tahun"),
  organization: z.string().trim().min(1, "Organisasi wajib diisi"),
  education: z.string().trim().min(1, "Pendidikan wajib diisi"),
  initials: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(
      z
        .string()
        .min(1, "Inisial wajib diisi")
        .max(4, "Inisial maksimal 4 karakter")
    ),
  featured: z.boolean().optional(), // default false di handler
});

export const expertUpdateSchema = expertCreateSchema.partial();

/* ================================= NEWS ================================== */

export const newsCreateSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter"),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(10, "Ringkasan minimal 10 karakter"),
  content: z.string().trim().min(20, "Konten minimal 20 karakter"),
  category: z.enum(["PENGUMUMAN", "REGULASI", "KEGIATAN", "KEMITRAAN"]),
  author: z.string().trim().min(1, "Penulis wajib diisi"),
  featured: z.boolean().optional(), // default false di handler
  publishedAt: isoDateField.optional(),
});

export const newsUpdateSchema = newsCreateSchema.partial();

/* ============================= APPLICATION =============================== */

export const applicationPatchSchema = z.object({
  status: z.enum(["SUBMITTED", "REVIEW", "VERIFIKASI", "ASSESSMENT", "APPROVED"]),
});

/* ============================= GLOBAL NODE =============================== */

export const countryCodeField = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .pipe(
    z
      .string()
      .length(2, "Kode negara harus tepat 2 huruf (ISO-2, contoh: SA)")
      .regex(/^[A-Z]{2}$/, "Kode negara hanya boleh 2 huruf (ISO-2)")
  );

export const globalNodeCreateSchema = z.object({
  kind: z.enum(["KANTOR_PERWAKILAN", "MITRA_INTERNASIONAL"]),
  country: z.string().trim().min(2, "Nama negara minimal 2 karakter"),
  countryCode: countryCodeField,
  region: z.enum([
    "TIMUR_TENGAH",
    "ASIA_TENGGARA",
    "ASIA_SELATAN",
    "ASIA_TIMUR",
    "EROPA",
    "AFRIKA",
    "AMERIKA",
    "OSEANIA",
  ]),
  city: z.string().trim().min(2, "Kota minimal 2 karakter"),
  flag: z.string().trim().min(1, "Emoji bendera wajib diisi"),
  title: z.string().trim().min(2, "Judul minimal 2 karakter"),
  orgName: z.string().trim().min(2, "Nama organisasi minimal 2 karakter"),
  description: z.string().trim().min(2, "Deskripsi minimal 2 karakter"),
  scope: stringListField,
  status: z.enum(["AKTIF", "MOU", "APLIKASI"]),
  since: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Tahun harus 4 digit (contoh: 2018)"),
  contact: z.string().trim().optional().nullable(),
  order: z.coerce
    .number()
    .int("Order harus bilangan bulat")
    .min(0, "Order minimal 0")
    .default(0),
});

/**
 * Update pakai .partial(); field `order` dioverride jadi optional TANPA default
 * agar PUT partial tidak mengembalikan order ke 0 (default zod tetap berjalan
 * meski key tidak dikirim).
 */
export const globalNodeUpdateSchema = globalNodeCreateSchema
  .extend({
    order: z.coerce
      .number()
      .int("Order harus bilangan bulat")
      .min(0, "Order minimal 0")
      .optional(),
  })
  .partial();

/* ================================ MESSAGE ================================ */

export const messagePatchSchema = z.object({
  handled: z.boolean(),
});
