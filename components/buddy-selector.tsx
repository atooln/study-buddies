"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const buddies = [
  {
    id: "fox",
    name: "Fox",
    image: "../public/assets/fox.svg",
  },
  {
    id: "frog",
    name: "Frog",
    image: "../public/assets/frog.svg",
  },
  {
    id: "rabbit",
    name: "Rabbit",
    image: "../public/assets/bunny.svg",
  },
];

export function BuddySelector() {
  const [selectedBuddy, setSelectedBuddy] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedBuddy) {
      localStorage.setItem("selectedBuddy", selectedBuddy);
      router.push("/session-duration");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Select a buddy</h2>
      <div className="grid grid-cols-3 gap-4">
        {buddies.map((buddy) => (
          <Card
            key={buddy.id}
            className={`p-6 cursor-pointer transition-all relative overflow-hidden ${
              selectedBuddy === buddy.id
                ? "border-2 border-gray-400"
                : "hover:border-gray-200"
            }`}
            onClick={() => setSelectedBuddy(buddy.id)}
          >
            <div className="aspect-square flex items-center justify-center">
              <img
                src={buddy.image || "/placeholder.svg"}
                alt={buddy.name}
                className="w-32 h-32 object-contain"
              />
            </div>
            <p className="text-center mt-2 font-medium">{buddy.name}</p>
            <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-20"></div>
          </Card>
        ))}
      </div>
      <Button
        className="w-full"
        disabled={!selectedBuddy}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
}
