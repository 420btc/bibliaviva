import type React from "react"
import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { MobileHeader } from "./mobile-header"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto overflow-x-hidden h-full pb-20 pt-14 lg:pt-0 lg:pb-0 scroll-smooth p-0">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
