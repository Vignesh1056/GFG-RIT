"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TeamSection } from "@/components/team-section"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Lightbulb, Award, Heart, Rocket } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

const objectives = [
  {
    icon: Target,
    title: "Skill Development",
    description: "Help students develop strong programming fundamentals and problem-solving skills through workshops, contests, and peer learning.",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Create a supportive environment where students can collaborate, share knowledge, and grow together.",
  },
  {
    icon: Lightbulb,
    title: "Industry Connect",
    description: "Bridge the gap between academia and industry through tech talks, mentorship, and internship opportunities.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Celebrate achievements and motivate students through leaderboards, certificates, and awards.",
  },
  {
    icon: Heart,
    title: "Open Source",
    description: "Encourage contribution to open source projects and building real-world applications.",
  },
  {
    icon: Rocket,
    title: "Career Growth",
    description: "Prepare students for technical interviews, internships, and successful careers in tech.",
  },
]

const timeline = [
  {
    year: "2022",
    title: "Club Founded",
    description: "GfG Campus Club RIT was established with a vision to create a coding community at Rajalakshmi Institute of Technology, Chennai.",
  },
  {
    year: "2023",
    title: "First CodeRush",
    description: "Launched our flagship coding competition with 200+ participants.",
  },
  {
    year: "2024",
    title: "500+ Members",
    description: "Grew to become one of the largest technical clubs at Rajalakshmi Institute of Technology.",
  },
  {
    year: "2025",
    title: "Industry Partnerships",
    description: "Partnered with leading tech companies for workshops and internships.",
  },
  {
    year: "2026",
    title: "Going Strong",
    description: "Continuing to empower students with skills for the future.",
  },
]

export default function AboutPage() {
  const [stats, setStats] = useState([
    { description: "Active Members", value: "500+" },
    { description: "Events Hosted", value: "50+" },
    { description: "Internships Secured", value: "120+" },
    { description: "Resources Shared", value: "200+" },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("stats").select("*").order("id", { ascending: true })
      if (data && data.length > 0) {
        setStats(data.map(d => ({
          description: d.description || d.label,
          value: d.value
        })))
      }
    }
    fetchStats()
  }, [])

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
        <motion.div 
          style={{ opacity, y }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              About Us
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
          >
            Empowering the Next Generation of{" "}
            <span className="text-primary">Tech Leaders</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            GeeksforGeeks Campus Club at Rajalakshmi Institute of Technology (RIT), Chennai is a student-run community dedicated to helping 
            fellow students excel in coding, problem-solving, and building successful tech careers.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 lg:px-8 bg-card/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Building a Community That Codes Together
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We believe that learning is more effective when done together. Our mission is to create 
                an inclusive environment where students of all skill levels can learn, practice, and 
                grow their technical abilities.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Through regular workshops, coding contests, and industry connections, we prepare 
                students not just for interviews, but for successful careers in technology.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                  <div className="text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Our Objectives
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What We Aim to Achieve
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {objectives.map((objective, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                key={objective.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
              >
                <div className="inline-flex rounded-xl bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                  <objective.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{objective.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {objective.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 lg:px-8 bg-card/50 overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Our Journey
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Growing Together Since 2022
            </h2>
          </motion.div>
          <div className="relative">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" 
            />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <motion.div 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                  >
                    <div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                      <div className="text-2xl font-bold text-primary">{item.year}</div>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                  <div className="hidden md:flex items-center justify-center z-10">
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="h-4 w-4 rounded-full bg-primary border-4 border-background" 
                    />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamSection />
      <Footer />
    </main>
  )
}
