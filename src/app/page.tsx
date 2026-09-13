"use client";

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

export default function Home() {
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
    </div>
  );
}
