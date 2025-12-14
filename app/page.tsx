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
      </div>
    </AppShell>
  )
}
