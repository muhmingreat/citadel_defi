'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { MainHeader } from '@/components/navigation/main-header';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <>
      <MainHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </>
  );
}
