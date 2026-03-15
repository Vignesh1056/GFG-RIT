"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Star, TrendingUp, Calendar, Code, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"

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

interface LeaderboardEntry {
  rank: number
  name: string
  email: string
  points: number
  solved: number
  events: number
  badge: string
}

const contestWinners = [
  {
    contest: "CodeRush 3.0",
    date: "March 2026",
    winners: [
      { position: 1, name: "Aditya Kumar", prize: "₹10,000" },
      { position: 2, name: "Sneha Sharma", prize: "₹7,000" },
      { position: 3, name: "Rahul Verma", prize: "₹5,000" },
    ],
  },
  {
    contest: "DSA Marathon",
    date: "February 2026",
    winners: [
      { position: 1, name: "Priya Patel", prize: "₹8,000" },
      { position: 2, name: "Vikram Rao", prize: "₹5,000" },
      { position: 3, name: "Amit Singh", prize: "₹3,000" },
    ],
  },
  {
    contest: "Web Dev Challenge",
    date: "January 2026",
    winners: [
      { position: 1, name: "Kavya Reddy", prize: "₹8,000" },
      { position: 2, name: "Ananya Gupta", prize: "₹5,000" },
      { position: 3, name: "Rohit Joshi", prize: "₹3,000" },
    ],
  },
]

const achievements = [
  {
    title: "Diamond Coder",
    description: "Earned 2500+ points through consistent participation",
    icon: Trophy,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    holders: 2,
  },
  {
    title: "Platinum Performer",
    description: "Earned 2000-2499 points",
    icon: Medal,
    color: "text-slate-300",
    bgColor: "bg-slate-400/10",
    holders: 2,
  },
  {
    title: "Gold Champion",
    description: "Earned 1500-1999 points",
    icon: Award,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    holders: 3,
  },
  {
    title: "Contest Victor",
    description: "Won at least one coding contest",
    icon: Trophy,
    color: "text-primary",
    bgColor: "bg-primary/10",
    holders: 12,
  },
  {
    title: "Streak Master",
    description: "Maintained a 30+ day coding streak",
    icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    holders: 8,
  },
  {
    title: "Event Enthusiast",
    description: "Attended 20+ club events",
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    holders: 15,
  },
  {
    title: "Problem Solver",
    description: "Solved 500+ DSA problems",
    icon: Code,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    holders: 6,
  },
  {
    title: "Mentor",
    description: "Helped 10+ students in their coding journey",
    icon: Target,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    holders: 10,
  },
]

const badgeColors: Record<string, string> = {
  Diamond: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Platinum: "bg-slate-400/10 text-slate-300 border-slate-400/20",
  Gold: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Silver: "bg-gray-400/10 text-gray-400 border-gray-400/20",
}

