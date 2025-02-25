import { SignUpForm } from "@/components/sign-up-form";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[350px] space-y-6 mt-[20vh]">
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Image
              src="/assets/placeholder-logo.png"
              alt="StudyBuddy Logo"
              width={48}
              height={48}
              className="rounded-full bg-gray-200"
              priority
            />
            <h1 className="text-2xl font-bold">StudyBuddy</h1>
          </div>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}
