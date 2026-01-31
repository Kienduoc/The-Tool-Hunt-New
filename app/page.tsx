import HeroSection from '@/components/home/HeroSection'
import FeatureCards from '@/components/home/FeatureCards'
import WorkflowSection from '@/components/home/WorkflowSection'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureCards />
      <WorkflowSection />
    </div>
  )
}
