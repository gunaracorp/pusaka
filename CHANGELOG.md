# Changelog — PUSAKA

Semua perubahan penting pada proyek PUSAKA didokumentasikan di sini.
Format mengikuti **Keep a Changelog 1.1.0** + **SemVer 2.0.0** (standar lengkap: `VERSIONING.md`).

- Marker: `[+]` Added · `[~]` Changed · `[-]` Removed · `[!]` Fixed · `[$]` Security
- Sumber kebenaran: `src/lib/version.ts` · API mesin: `GET /api/version` · Lencana UI: footer

---

## [6.1.0] — MINOR — "Lighthouse"

**Halaman Tersendiri & Infrastruktur SEO Penuh.** *Task: 13*

- [+] 6 halaman layanan resmi (deep-link `#/p/layanan/...`): PIHK, PPIU, BPW, IATA, Izin Umrah, Izin Haji — hero, manfaat, lingkup layanan, persyaratan, alur proses 5 langkah, FAQ, layanan terkait, CTA
- [+] 5 halaman informasi: Tentang PUSAKA (profil, visi-misi, nilai), Kontak (info kantor + bantuan cepat), Pusat Bantuan (FAQ 12 butir), Kebijakan Privasi & Syarat Ketentuan (7 bagian per dokumen)
- [+] Metadata layout lengkap: metadataBase, canonical, hreflang `id/en/ar/x-default`, robots + googleBot directive, Open Graph + Twitter card dengan gambar, PWA manifest, icons
- [+] Rute SEO file-based: `sitemap.xml` (11 entri deep-link), `robots.txt` (+referensi sitemap), `manifest.webmanifest`, `icon.svg`, `og-image.png` 1200×630 (screenshot presisi dari kartu branding)
- [+] JSON-LD terstruktur: `@graph` Organization + WebSite + ProfessionalService (server-rendered di RootLayout); Service + FAQPage + BreadcrumbList per halaman
- [+] Konten i18n penuh 3 bahasa (ID/EN/AR) untuk 11 halaman baru + dukungan parameter `?lang=` (hreflang/crawler — tidak menimpa preferensi tersimpan)
- [+] Navigasi: dropdown “Halaman” di navbar (desktop + Sheet mobile), kolom Program footer → halaman resmi tiap program, tautan legal di bar bawah, tautan “Buka halaman resmi program” pada dialog Program
- [~] SEO title/meta/canonical dikelola satu sumber (`usePageSeo` di Home) dengan MutationObserver pengaman agar tidak tertimpa runtime head Next.js
- [~] Butir footer “Izin Umrah & Haji” dipecah menjadi dua tautan halaman: Izin Umrah & Izin Haji
- [!] Konflik `public/robots.txt` vs `app/robots.ts` (HTTP 500) — file statis dihapus, robots dinamis dengan sitemap yang menang

## [6.0.1] — PATCH — "Lingua"

**Perbaikan Persistensi Bahasa.** *Task: 12-b*

- [!] `I18nProvider` menimpa localStorage bahasa tersimpan saat mount (effect `[lang]` menulis default "id" sebelum pembacaan selesai) — penulisan kini hanya terjadi saat pengguna mengganti bahasa
- [!] Pembacaan bahasa tersimpan tidak lagi memakai `setTimeout` sehingga pemuatan lebih deterministik
- [~] Rebrand sistem versi: "Gunara OS" → "PUSAKA" (revisi pemilik produk) — lencana, dialog, kamus i18n 3 bahasa, dan dokumen standar

## [6.0.0] — MAJOR — "Sentinel"

**Sistem Kontrol Versi PUSAKA** — tata kelola rilis berstandar internasional kini hidup di kode, API, dan antarmuka.
*Task: 12*

- [+] Standar `VERSIONING.md` (SemVer 2.0.0 + Keep a Changelog 1.1.0) dan file `VERSION` di akar repositori
- [+] Registri `src/lib/version.ts` — 18 rilis terdokumentasi + ketertelusuran Task ID + util semver `parse/compare/bump`
- [+] API `GET /api/version` (`?type=&limit=&q=`) untuk konsumsi mesin, monitoring, dan otomasi
- [+] Lencana PUSAKA di footer + dialog Riwayat Versi interaktif (i18n ID/EN/AR, RTL-safe)
- [+] Protokol Worklog v2 — marker `[+]/[~]/[-]/[!]/[$]` + tag rilis wajib per task
- [~] `CHANGELOG.md` menjadi bagian resmi repositori — append-only, dilarang menulis ulang entri lama

## [5.1.1] — PATCH — "Concord"

