import { AppShell } from "@/components/layout/app-shell"
import { PrayerWall } from "@/components/prayers/prayer-wall"

export default function PrayersPage() {
  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <PrayerWall />
      </div>
    </AppShell>
  )
}
