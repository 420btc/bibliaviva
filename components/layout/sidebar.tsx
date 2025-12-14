"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Book,
  Home,
  MessageCircle,
  Network,
  Users,
  Map,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/chat", icon: MessageCircle, label: "Chat IA" },
  { href: "/explorador", icon: Network, label: "Explorador" },
  { href: "/viaje", icon: Map, label: "Mi Viaje" },
  { href: "/grupos", icon: Users, label: "Grupos" },
  { href: "/logros", icon: Trophy, label: "Logros" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary glow-primary">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-sidebar-foreground">Biblia Viva</span>
            <span className="text-xs text-muted-foreground">Estudio Interactivo</span>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent text-sidebar-primary",
                !isActive && "text-sidebar-foreground/70",
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Configuración */}
      <div className="p-2 border-t border-sidebar-border">
        <Link
          href="/configuracion"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Configuración</span>}
        </Link>
      </div>

      {/* Botón colapsar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border shadow-md"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>
    </aside>
  )
}
