import Image from "next/image";
import Link from "next/link";

export function WorkspaceHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/placeholder-logo.png"
          alt="StudyBuddy Logo"
          width={40}
          height={40}
        />
        <h1 className="text-2xl font-bold">StudyBuddy</h1>
      </div>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Exit Session
      </Link>
    </div>
  );
}
