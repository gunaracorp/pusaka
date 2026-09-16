"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/pusaka/navbar";
import { Hero } from "@/components/pusaka/hero";
import { TrustMarquee } from "@/components/pusaka/trust-marquee";
import { QuickVerify } from "@/components/pusaka/quick-verify";
import { Programs } from "@/components/pusaka/programs";
import { VerifySection } from "@/components/pusaka/verify-section";
import { Process } from "@/components/pusaka/process";
import { Directory } from "@/components/pusaka/directory";
import { Experts } from "@/components/pusaka/experts";
import { StatsSection } from "@/components/pusaka/stats-section";
import { ApplicationForm } from "@/components/pusaka/application-form";
import { TrackSection } from "@/components/pusaka/track";
import { News } from "@/components/pusaka/news";
import { FAQ } from "@/components/pusaka/faq";
import { Testimonials } from "@/components/pusaka/testimonials";
import { ContactCTA } from "@/components/pusaka/contact";
import { Footer } from "@/components/pusaka/footer";
import { AdminDashboard } from "@/components/pusaka/admin/admin-dashboard";
import { AdminLoginDialog } from "@/components/pusaka/admin/admin-login-dialog";
import { useAdminStore } from "@/lib/admin-store";

export default function Home() {
  const status = useAdminStore((s) => s.status);
  const showAdmin = useAdminStore((s) => s.showAdmin);
  const init = useAdminStore((s) => s.init);

  // Cek sesi admin sekali saat app mount (GET /api/auth/me)
  useEffect(() => {
    init();
  }, [init]);

  // Mode CMS: saat terautentikasi & showAdmin aktif → render dashboard saja (hemat resource)
  if (status === "authed" && showAdmin) {
    return (
      <>
        <AdminDashboard />
        <AdminLoginDialog />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustMarquee />
        <QuickVerify />
        <Programs />
        <VerifySection />
        <Process />
        <Directory />
        <Experts />
        <StatsSection />
        <ApplicationForm />
        <TrackSection />
        <News />
        <FAQ />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
      <AdminLoginDialog />
    </div>
  );
}
