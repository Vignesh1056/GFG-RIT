"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AuroraBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Only show the glowing orbs if in dark mode, or make them very subtle in light mode.
  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            transform: ["translate(0px, 0px) scale(1)", "translate(50px, -50px) scale(1.1)", "translate(0px, 0px) scale(1)"]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none opacity-50 ${isDark ? 'bg-primary/30 mix-blend-screen' : 'bg-primary/10 mix-blend-multiply'}`} 
        />
        <motion.div 
          animate={{
            transform: ["translate(0px, 0px) scale(1)", "translate(-50px, 50px) scale(1.2)", "translate(0px, 0px) scale(1)"]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full blur-[100px] pointer-events-none opacity-40 ${isDark ? 'bg-blue-500/30 mix-blend-screen' : 'bg-blue-300/20 mix-blend-multiply'}`} 
        />
        <motion.div 
          animate={{
            transform: ["translate(0px, 0px) scale(1)", "translate(50px, 50px) scale(0.9)", "translate(0px, 0px) scale(1)"]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full blur-[120px] pointer-events-none opacity-30 ${isDark ? 'bg-teal-500/30 mix-blend-screen' : 'bg-teal-300/20 mix-blend-multiply'}`} 
        />
      </div>
      
      {/* Glass overlay to smooth it out and make text readable */}
      <div className={`absolute inset-0 z-0 ${isDark ? 'bg-background/60 backdrop-blur-[60px]' : 'bg-background/40 backdrop-blur-[40px]'}`} />
      
      {/* Subtle noise layer for texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40 mix-blend-overlay z-0" />
    </div>
  )
}
