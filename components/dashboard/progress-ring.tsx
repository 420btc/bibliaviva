"use client"

import { Card } from "@/components/ui/card"
import { calcularNivel } from "@/lib/gamification"
import { useUserProgress } from "@/hooks/use-user-progress"
import { Flame, Trophy, BookOpen, Target } from "lucide-react"
import { motion } from "framer-motion"

export function ProgressRing() {
  const { progress: user } = useUserProgress()
  const nivelInfo = calcularNivel(user.xp)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass-card p-6 border-[#D2B48C]/20 bg-[#D2B48C]/5">
        <div className="flex flex-col items-center">
          {/* Anillo de progreso */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Fondo */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#D2B48C]/20" />
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
                style={{ filter: "drop-shadow(0 0 4px rgba(210, 180, 140, 0.5))" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D2B48C" />
                  <stop offset="100%" stopColor="#C19A6B" />
                </linearGradient>
              </defs>
            </svg>
            {/* Centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#D2B48C]">Nv.{nivelInfo.nivel}</span>
              <span className="text-xs text-[#D2B48C]/60">{user.xp} XP</span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-lg font-semibold text-[#D2B48C] mb-1">{nivelInfo.nombre}</h3>
          <p className="text-sm text-[#D2B48C]/60 mb-4">
            {user.xpParaSiguienteNivel - user.xp} XP para siguiente nivel
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#D2B48C]/10">
              <Flame className="w-5 h-5 text-[#D2B48C]" />
              <div>
                <p className="text-lg font-bold text-[#D2B48C]">{user.racha}</p>
                <p className="text-xs text-[#D2B48C]/60">Días racha</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#D2B48C]/10">
              <BookOpen className="w-5 h-5 text-[#D2B48C]" />
              <div>
                <p className="text-lg font-bold text-[#D2B48C]">{user.versiculosLeidos}</p>
                <p className="text-xs text-[#D2B48C]/60">Versículos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#D2B48C]/10">
              <Trophy className="w-5 h-5 text-[#D2B48C]" />
              <div>
                <p className="text-lg font-bold text-[#D2B48C]">{user.insignias.length}</p>
                <p className="text-xs text-[#D2B48C]/60">Insignias</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#D2B48C]/10">
              <Target className="w-5 h-5 text-[#D2B48C]" />
              <div>
                <p className="text-lg font-bold text-[#D2B48C]">{user.quizzesCompletados}</p>
                <p className="text-xs text-[#D2B48C]/60">Quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
