import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
})

export const metadata: Metadata = {
  title: "StudyBuddy",
  description: "Your AI-powered study companion",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} font-sans`}>{children}</body>
    </html>
  )
}

