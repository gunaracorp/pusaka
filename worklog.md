# Worklog — Proyek PUSAKA

---

Task ID: 1
Agent: Main Orchestrator (Z.ai)
Task: Setup fondasi proyek PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi (PIHK, PPIU, BPW, IATA, Izin Umrah/Haji) dengan 46 Dewan Pakar Lintas Bidang.

Work Log:
- Eksplorasi struktur proyek Next.js 16 + shadcn/ui + Prisma (SQLite).
- Membuat `prisma/schema.prisma` dengan 7 model: Program, Institution, Expert, Application, VerifyLog, NewsArticle, ContactMessage. Sudah di-push via `bun run db:push`.
- Membuat dan menjalankan `prisma/seed.ts` — hasil: 7 program sertifikasi, 24 institusi terakreditasi, 46 dewan pakar, 6 berita, 4 aplikasi contoh (tracking codes: PSK-2025-83012 s/d 83015), 22 verify logs.
- Branding: **PUSAKA** (Pusat Sertifikasi & Akreditasi Kompetensi). Tagline: "Lembaga Sertifikasi & Akreditasi Industri Perjalanan Wisata, Umrah & Haji".
- Palet warna: EMERALD (primary) + GOLD/AMBER (aksen premium). DILARANG memakai indigo/blue. Dark hero + light body.

Stage Summary:
- Database siap di `db/custom.db` (DATABASE_URL=file:/home/z/my-project/db/custom.db).
- Kontrak API di bawah — WAJIB dipatuhi agent backend & frontend.

## KONTRAK API (src/app/api/...)

Semua route mengembalikan `{ ok: true, data: ... }` atau `{ ok: false, error: string }`.

1. **GET /api/stats** → data:
   ```ts
   {
     totals: { certificateHolders: number, institutions: number, experts: number, programs: number, verificationsToday: number, applicationsThisMonth: number },
     programDistribution: { code: string, holders: number }[], // dari Program.holderCount
     tierDistribution: { tier: string, count: number }[],      // SILVER/GOLD/PLATINUM dari Institution
     recentActivity: { certNumber: string, result: string, at: string }[], // 8 terbaru dari VerifyLog desc
     topProvinces: { province: string, count: number }[]       // 6 teratas dari Institution
   }
   ```

2. **GET /api/programs** → `data: Program[]` (semua field model Program; `requirements` & `benefits` & `accreditation` berupa string JSON — parse di client).

3. **POST /api/verify** body `{ certNumber: string }` → cari Institution by certNumber (case-insensitive, trim):
   - ditemukan → `{ ok: true, data: { valid: true, institution: Institution, program: { code, name } | null } }` + simpan VerifyLog VALID.
   - tidak → `{ ok: true, data: { valid: false } }` + simpan VerifyLog INVALID.
   - body kosong → `{ ok: false, error: "..." }` HTTP 400.

4. **GET /api/directory?q=&type=&tier=&city=** → `data: Institution[]` (filter opsional; q = nama ATAU certNumber contains; sorted tier PLATINUM>GOLD>SILVER lalu score desc; max 50).

5. **GET /api/experts** → `data: Expert[]` (46 pakar, sorted featured desc, name asc).

6. **GET /api/news** → `data: NewsArticle[]` desc by publishedAt.

7. **POST /api/applications** body `{ applicantType, programCode, fullName, email, phone, institution?, city, message? }`:
   - Validasi zod: fullName>=3, email valid, phone>=9 digit, programCode harus ada di tabel Program.
   - Generate trackingCode `PSK-2025-{5 digit acak}` (unique check loop).
   - Simpan status default SUBMITTED → `{ ok: true, data: { trackingCode, status } }`.

8. **GET /api/applications?code=PSK-2025-XXXXX** → cari by trackingCode (case-insensitive):
   - ditemukan → `{ ok: true, data: { trackingCode, programCode, status, fullName, createdAt, statusHistory: [{ label, at, done: boolean }] } }` — statusHistory di-generate berdasarkan tahap SUBMITTED→REVIEW→VERIFIKASI→ASSESSMENT→APPROVED.
   - tidak → `{ ok: false, error: "..." }` HTTP 404.

9. **POST /api/contact** body `{ name, email, subject, message }` → simpan ContactMessage → `{ ok: true, data: { received: true } }`.

Catatan penting untuk agent backend:
- gunakan `import { db } from '@/lib/db'`.
- LARANG menulis test. LARANG memakai server actions — pakai route handlers (`export async function GET/POST(req: Request)`).
- File route hanya boleh di `src/app/api/<name>/route.ts` (jangan ubah page.tsx).
- `export const dynamic = 'force-dynamic'` di setiap route agar data selalu fresh.

---
Task ID: 2-a
Agent: Backend API Agent
Task: Membangun 9 API route PUSAKA

