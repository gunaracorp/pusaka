// ============================================================
// PUSAKA — Katalog 500 Layanan Sertifikasi & Akreditasi Global
// 25 bidang × 10 basis × 2 skema (BADAN_USAHA + PROFESIONAL)
// Semua basis mengacu standar internasional/daerah nyata.
// Generator deterministik — hasil seed selalu identik.
// ============================================================

export interface BaseDef {
  /** Nama skema badan usaha / institusi */
  name: string;
  /** Referensi standar (ISO/IEC, Codex, dsb.) */
  standard: string;
  /** Nama skema profesional/individu — jika kosong digenerasi dari role bidang */
  per?: string;
  /** kind: ORG (default) basisnya skema organisasi; PERSON basisnya sertifikasi individu */
  kind?: "ORG" | "PERSON";
  /** true = lingkup nasional (regulasi RI) */
  national?: boolean;
}

export interface CategoryDef {
  slug: string;
  name: string;
  /** mitra penerbit: "PUSAKA × <partner>" */
  partner: string;
  /** peran profesional utk skema generatif, mis. "Lead Auditor" */
  role: string;
  /** [hargaPersonMin, hargaOrgMax] dalam IDR */
  band: [number, number];
  bases: BaseDef[];
}

export interface ServiceSeed {
  code: string;
  name: string;
  category: string;
  categorySlug: string;
  standard: string;
  description: string;
  price: number;
  durationWeeks: number;
  scheme: "BADAN_USAHA" | "PROFESIONAL";
  scope: "NASIONAL" | "INTERNASIONAL";
  issuer: string;
}

