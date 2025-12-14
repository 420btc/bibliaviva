import { AppShell } from "@/components/layout/app-shell"
import { VerseOfDay } from "@/components/dashboard/verse-of-day"
import { ProgressRing } from "@/components/dashboard/progress-ring"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyChallenges } from "@/components/dashboard/daily-challenges"
import { PopularThemes } from "@/components/dashboard/popular-themes"

export default function HomePage() {
  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">Bienvenido de vuelta</h1>
          <p className="text-muted-foreground">Continúa tu viaje espiritual hoy</p>
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Versículo y acciones */}
          <div className="lg:col-span-2 space-y-6">
            <VerseOfDay />
            <QuickActions />
            <DailyChallenges />
            <PopularThemes />
          </div>

          {/* Columna derecha - Progreso */}
          <div className="space-y-6">
            <ProgressRing />
          </div>
        </div>
        
        {/* Footer Créditos */}
        <div className="mt-12 mb-6 flex justify-center">
          <a 
            href="https://carlosfr.es" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium text-sm transition-all duration-300 hover:scale-105 border border-yellow-500/20 hover:border-yellow-500/50"
          >
            <span>Web made by:</span>
            <span className="font-bold underline decoration-yellow-500/30 group-hover:decoration-yellow-500 transition-all">carlosfr.es</span>
          </a>
        </div>
      </div>
    </AppShell>
  )
}
