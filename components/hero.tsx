"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, Trophy, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const defaultStats = [
  { label: "Active Members", value: "500+", icon: Users },
  { label: "Events Hosted", value: "50+", icon: Calendar },
  { label: "Contest Winners", value: "120+", icon: Trophy },
  { label: "Resources", value: "200+", icon: BookOpen },
]

export function Hero() {
  const [stats, setStats] = useState(defaultStats)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("stats").select("*").order("id", { ascending: true })
      if (data && data.length > 0) {
        const iconMap: Record<string, any> = {
          "Users": Users,
          "Calendar": Calendar,
          "Trophy": Trophy,
          "BookOpen": BookOpen
        }
        setStats(data.map(d => ({
          label: d.label,
          value: d.value,
          icon: iconMap[d.icon_name] || Users
        })))
      }
    }
    fetchStats()
  }, [])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Welcome to GeeksforGeeks Campus Club
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance"
          >
            Code. Learn.{" "}
            <span className="text-primary">Grow Together.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Join RIT&apos;s most active coding community. Master DSA, participate in contests, 
            land dream internships, and build lifelong connections with fellow developers at Rajalakshmi Institute of Technology, Chennai.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 group" asChild>
              <Link href="/events">
                Explore Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary" asChild>
              <Link href="/about">
                Learn More About Us
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card"
              >
                <div className="flex flex-col items-center">
                  <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                    <stat.icon className="h-6 w-6 text-primary mb-3" />
                  </motion.div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-14 w-8 rounded-full border-2 border-muted-foreground/30 p-1">
          <div className="h-3 w-1.5 mx-auto rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
