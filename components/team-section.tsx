"use client"

import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail } from "lucide-react"
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

const team = [
  {
    name: "Praveen",
    role: "Club President",
    year: "4th Year, CSE",
    image: "/team/president.jpg",
    bio: "Passionate about competitive programming and mentoring students.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "rahul@rit.edu",
    },
  },
  {
    name: "Pranesh",
    role: "Vice President",
    year: "4th Year, IT",
    image: "/team/vp.jpg",
    bio: "Web development enthusiast and open source contributor.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "priya@rit.edu",
    },
  },
  {
    name: "Sanjai",
    role: "Technical Lead",
    year: "3rd Year, CSE",
    image: "/team/tech-lead.jpg",
    bio: "DSA expert with multiple contest wins and internship experience.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "amit@rit.edu",
    },
  },
  {
    name: "Mugunthan",
    role: "Event Coordinator",
    year: "3rd Year, ECE",
    image: "/team/events.jpg",
    bio: "Organizing workshops and building the community one event at a time.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "sneha@rit.edu",
    },
  },
]

export function TeamSection() {
  return (
    <section className="py-24 bg-background/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Our Team
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Meet the Core Team
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dedicated students working together to build a thriving coding community at RIT.
          </p>
        </motion.div>

        {/* Team grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {team.map((member) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              key={member.name}
              className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 text-center shadow-sm transition-colors hover:border-primary/50"
            >
              {/* Avatar */}
              <div className="relative mx-auto mb-4 h-24 w-24 rounded-full bg-secondary overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm font-medium text-primary mt-1">{member.role}</p>
              <p className="text-xs text-muted-foreground mt-1">{member.year}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>

              {/* Social links */}
              <div className="mt-4 flex justify-center gap-3">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={`mailto:${member.social.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
