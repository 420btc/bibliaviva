import { AppShell } from "@/components/layout/app-shell"
import { GroupsPage } from "@/components/groups/groups-page"

export default function GruposPage() {
  return (
    <AppShell>
      <div className="h-full w-full">
        <GroupsPage />
      </div>
    </AppShell>
  )
}
