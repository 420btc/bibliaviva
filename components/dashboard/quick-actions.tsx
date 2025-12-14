"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Book, MessageCircle, Network, Trophy } from "lucide-react"
import { motion } from "framer-motion"

const actions = [
  {
    href: "/biblia",
    icon: Book,
    label: "Continuar Lectura",
    description: "Juan 3:14",
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

export function QuickActions() {
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
              <Card className="glass-card p-4 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}
                >
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <h3 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                  {action.label}
                </h3>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
