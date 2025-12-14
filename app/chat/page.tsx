import { AppShell } from "@/components/layout/app-shell"
import { AIChat } from "@/components/chat/ai-chat"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  return (
    <AppShell>
      <div className="h-[calc(100vh-5rem)] lg:h-screen p-4 lg:p-6 flex flex-col">
        <div className="flex-1 min-h-0">
          <Suspense fallback={
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <AIChat />
          </Suspense>
        </div>
      </div>
    </AppShell>
  )
}
