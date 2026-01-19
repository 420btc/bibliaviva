"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { getPlanDetailsAction, completePlanDayAction, type ReadingPlan, type PlanDay } from "@/actions/plans"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, CheckCircle2, Circle, BookOpen, Calendar, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function PlanDetail({ planId }: { planId: number }) {
  const { user } = useAuth()
  const router = useRouter()
  const [plan, setPlan] = useState<ReadingPlan | null>(null)
  const [days, setDays] = useState<PlanDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState<number | null>(null)

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await getPlanDetailsAction(planId, user?.id)
        if (res.success && res.plan) {
          setPlan(res.plan as any) // Casting por diferencias de tipo DB vs Frontend
          setDays(res.days || [])
        } else {
          toast.error("No se pudo cargar el plan")
          router.push("/planes")
        }
      } catch (e) {
        console.error("Error loading plan details", e)
        toast.error("Error al cargar detalles")
      } finally {
        setIsLoading(false)
      }
    }
    loadDetails()
  }, [planId, user, router])

  const handleCompleteDay = async (dayNumber: number) => {
    if (!user) return
    
    setIsCompleting(dayNumber)
    try {
      const res = await completePlanDayAction(user.id, planId, dayNumber)
      if (res.success) {
        toast.success(`¡Día ${dayNumber} completado!`)
        // Actualizar estado local
        setDays(prev => prev.map(d => 
          d.day_number === dayNumber ? { ...d, is_completed: true } : d
        ))
      } else {
        toast.error("No se pudo marcar como completado")
      }
    } catch (e) {
      console.error(e)
      toast.error("Ocurrió un error")
    } finally {
      setIsCompleting(null)
    }
  }

  const handleReadChapter = (book: string, chapter: number) => {
    router.push(`/biblia?libro=${encodeURIComponent(book)}&capitulo=${chapter}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando tu plan...</p>
      </div>
    )
  }

  if (!plan) return null

  // Calcular progreso
  const completedCount = days.filter(d => d.is_completed).length
  const totalDays = days.length
  const progress = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header y Navegación */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/planes")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{plan.title}</h1>
          <p className="text-sm text-muted-foreground">Volver a mis planes</p>
        </div>
      </div>

      {/* Tarjeta de Resumen */}
      <Card className="overflow-hidden border-none shadow-lg relative">
        <div className={`absolute inset-0 opacity-10 ${plan.image_gradient || "bg-primary"}`} />
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground max-w-2xl">
                {plan.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Badge variant="secondary" className="px-3 py-1">
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  {plan.duration_days} Días
                </Badge>
                <Badge variant="outline" className="px-3 py-1 bg-background/50">
                  {plan.category === 'biblia_completa' ? 'Biblia Completa' : 'Temático'}
                </Badge>
              </div>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border shadow-sm min-w-[200px]">
              <div className="text-center space-y-2">
                <span className="text-3xl font-bold text-primary">{progress}%</span>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completado</p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground pt-1">
                  {completedCount} de {totalDays} días
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Días */}
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Tu Ruta Diaria
          </h3>
          
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {days.map((day) => {
                const isCurrent = !day.is_completed && (day.day_number === completedCount + 1)
                
                return (
                  <Card 
                    key={day.day_number} 
                    className={cn(
                      "transition-all duration-300 border-l-4",
                      day.is_completed 
                        ? "border-l-green-500 bg-muted/30 opacity-75" 
                        : isCurrent
                          ? "border-l-primary shadow-md ring-1 ring-primary/20"
                          : "border-l-transparent hover:border-l-primary/50"
                    )}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="mt-1">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border",
                          day.is_completed 
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" 
                            : isCurrent
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {day.day_number}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className={cn("font-medium", day.is_completed && "line-through text-muted-foreground")}>
                            Lectura del Día
                          </h4>
                          {day.is_completed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                              Completado
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {day.readings.map((reading, idx) => (
                            reading.chapters.map(chapter => (
                              <Button 
                                key={`${idx}-${chapter}`}
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs gap-1.5"
                                onClick={() => handleReadChapter(reading.book, chapter)}
                              >
                                <BookOpen className="w-3 h-3 text-primary" />
                                {reading.book} {chapter}
                              </Button>
                            ))
                          ))}
                        </div>
                      </div>

                      <div className="self-center">
                        <Button
                          variant={day.is_completed ? "ghost" : "default"}
                          size="icon"
                          className={cn(
                            "rounded-full w-10 h-10 transition-all",
                            day.is_completed && "text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-500"
                          )}
                          onClick={() => !day.is_completed && handleCompleteDay(day.day_number)}
                          disabled={day.is_completed || isCompleting === day.day_number}
                          title={day.is_completed ? "Completado" : "Marcar como completado"}
                        >
                          {isCompleting === day.day_number ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : day.is_completed ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {days.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                  <p>No hay lecturas asignadas para este plan.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar Informativa */}
        <div className="hidden md:block space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Días Restantes</span>
                <span className="font-bold">{totalDays - completedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Racha Actual</span>
                <span className="font-bold text-orange-500">0 días</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 text-sm">Tip de Lectura</h4>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
              Intenta leer siempre a la misma hora para crear un hábito duradero. Antes de dormir suele ser un buen momento para reflexionar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
