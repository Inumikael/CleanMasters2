"use client"

import { AuthGuard } from "@/components/auth-guard"
import React, { useState, useEffect } from "react"
import {
  Plus, Users, User, CalendarDays, Clock, Phone, Trash2, Edit2, ChevronUp, ChevronDown, Crown, UserPlus, UserMinus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppState } from "@/lib/app-context"
import type { CrewMember } from "@/lib/app-context"

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM"
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:${minute.toString().padStart(2, "0")} ${period}`
}

export default function CrewsPage() {
  return <AuthGuard><CrewsContent /></AuthGuard>
}

const emptyMemberForm = { name: "", role: "Empleado General" as "Lider" | "Empleado General", phone: "" }

function CrewsContent() {
  const {
    crews, appointments, addCrew, deleteCrew, addCrewMember, updateCrewMember, deleteCrewMember, isLoading,
  } = useAppState()
  const [expandedCrew, setExpandedCrew] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [newCrewName, setNewCrewName] = useState("")
  const [newCrewColor, setNewCrewColor] = useState("hsl(224, 58%, 33%)")
  const [showAddMemberDialog, setShowAddMemberDialog] = useState<string | null>(null)
  const [addMemberForm, setAddMemberForm] = useState(emptyMemberForm)
  const [editingMember, setEditingMember] = useState<{ member: CrewMember; crewId: string } | null>(null)
  const [editMemberForm, setEditMemberForm] = useState(emptyMemberForm)

  const todayStr = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (crews.length > 0 && !expandedCrew) setExpandedCrew(crews[0].id)
  }, [crews, expandedCrew])

  const handleCreateCrew = async () => {
    if (!newCrewName.trim()) return
    await addCrew({ name: newCrewName, color: newCrewColor, members: [] })
    setNewCrewName(""); setNewCrewColor("hsl(224, 58%, 33%)"); setShowDialog(false)
  }

  const handleAddMember = async (crewId: string) => {
    if (!addMemberForm.name.trim() || !addMemberForm.phone.trim()) return
    await addCrewMember(crewId, {
      name: addMemberForm.name.trim(), role: addMemberForm.role, phone: addMemberForm.phone.trim(), documents: [],
    })
    setAddMemberForm(emptyMemberForm); setShowAddMemberDialog(null)
  }

  const handleEditMember = async () => {
    if (!editingMember || !editMemberForm.name.trim() || !editMemberForm.phone.trim()) return
    await updateCrewMember(editingMember.member.id, {
      name: editMemberForm.name.trim(), role: editMemberForm.role, phone: editMemberForm.phone.trim(),
    })
    setEditingMember(null); setEditMemberForm(emptyMemberForm)
  }

  const handleDeleteMember = async (member: CrewMember) => {
    if (!confirm(`Eliminar a ${member.name} del equipo?`)) return
    await deleteCrewMember(member.id)
  }

  if (isLoading) return <div className="p-6 text-muted-foreground">Cargando equipos...</div>

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">Cleaning Crews</h2>
          <p className="text-sm text-muted-foreground">Manage your teams, view schedules, and track performance.</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-1.5"><Plus className="h-4 w-4" />Add Crew</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
            <DialogHeader><DialogTitle className="text-foreground">Create New Crew</DialogTitle><DialogDescription className="text-muted-foreground">Create a new cleaning crew with a name and color.</DialogDescription></DialogHeader>
            <div className="flex flex-col gap-4">
              <div><label className="text-sm font-medium text-foreground">Crew Name</label><Input placeholder="e.g., Alpha Team" value={newCrewName} onChange={(e) => setNewCrewName(e.target.value)} /></div>
              <div><label className="text-sm font-medium text-foreground">Color</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {["hsl(224, 58%, 33%)", "hsl(160, 84%, 39%)", "hsl(344, 84%, 43%)", "hsl(197, 60%, 45%)"].map((color) => (
                    <button key={color} className="w-8 h-8 rounded-lg border-2 transition-all" style={{ backgroundColor: color, borderColor: newCrewColor === color ? "hsl(var(--foreground))" : "transparent" }} onClick={() => setNewCrewColor(color)} />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDialog(false)} className="bg-transparent text-foreground">Cancel</Button>
                <Button onClick={handleCreateCrew} className="bg-primary text-primary-foreground">Create Crew</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold text-foreground">{crews.length}</p><p className="text-xs text-muted-foreground">Total Crews</p></div></div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10"><User className="h-5 w-5 text-accent" /></div><div><p className="text-2xl font-bold text-foreground">{crews.reduce((sum, c) => sum + (c.members?.length || 0), 0)}</p><p className="text-xs text-muted-foreground">Total Members</p></div></div></CardContent></Card>
        <Card className="border-border"><CardContent className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10"><CalendarDays className="h-5 w-5 text-chart-3" /></div><div><p className="text-2xl font-bold text-foreground">{appointments.filter((a) => a.date === todayStr && a.status !== "cancelled").length}</p><p className="text-xs text-muted-foreground">Jobs Today</p></div></div></CardContent></Card>
      </div>

      {/* Crew Cards - VISUAL with leader prominent */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {crews.length === 0 ? (
          <Card className="col-span-full"><CardContent className="p-8 text-center"><Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No crews created yet. Add one to get started!</p></CardContent></Card>
        ) : crews.map((crew) => {
          const leader = crew.members?.find((m) => m.role === "Lider")
          const members = crew.members?.filter((m) => m.role !== "Lider") || []
          const crewAppointments = appointments.filter((a) => a.crewId === crew.id && a.status !== "cancelled")
          const todayJobs = crewAppointments.filter((a) => a.date === todayStr)
          const completed = todayJobs.filter((a) => a.status === "completed").length
          const progress = todayJobs.length > 0 ? (completed / todayJobs.length) * 100 : 0
          const isExpanded = expandedCrew === crew.id

          return (
            <Card key={crew.id} className="border-border overflow-hidden">
              {/* Color bar */}
              <div className="h-2" style={{ backgroundColor: crew.color }} />

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold text-foreground">{crew.name}</CardTitle>
                    <Badge variant="outline" className="text-xs text-muted-foreground">{crew.members?.length || 0} members</Badge>
                  </div>
                  <button type="button" onClick={() => setExpandedCrew(isExpanded ? null : crew.id)}>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{completed}/{todayJobs.length} done today</span>
                  <Progress value={progress} className="flex-1 h-1.5" />
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex flex-col gap-4">
                {/* Leader - PROMINENT */}
                {leader ? (
                  <div className="flex flex-col items-center gap-2 py-3 rounded-lg border-2 border-dashed" style={{ borderColor: `${crew.color}60`, backgroundColor: `${crew.color}08` }}>
                    <Avatar className="h-16 w-16 border-3 shadow-md" style={{ borderColor: crew.color }}>
                      <AvatarFallback className="text-lg font-bold text-primary-foreground" style={{ backgroundColor: crew.color }}>
                        {leader.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Crown className="h-4 w-4" style={{ color: crew.color }} />
                        <p className="text-sm font-bold text-foreground">{leader.name}</p>
                      </div>
                      <p className="text-xs font-medium" style={{ color: crew.color }}>Lider de Equipo</p>
                      {leader.phone && <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center mt-0.5"><Phone className="h-3 w-3" />{leader.phone}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 py-3 rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <Crown className="h-5 w-5 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Sin lider asignado</p>
                  </div>
                )}

                {/* Members */}
                {members.length > 0 && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {members.map((member) => (
                      <div key={member.id} className="flex flex-col items-center gap-1 group relative">
                        <Avatar className="h-10 w-10 border-2 shrink-0" style={{ borderColor: crew.color }}>
                          <AvatarFallback className="text-xs font-bold text-primary-foreground" style={{ backgroundColor: crew.color }}>
                            {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-[10px] font-medium text-foreground text-center max-w-[70px] truncate">{member.name}</p>
                        <p className="text-[9px] text-muted-foreground">Empleado</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Expanded actions */}
                {isExpanded && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Team Members</h4>
                        <Button size="sm" variant="outline" className="gap-1.5 bg-transparent text-foreground" onClick={() => { setShowAddMemberDialog(crew.id); setAddMemberForm(emptyMemberForm) }}>
                          <UserPlus className="h-3.5 w-3.5" />Add
                        </Button>
                      </div>
                      {crew.members && crew.members.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {crew.members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3 rounded-lg border border-border p-2 group/item">
                              <Avatar className="h-8 w-8 border shrink-0" style={{ borderColor: crew.color }}>
                                <AvatarFallback className="text-[10px] font-bold text-primary-foreground" style={{ backgroundColor: crew.color }}>
                                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  {member.role === "Lider" && <Crown className="h-3 w-3 flex-shrink-0" style={{ color: crew.color }} />}
                                  <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{member.role} {member.phone ? `- ${member.phone}` : ""}</p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                                  setEditingMember({ member, crewId: crew.id })
                                  setEditMemberForm({ name: member.name, role: member.role, phone: member.phone || "" })
                                }}><Edit2 className="h-3 w-3 text-muted-foreground" /></Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteMember(member)}>
                                  <UserMinus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-xs text-muted-foreground">No hay miembros.</p>}
                    </div>

                    {/* Today schedule */}
                    <Separator />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{"Today's Schedule"}</h4>
                      {todayJobs.length === 0 ? <p className="text-xs text-muted-foreground">No jobs today.</p> : (
                        <div className="flex flex-col gap-1">
                          {todayJobs.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between rounded border border-border p-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-foreground">{formatTime(apt.startHour, apt.startMinute)}</span>
                              </div>
                              <Badge variant="outline" className={apt.status === "completed" ? "text-accent border-accent" : apt.status === "in-progress" ? "text-primary border-primary" : "text-muted-foreground"}>
                                {apt.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => deleteCrew(crew.id)} className="w-full bg-transparent text-destructive border-destructive/30 hover:bg-destructive/10">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />Delete Crew
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={!!showAddMemberDialog} onOpenChange={(open) => !open && setShowAddMemberDialog(null)}>
        <DialogContent className="sm:max-w-[400px] bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-foreground">Agregar persona al equipo</DialogTitle><DialogDescription className="text-muted-foreground">Selecciona el rol y los datos del nuevo integrante.</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2"><Label htmlFor="add-name">Nombre</Label><Input id="add-name" placeholder="Ej. Maria Garcia" value={addMemberForm.name} onChange={(e) => setAddMemberForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="add-role">Rol</Label>
              <Select value={addMemberForm.role} onValueChange={(v) => setAddMemberForm((f) => ({ ...f, role: v as "Lider" | "Empleado General" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Empleado General">Empleado General</SelectItem>
                  <SelectItem value="Lider">Lider</SelectItem>
                </SelectContent>
              </Select>
              {addMemberForm.role === "Lider" && showAddMemberDialog && crews.find((c) => c.id === showAddMemberDialog)?.members?.some((m) => m.role === "Lider") && (
                <p className="text-xs text-amber-500">Este equipo ya tiene un lider. El lider actual sera cambiado a Empleado General.</p>
              )}
            </div>
            <div className="flex flex-col gap-2"><Label htmlFor="add-phone">Telefono</Label><Input id="add-phone" placeholder="(816) 555-1234" value={addMemberForm.phone} onChange={(e) => setAddMemberForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(null)} className="bg-transparent text-foreground">Cancelar</Button>
            <Button onClick={() => showAddMemberDialog && handleAddMember(showAddMemberDialog)} disabled={!addMemberForm.name.trim() || !addMemberForm.phone.trim()} className="bg-primary text-primary-foreground">Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-[400px] bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-foreground">Editar persona</DialogTitle><DialogDescription className="text-muted-foreground">Modifica el nombre, rol o telefono.</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2"><Label htmlFor="edit-name">Nombre</Label><Input id="edit-name" value={editMemberForm.name} onChange={(e) => setEditMemberForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={editMemberForm.role} onValueChange={(v) => setEditMemberForm((f) => ({ ...f, role: v as "Lider" | "Empleado General" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Empleado General">Empleado General</SelectItem>
                  <SelectItem value="Lider">Lider</SelectItem>
                </SelectContent>
              </Select>
              {editMemberForm.role === "Lider" && editingMember && editingMember.member.role !== "Lider" && crews.find((c) => c.id === editingMember.crewId)?.members?.some((m) => m.role === "Lider") && (
                <p className="text-xs text-amber-500">Este equipo ya tiene un lider. El lider actual sera cambiado a Empleado General.</p>
              )}
            </div>
            <div className="flex flex-col gap-2"><Label htmlFor="edit-phone">Telefono</Label><Input id="edit-phone" value={editMemberForm.phone} onChange={(e) => setEditMemberForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)} className="bg-transparent text-foreground">Cancelar</Button>
            <Button onClick={handleEditMember} disabled={!editMemberForm.name.trim() || !editMemberForm.phone.trim()} className="bg-primary text-primary-foreground">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
