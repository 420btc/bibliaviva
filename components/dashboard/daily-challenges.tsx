"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { desafiosDiarios } from "@/lib/gamification"
import { CheckCircle2, Circle, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function DailyChallenges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Desafíos del Día</h2>
        <span className="text-sm text-muted-foreground">1/4 completados</span>
      </div>
      <Card className="glass-card divide-y divide-border">
        {desafiosDiarios.map((desafio, index) => (
          <motion.div
            key={desafio.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              {desafio.completado ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground text-sm">{desafio.nombre}</p>
                <p className="text-xs text-muted-foreground">{desafio.descripcion}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                <Zap className="w-4 h-4" />+{desafio.xp}
              </span>
              {!desafio.completado && (
                <Button size="sm" variant="secondary">
                  Ir
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </Card>
    </motion.div>
  )
}
