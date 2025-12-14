"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dailyVerses } from "@/lib/bible-data"
import { Share2, Bookmark, Volume2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function VerseOfDay() {
  const [verse, setVerse] = useState(dailyVerses[0])

  useEffect(() => {
    const today = new Date().getDate()
    const index = today % dailyVerses.length
    setVerse(dailyVerses[index])
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden glass-card p-6 lg:p-8">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Encabezado */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-primary">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Versículo del Día</span>
          </div>

          {/* Versículo */}
          <blockquote className="verse-text text-xl lg:text-2xl text-foreground mb-4 text-pretty">
            &ldquo;{verse.texto}&rdquo;
          </blockquote>

          {/* Referencia */}
          <p className="text-primary font-semibold mb-6">
            {verse.libro} {verse.capitulo}:{verse.versiculo}
            <span className="text-muted-foreground font-normal ml-2">— {verse.version}</span>
          </p>

          {/* Acciones */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <Volume2 className="w-4 h-4" />
              Escuchar
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <Bookmark className="w-4 h-4" />
              Guardar
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            <Button variant="default" size="sm" className="gap-2 gradient-primary border-0">
              <Sparkles className="w-4 h-4" />
              Generar Arte IA
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
