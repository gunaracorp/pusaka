import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
    "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi | PIHK, PPIU, BPW, IATA",
  description:
    "Lembaga sertifikasi profesi & akreditasi resmi industri perjalanan wisata, umrah & haji Indonesia. Program PIHK, PPIU, BPW, IATA, Izin Umrah & Izin Haji dengan Dewan Pakar 46 lintas bidang. Verifikasi sertifikat digital QR-verified secara online.",
  keywords: [
    "PUSAKA",
    "sertifikasi PIHK",
    "PPIU",
    "BPW",
    "IATA",
    "izin umrah",
    "izin haji",
    "akreditasi biro perjalanan wisata",
    "sertifikasi kompetensi",
    "dewan pakar",
  ],
  authors: [{ name: "PUSAKA" }],
  openGraph: {
    title:
      "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi | PIHK, PPIU, BPW, IATA",
    description:
      "Lembaga sertifikasi profesi & akreditasi industri perjalanan wisata, umrah & haji Indonesia. Sertifikat digital QR-verified dengan Dewan Pakar 46 lintas bidang.",
    siteName: "PUSAKA",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi",
    description:
      "Sertifikasi PIHK, PPIU, BPW, IATA, Izin Umrah & Haji. Verifikasi digital QR-verified.",
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
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
