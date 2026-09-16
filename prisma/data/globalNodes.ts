// ============================================================
// PUSAKA — Data Jaringan Global (Layanan dari Semua Negara)
// Sumber data tunggal: dipakai prisma/seed.ts untuk seeding
// dan sebagai referensi kontrak field GlobalNode.
//
// kind   : KANTOR_PERWAKILAN | MITRA_INTERNASIONAL
// region : TIMUR_TENGAH | ASIA_TENGGARA | ASIA_SELATAN | ASIA_TIMUR
//          | EROPA | AFRIKA | AMERIKA | OSEANIA
// status : AKTIF | MOU | APLIKASI
// scope  : array kode program (PIHK, PPIU, BPW, IATA, IJIN-UMRAH, IJIN-HAJI, BPW-PRO)
// ============================================================

export interface GlobalNodeSeed {
  kind: "KANTOR_PERWAKILAN" | "MITRA_INTERNASIONAL";
  country: string;
  countryCode: string;
  region:
    | "TIMUR_TENGAH"
    | "ASIA_TENGGARA"
    | "ASIA_SELATAN"
    | "ASIA_TIMUR"
    | "EROPA"
    | "AFRIKA"
    | "AMERIKA"
    | "OSEANIA";
  city: string;
  flag: string;
  title: string;
  orgName: string;
  description: string;
  scope: string[];
  status: "AKTIF" | "MOU" | "APLIKASI";
  since: string;
  contact: string | null;
  order: number;
}

export const GLOBAL_REGION_LABEL: Record<string, string> = {
  TIMUR_TENGAH: "Timur Tengah",
  ASIA_TENGGARA: "Asia Tenggara",
  ASIA_SELATAN: "Asia Selatan",
  ASIA_TIMUR: "Asia Timur",
  EROPA: "Eropa",
  AFRIKA: "Afrika",
  AMERIKA: "Amerika",
  OSEANIA: "Oseania",
};

export const ALL_PROGRAM_CODES = [
  "PIHK",
  "PPIU",
  "BPW",
  "IATA",
  "IJIN-UMRAH",
  "IJIN-HAJI",
  "BPW-PRO",
];

