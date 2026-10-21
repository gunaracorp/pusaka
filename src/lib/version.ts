// ============================================================
// PUSAKA — Registri Versi & Utilitas SemVer
// ------------------------------------------------------------
// SUMBER KEBENARAN (single source of truth) untuk versi sistem.
// Standar: SemVer 2.0.0 (https://semver.org) + Keep a Changelog 1.1.0
// Dokumen standar: VERSIONING.md | Catatan manusia: CHANGELOG.md
// API mesin: GET /api/version | Tampilan: <VersionBadge /> (footer)
//
// ATURAN PROTOKOL (lihat VERSIONING.md §5):
// - Setiap rilis baru WAJIB ditambahkan sebagai entri CHANGELOG
//   di urutan teratas (append-only, jangan menulis ulang entri lama).
// - Sinkronkan 3 artefak: file VERSION, OS_VERSION di sini, CHANGELOG.md.
// - Konten entri (judul/ringkasan/butir) ditulis dalam Bahasa Indonesia
//   sebagai bahasa kanonik rilis; label antarmuka diterjemahkan via i18n
//   (namespace "versionControl").
// - Aman diimpor dari client & server (tidak ada dependensi node/server).
// ============================================================

// ---------- Tipe ----------

/** Komponen nomor versi semantik. */
export interface SemVer {
  major: number;
  minor: number;
  patch: number;
}

/** Jenis rilis menurut SemVer. */
export type ReleaseType = "major" | "minor" | "patch";

/** Kategori perubahan ala Keep a Changelog. */
export type ChangelogKind =
  | "added"
  | "changed"
  | "deprecated"
  | "removed"
  | "fixed"
  | "security";

/** Satu entri riwayat rilis PUSAKA. */
export interface ChangelogEntry {
  /** Versi semantik, mis. "6.0.0". */
  version: string;
  /** Tanggal rilis (ISO, pukul 00:00Z). */
  date: string;
  type: ReleaseType;
  /** Nama kode rilis — identitas manusiawi tiap generasi. */
  codename: string;
  /** Judul singkat rilis (Bahasa Indonesia, kanonik). */
  title: string;
  /** Ringkasan satu kalimat. */
  summary: string;
  /** Task ID worklog yang menyusun rilis ini (ketertelusuran penuh). */
  tasks: string[];
  /** Kategori boleh absen — rilis patch belum tentu menambah/mengubah apa pun. */
  added?: string[];
  changed?: string[];
  deprecated?: string[];
  removed?: string[];
  fixed?: string[];
  security?: string[];
}

// ---------- Helper tanggal ----------
// Semua tanggal dihitung RELATIF terhadap waktu sistem (prinsip Task 3 —
// sandbox bisa melompat tahun; jangan pernah hardcode tahun).

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

// ---------- Identitas OS (perbarui saat rilis) ----------

export const OS_NAME = "PUSAKA";

/** Versi berjalan — sinkron dengan file VERSION dan entri teratas CHANGELOG. */
export const OS_VERSION = "6.1.0";

/** Nama kode rilis berjalan. */
export const OS_CODENAME = "Lighthouse";

/** Saluran rilis: stable | beta | alpha. */
export const OS_CHANNEL = "stable" as const;

/** Spesifikasi yang diikuti. */
export const OS_SPEC = "SemVer 2.0.0";

/** Tanggal rilis versi berjalan. */
export const OS_RELEASE_DATE = isoDaysAgo(0);

