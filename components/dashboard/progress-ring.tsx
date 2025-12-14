"use client"

import { Card } from "@/components/ui/card"
import { defaultUserProgress, calcularNivel } from "@/lib/gamification"
import { Flame, Trophy, BookOpen, Target } from "lucide-react"
import { motion } from "framer-motion"

export function ProgressRing() {
  const user = defaultUserProgress
  const nivelInfo = calcularNivel(user.xp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass-card p-6">
        <div className="flex flex-col items-center">
          {/* Anillo de progreso */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Fondo */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              {/* Progreso */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${nivelInfo.progreso * 2.64} 264`}
                initial={{ strokeDasharray: "0 264" }}
                animate={{ strokeDasharray: `${nivelInfo.progreso * 2.64} 264` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(0.55 0.2 260)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.18 280)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">Nv.{nivelInfo.nivel}</span>
              <span className="text-xs text-muted-foreground">{user.xp} XP</span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-foreground mb-1">{nivelInfo.nombre}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {user.xpParaSiguienteNivel - user.xp} XP para siguiente nivel
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-lg font-bold text-foreground">{user.racha}</p>
                <p className="text-xs text-muted-foreground">Días racha</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="text-lg font-bold text-foreground">{user.versiculosLeidos}</p>
                <p className="text-xs text-muted-foreground">Versículos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Trophy className="w-5 h-5 text-accent" />
              <div>
                <p className="text-lg font-bold text-foreground">{user.insignias.length}</p>
                <p className="text-xs text-muted-foreground">Insignias</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Target className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-lg font-bold text-foreground">{user.quizzesCompletados}</p>
                <p className="text-xs text-muted-foreground">Quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
