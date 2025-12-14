"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, Home, MessageCircle, Network, Users } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/biblia", icon: Book, label: "Biblia" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/explorador", icon: Network, label: "Explorar" },
  { href: "/grupos", icon: Users, label: "Grupos" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
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
      </div>
    </nav>
  )
}
