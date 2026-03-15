"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, User, ArrowRight, Tag } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "How I Cracked Google's SDE Internship",
    excerpt: "My complete journey from preparation to receiving the offer letter. Tips, resources, and strategies that worked for me.",
    author: "Aditya Kumar",
    date: "March 10, 2026",
    readTime: "8 min read",
    category: "Interview Experience",
    featured: true,
  },
  {
    id: 2,
    title: "Dynamic Programming: From Zero to Hero",
    excerpt: "A comprehensive guide to mastering DP concepts with patterns, examples, and practice problems.",
    author: "Sneha Sharma",
    date: "March 5, 2026",
    readTime: "12 min read",
    category: "DSA",
    featured: true,
  },
  {
    id: 3,
    title: "CodeRush 3.0: Event Highlights",
    excerpt: "Recap of our biggest coding competition yet with 200+ participants and exciting challenges.",
    author: "GfG RIT Team",
    date: "March 1, 2026",
    readTime: "5 min read",
    category: "Events",
    featured: false,
  },
  {
    id: 4,
    title: "Building Your First Full-Stack App with Next.js",
    excerpt: "Step-by-step tutorial to build a complete web application from scratch using Next.js and PostgreSQL.",
    author: "Rahul Verma",
    date: "February 25, 2026",
    readTime: "15 min read",
    category: "Web Dev",
    featured: false,
  },
  {
    id: 5,
    title: "Top 10 VS Code Extensions for Competitive Programming",
    excerpt: "Essential extensions that will boost your competitive programming productivity.",
    author: "Priya Patel",
    date: "February 20, 2026",
    readTime: "6 min read",
    category: "Tips",
    featured: false,
  },
  {
    id: 6,
    title: "My Amazon Interview Experience - SDE1",
    excerpt: "Detailed breakdown of all 5 rounds, questions asked, and how I prepared for each.",
    author: "Amit Singh",
    date: "February 15, 2026",
    readTime: "10 min read",
    category: "Interview Experience",
    featured: false,
  },
  {
    id: 7,
    title: "Graph Algorithms: A Visual Guide",
    excerpt: "Understanding BFS, DFS, Dijkstra, and more with interactive visualizations and code.",
    author: "Kavya Reddy",
    date: "February 10, 2026",
    readTime: "14 min read",
    category: "DSA",
    featured: false,
  },
  {
    id: 8,
    title: "Resume Tips That Got Me 5 Interview Calls",
    excerpt: "Practical advice on crafting a tech resume that stands out to recruiters.",
    author: "Vikram Rao",
    date: "February 5, 2026",
    readTime: "7 min read",
    category: "Career",
    featured: false,
  },
]

const categories = ["All", "DSA", "Interview Experience", "Web Dev", "Events", "Tips", "Career"]

const categoryColors: Record<string, string> = {
  "DSA": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Interview Experience": "bg-primary/10 text-primary border-primary/20",
  "Web Dev": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Events": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Tips": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Career": "bg-teal-500/10 text-teal-400 border-teal-500/20",
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-8 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Blog & Updates
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Insights, Tutorials &{" "}
            <span className="text-primary">Success Stories</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Learn from our community&apos;s experiences, tutorials, and the latest updates.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={categoryColors[post.category]}>
                      {post.category}
                    </Badge>
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-base">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="px-6 lg:px-8 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Posts</h2>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No posts found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={categoryColors[post.category]}>
                        <Tag className="h-3 w-3 mr-1" />
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary p-0">
                      Read Article
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
