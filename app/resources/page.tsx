"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Code, FileCode, Target, Star, Play } from "lucide-react"
import { motion } from "framer-motion"

import { problems } from "@/lib/problems"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

const dsaResources = [
  {
    title: "Warm-up Quests",
    description: "Start here to build your foundation. Easy problems focusing on basic syntax and data structures.",
    link: "/practice",
    difficulty: "Easy",
    topics: ["Array", "Math", "String"],
  },
  {
    title: "Rookie Challenges",
    description: "Step up your game with medium-level problems requiring better algorithms and optimization.",
    link: "/practice",
    difficulty: "Medium",
    topics: ["Linked List", "Stack", "Two Pointers"],
  },
  {
    title: "Elite Algorithms",
    description: "Hard problems designed to test your mastery of complex data structures and efficiency.",
    link: "/practice",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "Trees", "Graphs"],
  },
  {
    title: "Grandmaster Trials",
    description: "The ultimate test. Expert-level problems for those preparing for top-tier competitive programming.",
    link: "/practice",
    difficulty: "Expert",
    topics: ["Backtracking", "Binary Search", "Trie"],
  },
]


const learningPaths = [
  {
    title: "DSA Roadmap",
    description: "Complete guide from basics to advanced data structures and algorithms.",
    duration: "3-6 months",
    topics: ["Time Complexity", "Arrays", "Strings", "Trees", "Graphs", "DP"],
    level: "Beginner to Advanced",
  },
  {
    title: "Web Development",
    description: "Full-stack web development with modern technologies.",
    duration: "4-6 months",
    topics: ["String", "Math", "Stack", "Trees"], // Mapped to our pseudo-generated topics
    level: "Beginner to Intermediate",
  },
  {
    title: "Competitive Programming",
    description: "Master problem-solving for coding competitions.",
    duration: "6-12 months",
    topics: ["Array", "Math", "Number Theory", "Binary Search"],
    level: "Intermediate to Advanced",
  },
  {
    title: "Machine Learning",
    description: "Introduction to ML concepts and practical implementation.",
    duration: "3-4 months",
    topics: ["Math", "Data Structures", "Dynamic Programming"], // Mapped to pseudo-topics
    level: "Intermediate",
  },
]


const difficultyColors: Record<string, string> = {
  "Easy": "bg-green-500/10 text-green-500",
  "Medium": "bg-amber-500/10 text-amber-500",
  "Hard": "bg-red-500/10 text-red-500",
  "Expert": "bg-purple-500/10 text-purple-500",
}

const SECTION_LINKS = [
  {
    title: "DSA",
    description: "Core data structures & algorithms interview resources.",
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

function InterviewPrepTab() {
  const [lastVisit, setLastVisit] = useState<string>(() => {
    try {
      return localStorage.getItem("gfg_interview_corner_last_visit") || ""
    } catch {
      return ""
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("gfg_interview_corner_last_visit", new Date().toISOString())
      setLastVisit(new Date().toISOString())
    } catch {
      // ignore
    }
  }, [])

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h2 className="text-2xl font-bold text-foreground">Interview Corner</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          A curated collection of top interview resources across DSA, design, cloud, web, data science, and more.
        </p>
        {lastVisit && (
          <p className="text-xs text-muted-foreground">Last visited: {new Date(lastVisit).toLocaleString()}</p>
        )}
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {SECTION_LINKS.map((section) => (
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={section.title} className="h-full">
          <Card className="bg-card border-border h-full flex flex-col">
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("dsa")

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-8 px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Learning Resources
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
          >
            Everything You Need to{" "}
            <span className="text-primary">Excel in Tech</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Curated resources, practice problems, and learning materials to accelerate your journey.
          </motion.p>
        </motion.div>
      </section>

      {/* Resources Tabs */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border">
              <TabsTrigger value="dsa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Code className="h-4 w-4 mr-2" />
                DSA Practice
              </TabsTrigger>
              <TabsTrigger value="paths" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="h-4 w-4 mr-2" />
                Learning Paths
              </TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileCode className="h-4 w-4 mr-2" />
                Interview Prep
              </TabsTrigger>

            </TabsList>

            <TabsContent value="dsa" className="space-y-6">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2"
              >
                {dsaResources.map((resource) => (
                  <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={resource.title} className="h-full">
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={difficultyColors[resource.difficulty]}>
                          {resource.difficulty}
                        </Badge>
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                        <Link href={resource.link}>
                          Start Practicing
                          <Play className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="paths" className="space-y-6">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2"
              >
                {learningPaths.map((path) => {
                  // Calculate dynamic progress
                  const pathProblems = problems.filter(p => p.topics.some(t => path.topics.includes(t)));
                  const solvedProblems = pathProblems.filter(p => p.solved).length;
                  const totalProblems = pathProblems.length;
                  const progressPercentage = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

                  return (
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={path.title} className="h-full">
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full flex flex-col">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {path.duration}
                          </Badge>
                          <Badge variant="secondary">{path.level}</Badge>
                        </div>
                        <CardTitle className="text-xl">{path.title}</CardTitle>
                        <CardDescription>{path.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between pt-0">
                        <div>
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-foreground">Course Progress</span>
                              <span className="text-sm font-medium text-muted-foreground">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2 bg-secondary" />
                            <p className="text-xs text-muted-foreground mt-2">
                              {solvedProblems} / {totalProblems} problems completed
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium text-foreground mb-2">Skill Nodes:</p>
                            <div className="flex flex-wrap gap-2">
                              {path.topics.map((topic) => (
                                <Link key={topic} href={`/practice?topic=${topic}`}>
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                  >
                                    {topic}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 mt-4" asChild>
                          <Link href={`/practice?topic=${path.topics[0]}`}>
                            Continue Learning
                            <Play className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            </TabsContent>

            <TabsContent value="interview">
              <InterviewPrepTab />
            </TabsContent>


          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
