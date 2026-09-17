"use client";

import { Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn, SectionHeading } from "@/components/pusaka/fade-in";

const FAQ_ITEMS = [
  {
    q: "Apa perbedaan sertifikasi PIHK dan PPIU?",
    a: "PIHK (Pendamping Haji Khusus) adalah sertifikasi bagi individu yang mendampingi jemaah haji secara khusus, sedangkan PPIU (Perusahaan Penyelenggara Perjalanan Umrah) adalah akreditasi bagi badan usaha yang menyelenggarakan perjalanan umrah. PIHK menitikberatkan kompetensi ritual & pendampingan individu, PPIU menilai sistem manajemen perusahaan, keuangan, dan perlindungan jemaah.",
  },
  {
    q: "Berapa lama masa berlaku sertifikat PUSAKA?",
    a: "Sertifikat profesi berlaku 3 tahun, sedangkan akreditasi lembaga (PPIU, BPW, IATA, PIHK) berlaku 3 tahun dengan audit pemantauan tahunan. Pembaruan dapat diajukan paling lambat 90 hari sebelum masa berlaku habis melalui portal pendaftaran.",
  },
  {
    q: "Bagaimana cara memverifikasi keaslian sertifikat?",
    a: "Buka menu Verifikasi di situs ini, lalu masukkan nomor sertifikat (contoh: PPU-2025-0001) atau pindai QR code yang tercetak pada sertifikat digital. Sistem akan menampilkan status, tier, skor audit, dan masa berlaku secara real-time.",
  },
  {
    q: "Berapa biaya sertifikasi dan bagaimana skema pembayarannya?",
    a: "Biaya berbeda tiap program, mulai dari Rp 3,5 juta untuk sertifikasi individu hingga Rp 25 juta untuk akreditasi lembaga internasional. Pembayaran dapat dicicil 2 tahap: 50% saat pendaftaran dan 50% sebelum pelatihan. Kwitansi resmi diterbitkan otomatis oleh sistem.",
  },
  {
    q: "Apakah biaya pendaftaran dapat dikembalikan (refund)?",
    a: "Ya. Pengembalian 100% diberikan bila pembatalan dilakukan sebelum jadwal verifikasi berkas. Setelah peserta mengikuti pelatihan, refund tidak tersedia, namun jadwal dapat ditunda satu kali dalam 12 bulan ke depan tanpa biaya tambahan.",
  },
  {
    q: "Dokumen apa saja yang perlu disiapkan?",
    a: "Dokumen umum meliputi: KTP/paspor, NPWP (untuk badan usaha), akta pendirian & izin usaha (SIUJK/SIUPTO untuk PPIU/BPW), foto profil perusahaan, serta daftar tenaga ahli. Daftar lengkap per program tersedia pada dialog detail program di bagian Program Sertifikasi.",
  },
  {
    q: "Apakah sertifikasi PUSAKA diakui oleh Kementerian Agama?",
    a: "Ya. PUSAKA bekerja di bawah kerangka regulasi Kemenag RI untuk aspek penyelenggaraan umrah & haji khusus, serta berkoordinasi dengan BNSP untuk skema sertifikasi kompetensi. Sertifikat kami juga diakui mitra internasional seperti IATA.",
  },
  {
    q: "Bagaimana cara menjadi anggota Dewan Pakar PUSAKA?",
    a: "Kandidat dewan pakar diusulkan lembaga profesi atau diundang langsung berdasarkan rekam jejak minimal 10 tahun di bidang ibadah, hukum, aviasi, manajemen, keuangan, teknologi, kesehatan, bahasa, atau logistik. Kirim CV dan publikasi ke sekretariat melalui form kontak; Dewan akan melakukan vetting dua tahap.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tanya Jawab"
          title="Pertanyaan yang Sering Diajukan"
          subtitle="Tidak menemukan jawaban? Hubungi sekretariat melalui form kontak di bagian bawah halaman."
        />

        <FadeIn delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-5 shadow-sm last:border-b"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-bold text-foreground hover:no-underline hover:text-emerald-700 dark:hover:text-emerald-300 [&[data-state=open]>svg]:text-emerald-700 dark:[&[data-state=open]>svg]:text-emerald-300">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>

        {/* ikon accordion default hanya plus/minus; beri petunjuk visual tambahan */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground" aria-hidden>
          <Plus className="h-3 w-3" />
          <Minus className="h-3 w-3" />
          <span>klik pertanyaan untuk membuka jawaban</span>
        </div>
      </div>
    </section>
  );
}
