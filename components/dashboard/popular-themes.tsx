"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { themes } from "@/lib/bible-data"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function PopularThemes() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-cursive text-foreground">Temas Populares</h2>
        <Link href="/explorador" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {themes.slice(0, 9).map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
          >
            <Link href={`/explorador?tema=${theme.id}`}>
              <Card className="glass-card p-4 hover:border-primary/50 transition-all duration-500 group cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] hover:bg-white/5 active:scale-95">
                <div className="w-3 h-3 rounded-full mb-3 transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: theme.color }} />
                <h3 className="font-cursive text-foreground text-2xl mb-1 group-hover:text-primary transition-colors text-center">
                  {theme.nombre}
                </h3>
                <p className="text-xs text-muted-foreground">{theme.versiculos} versículos</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
