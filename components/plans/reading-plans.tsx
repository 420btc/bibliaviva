"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarRange, CheckCircle2, Clock, ArrowRight, Loader2, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { getReadingPlansAction, joinReadingPlanAction, leaveReadingPlanAction, type ReadingPlan } from "@/actions/plans"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ReadingPlans() {
  const { user } = useAuth()
  const router = useRouter()
  const [plans, setPlans] = useState<ReadingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [joiningId, setJoiningId] = useState<number | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await getReadingPlansAction(user?.id)
        if (res.success && res.data) {
          setPlans(res.data)
        }
      } catch (e) {
        console.error("Error loading plans", e)
      } finally {
        setIsLoading(false)
      }
    }
    loadPlans()
  }, [user])

  const handleJoin = async (planId: number) => {
    if (!user) {
      toast.error("Debes iniciar sesión para unirte a un plan")
      return
    }
    
    setJoiningId(planId)
    try {
      const res = await joinReadingPlanAction(user.id, planId)
      if (res.success) {
        toast.success("¡Te has unido al plan!")
        // Recargar planes localmente para reflejar cambios
        const updated = await getReadingPlansAction(user.id)
        if (updated.success && updated.data) setPlans(updated.data)
      } else {
        toast.error("No se pudo unir al plan")
      }
    } catch (e) {
      console.error(e)
      toast.error("Ocurrió un error")
    } finally {
      setJoiningId(null)
    }
  }

  const handleContinue = (planId: number) => {
    router.push(`/planes/${planId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planes de Lectura</h2>
          <p className="text-muted-foreground">Estructura tu estudio y mantén la constancia.</p>
        </div>
        <Button className="w-full md:w-auto">
          <CalendarRange className="mr-2 h-4 w-4" />
          Crear Plan Personalizado
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col border-muted shadow-sm hover:shadow-md transition-shadow overflow-hidden">
               {/* Header visual con gradiente */}
               <div className={`h-2 ${plan.image_gradient || "bg-primary/10"}`} />
               
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={plan.active ? "default" : "secondary"} className="text-xs">
                    {plan.active ? "En Progreso" : "Disponible"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                     <Clock className="h-3 w-3" /> {plan.duration_days} días
                  </span>
                </div>
                <CardTitle className="text-xl">{plan.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {plan.description}
                </p>
                {plan.active && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Progreso</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-1.5" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 bg-muted/20 mt-auto p-4">
                {plan.active ? (
                  <Button 
                    className="w-full gap-2" 
                    size="sm"
                    onClick={() => handleContinue(plan.id)}
                  >
                    Continuar Lectura <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors" 
                    size="sm"
                    onClick={() => handleJoin(plan.id)}
                    disabled={joiningId === plan.id}
                  >
                    {joiningId === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                    Comenzar Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        
        {plans.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
                <p>No se encontraron planes disponibles en este momento.</p>
                <Button variant="link" onClick={() => window.location.reload()}>Recargar</Button>
            </div>
        )}
      </div>
    </div>
  )
}
