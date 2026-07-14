import PublicNavbar from '../components/layout/PublicNavbar.jsx';
import PublicFooter from '../components/layout/PublicFooter.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import StatsSection from '../components/landing/StatsSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx';
import BenefitsSection from '../components/landing/BenefitsSection.jsx';
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx';
import TrustBadgesSection from '../components/landing/TrustBadgesSection.jsx';
import FAQSection from '../components/landing/FAQSection.jsx';
import CTASection from '../components/landing/CTASection.jsx';

// Urutan section berikut mengikuti persis urutan frame di Figma:
// Hero -> Statistics -> Features & Bento -> How It Works -> Benefits
// -> Testimonials -> Trust Badges -> FAQ -> CTA Final
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TestimonialsSection />
        <TrustBadgesSection />
        <FAQSection />
        <CTASection />
      </main>

      <PublicFooter />
    </div>
  );
}
