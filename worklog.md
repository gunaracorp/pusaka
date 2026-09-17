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

---
Task ID: 4 (perencanaan CMS)
Agent: Main Orchestrator (Z.ai)
Task: Menyiapkan fondasi CMS Admin PUSAKA.

Work Log:
- Menambah model `AdminUser` ke prisma/schema.prisma (username unique, name, passwordHash scrypt format "salt:hash", role SUPERADMIN|STAFF, lastLoginAt). Sudah db:push.
- Seed 2 akun: `admin`/`Pusaka2026!` (SUPERADMIN) dan `editor`/`Editor2026!` (STAFF) — bisa di-override via env ADMIN_PASSWORD/EDITOR_PASSWORD.
- Dev server di-restart agar Prisma client baru termuat.

Stage Summary:
- Kredensial CMS: admin/Pusaka2026! dan editor/Editor2026!
- Kontrak API CMS di bawah — WAJIB dipatuhi agent 4-a & 4-b.

## KONTRAK API CMS (src/app/api/...)

Autentikasi: cookie httpOnly `pusaka_admin_session` berisi token HMAC (`base64url(payload).sig`), payload {username, name, role, exp}. Secret default "pusaka-super-secret-key-2026" (env SESSION_SECRET). Semua route /api/admin/* WAJIB guard session → 401 {ok:false, error:"Tidak terautentikasi"} jika invalid/expired.

1. **POST /api/auth/login** body {username, password} → verifikasi terhadap AdminUser (scrypt). Sukses: 200 {ok:true,data:{user:{username,name,role}}} + Set-Cookie (maxAge 24 jam, httpOnly, sameSite lax, path /) + update lastLoginAt. Gagal: 401 {ok:false,error:"User ID atau password salah"}. Body kosong: 400.
2. **POST /api/auth/logout** → hapus cookie → {ok:true,data:{loggedOut:true}}.
3. **GET /api/auth/me** → {ok:true,data:{user:{username,name,role}}} ATAU {ok:true,data:null} (tanpa session — tetap HTTP 200).

Semua admin routes pakai pattern dynamic `[id]`:
4. **GET /api/admin/stats** → { totals:{programs,institutions,experts,news,applications,applicationsPending,verificationsToday,contactMessages,contactUnread}, recentApplications:Application[5] desc createdAt, recentVerifications:VerifyLog[8] desc, monthlyApplications:[{month:"Sep 2026",count}] 6 bulan terakhir dari createdAt Application }
5. **/api/admin/programs**: GET (list) + POST (create). **/api/admin/programs/[id]**: PUT + DELETE.
6. **/api/admin/institutions**: GET + POST. **/api/admin/institutions/[id]**: PUT + DELETE.
7. **/api/admin/experts**: GET + POST. **/api/admin/experts/[id]**: PUT + DELETE.
8. **/api/admin/news**: GET + POST. **/api/admin/news/[id]**: PUT + DELETE.
9. **/api/admin/applications**: GET (all desc, include program name lookup optional) . **/api/admin/applications/[id]**: PATCH {status} (valid enum) + DELETE.
10. **/api/admin/messages**: GET desc. **/api/admin/messages/[id]**: PATCH {handled:boolean} + DELETE.
11. **/api/admin/verify-logs**: GET (desc, limit 200, join count). Read-only.

Aturan teknis:
- Semua response { ok, data } / { ok, error } + try/catch + HTTP status tepat (400 zod, 401 auth, 404 not found, 409 unique conflict, 500 server).
- `export const dynamic = 'force-dynamic'`.
- Parse cookie dari `request.headers.get('cookie')` manual (JANGAN next/headers). Set cookie via NextResponse `res.cookies.set(...)`.
- zod v4 validasi body. Password JANGAN pernah di-log atau dikirim balik.
- Untuk POST/PUT program: requirements/benefits/accreditation boleh berupa string[] ATAU string JSON → simpan sebagai JSON string konsisten dengan data public (JSON.stringify). Frontend public sudah men-parse JSON string.
- Kredensial tidak boleh dikembalikan dalam response apapun selain {user:{username,name,role}}.

---
Task ID: 4-a
Agent: Backend Auth & Admin API Agent
Task: Membangun auth CMS + 15 admin API routes

