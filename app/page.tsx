// app/page.tsx
import CTA from '@/components/landing-page/CTA'
import Features from '@/components/landing-page/Features'
import Footer from '@/components/landing-page/Footer'
import Hero from '@/components/landing-page/Hero'
import HowItWorks from '@/components/landing-page/HowItWorks'
import Stats from '@/components/landing-page/Stats'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}