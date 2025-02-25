"use client"

import { Button } from "@/components/ui/button"
import { FileText, Layout, Presentation, LayoutTemplateIcon as Templates, PenTool } from "lucide-react"

export function BottomNav() {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-2 px-4">
      <Button variant="outline" size="sm" className="rounded-lg bg-white hover:bg-gray-50">
        <Templates className="h-4 w-4 mr-2" />
        Templates
      </Button>
      <Button variant="outline" size="sm" className="rounded-lg bg-white hover:bg-gray-50">
        <Layout className="h-4 w-4 mr-2" />
        Form
      </Button>
      <Button variant="outline" size="sm" className="rounded-lg bg-white hover:bg-gray-50">
        <FileText className="h-4 w-4 mr-2" />
        Notes
      </Button>
      <Button variant="outline" size="sm" className="rounded-lg bg-white hover:bg-gray-50">
        <Presentation className="h-4 w-4 mr-2" />
        Presentation
      </Button>
      <Button variant="outline" size="sm" className="rounded-lg bg-white hover:bg-gray-50">
        <PenTool className="h-4 w-4 mr-2" />
        Draw
      </Button>
    </div>
  )
}