Work Log:
- Membaca worklog.md (KONTRAK API CMS + KONTRAK API lama), prisma/schema.prisma, dan route contoh (verify, applications, experts, programs) agar gaya konsisten.
- Membuat `src/lib/auth.ts`: hashPassword scrypt ("salt:hash" hex, randomBytes 16 byte), verifyPassword timing-safe (crypto.timingSafeEqual, keylen = panjang hash tersimpan), createSessionToken (JSON → base64url → HMAC-SHA256 secret env SESSION_SECRET ?? "pusaka-super-secret-key-2026" → format `payload.sig`), verifySessionToken (cek signature timing-safe + exp epoch ms ATAU ISO string), getAdminSession (parse header cookie manual split "; " — tanpa next/headers, decodeURIComponent aman), konstanta SESSION_COOKIE='pusaka_admin_session' & SESSION_MAX_AGE=86400, tipe SessionPayload {username,name,role,exp}.
- Membuat `src/lib/admin-validation.ts`: skema zod v4 bersama (program/institution/expert/news create+update partial, applicationPatch, messagePatch) + helper formatZodError, isUniqueConstraintError (Prisma P2002 → 409), normalizeJsonList (array → JSON.stringify; string JSON array valid → biarkan; string biasa → pecah per baris baru), slugify, parseIsoDate. Field code/certNumber/licenseNo/initials/programCode di-trim + di-uppercase via transform; score 0-100, experienceYears 0-60, initials max 4; featured optional (default false di handler).
- 3 route auth: POST /api/auth/login (zod min 1, cari AdminUser by username trim, verifyPassword, sukses → token exp now+24jam + update lastLoginAt + Set-Cookie httpOnly/sameSite lax/path=/ maxAge 86400; salah → 401 "User ID atau password salah" (pesan identik utk user tak ada); body invalid → 400; password tidak pernah di-log), POST /api/auth/logout (cookie kosong maxAge 0 → {loggedOut:true}), GET /api/auth/me (valid → data.user; tidak ada/expired → data:null HTTP 200).
- 12 route admin (semua diawal guard getAdminSession → 401 "Tidak terautentikasi"): /admin/stats (9 totals + recentApplications 5 + recentVerifications 8 + monthlyApplications 6 bulan label Indonesia ["Jan".."Des"] + tahun), /admin/programs GET+POST & [id] PUT+DELETE (409 code duplikat, normalisasi requirements/benefits/accreditation), /admin/institutions GET+POST & [id] PUT+DELETE (certNumber unique 409, ISO date → Date, contact/phone optional), /admin/experts GET+POST & [id] PUT+DELETE (licenseNo unique 409), /admin/news GET+POST & [id] PUT+DELETE (slug auto-generate dari title bila kosong, unique 409, publishedAt default now), /admin/applications GET (desc + programName di-resolve manual via map — tanpa relasi FK) & [id] PATCH status enum + DELETE, /admin/messages GET desc & [id] PATCH handled + DELETE, /admin/verify-logs GET (desc take 200 + header X-Total-Count).
- Semua route: `export const dynamic = 'force-dynamic'`, import { db } dari '@/lib/db', params Promise di-await (`await ctx.params`, Next 16), try/catch + console.error, format {ok,data}/{ok,error}, HTTP 400/401/404/409/500. Tidak menyentuh page.tsx/layout/globals/components/schema.
- Verifikasi curl sequential (semua sukses): login admin → 200 + cookie; me → user SUPERADMIN; stats tanpa cookie → 401; login password salah → 401; POST news → slug auto "uji-coba-cms-test-artikel"; PUT news → featured:true, category REGULASI; DELETE news → {id}; GET applications → 4 item + programName terisi; logout → me data:null.
- Uji lanjutan: POST programs code "test-x1" → tersimpan "TEST-X1" (uppercase), requirements array & benefits multiline & accreditation JSON-string → JSON array konsisten, "30" → int 30 (coerce); duplicate code → 409; PUT partial (featured+seatsLeft "35"→35) tanpa mengubah field lain; DELETE + PUT id hilang → 404. POST institutions certNumber "uji-2026-9001" → "UJI-2026-9001" + programCode "ppiu" → "PPIU" + score "88" → 88; duplicate → 409; verifikasi publik /api/verify terhadap sertifikat baru → valid:true; PUT tier/score; DELETE. POST experts licenseNo "pak-2026-7777" → uppercase, initials "uc" → "UC", "12" → 12; duplicate 409; PUT; DELETE. PATCH application status APPROVED (lalu dikembalikan VERIFIKASI) + status invalid → 400; POST /api/contact → GET messages → PATCH handled:true → DELETE. verify-logs 23 log + X-Total-Count. Tamper token → 401. Login editor (username " editor " dengan spasi) → STAFF 200. Login {} → 400, bukan JSON → 400.
- Bunx tsc --noEmit: 0 error untuk src/app/api/** + src/lib/auth.ts + src/lib/admin-validation.ts (error tersisa hanya di skills/ bawaan sandbox & komponen CMS agent 4-b yang masih dikerjakan paralel). dev.log bersih tanpa error kompilasi. lastLoginAt kedua akun ter-update. Data uji dibersihkan (news/institution/expert/message/program uji dihapus, status aplikasi dikembalikan).

Stage Summary:
- Endpoint live & teruji: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me, GET /api/admin/stats, GET+POST /api/admin/programs, PUT+DELETE /api/admin/programs/[id], GET+POST /api/admin/institutions, PUT+DELETE /api/admin/institutions/[id], GET+POST /api/admin/experts, PUT+DELETE /api/admin/experts/[id], GET+POST /api/admin/news, PUT+DELETE /api/admin/news/[id], GET /api/admin/applications, PATCH+DELETE /api/admin/applications/[id], GET /api/admin/messages, PATCH+DELETE /api/admin/messages/[id], GET /api/admin/verify-logs.
- Mekanisme cookie: token HMAC-SHA256 `base64url(payload).sig` di cookie httpOnly `pusaka_admin_session` (sameSite lax, path /, maxAge 86400, secret env SESSION_SECRET ?? "pusaka-super-secret-key-2026"); cookie diparse manual dari request header (tanpa next/headers) sehingga aman utk route handler; guard 401 terbukti bekerja (cookie salah/kosong/tampered, token palsu, setelah logout).
- Catatan utk agent frontend CMS (4-b): semua GET admin mengembalikan array (kecuali stats = objek {totals, recentApplications, recentVerifications, monthlyApplications}); /api/admin/applications menyertakan `programName`; /api/admin/verify-logs menyertakan header X-Total-Count; requirements/benefits/accreditation berupa string JSON array (parse di client); slug di-generate otomatis jika tidak dikirim; field unik konflik → HTTP 409; kode/nomor sertifikat/lisensi/initials otomatis di-uppercase.

---
Task ID: 4-b
Agent: Frontend CMS Agent
Task: Membangun CMS admin (login + dashboard CRUD)

Work Log:
- Membaca worklog.md (KONTRAK API CMS), page.tsx, lib/pusaka.ts, navbar/footer, prisma schema, dan inventaris komponen shadcn/ui.
- Membuat `src/lib/admin-store.ts` (zustand v5): state {user, status: loading|authed|guest, loginOpen, showAdmin} + action init() (GET /api/auth/me → set user/status), login() (POST /api/auth/login → sukses set user+authed+close dialog return true; gagal return false), logout() (POST /api/auth/logout → guest), setLoginOpen(), setShowAdmin(). Semua fetch relative via apiRequest.
- Membuat `src/lib/admin-api.ts`: fetcher typed seluruh endpoint admin (auth/me, admin/stats, programs, institutions, experts, news, applications GET/PATCH/DELETE, messages GET/PATCH/DELETE, verify-logs dengan normalizer toleran array|{logs}); payload types Program/Institution/Expert/News; konstanta APPLICATION_STATUS_META (SUBMITTED stone, REVIEW amber, VERIFIKASI cyan, ASSESSMENT orange, APPROVED emerald) + APPLICATION_STATUSES.
- Membuat 10 komponen di `src/components/pusaka/admin/`:
  1) admin-login-dialog.tsx — dialog "Panel Admin PUSAKA", field User ID/Password + toggle mata, tombol Masuk loading spinner, error inline merah, kotak hint border emerald kredensial demo (admin/Pusaka2026! & editor/Editor2026!) klik-isi-otomatis; ikon LogIn/Eye/EyeOff/ShieldCheck; reset error via pola adjust-state-during-render (bebas lint set-state-in-effect).
  2) admin-dashboard.tsx — shell fixed inset-0 z-[60]: sidebar emerald-950 w-64 (logo PUSAKA + badge CMS, 8 menu ber-ikon, aktif bg-emerald-800/50 border-l amber, footer "Sesi aman • HMAC cookie"), topbar (judul section, tombol Lihat Situs → setShowAdmin(false), avatar inisial + nama + role + tombol Keluar → logout), mobile hamburger → Sheet kiri berisi menu sama + pb-safe, konten overflow-y-auto p-4/6.
  3) admin-dashboard-home.tsx — 8 kartu statistik (grid 2/4: Total Program, Institusi, Dewan Pakar, Sertifikat Terbit dari GET /api/stats certificateHolders, Pengajuan + badge pending, Verifikasi Hari Ini, Pesan + badge unread, Berita), BarChart Recharts monthlyApplications (emerald #059669), daftar 5 pengajuan terbaru + 8 verifikasi terbaru (badge VALID/INVALID), skeleton + empty/error state + Promise.allSettled.
  4) admin-programs.tsx — CRUD penuh: tabel (Kode mono, Nama, badge Kategori, formatIDR, Pemegang, star unggulan, edit/hapus), Dialog form semua field kontrak (code, name, shortName, category Select, tagline, description, requirements/benefits/accreditation textarea satu-per-baris → dikirim sebagai array string, durationDays/price/seatsLeft/holderCount/passRate number, accentColor Select 7 warna, featured Switch), POST/PUT/DELETE + AlertDialog konfirmasi + toast.
  5) admin-institutions.tsx — tabel (certNumber mono, Nama, badge Type/Tier/Status via meta publik, Kota, Progress skor), form: name, certNumber, type Select, programCode Select dari /api/programs, tier/status Select, city/province, score 0-100, issuedAt/expiresAt input date (konversi ISO ↔ yyyy-MM-dd), contact/phone.
  6) admin-experts.tsx — tabel (avatar inisial, Nama+organisasi, Bidang, badge Kategori 9 bidang, Lisensi mono, Pengalaman, star, aksi), count badge dinamis "46 Pakar", form lengkap (name, field, expertise, category Select, licenseNo, experienceYears, organization, education, initials auto-fallback dari nama, featured Switch).
  7) admin-news.tsx — tabel (judul bold + slug mono, badge kategori, penulis, tanggal, star, aksi), form: title, slug placeholder "otomatis dari judul" (+slugify client), excerpt, content Textarea besar rows 10, category Select, author, featured Switch, publishedAt date opsional.
  8) admin-applications.tsx — tabel (trackingCode mono, pemohon+email, badge PERUSAHAAN/INDIVIDU, programName||programCode, kota, tanggal, badge status berwarna + Select inline PATCH ubah status dengan spinner), filter Select status, tombol refresh, delete berkonfirmasi.
  9) admin-messages.tsx — kartu pesan (nama+mailto, subjek bold, isi, tanggal lengkap, badge "Belum dibaca", toggle Mail/MailOpen PATCH handled, delete), tombol refresh, highlight kartu belum dibaca.
  10) admin-verify-logs.tsx — read-only: certNumber mono, badge VALID emerald/INVALID merah, waktu relatif (timeAgo) + lengkap (formatDateTime), counter badge VALID/INVALID, refresh, max-h-[70vh] scroll dengan scrollbar tipis global.
- Pola kualitas lintas section: tabel dibungkus max-h-[70vh] overflow-auto (min-w agar horizontal scroll di mobile), baris hover emerald, header sticky, skeleton loading, empty state ikon+teks, toast sonner sukses/error, tombol icon aria-label, label htmlFor, focus-visible ring, palet emerald+amber tanpa indigo/blue.
- Integrasi page.tsx: tambah useEffect init() via useAdminStore((s)=>s.init); jika status==='authed' && showAdmin → render <AdminDashboard/> SAJA (+AdminLoginDialog); selain itu situs publik penuh + <AdminLoginDialog/> selalu dirender. Navbar: tombol ikon Shield ghost aria-label "Panel Admin" sebelum CTA (desktop) + tombol "Panel Admin" di Sheet mobile. Footer: button "Panel Admin" opacity rendah di bar bawah.
- bun run lint → 0 error 0 warning (memperbaiki 1 error react-hooks/set-state-in-effect di login dialog). dev.log: GET / 200, GET /api/auth/me 200, tanpa error kompilasi. Smoke curl: POST /api/auth/login (admin) → {ok:true,data:{user}}; GET /api/admin/stats & /api/admin/verify-logs dengan cookie → 200 sesuai kontrak; /api/admin/stats tanpa sesi → 401 (guard jalan). Tidak menyentuh src/app/api/**, prisma, atau komponen publik lain.

Stage Summary:
- CMS Admin PUSAKA lengkap: login dialog + dashboard shell (sidebar 8 menu, topbar, mobile Sheet) + 8 section (Dashboard statistik, Pengajuan, Program CRUD, Institusi CRUD, Dewan Pakar CRUD, Berita CRUD, Pesan, Log Verifikasi read-only) — semua mengikuti KONTRAK API CMS dengan response {ok,data}.
- Store: useAdminStore (zustand) di src/lib/admin-store.ts; fetcher admin di src/lib/admin-api.ts.
- Cara akses: situs publik → ikon perisai di navbar (desktop) / tombol "Panel Admin" di menu mobile / tautan "Panel Admin" di footer → dialog login (klik kartu kredensial demo untuk isi otomatis) → masuk → dashboard menggantikan situs (showAdmin); tombol "Lihat Situs" kembali ke publik; Keluar mengakhiri sesi. Kredensial: admin/Pusaka2026! (SUPERADMIN), editor/Editor2026! (STAFF).

---
Task ID: 5
Agent: Main Orchestrator (Z.ai)
Task: Integrasi final CMS + verifikasi E2E Agent Browser.

Work Log:
- Menemukan bug UX: saat masih authed di tampilan publik, trigger "Panel Admin" membuka dialog login lagi. Diperbaiki di navbar.tsx & footer.tsx: helper openAdminPanel() → jika status authed setShowAdmin(true), else setLoginOpen(true).
- Agent Browser E2E lengkap: login via kartu kredensial demo → dashboard (7 program, 24 institusi, 46 pakar, 23.498 sertifikat, pengajuan pending, verifikasi hari ini) → Pengajuan: ubah status inline PSK-2025-83013 → Asesmen (toast sukses) → Berita: tulis artikel baru (slug otomatis) → tampil di tabel CMS DAN situs publik (sinkron) → reload browser: sesi persist (cookie HMAC httpOnly) → "Lihat Situs" → logout → kembali publik dengan toast.
- `bun run lint` → 0 error. dev.log bersih.

Stage Summary:
- CMS PUSAKA lengkap & terverifikasi E2E. Kredensial: admin/Pusaka2026! (SUPERADMIN), editor/Editor2026! (STAFF).
- 18 file backend (auth + 15 admin routes + lib auth/validation), 10 komponen CMS + admin-store + admin-api.
- Akses: ikon perisai di navbar / link "Panel Admin" di footer.

---
Task ID: 6-a
Agent: Backend Global Network Agent
Task: Backend fitur Jaringan Global PUSAKA — model GlobalNode + Program.countries, seed 33 node, API publik /api/global, field global di /api/stats, CRUD admin global-nodes.

Work Log:
- prisma/schema.prisma: tambah model GlobalNode (kind, country, countryCode ISO-2 non-unique, region 8 nilai, city, flag, title, orgName, description, scope JSON string, status AKTIF|MOU|APLIKASI, since, contact?, order, timestamps) + field `countries String?` di Program (JSON array of {flag,country,detail}). `bun run db:push` sukses (additive, data aman).
- prisma/seed.ts: import `globalNodes` & `programCountries` dari ./data/globalNodes; `prisma.globalNode.deleteMany()` bersama deleteMany lain; seed 33 node dengan `scope: JSON.stringify(node.scope)`; setelah create tiap program di-update `countries: JSON.stringify(programCountries[p.code] ?? [])`. Semua seed existing (programs, institutions 24, experts 46, news 6, applications 4, admin 2 akun, verify logs 22) dan logika tanggal relatif `new Date()` dipertahankan. Seed dijalankan via `bun prisma/seed.ts` — sukses.
- API publik GET /api/global (`src/app/api/global/route.ts`): `dynamic force-dynamic`, query opsional `region` (exact, case-insensitive), `kind` (exact), `q` (contains case-insensitive pada country/city/title/orgName), filter in-memory, sort order asc. `scope` dikembalikan sebagai JSON STRING. Response `data: { nodes, summary }` — summary dihitung dari SELURUH dataset: totalCountries (distinct countryCode), totalNodes, offices (KANTOR_PERWAKILAN), partners (MITRA_INTERNASIONAL), regionCounts urutan tetap [TIMUR_TENGAH, ASIA_TENGGARA, ASIA_SELATAN, ASIA_TIMUR, EROPA, AFRIKA, AMERIKA, OSEANIA].
- /api/stats ADDITIVE: field baru di level `data` (luar `totals`): `globalCountries` (distinct countryCode) & `globalPartners` (count kind=MITRA_INTERNASIONAL) — query dalam try/catch terpisah, default 0 jika tabel kosong; field existing tidak berubah. Interface StatsData ditambah 2 field.
- /api/programs: sudah pakai `findMany()` tanpa select eksplisit → field `countries` otomatis ikut (JSON string), tanpa perubahan route.
- src/lib/admin-validation.ts: tambah `countryCodeField` (trim+uppercase, tepat 2 huruf ISO-2), `globalNodeCreateSchema` (kind enum 2, region enum 8, status enum 3, country/city/title/orgName/description min 2, flag min 1, scope stringListField → normalizeJsonList → JSON.stringify di handler, since regex tahun 4 digit, contact optional+nullable, order coerce int >= 0 default 0) + `globalNodeUpdateSchema` = create.extend({order optional TANPA default}).partial() — override ini penting agar PUT partial tidak mereset order ke 0 (default zod tetap berjalan meski key tidak dikirim).
- API admin CRUD: `/api/admin/global-nodes` GET (list order asc) + POST; `/api/admin/global-nodes/[id]` PUT (partial) + DELETE. Semua guard `getAdminSession` → 401 "Tidak terautentikasi", `await ctx.params` (Next 16), body JSON invalid → 400, id tak ada → 404, tanpa unique field (tanpa 409), try/catch + console.error, format {ok,data}/{ok,error}.
- Restart dev server (kill port 3000 + pkill next) karena singleton Prisma client lama tidak punya `globalNode` ("Cannot read properties of undefined") — setelah restart aman.
- Verifikasi curl lengkap (semuanya lolos): GET /api/global → 200, 33 nodes, summary {totalCountries:32, totalNodes:33, offices:7, partners:26, regionCounts: TT10/ATenggara6/ASelatan3/ATimur3/EROPA4/AFRIKA4/AMERIKA2/OSEANIA1}, scope JSON string, terurut order asc. Filter: ?region=EROPA → 4 (London, Jenewa, Frankfurt, Roma; summary tetap full dataset), ?kind=KANTOR_PERWAKILAN → 7, ?q=nusuk → 1 (juga q=NUSUK → 1). /api/stats → globalCountries 32, globalPartners 26, totals lama utuh (certificateHolders 23.498, institutions 24, experts 46, programs 7). /api/programs → data[0].countries JSON.parse berisi array {flag,country,detail} untuk 7/7 program. Admin: GET tanpa cookie → 401; login admin → 200; POST node uji → countryCode " uj "→"UJ", order "99"→99 (coerce), scope array→JSON string, contact default null; GET list → 34 item order asc; PUT partial (status/city/contact tanpa order) → order 99 PRESERVED, scope multiline string → JSON array; PUT/DELETE id tidak ada → 404; POST body invalid (kind/status/region salah, countryCode 3 huruf, since "20x5") → 400 dengan pesan per-field; PUT order -3 → 400; POST bukan JSON → 400; DELETE node uji → kembali 33 node; logout → GET list 401 lagi. Data uji dibersihkan.
- bunx tsc --noEmit: 0 error untuk semua file backend yang dibuat (api/global, api/admin/global-nodes, api/stats, admin-validation, prisma/seed). Error TS tersisa hanya di src/components/pusaka/global-network.tsx (file frontend agent 6-b, di luar lingkup task ini).

Stage Summary:
- Backend Jaringan Global live & teruji: GET /api/global (filter region/kind/q + summary), /api/stats +globalCountries/globalPartners, CRUD admin /api/admin/global-nodes (+[id] PUT/DELETE), 33 node ter-seed, Program.countries terisi untuk 7 program.
- Kontrak utk agent frontend (6-b): GET /api/global → `data.nodes` = array GlobalNode dengan `scope` JSON STRING (parse di client, isi kode program) dan `contact` bisa null; `data.summary` = {totalCountries, totalNodes, offices, partners, regionCounts:{region,count}[] urutan tetap 8 kawasan} — summary SELALU full dataset meski ada filter. /api/stats → `data.globalCountries` & `data.globalPartners` berada di LEVEL data (sejajar `totals`), jadi BUKAN bagian dari totals — inilah sebab error TS di global-network.tsx (340): frontend mengirim summary.regionCounts ke prop number; sesuaikan tipe ke {region,count}[]. /api/programs → setiap program kini punya `countries?: string` (JSON array of {flag,country,detail} — kosong bila tidak ada). Admin: /api/admin/global-nodes GET mengembalikan array order asc; POST wajib semua field kecuali contact (nullable) & order (default 0); PUT partial; tidak ada 409 (tanpa field unique); countryCode otomatis trim+uppercase.
---
Task ID: 6-b
Agent: Frontend Global Network Agent
Task: Menambahkan fitur Jaringan Global (32 negara) ke UI publik + CMS sesuai kontrak API frozen Task 6-a.

Work Log:
- Membaca worklog.md, admin-programs.tsx, hero.tsx (referensi gaya dark), trust-marquee.tsx (pola marquee), globals.css (keyframes marquee), programs.tsx, stats-section.tsx, admin-api.ts, admin-dashboard.tsx, page.tsx, fade-in/animated-counter.
- src/lib/pusaka.ts: tambah tipe `GlobalNodeT`, `ProgramCountryDetail`, `GlobalResp`; extends `ProgramT` dgn `countries: string | null` & `StatsT` dgn `globalCountries`/`globalPartners`; FALLBACK_STATS +32/+26; fetcher `getGlobal()`; helper `safeParseCountryList()`; konstanta GLOBAL_REGION_LABEL, GLOBAL_REGION_ORDER, GLOBAL_KIND_LABEL, GLOBAL_STATUS_META, PROGRAM_LABELS; NAV_LINKS + item `#jaringan-global` "Jaringan" setelah Program.
- Komponen baru global-network.tsx ("use client"): section dark premium id="jaringan-global" (bg-emerald-950 + ornamen blur emerald-900/amber + heading custom varian dark — SectionHeading light tidak dipakai langsung krn warnanya untuk bg terang, dibuat heading selaras dgn FadeIn agar aman); 4 stat pill glass (Globe2/Network/Landmark/Handshake, AnimatedCounter id-ID, fallback summary dihitung dari nodes); flag marquee 32 negara (reuse .animate-marquee + .marquee-hover-pause, array diduplikasi utk loop mulus, tepi pudar emerald-950); kontrol filter: input pencarian (negara/kota/mitra), Select jenis 3 opsi, chip kawasan overflow-x-auto dgn count dari regionCounts (aktif bg-amber-400 text-emerald-950); grid kartu glass 1/2/3/4 kolom (flag text-4xl, badge jenis amber outline, country+MapPin city, title line-clamp-2, orgName line-clamp-1, chips scope maks 4 + "+N", footer badge status GLOBAL_STATUS_META + "sejak {since}"), seluruh kartu button aria-label → Dialog; FadeIn stagger delay bertingkat; skeleton grid 8 kartu, empty state dgn reset filter, error state dgn tombol Coba Lagi (pola reloadKey agar bebas react-hooks/set-state-in-effect); Dialog detail (max-h-[85vh] scroll): header flag+country+city+badge status, title, orgName, deskripsi, grid info Kawasan/Kota/Jenis/Beroperasi Sejak/Kontak (mailto), semua chips scope PROGRAM_LABELS, Button emerald "Ajukan Sertifikasi di Kawasan Ini" → CustomEvent pusaka:select-program (scope[0]) + scroll #pendaftaran + tutup dialog, Button outline "Hubungi Kantor" mailto; DialogDescription sr-only utk a11y.
- programs.tsx: blok "Cakupan Internasional" di ProgramDetailDialog setelah accreditation & sebelum CTA (Globe2 kecil + heading uppercase tracking-widest, baris flag+country bold+detail text-sm stone-600 dipisah border-b, render hanya jika safeParseCountryList > 0).
- stats-section.tsx: counters 4 → 6 (tambah Globe2 "Negara Mitra" s.globalCountries ?? 32 & Handshake "Mitra Internasional" s.globalPartners ?? 26), grid → grid-cols-2 sm:grid-cols-3 lg:grid-cols-6.
- src/lib/admin-api.ts: GlobalNodePayload + listAdminGlobalNodes/createAdminGlobalNode/updateAdminGlobalNode/deleteAdminGlobalNode (pola file ts, scope string[] array biasa).
- Komponen baru admin/admin-global-nodes.tsx (pola admin-programs.tsx): tabel min-w-[900px] max-h-[70vh] overflow-auto (flag, country+city+kawasan, title+org, badge jenis, badge status, N scope, order, aksi edit/hapus aria-label); Dialog form: Select jenis(2)/status(3)/kawasan(8), country, countryCode ISO-2 auto-uppercase maxLength 2, flag emoji, city, title, orgName, description Textarea, scope 7 checkbox PROGRAM_LABELS, since tahun 4 digit, contact nullable, order number; validasi client selaras zod backend (negara/kota/judul/org/deskripsi min 2 char, kode negara tepat 2 huruf, tahun 4 digit, order ≥ 0); AlertDialog konfirmasi hapus + toast sonner + skeleton/empty state.
- admin-dashboard.tsx: menu "Jaringan Global" (Globe2) setelah Dewan Pakar + renderSection case "global".
- page.tsx: import & render <GlobalNetwork /> tepat setelah <Programs />.
- QA: lint 0 error 0 warning (perbaiki 1 react-hooks/set-state-in-effect: pindah setLoading ke handler retry; perbaiki hydration error div-in-p dengan memindah Skeleton keluar dari <p>); tsc --noEmit bersih; browser E2E: section render 33 kartu & marquee 64 item, dialog detail + CTA dispatch event "PIHK" + scroll ke #pendaftaran + dialog tertutup, search "Jakarta"→1 kartu, chip Eropa→4 kartu (Inggris/Swiss/Jerman/Italia), empty state, Select Mitra Internasional→26 kartu, stats 6 counter dgn grid lg:grid-cols-6, dialog program menampilkan blok Cakupan Internasional (🇸🇦🇮🇩🇲🇾…), mobile 390px chip scroll horizontal & grid 1 kolom (kartu 358px); CMS E2E: login admin → menu Jaringan Global 33 baris → form create (3 Select + 7 checkbox scope) → POST sukses 34 baris → edit status ke MoU → delete via AlertDialog → kembali 33 baris; fresh load 0 console error.
- Backend 6-a ternyata sudah live & sesuai kontrak (33 nodes, summary 32/33/7/26, 8 kawasan; /api/stats globalCountries 32 & globalPartners 26; /api/programs punya countries; /api/admin/global-nodes guard 401) — frontend diverifikasi langsung terhadapnya; node uji (5 buah dari probe + 1 create UI) sudah dihapus semua via API, DB kembali 33 node.
- Tidak menyentuh src/app/api/**, prisma/**, schema, seed, footer, atau fade-in.tsx.

Stage Summary:
- Fitur Jaringan Global lengkap 2 sisi: section publik dark premium (#jaringan-global, masuk navbar "Jaringan") dgn marquee 32 bendera, 4 stat, filter search/jenis/kawasan client-side, grid 33 kartu, dialog detail + CTA ke form pendaftaran; blok "Cakupan Internasional" di dialog program; stats-section kini 6 counter.
- CMS: menu "Jaringan Global" CRUD penuh (list/create/edit/delete + validasi selaras zod backend + toast + konfirmasi), fetcher typed di admin-api.ts.
- bun run lint 0 error 0 warning; tsc bersih; terverifikasi E2E browser desktop & 390px terhadap API live; tanpa indigo/blue, emerald+amber konsisten.

---
Task ID: 6-c
Agent: Main Orchestrator (Z.ai)
Task: Verifikasi E2E independen Jaringan Global + perbaikan bug z-index dialog/sheet pada shell CMS.

Work Log:
- Grounding ulang: worklog menunjukkan CMS (Task 4/4-a/4-b/5) sudah selesai sebelumnya; fokus Task 6 = Jaringan Global. Author data sumber tunggal `prisma/data/globalNodes.ts` (33 node, 32 negara, 8 kawasan + programCountries 7 program) sebelum launch subagent.
- E2E Agent Browser desktop 1440px: section #jaringan-global render (4 stat pill 32/33/7/26, marquee bendera, chip kawasan dgn count, grid kartu); klik kartu Arab Saudi Makkah → dialog detail lengkap (info grid, chips scope 4 program, CTA); CTA "Ajukan Sertifikasi di Kawasan Ini" → CustomEvent pusaka:select-program "PIHK" + scroll #pendaftaran + wizard lompat ke langkah Pilih Program dengan PIHK ter-pilih; filter chip "Eropa (4)" → tepat 4 kartu (Inggris/Swiss/Jerman/Italia); pencarian "nusuk" → 1 kartu (Aliansi Platform Nusuk); kombinasi filter kosong → empty state + tombol Reset Filter; counter "Menampilkan X dari 33 node jaringan".
- Dialog program PIHK: blok "Cakupan Internasional" tampil 8 negara (flag + country + detail). Stats-section kini 6 counter (Negara Mitra 32, Mitra Internasional 26).
- **BUG DITEMUKAN (fungsional)**: Dialog "Tambah Node" CMS tidak terlihat — shell admin `fixed inset-0 z-[60]` menutupi Dialog/AlertDialog portal Radix (z-50). Sheet menu mobile admin (z-50) berpotensi sama. **FIX**: naikkan z-50 → z-[100] pada overlay+content `src/components/ui/dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx` (aman utk situs publik: dialog memang seharusnya di atas navbar z-50; toast sonner tetap paling atas). Re-verify: form "Tambah Node Jaringan" kini tampil penuh (2 Select, 3 input identitas negara, 7 checkbox scope, kontak/urutan).
- E2E CRUD CMS visual penuh: create "Negara Uji" (order 99) → baris muncul di tabel → AlertDialog konfirmasi hapus tampil → Hapus → baris hilang. Console bersih.
- A11y polish: tambah DialogDescription sr-only di ProgramDetailDialog (programs.tsx) untuk menghilangkan warning "Missing Description/aria-describedby".
- Mobile 390px: hero, section jaringan (stat 2x2, chip scroll horizontal, grid 1 kolom), kartu, menu Sheet navbar (item "Jaringan" baru tampil) — semua ok.
- Final: `bun run lint` 0 error; dev.log tanpa error; curl akhir — /api/global 33 node summary 32/33/7/26 regionCounts TT10/AT6/AS3/ATi3/E4/Af4/Am2/O1; /api/stats globalCountries 32 globalPartners 26; /api/admin/global-nodes tanpa sesi → 401.

Stage Summary:
- Fitur Jaringan Global PUSAKA SELESAI & terverifikasi end-to-end (publik + CMS): 32 negara, 33 node (7 kantor perwakilan + 26 mitra internasional), 8 kawasan; Cakupan Internasional 7 program; statistik 6 counter.
- Perbaikan lintas-fitur: z-index Dialog/AlertDialog/Sheet → z-[100] (bug tersembunyi sejak Task 4-b; semua form CMS kini benar-benar terlihat).
- Data master di prisma/data/globalNodes.ts — seed idempotent; CMS bisa CRUD node tanpa sentuh seed.

---
Task ID: 7 (fondasi)
Agent: Main Orchestrator (Z.ai)
Task: Analisis celah fitur + fondasi untuk 7 fitur baru PUSAKA (SAKA AI, Dark Mode, Sertifikat unduh+QR asli, deep-link verifikasi, Ticker+Hijriah, Newsletter, rate-limit login).

Work Log:
- Analisis celah atas Task 1–6: CMS & Jaringan Global sudah selesai; identifikasi 7 fitur baru yang belum ada.
- prisma/schema.prisma: tambah model `NewsletterSubscriber` (email unique, isActive default true, createdAt). `bun run db:push` sukses (additive), Prisma Client di-generate ulang.
- Install paket `qrcode` + `@types/qrcode` (QR asli client-side untuk sertifikat digital).
- Restart dev server (port 3000, /api/stats 200).

Stage Summary:
- Kontrak API fitur baru di bawah — WAJIB dipatuhi agent 7-a/7-b/7-c.

## KONTRAK API FITUR BARU (Task 7-a)
1. **POST /api/assistant** (publik) body {message: string 1..1000, history?: {role:'user'|'assistant', content:string}[] max 8} → zod → rate-limit 30 req/menit/IP (src/lib/rate-limit.ts, Map in-memory) → bangun system prompt DINAMIS dari DB (daftar program: code, name, category, tagline, price, durationDays, holderCount) + pengetahuan statis PUSAKA (46 dewan pakar, jaringan global 32 negara 8 kawasan, verifikasi contoh PPU-2025-0001/BPW-2025-0102/IAT-2025-0201, lacak di #lacak, kontak sekretariat@pusaka.go.id) → z-ai-web-dev-sdk (BACKEND ONLY): `const zai = await ZAI.create(); const completion = await zai.chat.completions.create({messages:[{role:'assistant',content:system},...history,{role:'user',content:message}], thinking:{type:'disabled'}})` → reply = completion.choices[0]?.message?.content → {ok:true,data:{reply, fallback:false}}. Persona "SAKA — Asisten Virtual PUSAKA", Bahasa Indonesia, maks ~120 kata, dilarang mengarang data. Gagal SDK → HTTP 200 {ok:true,data:{reply:"<pesan fallback sopan>", fallback:true}}.
2. **POST /api/newsletter** (publik) body {email} zod email → trim+lowercase → sudah ada → {ok:true,data:{subscribed:true, already:true}}; baru → create → {ok:true,data:{subscribed:true}}; invalid → 400 "Format email tidak valid".
3. **GET /api/admin/newsletter** (guard getAdminSession) → array desc createdAt + header X-Total-Count. **PATCH /api/admin/newsletter/[id]** body {isActive:boolean}. **DELETE /api/admin/newsletter/[id]**. 401/404/400 pola existing.
4. **Rate-limit login**: edit /api/auth/login — 5 percobaan gagal/15 menit/IP → 429 {ok:false,error:"Terlalu banyak percobaan. Coba lagi dalam 15 menit."}; sukses login reset counter. Lib src/lib/rate-limit.ts dipakai bersama.

---
Task ID: 7-a
Agent: Backend SAKA & Newsletter Agent
Task: 4 fitur backend baru — lib rate-limit in-memory, SAKA AI assistant API (z-ai-web-dev-sdk), Newsletter API (publik + admin), rate-limit login.

Work Log:
- Membuat `src/lib/rate-limit.ts` (tanpa dependensi): Map bucket fixed-window + lazy cleanup (bucket kadaluarsa dihapus saat diakses). API: `checkRateLimit` (cek+increment), `hitRateLimit` (increment; dipanggil hanya saat percobaan GAGAL), `peekRateLimit` (cek TANPA increment/buat bucket — dipakai pre-check login), `resetRateLimit`, `getClientIp` (x-forwarded-for IP pertama → x-real-ip → "anon").
- Membuat `src/app/api/assistant/route.ts` (POST saja, force-dynamic): zod v4 `message` 1..1000 + `history` array {role user|assistant, content 1..2000} max 8 optional → 400 via formatZodError; rate limit `assistant:`+IP 30/menit → 429 "Terlalu banyak pertanyaan. Tunggu sebentar lagi ya."; system prompt DINAMIS: `db.program.findMany()` diformat 1 baris/program `[CODE] Nama — kategori, tagline, biaya Rp X (id-ID), durasi N hari, pemegang sertifikat N` + pengetahuan statis (SAKA asisten resmi PUSAKA; 46 Dewan Pakar; 32 negara 8 kawasan; verifikasi #verifikasi contoh PPU-2025-0001/BPW-2025-0102/IAT-2025-0201; #lacak; #pendaftaran; kontak sekretariat@pusaka.go.id / +62 21 350 5075 / Gedung Pusdai Lt. 5 Jakarta Pusat) + aturan persona (Bahasa Indonesia santai-profesional, sapa "Anda", ~120 kata, bullet singkat, DILARANG mengarang nomor/harga/tanggal, di luar lingkup → arahkan kembali ke layanan/kontak). SDK di backend: `ZAI.create()` → `chat.completions.create({messages:[{role:'assistant',content:system},...history,{role:'user',content:message}], thinking:{type:'disabled'}})`. Sukses → 200 {ok:true,data:{reply,fallback:false}}; SDK error/reply kosong → TETAP 200 {ok:true,data:{reply:fallback,fallback:true}} + console.error penyebab (tanpa isi pesan user).
- Membuat `src/app/api/newsletter/route.ts` (POST saja): zod `email` trim+lowercase → z.email("Format email tidak valid") → 400; rate limit `newsletter:`+IP 10/menit → 429; findUnique existing → 200 {subscribed:true, already:true}; create baru → 200 {subscribed:true}; race P2002 → treated already:true; 500 selainnya.
- Membuat `src/app/api/admin/newsletter/route.ts`: guard `getAdminSession` → 401 "Tidak terautentikasi"; GET list desc createdAt via Promise.all(findMany+count) + header `X-Total-Count` (pattern /api/admin/verify-logs).
- Membuat `src/app/api/admin/newsletter/[id]/route.ts`: PATCH body {isActive:boolean} (zod → 400) → update; DELETE → delete; id tidak ada → 404 "Pelanggan tidak ditemukan"; `await ctx.params` (Next 16); guard 401 sama.
- Edit kecil `src/app/api/auth/login/route.ts`: sebelum verifikasi password → `peekRateLimit('login:'+getClientIp(request), 5, 15*60_000)` → jika habis → 429 "Terlalu banyak percobaan. Coba lagi dalam 15 menit."; di branch gagal → `hitRateLimit(...)` (counter HANYA naik saat gagal); login sukses → `resetRateLimit(...)` sebelum buat token. Perilaku sukses/error lain tidak diubah.
- Verifikasi: `bunx tsc --noEmit` → 0 error untuk file baru (sisa error lama hanya di examples/ & skills/); `bun run lint` → 0 error 0 warning; curl suite lengkap lolos (lihat hasil); restart dev server (kill port 3000 + pkill next + bun run dev) untuk clear bucket in-memory → login admin sukses lagi; dev.log tanpa error kompilasi.
- Catatan lingkungan: proses background (dev server) di sandbox agent ini tidak persisten antar perintah shell — server di-restart & diverifikasi dalam satu sesi perintah; orchestrator dapat menjalankan ulang `cd /home/z/my-project && nohup bun run dev > /dev/null 2>&1 &` bila port 3000 kosong.

Stage Summary:
- Endpoint live & teruji: POST /api/assistant (SAKA AI); POST /api/newsletter; GET /api/admin/newsletter (+X-Total-Count); PATCH & DELETE /api/admin/newsletter/[id]; POST /api/auth/login kini dengan rate-limit (5 gagal/15 menit/IP → 429).
- Kontrak utk frontend (7-b/7-c): /api/assistant → 200 {ok:true,data:{reply:string,fallback:boolean}} — fallback:true = teks gangguan teknis (UI boleh tetap render + tawarkan kontak); 429 {ok:false,error:"Terlalu banyak pertanyaan. Tunggu sebentar lagi ya."}; 400 {ok:false,error:"message: Pertanyaan wajib diisi"} dst. /api/newsletter → {ok:true,data:{subscribed:true, already?:true}}; 400 "Format email tidak valid"; 429 (10/menit/IP). /api/admin/newsletter → array {id,email,isActive,createdAt} desc + header X-Total-Count; PATCH {isActive:boolean}; DELETE; 404 "Pelanggan tidak ditemukan"; 401 "Tidak terautentikasi". Login: 6 percobaan gagal beruntun → ke-6 dapat 429; sukses login mereset counter.
- Rate limiter in-memory per proses (single-instance): restart server mengosongkan semua bucket; tidak perlu dependensi eksternal.

---
Task ID: 7-c
Agent: Frontend Digital Pack Agent
Task: 4 fitur frontend — QR asli + unduh sertifikat PNG (canvas 1600×1130), deep-link verifikasi ?cert=, TopTicker (Hijriah + pengumuman berputar), Newsletter (form footer + CMS admin-newsletter + menu dashboard).

Work Log:
- Membaca worklog.md (KONTRAK API Task 1, KONTRAK API CMS Task 4, KONTRAK API FITUR BARU Task 7), lib/pusaka.ts, lib/admin-api.ts, verify-section, certificate-card, footer, trust-marquee, admin-messages, admin-dashboard, admin-news (pola tabel).
- certificate-card.tsx: QR palsu (qrPattern 5x5) diganti QR SUNGGUHAN via `qrcode` — useEffect `QRCode.toDataURL(\`${origin}/?cert=${certNumber}\`, {width:240, margin:1, color:{dark:"#064e3b",light:"#ffffff"}})` → <img> h-20 w-20 rounded-md bg-white p-1 shadow-inner + skeleton animate-pulse saat belum siap (layout tetap); qrPattern tidak lagi dipakai di file ini. Tombol "Unduh Sertifikat" (Download icon, variant outline, border-amber-400/60 text-amber-300 hover:bg-amber-500/10 + dark: identik, Loader2 saat generate) di baris footer kartu berdampingan "Diverifikasi oleh PUSAKA".
- Fungsi unduh (async): generate/reuse QR → preload Image → canvas 1600×1130: gradasi vertikal #022c22→#064e3b→#022c22; border ganda gold 10px margin 24 + 2px rgba(212,175,55,.5) margin 40 + ornamen sudut garis gold; logo lingkaran gradient emerald→amber "P" + PUSAKA 44px + "SERTIFIKASI & AKREDITASI KOMPETENSI" 16px emerald-300 letterspacing (canvas letterSpacing bila didukung); judul "SERTIFIKAT DIGITAL RESMI" 54px gold letterspacing 14px; "Diberikan kepada" 18px → nama institusi bold 64px putih wrap 2 baris (helper wrapTextLines greedy + elipsis) → programName 24px emerald-100 → kota/provinsi 20px emerald-200/80; grid meta 2 kolom (label 14px emerald-400 uppercase + nilai 22px): Nomor Sertifikat monospace, Jenis Lembaga (TYPE_META), Program, Skor Audit "xx / 100" amber, Diterbitkan & Berlaku s.d. (formatDate id-ID); badge tier roundRect stroke gold kanan-atas; QR asli 160×160 berbingkai putih kanan-bawah area meta + caption "Pindai untuk verifikasi"; footer garis emerald-800 + "Diverifikasi oleh PUSAKA • Dewan Pakar 46 Lintas Bidang • {tanggal}" 16px + URL permanen mono 13px. Font Plus Jakarta Sans + fallback sistem. canvas.toBlob → objectURL → <a download="{cert}-PUSAKA.png"> → revoke; sukses toast.success("Sertifikat berhasil diunduh"), gagal toast.error. Helper pathRoundRect (roundRect + fallback arcTo).
- verify-section.tsx: (a) deep-link — useEffect + guard useRef (dengan reset di cleanup agar aman StrictMode), parse ?cert= → setValue(upper) → scrollIntoView smooth ke #verifikasi → void verify(cert); setState dibungkus setTimeout 0 agar bebas lint react-hooks/set-state-in-effect. (b) dark-ready: section bg-stone-50 dark:bg-stone-950; Card border-border (+ bg-card/70); chip contoh border-border bg-muted + dark: emerald; teks stone-500/600/400 → text-muted-foreground, stone-700 → text-foreground; area dashed → border-border bg-muted/50; baris aktivitas border-border bg-muted/50; kotak error/invalid red + dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300; struktur & logika lain tidak diubah. (c) baris "Tautan permanen: {origin}/?cert={certNumber}" dalam <code> setelah kartu VALID.
- NEW src/components/pusaka/top-ticker.tsx ("use client", named export TopTicker, tanpa props): bar h-10 bg-emerald-950 text-emerald-100 border-b emerald-900/60, inner max-w-7xl px-4 text-xs; badge Hijriah hidden sm:flex (MoonStar amber-400, Intl "id-ID-u-ca-islamic-umalqura" + " H", render "—" sebelum mounted via timeout-guard — bebas hydration mismatch & set-state-in-effect, try/catch bila kalender tak didukung); pengumuman berputar = 4 berita terbaru (getNews existing, pakai title) + 2 statis ("Pendaftaran batch sertifikasi 2026 resmi dibuka", "Verifikasi sertifikat kini online 24/7"), rotasi tiap 4 detik via setInterval (clear on unmount), AnimatePresence mode="wait" + motion.a fade + y 8px duration 0.35, Megaphone amber-400, teks truncate flex-1 text-emerald-100/85, klik → href "#berita"; loading/empty → statis saja; a11y: section aria-label="Pengumuman PUSAKA" + aria-live="polite".
- lib/pusaka.ts (tambahan saja): `subscribeNewsletter(email)` → POST /api/newsletter via apiRequest, return {subscribed, already?} + tipe NewsletterResult. Kode existing tidak disentuh.
- footer.tsx: grid lg:grid-cols-4 → lg:grid-cols-5; kolom baru "Newsletter" setelah Kontak (heading amber seragam, deskripsi emerald-200/70, form flex gap-2: Input h-11 flex-1 rounded-lg bg-emerald-900/40 border-emerald-800 text-white placeholder:text-emerald-300/40 aria-label + Button h-11 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold ikon Send + teks "Kirim" ≥sm, Loader2 saat kirim); state email/loading/subscribed, validasi regex sederhana, sukses → toast.success (pesan berbeda bila already) + kosongkan input + centang singkat, gagal → toast.error pesan API; teks mikro "Kami menghormati privasi Anda. Berhenti kapan saja." emerald-300/50.
- lib/admin-api.ts (tambahan saja): tipe `NewsletterT {id,email,isActive,createdAt}` + fetcher `listAdminNewsletter()` (GET), `toggleAdminNewsletter(id, isActive)` (PATCH), `deleteAdminNewsletter(id)` (DELETE) — pola apiRequest admin existing.
- NEW admin/admin-newsletter.tsx (pola admin-messages/admin-news): heading MailPlus + badge "{n} Pelanggan" emerald & "{n} Aktif" amber + tombol Muat Ulang + search input (Search icon, filter email client-side via useMemo); tabel min-w-[640px] dalam max-h-[70vh] overflow-auto rounded border, header sticky bg-stone-50: email font-mono, badge Aktif emerald/Nonaktif stone, tanggal formatDateTime + timeAgo, Switch aktif (PATCH toggle, spinner per-baris saat proses) + tombol Trash aria-label dengan AlertDialog konfirmasi (busy state); skeleton loading, empty state (data kosong vs hasil pencarian), toast sukses/error; emerald+amber, tanpa indigo/blue.
- admin-dashboard.tsx (edit kecil): MenuKey +"newsletter", MENU + {key:"newsletter", label:"Newsletter", icon:MailPlus} setelah "Pesan" (otomatis ikut sidebar desktop & Sheet mobile), renderSection case "newsletter" → <AdminNewsletter />.
- QA: `bun run lint` 0 error 0 warning; `bunx tsc --noEmit` bersih utk semua file ini (error tersisa hanya examples/ & skills/ bawaan sandbox); curl live — GET /api/news 200; POST /api/newsletter {"email":"cek-fe@pusaka.id"} → 200 {ok:true,data:{subscribed:true}} (kirim ulang → {subscribed:true,already:true} = kontrak cocok); login admin → GET /api/admin/newsletter 200 array desc + header X-Total-Count; PATCH toggle → isActive:false; DELETE data uji sukses; GET admin newsletter tanpa sesi → 401; GET / → 200; dev.log bersih tanpa error kompilasi (server sempat di-restart pihak lain saat pengerjaan — diverifikasi ulang setelah hidup).
- Tidak menyentuh page.tsx/layout/globals.css/navbar/saka-chat/theme-toggle/komponen publik lain/src/app/api/**/prisma/**; tidak db:push; tidak me-restart dev server.

Stage Summary:
- Task 7-c SELESAI: (1) kartu sertifikat kini ber-QR sungguhan (encode {origin}/?cert={no}) + unduh PNG 1600×1130 bergaya premium emerald-gold lengkap (border ganda, badge tier, meta grid, QR, footer verifikasi); (2) deep-link /?cert=NOMOR otomatis mengisi, scroll, dan memverifikasi sertifikat + tautan permanen tampil di hasil VALID; (3) TopTicker siap integrasi; (4) Newsletter lengkap 2 sisi — form footer (subscribeNewsletter) + CMS kelola pelanggan.
- CARA INTEGRASI page.tsx (orchestrator): `import { TopTicker } from "@/components/pusaka/top-ticker";` lalu render `<TopTicker />` sebagai elemen PERTAMA di dalam wrapper situs publik, TEPAT SEBELUM <Navbar/> (di luar/atas navbar sticky — ticker memang scroll away). Named export `TopTicker`, TANPA props. Jangan taruh di dalam Navbar. Posisi lain (mis. setelah Hero) tidak sesuai desain.
- admin-dashboard: menu key yang dipakai = "newsletter" (label "Newsletter", ikon MailPlus, posisi setelah "Pesan"); section komponen <AdminNewsletter /> dari admin/admin-newsletter.tsx.
- API integrasi terverifikasi live terhadap backend 7-a: POST /api/newsletter (already:true saat duplikat), GET/PATCH/DELETE /api/admin/newsletter (+X-Total-Count, guard 401) — sesuai kontrak frozen.

---
Task ID: 7-b
Agent: Frontend Dark Mode & SAKA Agent
Task: Dark mode penuh (ThemeProvider + palet .dark ber-identitas emerald + audit warna semua komponen publik) dan widget SAKA (asisten AI floating) untuk integrasi page.tsx oleh orchestrator.

Work Log:
- layout.tsx: import ThemeProvider dari next-themes; bungkus {children} + <Toaster/> dengan attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange (html suppressHydrationWarning tetap).
- NEW src/components/pusaka/theme-toggle.tsx: ThemeToggle (named export, tanpa props). Mounted-guard TANPA setState-in-effect: useSyncExternalStore(emptySubscribe, () => true, () => false); sebelum mounted render Button ghost h-10 w-10 disabled+aria-hidden+tabIndex -1 ikon Moon (placeholder ukuran sama, bebas hydration mismatch); setelah mounted: Sun saat dark / Moon saat light, aria-label dinamis "Aktifkan mode terang"/"Aktifkan mode gelap", onClick toggle resolvedTheme, transisi warna halus, focus-visible ring dari Button.
- globals.css: (1) :root + `color-scheme: light`; (2) blok .dark DIPOLISH jadi palet ber-identitas emerald hue 160–168 (bukan abu polos): background oklch(0.145 0.01 160) ≈ stone-950 kehijauan, card/popover oklch(0.185 0.012 162), primary emerald-500 terang oklch(0.696 0.17 162.48) + primary-foreground gelap, secondary/muted lebih terah bertingkat, muted-foreground oklch(0.72 0.02 165), accent AMBER oklch(0.828 0.189 84.429) + accent-foreground amber-950, border white/12% input white/15% ring emerald — LENGKAP semua var (background, foreground, card, card-foreground, popover, popover-foreground, muted, muted-foreground, primary, primary-foreground, secondary, secondary-foreground, accent, accent-foreground, destructive, border, input, ring, chart 1–5, sidebar*) + `color-scheme: dark`; (3) scrollbar gelap khusus .dark (::-webkit-scrollbar-thumb emerald 0.35/0.55 + scrollbar-color) di @layer base; keyframes marquee/shine-sweep/float-soft/pulse-amber + class animate-* TIDAK diubah. Tidak ada hue indigo/blue.
- Ditambahkan ThemeToggle ke navbar.tsx (satu-satunya perubahan fungsional non-warna): desktop di sisi kanan sebelum tombol Panel Admin, mobile di dalam Sheet (baris "Tampilan" di blok border-t). Navbar juga diaudit: border-stone-200→border-border, text-stone-900→text-foreground, link text-stone-600→text-muted-foreground + hover:bg-emerald-50→hover:bg-emerald-500/10 (dark:hover:text-emerald-300), badge outline emerald-200→emerald-600/30.
- AUDIT DARK MODE per komponen (HANYA warna, layout/DOM/spacing tidak berubah; prioritas token semantik; pola: bg-white→bg-card, bg-stone-50→bg-muted/40, text-stone-900→text-foreground, text-stone-500/600→text-muted-foreground, border-stone-200→border-border, bg-emerald-50 & hover→bg-emerald-500/10 (+dark:text-emerald-300 pada teks), bg-amber-50/100→bg-amber-500/10 atau /15, red box +dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-300, bg-stone-100→bg-muted, emerald-300/amber-400 untuk aksen di gelap):
  • quick-verify.tsx (~10 perubahan): kartu utama bg-card + border emerald/20, hint chip bg-muted, hasil VALID bg-emerald-500/10, box error/invalid dark red.
  • trust-marquee.tsx (~5): bg-muted + border-border, tepi pudar from-muted, ikon/teks muted.
  • programs.tsx (~20): section bg-card, TabsList bg-muted, kartu border-border hover:border-emerald-500/40, semua badge/box dialog (bg-muted/50, teks foreground/muted-foreground, Cakupan Internasional border-border/60).
  • process.tsx (~8): section bg-card, garis bg-border, ikon kotak bg-card, durasi bg-emerald-500/10.
  • directory.tsx (~15): section bg-muted/40, toolbar bg-card, list bg-card/60, baris bg-card, skor/status/empty-state.
  • experts.tsx (~16): section bg-card, chip filter bg-card/border-border, list bg-muted/40, item bg-card, dialog profil bg-muted/50.
  • stats-section.tsx (~10 + charts): section bg-muted/40, kartu border-border, counter/label token; CHARTS dibuat mode-agnostic: grid/tick/axis #a8a29e + strokeOpacity 0.35 (terbaca di light & dark), Bar fill #10b981 (emerald-500), Tooltip contentStyle inline style pakai var(--border)/var(--popover)/var(--popover-foreground) (var() valid di inline style), cursor rgba neutral, Pie stroke transparent.
  • application-form.tsx (~20): kedua section (sukses + form) bg-card, stepper bg-card/bg-border, radio card bg-emerald-500/10, box program bg-emerald-500/10, ringkasan bg-muted/50, agree box amber-500/10, kode pelacakan emerald-500/40 dashed.
  • track.tsx (~14): section bg-muted/40, kartu border-border, not-found bg-red-500/10, timeline border-border, node inactive bg-card, label/pill token.
  • news.tsx (~14): section bg-card, kartu border-border, fallback kategori bg-muted text-muted-foreground, group-hover dark:emerald-300, dialog konten muted-foreground.
  • faq.tsx (~5): section bg-muted/40, item bg-card border-border, trigger text-foreground hover emerald.
  • testimonials.tsx (~9): section bg-card, kartu border-border, watermark Quote text-emerald-500/15, bintang kosong muted-foreground/25, dot nav muted-foreground/30.
  • contact.tsx (~4): section bg-muted/40, kartu form border-border + teks token (CTA kiri memang dark gradient — tetap).
  • fade-in.tsx SectionHeading (~4): eyebrow emerald-600/30 + bg-emerald-500/10, h2 text-foreground, subtitle muted-foreground.
  • hero.tsx: TIDAK diubah — memang dark-identity (bg-emerald-950, teks putih/amber) dan tetap terbaca di kedua mode; MiniQr bg-white hanya chip QR di kartu gelap (disengaja).
  • global-network.tsx (~15, hanya Dialog detail node yang memakai warna terang): bg-emerald-50→bg-emerald-500/10, semua box bg-muted/50, teks token, badge scope emerald-500/10, tombol outline emerald-600/30. Section utama dark premium tidak disentuh.
- DILUAR JANGKAUAN (dilarang disentuh, PERLU perhatian agent lain untuk dark mode): footer.tsx & verify-section.tsx masih memakai bg-stone-50/bg-white/border-stone-200 (akan terlihat terang di dark mode); badge meta di src/lib/pusaka.ts (TYPE/TIER/STATUS/GLOBAL_STATUS_META, NEWS_CATEGORY_META) tetap chip terang (tetap terbaca di gelap, namun belum varian dark); certificate-card.tsx.
- NEW src/components/pusaka/saka-chat.tsx: SakaChat (named export, TANPA props — orchestrator tinggal import & render <SakaChat /> di page.tsx). Tombol trigger fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full gradient emerald-600→900 + shadow, ikon Bot↔X saat open, ring notifikasi amber (animate-pulse-amber, hilang setelah pertama kali dibuka), hover:scale-105, aria-label "Buka SAKA, asisten AI"/"Tutup SAKA" + aria-expanded. Panel fixed z-50 bottom-20 right-4 sm:right-5 w-[min(92vw,380px)] h-[min(68vh,540px)] rounded-2xl border-border bg-card shadow-2xl, framer-motion scale/opacity dari pojok kanan bawah (transformOrigin 100% 100%, duration 0.2), role="dialog" aria-label="SAKA Asisten AI". Header SELALU dark identity: gradient emerald-950→900, avatar "S" gradient emerald-500→amber-500, status dot hijau animate-pulse, tombol X (aria-label "Tutup SAKA"). Bubble asisten bg-muted rounded-tl-md, bubble user bg-emerald-700 text-white ml-auto rounded-br-md, whitespace-pre-wrap. Sambutan hardcoded (2 baris, 👋) + 4 quick chips (border rounded-full, hover:bg-emerald-500/10, klik = kirim, hanya tampil saat baru sambutan). Typing indicator 3 dot emerald-500 animate-bounce delay-100/delay-200 (+[animation-delay:…] agar stagger benar). Input row: Input shadcn rounded-full maxLength 500 aria-label + tombol Send h-10 w-10 rounded-full bg-emerald-700 disabled saat loading/kosong. Logika: POST /api/assistant {message, history: 8 pesan terakhir sebelum pesan user, tanpa sambutan}; response {ok,data:{reply}} / {ok:false,error}; !res.ok/throw → bubble "Mohon maaf, koneksi sedang terganggu. Coba lagi ya.". Auto-scroll imperatif via ref.scrollTo (TANPA setState di effect — bebas react-hooks/set-state-in-effect); Escape menutup panel (keydown listener saat open).
- QA: `bun run lint` 0 error 0 warning; `bunx tsc --noEmit` 0 error pada semua file yang disentuh (sisa error hanya examples/ & skills/ yang lama); dev server di-start ulang (sebelumnya MATI — tidak ada listener di port 3000, bukan hot-reload) → GET / 200, GET /api/stats 200; dev.log tanpa error kompilasi; CSS terverifikasi ter-compile: blok .dark berisi var emerald (#070b09/#00bb7f/#fcbb00 dst), utility dark:text-emerald-300, dark:group-hover:text-emerald-300, bg-emerald-500/10, animate-bounce, keyframes marquee/shine/float/pulse-amber utuh; script init next-themes ("class","theme","light",enableSystem=false) tampil di HTML; scan ulang semua file scope: 0 leftover bg-white/bg-stone-*/text-stone-900 (matches tersisa hanya yang disengaja: header SAKA dark-identity, chip aktif bg-white/20, red box + dark variant, CTA gelap contact).

