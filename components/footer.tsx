import Link from "next/link"
import { Code2, Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react"

const footerLinks = {
  club: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about#team" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
  ],
  resources: [
    { name: "Learning Paths", href: "/resources" },
    { name: "DSA Practice", href: "/resources#dsa" },
    { name: "Interview Prep", href: "/resources#interview" },
    { name: "Internships", href: "/internships" },
  ],
  community: [
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Achievements", href: "/leaderboard#achievements" },
    { name: "Contact Us", href: "/contact" },
    { name: "Support", href: "/contact#support" },
  ],
}

const socialLinks = [
  { name: "GitHub", href: "https://github.com/gfg-rit", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/company/gfg-rit", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com/gfg_rit", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com/gfg_rit", icon: Instagram },
  { name: "Email", href: "mailto:gfg@ritchennai.edu.in", icon: Mail },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">
                GfG <span className="text-primary">RIT</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Empowering students with coding skills, industry connections, and a vibrant community for technical excellence.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Club</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.club.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Community</h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.community.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GeeksforGeeks Campus Club - Rajalakshmi Institute of Technology. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
