"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { themes } from "@/lib/bible-data"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function PopularThemes() {
  const mobileThemes = themes.slice(0, 9)
  const fortalezaTheme = mobileThemes.find((t) => t.id === "fortaleza")
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-cursive text-[#D2B48C]">Temas Populares</h2>
        <Link href="/explorador" className="text-sm text-[#D2B48C] hover:text-[#D2B48C]/80 flex items-center gap-1">
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 auto-rows-auto md:grid-cols-3 gap-3">
        {/* Móvil: mostrar todos menos Fortaleza en el grid de 2 columnas */}
        {mobileThemes.filter((t) => t.id !== "fortaleza").map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="md:hidden"
          >
            <Link href={`/explorador?tema=${theme.id}`}>
              <Card className="glass-card p-4 border-[#D2B48C]/20 hover:border-[#D2B48C]/50 transition-all duration-500 group cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(210,180,140,0.3)] bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 active:scale-95">
                <div className="w-3 h-3 rounded-full mb-3 transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: theme.color }} />
                <h3 className="font-cursive text-[#D2B48C] text-2xl mb-1 group-hover:text-[#D2B48C] transition-colors text-center">
                  {theme.nombre}
                </h3>
                <p className="text-xs text-[#D2B48C]/60">{theme.versiculos} versículos</p>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Móvil: Fortaleza como bloque final full-width */}
        {fortalezaTheme && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * 8 }}
            className="col-span-2 md:hidden"
          >
            <Link href={`/explorador?tema=${fortalezaTheme.id}`}>
              <Card className="glass-card p-6 border-[#D2B48C]/20 hover:border-[#D2B48C]/50 transition-all duration-500 group cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(210,180,140,0.3)] bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 active:scale-95">
                <div className="w-3 h-3 rounded-full mb-3 transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: fortalezaTheme.color }} />
                <h3 className="font-cursive text-[#D2B48C] text-3xl mb-1 group-hover:text-[#D2B48C] transition-colors text-center">
                  {fortalezaTheme.nombre}
                </h3>
                <p className="text-xs text-[#D2B48C]/60">{fortalezaTheme.versiculos} versículos</p>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Desktop: grid normal con los 9 temas (incluye Fortaleza) */}
        {mobileThemes.map((theme, index) => (
          <motion.div
            key={`md-${theme.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="hidden md:block"
          >
            <Link href={`/explorador?tema=${theme.id}`}>
              <Card className="glass-card p-4 border-[#D2B48C]/20 hover:border-[#D2B48C]/50 transition-all duration-500 group cursor-pointer hover:shadow-[0_0_50px_-10px_rgba(210,180,140,0.3)] bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 active:scale-95">
                <div className="w-3 h-3 rounded-full mb-3 transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: theme.color }} />
                <h3 className="font-cursive text-[#D2B48C] text-2xl mb-1 group-hover:text-[#D2B48C] transition-colors text-center">
                  {theme.nombre}
                </h3>
                <p className="text-xs text-[#D2B48C]/60">{theme.versiculos} versículos</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