Stage Summary:
- DARK MODE PUSAKA AKTIF penuh: ThemeProvider class-based (default light, tanpa system), palet .dark ber-identitas emerald + aksen amber (tanpa indigo/blue), scrollbar gelap, 16 komponen publik ter-audit + navbar memuat ThemeToggle. Semua section terbaca di light & dark; layout/DOM tidak berubah.
- API komponen untuk integrasi page.tsx: `import { SakaChat } from "@/components/pusaka/saka-chat"` → render `<SakaChat />` sekali (posisi bebas, mis. setelah <Footer/> sebelum <AdminLoginDialog/>; props: TIDAK ADA). `import { ThemeToggle } from "@/components/pusaka/theme-toggle"` — sudah terpasang di navbar.tsx (desktop + Sheet mobile); props: TIDAK ADA. SakaChat memanggil POST /api/assistant (kontrak Task 7-a) dan menampilkan pesan fallback sopan bila API gagal/belum ada — aman dipasang sekarang.
- Catatan lintas-file: footer.tsx, verify-section.tsx (dan badge meta di lib/pusaka.ts) belum dark — di luar ownership task ini.

---
Task ID: 8
Agent: Main Orchestrator (Z.ai)
Task: Integrasi final 7 fitur baru (Task 7/7-a/7-b/7-c) + verifikasi E2E Agent Browser.