// ---------- Riwayat rilis (terbaru di atas — append-only) ----------

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "6.1.0",
    date: isoDaysAgo(0),
    type: "minor",
    codename: "Lighthouse",
    title: "Halaman Tersendiri & Infrastruktur SEO Penuh",
    summary:
      "11 halaman resmi tersendiri (6 program + 5 informasi) dengan metadata dinamis, JSON-LD terstruktur, sitemap/robots/manifest, dan gambar Open Graph — terbaca penuh oleh mesin pencari.",
    tasks: ["13"],
    added: [
      "Router halaman dalam (deep-link #/p/...) + 6 halaman layanan resmi: PIHK, PPIU, BPW, IATA, Izin Umrah, Izin Haji — hero, manfaat, lingkup, persyaratan, alur proses, FAQ, layanan terkait, CTA",
      "5 halaman informasi: Tentang PUSAKA, Kontak, Pusat Bantuan (FAQ 12 butir), Kebijakan Privasi, Syarat & Ketentuan (7 bagian per dokumen)",
      "Infrastruktur SEO: metadata layout lengkap (metadataBase, canonical, hreflang id/en/ar/x-default, robots + googleBot, OG image, Twitter card, PWA manifest)",
      "File-based SEO routes: sitemap.xml (11 entri deep-link), robots.txt (dengan referensi sitemap), manifest.webmanifest, icon.svg, og-image.png 1200x630",
      "JSON-LD: @graph Organization + WebSite + ProfessionalService (server-rendered), plus Service + FAQPage + BreadcrumbList per halaman",
      "Konten i18n penuh 3 bahasa (ID/EN/AR) untuk seluruh halaman baru + dukungan parameter ?lang= (hreflang/crawler, tanpa menimpa preferensi tersimpan)",
      "Navigasi: dropdown “Halaman” di navbar (desktop + Sheet mobile), kolom Program footer mengarah ke halaman resmi tiap program, tautan legal di bar bawah, tautan “Buka halaman resmi program” pada dialog Program",
    ],
    changed: [
      "SEO title/meta/canonical kini dikelola satu sumber (usePageSeo di Home) dengan MutationObserver pengaman agar tidak tertimpa runtime head Next.js",
      "Butir footer “Izin Umrah & Haji” dipecah menjadi dua tautan halaman: Izin Umrah & Izin Haji",
    ],
    fixed: [
      "Konflik public/robots.txt vs app/robots.ts (HTTP 500) — file statis dihapus, robots dinamis dengan sitemap yang menang",
    ],
  },
  {
    version: "6.0.1",
    date: isoDaysAgo(0),
    type: "patch",
    codename: "Lingua",
    title: "Perbaikan Persistensi Bahasa",
    summary:
      "Preferensi bahasa pengguna kini bertahan setelah muat ulang halaman — bug pra-ada pada provider i18n dituntaskan.",
    tasks: ["12-b"],
    fixed: [
      "I18nProvider menimpa localStorage bahasa tersimpan saat mount (effect [lang] menulis default “id” sebelum pembacaan selesai) — penulisan kini hanya terjadi saat pengguna mengganti bahasa",
      "Pembacaan bahasa tersimpan tidak lagi memakai setTimeout sehingga pemuatan lebih deterministik",
    ],
    changed: [
      "Rebrand sistem versi: “Gunara OS” → “PUSAKA” (revisi pemilik produk) — lencana, dialog, kamus i18n 3 bahasa, dan dokumen standar",
    ],
  },
  {
    version: "6.0.0",
    date: isoDaysAgo(0),
    type: "major",
    codename: "Sentinel",
    title: "Sistem Kontrol Versi PUSAKA",
    summary:
      "Tata kelola rilis berstandar internasional kini hidup di kode, API, dan antarmuka — setiap perubahan masa depan tercatat sistematis.",
    tasks: ["12"],
    added: [
      "Standar VERSIONING.md (SemVer 2.0.0 + Keep a Changelog 1.1.0) dan file VERSION di akar repositori",
      "Registri src/lib/version.ts — 18 rilis terdokumentasi lengkap dengan ketertelusuran Task ID + util semver parse/compare/bump",
      "API GET /api/version (?type=&limit=&q=) untuk konsumsi mesin, monitoring, dan otomasi CI",
      "Lencana PUSAKA di footer + dialog Riwayat Versi interaktif (i18n ID/EN/AR, RTL-safe)",
      "Protokol Worklog v2 — setiap task wajib bertag rilis dengan marker [+]/[~]/[-]/[!]/[$]",
    ],
    changed: [
      "CHANGELOG.md menjadi bagian resmi repositori — append-only, dilarang menulis ulang entri lama",
    ],
  },
  {
    version: "5.1.1",
    date: isoDaysAgo(4),
    type: "patch",
    codename: "Concord",
    title: "Konsolidasi Katalog & Stabilitas",
    summary:
      "Perbaikan tipografi tipe, bug seed, dan penguatan stabilitas lingkungan pengembangan.",
    tasks: ["11"],
    fixed: [
      "Konflik tsc pada api/services & api/stats — pemetaan eksplisit union type ServiceRow/StatT",
      "Seed gagal re-run: payment.deleteMany() hilang — invoiceNo deterministik bentrok saat re-seed",
    ],
    changed: [
      "Stabilitas dev server via supervisor platform (.zscripts/dev.sh) + pembersihan cache .next agar Prisma client baru terbaca",
      "Verifikasi E2E menyeluruh: katalog, tutorial, RTL Arab, mobile 390px, regresi verifikasi sertifikat",
    ],
  },
  {
    version: "5.1.0",
    date: isoDaysAgo(5),
    type: "minor",
    codename: "Polymath",
    title: "Branding Gugun Gunara & Jaringan Ekosistem",
    summary:
      "Identitas pendiri Master Polymath • Sage Universal • The Ultimate Problem Solver menguat di seluruh situs, terhubung tiga situs ekosistem.",
    tasks: ["11-b"],
    added: [
      "FounderSection (#pendiri) — profil Gugun Gunara lengkap tiga gelar",
      "PartnerSites (#ekosistem) — gunara.web.id, pusatperizinan.com, gohajj.web.id (target _blank rel noopener)",
      "Blok Jaringan Situs di footer + kredit founder",
      "Kartu statistik ke-7 “Layanan Sertifikasi 500+” + pengumuman baru di TopTicker",
      "Metadata SEO: “500+ Layanan Global oleh Gugun Gunara”",
    ],
    changed: [
      "Navbar +2 tautan (#layanan, #tutorial); footer +2 tautan layanan",
      "39 kunci i18n baru × 3 bahasa — RTL-safe (ps-/border-s-/dir=ltr untuk domain)",
    ],
  },
  {
    version: "5.0.0",
    date: isoDaysAgo(6),
    type: "major",
    codename: "Pustaka",
    title: "Katalog 500 Layanan & Pusat Tutorial",
    summary:
      "500 layanan sertifikasi & akreditasi lintas 25 bidang berstandar internasional + Pusat Panduan interaktif 4 jalur.",
    tasks: ["11", "11-a"],
    added: [
      "Model Service + katalog 500 layanan (25 bidang × 10 basis × 2 skema): ISO 9001/27001/45001, FSSC 22000, JCI, SNARS, IOSA, GLOBALG.A.P., LEED, ISO 37001:2025, Muthawif KMA 569/2020, dll.",
      "API GET /api/services — pencarian, filter kategori/skema/lingkup, facet 25 kategori, pagination",
      "ServicesCatalog (#layanan) — grid kartu, chip kategori, dialog detail layanan",
      "TutorialHub (#tutorial) — Pusat Panduan 4 jalur + kode demo salin-otomatis",
    ],
    changed: [
      "prisma/data/services.ts — generator katalog deterministik (FNV-1a) untuk harga/durasi/deskripsi",
      "/api/stats menambah totals.services (jumlah layanan aktif)",
    ],
  },
  {
    version: "4.2.1",
    date: isoDaysAgo(10),
    type: "patch",
    codename: "Anchor",
    title: "Stabilisasi Tri Fitur",
    summary: "Integrasi final i18n × Portal × Payment dan verifikasi E2E lintas bahasa.",
    tasks: ["10"],
    changed: [
      "Integrasi final seluruh fitur v4.x ke page.tsx + verifikasi E2E Agent Browser dalam 3 bahasa",
    ],
    fixed: [
      "Perbaikan lapangan hasil integrasi (key i18n yang belum terisi, alur pembayaran, event bus portal)",
    ],
  },
  {
    version: "4.2.0",
    date: isoDaysAgo(11),
    type: "minor",
    codename: "Vault",
    title: "Payment Gateway Pendaftaran",
    summary:
      "Alur pembayaran ujian & sertifikasi terpasang end-to-end di pendaftaran maupun pelacakan.",
    tasks: ["9-e"],
    added: [
      "PaymentPanel multi-metode (virtual account, e-wallet, QRIS, kartu) dengan simulasi pembayaran",
      "Integrasi pembayaran di layar sukses pendaftaran & kartu hasil lacak",
      "Kotak status LUNAS/BELUM — invoice, penyedia, referensi, tanggal bayar",
    ],
    changed: [
      "API payments + skema Payment di backend; i18n penuh applicationForm & track (ID/EN/AR)",
    ],
  },
  {
    version: "4.1.0",
    date: isoDaysAgo(12),
    type: "minor",
    codename: "Keyholder",
    title: "Portal Anggota Lembaga",
    summary:
      "Pemegang sertifikat kini punya login dan dasbor anggota sendiri, terhubung ke pelacakan otomatis.",
    tasks: ["9-f"],
    added: [
      "member-portal.tsx — login pemegang sertifikat + dasbor anggota",
      "Event bus lintas komponen: “pusaka:open-portal” & “pusaka:autofill-track” (isi kode + lacak + scroll otomatis)",
      "Kamus i18n portal (ID/EN/AR)",
    ],
  },
  {
    version: "4.0.0",
    date: isoDaysAgo(13),
    type: "major",
    codename: "Polyglot",
    title: "Mesin Tri Bahasa (ID/EN/AR) + RTL",
    summary:
      "Seluruh antarmuka publik dwiarah: Indonesia, English, العربية — dengan format lokal otomatis.",
    tasks: ["9", "9-a", "9-b", "9-c", "9-d"],
    added: [
      "I18nProvider + hook useI18n() — t(), formatCurrency/Date/Number, timeAgo per locale",
      "LanguageSwitcher di navbar + persistensi localStorage (“pusaka-lang”)",
      "28+ namespace kamus (navbar, hero, programs, directory, experts, news, footer, dll.)",
    ],
    changed: [
      "Seluruh komponen publik dimigrasi ke useI18n() — string hardcoded dihapus",
      "Mode Arab: html[dir=rtl] + font Arab via globals.css; utilitas logis (ps-/pe-/border-s-) di seluruh komponen",
    ],
  },
  {
    version: "3.1.1",
    date: isoDaysAgo(16),
    type: "patch",
    codename: "Beacon",
    title: "Integrasi Paket Digital",
    summary: "Penyatuan 7 fitur digital ke halaman utama + verifikasi E2E penuh.",
    tasks: ["8"],
    changed: ["Integrasi final 7 fitur (SAKA, dark mode, QR, deep-link, ticker, newsletter) + E2E"],
  },
  {
    version: "3.1.0",
    date: isoDaysAgo(17),
    type: "minor",
    codename: "Spectra",
    title: "Paket Digital: QR Sertifikat, Ticker Hijriah, Newsletter",
    summary: "Sertifikat kini dapat diunduh dengan QR asli; pengumuman & kalender berjalan di atas layar.",
    tasks: ["7-c"],
    added: [
      "Sertifikat digital: unduh PNG 1600×1130 dengan QR asli (canvas)",
      "Deep-link verifikasi ?cert=<nomor> — nomor terbaca otomatis ke verifikasi cepat",
      "TopTicker — kalender Hijriah + pengumuman berputar",
      "Newsletter — formulir footer + manajemen pelanggan di CMS",
    ],
    changed: ["Footer memuat formulir berlangganan dengan validasi email"],
  },
  {
    version: "3.0.0",
    date: isoDaysAgo(18),
    type: "major",
    codename: "Oracle",
    title: "SAKA AI & Dark Mode Penuh",
    summary:
      "Asisten AI mengambang multi-bahasa + mode gelap ber-identitas emerald di seluruh komponen.",
    tasks: ["7", "7-a", "7-b"],
    added: [
      "SAKA — asisten AI mengambang (z-ai-web-dev-sdk via /api/assistant) dengan jawaban kontekstual PUSAKA",
      "ThemeProvider + palet .dark ber-identitas emerald — audit warna semua komponen publik",
    ],
    security: [
      "Rate-limit login CMS (in-memory) — memperlambat percobaan kredensial beruntun",
    ],
  },
  {
    version: "2.1.1",
    date: isoDaysAgo(21),
    type: "patch",
    codename: "Prism",
    title: "Perbaikan Lapisan Tampilan CMS",
    summary: "Bug z-index pada shell CMS dituntaskan dan diverifikasi independen.",
    tasks: ["6-c"],
    fixed: [
      "Bug z-index dialog/sheet pada shell CMS — panel admin tidak lagi tertutup overlay",
    ],
  },
  {
    version: "2.1.0",
    date: isoDaysAgo(22),
    type: "minor",
    codename: "Atlas",
    title: "Jaringan Global 32 Negara",
    summary:
      "Peta jangkauan dunia: kantor perwakilan, mitra internasional, dan cakupan negara per program.",
    tasks: ["6-a", "6-b"],
    added: [
      "Model GlobalNode + seed 33 node / 32 negara (kantor, mitra internasional, jangkauan)",
      "API GET /api/global + section Jaringan Global di UI publik",
      "CRUD admin global-nodes + statistik globalCountries/globalPartners di /api/stats",
    ],
    changed: ["Model Program menambah field countries (JSON)"],
  },
  {
    version: "2.0.0",
    date: isoDaysAgo(24),
    type: "major",
    codename: "Citadel",
    title: "CMS Admin PUSAKA",
    summary:
      "Ruang kontrol lengkap: autentikasi aman + dasbor CRUD seluruh entitas + manajemen alur aplikasi.",
    tasks: ["4", "4-a", "4-b", "5"],
    added: [
      "CMS Admin PUSAKA — login AdminUser (bcrypt + cookie sesi) + dasbor CRUD lengkap",
      "15 API admin: kelola program, institusi, pakar, berita, aplikasi, pesan, log verifikasi",
      "Manajemen status aplikasi (SUBMITTED → APPROVED) dari panel",
    ],
    changed: ["Akses panel via tombol diskret di footer (status authed dicek store)"],
  },
  {
    version: "1.2.1",
    date: isoDaysAgo(27),
    type: "patch",
    codename: "Kronos",
    title: "Konsistensi Waktu",
    summary: "Seluruh tanggal kini relatif terhadap waktu sistem — aman dari lompatan tahun sandbox.",
    tasks: ["3"],
    fixed: [
      "Tanggal seed dihitung relatif (new Date()) — sertifikat tidak lagi tampak kedaluwarsa",
      "Kode tracking memakai tahun berjalan; tahun copyright footer dinamis",
    ],
    changed: ["Verifikasi E2E pertama via Agent Browser — seluruh alur utama lulus"],
  },
  {
    version: "1.2.0",
    date: isoDaysAgo(28),
    type: "minor",
    codename: "Panorama",
    title: "Antarmuka Publik Lengkap",
    summary: "18 komponen UI publik + 5 aset gambar AI menyatu dalam satu halaman naratif.",
    tasks: ["2-b"],
    added: [
      "18 komponen: hero 3D tilt, marquee kepercayaan, verifikasi cepat, program tabs+dialog, direktori, dewan pakar (chips kategori), statistik, wizard pendaftaran 3 langkah, pelacakan, berita, FAQ, testimoni, kontak",
      "5 aset gambar AI (hero, berita QR/IATA/kesehatan, munas)",
    ],
    changed: ["Halaman tunggal ber-assemble di page.tsx — footer sticky mt-auto"],
  },
  {
    version: "1.1.0",
    date: isoDaysAgo(29),
    type: "minor",
    codename: "Meridian",
    title: "Sembilan API Publik",
    summary:
      "Lapisan data terbuka: statistik, program, verifikasi, direktori, pakar, berita, aplikasi, kontak.",
    tasks: ["2-a"],
    added: [
      "GET /api/stats, /api/programs, /api/directory (filter kota/tier + urut tier), /api/experts, /api/news",
      "POST /api/verify (case-insensitive + catat VerifyLog), /api/applications (zod + kode unik PSK-YYYY-XXXXX), /api/contact",
    ],
    changed: [
      "Kontrak API resmi: { ok: true, data } / { ok: false, error } — semua route force-dynamic",
    ],
  },
  {
    version: "1.0.0",
    date: isoDaysAgo(30),
    type: "major",
    codename: "Genesis",
    title: "Fondasi PUSAKA",
    summary:
      "Kelahiran platform: skema data, seed awal, identitas visual, dan kontrak arsitektur.",
    tasks: ["1"],
    added: [
      "Fondasi Next.js 16 App Router + TypeScript strict + Tailwind 4 + shadcn/ui",
      "Skema Prisma (SQLite): Program, Institution, Expert, Application, VerifyLog, NewsArticle, ContactMessage",
      "Seed awal: 7 program, 24 institusi, 46 dewan pakar, 6 berita, 4 aplikasi contoh",
      "Identitas PUSAKA — palet Emerald–Gold, font Plus Jakarta Sans, prinsip tanpa indigo/blue",
    ],
  },
];

