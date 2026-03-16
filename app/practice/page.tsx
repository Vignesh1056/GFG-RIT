"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Target, CheckCircle2, Circle, Filter, Trophy, Flame } from "lucide-react"
import { motion } from "framer-motion"

import { problems, categories } from "@/lib/problems"

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
import { createClient } from "@/lib/supabase/client"
import { getSolvedProblemIds } from "@/lib/supabase/solved"

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
  Expert: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <Suspense fallback={<div className="pt-28 pb-12 px-6 text-center text-muted-foreground">Loading...</div>}>
        <PracticeContent />
      </Suspense>
      <Footer />
    </main>
  )
}

function PracticeContent() {
  const searchParams = useSearchParams()
  const initialTopic = searchParams.get("topic") || ""

  const [searchQuery, setSearchQuery] = useState(initialTopic)
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [streak, setStreak] = useState(0)
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const ids = await getSolvedProblemIds(data.user.id)
        setSolvedIds(ids)
      }
    })
  }, [])

  useEffect(() => {
    try {
      const today = new Date().toDateString()
      const stored = localStorage.getItem("gfg_streak")
      const data = stored ? JSON.parse(stored) : { streak: 0, lastVisit: "" }

      const last = new Date(data.lastVisit)
      const now = new Date(today)
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

      let newStreak = data.streak
      if (data.lastVisit === today) {
        newStreak = data.streak
      } else if (diffDays === 1) {
        newStreak = data.streak + 1
      } else if (diffDays > 1) {
        newStreak = 1
      } else {
        newStreak = 1
      }

      localStorage.setItem("gfg_streak", JSON.stringify({ streak: newStreak, lastVisit: today }))
      setStreak(newStreak)
    } catch {
      setStreak(1)
    }
  }, [])

  useEffect(() => {
    if (initialTopic) {
      setSearchQuery(initialTopic)
      setSelectedCategory("All")
    }
  }, [initialTopic])

  const filteredProblems = problems.filter((problem) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      problem.title.toLowerCase().includes(searchLower) ||
      problem.topics.some((t) => t.toLowerCase().includes(searchLower))
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty.toLowerCase() === selectedDifficulty
    const matchesCategory = selectedCategory === "All" || problem.categoryName === selectedCategory
    const isSolved = solvedIds.has(problem.id)
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "solved" && isSolved) ||
      (selectedStatus === "unsolved" && !isSolved)
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus
  })

  const cat1 = problems.filter((p) => p.categoryName === "Warm-up Quests")
  const cat2 = problems.filter((p) => p.categoryName === "Rookie Challenges")
  const cat3 = problems.filter((p) => p.categoryName === "Elite Algorithms")
  const cat4 = problems.filter((p) => p.categoryName === "Grandmaster Trials")

  return (
    <section className="pt-28 pb-12 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">DSA Mastery</h1>
            <p className="mt-2 text-muted-foreground">Level up your skills across curated challenges.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
              <Flame className="h-4 w-4 mr-1" />
              {streak} Day Streak
            </Badge>
            <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">
              <Trophy className="h-4 w-4 mr-1" />
              {solvedIds.size} Solved
            </Badge>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card
            className={`border-border cursor-pointer transition-colors hover:border-primary/50 ${
              selectedCategory === "Warm-up Quests" ? "ring-2 ring-primary" : "bg-card/50 backdrop-blur-xl"
            }`}
            onClick={() => setSelectedCategory(selectedCategory === "Warm-up Quests" ? "All" : "Warm-up Quests")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Warm-up Quests</p>
                  <p className="text-xs text-muted-foreground">{cat1.length} Challenges (Easy)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card
            className={`border-border cursor-pointer transition-colors hover:border-primary/50 ${
              selectedCategory === "Rookie Challenges" ? "ring-2 ring-primary" : "bg-card/50 backdrop-blur-xl"
            }`}
            onClick={() => setSelectedCategory(selectedCategory === "Rookie Challenges" ? "All" : "Rookie Challenges")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Target className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Rookie Challenges</p>
                  <p className="text-xs text-muted-foreground">{cat2.length} Challenges (Medium)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card
            className={`border-border cursor-pointer transition-colors hover:border-primary/50 ${
              selectedCategory === "Elite Algorithms" ? "ring-2 ring-primary" : "bg-card/50 backdrop-blur-xl"
            }`}
            onClick={() => setSelectedCategory(selectedCategory === "Elite Algorithms" ? "All" : "Elite Algorithms")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Target className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Elite Algorithms</p>
                  <p className="text-xs text-muted-foreground">{cat3.length} Challenges (Hard)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card
            className={`border-border cursor-pointer transition-colors hover:border-primary/50 ${
              selectedCategory === "Grandmaster Trials" ? "ring-2 ring-primary" : "bg-card/50 backdrop-blur-xl"
            }`}
            onClick={() => setSelectedCategory(selectedCategory === "Grandmaster Trials" ? "All" : "Grandmaster Trials")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Grandmaster Trials</p>
                  <p className="text-xs text-muted-foreground">{cat4.length} Challenges (Expert)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-xl border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px] bg-background border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[130px] bg-background border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                    <SelectItem value="unsolved">Unsolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 border border-border bg-card/50 backdrop-blur-xl"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            <Card className="bg-card/50 backdrop-blur-xl border-border overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/30 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-4 lg:col-span-5">Title</div>
                  <div className="col-span-3 text-center hidden sm:block">Topic</div>
                  <div className="col-span-2 text-center">Difficulty</div>
                  <div className="col-span-2 text-center hidden lg:block">Acceptance</div>
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                {filteredProblems.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No problems found matching your criteria.
                  </div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-border"
                  >
                    {filteredProblems.map((problem) => (
                      <motion.div variants={itemVariants} key={problem.id}>
                      <Link
                        href={`/practice/${problem.id}`}
                        className="grid grid-cols-12 gap-4 py-4 px-4 items-center hover:bg-muted/50 transition-colors"
                      >
                        <div className="col-span-1 flex justify-center">
                          {solvedIds.has(problem.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="col-span-4 lg:col-span-5">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">{problem.id}.</span>
                            <span className="font-medium text-foreground hover:text-primary transition-colors">
                              {problem.title}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-3 text-center hidden sm:block">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {problem.topics.slice(0, 3).map((topic: string) => (
                              <Badge key={topic} variant="secondary" className="text-xs px-2 py-0">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Badge className={`text-xs ${difficultyColors[problem.difficulty]}`}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="col-span-2 text-center text-sm text-muted-foreground hidden lg:block">
                          {problem.acceptance}
                        </div>
                      </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