Work Log:
- Membaca worklog.md + prisma/schema.prisma sebagai acuan kontrak & model data.
- Membuat 8 file route (9 handler) di `src/app/api/`: stats, programs, verify, directory, experts, news, applications (GET+POST), contact.
- Semua route: `export const dynamic = 'force-dynamic'`, import `db` dari `@/lib/db`, NextResponse JSON `{ ok, data | error }`, try/catch + console.error, HTTP 400/404/500 sesuai kontrak.
- `/api/stats`: Promise.all paralel — certificateHolders = sum Program.holderCount (23.498), verificationsToday (sejak awal hari), applicationsThisMonth (sejak awal bulan), programDistribution (sorted holders desc), tierDistribution (SILVER/GOLD/PLATINUM, count 0 tetap muncul), recentActivity 8 VerifyLog terakhir, topProvinces 6 teratas (group by province).
- `/api/verify`: zod validasi certNumber; normalisasi trim+toUpperCase (SQLite tidak punya mode insensitive); findUnique by certNumber; simpan VerifyLog VALID/INVALID; program di-resolve dari institution.programCode → `{ code, name }` atau null.
- `/api/directory`: fetch semua → filter in-memory (q = nama/certNumber contains case-insensitive; type/tier/city case-insensitive) → sort tier PLATINUM(3)>GOLD(2)>SILVER(1) lalu score desc → slice(0,50).
- `/api/applications` POST: zod v4 (applicantType enum, fullName>=3, z.email, phone>=9 digit + regex angka, city wajib; programCode dicek ke tabel Program → 400 jika tidak ada); generate `PSK-2025-{5 digit}` via loop unique-check findUnique (max 25 attempt); simpan status SUBMITTED. GET `?code=`: case-insensitive (toUpperCase), 404 jika tidak ada, statusHistory 5 tahap SUBMITTED→REVIEW→VERIFIKASI→ASSESSMENT→APPROVED dengan `{ label, stage, at, done }` — at = createdAt utk tahap done, null untuk belum; field `stage` (raw status) ditambahkan sebagai bonus utk frontend.
- `/api/contact`: zod (name>=2, email, subject>=3, message>=1), simpan ContactMessage → `{ received: true }`.
- Verifikasi: semua 15 curl test sukses (200 sukses, 400 body invalid/program tak ada, 404 code tak ditemukan; verify lowercase `ppu-2025-0001` → valid:true; `FAKE-9999` → valid:false dengan HTTP 200; tracking `psk-2025-83012` → ASSESSMENT dengan statusHistory 4 done 1 pending; POST applications → PSK-2025-88338 dan bisa dilacak). `tsc --noEmit` bersih untuk src/app/api (error TSC hanya di folder examples/ bawaan sandbox). Tidak ada error kompilasi di dev.log.

Stage Summary:
- Endpoint tersedia: GET /api/stats, GET /api/programs, POST /api/verify, GET /api/directory(?q&type&tier&city), GET /api/experts, GET /api/news, POST+GET /api/applications(?code=), POST /api/contact — semua teruji via curl dan siap dipakai frontend.
- Format response konsisten `{ ok: true, data }` / `{ ok: false, error }`; status HTTP: 200 sukses, 400 body/tidak valid, 404 tidak ditemukan, 500 server error.
- Catatan kontrak tambahan: GET /api/applications menyertakan `stage` (raw status code) di tiap item statusHistory selain `label` yang human-readable; verify mengembalikan tanggal sebagai ISO string.

---
Task ID: 2-b
Agent: Frontend UI Agent
Task: Membangun UI PUSAKA lengkap