const positionColors: Record<number, string> = {
  1: "text-amber-400",
  2: "text-slate-300",
  3: "text-amber-600",
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient()

      // Get solved counts per user
      const { data: solvedData } = await supabase
        .from("solved_problems")
        .select("user_id")

      // Get all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")

      // Get event registration counts per email
      const { data: eventData } = await supabase
        .from("event_registrations")
        .select("email")

      if (!profiles) { setIsLoading(false); return }

      // Count solved per user_id
      const solvedCount: Record<string, number> = {}
      for (const row of solvedData ?? []) {
        solvedCount[row.user_id] = (solvedCount[row.user_id] || 0) + 1
      }

      // Count events per email
      const eventCount: Record<string, number> = {}
      for (const row of eventData ?? []) {
        eventCount[row.email] = (eventCount[row.email] || 0) + 1
      }

      const getBadge = (points: number) => {
        if (points >= 2500) return "Diamond"
        if (points >= 2000) return "Platinum"
        if (points >= 1500) return "Gold"
        if (points >= 500) return "Silver"
        return "Bronze"
      }

      const entries: LeaderboardEntry[] = profiles
        .map((p) => {
          const solved = solvedCount[p.id] || 0
          const events = eventCount[p.email ?? ""] || 0
          const points = solved * 100 + events * 50
          return {
            rank: 0,
            name: p.full_name || p.email?.split("@")[0] || "Anonymous",
            email: p.email ?? "",
            points,
            solved,
            events,
            badge: getBadge(points),
          }
        })
        .filter((e) => e.points > 0)
        .sort((a, b) => b.points - a.points)
        .map((e, i) => ({ ...e, rank: i + 1 }))

      setLeaderboardData(entries)
      setIsLoading(false)
    }

    fetchLeaderboard()
  }, [])

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
              Community
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
          >
            Leaderboard &{" "}
            <span className="text-primary">Achievements</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Celebrating our top performers and their accomplishments.
          </motion.p>
        </motion.div>
      </section>

      {/* Top 3 Spotlight */}
      <section className="px-6 lg:px-8 pb-8">
        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground text-sm">Loading leaderboard...</motion.div>
          ) : leaderboardData.length < 3 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground text-sm">Not enough data yet. Start solving problems to appear here!</motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 gap-4"
            >
              {/* Second Place */}
              <motion.div variants={itemVariants} className="order-1 pt-8">
                <div className="relative rounded-2xl border border-border bg-card p-6 text-center hover:border-slate-400/50 transition-colors">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/20 text-slate-300 font-bold">2</div>
                  </div>
                  <div className="mx-auto mt-2 h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary">
                    {leaderboardData[1].name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">{leaderboardData[1].name}</h3>
                  <p className="text-2xl font-bold text-slate-300">{leaderboardData[1].points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </motion.div>
              {/* First Place */}
              <motion.div variants={itemVariants} className="order-2">
                <div className="relative rounded-2xl border-2 border-amber-400/50 bg-card p-6 text-center scale-105 shadow-xl shadow-amber-500/10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20">
                      <Trophy className="h-5 w-5 text-amber-400" />
                    </div>
                  </div>
                  <div className="mx-auto mt-2 h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-primary">
                    {leaderboardData[0].name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground text-lg">{leaderboardData[0].name}</h3>
                  <p className="text-3xl font-bold text-amber-400">{leaderboardData[0].points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                  <Badge variant="outline" className="mt-2 border-amber-400/30 text-amber-400">Champion</Badge>
                </div>
              </motion.div>
              {/* Third Place */}
              <motion.div variants={itemVariants} className="order-3 pt-12">
                <div className="relative rounded-2xl border border-border bg-card p-6 text-center hover:border-amber-600/50 transition-colors">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/20 text-amber-600 font-bold">3</div>
                  </div>
                  <div className="mx-auto mt-2 h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary">
                    {leaderboardData[2].name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">{leaderboardData[2].name}</h3>
                  <p className="text-2xl font-bold text-amber-600">{leaderboardData[2].points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border">
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Full Leaderboard
              </TabsTrigger>
              <TabsTrigger value="contests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="h-4 w-4 mr-2" />
                Contest Winners
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Star className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Points = problems solved × 100 + events attended × 50</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
                  ) : leaderboardData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No data yet. Be the first to solve a problem!</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border text-sm text-muted-foreground">
                            <th className="py-3 px-4 text-left">Rank</th>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Badge</th>
                            <th className="py-3 px-4 text-right">Points</th>
                            <th className="py-3 px-4 text-right">Solved</th>
                            <th className="py-3 px-4 text-right">Events</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboardData.map((user) => (
                            <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: user.rank * 0.05 }}
                              key={user.rank} 
                              className="border-b border-border/50 hover:bg-secondary/50 transition-colors group"
                            >
                              <td className="py-4 px-4">
                                <span className={`font-bold transition-transform group-hover:scale-110 inline-block ${positionColors[user.rank] || "text-foreground"}`}>#{user.rank}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary">
                                    {user.name.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <span className="font-medium text-foreground">{user.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant="outline" className={badgeColors[user.badge]}>{user.badge}</Badge>
                              </td>
                              <td className="py-4 px-4 text-right font-semibold text-primary">{user.points}</td>
                              <td className="py-4 px-4 text-right text-muted-foreground">{user.solved}</td>
                              <td className="py-4 px-4 text-right text-muted-foreground">{user.events}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="contests" className="space-y-6">
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6">
              {contestWinners.map((contest) => (
                <motion.div variants={itemVariants} key={contest.contest}>
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{contest.contest}</CardTitle>
                      <Badge variant="secondary">{contest.date}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {contest.winners.map((winner) => (
                        <div
                          key={winner.position}
                          className="flex items-center gap-4 rounded-xl border border-border bg-secondary/30 p-4"
                        >
                          <div className={`text-2xl font-bold ${positionColors[winner.position]}`}>
                            {winner.position === 1 ? <Trophy className="h-6 w-6" /> : `#${winner.position}`}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{winner.name}</p>
                            <p className="text-sm text-primary">{winner.prize}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="achievements">
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement) => (
                  <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={achievement.title} className="h-full">
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full flex flex-col shadow-sm">
                    <CardHeader>
                      <div className={`inline-flex rounded-xl ${achievement.bgColor} p-3 w-fit mb-2`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{achievement.holders}</span> members earned this
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
