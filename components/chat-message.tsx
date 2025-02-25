import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  role: "assistant" | "user"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        {role === "assistant" ? <AvatarImage src="/ai-assistant.png" alt="AI Assistant" /> : null}
        <AvatarFallback>{role === "assistant" ? "AI" : "You"}</AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg px-3 py-2 max-w-[80%] ${
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {content}
      </div>
    </div>
  )
}

