import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'crypto'
import { globalNodes, programCountries } from './data/globalNodes'

const prisma = new PrismaClient()

/** Hash password dengan scrypt (node crypto) — format salt:hash hex */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const programs = [
  {
    code: 'PIHK',
    name: 'Sertifikasi Pendamping Ibadah Haji Khusus (PIHK)',
    shortName: 'PIHK',
    category: 'PROFESI',
    tagline: 'Profesi Pendamping Jemaah Haji Khusus Bersertifikat Nasional',
    description:
      'Sertifikasi kompetensi wajib bagi Pendamping Ibadah Haji Khusus yang membina dan melayani jemaah haji khusus sesuai standar Kemenag RI. Mencakup kompetensi manasik, pelayanan keberangkatan, penanganan darurat, dan etika profesi.',
    requirements: JSON.stringify([
      'Warga Negara Indonesia usia minimal 21 tahun',
      'Lulus pelatihan PIHK dari PPIU terdaftar Kemenag',
      'Pendidikan minimal D3 semua jurusan',
      'Sehat jasmani (surat keterangan dokter)',
      'Pas foto 3x4 latar merah terbaru',
      'Scan KTP & ijazah legalisir',
    ]),
    benefits: JSON.stringify([
      'Kartu Tanda Anggota (KTA) PIHK resmi berlaku 3 tahun',
      'Prioritas penempatan pembinaan jemaah haji khusus',
      'Akses komunitas & upgrade kompetensi tahunan',
      'Terdaftar dalam database nasional PUSAKA',
    ]),
    durationDays: 30,
    price: 2450000,
    seatsLeft: 42,
    holderCount: 6841,
    passRate: 92,
    accreditation: JSON.stringify(['Kemenag RI', 'BNSP', 'Dewan Pakar PUSAKA']),
    accentColor: 'emerald',
    featured: true,
  },
  {
    code: 'PPIU',
    name: 'Sertifikasi Perusahaan Perjalanan Ibadah Umrah (PPIU)',
    shortName: 'PPIU',
    category: 'PERUSAHAAN',
    tagline: 'Akreditasi Legalitas & Kualitas Penyelenggara Umrah',
    description:
      'Sertifikasi akreditasi bagi perusahaan penyelenggara perjalanan ibadah umrah. Mengaudit legalitas izin Kemenag, kesehatan keuangan, SOP pelayanan jemaah, serta kompetensi tenaga kerja. Sertifikasi ini menjadi jaminan amanat kaum Muslim untuk berumrah secara resmi dan terlindungi.',
    requirements: JSON.stringify([
      'Izin PPIU dari Kementerian Agama RI berlaku',
      'NIB & NPWP perseroan aktif',
      'Minimal 3 staf inti lulus pelatihan umrah',
      'Rekening pembayaran jemaah terpisah (escrow-ready)',
      'Kantor operasional fisik yang terverifikasi',
      'SOP pelayanan & penanganan komplain tersedia',
    ]),
    benefits: JSON.stringify([
      'Sertifikat akreditasi berjenjang Silver–Platinum',
      'Badge Verified ditampilkan di direktori nasional PUSAKA',
      'Hak menggunakan logo PUSAKA Certified',
      'Prioritas rekomendasi kerja sama B2B & travel fair',
      'Sertifikat QR-verified yang dapat diverifikasi publik',
    ]),
    durationDays: 45,
    price: 7950000,
    seatsLeft: 18,
    holderCount: 2156,
    passRate: 84,
    accreditation: JSON.stringify(['Kemenag RI', 'Kemenparekraf', 'BNSP', 'IATA Partner']),
    accentColor: 'teal',
    featured: true,
  },
  {
    code: 'BPW',
    name: 'Sertifikasi Biro Perjalanan Wisata (BPW)',
    shortName: 'BPW',
    category: 'PERUSAHAAN',
    tagline: 'Akreditasi Nasional Biro Perjalanan Wisata Terpercaya',
    description:
      'Sertifikasi akreditasi biro perjalanan wisata (tour & travel agent) dengan standar mutu layanan, keamanan perjalanan, dan tata kelola keuangan. Mengacu pada Standar Operasional Prosedur Asita & Good Corporate Governance industri pariwisata.',
    requirements: JSON.stringify([
      'Badan usaha CV/PT dengan NIB aktif',
      'Izin BPW / TIRTAKERTA (untuk travel outbond)',
      'Minimal 2 karyawan lulus kompetensi frontliner',
      'Asuransi tanggung jawab usaha (opsional, nilai plus)',
      'Sistem pemesanan & pembayaran tertib administrasi',
    ]),
    benefits: JSON.stringify([
      'Sertifikat akreditasi 3 tahun dengan audit tahunan',
      'Profil perusahaan di Direktori Teruji PUSAKA',
      'Uji coba mystery-audit gratis setiap tahun',
      'Akses pelatihan & sertifikasi karyawan diskon 30%',
    ]),
    durationDays: 40,
    price: 6500000,
    seatsLeft: 25,
    holderCount: 3120,
    passRate: 88,
    accreditation: JSON.stringify(['Kemenparekraf', 'ASITA', 'BNSP']),
    accentColor: 'amber',
    featured: true,
  },
  {
    code: 'IATA',
    name: 'Sertifikasi IATA (International Air Transport Association)',
    shortName: 'IATA',
    category: 'PERUSAHAAN',
    tagline: 'Kualifikasi Internasional Agen Tiket & Kargo Udara',
    description:
      'Program persiapan & ujian sertifikasi IATA untuk agen tiket dan kargo udara. Mencakup Foundation, Consultant, hingga Management Level. Diselenggarakan bersama training partner resmi IATA dengan pengajar bersertifikat internasional.',
    requirements: JSON.stringify([
      'Pendidikan minimal SMA/SMK sederajat',
      'Kemampuan Bahasa Inggris aktif (placement test)',
      'Pengalaman ticketing 1 tahun (untuk level Consultant)',
      'Fotokopi paspor yang masih berlaku',
    ]),
    benefits: JSON.stringify([
      'Sertifikat internasional IATA Montreal, Canada',
      'Berlaku seumur hidup (Foundation & Consultant)',
      'Pengakuan global di 290+ maskapai anggota IATA',
      'Ujian resmi di pusat ujian PUSAKA terakreditasi',
    ]),
    durationDays: 60,
    price: 12500000,
    seatsLeft: 15,
    holderCount: 1432,
    passRate: 79,
    accreditation: JSON.stringify(['IATA Montreal', 'GDS Amadeus', 'GDS Sabre']),
    accentColor: 'rose',
    featured: true,
  },
  {
    code: 'IJIN-UMRAH',
    name: 'Pendampingan Izin Penyelenggara Umrah',
    shortName: 'Izin Umrah',
    category: 'IZIN',
    tagline: 'Konsultansi & Pendampingan Perizinan PPIU Kemenag',
    description:
      'Layanan konsultansi terpadu pengurusan izin penyelenggara perjalanan ibadah umrah (Izin PPIU) hingga terbit. Termasuk pendampingan legalitas badan usaha, susunan anggaran dasar, rekening terpisah, hingga clear-to-verify Kemenag.',
    requirements: JSON.stringify([
      'Akta pendirian CV/PT yang mengatur usaha perjalanan ibadah',
      'Modal dasar minimal sesuai regulasi Kemenag terbaru',
      'Pengurus & penanggung jawab tidak terlibat tindak pidana',
      'Kantor korespondensi & papan nama usaha',
    ]),
    benefits: JSON.stringify([
      'Pendampingan penuh hingga izin terbit (guarantee process)',
      'Audit pra-perizinan oleh Dewan Pakar',
      'Template dokumen legal & SOP siap pakai',
      'Konsultasi hukum 1-on-1 tanpa batas selama proses',
    ]),
    durationDays: 90,
    price: 15000000,
    seatsLeft: 10,
    holderCount: 486,
    passRate: 96,
    accreditation: JSON.stringify(['Kemenag RI', 'Kemenkumham', 'Dewan Pakar Hukum PUSAKA']),
    accentColor: 'cyan',
    featured: false,
  },
  {
    code: 'IJIN-HAJI',
    name: 'Pendampingan Izin PIHK (Haji Khusus)',
    shortName: 'Izin Haji',
    category: 'IZIN',
    tagline: 'Perizinan Penyelenggara Haji Khusus Resmi Kemenag',
    description:
      'Layanan konsultansi pengurusan izin penyelenggara perjalanan ibadah haji khusus (PIHK). Meliputi evaluasi kelayakan perusahaan, verifikasi modal, pembinaan pembekalan pendamping, hingga penerbitan izin oleh Menteri Agama.',
    requirements: JSON.stringify([
      'Berbadan hukum PT dengan modal dasar sesuai ketentuan',
      'Memiliki izin PPIU yang aktif minimal 3 tahun',
      'Pengalaman menyelenggarakan umrah minimal 3 musim',
      'Memiliki minimal 10 PIHK bersertifikat (pembina)',
      'Laporan keuangan 2 tahun terakhir diaudit',
    ]),
    benefits: JSON.stringify([
      'Konsultansi intensif tahap pra-izin hingga terbit',
      'Simulasi verifikasi lapangan Kemenag',
      'Pendampingan audit keuangan oleh mitra KAP',
      'Pembinaan 10 kandidat PIHK internal perusahaan',
    ]),
    durationDays: 120,
    price: 35000000,
    seatsLeft: 6,
    holderCount: 213,
    passRate: 98,
    accreditation: JSON.stringify(['Kemenag RI', 'Kemenko Perekonomian', 'Dewan Pakar PUSAKA']),
    accentColor: 'lime',
    featured: false,
  },
  {
    code: 'BPW-PRO',
    name: 'Sertifikasi Profesional Travel Consultant (BPW-Pro)',
    shortName: 'BPW-Pro',
    category: 'PROFESI',
    tagline: 'Kompetensi Frontliner, Tour Leader & Travel Consultant',
    description:
      'Sertifikasi profesi individu bagi travel consultant, tour leader, dan frontliner biro perjalanan. Mencakup customer excellence, itinerary design, GDS dasar, penanganan keluhan, dan etika pelayanan pariwisata.',
    requirements: JSON.stringify([
      'Usia minimal 18 tahun, lulus SMA/SMK',
      'Berpengalaman di industri travel 6 bulan (disarankan)',
      'Surat rekomendasi perusahaan (tidak wajib bagi fresher)',
      'Komunikatif & sehat jasmani',
    ]),
    benefits: JSON.stringify([
      'Sertifikat kompetensi BNSP berlaku 3 tahun',
      'Prioritas rekrutmen jaringan 3.000+ perusahaan anggota',
      'Modul e-learning seumur hidup',
      'Uji ulang gratis jika belum lulus',
    ]),
    durationDays: 21,
    price: 1850000,
    seatsLeft: 60,
    holderCount: 9250,
    passRate: 94,
    accreditation: JSON.stringify(['BNSP', 'ASITA', 'Kemenparekraf']),
    accentColor: 'orange',
    featured: true,
  },
]