Work Log:
- page.tsx: pasang <TopTicker /> sebelum <Navbar /> + <SakaChat /> setelah <Footer /> (hanya di branch situs publik, bukan mode CMS).
- Perbaikan UX deep-link: verify-section.tsx — scroll ulang ke #verifikasi setelah verify() selesai (konten async di atas menggeser posisi target; +300ms delay).
- E2E Agent Browser 1440px: TopTicker (badge Hijriah "6 Rabiulakhir 1448 H" + pengumuman berputar dari berita), SAKA chat (buka panel, kirim "Berapa biaya sertifikasi PPIU...?" → jawaban LLM DENGAN DATA DB NYATA: Rp 7.950.000 / 45 hari, bubble + chips + typing indicator benar), Dark Mode toggle (navbar + seluruh section gelap konsisten emerald; toggle kembali terang OK), deep-link ?cert=IAT-2025-0201 → auto-isi + auto-verifikasi + scroll tepat (top 80px), kartu sertifikat QR SUNGGUHAN (data:image/png) + tombol "Unduh Sertifikat" → toast "Sertifikat berhasil diunduh", newsletter footer (jamaah@example.com) → toast "Berhasil berlangganan!" + konfirmasi inline.
- E2E CMS: login admin → menu Newsletter (baru) → 3 pelanggan tampil (termasuk jamaah@example.com dari footer publik — alur end-to-end), badge count, Switch aktif/nonaktif, cari email.
- Mobile 390px: ticker, navbar hamburger, hero stack, tombol SAKA — semua rapi.
- Curl: POST /api/assistant → reply nyata fallback:false; POST /api/newsletter → subscribed:true; CEK-CMS@Pusaka.ID masuk CMS.
- Catatan perilaku: sesi admin aktif + buka situs publik → CMS dashboard tampil lagi (session resume by design; logout untuk kembali sebagai pengunjung).
- Final: lint 0 error, browser console bersih, dev.log bersih.

Stage Summary:
- PUSAKA kini punya 7 fitur baru LIVE: (1) SAKA AI Assistant 24/7 dengan pengetahuan DB live, (2) Dark Mode penuh emerald-malam, (3) Sertifikat digital unduh PNG + QR sungguhan (link ?cert=), (4) Deep-link verifikasi, (5) Ticker pengumuman + Kalender Hijriah otomatis, (6) Newsletter publik + CMS, (7) Rate-limit keamanan login CMS.
- Roadmap tersisa (tidak dikerjakan): multi-bahasa EN/AR, portal anggota lembaga, payment gateway.
