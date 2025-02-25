"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const durations = [
  { value: "2:00", label: "2:00 Hours" },
  { value: "4:00", label: "4:00 Hours" },
  { value: "custom", label: "Custom" },
]

export function DurationSelector() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [customDuration, setCustomDuration] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    const duration = selectedDuration === "custom" ? customDuration : selectedDuration
    if (duration) {
      // You might want to pass the duration as a query parameter or through state management
      router.push("/workspace")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">How long is your session?</h2>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-center">
          {durations.map((duration) => (
            <Button
              key={duration.value}
              variant={selectedDuration === duration.value ? "default" : "outline"}
              onClick={() => setSelectedDuration(duration.value)}
              className="flex gap-2"
            >
              <Clock className="h-4 w-4" />
              {duration.label}
            </Button>
          ))}
        </div>
        {selectedDuration === "custom" && (
          <div className="flex justify-center">
            <Input
              type="number"
              placeholder="Enter duration in minutes"
              className="max-w-[200px]"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
            />
          </div>
        )}
        <Button
          className="w-full mt-4"
          disabled={!selectedDuration || (selectedDuration === "custom" && !customDuration)}
          onClick={handleContinue}
        >
          Start Session
        </Button>
      </div>
    </div>
  )
}

