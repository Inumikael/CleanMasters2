"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/lib/app-context"
import { CalendarDays, Users, HardHat, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM"
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:${minute.toString().padStart(2, "0")} ${period}`
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, appointments, crews, clients, isLoading } = useAppState()

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login")
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin"><div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>
      </div>
    )
  }
  if (!user) return null

  const todayStr = new Date().toISOString().split("T")[0]
  const todayAppointments = appointments.filter((a) => a.date === todayStr)
  const upcoming = appointments
    .filter((a) => a.date >= todayStr && a.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour)
    .slice(0, 5)
  const completedToday = todayAppointments.filter((a) => a.status === "completed").length

  const stats = [
    { label: "Today's Jobs", value: todayAppointments.length, icon: CalendarDays, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Clients", value: clients.length, icon: Users, color: "text-accent", bg: "bg-accent/10" },
    { label: "Cleaning Crews", value: crews.length, icon: HardHat, color: "text-chart-3", bg: "bg-chart-3/10" },
    { label: "Completed Today", value: completedToday, icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10" },
  ]

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Welcome back. Here is what is happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-primary">
              <Link href="/calendar">View Calendar<ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments</p>
            ) : (
              upcoming.map((apt) => {
                const client = clients.find((c) => c.id === apt.clientId)
                const crew = crews.find((c) => c.id === apt.crewId)
                return (
                  <div key={apt.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
                    <div className="h-10 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: crew?.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{client?.name || "Unknown Client"}</p>
                      <p className="text-xs text-muted-foreground">{crew?.name || "Unknown"} &middot; {apt.date} &middot; {formatTime(apt.startHour, apt.startMinute)}</p>
                    </div>
                    <Badge variant={apt.status === "in-progress" ? "default" : "outline"} className={apt.status === "in-progress" ? "bg-accent text-accent-foreground border-accent" : "text-foreground"}>
                      {apt.status === "in-progress" ? "In Progress" : apt.status === "completed" ? "Completed" : "Scheduled"}
                    </Badge>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Crew Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {crews.map((crew) => {
              const crewApts = todayAppointments.filter((a) => a.crewId === crew.id)
              const active = crewApts.find((a) => a.status === "in-progress")
              const nextJob = crewApts.find((a) => a.status === "scheduled")
              return (
                <div key={crew.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: crew.color }} />
                    <span className="text-sm font-medium text-foreground">{crew.name}</span>
                    {active && <Badge className="ml-auto bg-accent text-accent-foreground text-[10px] px-1.5 py-0 border-accent">Active</Badge>}
                    {!active && !nextJob && <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 text-muted-foreground">Available</Badge>}
                  </div>
                  <div className="ml-5">
                    {active && <p className="text-xs text-muted-foreground">Currently working</p>}
                    {nextJob && !active && <p className="text-xs text-muted-foreground">Next: {formatTime(nextJob.startHour, nextJob.startMinute)}</p>}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
