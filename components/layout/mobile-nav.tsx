"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, Home, MessageCircle, Menu, CalendarRange, Heart, StickyNote, Network, Trophy, Users, History, X, LogOut, Settings, Crown } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { useUserProgress } from "@/hooks/use-user-progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SettingsDialog } from "@/components/settings/settings-dialog"

const mainNavItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/planes", icon: CalendarRange, label: "Planes" },
]

const menuItems = [
  { href: "/", icon: Home, label: "Inicio", desc: "Vista general y accesos rápidos" },
  { href: "/biblia", icon: Book, label: "Biblia", desc: "Lectura y búsqueda" },
  { href: "/chat", icon: MessageCircle, label: "Chat IA", desc: "Pregunta y aprende" },
  { href: "/planes", icon: CalendarRange, label: "Planes", desc: "Rutinas de lectura" },
  { href: "/viaje", icon: Trophy, label: "Mi Viaje", desc: "Logros y estadísticas" },
  { href: "/oraciones", icon: Heart, label: "Oraciones", desc: "Comparte y recibe apoyo" },
  { href: "/explorador", icon: Network, label: "Explorador", desc: "Busca por temas y emociones" },
  { href: "/grupos", icon: Users, label: "Comunidad", desc: "Grupos de estudio bíblico" },
  { href: "/notas", icon: StickyNote, label: "Mis Notas", desc: "Tus reflexiones personales" },
  { href: "/contexto-historico", icon: History, label: "Contexto Histórico", desc: "Contexto y mapas" },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { progress } = useUserProgress()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isBibleGlowing, setIsBibleGlowing] = useState(true)
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calcular porcentaje para el siguiente nivel
  const progressPercent = (progress.xp / progress.xpParaSiguienteNivel) * 100

  useEffect(() => {
    setIsBibleGlowing(true)
    if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current)
    if (pathname === '/biblia') {
      glowTimeoutRef.current = setTimeout(() => setIsBibleGlowing(false), 6660)
    }
    return () => { if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current) }
  }, [pathname])

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#424242] safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          const isBible = item.label === "Biblia"
          const showBibleGlow = isBible && isBibleGlowing
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40",
                isActive ? "text-white bg-[#1F1F1F]" : "text-[#BDBDBD] hover:text-white hover:bg-[#1F1F1F]",
                showBibleGlow && "text-white bg-[#1F1F1F] shadow-[0_0_12px_rgba(255,255,255,0.25)]",
              )}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-transform duration-300", 
                  isActive && "scale-110",
                  showBibleGlow && "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] animate-pulse"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "font-semibold" : ""
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
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all text-[#BDBDBD] hover:text-white hover:bg-[#1F1F1F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                open && "text-white bg-[#2C2C2C]"
              )}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="text-[10px] font-medium">{open ? "Cerrar" : "Menú"}</span>
            </button>
          </SheetTrigger>
          {/* 
            Configuración Full Screen (menos header y footer) 
            top-14 (56px header)
            bottom-[bottom-nav-height] (approx 70px)
          */}
          <SheetContent 
            side="bottom" 
            overlayClassName="bg-transparent pointer-events-none"
            className="fixed top-14 bottom-[4.5rem] left-0 right-0 w-full min-h-0 max-h-[calc(100dvh-3.5rem-4.5rem)] border-none p-0 bg-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in slide-in-from-bottom-5 focus:outline-none z-[60] rounded-none shadow-none flex flex-col overflow-hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menú</SheetTitle>
              <SheetDescription>Navegación y acciones de cuenta</SheetDescription>
            </SheetHeader>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-4 pb-10 space-y-6">
              
              {/* Sección de Usuario Minimalista */}
              <div className="relative overflow-hidden rounded-3xl border border-[#D2B48C]/20 bg-neutral-950 p-5 text-[#D2B48C] shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                <div className="absolute top-2 right-6 opacity-20">
                  <Crown className="w-24 h-24 text-[#D2B48C]/30" />
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <Avatar className="w-14 h-14 border border-[#D2B48C]/20 bg-[#D2B48C]/5 ring-2 ring-[#D2B48C]/10">
                    <AvatarFallback className="bg-[#D2B48C]/10 text-[#D2B48C] text-base font-semibold">
                      {user?.name?.substring(0, 2).toUpperCase() || "BV"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-[#D2B48C]/50">Tu progreso</p>
                    <h3 className="truncate text-lg font-semibold tracking-tight text-[#D2B48C]">
                      {user ? user.name : "Biblia Viva"}
                    </h3>
                    <p className="text-xs text-[#D2B48C]/50">
                      {user ? `Nivel ${progress.nivel} · ${progress.titulo}` : "Inicia sesión para guardar tu progreso"}
                    </p>
                  </div>
                </div>

                {user && (
                  <>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-[#D2B48C]/20 bg-[#D2B48C]/5 p-3 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[#D2B48C]/50">Nivel</div>
                        <div className="text-lg font-semibold text-[#D2B48C]">{progress.nivel}</div>
                      </div>
                      <div className="rounded-xl border border-[#D2B48C]/20 bg-[#D2B48C]/5 p-3 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[#D2B48C]/50">XP Total</div>
                        <div className="text-lg font-semibold text-[#D2B48C]">{progress.xp}</div>
                      </div>
                      <div className="rounded-xl border border-[#D2B48C]/20 bg-[#D2B48C]/5 p-3 text-center">
                        <div className="text-[10px] uppercase tracking-wider text-[#D2B48C]/50">Racha</div>
                        <div className="text-lg font-semibold text-[#D2B48C]">{progress.racha}</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#D2B48C]/50">
                        <span>Progreso al siguiente nivel</span>
                        <span className="text-[#D2B48C]/80">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 bg-[#D2B48C]/10 [&>div]:bg-[#D2B48C]" />
                    </div>
                  </>
                )}
              </div>

              {/* Grid de Navegación */}
              <div className="grid grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col gap-2 p-4 rounded-xl bg-[#111111] border border-[#424242] transition-all active:scale-95 hover:bg-[#1F1F1F] hover:border-[#616161] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <item.icon className="w-6 h-6 text-[#D2B48C]" />
                    <div>
                      <span className="block font-medium text-sm text-white">{item.label}</span>
                      <span className="block text-[10px] text-[#BDBDBD] leading-tight mt-0.5">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Acciones de Cuenta */}
              <div className="pt-2">
                 {!user ? (
                   <Link href="/login" onClick={() => setOpen(false)}>
                     <Button className="w-full h-12 text-base rounded-xl bg-white text-black hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-white/60" size="lg">
                       Iniciar Sesión / Registrarse
                     </Button>
                   </Link>
                 ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 rounded-xl border-[#424242] text-white hover:bg-[#1F1F1F] hover:border-[#616161] focus-visible:ring-2 focus-visible:ring-white/60"
                        onClick={() => {
                          setOpen(false)
                          setSettingsOpen(true)
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" /> Ajustes
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="h-12 rounded-xl text-white hover:bg-[#1F1F1F] focus-visible:ring-2 focus-visible:ring-white/60"
                        onClick={() => {
                          setOpen(false)
                          logout()
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Salir
                      </Button>
                   </div>
                 )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </nav>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
