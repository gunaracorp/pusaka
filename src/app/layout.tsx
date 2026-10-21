import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n/provider";
import { JsonLd, buildRootJsonLd } from "@/components/pusaka/json-ld";
import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================
// PUSAKA — Metadata SEO lengkap (Task 13)
// title/description/keywords/OG/Twitter/robots/hreflang/canonical
// ditambah JSON-LD @graph (Organization + WebSite + ProfessionalService).
// ============================================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
    "lembaga sertifikasi resmi",
    "verifikasi sertifikat QR",
    "master polymath",
  ],
  authors: [{ name: "Gugun Gunara — PUSAKA" }],
  creator: "Gugun Gunara — PUSAKA",
  publisher: "PUSAKA — Pusat Sertifikasi & Akreditasi Kompetensi",
  category: "Certification & Accreditation",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      id: "/",
      en: "/?lang=en",
      ar: "/?lang=ar",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "PUSAKA — 500+ Layanan Sertifikasi & Akreditasi Internasional | Gugun Gunara",
    description:
      "Ekosistem sertifikasi paling lengkap: 500+ layanan di 25 bidang profesional berstandar internasional, didukung 46 Dewan Pakar Lintas Bidang. Verifikasi digital QR-verified.",
    siteName: SITE_NAME,
    type: "website",
    locale: SITE_LOCALE,
    alternateLocale: ["en_US", "ar_SA"],
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PUSAKA — 500+ Layanan Sertifikasi Global oleh Gugun Gunara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PUSAKA — 500+ Layanan Sertifikasi Global",
    description:
      "500+ layanan sertifikasi & akreditasi internasional di 25 bidang oleh Gugun Gunara. Verifikasi digital QR-verified.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
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
        {/* Structured data utama (server-rendered) */}
        <JsonLd data={buildRootJsonLd()} />
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
