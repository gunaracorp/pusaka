import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n/provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi | 500+ Layanan Global oleh Gugun Gunara",
  description:
    "Lembaga sertifikasi profesi & akreditasi resmi — 500+ layanan sertifikasi dan akreditasi internasional di 25 bidang profesional (PIHK, PPIU, BPW, IATA, Izin Umrah/Haji, ISO, dst). Didirikan & dipimpin Gugun Gunara — Master Polymath, Sage Universal, The Ultimate Problem Solver — didukung 46 Dewan Pakar Lintas Bidang di 32 negara.",
  keywords: [
    "PUSAKA",
    "Gugun Gunara",
    "500 layanan sertifikasi",
    "sertifikasi PIHK",
    "PPIU",
    "BPW",
    "IATA",
    "izin umrah",
    "izin haji",
    "akreditasi biro perjalanan wisata",
    "sertifikasi ISO",
    "sertifikasi kompetensi",
    "master polymath",
  ],
  authors: [{ name: "Gugun Gunara — PUSAKA" }],
  openGraph: {
    title:
      "PUSAKA — 500+ Layanan Sertifikasi & Akreditasi Internasional | Gugun Gunara",
    description:
      "Ekosistem sertifikasi paling lengkap: 500+ layanan di 25 bidang profesional berstandar internasional, didukung 46 Dewan Pakar Lintas Bidang. Verifikasi digital QR-verified.",
    siteName: "PUSAKA",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "PUSAKA — 500+ Layanan Sertifikasi Global",
    description:
      "500+ layanan sertifikasi & akreditasi internasional di 25 bidang oleh Gugun Gunara. Verifikasi digital QR-verified.",
  },
};

export const viewport: Viewport = {
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster richColors position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