export const SERVICE_CATEGORIES: CategoryDef[] = [
  {
    slug: "manajemen-mutu",
    name: "Manajemen Mutu",
    partner: "JAS-ANZ (IAF MLA)",
    role: "Lead Auditor",
    band: [8_500_000, 28_000_000],
    bases: [
      { name: "Sertifikasi Sistem Manajemen Mutu ISO 9001:2015", standard: "ISO 9001:2015" },
      { name: "Sertifikasi Mutu Otomotif IATF 16949:2016", standard: "IATF 16949:2016" },
      { name: "Sertifikasi Mutu Organisasi Pendidikan ISO 21001:2018", standard: "ISO 21001:2018" },
      { name: "Sertifikasi Mutu Alat Kesehatan ISO 13485:2016", standard: "ISO 13485:2016" },
      { name: "Sertifikasi Penanganan Komplain Pelanggan ISO 10002:2018", standard: "ISO 10002:2018" },
      { name: "Sertifikasi Mutu Perkeretaapian ISO/TS 22163 (IRIS)", standard: "ISO/TS 22163:2017" },
      { name: "Sertifikasi Mutu Telekomunikasi TL 9000", standard: "TL 9000 R6.3" },
      { name: "Sertifikasi Mutu Jasa Penerjemahan ISO 17100:2015", standard: "ISO 17100:2015" },
      { name: "Sertifikasi Mutu Perangkat Lunak ISO/IEC 90003:2014", standard: "ISO/IEC 90003:2014" },
      { name: "Sertifikasi Excellence Organisasi (EFQM Model 2020)", standard: "EFQM Model 2020" },
    ],
  },
  {
    slug: "k3",
    name: "Keselamatan & Kesehatan Kerja (K3)",
    partner: "BNSP & Kemnaker RI",
    role: "Auditor SMK3",
    band: [4_500_000, 26_000_000],
    bases: [
      { name: "Sertifikasi Sistem Manajemen K3 ISO 45001:2018", standard: "ISO 45001:2018" },
      { name: "Audit Sistem Manajemen SMK3 PP No. 50 Tahun 2012", standard: "PP 50/2012 (Permenaker 26/2014)", national: true },
      { name: "Sertifikasi Keselamatan Jalan Raya ISO 39001:2012", standard: "ISO 39001:2012" },
      { name: "Sertifikasi Kesehatan Mental Kerja ISO 45003:2021", standard: "ISO 45003:2021" },
      { name: "Sertifikasi Manajemen Risiko ISO 31000:2018", standard: "ISO 31000:2018" },
      { name: "Sertifikasi Ahli K3 Umum (AK3U) Kemnaker RI", standard: "Permenaker 2/1992", kind: "PERSON", national: true },
      { name: "Sertifikasi Ahli K3 Konstruksi (AK3K)", standard: "Permen PUPR 10/2021", kind: "PERSON", national: true },
      { name: "Sertifikasi Pengawas Operasional K3 Muda (POK Muda)", standard: "Permenaker 8/2020", kind: "PERSON", national: true },
      { name: "Sertifikasi Petugas P3K Perusahaan", standard: "SKKNI P3K Kemnaker", kind: "PERSON", national: true },
      { name: "Sertifikasi Petugas Proteksi Kebakaran (Fire Warden)", standard: "NFPA 101 / Permen ATR/BPN 14/2021", kind: "PERSON" },
    ],
  },
  {
    slug: "lingkungan",
    name: "Lingkungan & Keberlanjutan",
    partner: "UKAS & ANSI (IAF MLA)",
    role: "Lead Verifier",
    band: [9_500_000, 32_000_000],
    bases: [
      { name: "Sertifikasi Sistem Manajemen Lingkungan ISO 14001:2015", standard: "ISO 14001:2015" },
      { name: "Sertifikasi Manajemen Energi ISO 50001:2018", standard: "ISO 50001:2018" },
      { name: "Verifikasi Inventarisasi Gas Rumah Kaca ISO 14064-1:2018", standard: "ISO 14064-1:2018" },
      { name: "Verifikasi Proyek Emisi GHG ISO 14064-2:2019", standard: "ISO 14064-2:2019" },
      { name: "Sertifikasi Jejak Karbon Produk ISO 14067:2018", standard: "ISO 14067:2018" },
      { name: "Sertifikasi Jejak Air ISO 14046:2014", standard: "ISO 14046:2014" },
      { name: "Sertifikasi Keberlanjutan Penyelenggaraan Event ISO 20121:2024", standard: "ISO 20121:2024" },
      { name: "Sertifikasi Due Diligence Lingkungan ISO 14015:2022", standard: "ISO 14015:2022" },
      { name: "Sertifikasi Ekonomi Sirkular ISO 59004/59010:2024", standard: "ISO 59004 & 59010:2024" },
      { name: "Sertifikasi Kompetensi Penyusun AMDAL", standard: "Permen LHK 1/2023", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "teknologi-informasi",
    name: "Teknologi Informasi & Keamanan Siber",
    partner: "PECB & BNSP (IAF MLA)",
    role: "Lead Implementer",
    band: [12_000_000, 38_000_000],
    bases: [
      { name: "Sertifikasi Sistem Manajemen Keamanan Informasi ISO/IEC 27001:2022", standard: "ISO/IEC 27001:2022" },
      { name: "Sertifikasi Manajemen Privasi ISO/IEC 27701:2019", standard: "ISO/IEC 27701:2019" },
      { name: "Sertifikasi Manajemen Layanan TI ISO/IEC 20000-1:2018", standard: "ISO/IEC 20000-1:2018" },
      { name: "Sertifikasi Kesiapsiagaan Bisnis ISO 22301:2019", standard: "ISO 22301:2019" },
      { name: "Sertifikasi Keamanan Cloud ISO/IEC 27017:2015", standard: "ISO/IEC 27017:2015" },
      { name: "Sertifikasi Perlindungan PII di Cloud ISO/IEC 27018:2019", standard: "ISO/IEC 27018:2019" },
      { name: "Sertifikasi Manajemen Kecerdasan Buatan ISO/IEC 42001:2023", standard: "ISO/IEC 42001:2023" },
      { name: "Sertifikasi Kesiapan SOC 2 Type II (AICPA TSC)", standard: "AICPA SOC 2 TSC 2017" },
      { name: "Sertifikasi Kepatuhan PCI DSS 4.0", standard: "PCI DSS v4.0" },
      { name: "Sertifikasi Tata Kelola TI ISO/IEC 38500:2024", standard: "ISO/IEC 38500:2024" },
    ],
  },
  {
    slug: "pangan-halal",
    name: "Pangan & Halal",
    partner: "BPJPH & FSSC Foundation",
    role: "Penyelia Halal",
    band: [7_500_000, 30_000_000],
    bases: [
      { name: "Sertifikasi Sistem Manajemen Keamanan Pangan ISO 22000:2018", standard: "ISO 22000:2018" },
      { name: "Sertifikasi FSSC 22000 v6 (GFSI)", standard: "FSSC 22000 v6" },
      { name: "Sertifikasi HACCP (Codex Alimentarius CAC/RCP-1)", standard: "Codex CAC/RCP-1 (2020)" },
      { name: "Sertifikasi GMP Pangan (Good Manufacturing Practices)", standard: "Codex CXC 1-1969" },
      { name: "Sertifikasi Sistem Jaminan Produk Halal HAS 23000", standard: "HAS 23000 (BPJPH)", national: true },
      { name: "Sertifikasi Halal Produk & Jasa (BPJPH/SIH)", standard: "UU 33/2014 & PP 39/2021", national: true },
      { name: "Sertifikasi BRCGS Food Safety v9", standard: "BRCGS Food Safety Issue 9" },
      { name: "Sertifikasi Program Prasyarat (PRP) ISO/TS 22002-1", standard: "ISO/TS 22002-1:2009" },
      { name: "Sertifikasi Ketertelusuran Pangan ISO 22005:2007", standard: "ISO 22005:2007" },
      { name: "Sertifikasi Pakan Aman GMP+ FSA", standard: "GMP+ FSA 2020" },
    ],
  },
  {
    slug: "kesehatan",
    name: "Kesehatan & Farmasi",
    partner: "KARS & JCI Partner",
    role: "Surveyor",
    band: [8_000_000, 45_000_000],
    bases: [
      { name: "Akreditasi Rumah Sakit (SNARS/KARS Edisi 1)", standard: "SNARS Edisi 1 (Kemenkes)", national: true },
      { name: "Akreditasi Internasional JCI (7th Edition)", standard: "JCI Hospital 7th Ed." },
      { name: "Sertifikasi Sistem Manajemen Organisasi Kesehatan ISO 7101:2023", standard: "ISO 7101:2023" },
      { name: "Akreditasi Klinik Utama (Kemenkes)", standard: "Permenkes 4/2019", national: true },
      { name: "Sertifikasi CPOB (Cara Pembuatan Obat yang Baik)", standard: "Permenkes 32/2023", national: true },
      { name: "Sertifikasi Distribusi Farmasi GDP (Good Distribution Practice)", standard: "WHO TRS 961 Annex 9" },
      { name: "Sertifikasi Manajemen Risiko Alat Medis ISO 14971:2019", standard: "ISO 14971:2019" },
      { name: "Akreditasi Puskesmas & Laboratorium Kesehatan", standard: "Permenkes 43/2019", national: true },
      { name: "Sertifikasi Apoteker Penanggung Jawab (APJ) Apotek", standard: "Permenkes 9/2017", kind: "PERSON", national: true },
      { name: "Sertifikasi Kompetensi Hygiene & Sanitasi Fasilitas Kesehatan", standard: "Permenkes 7/2019", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "pendidikan",
    name: "Pendidikan & Pelatihan",
    partner: "BAN-PT & BNSP",
    role: "Assessor Pendidikan",
    band: [6_000_000, 35_000_000],
    bases: [
      { name: "Akreditasi Program Studi (BAN-PT/LAM)", standard: "SNP BAN-PT 9-2022", national: true },
      { name: "Akreditasi Sekolah & Madrasah (BAN-S/M)", standard: "ISSP Edisi 2023", national: true },
      { name: "Sertifikasi Lembaga Pelatihan Berbadan Hukum (LPBH) BNSP", standard: "SK KAN-BNSP 0101", national: true },
      { name: "Sertifikasi Lembaga Sertifikasi Profesi (LSP) BNSP", standard: "SK KAN-BNSP 0102", national: true },
      { name: "Akreditasi Sekolah Internasional (CIS/NEASC)", standard: "CIS International Accreditation" },
      { name: "Sertifikasi Platform e-Learning ISO/IEC 40180:2017", standard: "ISO/IEC 40180:2017" },
      { name: "Sertifikasi Lembaga Kursus Bahasa Internasional", standard: "ISO 29991:2019" },
      { name: "Sertifikasi Kompetensi Guru & Dosen (SKKNI Pendidik)", standard: "KKNI Level 6-7 (BNSP)", kind: "PERSON", national: true },
      { name: "Sertifikasi Asesor Kompetensi (BNSP)", standard: "SKMGT 002 & SKAO 001", kind: "PERSON", national: true },
      { name: "Akreditasi PNF — TK/KB & PNF (BAN-PNF)", standard: "Standar Akreditasi BAN-PNF", national: true },
    ],
  },
  {
    slug: "pariwisata",
    name: "Pariwisata & Perjalanan",
    partner: "Kemenparekraf & WTTC Partner",
    role: "Assessor Pariwisata",
    band: [5_500_000, 28_000_000],
    bases: [
      { name: "Sertifikasi Safe Travels Stamp (WTTC)", standard: "WTTC Safe Travels Protocols" },
      { name: "Sertifikasi Destinasi Berkelanjutan GSTC", standard: "GSTC Destination Criteria v2.0" },
      { name: "Sertifikasi Green Destinations Standard", standard: "Green Destinations Standard v2" },
      { name: "Sertifikasi Kompetensi Tour Leader (BNSP)", standard: "SKKNI Tour Leader 2019", kind: "PERSON", national: true },
      { name: "Sertifikasi Kompetensi Pemandu Wisata (BNSP)", standard: "SKKNI Pemandu Wisata 2019", kind: "PERSON", national: true },
      { name: "Sertifikasi Profesional Pariwisata ASEAN (ATP — MRA)", standard: "ASEAN MRA on Tourism Professionals" },
      { name: "Sertifikasi Higiene & Sanitasi Perhotelan", standard: "Codex + Permenkes 1096/2011" },
      { name: "Sertifikasi Keberlanjutan Akomodasi EarthCheck", standard: "EarthCheck Company Standard" },
      { name: "Sertifikasi Kompetensi Event Organizer Profesional", standard: "SKKNI MICE 2021", kind: "PERSON", national: true },
      { name: "Sertifikasi Manajemen Venue & Konvensi Internasional", standard: "APEX/ASTM Venue Standards" },
    ],
  },
  {
    slug: "logistik",
    name: "Logistik & Rantai Pasok",
    partner: "FIATA & IATA CASS Partner",
    role: "Lead Auditor Logistik",
    band: [9_000_000, 34_000_000],
    bases: [
      { name: "Sertifikasi Keamanan Rantai Pasok ISO 28000:2022", standard: "ISO 28000:2022" },
      { name: "Penilaian Kesiapan C-TPAT (CBP USA)", standard: "CBP C-TPAT MSC 2021" },
      { name: "Sertifikasi AEO (Authorized Economic Operator) Bea Cukai", standard: "Perpres 48/2020", national: true },
      { name: "Akreditasi Cargo Agent IATA (CASS)", standard: "IATA Cargo Agency Conference Resolutions" },
      { name: "Sertifikasi Cold Chain Logistics (GCCA)", standard: "GCCA Cold Chain Guidelines" },
      { name: "Penilaian SQAS (Safety & Quality Assessment)", standard: "SQAS Core Assessment 2023" },
      { name: "Sertifikasi Manajemen Gudang Aman (OSHA Warehouse)", standard: "OSHA 1910 Subpart N" },
      { name: "Sertifikasi Kompetensi Freight Forwarder (FIATA Diploma)", standard: "FIATA Diploma Syllabus", kind: "PERSON" },
      { name: "Sertifikasi Dangerous Goods by Air — IATA DGR Cat. 6", standard: "IATA DGR 66th Ed.", kind: "PERSON" },
      { name: "Sertifikasi Kompetensi Logistician Profesional (CILT)", standard: "CILT Professional Standards", kind: "PERSON" },
    ],
  },
  {
    slug: "keuangan",
    name: "Keuangan, Perbankan & Syariah",
    partner: "OJK Partner & AAOIFI",
    role: "Lead Auditor Keuangan",
    band: [10_000_000, 36_000_000],
    bases: [
      { name: "Sertifikasi Manajemen Risiko Perbankan (Basel III)", standard: "BCBS Basel III & POJK 18/2021", national: true },
      { name: "Sertifikasi Kepatuhan AML/CFT (PPATK & FATF)", standard: "FATF 40 Recommendations" },
      { name: "Sertifikasi Implementasi IFRS 9 / PSAK 71", standard: "IFRS 9 (PSAK 71)" },
      { name: "Penilaian Kepatuhan Pembiayaan Syariah AAOIFI", standard: "AAOIFI Sharia Standards" },
      { name: "Sertifikasi Takaful & Asuransi Syariah (AAOIFI)", standard: "AAOIFI Takaful Standards" },
      { name: "Penilaian Tata Kelola & Manajemen Aset Investor (ISO 55001-based)", standard: "ISO 55001:2014" },
      { name: "Sertifikasi Kompetensi Wakil Manajer Investasi (WMWI/WPEI — OJK)", standard: "POJK 21/2018", kind: "PERSON", national: true },
      { name: "Sertifikasi Wakil Perantara Pedagang Efek (WPPE)", standard: "POJK 12/2021", kind: "PERSON", national: true },
      { name: "Sertifikasi Internal Auditor Bersertifikat (CIA-aligned)", standard: "IIA IPPF Standards", kind: "PERSON" },
      { name: "Sertifikasi Certified Fraud Examiner (CFE-aligned)", standard: "ACFE Body of Knowledge", kind: "PERSON" },
    ],
  },
  {
    slug: "laboratorium",
    name: "Laboratorium, Inspeksi & Sertifikasi",
    partner: "KAN & ILAC MRA",
    role: "Assessor Teknis",
    band: [9_500_000, 40_000_000],
    bases: [
      { name: "Akreditasi Laboratorium Pengujian/Kalibrasi ISO/IEC 17025:2017", standard: "ISO/IEC 17025:2017" },
      { name: "Akreditasi Badan Inspeksi ISO/IEC 17020:2012", standard: "ISO/IEC 17020:2012" },
      { name: "Akreditasi Bodi Sertifikasi Personel ISO/IEC 17024:2012", standard: "ISO/IEC 17024:2012" },
      { name: "Akreditasi Bodi Sertifikasi Produk ISO/IEC 17065:2012", standard: "ISO/IEC 17065:2012" },
      { name: "Akreditasi Bodi Sertifikasi Sistem Manajemen ISO/IEC 17021-1:2015", standard: "ISO/IEC 17021-1:2015" },
      { name: "Akreditasi Penyedia Proficiency Testing ISO/IEC 17043:2023", standard: "ISO/IEC 17043:2023" },
      { name: "Akreditasi Produsen Bahan Acuan ISO 17034:2016", standard: "ISO 17034:2016" },
      { name: "Sertifikasi Good Laboratory Practice (GLP — OECD)", standard: "OECD GLP Principles" },
      { name: "Penyiapan Mutual Recognition ILAC MRA", standard: "ILAC P10/P15 Procedures" },
      { name: "Sertifikasi Kompetensi Analis Laboratorium (SKKNI)", standard: "KKNI Level 5 (BNSP)", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "sdm",
    name: "SDM & Kompetensi Profesi",
    partner: "BNSP & SHRM Partner",
    role: "Assessor SDM",
    band: [5_000_000, 22_000_000],
    bases: [
      { name: "Sertifikasi Profesional SDM (CHRP — BNSP)", standard: "SKKNI SDM 2021", kind: "PERSON", national: true },
      { name: "Sertifikasi Kompetensi Instruktur & Fasilitator (BNSP)", standard: "SKKNI Instruktur 2019", kind: "PERSON", national: true },
      { name: "Sertifikasi Pelaporan SDM ISO 30414:2018", standard: "ISO 30414:2018" },
      { name: "Sertifikasi Manajemen Rekrutmen ISO 30405:2016", standard: "ISO 30405:2016" },
      { name: "Sertifikasi Layanan Penilaian & Asesmen ISO 10667", standard: "ISO 10667-1/-2:2020" },
      { name: "Sertifikasi Keanekaragaman & Inklusi ISO 30415:2021", standard: "ISO 30415:2021" },
      { name: "Sertifikasi Pembelajaran & Pengembangan ISO 30422:2023", standard: "ISO 30422:2023" },
      { name: "Sertifikasi People Analytics & HRIS Profesional", standard: "SKKNI Big Data + HRIS", kind: "PERSON", national: true },
      { name: "Sertifikasi Kompetensi HRBP Strategic Partner", standard: "SHRM BASK + KKNI", kind: "PERSON" },
      { name: "Sertifikasi Manajemen Gaji & Kesejahteraan (Compensation & Benefit)", standard: "SKKNI SDM 2021 — C&B", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "konstruksi",
    name: "Konstruksi & Infrastruktur",
    partner: "LPJK & GBCI Partner",
    role: "Auditor Konstruksi",
    band: [6_500_000, 38_000_000],
    bases: [
      { name: "Sertifikasi Badan Usaha Jasa Konstruksi (SBU LPJK)", standard: "PP 22/2020 & Permen PUPR 8/2023", national: true },
      { name: "Sertifikasi Manajemen Informasi Bangunan (BIM) ISO 19650", standard: "ISO 19650-1/-2:2018" },
      { name: "Audit SMKK Konstruksi (Permen PUPR 10/2021)", standard: "Permen PUPR 10/2021", national: true },
      { name: "Sertifikasi Green Building (EDGE/LEED)", standard: "IFC EDGE & LEED v4.1" },
      { name: "Sertifikasi Komunitas Berkelanjutan ISO 37101:2016", standard: "ISO 37101:2016" },
      { name: "Sertifikasi Kompetensi Manajer Proyek (PMP-aligned)", standard: "PMBOK 7th Ed.", kind: "PERSON" },
      { name: "Sertifikasi SKK/SKTTK Teknik Konstruksi", standard: "Permen PUPR 8/2023", kind: "PERSON", national: true },
      { name: "Sertifikasi Welding Inspector (CSWIP 3.1)", standard: "CSWIP 3.1 (TWI)", kind: "PERSON" },
      { name: "Sertifikasi Non-Destructive Testing Level II (ASNT)", standard: "ASNT SNT-TC-1A", kind: "PERSON" },
      { name: "Sertifikasi Pengadaan Barang & Jasa Pemerintah (BNSP)", standard: "SKKNI Pengadaan 2021", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "maritim",
    name: "Maritim & Perkapalan",
    partner: "IMO Partner & Biro Klasifikasi",
    role: "Lead Auditor Maritim",
    band: [10_000_000, 42_000_000],
    bases: [
      { name: "Sertifikasi ISM Code (DOC & SMC)", standard: "ISM Code (SOLAS Ch. IX)" },
      { name: "Sertifikasi ISPS Code (Keamanan Kapal & Pelabuhan)", standard: "ISPS Code (SOLAS Ch. XI-2)" },
      { name: "Sertifikasi Maritime Labour Convention MLC 2006", standard: "MLC 2006 (ILO)" },
      { name: "Sertifikasi MARPOL Compliance & Waste Management", standard: "MARPOL Annex I–VI" },
      { name: "Sertifikasi Crewing Agency (MLC Part 1)", standard: "MLC 2006 Reg. 1.4" },
      { name: "Sertifikasi Ship Security Officer (SSO) — STCW", standard: "STCW Reg. VI/5 (IMO MC 3.19)", kind: "PERSON" },
      { name: "Sertifikasi Port Facility Security Officer (PFSO)", standard: "ISPS Part B 16/17 (IMO MC 3.24)", kind: "PERSON" },
      { name: "Sertifikasi Kompetensi Nakhoda & KKM (STCW A-II)", standard: "STCW 2010 Manila A-II", kind: "PERSON" },
      { name: "Sertifikasi Mualim Mesin & Elektro-Teknikal (STCW A-III)", standard: "STCW 2010 Manila A-III", kind: "PERSON" },
      { name: "Sertifikasi Hull & Machinery Surveyor (Class Partner)", standard: "IACS UR & Class Rules", kind: "PERSON" },
    ],
  },
  {
    slug: "aviasi",
    name: "Aviasi & Dirgantara",
    partner: "IATA & ICAO Partner",
    role: "Inspector Aviasi",
    band: [12_000_000, 55_000_000],
    bases: [
      { name: "Audit IOSA (IATA Operational Safety Audit)", standard: "IOSA Standards Manual Ed. 16" },
      { name: "Audit ISAGO (Ground Operations Safety)", standard: "ISAGO GOSM Ed. 12" },
      { name: "Sertifikasi AMO (Approved Maintenance Organization)", standard: "CASR Part 145" },
      { name: "Sertifikasi Mutu Dirgantara AS9100D", standard: "AS9100D (SAE)" },
      { name: "Sertifikasi Flight Training Organization (ATO)", standard: "CASR Part 141" },
      { name: "Sertifikasi Ground Handling Agent Berstandar ISAGO", standard: "ISAGO GOSM + IGOM" },
      { name: "Sertifikasi Cabin Crew / Pramugara (CASR 121)", standard: "CASR Part 121 Subpart S", kind: "PERSON", national: true },
      { name: "Sertifikasi Flight Operations Officer (FOO)", standard: "ICAO Doc 7192 D-3", kind: "PERSON" },
      { name: "Sertifikasi Aircraft Dispatcher", standard: "CASR Part 65 Subpart C", kind: "PERSON", national: true },
      { name: "Sertifikasi Operator Drone / UAS Remote Pilot", standard: "CASR Part 107", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "pertanian",
    name: "Pertanian, Perkebunan & Perikanan",
    partner: "GlobalG.A.P. & Rainforest Alliance",
    role: "Lead Auditor Pertanian",
    band: [7_000_000, 32_000_000],
    bases: [
      { name: "Sertifikasi GLOBALG.A.P. IFA v6 (Crops)", standard: "GLOBALG.A.P. IFA v6 G.A.P." },
      { name: "Sertifikasi Organik (IFOAM/USDA/EU Equivalent)", standard: "IFOAM Standard & SNI 6729", national: true },
      { name: "Sertifikasi Rainforest Alliance Sustainable Agriculture", standard: "RA 2020 Farm Requirements" },
      { name: "Sertifikasi RSPO (Sawit Berkelanjutan)", standard: "RSPO P&C 2018" },
      { name: "Sertifikasi ISPO (Indonesian Sustainable Palm Oil)", standard: "Perpres 44/2020", national: true },
      { name: "Sertifikasi ISCC (Biofuel & Carbon)", standard: "ISCC EU 202-1" },
      { name: "Sertifikasi Akuakultur Berkelanjutan (ASC/BAP)", standard: "ASC Farm Standard 2022" },
      { name: "Sertifikasi Good Agricultural Practices (GAP Kementan)", standard: "Permentan 46/2021", national: true },
      { name: "Sertifikasi Fairtrade Standard (Hire & Small Prod.)", standard: "Fairtrade Hired Labour Standard" },
      { name: "Sertifikasi Kompetensi Penyuluh Pertanian (BNSP)", standard: "SKKNI Penyuluh 2020", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "manufaktur",
    name: "Manufaktur & Industri",
    partner: "SNI BSP & BNSP",
    role: "Lead Auditor Industri",
    band: [7_500_000, 30_000_000],
    bases: [
      { name: "Sertifikasi Tanda SNI (SPPT SNI)", standard: "SNI Terkait + Permenperin", national: true },
      { name: "Sertifikasi Hubungan Bisnis Kolaboratif ISO 44001:2017", standard: "ISO 44001:2017" },
      { name: "Penilaian Kesiapan Industri 4.0 (Smart Industry Readiness Index)", standard: "SIRI (INCIT) Framework" },
      { name: "Sertifikasi Keselamatan Produk Mainan ISO 8124", standard: "ISO 8124-1/-2/-3" },
      { name: "Sertifikasi Keamanan Produk Pemasok ISO 10377:2013", standard: "ISO 10377:2013" },
      { name: "Sertifikasi Kepatuhan RoHS & REACH", standard: "EU 2011/65 + EC 1907/2006" },
      { name: "Sertifikasi 5S & Total Productive Maintenance (TPM)", standard: "JIPM TPM Award Criteria" },
      { name: "Sertifikasi Lean Six Sigma Black Belt", standard: "ASQ CSSBB BoK", kind: "PERSON" },
      { name: "Sertifikasi Lean Six Sigma Green Belt", standard: "ASQ CSSGB BoK", kind: "PERSON" },
      { name: "Sertifikasi Kompetensi QA/QC Engineer (SKKNI)", standard: "SKKNI QA/QC 2020", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "energi",
    name: "Energi & Pertambangan",
    partner: "KESDM Partner & IECEx",
    role: "Lead Auditor Energi",
    band: [9_000_000, 45_000_000],
    bases: [
      { name: "Sertifikasi Good Mining Practice Minerba", standard: "Kepmen ESDM 1827K/2018", national: true },
      { name: "Audit Keselamatan Pertambangan (Kepmen 555K/1995)", standard: "Kepmen ESDM 555K/1995", national: true },
      { name: "Sertifikasi Peralatan Atmosfer Ledak IECEx", standard: "IECEx OD 005/015" },
      { name: "Sertifikasi Mutu Rantai Pasok Nuklir ISO 19443:2018", standard: "ISO 19443:2018" },
      { name: "Sertifikasi Integritas Pipa (ASME B31.4/B31.8)", standard: "ASME B31.4 & B31.8" },
      { name: "Sertifikasi Manajemen Aset ISO 55001:2014", standard: "ISO 55001:2014" },
      { name: "Sertifikasi Pengawas Operasional Pertama/Muda/Utama Tambang", standard: "Kepmen 555K (POP/POM/POU)", kind: "PERSON", national: true },
      { name: "Sertifikasi Certified Energy Manager (AEE)", standard: "AEE CEM BoK", kind: "PERSON" },
      { name: "Sertifikasi GWO Basic Safety Training (Energi Angin)", standard: "GWO BST Standard v2", kind: "PERSON" },
      { name: "Sertifikasi Solar PV Installer (IEC TS 62738)", standard: "IEC TS 62738:2018", kind: "PERSON" },
    ],
  },
  {
    slug: "ritel",
    name: "Ritel & Distribusi",
    partner: "BRCGS & GS1 Partner",
    role: "Lead Auditor Ritel",
    band: [6_500_000, 28_000_000],
    bases: [
      { name: "Sertifikasi BRCGS Packaging Materials v6", standard: "BRCGS Packaging Issue 6" },
      { name: "Sertifikasi BRCGS Storage & Distribution v4", standard: "BRCGS S&D Issue 4" },
      { name: "Sertifikasi HAS Ritel (Sistem Jaminan Halal Ritel)", standard: "HAS 23000 Ritel (BPJPH)", national: true },
      { name: "Sertifikasi Food Defense & Food Fraud (TACCP/VACCP)", standard: "BRCGS DD Module + GFSI" },
      { name: "Sertifikasi Kepatuhan GS1 Barcoding & Traceability", standard: "GS1 General Specifications" },
      { name: "Sertifikasi Manajemen Pengalaman Pelanggan ISO 23592:2021", standard: "ISO 23592:2021" },
      { name: "Sertifikasi Perlindungan Konsumen E-Commerce", standard: "PP 71/2019 & SNI E-Commerce", national: true },
      { name: "Sertifikasi Lartas Import Distributor (Kemendag)", standard: "Permendag 36/2023", national: true },
      { name: "Sertifikasi Kompetensi Store Manager Retail", standard: "SKKNI Ritel 2020", kind: "PERSON", national: true },
      { name: "Sertifikasi Keunggulan Waralaba (EFF-aligned)", standard: "EFF Franchise Standard" },
    ],
  },
  {
    slug: "properti",
    name: "Properti & Fasilitas",
    partner: "IFMA & BREEAM Partner",
    role: "Lead Auditor Fasilitas",
    band: [6_000_000, 34_000_000],
    bases: [
      { name: "Sertifikasi Manajemen Fasilitas ISO 41001:2018", standard: "ISO 41001:2018" },
      { name: "Sertifikasi LEED O+M (Operations & Maintenance)", standard: "LEED v4.1 O+M (GBCI)" },
      { name: "Sertifikasi BREEAM In-Use", standard: "BREEAM In-Use International" },
      { name: "Sertifikasi Green Mark (BCA Singapore)", standard: "BCA Green Mark 2021" },
      { name: "Sertifikasi Fire & Life Safety Bangunan (NFPA-aligned)", standard: "NFPA 101 & 72" },
      { name: "Sertifikasi Manajemen Parkir Modern", standard: "IPMA Best Practice Framework" },
      { name: "Sertifikasi Kompetensi Building Commissioning (BCx)", standard: "ASHRAE Guideline 0-2019", kind: "PERSON" },
      { name: "Sertifikasi Gada Pratama Satuan Pengamanan (BNSP)", standard: "SKKNI Satpam 2019", kind: "PERSON", national: true },
      { name: "Sertifikasi Cleaning Management (ISSA CITS)", standard: "ISSA CITS Cleaning Standard" },
      { name: "Sertifikasi WELL Accredited Professional (Wellness)", standard: "WELL v2 (IWBI)", kind: "PERSON" },
    ],
  },
  {
    slug: "transportasi",
    name: "Transportasi Darat",
    partner: "Kemenhub & IRU Academy",
    role: "Auditor Transportasi",
    band: [5_500_000, 26_000_000],
    bases: [
      { name: "Sertifikasi SQ Marking Angkutan Barang (Kemenhub)", standard: "SQ Marking Criteria 2023", national: true },
      { name: "Sertifikasi Terminal Penumpang Layak & Aman", standard: "Permenhub PM 48/2018", national: true },
      { name: "Sertifikasi Fleet Management & Telematika ISO 15638", standard: "ISO 15638 series" },
      { name: "Sertifikasi Sistem Transportasi Cerdas (ITS)", standard: "ISO 14813-1:2022" },
      { name: "Sertifikasi Spesifikasi Bus Pariwisata Berkualitas", standard: "Bus Spec Kemenparekraf 2023", national: true },
      { name: "Sertifikasi Kompetensi Driver Profesional A/B Umum", standard: "SKKNI Driver 2021", kind: "PERSON", national: true },
      { name: "Sertifikasi Certificate of Professional Competence (IRU CPC)", standard: "IRU Academy CPC Syllabus", kind: "PERSON" },
      { name: "Sertifikasi Dangerous Goods by Road (ADR)", standard: "ADR 2023 UN Model Regs", kind: "PERSON" },
      { name: "Sertifikasi Operator Derek & Towing Profesional", standard: "SKKNI Unit Towing (BNSP)", kind: "PERSON", national: true },
      { name: "Sertifikasi Layanan Taksi & Kendaraan Online", standard: "Permenhub PM 12/2019", national: true },
    ],
  },
  {
    slug: "kreatif-digital",
    name: "Media, Kreatif & Digital",
    partner: "BNSP & Kominfo Partner",
    role: "Assessor Digital",
    band: [4_500_000, 24_000_000],
    bases: [
      { name: "Sertifikasi Kualitas Produk Perangkat Lunak ISO/IEC 25010", standard: "ISO/IEC 25010:2011" },
      { name: "Penilaian Kematangan Proses Software CMMI-DEV", standard: "CMMI-DEV v3.0 (ISACA)" },
      { name: "Sertifikasi Pengembangan Software VSE ISO/IEC 29110", standard: "ISO/IEC 29110-5-1-2" },
      { name: "Sertifikasi Standar Agensi Digital Profesional", standard: "PUSAKA DAS Framework v1" },
      { name: "Verifikasi Media Siber (Dewan Pers)", standard: "Standar Media Siber Dewan Pers", national: true },
      { name: "Sertifikasi Digital Marketing Profesional", standard: "SKKNI Digital Marketing 2022", kind: "PERSON", national: true },
      { name: "Sertifikasi Kompetensi Data Scientist (SKKNI Big Data)", standard: "SKKNI Big Data 2020", kind: "PERSON", national: true },
      { name: "Sertifikasi Profesional Keamanan Siber (Cybersecurity Practitioner)", standard: "SKKNI Keamanan Siber 2021", kind: "PERSON", national: true },
      { name: "Sertifikasi UI/UX Designer Profesional", standard: "SKKNI UI/UX 2022", kind: "PERSON", national: true },
      { name: "Sertifikasi Content Creator & Influencer Profesional", standard: "SKKNI Ekonomi Kreatif 2023", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "esg",
    name: "ESG & Tata Kelola",
    partner: "GRI & UN Global Compact Partner",
    role: "Lead Verifier ESG",
    band: [9_000_000, 38_000_000],
    bases: [
      { name: "Penilaian Tanggung Jawab Sosial ISO 26000:2010", standard: "ISO 26000:2010" },
      { name: "Penyiapan Laporan Keberlanjutan GRI Standards", standard: "GRI Universal Standards 2021" },
      { name: "Sertifikasi Social Accountability SA8000:2014", standard: "SA8000:2014 (SAI)" },
      { name: "Sertifikasi Sistem Manajemen Anti-Suap ISO 37001", standard: "ISO 37001:2025" },
      { name: "Sertifikasi Sistem Manajemen Kepatuhan ISO 37301:2021", standard: "ISO 37301:2021" },
      { name: "Sertifikasi Sistem Manajemen Pelaporan Pelanggaran ISO 37002:2021", standard: "ISO 37002:2021" },
      { name: "Assurance Laporan Keberlanjutan ISAE 3000 (POJK 51)", standard: "ISAE 3000 (Revised)", national: true },
      { name: "Penilaian Kesiapan ESG Rating (MSCI/Sustainalytics-aligned)", standard: "MSCI ESG Methodology" },
      { name: "Sertifikasi ASEAN Corporate Governance Scorecard", standard: "ACGS 2023 (ACGA)" },
      { name: "Sertifikasi Kompetensi Sustainability Officer (BNSP)", standard: "SKKNI Keberlanjutan 2023", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "hukum-kepatuhan",
    name: "Hukum & Kepatuhan",
    partner: "PERADI & BANI Partner",
    role: "Assessor Kepatuhan",
    band: [6_000_000, 26_000_000],
    bases: [
      { name: "Penilaian Tata Kelola Perusahaan GCG (ASEAN CG Scorecard)", standard: "ASEAN CG Scorecard + OECD Principles" },
      { name: "Sertifikasi Manajemen Kekayaan Intelektual (WIPO-aligned)", standard: "WIPO IP Management Guide" },
      { name: "Sertifikasi Manajemen Kontrak FIDIC", standard: "FIDIC Red/Yellow Book 2017" },
      { name: "Sertifikasi Profesi Advokat (PERADI)", standard: "UU 18/2003 & PERADI", kind: "PERSON", national: true },
      { name: "Sertifikasi Pejabat Pembuat Akta Tanah (PPAT)", standard: "PP 37/1998 & Permen ATR 1/2017", kind: "PERSON", national: true },
      { name: "Sertifikasi Data Protection Officer (UU PDP)", standard: "UU 27/2022 (PDP)", kind: "PERSON", national: true },
      { name: "Sertifikasi Mediator & Arbitrer Komersial (BANI/MAPPI)", standard: "UU 30/1999", kind: "PERSON", national: true },
      { name: "Sertifikasi AML/CFT Specialist (CAMS-aligned)", standard: "ACAMS CAMS 6th Ed.", kind: "PERSON" },
      { name: "Sertifikasi Compliance Officer Perbankan (LSPK)", standard: "POJK & LSPK Syllabus", kind: "PERSON", national: true },
      { name: "Sertifikasi Kompetensi Legal Officer Korporasi", standard: "SKKNI Legal 2022", kind: "PERSON", national: true },
    ],
  },
  {
    slug: "ibadah",
    name: "Ibadah: Umrah, Haji & Halal Tourism",
    partner: "Kemenag & BPJPH Partner",
    role: "Assessor Ibadah",
    band: [5_000_000, 30_000_000],
    bases: [
      { name: "Sertifikasi Muthawif (Pemandu Ibadah Umrah)", standard: "KMA 569/2020", kind: "PERSON", national: true },
      { name: "Sertifikasi Pembina Ibadah Haji Khusus", standard: "KMA 569/2020 (Haji)", kind: "PERSON", national: true },
      { name: "Sertifikasi Tour Operator Halal Tourism (Crescent-aligned)", standard: "Crescent Rating HFT Standard" },
      { name: "Sertifikasi Aplikasi & Platform Layanan Ibadah Digital", standard: "PUSAKA Digital Umrah Framework" },
      { name: "Sertifikasi Klinik & Layanan Kesehatan Jemaah", standard: "SNARS + Kemenag Regs", national: true },
      { name: "Sertifikasi Manajemen Darurat Jemaah (Hajj Emergency Response)", standard: "PUSAKA HER Protocol v2" },
      { name: "Akreditasi Hotel Makkah & Madinah Partner", standard: "Halal-Friendly Hospitality Standard" },
      { name: "Sertifikasi Katering Jemaah (ISO 22000 + HAS)", standard: "ISO 22000 + HAS 23000" },
      { name: "Sertifikasi Pengolahan & Distribusi Air Zamzam", standard: "PUSAKA Zamzam Handling Standard" },
      { name: "Sertifikasi Transportasi & Rute Jemaah (Makkah Route)", standard: "PUSAKA Pilgrim Mobility Standard" },
    ],
  },
];

/** Hash string deterministik sederhana (FNV-1a) */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function shortStandard(standard: string): string {
  return standard.split(" (")[0];
}

function buildDescription(opts: {
  name: string;
  category: string;
  standard: string;
  scheme: "BADAN_USAHA" | "PROFESIONAL";
  scope: "NASIONAL" | "INTERNASIONAL";
  weeks: number;
  variant: number;
}): string {
  const { name, category, standard, scheme, scope, weeks, variant } = opts;
  const scopeText =
    scope === "INTERNASIONAL"
      ? "diakui lintas negara melalui jaringan IAF MLA & ILAC MRA"
      : "memenuhi regulasi nasional Republik Indonesia";
  if (scheme === "BADAN_USAHA") {
    const tpl = [
      `Skema akreditasi ${name} untuk organisasi di bidang ${category}. Meliputi gap assessment, audit tahap 1 & 2 selama ±${weeks} minggu oleh asesor terakreditasi, surveilans tahunan, dan recertifikasi 3 tahun. Berlandaskan ${standard} serta ${scopeText}.`,
      `${name} menilai kepatuhan organisasi ${category} terhadap ${standard}. Proses ±${weeks} minggu: tinjauan dokumen, audit lapangan, tindakan korektif, hingga penerbitan sertifikat berlaku 3 tahun dengan surveilans tahunan — ${scopeText}.`,
      `Layanan sertifikasi ${category} berbasis ${standard} bagi entitas usaha. Termasuk pre-audit, audit sertifikasi ±${weeks} minggu oleh tim asesor senior PUSAKA, dan pemantauan berkelanjutan. Sertifikat ${scopeText}.`,
    ];
    return tpl[variant % tpl.length];
  }
  const tpl = [
    `Skema sertifikasi kompetensi individu di bidang ${category}. Mencakup ujian pengetahuan, praktik, dan portofolio sesuai ${standard} (±${weeks} minggu). Pemegang sertifikat terdaftar di database nasional PUSAKA dan ${scopeText}.`,
    `Sertifikasi profesi ${name} — memvalidasi kompetensi personel ${category} berdasarkan ${standard} melalui asesmen mandiri, ujian tertulis, dan wawancara asesor (±${weeks} minggu). Kartu kompetensi digital QR-verified, ${scopeText}.`,
  ];
  return tpl[variant % tpl.length];
}

/**
 * Bangun katalog lengkap 500 layanan.
 * 25 kategori × 10 basis × 2 skema = 500 (deterministik).
 */
export function buildServiceCatalog(): ServiceSeed[] {
  const out: ServiceSeed[] = [];
  let n = 0;
  for (const cat of SERVICE_CATEGORIES) {
    const issuer = `PUSAKA × ${cat.partner}`;
    for (const base of cat.bases) {
      const h = hashStr(`${cat.slug}:${base.name}`);
      const national = base.national === true;
      const scope: "NASIONAL" | "INTERNASIONAL" = national ? "NASIONAL" : "INTERNASIONAL";
      const [personMin, orgMax] = cat.band;

      // ---- Skema 1: basis (organisasi / individu sesuai kind) ----
      n++;
      if (base.kind === "PERSON") {
        out.push({
          code: `SVC-${String(n).padStart(4, "0")}`,
          name: base.name,
          category: cat.name,
          categorySlug: cat.slug,
          standard: base.standard,
          description: buildDescription({
            name: base.name,
            category: cat.name,
            standard: base.standard,
            scheme: "PROFESIONAL",
            scope,
            weeks: 2 + (h % 3),
            variant: h,
          }),
          price: personMin + (h % 6) * 500_000,
          durationWeeks: 2 + (h % 3),
          scheme: "PROFESIONAL",
          scope,
          issuer,
        });
        // Skema 2: lembaga penyelenggara
        n++;
        const orgName = `Akreditasi Lembaga Penyelenggara ${base.name.replace(/^Sertifikasi /, "").replace(/^Audit /, "")}`;
        out.push({
          code: `SVC-${String(n).padStart(4, "0")}`,
          name: orgName,
          category: cat.name,
          categorySlug: cat.slug,
          standard: base.standard,
          description: buildDescription({
            name: orgName,
            category: cat.name,
            standard: base.standard,
            scheme: "BADAN_USAHA",
            scope,
            weeks: 6 + (h % 8),
            variant: h + 1,
          }),
          price: orgMax - (h % 8) * 500_000,
          durationWeeks: 6 + (h % 8),
          scheme: "BADAN_USAHA",
          scope,
          issuer,
        });
      } else {
        out.push({
          code: `SVC-${String(n).padStart(4, "0")}`,
          name: base.name,
          category: cat.name,
          categorySlug: cat.slug,
          standard: base.standard,
          description: buildDescription({
            name: base.name,
            category: cat.name,
            standard: base.standard,
            scheme: "BADAN_USAHA",
            scope,
            weeks: 6 + (h % 9),
            variant: h,
          }),
          price: orgMax - (h % 10) * 500_000,
          durationWeeks: 6 + (h % 9),
          scheme: "BADAN_USAHA",
          scope,
          issuer,
        });
        // Skema 2: profesional
        n++;
        const perName =
          base.per ?? `Sertifikasi Kompetensi ${cat.role} — ${shortStandard(base.standard)}`;
        out.push({
          code: `SVC-${String(n).padStart(4, "0")}`,
          name: perName,
          category: cat.name,
          categorySlug: cat.slug,
          standard: base.standard,
          description: buildDescription({
            name: perName,
            category: cat.name,
            standard: base.standard,
            scheme: "PROFESIONAL",
            scope,
            weeks: 1 + (h % 3),
            variant: h + 1,
          }),
          price: personMin + (h % 7) * 500_000,
          durationWeeks: 1 + (h % 3),
          scheme: "PROFESIONAL",
          scope,
          issuer,
        });
      }
    }
  }
  return out;
}
