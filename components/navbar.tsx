"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Code2, ChevronDown, Sun, Moon, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { getProfile, type Profile } from "@/lib/supabase/profiles"
import type { User as SupabaseUser, AuthChangeEvent } from "@supabase/supabase-js"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Resources", href: "/resources" },
  { name: "Practice", href: "/practice" },
  { name: "Internships", href: "/internships" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    supabase.auth.getUser().then(async ({ data }: { data: { user: SupabaseUser | null } }) => {
      setUser(data.user ?? null)
      if (data.user) {
        const p = await getProfile(data.user.id)
        setProfile(p)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const p = await getProfile(session.user.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // Prevent hydration mismatch by not rendering auth-dependent UI until mounted on client
  const renderAuthAction = () => {
    if (!mounted) return <div className="w-20 h-9" /> // Placeholder for button
    
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="flex items-center gap-2" suppressHydrationWarning>
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                {(profile?.full_name || user.email || "U")[0].toUpperCase()}
              </div>
              {profile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user.email === "vigneshwarvigneshwar292@gmail.com" && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="w-full flex items-center gap-2 cursor-pointer">
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
        <Link href="/signin" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Sign In
        </Link>
      </Button>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">
              GfG <span className="text-primary">RIT</span>
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:bg-secondary transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            suppressHydrationWarning
          >
            <span className="sr-only">Toggle theme</span>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger suppressHydrationWarning className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              More <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navigation.slice(4).map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href}>{item.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-secondary transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            suppressHydrationWarning
          >
            <span className="sr-only">Toggle theme</span>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          {renderAuthAction()}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/signin" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
