"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, Home, MessageCircle, Menu, CalendarRange, Heart, StickyNote, Network, Trophy, Users, Crown, History } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { useUserProgress } from "@/hooks/use-user-progress"

const mainNavItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/planes", icon: CalendarRange, label: "Planes" },
]

const allNavItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/chat", icon: MessageCircle, label: "Chat IA" },
  { href: "/planes", icon: CalendarRange, label: "Planes de Lectura" },
  { href: "/oraciones", icon: Heart, label: "Muro de Oración" },
  { href: "/notas", icon: StickyNote, label: "Mis Notas" },
  { href: "/explorador", icon: Network, label: "Explorador Temático" },
  { href: "/viaje", icon: Trophy, label: "Mi Viaje" },
  { href: "/grupos", icon: Users, label: "Comunidad" },
  { href: "/contexto-historico", icon: History, label: "Contexto Histórico" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { progress } = useUserProgress()
  const [isBibleGlowing, setIsBibleGlowing] = useState(true)
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calcular porcentaje para el siguiente nivel
  const progressPercent = (progress.xp / progress.xpParaSiguienteNivel) * 100

  useEffect(() => {
    // Resetear el brillo siempre que cambie la ruta o al montar
    setIsBibleGlowing(true)

    // Limpiar timeout anterior si existe
    if (glowTimeoutRef.current) {
      clearTimeout(glowTimeoutRef.current)
    }

    // Si estamos en la biblia, iniciar contador para apagar el brillo
    if (pathname === '/biblia') {
      glowTimeoutRef.current = setTimeout(() => {
        setIsBibleGlowing(false)
      }, 6660) // 6.66 segundos
    }

    return () => {
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current)
      }
    }
  }, [pathname])

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          const isBible = item.label === "Biblia"
          const showBibleGlow = isBible && isBibleGlowing
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-1000",
                isActive && !isBible ? "text-primary" : "text-muted-foreground",
                showBibleGlow && "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]",
                isBible && !showBibleGlow && isActive && "text-primary" // Estado "normal" activo cuando se apaga
              )}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-all duration-1000", 
                  isActive && !isBible && "text-primary",
                  showBibleGlow && "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]",
                  isBible && !showBibleGlow && isActive && "text-primary"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-1000",
                showBibleGlow && "font-bold text-amber-400",
                isBible && !showBibleGlow && isActive && "text-primary font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:text-primary",
              )}
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-medium">Menú</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-[385px] overflow-y-auto">
            <SheetHeader className="text-left mb-6">
              <SheetTitle>Menú Principal</SheetTitle>
            </SheetHeader>

            {/* Perfil Resumen Móvil */}
            <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name || "Invitado"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Nivel {progress.nivel} • {progress.titulo}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">XP Total</span>
                  <span className="font-bold text-foreground">{progress.xp}/{progress.xpParaSiguienteNivel}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              {!user && (
                <p className="text-xs text-muted-foreground mt-3 italic">
                  Guarda tus datos iniciando sesión
                </p>
              )}
            </div>

            <div className="grid gap-1">
              {allNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-primary/10 text-primary"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              {user ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                >
                  Cerrar sesión
                </Button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
