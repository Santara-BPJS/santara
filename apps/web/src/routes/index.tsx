import { createFileRoute } from "@tanstack/react-router";
import BenefitsSection from "../features/home/sections/benefits-section";
import ContactSection from "../features/home/sections/contact-section";
import Footer from "../shared/components/footer";
import HeroSection from "../features/home/sections/hero-section";
import IntegrationsSection from "../features/home/sections/integrations-section";
import SecuritySection from "../features/home/sections/security-section";
import TestimonialsSection from "../features/home/sections/testimonials-section";
import TrustSection from "../features/home/sections/trust-section";
import Header from "../shared/components/header";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main>
      <Header />
      <HeroSection />
      <TrustSection />
      <BenefitsSection />
      <IntegrationsSection />
      <SecuritySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
