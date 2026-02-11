"use client"

import { AuthGuard } from "@/components/auth-guard"
import React from "react"
import { BarChart3, TrendingUp, Clock, Users, CalendarDays, CheckCircle2, XCircle, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppState } from "@/lib/app-context"

export default function ReportsPage() {
  return <AuthGuard><ReportsContent /></AuthGuard>
}

function ReportsContent() {
  const { appointments, crews, clients } = useAppState()
  const todayStr = new Date().toISOString().split("T")[0]
  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay() + 1)
  const thisWeekEnd = new Date(thisWeekStart)
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 6)

  const totalApts = appointments.length
  const completed = appointments.filter((a) => a.status === "completed").length
  const cancelled = appointments.filter((a) => a.status === "cancelled").length
  const inProgress = appointments.filter((a) => a.status === "in-progress").length
  const scheduled = appointments.filter((a) => a.status === "scheduled").length
  const todayApts = appointments.filter((a) => a.date === todayStr && a.status !== "cancelled")
  const todayCompleted = todayApts.filter((a) => a.status === "completed").length
  const completionRate = totalApts > 0 ? Math.round((completed / totalApts) * 100) : 0
  const totalMinutes = appointments.filter((a) => a.status === "completed").reduce((sum, a) => sum + a.durationMinutes, 0)
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10

  const crewStats = crews.map((crew) => {
    const crewApts = appointments.filter((a) => a.crewId === crew.id && a.status !== "cancelled")
    const crewCompleted = crewApts.filter((a) => a.status === "completed").length
    const crewHours = Math.round(crewApts.filter((a) => a.status === "completed").reduce((s, a) => s + a.durationMinutes, 0) / 60 * 10) / 10
    return { crew, total: crewApts.length, completed: crewCompleted, hours: crewHours, rate: crewApts.length > 0 ? Math.round((crewCompleted / crewApts.length) * 100) : 0 }
  }).sort((a, b) => b.total - a.total)

  const clientStats = clients.map((client) => {
    const clientApts = appointments.filter((a) => a.clientId === client.id && a.status !== "cancelled")
    return { client, total: clientApts.length }
  }).sort((a, b) => b.total - a.total).slice(0, 8)

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">Reports & Analytics</h2>
        <p className="text-sm text-muted-foreground">Overview of your business performance and metrics.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><CalendarDays className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold text-foreground">{totalApts}</p><p className="text-xs text-muted-foreground">Total Appointments</p></div></div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10"><CheckCircle2 className="h-5 w-5 text-accent" /></div><div><p className="text-2xl font-bold text-foreground">{completionRate}%</p><p className="text-xs text-muted-foreground">Completion Rate</p></div></div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10"><Clock className="h-5 w-5 text-chart-3" /></div><div><p className="text-2xl font-bold text-foreground">{totalHours}h</p><p className="text-xs text-muted-foreground">Hours Worked</p></div></div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10"><XCircle className="h-5 w-5 text-destructive" /></div><div><p className="text-2xl font-bold text-foreground">{cancelled}</p><p className="text-xs text-muted-foreground">Cancelled</p></div></div></CardContent></Card>
      </div>

      {/* Status breakdown */}
      <Card className="border-border">
        <CardHeader><CardTitle className="text-sm font-medium text-foreground">Status Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm text-foreground">Scheduled</span><Badge variant="outline" className="text-muted-foreground">{scheduled}</Badge></div><Progress value={totalApts > 0 ? (scheduled / totalApts) * 100 : 0} className="w-32 h-2" /></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm text-foreground">In Progress</span><Badge variant="outline" className="text-primary border-primary">{inProgress}</Badge></div><Progress value={totalApts > 0 ? (inProgress / totalApts) * 100 : 0} className="w-32 h-2" /></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm text-foreground">Completed</span><Badge variant="outline" className="text-accent border-accent">{completed}</Badge></div><Progress value={totalApts > 0 ? (completed / totalApts) * 100 : 0} className="w-32 h-2" /></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="text-sm text-foreground">Cancelled</span><Badge variant="outline" className="text-destructive border-destructive">{cancelled}</Badge></div><Progress value={totalApts > 0 ? (cancelled / totalApts) * 100 : 0} className="w-32 h-2" /></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Crew performance */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm font-medium text-foreground">Crew Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {crewStats.map(({ crew, total, completed, hours, rate }) => (
                <div key={crew.id} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: crew.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{crew.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{completed}/{total} done</span>
                        <Badge variant="outline" className={`text-xs ${rate >= 70 ? "text-accent border-accent" : rate >= 40 ? "text-primary border-primary" : "text-muted-foreground"}`}>{rate}%</Badge>
                      </div>
                    </div>
                    <Progress value={rate} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">{hours}h worked &middot; {crew.members?.length || 0} members</p>
                  </div>
                </div>
              ))}
              {crewStats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No crew data.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="border-border">
          <CardHeader><CardTitle className="text-sm font-medium text-foreground">Top Clients</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {clientStats.map(({ client, total }, idx) => (
                <div key={client.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.address}</p>
                  </div>
                  <Badge variant="outline" className="text-foreground">{total} appts</Badge>
                </div>
              ))}
              {clientStats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No client data.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today */}
      <Card className="border-border">
        <CardHeader><CardTitle className="text-sm font-medium text-foreground">{"Today's Summary"}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center"><p className="text-2xl font-bold text-foreground">{todayApts.length}</p><p className="text-xs text-muted-foreground">Jobs Today</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-foreground">{todayCompleted}</p><p className="text-xs text-muted-foreground">Completed</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-foreground">{todayApts.filter((a) => a.status === "in-progress").length}</p><p className="text-xs text-muted-foreground">In Progress</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-foreground">{todayApts.filter((a) => a.status === "scheduled").length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
