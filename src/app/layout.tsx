import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Keep your existing body font import
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter', // Add variable for Tailwind
})

export const metadata: Metadata = {
  title: "LibraryNexus", 
  description: "Digital library management system for IIITM",
  icons:{
    icon: 'nexus-logo.svg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-foreground min-h-screen`}>
        <div className="page-gradient">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}