export const globalNodes: GlobalNodeSeed[] = [
  // ---------- INDONESIA (KANTOR PUSAT) ----------
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Indonesia",
    countryCode: "ID",
    region: "ASIA_TENGGARA",
    city: "Jakarta",
    flag: "🇮🇩",
    title: "Kantor Pusat PUSAKA Jakarta",
    orgName: "Sekretariat Dewan Pakar 46 Bidang — Kemenag RI & ASITA",
    description:
      "Markas pusat seluruh layanan sertifikasi: pengajuan, asesmen lapangan, penerbitan sertifikat digital ber-QR, dan verifikasi daring. Titik koordinasi langsung dengan Kementerian Agama RI, ASITA, BNSP, dan 46 dewan pakar lintas bidang.",
    scope: ALL_PROGRAM_CODES,
    status: "AKTIF",
    since: "2015",
    contact: "layanan@pusaka.id",
    order: 1,
  },

  // ---------- TIMUR TENGAH ----------
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Arab Saudi",
    countryCode: "SA",
    region: "TIMUR_TENGAH",
    city: "Makkah",
    flag: "🇸🇦",
    title: "Kantor Perwakilan Makkah — Ambasador Haji & Umrah",
    orgName: "Koordinasi Kementerian Haji dan Umrah KSA",
    description:
      "Jembatan regulasi antara pemerintah Kerajaan Arab Saudi dan lembaga sertifikasi negara mitra: verifikasi pendamping PIHK di Makkah & Madinah, pengawasan mutu pelayanan jamaah, serta koordinasi kuota haji dan umrah lintas negara.",
    scope: ["PIHK", "IJIN-HAJI", "IJIN-UMRAH", "PPIU"],
    status: "AKTIF",
    since: "2018",
    contact: "makkah@pusaka.id",
    order: 2,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Arab Saudi",
    countryCode: "SA",
    region: "TIMUR_TENGAH",
    city: "Jeddah",
    flag: "🇸🇦",
    title: "Aliansi Platform Nusuk",
    orgName: "Nusuk — Ministry of Hajj and Umrah Digital Platform",
    description:
      "Integrasi digital dengan platform resmi Nusuk untuk validasi izin umrah, e-visa, dan identitas jamaah internasional. Setiap PPIU bersertifikat PUSAKA memperoleh jalur registrasi terverifikasi di Nusuk.",
    scope: ["PPIU", "IJIN-UMRAH"],
    status: "AKTIF",
    since: "2021",
    contact: null,
    order: 3,
  },
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Uni Emirat Arab",
    countryCode: "AE",
    region: "TIMUR_TENGAH",
    city: "Dubai",
    flag: "🇦🇪",
    title: "Kantor Regional Timur Tengah & Afrika (MENA)",
    orgName: "IATA Area Office Dubai — Government & Industry Liaison",
    description:
      "Pusat koordinasi sertifikasi IATA untuk pasar MENA: pelatihan agen BSP, akreditasi BPW berstandar IATA, dan fasilitasi izin operasi penerbangan haji & umrah charter.",
    scope: ["IATA", "BPW", "BPW-PRO", "IJIN-HAJI"],
    status: "AKTIF",
    since: "2016",
    contact: null,
    order: 4,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Qatar",
    countryCode: "QA",
    region: "TIMUR_TENGAH",
    city: "Doha",
    flag: "🇶🇦",
    title: "Kemitraan Otoritas Pariwisata Qatar",
    orgName: "Qatar Tourism Authority",
    description:
      "Standardisasi biro perjalanan wisata Qatar dengan kerangka mutu PUSAKA, termasuk sertifikasi paket wisata religi dan ziarah lintas benua.",
    scope: ["BPW", "PPIU"],
    status: "MOU",
    since: "2022",
    contact: null,
    order: 5,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Kuwait",
    countryCode: "KW",
    region: "TIMUR_TENGAH",
    city: "Kota Kuwait",
    flag: "🇰🇼",
    title: "Kerja Sama Urusan Islam & Wakaf Kuwait",
    orgName: "Ministry of Awqaf and Islamic Affairs — Kuwait",
    description:
      "Fasilitasi sertifikasi pendamping ibadah untuk jamaah Kuwait dan standar mutu pelayanan haji khusus di wilayah Teluk.",
    scope: ["PIHK", "IJIN-HAJI"],
    status: "MOU",
    since: "2023",
    contact: null,
    order: 6,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Bahrain",
    countryCode: "BH",
    region: "TIMUR_TENGAH",
    city: "Manama",
    flag: "🇧🇭",
    title: "Kemitraan Bahrain Tourism & Exhibitions",
    orgName: "Bahrain Tourism and Exhibitions Authority",
    description:
      "Program sertifikasi bersama untuk biro perjalanan Bahrain dengan fokus paket umrah premium dan wisata halal regional.",
    scope: ["BPW", "PPIU"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 7,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Oman",
    countryCode: "OM",
    region: "TIMUR_TENGAH",
    city: "Muscat",
    flag: "🇴🇲",
    title: "Kemitraan Otoritas Pariwisata Oman",
    orgName: "Ministry of Heritage and Tourism — Oman",
    description:
      "Sertifikasi biro perjalanan wisata Oman dengan penekanan pada kepatuhan standar internasional dan pelayanan jamaah selama musim umrah.",
    scope: ["BPW"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 8,
  },
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Yordania",
    countryCode: "JO",
    region: "TIMUR_TENGAH",
    city: "Amman",
    flag: "🇯🇴",
    title: "Kantor Regional IATA Amman",
    orgName: "IATA Regional Office Amman — Middle East & North Africa",
    description:
      "Mitra resmi uji kompetensi dan pelatihan IATA di wilayah Levant: kelas travel & tourism consultant, sertifikasi agen tiket, dan ujian global IATA berbahasa Arab dan Inggris.",
    scope: ["IATA", "BPW", "PPIU"],
    status: "AKTIF",
    since: "2019",
    contact: null,
    order: 9,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Irak",
    countryCode: "IQ",
    region: "TIMUR_TENGAH",
    city: "Baghdad",
    flag: "🇮🇶",
    title: "Kerja Sama Kementerian Haji & Ziarah Irak",
    orgName: "Iraqi Ministry of Hajj and Umrah",
    description:
      "Pertukaran standar mutu pendamping haji dan pengawasan bersama armada transportasi jamaah antara Irak dan negara-negara mitra PUSAKA.",
    scope: ["PIHK", "IJIN-HAJI"],
    status: "MOU",
    since: "2023",
    contact: null,
    order: 10,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Turki",
    countryCode: "TR",
    region: "TIMUR_TENGAH",
    city: "Istanbul",
    flag: "🇹🇷",
    title: "Aliansi TÜRSAB Turki",
    orgName: "TÜRSAB — Association of Turkish Travel Agencies",
    description:
      "Saling mengakui sertifikasi biro perjalanan (mutual recognition) antara TÜRSAB dan PUSAKA: audit lapangan bersama, standardisasi tur operator, dan prioritas izin umrah bagi anggota tersertifikasi.",
    scope: ["BPW", "BPW-PRO", "PPIU"],
    status: "AKTIF",
    since: "2020",
    contact: null,
    order: 11,
  },

  // ---------- ASIA TENGGARA ----------
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Malaysia",
    countryCode: "MY",
    region: "ASIA_TENGGARA",
    city: "Kuala Lumpur",
    flag: "🇲🇾",
    title: "Kerja Sama Tabung Haji & MOTAC",
    orgName: "Lembaga Tabung Haji — Ministry of Tourism, Arts and Culture Malaysia",
    description:
      "Penyelarasan standar mutu paket umrah & haji Malaysia: audit harga paket, kepastian hotel Makkah/Madinah, dan sertifikasi pendamping haji khusus lintas negara.",
    scope: ["PIHK", "PPIU", "IJIN-UMRAH", "IJIN-HAJI"],
    status: "AKTIF",
    since: "2017",
    contact: null,
    order: 12,
  },
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Singapura",
    countryCode: "SG",
    region: "ASIA_TENGGARA",
    city: "Singapura",
    flag: "🇸🇬",
    title: "Kantor Regional ASEAN",
    orgName: "Koordinasi MUIS & ASEAN Tourism Association",
    description:
      "Pusat layanan Asia Tenggara: sekretariat Mutual Recognition Arrangement (MRA) ASEAN, uji kompetensi regional, dan dukungan multi-bahasa untuk pengajuan sertifikasi dari 11 negara anggota.",
    scope: ALL_PROGRAM_CODES,
    status: "AKTIF",
    since: "2021",
    contact: "asean@pusaka.id",
    order: 13,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Brunei Darussalam",
    countryCode: "BN",
    region: "ASIA_TENGGARA",
    city: "Bandar Seri Begawan",
    flag: "🇧🇳",
    title: "Kerja Sama Halal Brunei Darussalam",
    orgName: "Ministry of Religious Affairs — Brunei Darussalam",
    description:
      "Sertifikasi pendamping ibadah dan kurator umrah untuk jamaah Brunei dengan standar kehalalan dan pelayanan premium Brunei Halal Brand.",
    scope: ["PIHK", "PPIU"],
    status: "MOU",
    since: "2022",
    contact: null,
    order: 14,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Thailand",
    countryCode: "TH",
    region: "ASIA_TENGGARA",
    city: "Bangkok",
    flag: "🇹🇭",
    title: "Kemitraan Dewan Islam Thailand",
    orgName: "The Central Islamic Council of Thailand (CICOT)",
    description:
      "Fasilitasi izin umrah dan sertifikasi agen perjalanan Muslim Thailand, termasuk pelatihan pemandu wisata religi berbahasa Thai.",
    scope: ["PPIU", "PIHK", "IJIN-UMRAH"],
    status: "MOU",
    since: "2023",
    contact: null,
    order: 15,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Filipina",
    countryCode: "PH",
    region: "ASIA_TENGGARA",
    city: "Manila",
    flag: "🇵🇭",
    title: "Kerja Sama Komisi Muslim Filipina",
    orgName: "National Commission on Muslim Filipinos (NCMF)",
    description:
      "Program sertifikasi bersama untuk biro perjalanan haji-umrah Filipina dan standardisasi kuota haji regional Mindanao.",
    scope: ["PPIU", "PIHK", "IJIN-HAJI"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 16,
  },

  // ---------- ASIA SELATAN ----------
  {
    kind: "MITRA_INTERNASIONAL",
    country: "India",
    countryCode: "IN",
    region: "ASIA_SELATAN",
    city: "Mumbai",
    flag: "🇮🇳",
    title: "Kerja Sama Haj Committee of India",
    orgName: "Haj Committee of India — Ministry of Minority Affairs",
    description:
      "Koordinasi standar pendamping haji khusus untuk jamaah India: sertifikasi penanggung jawab embarkasi, mutu katering halal, dan kesehatan jamaah lintas 21 titik embarkasi.",
    scope: ["PIHK", "IJIN-HAJI", "PPIU"],
    status: "AKTIF",
    since: "2018",
    contact: null,
    order: 17,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Pakistan",
    countryCode: "PK",
    region: "ASIA_SELATAN",
    city: "Karachi",
    flag: "🇵🇰",
    title: "Kerja Sama Kementerian Agama Pakistan",
    orgName: "Ministry of Religious Affairs and Interfaith Harmony — Pakistan",
    description:
      "Pertukaran standar regulasi tour operator haji Pakistan, audit mutu penginapan, dan sertifikasi pendamping berbahasa Urdu.",
    scope: ["PIHK", "PPIU"],
    status: "MOU",
    since: "2021",
    contact: null,
    order: 18,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Bangladesh",
    countryCode: "BD",
    region: "ASIA_SELATAN",
    city: "Dhaka",
    flag: "🇧🇩",
    title: "Kemitraan HAAB Bangladesh",
    orgName: "Hajj Agencies Association of Bangladesh (HAAB)",
    description:
      "Sertifikasi bersama 1.300+ agen umrah anggota HAAB: skoring mutu paket, verifikasi legalitas, dan pelatihan pendamping jamaah Bangladesh.",
    scope: ["PPIU", "IJIN-HAJI", "IJIN-UMRAH"],
    status: "MOU",
    since: "2022",
    contact: null,
    order: 19,
  },

  // ---------- ASIA TIMUR ----------
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Jepang",
    countryCode: "JP",
    region: "ASIA_TIMUR",
    city: "Tokyo",
    flag: "🇯🇵",
    title: "Kemitraan Wisata Halal Jepang",
    orgName: "Japan National Tourism Organization (JNTO) — Halal Japan Network",
    description:
      "Sertifikasi biro perjalanan wisata halal Jepang: pendampingan sertifikasi BPW-Pro, peta mitra halal 47 prefektur, dan program wisata religi Jepang–Timur Tengah.",
    scope: ["BPW", "BPW-PRO"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 20,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Korea Selatan",
    countryCode: "KR",
    region: "ASIA_TIMUR",
    city: "Seoul",
    flag: "🇰🇷",
    title: "Kemitraan Korea Tourism Organization",
    orgName: "Korea Tourism Organization (KTO)",
    description:
      "Standarisasi biro perjalanan inbound Korea dan sertifikasi paket wisata halal Korea untuk pasar Muslim global.",
    scope: ["BPW"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 21,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Tiongkok",
    countryCode: "CN",
    region: "ASIA_TIMUR",
    city: "Beijing",
    flag: "🇨🇳",
    title: "Kemitraan Office Pariwisata Tiongkok",
    orgName: "China National Tourist Office — Beijing",
    description:
      "Sertifikasi biro perjalanan wisata dengan spesialisasi rute Sutra religi dan layanan pemandu berbahasa Mandarin untuk jamaah umrah transit.",
    scope: ["BPW"],
    status: "MOU",
    since: "2023",
    contact: null,
    order: 22,
  },

  // ---------- EROPA ----------
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Inggris",
    countryCode: "GB",
    region: "EROPA",
    city: "London",
    flag: "🇬🇧",
    title: "Kantor Regional Eropa",
    orgName: "Koordinasi ABTA & IATA London",
    description:
      "Kantor Eropa PUSAKA: asuransi perjalanan jamaah, penyelesaian sengketa konsumen standar Inggris, dan pelatihan IATA untuk agen Eropa Barat.",
    scope: ["IATA", "BPW", "BPW-PRO"],
    status: "AKTIF",
    since: "2022",
    contact: "eropa@pusaka.id",
    order: 23,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Swiss",
    countryCode: "CH",
    region: "EROPA",
    city: "Jenewa",
    flag: "🇨🇭",
    title: "Kemitraan IATA Global Support Office",
    orgName: "IATA Global Support Office — Geneva",
    description:
      "Akses langsung ke pusat standar global IATA: pembaruan regulasi BSP, Multilateral Interline Traffic Agreements, dan lisensi pelatihan resmi IATA untuk wilayah mitra PUSAKA.",
    scope: ["IATA"],
    status: "AKTIF",
    since: "2015",
    contact: null,
    order: 24,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Jerman",
    countryCode: "DE",
    region: "EROPA",
    city: "Frankfurt",
    flag: "🇩🇪",
    title: "Kemitraan DRV Jerman",
    orgName: "DRV — Deutscher Reiseverband (German Travel Association)",
    description:
      "Mutual recognition sertifikasi biro perjalanan Jerman, standar perlindungan konsumen tur Eropa, dan audit keberlanjutan green travel.",
    scope: ["BPW", "BPW-PRO"],
    status: "MOU",
    since: "2022",
    contact: null,
    order: 25,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Italia",
    countryCode: "IT",
    region: "EROPA",
    city: "Roma",
    flag: "🇮🇹",
    title: "Kemitraan FIAVET Italia",
    orgName: "FIAVET — Federazione Italiana Associazioni Imprese di Viaggio e Turismo",
    description:
      "Sertifikasi biro perjalanan religi Italia: paket ziarah Vatikan–Yerusalem–Makkah lintas iman dan standar pelayanan jamaah katolik & muslim.",
    scope: ["BPW", "PPIU"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 26,
  },

  // ---------- AFRIKA ----------
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Mesir",
    countryCode: "EG",
    region: "AFRIKA",
    city: "Kairo",
    flag: "🇪🇬",
    title: "Kemitraan Otoritas Pariwisata Mesir",
    orgName: "Egyptian Ministry of Tourism and Antiquities",
    description:
      "Sertifikasi perusahaan perjalanan umrah Mesir serta fasilitasi izin operasi umrah bagi agen bersertifikat ganda (PUSAKA + Kementerian Pariwisata Mesir).",
    scope: ["PPIU", "IJIN-UMRAH", "BPW"],
    status: "AKTIF",
    since: "2019",
    contact: null,
    order: 27,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Nigeria",
    countryCode: "NG",
    region: "AFRIKA",
    city: "Abuja",
    flag: "🇳🇬",
    title: "Kerja Sama NAHCON Nigeria",
    orgName: "National Hajj Commission of Nigeria (NAHCON)",
    description:
      "Standardisasi mutu tour operator haji Nigeria — yang terbesar di Afrika Barat: skoring paket, sertifikasi pendamping, dan audit kesehatan jamaah.",
    scope: ["PIHK", "IJIN-HAJI", "PPIU"],
    status: "MOU",
    since: "2021",
    contact: null,
    order: 28,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Maroko",
    countryCode: "MA",
    region: "AFRIKA",
    city: "Casablanca",
    flag: "🇲🇦",
    title: "Kemitraan Pariwisata Maroko",
    orgName: "Moroccan Ministry of Tourism — ONMT",
    description:
      "Sertifikasi biro perjalanan Maroko dengan fokus rute wisata halal Maghreb dan paket umrah via Tanger & Casablanca.",
    scope: ["BPW", "PPIU"],
    status: "APLIKASI",
    since: "2024",
    contact: null,
    order: 29,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Afrika Selatan",
    countryCode: "ZA",
    region: "AFRIKA",
    city: "Johannesburg",
    flag: "🇿🇦",
    title: "Kemitraan IATA Regional Johannesburg",
    orgName: "IATA Regional Office Johannesburg — Africa & Middle East",
    description:
      "Pusat uji kompetensi IATA kawasan Afrika: sertifikasi agen tiket, pelatihan kargo udara, dan akreditasi BPW lintas negara Afrika Selatan.",
    scope: ["IATA", "BPW"],
    status: "AKTIF",
    since: "2020",
    contact: null,
    order: 30,
  },

  // ---------- AMERIKA ----------
  {
    kind: "KANTOR_PERWAKILAN",
    country: "Amerika Serikat",
    countryCode: "US",
    region: "AMERIKA",
    city: "New York",
    flag: "🇺🇸",
    title: "Kantor Regional Amerika Utara",
    orgName: "Koordinasi ASTA — American Society of Travel Advisors",
    description:
      "Layanan sertifikasi untuk agen perjalanan Amerika Utara: akreditasi IATA, verifikasi haji khusus diaspora, dan dukungan kepatuhan regulasi bagi paket wisata religi.",
    scope: ["IATA", "BPW", "PPIU"],
    status: "MOU",
    since: "2023",
    contact: "americas@pusaka.id",
    order: 31,
  },
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Kanada",
    countryCode: "CA",
    region: "AMERIKA",
    city: "Montreal",
    flag: "🇨🇦",
    title: "Kemitraan IATA World Headquarters",
    orgName: "IATA World Headquarters — Montreal, Canada",
    description:
      "Kerja sama kelembagaan dengan markas dunia IATA: sinkronisasi standar akreditasi travel agent global dan hak ujian resmi IATA untuk jaringan PUSAKA.",
    scope: ["IATA"],
    status: "AKTIF",
    since: "2015",
    contact: null,
    order: 32,
  },

  // ---------- OSEANIA ----------
  {
    kind: "MITRA_INTERNASIONAL",
    country: "Australia",
    countryCode: "AU",
    region: "OSEANIA",
    city: "Sydney",
    flag: "🇦🇺",
    title: "Kemitraan AFTA Australia",
    orgName: "AFTA — Australian Federation of Travel Agents",
    description:
      "Saling mengakui sertifikasi biro perjalanan Australia, bridging ATAS Accreditation, dan layanan haji khusus komunitas Muslim Australia.",
    scope: ["BPW", "PPIU", "PIHK"],
    status: "MOU",
    since: "2022",
    contact: null,
    order: 33,
  },
];

