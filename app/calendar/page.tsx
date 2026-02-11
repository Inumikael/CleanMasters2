"use client"

import { AuthGuard } from "@/components/auth-guard"
import React, { useState, useCallback, useRef, useEffect } from "react"
import {
  ChevronLeft, ChevronRight, AlignVerticalDistributeCenter, GripVertical,
  Clock, MapPin, Trash2, Plus, Upload, Play, CheckCircle2, XCircle, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppState, defaultTasks } from "@/lib/app-context"
import type { Appointment, Crew } from "@/lib/app-context"

const HOUR_HEIGHT = 64
const START_HOUR = 6
const END_HOUR = 20

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM"
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:${minute.toString().padStart(2, "0")} ${period}`
}

function getTopOffset(hour: number, minute: number) {
  return (hour - START_HOUR) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT
}

function getBlockHeight(durationMinutes: number) {
  return (durationMinutes / 60) * HOUR_HEIGHT
}

// ---- Add Appointment Dialog ----

function AddAppointmentDialog({ defaultDate }: { defaultDate: string }) {
  const { clients, crews, addAppointment } = useAppState()
  const [open, setOpen] = useState(false)
  const [clientId, setClientId] = useState("")
  const [crewId, setCrewId] = useState("")
  const [date, setDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState("09:00")
  const [duration, setDuration] = useState("90")
  const [notes, setNotes] = useState("")

  useEffect(() => { setDate(defaultDate) }, [defaultDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId || !crewId) return
    const [h, m] = startTime.split(":").map(Number)
    addAppointment({
      clientId, crewId, date, startHour: h, startMinute: m,
      durationMinutes: parseInt(duration, 10), status: "scheduled",
      tasks: defaultTasks.map((t) => ({ ...t })), notes,
    })
    setOpen(false); setClientId(""); setCrewId(""); setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground gap-1.5">
          <Plus className="h-3.5 w-3.5" /><span className="hidden sm:inline">Add Appointment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card text-foreground">
        <DialogHeader><DialogTitle className="text-foreground">New Appointment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="text-foreground">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select client..." /></SelectTrigger>
              <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-foreground">Crew</Label>
            <Select value={crewId} onValueChange={setCrewId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select crew..." /></SelectTrigger>
              <SelectContent>{crews.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />{c.name}</div>
                </SelectItem>
              ))}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-foreground">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-foreground">Start Time</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1" /></div>
          </div>
          <div>
            <Label className="text-foreground">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[30, 60, 90, 120, 150, 180, 240].map((m) => <SelectItem key={m} value={String(m)}>{m >= 60 ? `${m / 60}h` : `${m} min`}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-foreground">Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." className="mt-1" rows={2} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-foreground bg-transparent">Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground" disabled={!clientId || !crewId}>Create Appointment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---- Robust CSV parser for multiline Outlook CSVs ----

function parseOutlookCSV(text: string): { headers: string[]; rows: string[][] } {
  const result: string[][] = []
  let current: string[] = []
  let inQuotes = false
  let field = ""

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        current.push(field.trim())
        field = ""
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && i + 1 < text.length && text[i + 1] === '\n') i++
        current.push(field.trim())
        field = ""
        if (current.length > 1 || (current.length === 1 && current[0] !== "")) {
          result.push(current)
        }
        current = []
      } else {
        field += ch
      }
    }
  }
  // Last field
  current.push(field.trim())
  if (current.length > 1 || (current.length === 1 && current[0] !== "")) {
    result.push(current)
  }

  if (result.length === 0) return { headers: [], rows: [] }
  const headers = result[0]
  const rows = result.slice(1)
  return { headers, rows }
}

function findCol(headers: string[], names: string[]): number {
  const norm = headers.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""))
  for (const name of names) {
    const n = name.toLowerCase().replace(/[^a-z0-9]/g, "")
    const idx = norm.findIndex((h) => h.includes(n) || n.includes(h))
    if (idx >= 0) return idx
  }
  return -1
}

function parseDateTime(dateStr: string, timeStr: string): { date: string; hour: number; minute: number } | null {
  const datePart = (dateStr || "").trim()
  const timePart = (timeStr || "").trim()
  if (!datePart) return null

  let hour = 9, minute = 0
  if (timePart) {
    const match = timePart.match(/(\d{1,2})\s*:\s*(\d{2})/)
    if (match) { hour = parseInt(match[1], 10); minute = parseInt(match[2], 10) }
    if (/p\.?\s*m\.?/i.test(timePart) && hour < 12) hour += 12
    if (/a\.?\s*m\.?/i.test(timePart) && hour === 12) hour = 0
  }

  const parts = datePart.split(/[/\-.]/).map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
  if (parts.length < 3) return null
  const y = parts[2] > 100 ? parts[2] : 2000 + parts[2]
  // DD/MM/YYYY format (European/Latin)
  const p1 = parts[0], p2 = parts[1]
  const day = p1 > 12 ? p1 : p2 > 12 ? p2 : p1
  const month = p1 > 12 ? p2 : p2 > 12 ? p1 : p2
  const d = new Date(y, month - 1, day)
  if (isNaN(d.getTime())) return null
  const date = d.toISOString().split("T")[0]
  return { date, hour, minute }
}

// ---- CSV Import Dialog ----

function CSVImportDialog() {
  const { clients, addClient, addAppointment, getUnassignedCrew, fetchAppointments } = useAppState()
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setResult({ imported: 0, errors: ["Por favor sube un archivo .CSV"] })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const text = await file.text()
      const { headers, rows } = parseOutlookCSV(text)
      if (headers.length === 0 || rows.length === 0) {
        setResult({ imported: 0, errors: ["El archivo no tiene cabeceras o filas de datos."] })
        setLoading(false)
        return
      }

      const subjectIdx = findCol(headers, ["Subject", "Asunto", "Cliente", "Nombre", "Client"])
      const startDateIdx = findCol(headers, ["Start Date", "Fecha inicio", "StartDate", "Date"])
      const startTimeIdx = findCol(headers, ["Start Time", "Hora inicio", "StartTime", "Time"])
      const endDateIdx = findCol(headers, ["End Date", "Fecha fin", "EndDate"])
      const endTimeIdx = findCol(headers, ["End Time", "Hora fin", "EndTime"])
      const descIdx = findCol(headers, ["Description", "Descripcion", "Notes", "Notas"])
      const locationIdx = findCol(headers, ["Location", "Ubicacion", "Address", "Direccion"])

      if (subjectIdx < 0) {
        setResult({ imported: 0, errors: ["No se encontro columna para el cliente (Subject / Asunto / Cliente)."] })
        setLoading(false)
        return
      }
      if (startDateIdx < 0) {
        setResult({ imported: 0, errors: ["No se encontro columna de fecha de inicio (Start Date / Fecha inicio)."] })
        setLoading(false)
        return
      }

      const unassignedCrew = await getUnassignedCrew()
      const crewId = unassignedCrew.id
      const errors: string[] = []
      let imported = 0
      const createdClientsByName = new Map<string, string>()

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const clientName = (row[subjectIdx] ?? "").trim()
        if (!clientName) continue

        const startDate = row[startDateIdx] ?? ""
        const startTime = startTimeIdx >= 0 ? (row[startTimeIdx] ?? "") : ""
        const endDate = endDateIdx >= 0 ? (row[endDateIdx] ?? startDate) : startDate
        const endTime = endTimeIdx >= 0 ? (row[endTimeIdx] ?? startTime) : startTime

        const startParsed = parseDateTime(startDate, startTime)
        if (!startParsed) {
          errors.push(`Fila ${i + 2}: fecha/hora invalida (${startDate} ${startTime}).`)
          continue
        }

        let durationMinutes = 60
        const endParsed = parseDateTime(endDate, endTime)
        if (endParsed && endParsed.date === startParsed.date) {
          durationMinutes = (endParsed.hour - startParsed.hour) * 60 + (endParsed.minute - startParsed.minute)
          if (durationMinutes <= 0) durationMinutes = 60
        }

        const notes = descIdx >= 0 ? (row[descIdx] ?? "").trim() : ""
        const address = locationIdx >= 0 ? (row[locationIdx] ?? "").trim() : ""

        const key = clientName.toLowerCase()
        let clientId = createdClientsByName.get(key) ?? clients.find((c) => c.name.trim().toLowerCase() === key)?.id
        if (!clientId) {
          try {
            const created = await addClient({
              name: clientName, phone: "", email: "", address: address || "Sin direccion",
              city: "", state: "MO", zip: "", sqft: 0, bedrooms: 0, bathrooms: 0,
              careInstructions: notes.slice(0, 500), images: [],
            })
            clientId = created?.id
            if (clientId) createdClientsByName.set(key, clientId)
          } catch {
            errors.push(`Fila ${i + 2}: no se pudo crear cliente "${clientName}".`)
            continue
          }
        }
        if (!clientId) {
          errors.push(`Fila ${i + 2}: no se pudo obtener id de cliente "${clientName}".`)
          continue
        }

        try {
          await addAppointment({
            clientId, crewId, date: startParsed.date,
            startHour: startParsed.hour, startMinute: startParsed.minute, durationMinutes,
            status: "scheduled", tasks: defaultTasks.map((t) => ({ ...t })), notes,
          })
          imported++
        } catch {
          errors.push(`Fila ${i + 2}: no se pudo crear cita para "${clientName}".`)
        }
      }

      await fetchAppointments()
      setResult({ imported, errors })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setResult({ imported: 0, errors: [`Error al procesar el CSV: ${msg}`] })
    } finally {
      setLoading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setResult(null) }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-foreground gap-1.5 bg-transparent">
          <FileText className="h-3.5 w-3.5" /><span className="hidden sm:inline">Import .CSV</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card text-foreground">
        <DialogHeader><DialogTitle className="text-foreground">Importar citas desde CSV</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Sube un archivo .CSV con columnas como <strong>Subject</strong> (cliente), <strong>Start Date</strong>, <strong>Start Time</strong>, <strong>End Date</strong>, <strong>End Time</strong>, <strong>Description</strong>, <strong>Location</strong>. Las citas se importan <strong>sin crew asignado</strong> y podras asignar crews despues.
          </p>
          <div
            className="rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/50 transition-colors"
            onClick={() => !loading && fileRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            role="button" tabIndex={0}
          >
            {loading ? <p className="text-sm text-muted-foreground">Importando...</p> : (
              <>
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Haz clic para subir archivo .CSV</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </div>
          {result && (
            <div className={`rounded-lg p-4 text-sm ${result.errors.length > 0 && result.imported === 0 ? "bg-destructive/10 border border-destructive/20 text-destructive" : result.imported > 0 ? "bg-accent/10 text-foreground" : "bg-muted text-muted-foreground"}`}>
              <p className="font-bold mb-2">
                {result.imported > 0
                  ? `Se importaron ${result.imported} cita${result.imported !== 1 ? "s" : ""} (sin crew asignado).`
                  : result.errors.length > 0 ? "Errores en la importacion" : "No se importo ninguna cita."}
              </p>
              {result.errors.length > 0 && (
                <ul className="mt-2 text-xs flex flex-col gap-1 max-h-32 overflow-y-auto">
                  {result.errors.slice(0, 15).map((err, i) => <li key={i}>{err}</li>)}
                  {result.errors.length > 15 && <li>... y {result.errors.length - 15} mas.</li>}
                </ul>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---- Main Calendar Page ----

export default function CalendarPage() {
  return <AuthGuard><CalendarContent /></AuthGuard>
}

function CalendarContent() {
  const {
    crews, appointments: allAppointments, settings, getClient,
    updateAppointment, deleteAppointment, cancelAppointment, realignSchedule,
  } = useAppState()

  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily")
  const [dragState, setDragState] = useState<{ aptId: string; offsetY: number; crewId: string } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const dateStr = currentDate.toISOString().split("T")[0]

  const getDatesForView = useCallback(() => {
    if (viewMode === "daily") return [new Date(currentDate)]
    const start = new Date(currentDate)
    const day = start.getDay()
    start.setDate(start.getDate() - day + 1)
    const dates: Date[] = []
    for (let i = 0; i < 5; i++) { const d = new Date(start); d.setDate(d.getDate() + i); dates.push(d) }
    return dates
  }, [currentDate, viewMode])

  const navigate = (direction: number) => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + (viewMode === "daily" ? direction : direction * 7))
    setCurrentDate(next)
  }

  const goToToday = () => setCurrentDate(new Date())

  const getAppointmentsForDateCrew = (date: string, crewId: string) => {
    return allAppointments
      .filter((a) => a.date === date && a.crewId === crewId && a.status !== "cancelled")
      .sort((a, b) => a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute))
  }

  const handleDeleteAppointment = (aptId: string) => {
    const apt = allAppointments.find((a) => a.id === aptId)
    if (apt?.status === "in-progress") cancelAppointment(aptId)
    else deleteAppointment(aptId)
  }

  const handleStatusChange = (aptId: string, newStatus: Appointment["status"]) => {
    updateAppointment(aptId, { status: newStatus })
  }

  const handleDragStart = (e: React.DragEvent, aptId: string, crewId: string) => {
    const apt = allAppointments.find((a) => a.id === aptId)
    if (apt?.status === "in-progress" || apt?.status === "completed") return
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragState({ aptId, offsetY: e.clientY - rect.top, crewId })
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", aptId)
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move" }

  const handleDrop = (e: React.DragEvent, targetCrewId: string, targetDate: string) => {
    e.preventDefault()
    if (!dragState || !gridRef.current) return
    const cols = gridRef.current.querySelectorAll("[data-crew-column]")
    let targetEl: Element | null = null
    for (const col of cols) {
      if (col.getAttribute("data-crew-column") === targetCrewId && col.getAttribute("data-date-column") === targetDate) { targetEl = col; break }
    }
    if (!targetEl) return
    const colRect = targetEl.getBoundingClientRect()
    const relY = e.clientY - colRect.top - dragState.offsetY
    const totalMin = (relY / HOUR_HEIGHT) * 60
    const snapped = Math.round(totalMin / 30) * 30
    const newHour = START_HOUR + Math.floor(snapped / 60)
    const newMin = snapped % 60
    if (newHour < START_HOUR || newHour >= END_HOUR) return
    updateAppointment(dragState.aptId, { startHour: newHour, startMinute: newMin, crewId: targetCrewId, date: targetDate })
    setDragState(null)
  }

  const viewDates = getDatesForView()
  const timeSlots: number[] = []
  for (let h = START_HOUR; h < END_HOUR; h++) timeSlots.push(h)
  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT
  const columnsPerDate = viewMode === "daily" ? crews : crews.slice(0, 3)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goToToday} className="text-foreground bg-transparent">Today</Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigate(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <h2 className="text-lg font-semibold text-foreground" suppressHydrationWarning>
            {mounted ? (viewMode === "daily"
              ? currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
              : `Week of ${viewDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${viewDates[viewDates.length - 1].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
            ) : "\u00A0"}
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AddAppointmentDialog defaultDate={dateStr} />
          <CSVImportDialog />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={realignSchedule} className="text-foreground gap-1.5 bg-transparent">
                  <AlignVerticalDistributeCenter className="h-3.5 w-3.5" /><span className="hidden sm:inline">Re-align</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Close gaps between appointments</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex rounded-lg border border-border">
            <Button variant={viewMode === "daily" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("daily")} className={viewMode === "daily" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}>Day</Button>
            <Button variant={viewMode === "weekly" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("weekly")} className={viewMode === "weekly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}>Week</Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto" ref={gridRef}>
        <div className="min-w-[700px]">
          {viewDates.map((date) => {
            const dStr = date.toISOString().split("T")[0]
            return (
              <div key={dStr}>
                {viewMode === "weekly" && (
                  <div className="sticky top-0 z-10 bg-muted px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground" suppressHydrationWarning>
                      {mounted ? date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "\u00A0"}
                    </p>
                  </div>
                )}
                <div className="flex">
                  <div className="w-16 flex-shrink-0 border-r border-border bg-card">
                    <div className="h-10" />
                    <div className="relative" style={{ height: totalHeight }}>
                      {timeSlots.map((hour) => (
                        <div key={hour} className="absolute left-0 right-0 flex items-start justify-end pr-2 -translate-y-2" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}>
                          <span className="text-[10px] text-muted-foreground">{formatTime(hour, 0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {columnsPerDate.map((crew) => (
                    <CrewColumn key={`${dStr}-${crew.id}`} crew={crew} date={dStr}
                      appointments={getAppointmentsForDateCrew(dStr, crew.id)}
                      timeSlots={timeSlots} totalHeight={totalHeight} bufferMinutes={settings?.bufferMinutes ?? 30}
                      onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
                      onDelete={handleDeleteAppointment} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---- Crew Column ----

function CrewColumn({ crew, date, appointments, timeSlots, totalHeight, bufferMinutes, onDragStart, onDragOver, onDrop, onDelete, onStatusChange }: {
  crew: Crew; date: string; appointments: Appointment[]; timeSlots: number[]; totalHeight: number; bufferMinutes: number;
  onDragStart: (e: React.DragEvent, aptId: string, crewId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, crewId: string, date: string) => void;
  onDelete: (aptId: string) => void;
  onStatusChange: (aptId: string, status: Appointment["status"]) => void;
}) {
  const { getClient } = useAppState()

  return (
    <div className="flex-1 min-w-[200px] border-r border-border last:border-r-0"
      data-crew-column={crew.id} data-date-column={date}
      onDragOver={onDragOver} onDrop={(e) => onDrop(e, crew.id, date)}>
      <div className="sticky top-0 z-10 flex h-10 items-center gap-2 border-b border-border bg-card px-3">
        <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: crew.color }} />
        <span className="text-xs font-semibold text-foreground truncate">{crew.name}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{appointments.length} job{appointments.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="relative" style={{ height: totalHeight }}>
        {timeSlots.map((hour) => <div key={hour} className="absolute left-0 right-0 border-t border-border/50" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }} />)}
        {timeSlots.map((hour) => <div key={`${hour}-half`} className="absolute left-0 right-0 border-t border-border/20 border-dashed" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />)}
        {appointments.map((apt) => {
          const client = getClient(apt.clientId)
          const top = getTopOffset(apt.startHour, apt.startMinute)
          const height = getBlockHeight(apt.durationMinutes)
          const isDraggable = apt.status !== "in-progress" && apt.status !== "completed"
          const statusColors: Record<string, string> = { scheduled: `${crew.color}15`, "in-progress": `${crew.color}30`, completed: `${crew.color}08` }
          return (
            <div key={apt.id}>
              <div draggable={isDraggable} onDragStart={isDraggable ? (e) => onDragStart(e, apt.id, crew.id) : undefined}
                className={`absolute left-1 right-1 rounded-lg border transition-shadow hover:shadow-md group overflow-hidden ${isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"} ${apt.status === "in-progress" ? "ring-2 ring-accent ring-offset-1" : ""} ${apt.status === "completed" ? "opacity-60" : ""}`}
                style={{ top, height: Math.max(height, 40), backgroundColor: statusColors[apt.status] || `${crew.color}15`, borderColor: `${crew.color}40` }}>
                <div className="h-full p-2 flex flex-col">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                      {isDraggable && <GripVertical className="h-3 w-3 flex-shrink-0 text-muted-foreground/50" />}
                      {apt.status === "in-progress" && <Play className="h-3 w-3 flex-shrink-0 text-accent fill-accent" />}
                      {apt.status === "completed" && <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-accent" />}
                      <span className="text-[11px] font-semibold text-foreground truncate">{client?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {apt.status === "scheduled" && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); onStatusChange(apt.id, "in-progress") }}
                          className="p-0.5 rounded hover:bg-accent/20" title="Start"><Play className="h-3 w-3 text-accent" /></button>
                      )}
                      {apt.status === "in-progress" && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); onStatusChange(apt.id, "completed") }}
                          className="p-0.5 rounded hover:bg-accent/20" title="Complete"><CheckCircle2 className="h-3 w-3 text-accent" /></button>
                      )}
                      <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(apt.id) }}
                        className="p-0.5 rounded hover:bg-destructive/20" title="Delete"><Trash2 className="h-3 w-3 text-destructive" /></button>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />{formatTime(apt.startHour, apt.startMinute)} &middot; {apt.durationMinutes}min
                  </p>
                  {apt.notes && <p className="text-[8px] text-muted-foreground/70 mt-auto truncate">{apt.notes}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
