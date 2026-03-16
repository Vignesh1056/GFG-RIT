"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Clock, Search, Filter, CheckCircle2, Mail, Phone, GraduationCap, User } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

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

const eventTypeColors: Record<string, string> = {
  Workshop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contest: "bg-primary/10 text-primary border-primary/20",
  Talk: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

const defaultForm = { firstName: "", lastName: "", email: "", phone: "", rollNumber: "", branch: "", year: "", cpHandle: "", teamName: "", teamMembers: [] as { name: string; rollNumber: string; email: string }[], transactionId: "" }

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("upcoming")
  const [form, setForm] = useState(defaultForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<Record<number, "success" | "duplicate" | "error">>({})

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false })
      setEvents(data ?? [])
      setIsLoading(false)
    }
    fetchEvents()
  }, [])

  const handleField = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleRegister = async (event: any, onClose: () => void) => {
    setIsSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from("event_registrations").insert({
      event_id: event.id,
      event_title: event.title,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      roll_number: form.rollNumber,
      branch: form.branch,
      year: form.year,
      cp_handle: form.cpHandle || null,
      team_name: event.is_team_event ? form.teamName : null,
      team_members: event.is_team_event ? form.teamMembers : null,
      transaction_id: event.is_paid ? form.transactionId : null,
    })
    setIsSubmitting(false)
    if (!error) {
      setSubmitState(prev => ({ ...prev, [event.id]: "success" }))
      setForm(defaultForm)
      setTimeout(onClose, 2000)
    } else if (error.code === "23505") {
      setSubmitState(prev => ({ ...prev, [event.id]: "duplicate" }))
    } else {
      setSubmitState(prev => ({ ...prev, [event.id]: "error" }))
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || event.type === typeFilter
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <main className="min-h-screen bg-transparent">
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
              Events
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
          >
            Learn, Compete, and{" "}
            <span className="text-primary">Grow Together</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Explore our workshops, contests, and tech talks designed to help you excel.
          </motion.p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="px-6 lg:px-8 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto max-w-7xl"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 backdrop-blur-xl border-border"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-card/50 backdrop-blur-xl border-border">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Contest">Contest</SelectItem>
                  <SelectItem value="Talk">Talk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] bg-card/50 backdrop-blur-xl border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Events Grid */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredEvents.map((event) => (
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={event.id} className="h-full">
                  <Card
                    className={`group bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 transition-all duration-300 h-full flex flex-col ${
                      event.status === "past" ? "opacity-70" : ""
                    }`}
                  >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={eventTypeColors[event.type]}>
                        {event.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {event.is_paid && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                            ₹{event.fee_amount}
                          </Badge>
                        )}
                        {event.is_team_event && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            Team
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees}/{event.max_attendees}</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="space-y-2 text-sm text-muted-foreground flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    {event.status === "upcoming" ? (
                      <Dialog onOpenChange={(open) => { if (!open) { setForm(defaultForm); setSubmitState(prev => ({ ...prev, [event.id]: undefined as any })) } }}>
                        <DialogTrigger asChild>
                          <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Register Now</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card/80 backdrop-blur-xl border-border sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="pb-2">
                            <DialogTitle className="text-xl font-bold">{event.title}</DialogTitle>
                            <DialogDescription className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-1">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{event.date}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                              {event.is_team_event && <span className="flex items-center gap-1 text-primary"><Users className="h-3 w-3" />Team event · up to {event.max_team_size} members</span>}
                            </DialogDescription>
                          </DialogHeader>
                          {submitState[event.id] === "success" ? (
                            <div className="flex flex-col items-center gap-3 py-10 text-center">
                              <CheckCircle2 className="h-14 w-14 text-green-500" />
                              <p className="font-semibold text-lg text-foreground">Registration Successful!</p>
                              <p className="text-sm text-muted-foreground">You're all set for {event.title}. See you there!</p>
                            </div>
                          ) : (
                            <form className="space-y-4 mt-2" onSubmit={async (e) => { e.preventDefault(); const close = () => (e.target as HTMLFormElement).closest('[role=dialog]')?.querySelector<HTMLButtonElement>('button[aria-label="Close"]')?.click(); await handleRegister(event, close) }}>
                              {/* Leader / Individual details */}
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{event.is_team_event ? "Team Leader Details" : "Your Details"}</p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-sm">First Name</Label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="John" className="pl-9 bg-background/60" required value={form.firstName} onChange={e => handleField("firstName", e.target.value)} />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm">Last Name</Label>
                                  <Input placeholder="Doe" className="bg-background/60" required value={form.lastName} onChange={e => handleField("lastName", e.target.value)} />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-sm">College Email</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="email" placeholder="you@ritchennai.edu.in" className="pl-9 bg-background/60" required value={form.email} onChange={e => handleField("email", e.target.value)} />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-sm">Phone Number</Label>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input type="tel" placeholder="+91 9876543210" className="pl-9 bg-background/60" required value={form.phone} onChange={e => handleField("phone", e.target.value)} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label className="text-sm">Roll Number</Label>
                                  <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="1MS21CS001" className="pl-9 bg-background/60" required value={form.rollNumber} onChange={e => handleField("rollNumber", e.target.value)} />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm">Branch</Label>
                                  <Select required value={form.branch} onValueChange={v => handleField("branch", v)}>
                                    <SelectTrigger className="bg-background/60"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cse">CSE</SelectItem>
                                      <SelectItem value="ise">ISE</SelectItem>
                                      <SelectItem value="ece">ECE</SelectItem>
                                      <SelectItem value="eee">EEE</SelectItem>
                                      <SelectItem value="me">Mechanical</SelectItem>
                                      <SelectItem value="cv">Civil</SelectItem>
                                      <SelectItem value="aids">AI&DS</SelectItem>
                                      <SelectItem value="csbs">CSBS</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-sm">Year of Study</Label>
                                <Select required value={form.year} onValueChange={v => handleField("year", v)}>
                                  <SelectTrigger className="bg-background/60"><SelectValue placeholder="Select year" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                    <SelectItem value="4">4th Year</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {event.type === "Contest" && (
                                <div className="space-y-1.5">
                                  <Label className="text-sm">CP Handle <span className="text-muted-foreground">(optional)</span></Label>
                                  <Input placeholder="LeetCode / Codeforces username" className="bg-background/60" value={form.cpHandle} onChange={e => handleField("cpHandle", e.target.value)} />
                                </div>
                              )}

                              {/* Payment section */}
                              {event.is_paid && (
                                <div className="border-t border-border pt-4 space-y-3">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</p>
                                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5">
                                    <span className="text-sm text-muted-foreground">Registration Fee</span>
                                    <span className="font-bold text-amber-500">₹{event.fee_amount}</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-2 py-2">
                                    <p className="text-sm text-muted-foreground">Scan to pay via UPI</p>
                                    <div className="rounded-xl overflow-hidden border border-border p-2 bg-white">
                                      <Image src="/Payment-QR.jpeg" alt="Payment QR" width={180} height={180} className="rounded-lg" />
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label className="text-sm">Transaction ID <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Enter UPI transaction ID after payment" className="bg-background/60" required value={form.transactionId} onChange={e => handleField("transactionId", e.target.value)} />
                                    <p className="text-xs text-muted-foreground">You'll find this in your UPI app after payment</p>
                                  </div>
                                </div>
                              )}

                              {/* Team section */}
                              {event.is_team_event && (
                                <>
                                  <div className="border-t border-border pt-4 space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team Details</p>
                                    <div className="space-y-1.5">
                                      <Label className="text-sm">Team Name</Label>
                                      <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="e.g. Code Crushers" className="pl-9 bg-background/60" required value={form.teamName} onChange={e => handleField("teamName", e.target.value)} />
                                      </div>
                                    </div>
                                    {Array.from({ length: event.max_team_size - 1 }).map((_, i) => (
                                      <div key={i} className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">Member {i + 2}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                          <Input
                                            placeholder="Full name"
                                            className="bg-background/60 text-sm"
                                            required
                                            value={form.teamMembers[i]?.name ?? ""}
                                            onChange={e => {
                                              const updated = [...form.teamMembers]
                                              updated[i] = { ...updated[i], name: e.target.value }
                                              setForm(prev => ({ ...prev, teamMembers: updated }))
                                            }}
                                          />
                                          <Input
                                            placeholder="Roll number"
                                            className="bg-background/60 text-sm"
                                            required
                                            value={form.teamMembers[i]?.rollNumber ?? ""}
                                            onChange={e => {
                                              const updated = [...form.teamMembers]
                                              updated[i] = { ...updated[i], rollNumber: e.target.value }
                                              setForm(prev => ({ ...prev, teamMembers: updated }))
                                            }}
                                          />
                                        </div>
                                        <Input
                                          type="email"
                                          placeholder="College email"
                                          className="bg-background/60 text-sm"
                                          required
                                          value={form.teamMembers[i]?.email ?? ""}
                                          onChange={e => {
                                            const updated = [...form.teamMembers]
                                            updated[i] = { ...updated[i], email: e.target.value }
                                            setForm(prev => ({ ...prev, teamMembers: updated }))
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {submitState[event.id] === "duplicate" && (
                                <p className="text-sm text-red-500">You've already registered for this event with this email.</p>
                              )}
                              {submitState[event.id] === "error" && (
                                <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                              )}
                              <div className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-2.5 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Spots remaining</span>
                                <span className="font-semibold text-foreground">{event.max_attendees - event.attendees} / {event.max_attendees}</span>
                              </div>
                              <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Complete Registration"}
                              </Button>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button className="w-full mt-6" variant="secondary" disabled>
                        Event Completed
                      </Button>
                    )}
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