const institutions = [
  { name: 'PT Zahra Tour Indonesia', type: 'PPIU', city: 'Jakarta Selatan', province: 'DKI Jakarta', certNumber: 'PPU-2025-0001', programCode: 'PPIU', status: 'AKTIF', tier: 'PLATINUM', score: 96 },
  { name: 'PT Al-Hijaz Indo Persada', type: 'PPIU', city: 'Jakarta Timur', province: 'DKI Jakarta', certNumber: 'PPU-2025-0002', programCode: 'PPIU', status: 'AKTIF', tier: 'GOLD', score: 91 },
  { name: 'PT First Travel Cahaya Umrah', type: 'PPIU', city: 'Bandung', province: 'Jawa Barat', certNumber: 'PPU-2025-0003', programCode: 'PPIU', status: 'DIPERBARUI', tier: 'GOLD', score: 89 },
  { name: 'PT Barokah Khatulistiwa Tour', type: 'PPIU', city: 'Surabaya', province: 'Jawa Timur', certNumber: 'PPU-2025-0004', programCode: 'PPIU', status: 'AKTIF', tier: 'SILVER', score: 82 },
  { name: 'PT Srikandi Madinah Travel', type: 'PPIU', city: 'Yogyakarta', province: 'DI Yogyakarta', certNumber: 'PPU-2025-0005', programCode: 'PPIU', status: 'AKTIF', tier: 'PLATINUM', score: 95 },
  { name: 'PT Amanah Nusantara Wisata', type: 'BPW', city: 'Semarang', province: 'Jawa Tengah', certNumber: 'BPW-2025-0101', programCode: 'BPW', status: 'AKTIF', tier: 'GOLD', score: 90 },
  { name: 'PT Tour Indonesia Cahaya (TIC)', type: 'BPW', city: 'Medan', province: 'Sumatera Utara', certNumber: 'BPW-2025-0102', programCode: 'BPW', status: 'AKTIF', tier: 'PLATINUM', score: 97 },
  { name: 'CV Jogja Wisata Langgeng', type: 'BPW', city: 'Yogyakarta', province: 'DI Yogyakarta', certNumber: 'BPW-2025-0103', programCode: 'BPW', status: 'AKTIF', tier: 'SILVER', score: 80 },
  { name: 'PT Panorama Pesona Indonesia', type: 'BPW', city: 'Jakarta Pusat', province: 'DKI Jakarta', certNumber: 'BPW-2025-0104', programCode: 'BPW', status: 'DIPERBARUI', tier: 'PLATINUM', score: 98 },
  { name: 'PT Dwidaya World Wide', type: 'BPW', city: 'Surabaya', province: 'Jawa Timur', certNumber: 'BPW-2025-0105', programCode: 'BPW', status: 'AKTIF', tier: 'PLATINUM', score: 96 },
  { name: 'PT Garuda Krishna Travel', type: 'BPW', city: 'Denpasar', province: 'Bali', certNumber: 'BPW-2025-0106', programCode: 'BPW', status: 'AKTIF', tier: 'GOLD', score: 88 },
  { name: 'PT Mulya Gayatri Perjalanan', type: 'BPW', city: 'Makassar', province: 'Sulawesi Selatan', certNumber: 'BPW-2025-0107', programCode: 'BPW', status: 'AKTIF', tier: 'SILVER', score: 79 },
  { name: 'PT Natura Wisata Prima', type: 'BPW', city: 'Palembang', province: 'Sumatera Selatan', certNumber: 'BPW-2025-0108', programCode: 'BPW', status: 'AKTIF', tier: 'GOLD', score: 87 },
  { name: 'PT Anugrah Tour & Travel', type: 'BPW', city: 'Balikpapan', province: 'Kalimantan Timur', certNumber: 'BPW-2025-0109', programCode: 'BPW', status: 'AKTIF', tier: 'SILVER', score: 81 },
  { name: 'PT Putra Gunung Sahara', type: 'BPW', city: 'Mataram', province: 'Nusa Tenggara Barat', certNumber: 'BPW-2025-0110', programCode: 'BPW', status: 'AKTIF', tier: 'SILVER', score: 77 },
  { name: 'PT Cakra Buana Travelindo', type: 'BPW', city: 'Cirebon', province: 'Jawa Barat', certNumber: 'BPW-2025-0111', programCode: 'BPW', status: 'KADALUARSA', tier: 'SILVER', score: 70 },
  { name: 'PT Borneo Mantap Wisata', type: 'BPW', city: 'Banjarmasin', province: 'Kalimantan Selatan', certNumber: 'BPW-2025-0112', programCode: 'BPW', status: 'AKTIF', tier: 'GOLD', score: 85 },
  { name: 'PT Samudra Cipta Wisata', type: 'BPW', city: 'Pekanbaru', province: 'Riau', certNumber: 'BPW-2025-0113', programCode: 'BPW', status: 'AKTIF', tier: 'SILVER', score: 78 },
  { name: 'PT Garuda Oriente Trans', type: 'IATA', city: 'Jakarta Selatan', province: 'DKI Jakarta', certNumber: 'IAT-2025-0201', programCode: 'IATA', status: 'AKTIF', tier: 'PLATINUM', score: 94 },
  { name: 'PT Satriavi Java Airagent', type: 'IATA', city: 'Semarang', province: 'Jawa Tengah', certNumber: 'IAT-2025-0202', programCode: 'IATA', status: 'AKTIF', tier: 'GOLD', score: 89 },
  { name: 'PT Bumi Laut Nusantara', type: 'IATA', city: 'Surabaya', province: 'Jawa Timur', certNumber: 'IAT-2025-0203', programCode: 'IATA', status: 'AKTIF', tier: 'GOLD', score: 86 },
  { name: 'PT Optima Travel Services', type: 'IATA', city: 'Jakarta Pusat', province: 'DKI Jakarta', certNumber: 'IAT-2025-0204', programCode: 'IATA', status: 'DIPERBARUI', tier: 'PLATINUM', score: 93 },
  { name: 'PT Antariksa Wisata Asia', type: 'PPIU', city: 'Tangerang Selatan', province: 'Banten', certNumber: 'PPU-2025-0006', programCode: 'PPIU', status: 'AKTIF', tier: 'GOLD', score: 87 },
  { name: 'PT Insight Travel Semesta', type: 'IATA', city: 'Bandung', province: 'Jawa Barat', certNumber: 'IAT-2025-0205', programCode: 'IATA', status: 'AKTIF', tier: 'SILVER', score: 83 },
]

