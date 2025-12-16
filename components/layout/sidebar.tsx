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
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { useState } from "react"

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/viaje", icon: Trophy, label: "Mi Viaje" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/oraciones", icon: Heart, label: "Oraciones" },
  { href: "/explorador", icon: Network, label: "Explorador" },
  { href: "/grupos", icon: Users, label: "Comunidad" },
  { href: "/chat", icon: MessageCircle, label: "Chat IA" },
  { href: "/planes", icon: CalendarRange, label: "Planes" },
  { href: "/notas", icon: StickyNote, label: "Mis Notas" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { progress } = useUserProgress()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Calcular porcentaje para el siguiente nivel
  const progressPercent = (progress.xp / progress.xpParaSiguienteNivel) * 100

  return (
    <>
      <aside className="hidden lg:flex flex-col w-72 border-r border-border bg-card/30 backdrop-blur-md h-screen sticky top-0 lg:in-[.zen-reading]:hidden lg:in-[.zen-reading.zen-sidebar-peek]:flex">
        <div className="flex flex-col h-full">
          <div className="p-6 pb-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-14 h-14">
                <Image 
                  src="/biblia.png" 
                  alt="Logo Biblia Viva" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-foreground tracking-tight">Biblia Viva</h1>
                <p className="text-sm text-muted-foreground">Tu guía espiritual</p>
              </div>
            </div>

            <div className="mb-6 p-5 rounded-2xl bg-secondary/50 border border-border/50 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground truncate">
                    {user?.name || "Invitado"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    Nivel {progress.nivel} • {progress.titulo}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">XP Total</span>
                  <span className="font-bold text-foreground">{progress.xp}/{progress.xpParaSiguienteNivel}</span>
                </div>
                <Progress value={progressPercent} className="h-2.5" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-4 px-4 py-6 text-base font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className={cn("w-6 h-6", isActive && "text-primary")} />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-border mt-auto bg-card/10">
            <Button
              variant="ghost"
              className="w-full justify-start gap-4 px-4 py-6 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 mb-2"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-6 h-6" />
              Configuración
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-4 px-4 py-6 text-base font-medium text-red-400 hover:text-red-500 hover:bg-red-500/10"
              onClick={logout}
            >
              <LogOut className="w-6 h-6" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
