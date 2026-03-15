"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sections = [
  {
    title: "DSA",
    description: "Top data structures & algorithms interview resources.",
    links: [
      { label: "GFG 160", url: "https://www.geeksforgeeks.org/courses/gfg-160-series" },
    ],
  },
  {
    title: "LLD & HLD",
    description: "Low-level and high-level design interview guides.",
    links: [
      { label: "System Design Tutorial", url: "https://www.geeksforgeeks.org/system-design/system-design-tutorial/" },
      { label: "Design Patterns Interview Questions", url: "https://www.geeksforgeeks.org/system-design/top-design-patterns-interview-questions/" },
    ],
  },
  {
    title: "DevOps",
    description: "Cloud & infrastructure interview prep resources.",
    links: [
      { label: "DevOps Interview Questions", url: "https://www.geeksforgeeks.org/devops/devops-interview-questions/" },
      { label: "AWS Interview Questions", url: "https://www.geeksforgeeks.org/cloud-computing/aws-interview-questions/" },
      { label: "GCP Interview Questions", url: "https://www.geeksforgeeks.org/devops/google-cloud-platform-interview-questions/" },
    ],
  },
  {
    title: "Interview Experiences",
    description: "Real candidate stories and tips.",
    links: [
      { label: "Interview Experiences", url: "https://www.geeksforgeeks.org/category/experiences/interview-experiences/" },
    ],
  },
  {
    title: "Web Development",
    description: "Full stack interview question collections.",
    links: [
      { label: "Full Stack Interview Questions", url: "https://www.geeksforgeeks.org/html/full-stack-developer-interview-questions-and-answers/" },
    ],
  },
  {
    title: "Aptitude & Puzzles",
    description: "Common aptitude and puzzle questions asked in interviews.",
    links: [
      { label: "Aptitude Questions and Answers", url: "https://www.geeksforgeeks.org/aptitude/aptitude-questions-and-answers/" },
      { label: "Puzzles for Interviews", url: "https://www.geeksforgeeks.org/aptitude/puzzles/" },
    ],
  },
  {
    title: "Computer Subjects",
    description: "Core computer science interview prep resources.",
    links: [
      { label: "CS Core Subjects", url: "https://www.geeksforgeeks.org/courses/cs-core-subjects-skill-up" },
    ],
  },
  {
    title: "Python",
    description: "Python interview question collections.",
    links: [
      { label: "Python Interview Questions", url: "https://www.geeksforgeeks.org/python/python-interview-questions/" },
    ],
  },
  {
    title: "Data Science & ML",
    description: "Data science and machine learning interview prep.",
    links: [
      { label: "Data Science Interview Questions", url: "https://www.geeksforgeeks.org/data-science/data-science-interview-questions-and-answers/" },
      { label: "Data Science Coding Interview Questions", url: "https://www.geeksforgeeks.org/data-science/data-science-coding-interview-questions/" },
      { label: "Machine Learning Interview Questions", url: "https://www.geeksforgeeks.org/machine-learning/machine-learning-interview-questions/" },
    ],
  },
  {
    title: "Data Analytics",
    description: "Interview prep for data analyst roles.",
    links: [
      { label: "Data Analyst Interview Questions", url: "https://www.geeksforgeeks.org/data-analysis/data-analyst-interview-questions-and-answers/" },
    ],
  },
  {
    title: "Software Testing",
    description: "Testing & QA interview resources.",
    links: [
      { label: "Software Testing Interview Questions", url: "https://www.geeksforgeeks.org/software-testing/software-testing-interview-questions/" },
    ],
  },
  {
    title: "Mobile App (Android)",
    description: "Android interview question collections.",
    links: [
      { label: "Android Interview Questions", url: "https://www.geeksforgeeks.org/android/top-50-android-interview-questions-answers-sde-i-to-sde-iii/" },
    ],
  },
]

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Interview Corner</h1>
            <p className="mt-3 text-base text-muted-foreground max-w-2xl">
              Your one-stop hub for interview prep resources across DSA, design, web, cloud, data science, and more.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Card key={section.title} className="bg-card border-border">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <div className="space-y-2">
                    {section.links.map((link) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:bg-primary/10"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
