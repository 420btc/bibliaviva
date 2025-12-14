"use client"

import { AppShell } from "@/components/layout/app-shell"
import { VerseOfDay } from "@/components/dashboard/verse-of-day"
import { ProgressRing } from "@/components/dashboard/progress-ring"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyChallenges } from "@/components/dashboard/daily-challenges"
import { PopularThemes } from "@/components/dashboard/popular-themes"
import { getCurrentSeason } from "@/lib/seasons"
import { useEffect, useState } from "react"
import { Gift, Sun, Leaf, Cross, Sparkles } from "lucide-react"

export default function HomePage() {
  const [season, setSeason] = useState(getCurrentSeason())

  // Icons mapping
  const Icons = {
    Gift, Sun, Leaf, Cross, Sparkles
  }
  const SeasonIcon = Icons[season.icon as keyof typeof Icons] || Sparkles

  useEffect(() => {
    setSeason(getCurrentSeason())
  }, [])

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
              {season.id !== 'default' && <span className="text-3xl">{season.emoji}</span>}
              {season.id === 'default' ? "Bienvenido de vuelta" : season.greeting}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
               {season.id === 'default' ? "Continúa tu viaje espiritual hoy" : `Celebrando: ${season.name}`}
               {season.id !== 'default' && (
                 <span className={`text-xs px-2 py-0.5 rounded-full bg-secondary ${season.accentColor} bg-opacity-10 border border-border/50`}>
                    Temporada Especial
                 </span>
               )}
            </p>
          </div>
          {season.id !== 'default' && (
             <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-background to-secondary shadow-lg border border-border/50 ${season.accentColor}`}>
                <SeasonIcon className="w-6 h-6" />
             </div>
          )}
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Versículo y acciones */}
          <div className="lg:col-span-2 space-y-6">
            <VerseOfDay />
            <QuickActions />
            <DailyChallenges />
          </div>

          {/* Columna derecha - Progreso */}
          <div className="space-y-6">
            <ProgressRing />
            <PopularThemes />
          </div>
        </div>
        
      </div>
    </AppShell>
  )
}
