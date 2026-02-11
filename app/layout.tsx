import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { AppProvider } from "@/lib/app-context"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AllClean Masters | Admin Portal",
  description: "Administrative management portal for AllClean Masters cleaning services in Kansas City",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
                <SidebarTrigger className="-ml-1 text-muted-foreground" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-sm font-medium text-foreground">AllClean Masters</h1>
              </header>
              <div className="flex-1 overflow-auto">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </AppProvider>
      </body>
    </html>
  )
}
