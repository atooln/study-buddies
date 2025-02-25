import { BuddySelector } from "@/components/buddy-selector";
import Image from "next/image";

export default function SelectBuddyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[600px] space-y-6 mt-[20vh]">
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Image
              src="/assets/placeholder-logo.png"
              alt="StudyBuddy Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold">StudyBuddy</h1>
          </div>
        </div>
        <BuddySelector />
      </div>
    </main>
  );
}
