"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Trash2, Briefcase, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
}

interface EventRegistration {
  id: string
  event_id: number
  event_title: string
  first_name: string
  last_name: string
  email: string
  phone: string
  roll_number: string
  branch: string
  year: string
  cp_handle: string | null
  registered_at: string
}

interface ContactMessage {
  id: string
  full_name: string
  email: string
  subject: string
  message: string
  sent_at: string
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  type: string
  status: string
  attendees: number
  max_attendees: number
  created_at: string
}

interface Internship {
  id: number
  company: string
  role: string
  location: string
  mode: string
  stipend: string
  duration: string
  batch: string[]
  type: string
  posted: string
  deadline: string
  created_at: string
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [internships, setInternships] = useState<Internship[]>([])
  const [stats, setStats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', location: '', type: 'Workshop', status: 'upcoming', max_attendees: '100', is_team_event: false, max_team_size: '2', is_paid: false, fee_amount: '100' })
  const [newInternship, setNewInternship] = useState({ company: '', role: '', location: '', mode: 'Remote', stipend: '', duration: '', batch: '', type: 'SDE', posted: 'Just now', deadline: '' })
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false)
  const [isSubmittingInternship, setIsSubmittingInternship] = useState(false)
  const [isUpdatingStat, setIsUpdatingStat] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const [regs, msgs, evts, ints, stts] = await Promise.all([
      supabase.from("event_registrations").select("*").order("registered_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("sent_at", { ascending: false }),
      supabase.from("events").select("*").order("created_at", { ascending: false }),
      supabase.from("internships").select("*").order("created_at", { ascending: false }),
      supabase.from("stats").select("*").order("id", { ascending: true }),
    ])
    setRegistrations(regs.data ?? [])
    setMessages(msgs.data ?? [])
    setEvents(evts.data ?? [])
    setInternships(ints.data ?? [])
    setStats(stts.data ?? [])
    setIsLoading(false)
  }

  const updateStat = async (id: number, newValue: string) => {
    setIsUpdatingStat(id)
    const supabase = createClient()
    const { data } = await supabase.from("stats").update({ value: newValue }).eq("id", id).select()
    if (data && data[0]) {
      setStats(prev => prev.map(s => s.id === id ? data[0] : s))
    }
    setIsUpdatingStat(null)
  }

  const deleteRegistration = async (id: string) => {
    const supabase = createClient()
    await supabase.from("event_registrations").delete().eq("id", id)
    setRegistrations(prev => prev.filter(r => r.id !== id))
  }

