// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import "./globals.css"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "BookShelf - Sua Biblioteca Pessoal",
  description: "Gerencie sua biblioteca pessoal, acompanhe leituras e organize seus livros",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
  <ThemeProvider defaultTheme="system" storageKey="bookshelf-theme">
    <Toaster>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </Toaster>
  </ThemeProvider>
  <Analytics/>
</body>
    </html>
  )
}
