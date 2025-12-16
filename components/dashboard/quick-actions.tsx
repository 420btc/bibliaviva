"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Book, MessageCircle, Network, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { getProgressAction } from "@/actions/progress"
import { findBookById } from "@/lib/bible-data"

export function QuickActions() {
  const { user } = useAuth()
  const [readingInfo, setReadingInfo] = useState({ 
    description: "Comenzar Lectura", 
    href: "/biblia" 
  })

  useEffect(() => {
    async function loadProgress() {
      if (user?.id) {
        try {
          const res = await getProgressAction(user.id)
          if (res.success && res.data) {
            const book = findBookById(res.data.bookId)
            if (book) {
              setReadingInfo({
                description: `${book.nombre} ${res.data.chapter}`,
                href: `/biblia?libro=${res.data.bookId}&capitulo=${res.data.chapter}`
              })
            }
          } else {
             // Si no hay progreso guardado, pero hay usuario, quizás mostrar Génesis 1
             setReadingInfo({
                description: "Génesis 1",
                href: "/biblia?libro=genesis&capitulo=1"
             })
          }
        } catch (error) {
          console.error("Failed to load progress", error)
        }
      }
    }
    loadProgress()
  }, [user])

  const actions = [
    {
      href: readingInfo.href,
      icon: Book,
      label: "Continuar Lectura",
      description: readingInfo.description,
      color: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-400",
    },
    {
      href: "/chat",
      icon: MessageCircle,
      label: "Devocional IA",
      description: "Reflexión diaria",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-400",
    },
    {
      href: "/explorador",
      icon: Network,
      label: "Explorar Temas",
      description: "8 temas disponibles",
      color: "from-cyan-500/20 to-teal-500/20",
      iconColor: "text-cyan-400",
    },
    {
      href: "/viaje",
      icon: Trophy,
      label: "Quiz del Día",
      description: "+25 XP disponible",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Acciones Rápidas</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <Link href={action.href}>
              <Card className="glass-card p-3 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-500 group cursor-pointer h-full gap-2 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] hover:bg-white/5 active:scale-95">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110`}
                >
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors tracking-tight leading-tight">
                    {action.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-tight">{action.description}</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