  const deleteMessage = async (id: string) => {
    const supabase = createClient()
    await supabase.from("contact_messages").delete().eq("id", id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const deleteEvent = async (id: number) => {
    const supabase = createClient()
    await supabase.from("events").delete().eq("id", id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const deleteInternship = async (id: number) => {
    const supabase = createClient()
    await supabase.from("internships").delete().eq("id", id)
    setInternships(prev => prev.filter(i => i.id !== id))
  }

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingEvent(true)
    const supabase = createClient()
    const { data } = await supabase.from("events").insert({
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      type: newEvent.type,
      status: newEvent.status,
      max_attendees: parseInt(newEvent.max_attendees),
      attendees: 0,
      is_team_event: newEvent.is_team_event,
      max_team_size: newEvent.is_team_event ? parseInt(newEvent.max_team_size) : 1,
      is_paid: newEvent.is_paid,
      fee_amount: newEvent.is_paid ? parseInt(newEvent.fee_amount) : 0,
    }).select()
    
    if (data && data[0]) {
      setEvents([data[0], ...events])
      // Notify all users via email
      fetch("/api/notify-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data[0]),
      })
    }
    setNewEvent({ title: '', description: '', date: '', time: '', location: '', type: 'Workshop', status: 'upcoming', max_attendees: '100', is_team_event: false, max_team_size: '2', is_paid: false, fee_amount: '100' })
    setIsSubmittingEvent(false)
  }

  const createInternship = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingInternship(true)
    const supabase = createClient()
    const { data } = await supabase.from("internships").insert({
      company: newInternship.company,
      role: newInternship.role,
      location: newInternship.location,
      mode: newInternship.mode,
      stipend: newInternship.stipend,
      duration: newInternship.duration,
      batch: newInternship.batch.split(',').map(b => b.trim()),
      type: newInternship.type,
      posted: newInternship.posted,
      deadline: newInternship.deadline
    }).select()
    
    if (data && data[0]) setInternships([data[0], ...internships])
    setNewInternship({ company: '', role: '', location: '', mode: 'Remote', stipend: '', duration: '', batch: '', type: 'SDE', posted: 'Just now', deadline: '' })
    setIsSubmittingInternship(false)
  }

  const branchLabel: Record<string, string> = {
    cse: "CSE", ise: "ISE", ece: "ECE", eee: "EEE",
    me: "Mech", cv: "Civil", aids: "AI&DS", csbs: "CSBS", other: "Other",
  }

  return (
    <main className="min-h-screen bg-transparent p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage GfG RIT platform content and users</p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Calendar className="h-6 w-6" /></div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{registrations.length}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Registrations</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><MessageSquare className="h-6 w-6" /></div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{messages.length}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Calendar className="h-6 w-6" /></div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{events.length}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Active Events</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><Briefcase className="h-6 w-6" /></div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{internships.length}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">Internships</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="events" className="space-y-8">
          <div className="rounded-xl bg-card/50 backdrop-blur-xl border border-border p-2 shadow-sm inline-block w-full overflow-x-auto overflow-y-hidden">
            <TabsList className="bg-transparent h-auto p-0 flex space-x-2">
              <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2.5 transition-all text-muted-foreground whitespace-nowrap flex-shrink-0">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </TabsTrigger>
              <TabsTrigger value="internships" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2.5 transition-all text-muted-foreground whitespace-nowrap flex-shrink-0">
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Internships
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2.5 transition-all text-muted-foreground whitespace-nowrap flex-shrink-0">
                <MessageSquare className="h-4 w-4 mr-2" />
                Manage Stats
              </TabsTrigger>
              <div className="w-[1px] h-8 bg-border my-auto mx-2 shrink-0 hidden md:block"></div>
              <TabsTrigger value="registrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2.5 transition-all text-muted-foreground whitespace-nowrap flex-shrink-0">
                <Calendar className="h-4 w-4 mr-2" />
                Registrations
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2.5 transition-all text-muted-foreground whitespace-nowrap flex-shrink-0">
                <MessageSquare className="h-4 w-4 mr-2" />
                Inbox
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Manage Stats */}
          <TabsContent value="stats" className="mt-0">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-card/50 backdrop-blur-xl border-border">
              <CardHeader>
                <CardTitle>Manage Homepage & About Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((s) => (
                    <div key={s.id} className="space-y-2 border border-border p-4 rounded-xl">
                      <Label className="font-semibold text-lg">{s.label}</Label>
                      <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                      <Input 
                        value={s.value} 
                        onChange={(e) => setStats(prev => prev.map(stat => stat.id === s.id ? { ...stat, value: e.target.value } : stat))}
                        className="font-bold text-primary"
                      />
                      <Button 
                        onClick={() => updateStat(s.id, s.value)} 
                        disabled={isUpdatingStat === s.id}
                        className="w-full mt-2"
                      >
                        {isUpdatingStat === s.id ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Manage Events */}
          <TabsContent value="events" className="mt-0 space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-card/50 backdrop-blur-xl border-border shadow-sm">
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label>Description</Label>
                    <Input required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date (e.g. March 25, 2026)</Label>
                    <Input required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time (e.g. 10:00 AM - 2:00 PM)</Label>
                    <Input required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newEvent.type} onValueChange={v => setNewEvent({...newEvent, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Contest">Contest</SelectItem>
                        <SelectItem value="Talk">Talk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newEvent.status} onValueChange={v => setNewEvent({...newEvent, status: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Attendees</Label>
                    <Input type="number" required value={newEvent.max_attendees} onChange={e => setNewEvent({...newEvent, max_attendees: e.target.value})} />
                  </div>
                  <div className="space-y-3 col-span-1 md:col-span-2 lg:col-span-3">
                    <Label>Event Format</Label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="event_format" checked={!newEvent.is_team_event} onChange={() => setNewEvent({...newEvent, is_team_event: false})} className="accent-primary" />
                        <span className="text-sm">Individual Event</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="event_format" checked={newEvent.is_team_event} onChange={() => setNewEvent({...newEvent, is_team_event: true})} className="accent-primary" />
                        <span className="text-sm">Team Event</span>
                      </label>
                    </div>
                    {newEvent.is_team_event && (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                        <Users className="h-4 w-4 text-primary shrink-0" />
                        <Label className="shrink-0">Max members per team</Label>
                        <Input type="number" min="2" max="10" className="w-24" value={newEvent.max_team_size} onChange={e => setNewEvent({...newEvent, max_team_size: e.target.value})} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 col-span-1 md:col-span-2 lg:col-span-3">
                    <Label>Participation Fee</Label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="fee_type" checked={!newEvent.is_paid} onChange={() => setNewEvent({...newEvent, is_paid: false})} className="accent-primary" />
                        <span className="text-sm">Free Event</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="fee_type" checked={newEvent.is_paid} onChange={() => setNewEvent({...newEvent, is_paid: true})} className="accent-primary" />
                        <span className="text-sm">Paid Event</span>
                      </label>
                    </div>
                    {newEvent.is_paid && (
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                        <span className="text-amber-500 font-bold shrink-0">₹</span>
                        <Label className="shrink-0">Fee amount</Label>
                        <Input type="number" min="1" className="w-28" value={newEvent.fee_amount} onChange={e => setNewEvent({...newEvent, fee_amount: e.target.value})} />
                        <span className="text-xs text-muted-foreground">Students will pay via QR & submit transaction ID</span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Button type="submit" disabled={isSubmittingEvent} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      {isSubmittingEvent ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-primary"/> Active Events</h3>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4">
              {events.map((e) => (
                <Card key={e.id} className="bg-card/50 backdrop-blur-xl border-border flex items-center justify-between p-4 flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold">{e.title} <Badge className="ml-2" variant="outline">{e.status}</Badge></h3>
                    <p className="text-sm text-muted-foreground">{e.date} | {e.location} | {e.attendees}/{e.max_attendees} registered{(e as any).is_team_event ? ` | Team event (max ${(e as any).max_team_size}/team)` : ''}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" onClick={() => deleteEvent(e.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
              </motion.div>
            </div>
          </TabsContent>

          {/* Manage Internships */}
          <TabsContent value="internships" className="mt-0 space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-card/50 backdrop-blur-xl border-border shadow-sm">
              <CardHeader>
                <CardTitle>Create New Internship</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createInternship} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input required value={newInternship.company} onChange={e => setNewInternship({...newInternship, company: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input required value={newInternship.role} onChange={e => setNewInternship({...newInternship, role: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input required value={newInternship.location} onChange={e => setNewInternship({...newInternship, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mode</Label>
                    <Select value={newInternship.mode} onValueChange={v => setNewInternship({...newInternship, mode: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stipend</Label>
                    <Input required value={newInternship.stipend} onChange={e => setNewInternship({...newInternship, stipend: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input required value={newInternship.duration} onChange={e => setNewInternship({...newInternship, duration: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch (comma separated, e.g. 2024, 2025)</Label>
                    <Input required value={newInternship.batch} onChange={e => setNewInternship({...newInternship, batch: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newInternship.type} onValueChange={v => setNewInternship({...newInternship, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SDE">SDE</SelectItem>
                        <SelectItem value="Data">Data Science</SelectItem>
                        <SelectItem value="Web">Web Dev</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label>Deadline</Label>
                    <Input required value={newInternship.deadline} onChange={e => setNewInternship({...newInternship, deadline: e.target.value})} />
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Button type="submit" disabled={isSubmittingInternship} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      {isSubmittingInternship ? "Creating..." : "Create Internship"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            </motion.div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-primary"/> Internship Listings</h3>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4">
              {internships.map((i) => (
                <Card key={i.id} className="bg-card/50 backdrop-blur-xl border-border flex items-center justify-between p-4 flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold">{i.role} at {i.company}</h3>
                    <p className="text-sm text-muted-foreground">{i.location} | {i.mode} | Batch: {i.batch.join(", ")} | Deadline: {i.deadline}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" onClick={() => deleteInternship(i.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
              </motion.div>
            </div>
          </TabsContent>

          {/* Event Registrations */}
          <TabsContent value="registrations" className="mt-0">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-card/50 backdrop-blur-xl border-border overflow-hidden shadow-sm">
              <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : registrations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No registrations yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="py-3 px-3 text-left">Name</th>
                          <th className="py-3 px-3 text-left">Email</th>
                          <th className="py-3 px-3 text-left">Phone</th>
                          <th className="py-3 px-3 text-left">Roll No.</th>
                          <th className="py-3 px-3 text-left">Branch</th>
                          <th className="py-3 px-3 text-left">Event</th>
                          <th className="py-3 px-3 text-left">Date</th>
                          <th className="py-3 px-3 text-left"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((r) => (
                          <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            <td className="py-3 px-3 font-medium text-foreground">{r.first_name} {r.last_name}</td>
                            <td className="py-3 px-3 text-muted-foreground">{r.email}</td>
                            <td className="py-3 px-3 text-muted-foreground">{r.phone}</td>
                            <td className="py-3 px-3 text-muted-foreground">{r.roll_number}</td>
                            <td className="py-3 px-3 text-muted-foreground">{branchLabel[r.branch] ?? r.branch}</td>
                            <td className="py-3 px-3">
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary whitespace-nowrap">{r.event_title}</Badge>
                            </td>
                            <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                              {new Date(r.registered_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="py-3 px-3">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={() => deleteRegistration(r.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </TabsContent>

          {/* Contact Messages */}
          <TabsContent value="messages" className="mt-0">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                messages.map((m) => (
                  <Card key={m.id} className="bg-card/50 backdrop-blur-xl border-border">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <span className="font-semibold text-foreground">{m.full_name}</span>
                            <span className="text-sm text-muted-foreground">{m.email}</span>
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary capitalize">{m.subject}</Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(m.sent_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 shrink-0" onClick={() => deleteMessage(m.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
