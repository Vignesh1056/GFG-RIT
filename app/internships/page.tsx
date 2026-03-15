"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Building2, IndianRupee, Clock, ExternalLink, Filter, Briefcase } from "lucide-react"
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



const modeColors: Record<string, string> = {
  "Remote": "bg-green-500/10 text-green-400 border-green-500/20",
  "On-site": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Hybrid": "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export default function InternshipsPage() {
  const [internships, setInternships] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [batchFilter, setBatchFilter] = useState("all")

  useEffect(() => {
    const fetchInternships = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("internships").select("*").order("created_at", { ascending: false })
      setInternships(data ?? [])
      setIsLoading(false)
    }
    fetchInternships()
  }, [])

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || internship.type === roleFilter
    const matchesMode = modeFilter === "all" || internship.mode === modeFilter
    const matchesBatch = batchFilter === "all" || internship.batch.includes(batchFilter)
    return matchesSearch && matchesRole && matchesMode && matchesBatch
  })

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
              Internship Finder
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
          >
            Find Your Dream{" "}
            <span className="text-primary">Internship</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Discover opportunities at top companies, curated and verified by our community.
          </motion.p>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="px-6 lg:px-8 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto max-w-7xl"
        >
          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-8 bg-card border border-border">
              <TabsTrigger value="listings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                Internship Listings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search company or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[140px] bg-card border-border">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="SDE">SDE</SelectItem>
                      <SelectItem value="Data">Data Science</SelectItem>
                      <SelectItem value="Web">Web Dev</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={modeFilter} onValueChange={setModeFilter}>
                    <SelectTrigger className="w-full sm:w-[140px] bg-card border-border">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={batchFilter} onValueChange={setBatchFilter}>
                    <SelectTrigger className="w-full sm:w-[140px] bg-card border-border">
                      <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Internship Cards */}
              {filteredInternships.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground">No internships found matching your criteria.</p>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid gap-6 md:grid-cols-2"
                >
                  {filteredInternships.map((internship) => (
                    <motion.div variants={itemVariants} whileHover={{ y: -5 }} key={internship.id} className="h-full">
                      <Card className="bg-card border-border hover:border-primary/50 transition-colors h-full flex flex-col">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={modeColors[internship.mode]}>
                              {internship.mode}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{internship.posted}</span>
                          </div>
                          <CardTitle className="text-xl">{internship.role}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {internship.company}
                          </CardDescription>
                        </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{internship.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-primary" />
                            <span>{internship.stipend}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{internship.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span>Batch: {internship.batch.join(", ")}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span>Deadline: {internship.deadline}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-primary hover:bg-primary/90">
                              Apply Now
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl">Apply for Internship</DialogTitle>
                              <DialogDescription>
                                <span className="font-medium text-foreground">{internship.role}</span>
                                <span className="text-muted-foreground"> at </span>
                                <span className="font-medium text-foreground">{internship.company}</span>
                                <br />
                                <span className="text-sm">{internship.location} | {internship.mode} | {internship.stipend}</span>
                              </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`appFirstName-${internship.id}`}>First Name</Label>
                                  <Input 
                                    id={`appFirstName-${internship.id}`} 
                                    placeholder="John" 
                                    className="bg-background border-border" 
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`appLastName-${internship.id}`}>Last Name</Label>
                                  <Input 
                                    id={`appLastName-${internship.id}`} 
                                    placeholder="Doe" 
                                    className="bg-background border-border" 
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appEmail-${internship.id}`}>Email Address</Label>
                                <Input 
                                  id={`appEmail-${internship.id}`} 
                                  type="email" 
                                  placeholder="john.doe@rit.edu" 
                                  className="bg-background border-border" 
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appPhone-${internship.id}`}>Phone Number</Label>
                                <Input 
                                  id={`appPhone-${internship.id}`} 
                                  type="tel" 
                                  placeholder="+91 9876543210" 
                                  className="bg-background border-border" 
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`appRoll-${internship.id}`}>Roll Number</Label>
                                  <Input 
                                    id={`appRoll-${internship.id}`} 
                                    placeholder="1MS21CS001" 
                                    className="bg-background border-border" 
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`appBatch-${internship.id}`}>Batch Year</Label>
                                  <Select required>
                                    <SelectTrigger className="bg-background border-border">
                                      <SelectValue placeholder="Select batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="2024">2024</SelectItem>
                                      <SelectItem value="2025">2025</SelectItem>
                                      <SelectItem value="2026">2026</SelectItem>
                                      <SelectItem value="2027">2027</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appBranch-${internship.id}`}>Branch / Department</Label>
                                <Select required>
                                  <SelectTrigger className="bg-background border-border">
                                    <SelectValue placeholder="Select branch" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                                    <SelectItem value="ise">Information Science & Engineering</SelectItem>
                                    <SelectItem value="ece">Electronics & Communication</SelectItem>
                                    <SelectItem value="eee">Electrical & Electronics</SelectItem>
                                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                                    <SelectItem value="cv">Civil Engineering</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appResume-${internship.id}`}>Resume Link (Google Drive / Dropbox)</Label>
                                <Input 
                                  id={`appResume-${internship.id}`} 
                                  type="url" 
                                  placeholder="https://drive.google.com/file/..." 
                                  className="bg-background border-border" 
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appLinkedin-${internship.id}`}>LinkedIn Profile (Optional)</Label>
                                <Input 
                                  id={`appLinkedin-${internship.id}`} 
                                  type="url" 
                                  placeholder="https://linkedin.com/in/johndoe" 
                                  className="bg-background border-border" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appGithub-${internship.id}`}>GitHub Profile (Optional)</Label>
                                <Input 
                                  id={`appGithub-${internship.id}`} 
                                  type="url" 
                                  placeholder="https://github.com/johndoe" 
                                  className="bg-background border-border" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`appCover-${internship.id}`}>Why are you interested? (Brief)</Label>
                                <Textarea 
                                  id={`appCover-${internship.id}`} 
                                  placeholder="Tell us why you're interested in this role and what makes you a good fit..."
                                  className="bg-background border-border min-h-[80px]"
                                  required
                                />
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                                <p>Application deadline: {internship.deadline}</p>
                                <p className="mt-1 text-xs">Your application will be reviewed by our team and forwarded to the company.</p>
                              </div>
                              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                Submit Application
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