// ============ 46 DEWAN PAKAR LINTAS BIDANG ============
const experts = [
  { name: 'Prof. Dr. H. Ahmad Suyuthi, Lc., M.A.', field: 'Fiqh Manasik Haji & Umrah', category: 'IBADAH', organization: 'UIN Syarif Hidayatullah Jakarta', education: 'Al-Azhar University, Cairo', experienceYears: 24 },
  { name: 'Dr. Hj. Siti Rohmah Muflihah, M.Ag.', field: 'Manajemen Ibadah Haji Khusus', category: 'IBADAH', organization: 'Kementerian Agama RI (Purnawirawan)', education: 'UIN Sunan Kalijaga Yogyakarta', experienceYears: 21 },
  { name: 'Dr. Ahmad Syafi’i Baharuddin, S.H., M.H.', field: 'Hukum Perizinan Perjalanan Ibadah', category: 'HUKUM', organization: 'Universitas Padjadjaran', education: 'Universitas Indonesia', experienceYears: 19 },
  { name: 'Dr. Ratna Fitriani, S.H., LL.M.', field: 'Hukum Pariwisata Internasional', category: 'HUKUM', organization: 'Universitas Gadjah Mada', education: 'Leiden University, Belanda', experienceYears: 17 },
  { name: 'Ir. Bambang Priyanto, M.T., IPM', field: 'Manajemen Transportasi Darat & Rute', category: 'MANAJEMEN', organization: 'Politeknik Transportasi PDW', education: 'ITB', experienceYears: 22 },
  { name: 'Capt. Rizal Mahmud, M.Sc.', field: 'Aviasi & Regulasi Penerbangan', category: 'AVIASI', organization: 'Angkasa Pura I (Purnawirawan)', education: 'Sekolah Penerbangan Australia', experienceYears: 26 },
  { name: 'Farhan Wibowo, AMT., MBA', field: 'Sistem Distribusi GDS & Ticketing', category: 'AVIASI', organization: 'IATA Authorized Training Center', education: 'Universitas Melbourne', experienceYears: 14 },
  { name: 'Dr. Endah Kusumawardhani, S.E., M.Si., Ak.', field: 'Akuntansi & Audit Keuangan Travel', category: 'KEUANGAN', organization: 'Universitas Indonesia', education: 'Universitas Indonesia', experienceYears: 20 },
  { name: 'H. Yusuf Ramadhan, S.E., MBA, CFPI', field: 'Keuangan Syariah & Escrow Jemaah', category: 'KEUANGAN', organization: 'Bank Syariah Indonesia', education: 'University of Manchester', experienceYears: 16 },
  { name: 'Dewi Anggraini, S.E., M.Si., BKP', field: 'Perpajakan Badan Usaha Perjalanan', category: 'KEUANGAN', organization: 'Konsultan Pajak Utama', education: 'Universitas Airlangga', experienceYears: 18 },
  { name: 'Dr. Cahyono Agus Prihatin, M.M.', field: 'Manajemen Biro Perjalanan Wisata', category: 'MANAJEMEN', organization: 'ASITA Pusat', education: 'Universitas Gadjah Mada', experienceYears: 25 },
  { name: 'Maya Puspitasari, S.Psi., M.M.', field: 'Manajemen SDM & Customer Excellence', category: 'MANAJEMEN', organization: 'Yayasan Pembinaan Manajemen', education: 'Universitas Indonesia', experienceYears: 15 },
  { name: 'Dr. Ir. Hendra Gunawan, M.Par.', field: 'Hospitality & Pelayanan Jemaah', category: 'MANAJEMEN', organization: 'Trisakti Institute of Tourism', education: 'Nanyang Technological University', experienceYears: 19 },
  { name: 'Dr. Taufiq Hidayat, M.Si.', field: 'Regulasi Kepariwisataan Nasional', category: 'HUKUM', organization: 'Kemenparekraf RI (Purnawirawan)', education: 'Universitas Indonesia', experienceYears: 23 },
  { name: 'Luluk Nur Azizah, S.H., M.H.', field: 'Perlindungan Konsumen Jasa Wisata', category: 'HUKUM', organization: 'BPKN RI', education: 'Universitas Diponegoro', experienceYears: 13 },
  { name: 'Dr. Kholil Nawawi, Lc., M.A. ', field: 'Linguistik Arab & Interpretasi', category: 'BAHASA', organization: 'LIPIA Jakarta', education: 'Umm Al-Qura University', experienceYears: 22 },
  { name: 'H. Muhammad Ridwan, S.Pd.I., C.TI.', field: 'Pemanduan & Mutawwif Profesional', category: 'IBADAH', organization: 'Forum Mutawwif Indonesia', education: 'IIQ Jakarta', experienceYears: 17 },
  { name: 'Dr. Fitria Hasanah, S.KM., M.Kes.', field: 'Kesehatan Jemaah & Promkes', category: 'KESEHATAN', organization: 'Kemenkes RI (Purnawirawan)', education: 'Universitas Airlangga', experienceYears: 20 },
  { name: 'dr. Angga Pratama, Sp.PD', field: 'Medis Perjalanan & Kesiapsiagaan', category: 'KESEHATAN', organization: 'RS Pusat Pertamina', education: 'UI', experienceYears: 12 },
  { name: 'Dr. Vina Rahmawati, S.KM., M.Epid.', field: 'Epidemiologi & Quarantine Haji', category: 'KESEHATAN', organization: 'Balai Kesehatan Haji Jeddah', education: 'Universitas Hasanuddin', experienceYears: 14 },
  { name: 'Ir. Danang Wirapraja, M.Kom.', field: 'Transformasi Digital Travel', category: 'TEKNOLOGI', organization: 'PT Telkom Indonesia', education: 'Institut Teknologi Bandung', experienceYears: 16 },
  { name: 'Nanda Kurniawan, S.T., CISM', field: 'Keamanan Siber Data Jemaah', category: 'TEKNOLOGI', organization: 'BSSN (Purnawirawan)', education: 'Universitas Teknologi Sumbawa', experienceYears: 13 },
  { name: 'Rachmad Hidayat, S.Kom., M.T.', field: 'Sistem Informasi Manajemen Travel', category: 'TEKNOLOGI', organization: 'Universitas Telkom', education: 'ITB', experienceYears: 15 },
  { name: 'Anisa Wulandari, S.Ds., M.A.', field: 'Branding & Komunikasi Publik', category: 'MANAJEMEN', organization: 'Indonesia Brand Institute', education: 'Royal College of Art, London', experienceYears: 11 },
  { name: 'Bayu Setiawan, S.T., M.M., CTM', field: 'Digital Marketing & OTA Strategy', category: 'MANAJEMEN', organization: 'PT Traveloka Utama', education: 'Queensland University', experienceYears: 12 },
  { name: 'Dr. H. Syamsul Bahri, M.Ag.', field: 'Etika Pelayanan Ibadah', category: 'IBADAH', organization: 'UIN Alauddin Makassar', education: 'UIN Sunan Ampel', experienceYears: 23 },
  { name: 'Ir. Joko Susilo, M.M., IPM', field: 'Logistik & Rantai Pasok Perjalanan', category: 'LOGISTIK', organization: 'PT Pos Indonesia', education: 'ITS Surabaya', experienceYears: 21 },
  { name: 'Yohanes Purwanto, S.T., CTAA', field: 'Kargo Udara & Logistik Haji', category: 'LOGISTIK', organization: 'PT Angkasa Pura Logistik', education: 'STPI Curug', experienceYears: 18 },
  { name: 'Dr. Imam Muslih, S.Fil.I.', field: 'Akhlaq & Pembinaan Jemaah', category: 'IBADAH', organization: 'Pondok Modern Gontor', education: 'IIQ Jakarta', experienceYears: 25 },
  { name: 'Dr. Henny Kusumawati, S.H., M.Hum.', field: 'Hukum Kontrak Bisnis Perjalanan', category: 'HUKUM', organization: 'Universitas Brawijaya', education: 'Universitas Brawijaya', experienceYears: 16 },
  { name: 'Budi Santoso, Ak., CA., CPMA', field: 'Good Corporate Governance', category: 'KEUANGAN', organization: 'Kementerian BUMN (Purnawirawan)', education: 'STAN', experienceYears: 27 },
  { name: 'Sari Ramadhani, S.E., M.M., CSRS', field: 'Sustainability & Wisata Halal', category: 'MANAJEMEN', organization: 'Universitas Padjadjaran', education: 'University of Birmingham', experienceYears: 10 },
  { name: 'Dr. Agus Riyanto, M.Si.', field: 'Kepatuhan & Anti-Fraud', category: 'HUKUM', organization: 'Lembaga Integritas Nasional', education: 'Universitas Indonesia', experienceYears: 19 },
  { name: 'Fadhil Muhammad, S.Hub.Int., M.A.', field: 'Hubungan Internasional & Visa', category: 'MANAJEMEN', organization: 'Kemlu RI (Purnawirawan)', education: 'Australian National University', experienceYears: 17 },
  { name: 'dr. Laila Fitriani, M.Biomed', field: 'Gizi & Layanan Medis Perjalanan', category: 'KESEHATAN', organization: 'Universitas Padjadjaran', education: 'UGM', experienceYears: 11 },
  { name: 'Dr. Sofyan Anwar, M.H.I.', field: 'Regulasi Haji Khusus & PIHK', category: 'IBADAH', organization: 'Kemenag RI — Ditjen PHU', education: 'UIN Syarif Hidayatullah', experienceYears: 20 },
  { name: 'Hj. Nurhayati Abdul Gani, S.E., MM.', field: 'Operasional PPIU Multi-Cabang', category: 'MANAJEMEN', organization: 'Himpunan PPIU Indonesia', education: 'Universitas Trisakti', experienceYears: 24 },
  { name: 'Michael Tandi, B.Sc., M.B.A.', field: 'Partnership & B2B Aviation', category: 'AVIASI', organization: 'Singapore Airlines Group (Alumni)', education: 'National University of Singapore', experienceYears: 15 },
  { name: 'Dr. Yulia Hastuti, S.S., M.Hum.', field: 'Penerjemahan Tersumpah & Interpretasi', category: 'BAHASA', organization: 'Universitas Negeri Jakarta', education: 'SOAS University of London', experienceYears: 14 },
  { name: 'Ir. Rizki Ardiansyah, IPM', field: 'Keselamatan & K3 Perjalanan', category: 'LOGISTIK', organization: 'Kemnaker RI', education: 'ITB', experienceYears: 16 },
  { name: 'Dr. Maya Kartika, S.Pd., M.Hum.', field: 'Pendampingan Jamaah Disabilitas', category: 'IBADAH', organization: 'Universitas Negeri Yogyakarta', education: 'Monash University', experienceYears: 13 },
  { name: 'Arif Wibisono, S.T., M.Sc.', field: 'Sistem Reservasi & Payment Gateway', category: 'TEKNOLOGI', organization: 'PT Xendit Teknologi', education: 'TU Delft, Belanda', experienceYears: 12 },
  { name: 'Dr. Retno Wulandari, S.E., M.Si., Ak.', field: 'Audit Kinerja & Mystery Audit', category: 'KEUANGAN', organization: 'BPKP RI', education: 'IPB University', experienceYears: 22 },
  { name: 'H. Zainuddin Manaf, S.Ag., M.A.', field: 'Pembinaan Kesehatan Jiwa Jemaah', category: 'KESEHATAN', organization: 'Puskesmas Pembina Haji', education: 'UIN Walisongo', experienceYears: 18 },
  { name: 'Kartika Sari Dewi, S.Farm., Apt., M.Farm.', field: 'Farmasi Perjalanan & Vaksinasi', category: 'KESEHATAN', organization: 'Universitas Pancasila', education: 'UI', experienceYears: 12 },
  { name: 'Dr. Bagus Prakoso, S.E., M.Sc.', field: 'Analisis Ekonomi Industri Travel', category: 'KEUANGAN', organization: 'Bank Indonesia (Purnawirawan)', education: 'University of Amsterdam', experienceYears: 20 },
]

