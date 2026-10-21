# PUSAKA — Versioning Standard (Standar Kontrol Versi)

> **Versi dokumen:** 1.0.0 · **Berlaku sejak:** PUSAKA v6.0.0 "Sentinel" · **Status:** NORMATIVE (mengikat)
>
> Sistem ini memenuhi **Semantic Versioning 2.0.0** (<https://semver.org>) dan mengadopsi prinsip
> **Keep a Changelog 1.1.0** (<https://keepachangelog.com>), diperluas dengan protokol worklog
> PUSAKA. Ini adalah standar resmi untuk **seluruh proyek PUSAKA** dan seluruh ekosistem situs
> (gunara.web.id · pusatperizinan.com · gohajj.web.id).

---

## 1. Prinsip (Principles)

1. **Setiap perubahan harus jelas** — tidak ada perubahan tanpa jejak versi, changelog, dan worklog.
2. **Append-only** — riwayat tidak pernah ditulis ulang; kesalahan diperbaiki dengan rilis *patch* baru.
3. **Satu sumber kebenaran** — `src/lib/version.ts` adalah registri kanonik; artefak lain (`VERSION`,
   `CHANGELOG.md`, API, lencana UI) harus sinkron dengannya.
4. **Ketertelusuran penuh** — setiap rilis memetakan Task ID worklog yang menyusunnya.
5. **Mesin & manusia sama-sama dilayani** — data versi tersedia sebagai JSON (`/api/version`)
   dan sebagai antarmuka (dialog Riwayat Versi di footer).

## 2. Format Nomor Versi (SemVer 2.0.0)

```
MAJOR.MINOR.PATCH          → contoh: 9.1.2
[-prerelease] [+build]     → opsional, contoh: 7.0.0-beta.1+20260913
```

Dekode contoh **v9.1.2**:

| Komponen | Nilai | Arti |
| --- | --- | --- |
| MAJOR | `9` | Lompatan generasi ke-9 — subsistem baru yang mengubah cara kerja, atau perubahan yang memecah kompatibilitas |
| MINOR | `1` | Generasi fitur ke-1 dalam generasi besar ini — fitur baru yang kompatibel |
| PATCH | `2` | Perbaikan ke-2 dalam generasi fitur ini — bugfix & penyempurnaan, tanpa fitur baru |

**Kaidah kenaikan (bump rules):**

| Jenis | Kapan | Contoh PUSAKA |
| --- | --- | --- |
| **MAJOR** (X.0.0) | Subsistem/arsitektur baru yang mengubah kapabilitas platform; perubahan kontrak API yang memecah konsumen lama; penggantian skema data non-kompatibel | v2.0.0 CMS, v3.0.0 SAKA AI + Dark Mode, v4.0.0 i18n, v5.0.0 Katalog 500 Layanan |
| **MINOR** (x.Y.0) | Fitur baru yang kompatibel; penambahan endpoint; penambahan kolom opsional | v4.1.0 Portal Anggota, v4.2.0 Payment Gateway, v5.1.0 Branding |
| **PATCH** (x.y.Z) | Perbaikan bug, penyempurnaan kecil, keamanan minor — tanpa fitur baru | v1.2.1 Kronos, v2.1.1 Prism, v5.1.1 Concord |

**Pre-release:** `6.1.0-beta.1`, `6.1.0-beta.2` → dirilis stabil sebagai `6.1.0`.
Pre-release selalu *lebih rendah* dari rilis stabil yang sama (SemVer §11).
**Saluran (channel):** `stable` (default) · `beta` · `alpha`.

## 3. Kategori Perubahan (Keep a Changelog)

Setiap rilis mengelompokkan perubahan ke kategori berikut:

| Kategori | Marker worklog | Arti |
| --- | --- | --- |
| **Added** (Ditambahkan) | `[+]` | Fitur/fungsi baru |
| **Changed** (Diubah) | `[~]` | Perubahan pada fungsi yang sudah ada |
| **Deprecated** | `[d]` | Fitur yang akan dihapus di rilis mendatang |
| **Removed** (Dihapus) | `[-]` | Fitur yang dihapus rilis ini |
| **Fixed** (Diperbaiki) | `[!]` | Perbaikan bug |
| **Security** (Keamanan) | `[$]` | Perbaikan/pengetatan keamanan |

## 4. Artefak Registri Versi (Version Registry)

| Artefak | Lokasi | Peran |
| --- | --- | --- |
| **Registri kanonik** | `src/lib/version.ts` | Objek `CHANGELOG` (18+ rilis), identitas `OS_VERSION`, util `parseSemVer/compareSemVer/bumpSemVer` |
| **Penanda cepat** | `VERSION` (akar repo) | Satu baris: nomor versi berjalan |
| **Catatan manusia** | `CHANGELOG.md` (akar repo) | Mirror terformat dari registri — dibaca manusia & reviewer |
| **API mesin** | `GET /api/version` | JSON `{ ok, data }`: identitas + changelog + filter `?type=&limit=&q=` |
| **Antarmuka** | `<VersionBadge />` di footer | Lencana versi + dialog Riwayat Versi interaktif (i18n ID/EN/AR) |
| **Riwayat kerja** | `worklog.md` | Log operasional per Task ID (protokol §5) |

## 5. Protokol Worklog v2 (Terstruktur per Versi)

Setiap entri baru di `worklog.md` (selalu **ditambahkan di akhir file**) wajib memakai templat:

```markdown
---
Task ID: <id>              # urut global, mis. 12, 13-a, 13-b
Agent: <nama agent>
Rilis: PUSAKA v<X.Y.Z>  # versi yang disasar task ini (WAJIB)
Task: <deskripsi tugas>

Work Log:
- [+] <fitur baru>          # Added
- [~] <yang diubah>         # Changed
- [-] <yang dihapus>        # Removed
- [!] <bug yang diperbaiki> # Fixed
- [$] <pengetatan keamanan> # Security

Stage Summary:
- <hasil kunci / keputusan / artefak>
- Bump: <patch|minor|major> — alasan singkat
```

**Aturan:** satu Task boleh menyentuh satu rilis; bila satu Task memuat fitur besar + perbaikan,
catat semuanya pada rilis yang sama dengan marker yang berbeda. Bump MAJOR/MINOR/PATCH ditentukan
menurut §2.

## 6. Alur Rilis (Release Workflow — checklist wajib)

1. **Kode** — implementasikan perubahan (patuhi kontrak API & desain).
2. **Kualitas** — `bun run lint` harus 0 error; bila skema berubah: `bun run db:push` + re-seed.
3. **Verifikasi** — E2E Agent Browser pada alur utama + cek `dev.log` tanpa 500/404.
4. **Naikkan versi** — tentukan bump (§2); tulis nomor baru di **tiga tempat sinkron**:
   `VERSION` → `OS_VERSION` di `src/lib/version.ts` → entri teratas `CHANGELOG` + `CHANGELOG.md`.
5. **Catat** — tambah entri `ChangelogEntry` baru (date, type, codename, title, summary, tasks,
   added/changed/removed/fixed/security) di urutan **teratas** array `CHANGELOG`.
6. **Worklog** — append entri Task ber-protokol v2 (§5) ke `worklog.md`.
7. **Uji API** — `curl /api/version` menampilkan versi & entri baru.
8. **Lapor** — ringkas rilis ke pengguna: apa yang ditambahkan/dikurangi/disempurnakan.

## 7. Tata Kelola (Governance)

- **Release engineer:** Z.ai (agent orchestrator) — mengeksekusi alur §6 tanpa kecuali.
- **Pemilik produk:** Gugun Gunara — menyetujui arah MAJOR (generasi) dan nama kode rilis.
- **Nama kode (codename):** satu kata, tema identitas generasi (Genesis, Meridian, Panorama,
  Kronos, Citadel, Atlas, Prism, Oracle, Spectra, Beacon, Polyglot, Keyholder, Vault, Anchor,
  Pustaka, Polymath, Concord, Sentinel, Lingua, Lighthouse, …).
- **Bahasa kanonik catatan rilis:** Bahasa Indonesia; label antarmuka diterjemahkan (ID/EN/AR)
  via namespace i18n `versionControl`.
- **Dilarang:** menghapus/menulis ulang entri changelog; melompati nomor versi; dua MAJOR dalam
  satu rilis; merilis tanpa E2E.

## 8. Mengonsumsi Data Versi (API)

```bash
curl /api/version                  # identitas + seluruh changelog + proyeksi versi berikutnya
curl "/api/version?type=minor"     # hanya rilis MINOR
curl "/api/version?limit=3"        # 3 rilis teratas
curl "/api/version?q=payment"      # pencarian teks di seluruh entri
```

Respons selalu mematuhi kontrak umum platform: `{ "ok": true, "data": … }` / `{ "ok": false, "error": … }`.

---

*Dokumen ini bagian dari PUSAKA — dikelola oleh Gugun Gunara (Master Polymath · Sage Universal ·
The Ultimate Problem Solver). Sejak v6.0.0, setiap perubahan pada proyek ini tercatat, terlacak,
dan dapat diaudit.*
