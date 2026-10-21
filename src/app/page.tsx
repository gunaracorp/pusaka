"use client";

import { useEffect } from "react";
import { TopTicker } from "@/components/pusaka/top-ticker";
import { SakaChat } from "@/components/pusaka/saka-chat";
import { Navbar } from "@/components/pusaka/navbar";
import { Hero } from "@/components/pusaka/hero";
import { TrustMarquee } from "@/components/pusaka/trust-marquee";
import { QuickVerify } from "@/components/pusaka/quick-verify";
import { Programs } from "@/components/pusaka/programs";
import { ServicesCatalog } from "@/components/pusaka/services-catalog";
import { GlobalNetwork } from "@/components/pusaka/global-network";
import { VerifySection } from "@/components/pusaka/verify-section";
import { Process } from "@/components/pusaka/process";
import { TutorialHub } from "@/components/pusaka/tutorial-hub";
import { Directory } from "@/components/pusaka/directory";
import { Experts } from "@/components/pusaka/experts";
import { FounderSection } from "@/components/pusaka/founder-section";
import { StatsSection } from "@/components/pusaka/stats-section";
import { ApplicationForm } from "@/components/pusaka/application-form";
import { TrackSection } from "@/components/pusaka/track";
import { News } from "@/components/pusaka/news";
import { FAQ } from "@/components/pusaka/faq";
import { Testimonials } from "@/components/pusaka/testimonials";
import { PartnerSites } from "@/components/pusaka/partner-sites";
import { ContactCTA } from "@/components/pusaka/contact";
import { Footer } from "@/components/pusaka/footer";
import { MemberPortal } from "@/components/pusaka/member-portal";
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
      <TopTicker />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustMarquee />
        <QuickVerify />
        <Programs />
        <ServicesCatalog />
        <GlobalNetwork />
        <VerifySection />
        <Process />
        <TutorialHub />
        <Directory />
        <Experts />
        <FounderSection />
        <StatsSection />
        <ApplicationForm />
        <TrackSection />
        <News />
        <FAQ />
        <Testimonials />
        <PartnerSites />
        <ContactCTA />
      </main>
      <Footer />
      <SakaChat />
      <MemberPortal />
      <AdminLoginDialog />
    </div>
  );
}
