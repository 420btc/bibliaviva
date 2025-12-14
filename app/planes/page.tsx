import { AppShell } from "@/components/layout/app-shell"
import { ReadingPlans } from "@/components/plans/reading-plans"

export default function PlansPage() {
  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <ReadingPlans />
      </div>
    </AppShell>
  )
}