Work Log:
- Membaca kontrak API & schema.prisma; memetakan 9 endpoint ke fetcher typed di src/lib/pusaka.ts (apiRequest generik parsing {ok,data}/{ok,error}, relative path, cache no-store).
- Design system: override token shadcn di globals.css → --primary emerald-700 oklch(0.51 0.096 186), --ring emerald-600, chart-1..5 emerald/amber/teal/lime/orange, accent amber; smooth scroll, selection emerald, custom scrollbar tipis emerald, utility .font-display & .pb-safe, keyframes marquee + shine-sweep + float-soft + pulse-amber.
- layout.tsx: Plus_Jakarta_Sans (--font-jakarta) + Geist_Mono, lang="id", metadata SEO Indonesia "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi | PIHK, PPIU, BPW, IATA", Toaster sonner (richColors, top-center).
- Membuat 19 komponen section di src/components/pusaka/: navbar (glassmorphism + Sheet mobile), hero (emerald-950 + hero-bg.png + kartu sertifikat 3D-tilt shine + 4 animated counter), trust-marquee (CSS infinite, pause on hover), quick-verify (POST /api/verify inline + hint chip), programs (Tabs kategori, dialog detail requirements/benefits/accreditation, CustomEvent pusaka:select-program + scroll ke #pendaftaran), verify-section (kartu sertifikat digital premium border gold + QR pattern 5x5 deterministic + panel aktivitas real-time refresh 10s AnimatePresence), process (5 langkah + garis progress animated), directory (search debounce 400ms, filter jenis/tier, skor audit progress, skeleton, list max-h scroll), experts (chip filter 9 kategori + counter, dialog profil, grid max-h-600), stats-section (4 counter + Recharts BarChart programDistribution & PieChart tierDistribution), application-form (multi-step 3 langkah: data pemohon radio-card → pilih program via Select + listener CustomEvent → ringkasan + persetujuan; validasi manual + toast; sukses menampilkan tracking code besar + copy clipboard), track (stepper vertikal statusHistory done/current/future, error state elegan, hint kode), news (featured + list, gambar per slug, dialog konten whitespace-pre-line), faq (Accordion 8 item), testimonials (carousel manual AnimatePresence prev/next + dot), contact (CTA gelap + form POST /api/contact), footer (mt-auto sticky bawah, pb-safe, 4 kolom + bar ISO badge).
- Rakit src/app/page.tsx sebagai SPA: wrapper min-h-screen flex flex-col, 16 section berurutan sesuai spek, footer mt-auto.
- Data & format: seluruh angka/tanggal via Intl id-ID (formatNumber/formatIDR/formatDate/timeAgo), safeParseJsonArray untuk kolom JSON string, fallback FALLBACK_STATS saat /api/stats gagal.
- bun run lint: 0 error 0 warning (memperbaiki 1 parsing error formatter Recharts di stats-section.tsx). dev.log: GET / 200, semua API 200, tanpa error kompilasi.

Stage Summary:
- Komponen dibuat: fade-in.tsx, animated-counter.tsx, navbar.tsx, hero.tsx, trust-marquee.tsx, quick-verify.tsx, certificate-card.tsx, programs.tsx, verify-section.tsx, process.tsx, directory.tsx, experts.tsx, stats-section.tsx, application-form.tsx, track.tsx, news.tsx, faq.tsx, testimonials.tsx, contact.tsx, footer.tsx + lib/pusaka.ts + page.tsx + globals.css + layout.tsx. Total 16 section + navbar + footer.
- Fitur utama terpasang & teruji terhadap backend live: verifikasi cepat & lengkap (kartu digital VALID/INVALID), direktori (filter debounce), form multi-step 3 langkah (tracking code + copy), pelacakan status (stepper 5 tahap), dewan pakar 46 (chip kategori + dialog), statistik recharts, marquee mitra, berita, FAQ, testimoni, kontak.
- Catatan: hanya menyentuh page.tsx/layout/globals/lib/pusaka components — tidak mengubah src/app/api/** maupun prisma. Semua fetch relative path. Warna: emerald + gold/amber, tanpa indigo/blue.

---
Task ID: 3
Agent: Main Orchestrator (Z.ai)
Task: Integrasi final + perbaikan konsistensi tanggal + verifikasi end-to-end Agent Browser.

Work Log:
- Menemukan jam sistem sandbox = 2026-09-13 sedangkan seed hardcode 2025 → sertifikat bisa "AKTIF" padahal sudah kedaluwarsa.
- Memperbaiki: seed dibuat relatif thd tanggal aktual (issued=now-(3+i) bulan, expires=+3 thn; KADALUARSA dibuat lewat masa berlaku), generateTrackingCode pakai tahun dinamis, footer © pakai new Date().getFullYear().
- Re-seed database sukses.
- Agent Browser E2E (desktop 1280px & mobile 390px): hero, marquee mitra, QuickVerify (VALID PPU-2025-0001 → PT Zahra Tour Indonesia PLATINUM), kartu sertifikat digital IAT-2025-0201 (skor 94, QR, AKTIF), direktori 24 lembaga sorted tier/skor, 46 pakar + chip kategori (total=46), form multi-step 3 langkah → submit → tracking PSK-2026-74403 → lacak stepper (Pengajuan Diterima ✓ / Review Berkas SEDANG DIPROSES), berita + gambar AI, FAQ, footer sticky + badge ISO/BNSP, menu mobile Sheet.
- `bun run lint` → 0 error. `dev.log` tanpa error.

Stage Summary:
- Website PUSAKA lengkap & terverifikasi end-to-end di http://localhost:3000 (preview panel).
- 9 API endpoint + 18 komponen section + 5 gambar AI (hero-bg, news-qr, news-iata, news-health, munas).
- Demo: verifikasi PPU-2025-0001 / BPW-2025-0102 / IAT-2025-0201; lacak PSK-2025-83012.