const newsArticles = [
  {
    title: 'PUSAKA Luncurkan Sertifikasi Digital QR-Verified untuk Seluruh Pemegang Sertifikat',
    slug: 'luncurkan-sertifikasi-digital-qr-verified',
    excerpt: 'Mulai Februari 2025, seluruh sertifikat PUSAKA dilengkapi QR Code yang dapat diverifikasi publik secara real-time melalui portal resmi.',
    category: 'PENGUMUMAN',
    author: 'Divisi Komunikasi PUSAKA',
    featured: true,
    content:
      'Jakarta — Pusat Sertifikasi & Akreditasi Kompetensi (PUSAKA) resmi meluncurkan sistem sertifikasi digital dengan QR-Verified Code. Inovasi ini memungkinkan masyarakat memverifikasi keaslian sertifikat PIHK, PPIU, BPW, maupun IATA hanya dalam hitungan detik.\n\nKetua Dewan Pakar PUSAKA menyatakan bahwa sistem ini merupakan jawaban atas meningkatnya kasus pemalsuan sertifikat di industri perjalanan ibadah. "Dengan QR-Verified, jemaah dapat memastikan pendamping dan penyelenggara yang mereka pilih benar-benar bersertifikat," ujarnya.\n\nSistem ini terintegrasi dengan database nasional PUSAKA dan akan diberlakukan bertahap pada seluruh 14.840 pemegang sertifikat aktif.',
  },
  {
    title: 'Kerja Sama Strategis PUSAKA × IATA: Ujian Internasional Kini Tersedia di Jakarta & Surabaya',
    slug: 'kerja-sama-strategis-pusaka-iata',
    excerpt: 'Penandatanganan MoU dengan IATA Montreal membuka akses ujian sertifikasi aviasi internasional tanpa harus ke luar negeri.',
    category: 'KEMITRAAN',
    author: 'Divisi Kemitraan Global',
    featured: true,
    content:
      'Jakarta — PUSAKA menandatangani Memorandum of Understanding dengan International Air Transport Association (IATA) untuk menjadi Authorized Examination Center di Indonesia.\n\nMulai triwulan kedua, ujian IATA Foundation, Consultant, dan Management Level dapat diikuti di dua pusat ujian resmi: Jakarta dan Surabaya. Program ini diharapkan memangkas biaya sertifikasi aviasi hingga 40% bagi tenaga kerja Indonesia.\n\nAnggota Dewan Pakar bidang aviasi PUSAKA, Capt. Rizal Mahmud, menegaskan bahwa kualifikasi IATA membuka peluang kerja di 290+ maskapai dan 8.000+ agen perjalanan terakreditasi di dunia.',
  },
  {
    title: 'SOP Baru Penanganan Kesehatan Jemaah Haji Khusus Mulai Diberlakukan',
    slug: 'sop-baru-penanganan-kesehatan-jemaah',
    excerpt: 'Standar baru mencakup kewajiban pendamping PIHK bersertifikasi medis dasar di setiap rombongan di atas 40 jemaah.',
    category: 'REGULASI',
    author: 'Dewan Pakar Bidang Kesehatan',
    featured: false,
    content:
      'Mengacu pada evaluasi musim haji terakhir, Dewan Pakar PUSAKA bidang kesehatan bersama Kemenkes menerbitkan SOP penanganan kesehatan jemaah haji khusus versi terbaru.\n\nSOP ini mewajibkan setiap rombongan dengan jemaah di atas 40 orang didampingi minimal satu pendamping yang lulus modul medis dasar — mencakup pertolongan pertama, manajemen heat stroke, hingga protokol penyakit menular.\n\nPelatihan update ini wajib diikuti seluruh PIHK pemegang sertifikat aktif dan menjadi bagian dari syarat pembaruan sertifikat 3 tahunan.',
  },
  {
    title: 'Hasil Akreditasi Triwulan I: 24 Perusahaan Baru Raih Sertifikasi PPIU & BPW',
    slug: 'hasil-akreditasi-triwulan-i',
    excerpt: 'Dari 41 pendaftar, 24 perusahaan dinyatakan lulus audit lapangan. 11 di antaranya meraih tier Platinum.',
    category: 'KEGIATAN',
    author: 'Divisi Akreditasi Perusahaan',
    featured: false,
    content:
      'Komite Akreditasi Perusahaan PUSAKA menerbitkan hasil audit triwulan pertama. Sebanyak 24 perusahaan — 6 PPIU dan 18 BPW — resmi memperoleh sertifikasi akreditasi.\n\nProses audit meliputi verifikasi legalitas, audit keuangan, wawancara manajemen, hingga mystery audit pelayanan. Perusahaan yang tidak lulus mendapatkan rekomendasi perbaikan dan dapat mendaftar ulang dalam 6 bulan.\n\n"Tier Platinum kami berikan kepada perusahaan dengan skor audit di atas 93. Mereka menunjukkan tata kelola pelayanan jemaah yang patut diteladani," kata Ketua Komite Akreditasi.',
  },
  {
    title: '46 Dewan Pakar PUSAKA Adakan Musyawarah Nasional Standardisasi 2025',
    slug: 'musyawarah-nasional-dewan-pakar-2025',
    excerpt: 'Musyawarah memutuskan pembaruan kurikulum sertifikasi di 9 bidang keilmuan, termasuk bidang baru: Keamanan Siber Data Jemaah.',
    category: 'KEGIATAN',
    author: 'Sekretariat Dewan Pakar',
    featured: false,
    content:
      'Seluruh 46 Dewan Pakar PUSAKA lintas bidang berkumpul dalam Musyawarah Nasional Standardisasi di Jakarta. Agenda utama: pembaruan 9 kurikulum sertifikasi dan penetapan bidang keilmuan baru.\n\nSatu bidang baru resmi dibuka: Keamanan Siber Data Jemaah — merespons meningkatnya risiko kebocoran data pribadi di industri perjalanan digital.\n\nHasil musyawarah akan menjadi standar kurikulum pelatihan seluruh Lembaga Pelatihan mitra PUSAKA mulai tahun ajaran baru.',
  },
  {
    title: 'Portal Verifikasi Publik Resmi Dibuka: Cek Keaslian 14.000+ Sertifikat Secara Gratis',
    slug: 'portal-verifikasi-publik-dibuka',
    excerpt: 'Masyarakat kini dapat memverifikasi PIHK, PPIU, BPW, dan IATA secara mandiri melalui fitur Verifikasi Sertifikat di portal PUSAKA.',
    category: 'PENGUMUMAN',
    author: 'Divisi Teknologi Informasi',
    featured: false,
    content:
      'PUSAKA membuka layanan verifikasi publik gratis. Cukup masukkan nomor sertifikat pada portal, sistem akan menampilkan status keabsahan, pemegang, masa berlaku, hingga tier akreditasi.\n\nFitur ini diharapkan melindungi jemaah dari penipuan berkedok travel umrah & haji yang tidak berizin. "Verifikasi dulu, lalu bertransaksi," pesan Divisi Teknologi PUSAKA.',
  },
]

