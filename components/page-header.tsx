import Link from "next/link";
import Image from "next/image";

interface PageHeaderProps {
  showExitButton?: boolean;
  centered?: boolean;
}

export function PageHeader({
  showExitButton = false,
  centered = false,
}: PageHeaderProps) {
  return (
    <div
      className={`flex items-center p-6 ${
        centered ? "justify-center" : "justify-between"
      }`}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/assets/placeholder-logo.png"
          alt="StudyBuddy Logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold">StudyBuddy</h1>
      </div>
      {showExitButton && (
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Exit Session
        </Link>
      )}
    </div>
  );
}
