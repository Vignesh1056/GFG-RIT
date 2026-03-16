import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TeamSection } from "@/components/team-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <Hero />
      <TeamSection />
      <CTASection />
      <Footer />
    </main>
  )
}
