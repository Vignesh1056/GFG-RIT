"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "DSA Workshop: Trees & Graphs",
    description: "Master tree traversals, graph algorithms, and solve LeetCode problems together.",
    date: "March 20, 2026",
    time: "4:00 PM - 6:00 PM",
    location: "Seminar Hall A",
    type: "Workshop",
    attendees: 85,
    maxAttendees: 100,
  },
  {
    id: 2,
    title: "CodeRush 3.0 - Coding Contest",
    description: "Our flagship coding competition with exciting prizes and recognition.",
    date: "March 25, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Computer Lab 1",
    type: "Contest",
    attendees: 150,
    maxAttendees: 200,
  },
  {
    id: 3,
    title: "Industry Connect: Tech Talk",
    description: "Learn from industry experts about latest trends and career opportunities.",
    date: "April 2, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "Auditorium",
    type: "Talk",
    attendees: 200,
    maxAttendees: 300,
  },
]

const eventTypeColors: Record<string, string> = {
  Workshop: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contest: "bg-primary/10 text-primary border-primary/20",
  Talk: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export function EventsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Upcoming Events
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Join Our Next Event
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              From workshops to contests, we host events that help you grow as a developer.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/events">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Events grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="group bg-card border-border hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={eventTypeColors[event.type]}
                  >
                    {event.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees}/{event.maxAttendees}</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
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
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90" asChild>
                  <Link href={`/events/${event.id}`}>Register Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