**Konsolidasi Katalog & Stabilitas.** *Task: 11*

- [!] Konflik tsc pada `api/services` & `api/stats` — pemetaan eksplisit union type ServiceRow/StatT
- [!] Seed gagal re-run: `payment.deleteMany()` hilang — invoiceNo deterministik bentrok saat re-seed
- [~] Stabilitas dev server via supervisor platform + pembersihan cache `.next` agar Prisma client baru terbaca
- [~] Verifikasi E2E menyeluruh: katalog, tutorial, RTL Arab, mobile 390px, regresi verifikasi sertifikat

## [5.1.0] — MINOR — "Polymath"

**Branding Gugun Gunara & Jaringan Ekosistem.** *Task: 11-b*

- [+] `FounderSection` (#pendiri) — profil Gugun Gunara: Master Polymath • Sage Universal • The Ultimate Problem Solver
- [+] `PartnerSites` (#ekosistem) — gunara.web.id, pusatperizinan.com, gohajj.web.id (target _blank rel noopener)
- [+] Blok Jaringan Situs di footer + kredit founder
- [+] Kartu statistik ke-7 "Layanan Sertifikasi 500+" + pengumuman baru di TopTicker
- [+] Metadata SEO: "500+ Layanan Global oleh Gugun Gunara"
- [~] Navbar +2 tautan (#layanan, #tutorial); footer +2 tautan layanan; 39 kunci i18n × 3 bahasa (RTL-safe)

## [5.0.0] — MAJOR — "Pustaka"

**Katalog 500 Layanan & Pusat Tutorial.** *Task: 11, 11-a*

- [+] Model `Service` + katalog 500 layanan (25 bidang × 10 basis × 2 skema) berstandar internasional: ISO 9001/27001/45001, FSSC 22000, JCI, SNARS, IOSA, GLOBALG.A.P., LEED, ISO 37001:2025, Muthawif KMA 569/2020, dll.
- [+] API `GET /api/services` — pencarian, filter kategori/skema/lingkup, facet 25 kategori, pagination
- [+] `ServicesCatalog` (#layanan) — grid kartu, chip kategori, dialog detail layanan
- [+] `TutorialHub` (#tutorial) — Pusat Panduan 4 jalur + kode demo salin-otomatis
- [~] `prisma/data/services.ts` — generator katalog deterministik (FNV-1a); `/api/stats` menambah `totals.services`

## [4.2.1] — PATCH — "Anchor"

**Stabilisasi Tri Fitur.** *Task: 10*

- [~] Integrasi final seluruh fitur v4.x ke `page.tsx` + verifikasi E2E dalam 3 bahasa
- [!] Perbaikan lapangan hasil integrasi (key i18n, alur pembayaran, event bus portal)

## [4.2.0] — MINOR — "Vault"

**Payment Gateway Pendaftaran.** *Task: 9-e*

- [+] `PaymentPanel` multi-metode (virtual account, e-wallet, QRIS, kartu) dengan simulasi pembayaran
- [+] Integrasi pembayaran di layar sukses pendaftaran & kartu hasil lacak
- [+] Kotak status LUNAS/BELUM — invoice, penyedia, referensi, tanggal bayar
- [~] API payments + skema `Payment` di backend; i18n penuh applicationForm & track (ID/EN/AR)

## [4.1.0] — MINOR — "Keyholder"

**Portal Anggota Lembaga.** *Task: 9-f*

- [+] `member-portal.tsx` — login pemegang sertifikat + dasbor anggota
- [+] Event bus lintas komponen: `pusaka:open-portal` & `pusaka:autofill-track`
- [+] Kamus i18n portal (ID/EN/AR)

## [4.0.0] — MAJOR — "Polyglot"

**Mesin Tri Bahasa (ID/EN/AR) + RTL.** *Task: 9, 9-a … 9-d*

- [+] `I18nProvider` + hook `useI18n()` — `t()`, formatCurrency/Date/Number, timeAgo per locale
- [+] `LanguageSwitcher` di navbar + persistensi localStorage (`pusaka-lang`)
- [+] 28+ namespace kamus (navbar, hero, programs, directory, experts, news, footer, dll.)
- [~] Seluruh komponen publik dimigrasi ke `useI18n()` — string hardcoded dihapus; mode Arab `dir=rtl` + font Arab + utilitas logis

## [3.1.1] — PATCH — "Beacon"

**Integrasi Paket Digital.** *Task: 8*

- [~] Integrasi final 7 fitur (SAKA, dark mode, QR, deep-link, ticker, newsletter) + E2E Agent Browser

## [3.1.0] — MINOR — "Spectra"

**Paket Digital: QR Sertifikat, Ticker Hijriah, Newsletter.** *Task: 7-c*

- [+] Sertifikat digital: unduh PNG 1600×1130 dengan QR asli (canvas)
- [+] Deep-link verifikasi `?cert=<nomor>` — nomor terbaca otomatis ke verifikasi cepat
- [+] TopTicker — kalender Hijriah + pengumuman berputar
- [+] Newsletter — formulir footer + manajemen pelanggan di CMS
- [~] Footer memuat formulir berlangganan dengan validasi email

## [3.0.0] — MAJOR — "Oracle"

**SAKA AI & Dark Mode Penuh.** *Task: 7, 7-a, 7-b*

- [+] SAKA — asisten AI mengambang (`z-ai-web-dev-sdk` via `/api/assistant`) dengan jawaban kontekstual PUSAKA
- [+] ThemeProvider + palet `.dark` ber-identitas emerald — audit warna semua komponen publik
- [$] Rate-limit login CMS (in-memory) — memperlambat percobaan kredensial beruntun

## [2.1.1] — PATCH — "Prism"

**Perbaikan Lapisan Tampilan CMS.** *Task: 6-c*

- [!] Bug z-index dialog/sheet pada shell CMS — panel admin tidak lagi tertutup overlay

## [2.1.0] — MINOR — "Atlas"

**Jaringan Global 32 Negara.** *Task: 6-a, 6-b*

- [+] Model `GlobalNode` + seed 33 node / 32 negara (kantor, mitra internasional, jangkauan)
- [+] API `GET /api/global` + section Jaringan Global di UI publik
- [+] CRUD admin global-nodes + statistik `globalCountries`/`globalPartners` di `/api/stats`
- [~] Model `Program` menambah field countries (JSON)

## [2.0.0] — MAJOR — "Citadel"

**CMS Admin PUSAKA.** *Task: 4, 4-a, 4-b, 5*

- [+] CMS Admin PUSAKA — login AdminUser (bcrypt + cookie sesi) + dasbor CRUD lengkap
- [+] 15 API admin: kelola program, institusi, pakar, berita, aplikasi, pesan, log verifikasi
- [+] Manajemen status aplikasi (SUBMITTED → APPROVED) dari panel
- [~] Akses panel via tombol diskret di footer

## [1.2.1] — PATCH — "Kronos"

**Konsistensi Waktu.** *Task: 3*

- [!] Tanggal seed dihitung relatif (`new Date()`) — sertifikat tidak lagi tampak kedaluwarsa
- [!] Kode tracking memakai tahun berjalan; tahun copyright footer dinamis
- [~] Verifikasi E2E pertama via Agent Browser — seluruh alur utama lulus

## [1.2.0] — MINOR — "Panorama"

**Antarmuka Publik Lengkap.** *Task: 2-b*

- [+] 18 komponen: hero 3D tilt, marquee kepercayaan, verifikasi cepat, program tabs+dialog, direktori, dewan pakar (chips kategori), statistik, wizard pendaftaran 3 langkah, pelacakan, berita, FAQ, testimoni, kontak
- [+] 5 aset gambar AI (hero, berita QR/IATA/kesehatan, munas)
- [~] Halaman tunggal ber-assemble di `page.tsx` — footer sticky `mt-auto`

## [1.1.0] — MINOR — "Meridian"

**Sembilan API Publik.** *Task: 2-a*

- [+] `GET /api/stats`, `/api/programs`, `/api/directory` (filter kota/tier + urut tier), `/api/experts`, `/api/news`
- [+] `POST /api/verify` (case-insensitive + catat VerifyLog), `/api/applications` (zod + kode unik PSK-YYYY-XXXXX), `/api/contact`
- [~] Kontrak API resmi: `{ ok: true, data }` / `{ ok: false, error }` — semua route force-dynamic

## [1.0.0] — MAJOR — "Genesis"

**Fondasi PUSAKA.** *Task: 1*

- [+] Fondasi Next.js 16 App Router + TypeScript strict + Tailwind 4 + shadcn/ui
- [+] Skema Prisma (SQLite): Program, Institution, Expert, Application, VerifyLog, NewsArticle, ContactMessage
- [+] Seed awal: 7 program, 24 institusi, 46 dewan pakar, 6 berita, 4 aplikasi contoh
- [+] Identitas PUSAKA — palet Emerald–Gold, font Plus Jakarta Sans, prinsip tanpa indigo/blue

---

*PUSAKA — dikelola oleh Gugun Gunara (Master Polymath · Sage Universal · The Ultimate Problem Solver).*
