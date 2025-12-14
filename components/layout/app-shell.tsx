import type React from "react"
import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
