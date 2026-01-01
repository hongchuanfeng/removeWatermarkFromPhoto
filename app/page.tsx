import Hero from '@/components/Hero'
import RemoveWatermarkInline from '@/components/RemoveWatermarkInline'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import UseCases from '@/components/UseCases'
import SubscriptionPlans from '@/components/SubscriptionPlans'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <RemoveWatermarkInline />
      <Features />
      <HowItWorks />
      <UseCases />
      <SubscriptionPlans />
      <FAQ />
      <CTA />
    </div>
  )
}