// ============================================================
// CAKUPAN INTERNASIONAL PER PROGRAM
// Tampil di dialog detail program (bagian "Cakupan Internasional")
// ============================================================

export interface ProgramCountryDetail {
  flag: string;
  country: string;
  detail: string;
}

export const programCountries: Record<string, ProgramCountryDetail[]> = {
  PIHK: [
    {
      flag: "🇸🇦",
      country: "Arab Saudi",
      detail:
        "Sertifikasi pendamping diakui Kementerian Haji & Umrah KSA untuk pendampingan jamaah asing di Makkah, Madinah, dan Jeddah.",
    },
    {
      flag: "🇮🇩",
      country: "Indonesia",
      detail:
        "Terintegrasi sistem PPIH Kemenag RI; kelulusan uji kompetensi diterima di seluruh embarkasi Indonesia.",
    },
    {
      flag: "🇲🇾",
      country: "Malaysia",
      detail:
        "Bridging program dengan Tabung Haji: mutu pelayanan setara pemandu haji Malaysia.",
    },
    {
      flag: "🇮🇳",
      country: "India",
      detail:
        "Standar pendamping 21 titik embarkasi Haj Committee of India (Ministry of Minority Affairs).",
    },
    {
      flag: "🇵🇰",
      country: "Pakistan",
      detail:
        "Pelatihan pendamping berbahasa Urdu bekerja sama dengan Ministry of Religious Affairs Pakistan.",
    },
    {
      flag: "🇧🇩",
      country: "Bangladesh",
      detail: "Sertifikasi pendamping bagi 1.300+ agen anggota HAAB Bangladesh.",
    },
    {
      flag: "🇳🇬",
      country: "Nigeria",
      detail: "Skoring pendamping untuk tour operator terdaftar NAHCON Nigeria.",
    },
    {
      flag: "🇮🇶",
      country: "Irak",
      detail:
        "Pertukaran standar pendamping dengan Kementerian Haji & Ziarah Irak.",
    },
  ],
  PPIU: [
    {
      flag: "🇸🇦",
      country: "Arab Saudi",
      detail:
        "Jalur registrasi terverifikasi di platform Nusuk untuk agen bersertifikat PUSAKA.",
    },
    {
      flag: "🇮🇩",
      country: "Indonesia",
      detail:
        "Modal utama pendaftaran izin PPIU di Kemenag RI dan akses sistem pelayanan umrah terintegrasi.",
    },
    {
      flag: "🇪🇬",
      country: "Mesir",
      detail:
        "Izin operasi umrah ganda bersama Ministry of Tourism and Antiquities Mesir.",
    },
    {
      flag: "🇲🇾",
      country: "Malaysia",
      detail: "Audit mutu paket selaras MOTAC & Tabung Haji Malaysia.",
    },
    {
      flag: "🇹🇷",
      country: "Turki",
      detail: "Prioritas izin umrah bagi anggota TÜRSAB bersertifikat.",
    },
    {
      flag: "🇹🇭",
      country: "Thailand",
      detail: "Fasilitasi izin umrah bersama CICOT untuk agen Thailand.",
    },
    {
      flag: "🇵🇭",
      country: "Filipina",
      detail:
        "Program sertifikasi bersama NCMF untuk biro haji-umrah Filipina.",
    },
    {
      flag: "🇮🇳",
      country: "India",
      detail:
        "Akses kemitraan dengan tour operator umrah terdaftar di seluruh embarkasi India.",
    },
  ],
  BPW: [
    {
      flag: "🇨🇦",
      country: "Kanada",
      detail:
        "Standar akreditasi selaras IATA World Headquarters Montreal & Global Support Office Geneva.",
    },
    {
      flag: "🇬🇧",
      country: "Inggris",
      detail:
        "Mutual recognition dengan ABTA dan perlindungan konsumen standar Inggris.",
    },
    {
      flag: "🇩🇪",
      country: "Jerman",
      detail:
        "Bridging sertifikasi DRV Jerman termasuk standar green travel berkelanjutan.",
    },
    {
      flag: "🇯🇵",
      country: "Jepang",
      detail:
        "Dukungan JNTO untuk biro perjalanan halal di 47 prefektur Jepang.",
    },
    {
      flag: "🇰🇷",
      country: "Korea Selatan",
      detail: "Standarisasi inbound bersama Korea Tourism Organization.",
    },
    {
      flag: "🇮🇹",
      country: "Italia",
      detail: "Program wisata religi lintas iman bersama FIAVET Italia.",
    },
    {
      flag: "🇦🇺",
      country: "Australia",
      detail: "Bridging ATAS Accreditation bersama AFTA Australia.",
    },
    {
      flag: "🇿🇦",
      country: "Afrika Selatan",
      detail: "Akreditasi regional Afrika via IATA Regional Johannesburg.",
    },
  ],
  IATA: [
    {
      flag: "🇨🇦",
      country: "Kanada",
      detail: "Ujian resmi mengacu standar IATA World Headquarters Montreal.",
    },
    {
      flag: "🇨🇭",
      country: "Swiss",
      detail:
        "Akses pembaruan regulasi BSP & Multilateral Interline dari Global Support Office Geneva.",
    },
    {
      flag: "🇸🇬",
      country: "Singapura",
      detail:
        "Kantor regional Asia-Pasifik: kelas pelatihan berbahasa Inggris & Melayu.",
    },
    {
      flag: "🇦🇪",
      country: "Uni Emirat Arab",
      detail: "Area office Dubai: pelatihan agen BSP pasar MENA.",
    },
    {
      flag: "🇯🇴",
      country: "Yordania",
      detail: "Ujian global IATA berbahasa Arab & Inggris di kantor Amman.",
    },
    {
      flag: "🇿🇦",
      country: "Afrika Selatan",
      detail: "Pusat uji kompetensi kawasan Afrika di Johannesburg.",
    },
    {
      flag: "🇬🇧",
      country: "Inggris",
      detail: "Pelatihan agen Eropa Barat via kantor regional London.",
    },
  ],
  "IJIN-UMRAH": [
    {
      flag: "🇸🇦",
      country: "Arab Saudi",
      detail:
        "Visa umrah elektronik & verifikasi melalui platform resmi Nusuk KSA.",
    },
    {
      flag: "🇮🇩",
      country: "Indonesia",
      detail: "Pendampingan penerbitan izin PPIU (SIUPPU) di Kemenag RI.",
    },
    {
      flag: "🇪🇬",
      country: "Mesir",
      detail:
        "Fasilitasi izin agen umrah asing di bawah naungan otoritas Mesir.",
    },
    {
      flag: "🇲🇾",
      country: "Malaysia",
      detail: "Kepatuhan MOTAC bagi paket umrah Malaysia.",
    },
    {
      flag: "🇹🇷",
      country: "Turki",
      detail: "Koordinasi TÜRSAB untuk izin operasi umrah Turki.",
    },
    {
      flag: "🇧🇩",
      country: "Bangladesh",
      detail: "Verifikasi legalitas agen anggota HAAB.",
    },
    {
      flag: "🇹🇭",
      country: "Thailand",
      detail: "Pembinaan izin bersama CICOT Thailand.",
    },
  ],
  "IJIN-HAJI": [
    {
      flag: "🇸🇦",
      country: "Arab Saudi",
      detail:
        "Koordinasi kuota haji langsung dengan Ministry of Hajj and Umrah KSA.",
    },
    {
      flag: "🇮🇩",
      country: "Indonesia",
      detail: "Pemetaan kuota haji reguler & khusus Kemenag RI.",
    },
    {
      flag: "🇮🇳",
      country: "India",
      detail: "Distribusi kuota 21 embarkasi Haj Committee of India.",
    },
    {
      flag: "🇵🇰",
      country: "Pakistan",
      detail: "Skema kuota haji reguler & sponsor Pakistan.",
    },
    {
      flag: "🇧🇩",
      country: "Bangladesh",
      detail: "Manajemen kuota agen anggota HAAB Bangladesh.",
    },
    {
      flag: "🇳🇬",
      country: "Nigeria",
      detail: "Pengawasan kuota tour operator NAHCON Nigeria.",
    },
    {
      flag: "🇲🇾",
      country: "Malaysia",
      detail: "Kuota haji Lembaga Tabung Haji Malaysia.",
    },
  ],
  "BPW-PRO": [
    {
      flag: "🇸🇬",
      country: "Singapura",
      detail: "Sekretariat MRA ASEAN untuk biro perjalanan kelas pro.",
    },
    {
      flag: "🇦🇪",
      country: "Uni Emirat Arab",
      detail: "Akreditasi premium via kantor regional Dubai (MENA).",
    },
    {
      flag: "🇹🇷",
      country: "Turki",
      detail: "Audit lapangan bersama TÜRSAB untuk tur operator pro.",
    },
    {
      flag: "🇯🇵",
      country: "Jepang",
      detail: "Pendampingan penuh biro perjalanan halal premium Jepang.",
    },
    {
      flag: "🇬🇧",
      country: "Inggris",
      detail: "Standar perlindungan konsumen & asuransi tur Eropa.",
    },
    {
      flag: "🇺🇸",
      country: "Amerika Serikat",
      detail:
        "Dukungan kepatuhan regulasi & verifikasi paket wisata religi Amerika.",
    },
    {
      flag: "🇰🇷",
      country: "Korea Selatan",
      detail: "Sertifikasi paket premium wisata halal Korea.",
    },
  ],
};
