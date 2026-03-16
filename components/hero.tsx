"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Calendar, Trophy, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"


const defaultStats = [
  { label: "Active Members", value: "500+", icon: Users },
  { label: "Events Hosted", value: "50+", icon: Calendar },
  { label: "Contest Winners", value: "120+", icon: Trophy },
  { label: "Resources", value: "200+", icon: BookOpen },
]

const WORDS = ["Code", "Build", "Learn", "Compete", "Grow"]

function Typewriter() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [deleting, setDeleting] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const word = WORDS[wordIndex]
    if (!deleting && displayed === word) {
      timeout.current = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed === "") {
      setDeleting(false)
      setWordIndex(i => (i + 1) % WORDS.length)
    } else {
      timeout.current = setTimeout(() => {
        setDisplayed(deleting ? word.slice(0, displayed.length - 1) : word.slice(0, displayed.length + 1))
      }, deleting ? 60 : 100)
    }
    return () => clearTimeout(timeout.current)
  }, [displayed, deleting, wordIndex])

  return (
    <span className="text-primary">
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 align-middle animate-pulse" />
    </span>
  )
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let animId: number
    let W = 0, H = 0

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; opacity: number }
    let particles: Particle[] = []

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      const sideWidth = W * 0.28
      particles = Array.from({ length: 130 }, (_, i) => {
        // first 60 on left side, next 60 on right side, rest spread full width
        let x: number
        if (i < 43) x = Math.random() * sideWidth
        else if (i < 86) x = W - Math.random() * sideWidth
        else x = Math.random() * W
        return {
          x,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 1.2 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
        }
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(22,163,74,${p.opacity})`
        ctx.fill()

        for (const q of particles) {
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(22,163,74,${0.4 * (1 - dist / 150)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // mouse grab
        const mx = mouse.current.x, my = mouse.current.y
        const mdx = p.x - mx, mdy = p.y - my
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 200) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(22,163,74,${0.9 * (1 - mdist / 200)})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const onResize = () => resize()
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top + window.scrollY }
    }
    const onMouseLeave = () => { mouse.current = { x: -9999, y: -9999 } }

    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseleave", onMouseLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
}

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
      <ParticleBackground />
      
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
            <Typewriter />{" Together."}
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
                className="group relative rounded-2xl glass p-6 transition-all hover:border-primary/50 hover:shadow-primary/10 hover:shadow-lg"
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="h-14 w-8 rounded-full border-2 border-muted-foreground/30 p-1">
          <div className="h-3 w-1.5 mx-auto rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  )
}
