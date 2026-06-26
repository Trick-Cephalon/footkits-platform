import { HeroSection } from '@/components/home/HeroSection'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeaturedTeams } from '@/components/home/FeaturedTeams'
import { SocialProof } from '@/components/home/SocialProof'
import { CTASection } from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedTeams />
      <SocialProof />
      <CTASection />
    </>
  )
}