async function main() {
  console.log('🌱 Seeding PUSAKA database...')

  await prisma.verifyLog.deleteMany()
  await prisma.contactMessage.deleteMany()
  await prisma.application.deleteMany()
  await prisma.newsArticle.deleteMany()
  await prisma.expert.deleteMany()
  await prisma.institution.deleteMany()
  await prisma.program.deleteMany()
  await prisma.globalNode.deleteMany()

  // ===== Akun CMS Admin =====
  await prisma.adminUser.deleteMany()
  await prisma.adminUser.createMany({
    data: [
      {
        username: 'admin',
        name: 'Administrator PUSAKA',
        passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? 'Pusaka2026!'),
        role: 'SUPERADMIN',
      },
      {
        username: 'editor',
        name: 'Editor Konten PUSAKA',
        passwordHash: hashPassword(process.env.EDITOR_PASSWORD ?? 'Editor2026!'),
        role: 'STAFF',
      },
    ],
  })
  console.log('  ✓ 2 akun admin (admin / editor)')

  for (const p of programs) {
    await prisma.program.create({ data: p })
    // Cakupan internasional per program (JSON array of {flag, country, detail})
    await prisma.program.update({
      where: { code: p.code },
      data: { countries: JSON.stringify(programCountries[p.code] ?? []) },
    })
  }
  console.log(`  ✓ ${programs.length} programs (+ cakupan internasional)`)

  // ===== Jaringan Global (kantor perwakilan & mitra internasional) =====
  for (const node of globalNodes) {
    await prisma.globalNode.create({
      data: {
        kind: node.kind,
        country: node.country,
        countryCode: node.countryCode,
        region: node.region,
        city: node.city,
        flag: node.flag,
        title: node.title,
        orgName: node.orgName,
        description: node.description,
        scope: JSON.stringify(node.scope),
        status: node.status,
        since: node.since,
        contact: node.contact,
        order: node.order,
      },
    })
  }
  console.log(`  ✓ ${globalNodes.length} global nodes (jaringan global)`)

  const now = new Date() // selalu relatif terhadap tanggal sistem agar konsisten
  for (const [i, inst] of institutions.entries()) {
    const issued = new Date(now)
    issued.setMonth(issued.getMonth() - (3 + i))
    const expires = new Date(issued)
    expires.setFullYear(expires.getFullYear() + 3)
    // institusi berstatus KADALUARSA dibuat sudah lewat masa berlaku
    if (inst.status === 'KADALUARSA') {
      expires.setFullYear(issued.getFullYear() + 1)
      expires.setMonth(expires.getMonth() - 2)
    }
    await prisma.institution.create({
      data: {
        ...inst,
        issuedAt: issued,
        expiresAt: expires,
        contact: `info@${inst.name.toLowerCase().replace(/^(pt|cv)\s+/,'').split(' ')[0].replace(/[^a-z]/g,'')}.co.id`,
        phone: `+62 21 ${5000 + i} ${1000 + i * 7}`,
      },
    })
  }
  console.log(`  ✓ ${institutions.length} institutions`)

  for (const [i, e] of experts.entries()) {
    const initials = e.name
      .replace(/^(Prof|Dr|Ir|Capt|H|Hj|dr)\.?\s*/g, '')
      .split(/[ ,]+/)
      .filter(w => /^[A-Z]/.test(w))
      .slice(0, 2)
      .map(w => w[0])
      .join('')
    await prisma.expert.create({
      data: {
        ...e,
        expertise: `Ahli di bidang ${e.field} dengan rekam jejak ${e.experienceYears} tahun pengalaman nasional & internasional.`,
        licenseNo: `DP-${String(i + 1).padStart(3, '0')}-2025`,
        initials: initials || 'DP',
        featured: i < 6,
      },
    })
  }
  console.log(`  ✓ ${experts.length} experts (46 Dewan Pakar)`)

  for (const [i, a] of newsArticles.entries()) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 9)
    await prisma.newsArticle.create({ data: { ...a, publishedAt: d } })
  }
  console.log(`  ✓ ${newsArticles.length} news articles`)

  // Sample applications for tracking demo
  const sampleApps = [
    { trackingCode: 'PSK-2025-83012', applicantType: 'INDIVIDU', programCode: 'PIHK', fullName: 'Ahmad Fauzi Rahman', email: 'ahmad.fauzi@mail.com', phone: '+62 812-3344-5566', city: 'Jakarta', status: 'ASSESSMENT' },
    { trackingCode: 'PSK-2025-83013', applicantType: 'PERUSAHAAN', programCode: 'PPIU', fullName: 'Siti Aminah', email: 'admin@rahmattour.co.id', phone: '+62 813-9988-7766', institution: 'PT Rahmat Tour Wisata', city: 'Solo', status: 'VERIFIKASI' },
    { trackingCode: 'PSK-2025-83014', applicantType: 'INDIVIDU', programCode: 'BPW-PRO', fullName: 'Bunga Kirana', email: 'bunga.kirana@mail.com', phone: '+62 878-1234-9090', city: 'Bandung', status: 'APPROVED' },
    { trackingCode: 'PSK-2025-83015', applicantType: 'PERUSAHAAN', programCode: 'BPW', fullName: 'Deni Hermawan', email: 'corp@denitravel.id', phone: '+62 811-4455-2233', institution: 'CV Deni Travel Perkasa', city: 'Malang', status: 'REVIEW' },
  ]
  for (const a of sampleApps) await prisma.application.create({ data: a })
  console.log(`  ✓ ${sampleApps.length} sample applications`)

  // Verify logs (simulasi aktivitas verifikasi publik)
  const validCerts = institutions.filter(x => x.status !== 'KADALUARSA')
  for (let i = 0; i < 18; i++) {
    const c = validCerts[i % validCerts.length]
    const d = new Date(now)
    d.setMinutes(d.getMinutes() - i * 7 - Math.floor(Math.random() * 5))
    await prisma.verifyLog.create({
      data: { certNumber: c.certNumber, result: 'VALID', createdAt: d },
    })
  }
  for (let i = 0; i < 4; i++) {
    const d = new Date(now)
    d.setMinutes(d.getMinutes() - i * 23)
    await prisma.verifyLog.create({
      data: { certNumber: `FAKE-${9000 + i}-XX`, result: 'INVALID', createdAt: d },
    })
  }
  console.log('  ✓ 22 verify logs')

  console.log('✅ Seed complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
