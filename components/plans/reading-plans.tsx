"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarRange, CheckCircle2, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
  {
    id: 1,
    title: "Biblia en un Año",
    description: "Lee toda la Biblia en 365 días con pasajes del Antiguo y Nuevo Testamento diariamente.",
    duration: "365 días",
    progress: 12,
    active: true,
    image: "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "Nuevo Testamento",
    description: "Un recorrido profundo por la vida de Jesús y la iglesia primitiva.",
    duration: "90 días",
    progress: 0,
    active: false,
    image: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
  },
  {
    id: 3,
    title: "Salmos y Proverbios",
    description: "Sabiduría diaria y alabanza para fortalecer tu espíritu.",
    duration: "30 días",
    progress: 0,
    active: false,
    image: "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
  },
  {
    id: 4,
    title: "Evangelios Sinópticos",
    description: "Estudio comparativo de Mateo, Marcos y Lucas.",
    duration: "45 días",
    progress: 0,
    active: false,
    image: "bg-gradient-to-br from-indigo-500/20 to-cyan-500/20"
  }
]

export function ReadingPlans() {
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
            <Card className="h-full flex flex-col border-muted shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={plan.active ? "default" : "secondary"} className="text-xs">
                    {plan.active ? "En Progreso" : "Disponible"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                     <Clock className="h-3 w-3" /> {plan.duration}
                  </span>
                </div>
                <CardTitle className="text-xl">{plan.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground mb-4">
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
              <CardFooter className="pt-0">
                {plan.active ? (
                  <Button className="w-full" size="sm">
                    Continuar Lectura <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" size="sm">
                    Comenzar Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
