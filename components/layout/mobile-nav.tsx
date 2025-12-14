"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, Home, MessageCircle, Menu, CalendarRange, Heart, StickyNote, Network, Trophy, Users } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const mainNavItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
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
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className="text-[10px] font-medium">{item.label}</span>
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
          <SheetContent side="right" className="w-[80%] sm:w-[385px]">
            <SheetHeader className="text-left mb-6">
              <SheetTitle>Menú Principal</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2">
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
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
