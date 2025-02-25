"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Image, Mic, Send, Sparkles } from "lucide-react"

interface Message {
  role: "assistant" | "user"
  content: string
  id: string
}

const suggestions = ["Create Notes from PDF", "Draft an outline", "Make a flowchart", "Need encouragement?"]

export function StudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your study assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
      },
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've received your message. How else can I assist you?",
      },
    ]

    setMessages(newMessages)
    setInput("")

    // Scroll to bottom after messages update
    setTimeout(scrollToBottom, 100)
  }

  return (
    <div className="flex flex-col rounded-2xl bg-white h-[calc(100vh-320px)]">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-semibold">Study Assistant</h2>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 pb-20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-slate-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid gap-2 mt-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto py-3 px-4 bg-slate-50 hover:bg-slate-100 border-0"
              onClick={() => {
                setInput(suggestion)
                handleSend(new Event("submit") as any)
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Image className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 px-0 flex-grow"
          />
          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-transparent">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

