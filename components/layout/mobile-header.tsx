"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUserProgress } from "@/hooks/use-user-progress"

export function MobileHeader() {
  const { user } = useAuth()
  const { progress } = useUserProgress()

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-border z-40 px-4 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <Image 
            src="/biblia.png" 
            alt="Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="font-serif font-bold text-lg text-white tracking-tight">
          Biblia Viva
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Link href="/viaje" className="flex items-center gap-2 bg-secondary/50 rounded-full pl-2 pr-1 py-1 border border-border/50">
            <div className="flex flex-col items-end leading-none mr-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Nvl {progress.nivel}</span>
            </div>
            <Avatar className="w-7 h-7 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link href="/login" className="text-sm font-medium text-primary">
            Entrar
          </Link>
        )}
      </div>
    </header>
  )
}
