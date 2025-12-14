"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useUserProgress } from "@/hooks/use-user-progress"
import {
  Book,
  MessageCircle,
  Network,
  Users,
  Trophy,
  Settings,
  LogOut,
  Sparkles,
  Home,
  Crown,
  Heart,
  StickyNote,
  CalendarRange
} from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/planes", icon: CalendarRange, label: "Planes" },
  { href: "/chat", icon: MessageCircle, label: "Chat IA" },
  { href: "/oraciones", icon: Heart, label: "Oraciones" },
  { href: "/notas", icon: StickyNote, label: "Mis Notas" },
  { href: "/explorador", icon: Network, label: "Explorador" },
  { href: "/viaje", icon: Trophy, label: "Mi Viaje" },
  { href: "/grupos", icon: Users, label: "Comunidad" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { progress } = useUserProgress()

  // Calcular porcentaje para el siguiente nivel
  const progressPercent = (progress.xp / progress.xpParaSiguienteNivel) * 100

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/30 backdrop-blur-md h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative w-12 h-12">
            <Image 
              src="/biblia.png" 
              alt="Logo Biblia Viva" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground tracking-tight">Biblia Viva</h1>
            <p className="text-xs text-muted-foreground">Tu guía espiritual</p>
          </div>
        </div>

        <div className="mb-8 p-4 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name || "Invitado"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Nivel {progress.nivel} • {progress.titulo}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">XP</span>
              <span className="font-medium text-foreground">{progress.xp}/{progress.xpParaSiguienteNivel}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 mb-1 font-medium",
                    isActive
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 mb-2"
        >
          <Settings className="w-5 h-5" />
          Configuración
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-500 hover:bg-red-500/10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
