import { Workspace } from "@/components/workspace"
import { PageHeader } from "@/components/page-header"

export default function WorkspacePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <PageHeader showExitButton />
      <Workspace />
    </main>
  )
}

