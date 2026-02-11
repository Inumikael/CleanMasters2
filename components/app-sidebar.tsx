"use client"

import {
  LayoutDashboard, CalendarDays, Users, HardHat, Settings, BarChart3, Sparkles, LogOut, Lock,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAppState } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Smart Calendar", href: "/calendar", icon: CalendarDays },
  { title: "Clients", href: "/clients", icon: Users },
  { title: "Cleaning Crews", href: "/crews", icon: HardHat },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
]

const adminItems = [
  { title: "User Management", href: "/users", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAppState()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (pathname === "/login") return null

  if (!user) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/login" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold text-sidebar-primary">AllClean</span>
              <span className="text-[10px] font-medium leading-none text-sidebar-foreground/70">Masters</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup className="flex flex-col items-center justify-center min-h-[200px]">
            <Lock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground text-center">Please log in to access features</p>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  }

  const isAdmin = user.role === "super_admin" || user.role === "admin"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-primary">AllClean</span>
            <span className="text-[10px] font-medium leading-none text-sidebar-foreground/70">Masters</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg bg-sidebar-accent p-3 mb-2">
            <p className="text-xs font-semibold text-sidebar-accent-foreground">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/70">{user.email}</p>
            <Badge className="mt-2 text-[10px]" variant={isAdmin ? "default" : "secondary"}>
              {user.role.replace(/_/g, " ").toUpperCase()}
            </Badge>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-[10px]">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-[10px]">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-medium text-sidebar-foreground">Kansas City, MO</p>
          <p className="text-[10px] text-sidebar-foreground/60 mb-2">Serving KS & MO areas</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden ml-2">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