// ---------- Statistik turunan ----------

export const TOTAL_RELEASES = CHANGELOG.length;

export const FIRST_RELEASE = CHANGELOG[CHANGELOG.length - 1]?.version ?? OS_VERSION;

export const RELEASE_COUNTS: Record<ReleaseType, number> = {
  major: CHANGELOG.filter((e) => e.type === "major").length,
  minor: CHANGELOG.filter((e) => e.type === "minor").length,
  patch: CHANGELOG.filter((e) => e.type === "patch").length,
};

/** Entri rilis berjalan (entri pertama yang versinya sama dengan OS_VERSION). */
export const CURRENT_RELEASE: ChangelogEntry =
  CHANGELOG.find((e) => e.version === OS_VERSION) ?? CHANGELOG[0];

// ---------- Utilitas SemVer 2.0.0 ----------

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;

/** Uraikan string versi menjadi komponen semantik. null bila tak valid. */
export function parseSemVer(version: string): SemVer | null {
  const m = SEMVER_RE.exec(version.trim());
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

/** Validitas string versi menurut SemVer 2.0.0. */
export function isValidSemVer(version: string): boolean {
  return SEMVER_RE.test(version.trim());
}

/** Bandingkan dua versi: -1 jika a<b, 0 jika sama, 1 jika a>b (precedence SemVer). */
export function compareSemVer(a: string, b: string): number {
  const va = parseSemVer(a);
  const vb = parseSemVer(b);
  if (!va || !vb) return 0;
  for (const key of ["major", "minor", "patch"] as const) {
    if (va[key] !== vb[key]) return va[key] > vb[key] ? 1 : -1;
  }
  // Pre-release (< rilis stabil) — cukup untuk kebutuhan registri ini.
  const pa = a.includes("-");
  const pb = b.includes("-");
  if (pa !== pb) return pa ? -1 : 1;
  return 0;
}

/** Naikkan versi satu tingkat: major | minor | patch. */
export function bumpSemVer(version: string, part: ReleaseType): string {
  const v = parseSemVer(version) ?? { major: 0, minor: 0, patch: 0 };
  if (part === "major") return `${v.major + 1}.0.0`;
  if (part === "minor") return `${v.major}.${v.minor + 1}.0`;
  return `${v.major}.${v.minor}.${v.patch + 1}`;
}

/** Label tampilan, mis. "PUSAKA v6.0.0". */
export function getVersionLabel(version: string = OS_VERSION): string {
  return `${OS_NAME} v${version}`;
}

/** Tiga proyeksi langkah berikutnya (bantu perencanaan rilis). */
export function nextVersionProjections(version: string = OS_VERSION): Record<ReleaseType, string> {
  return {
    major: bumpSemVer(version, "major"),
    minor: bumpSemVer(version, "minor"),
    patch: bumpSemVer(version, "patch"),
  };
}
