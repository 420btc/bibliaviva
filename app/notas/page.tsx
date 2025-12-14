import { AppShell } from "@/components/layout/app-shell"
import { UserNotes } from "@/components/notes/user-notes"

export default function NotesPage() {
  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <UserNotes />
      </div>
    </AppShell>
  )
}
