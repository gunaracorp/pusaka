import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

// PUSAKA — PWA manifest (Task 13)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Pusat Sertifikasi & Akreditasi Kompetensi`,
    short_name: SITE_NAME,
    description:
      "500+ layanan sertifikasi & akreditasi internasional di 25 bidang profesional oleh Gugun Gunara. Verifikasi digital QR-verified.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#047857",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
