import { AppShell } from "@/components/layout/app-shell"
import { AIChat } from "@/components/chat/ai-chat"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function ChatPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <AIChat />
      </Suspense>
    </AppShell>
  )
}
