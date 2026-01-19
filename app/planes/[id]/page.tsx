import { AppShell } from "@/components/layout/app-shell"
import { PlanDetail } from "@/components/plans/plan-detail"

export default async function PlanDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <PlanDetail planId={parseInt(params.id)} />
      </div>
    </AppShell>
  )
}
