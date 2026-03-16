"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram, MessageSquare, Send, CheckCircle } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "gfg@ritchennai.edu.in",
    link: "mailto:gfg@ritchennai.edu.in",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 98765 43210",
    link: "tel:+919876543210",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Rajalakshmi Institute of Technology, Chennai",
    link: "#",
  },
]

const socialLinks = [
  { name: "GitHub", icon: Github, link: "https://github.com/gfg-rit", color: "hover:text-foreground" },
  { name: "LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/in/gfg-rit/", color: "hover:text-blue-400" },
  { name: "Twitter", icon: Twitter, link: "https://twitter.com/gfg_rit", color: "hover:text-cyan-400" },
  { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/geeksforgeeks.rit?igsh=ZGJ5cGhiOGdicG82", color: "hover:text-pink-400" },
]

const teamContacts = [
  {
    name: "Praveen",
    role: "Club President",
    email: "praveen.president@ritchennai.edu.in",
    specialization: "General Inquiries, Partnerships",
  },
  {
    name: "Pranesh",
    role: "Vice President",
    email: "pranesh.vp@ritchennai.edu.in",
    specialization: "Events, Workshops",
  },
  {
    name: "Sanjai",
    role: "Technical Lead",
    email: "sanjai.tech@ritchennai.edu.in",
    specialization: "Technical Questions, Projects",
  },
  {
    name: "Mugunthan",
    role: "Event Coordinator",
    email: "mugunthan.events@ritchennai.edu.in",
    specialization: "Event Registration, Collaborations",
  },
]

import { createClient } from "@/lib/supabase/client"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: dbError } = await supabase.from("contact_messages").insert({
      full_name: name,
      email,
      subject,
      message,
    })
    setIsSubmitting(false)
    if (dbError) {
      setError("Failed to send message. Please try again.")
    } else {
      setFormSubmitted(true)
      setName(""); setEmail(""); setSubject(""); setMessage("")
    }
  }

  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-8 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Contact Us
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Get in{" "}
            <span className="text-primary">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We&apos;d love to hear from you. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {contactInfo.map((info) => (
              <a
                key={info.title}
                href={info.link}
                className="group rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 text-center hover:border-primary/50 transition-colors"
              >
                <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <info.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{info.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  {info.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader>
                <div className="inline-flex rounded-xl bg-primary/10 p-3 w-fit mb-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
                    <p className="mt-2 text-muted-foreground">
                      We&apos;ll get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required className="bg-background border-border" value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@ritchennai.edu.in" required className="bg-background border-border" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select required value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="events">Event Related</SelectItem>
                          <SelectItem value="resources">Resources & Learning</SelectItem>
                          <SelectItem value="partnership">Partnership/Sponsorship</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        required
                        className="bg-background border-border min-h-[150px]"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Team Contacts & Social */}
            <div className="space-y-8">
              {/* Team Contacts */}
              <Card className="bg-card/50 backdrop-blur-xl border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Reach Out Directly</CardTitle>
                  <CardDescription>
                    Contact our team leads for specific queries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamContacts.map((contact) => (
                      <div
                        key={contact.email}
                        className="flex items-start gap-4 rounded-xl border border-border bg-secondary/30 p-4"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {contact.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{contact.name}</p>
                          <p className="text-sm text-primary">{contact.role}</p>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {contact.email}
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">{contact.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-card/50 backdrop-blur-xl border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Connect With Us</CardTitle>
                  <CardDescription>
                    Follow us on social media for updates and announcements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4 text-muted-foreground transition-colors ${social.color}`}
                      >
                        <social.icon className="h-5 w-5" />
                        <span className="font-medium">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="bg-card/50 backdrop-blur-xl border-border bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground mb-2">Have Common Questions?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check out our frequently asked questions for quick answers.
                    </p>
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      View FAQs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
