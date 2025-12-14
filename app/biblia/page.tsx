import { AppShell } from "@/components/layout/app-shell"
import { BibleReader } from "@/components/bible/bible-reader"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function BibliaPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <BibleReader />
      </Suspense>
    </AppShell>
  )
}
