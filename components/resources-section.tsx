import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Lightbulb, BookOpen, Target, FileCode, Zap } from "lucide-react"

const resources = [
  {
    icon: Code,
    title: "DSA Practice",
    description: "Curated problems from easy to hard with video explanations and solutions.",
    link: "/resources#dsa",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileCode,
    title: "Coding Mastery",
    description: "120+ challenges broken down into Warm-up Quests to Grandmaster Trials.",
    link: "/resources#sheets",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Lightbulb,
    title: "Interview Prep",
    description: "Company-specific questions, mock interviews, and resume reviews.",
    link: "/resources#interview",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Target,
    title: "Learning Paths",
    description: "Structured roadmaps for Web Dev, DSA, ML/AI, and competitive programming.",
    link: "/resources#paths",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: BookOpen,
    title: "Study Materials",
    description: "Notes, slides, and recordings from all our workshops and sessions.",
    link: "/resources#materials",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Zap,
    title: "Quick Tips",
    description: "Daily coding tips, tricks, and best practices shared by our community.",
    link: "/blog",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
  },
]

export function ResourcesSection() {
  return (
    <section className="py-24 bg-card/50 backdrop-blur-xl/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Learning Resources
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Excel
          </h2>
          <p className="mt-4 text-muted-foreground">
            Access curated resources, practice problems, and learning materials to accelerate your coding journey.
          </p>
        </div>

        {/* Resources grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.link}
              className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`inline-flex rounded-xl ${resource.bgColor} p-3 mb-4`}>
                <resource.icon className={`h-6 w-6 ${resource.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {resource.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-primary">
                Explore
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/resources">
              Browse All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
