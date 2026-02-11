"use client"

import { AuthGuard } from "@/components/auth-guard"
import React, { useState, useRef, useCallback } from "react"
import { Search, Plus, Phone, Mail, MapPin, BedDouble, Bath, Ruler, AlertCircle, ImageIcon, Upload, ChevronRight, Trash2, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppState } from "@/lib/app-context"
import type { Client } from "@/lib/app-context"

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM"
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${h}:${minute.toString().padStart(2, "0")} ${period}`
}

function ClientForm({ initial, onSubmit, onCancel, submitLabel }: {
  initial?: Partial<Client>; onSubmit: (data: Omit<Client, "id" | "images">) => void; onCancel: () => void; submitLabel: string
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    onSubmit({
      name: form.get("name") as string, phone: form.get("phone") as string,
      email: form.get("email") as string, address: form.get("address") as string,
      city: form.get("city") as string, state: form.get("state") as "KS" | "MO",
      zip: form.get("zip") as string, sqft: Number(form.get("sqft")),
      bedrooms: Number(form.get("bedrooms")), bathrooms: Number(form.get("bathrooms")),
      careInstructions: (form.get("careInstructions") as string) || "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Label htmlFor="name" className="text-foreground">Full Name / Property Name</Label><Input id="name" name="name" defaultValue={initial?.name} required className="mt-1" /></div>
        <div><Label htmlFor="phone" className="text-foreground">Phone</Label><Input id="phone" name="phone" defaultValue={initial?.phone} required className="mt-1" /></div>
        <div><Label htmlFor="email" className="text-foreground">Email</Label><Input id="email" name="email" type="email" defaultValue={initial?.email} required className="mt-1" /></div>
        <div className="col-span-2"><Label htmlFor="address" className="text-foreground">Address</Label><Input id="address" name="address" defaultValue={initial?.address} required className="mt-1" /></div>
        <div><Label htmlFor="city" className="text-foreground">City</Label><Input id="city" name="city" defaultValue={initial?.city} required className="mt-1" /></div>
        <div className="flex gap-2">
          <div className="flex-1"><Label htmlFor="state" className="text-foreground">State</Label>
            <Select name="state" defaultValue={initial?.state || "MO"}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MO">MO</SelectItem><SelectItem value="KS">KS</SelectItem></SelectContent></Select>
          </div>
          <div className="flex-1"><Label htmlFor="zip" className="text-foreground">ZIP</Label><Input id="zip" name="zip" defaultValue={initial?.zip} required className="mt-1" /></div>
        </div>
        <div><Label htmlFor="sqft" className="text-foreground">Square Footage</Label><Input id="sqft" name="sqft" type="number" defaultValue={initial?.sqft} required className="mt-1" /></div>
        <div className="flex gap-2">
          <div className="flex-1"><Label htmlFor="bedrooms" className="text-foreground">Beds</Label><Input id="bedrooms" name="bedrooms" type="number" defaultValue={initial?.bedrooms} required className="mt-1" /></div>
          <div className="flex-1"><Label htmlFor="bathrooms" className="text-foreground">Baths</Label><Input id="bathrooms" name="bathrooms" type="number" defaultValue={initial?.bathrooms} required className="mt-1" /></div>
        </div>
        <div className="col-span-2"><Label htmlFor="careInstructions" className="text-foreground">Care Instructions</Label><Textarea id="careInstructions" name="careInstructions" defaultValue={initial?.careInstructions} className="mt-1" rows={3} /></div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="text-foreground bg-transparent">Cancel</Button>
        <Button type="submit" className="bg-primary text-primary-foreground">{submitLabel}</Button>
      </div>
    </form>
  )
}

function ImageGallery({ clientId }: { clientId: string }) {
  const { clients, addClientImage, removeClientImage } = useAppState()
  const client = clients.find((c) => c.id === clientId)
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = (e) => { const url = e.target?.result as string; if (url) addClientImage(clientId, url) }
      reader.readAsDataURL(file)
    })
  }, [clientId, addClientImage])
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files) }, [handleFiles])
  if (!client) return null

  return (
    <Card className="border-border">
      <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium text-muted-foreground">Image Gallery</CardTitle><Badge variant="outline" className="text-muted-foreground">{client.images.length} photos</Badge></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"}`}
            onClick={() => fileRef.current?.click()} onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} role="button" tabIndex={0}>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground text-center px-2">Drop files or click to upload</span>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" />
          </div>
          {client.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
              <img src={img || "/placeholder.svg"} alt={`Property photo ${idx + 1}`} className="h-full w-full object-cover" crossOrigin="anonymous" />
              <button type="button" onClick={() => removeClientImage(clientId, idx)} className="absolute top-1 right-1 p-1 rounded-full bg-foreground/70 text-background opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
            </div>
          ))}
          {client.images.length === 0 && <div className="aspect-square rounded-lg bg-muted flex items-center justify-center"><div className="text-center"><ImageIcon className="h-6 w-6 text-muted-foreground/40 mx-auto mb-1" /><span className="text-[10px] text-muted-foreground/40">No photos yet</span></div></div>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientsPage() {
  return <AuthGuard><ClientsContent /></AuthGuard>
}

function ClientsContent() {
  const { clients, appointments, addClient, updateClient, deleteClient, getCrew } = useAppState()
  const [search, setSearch] = useState("")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const selectedClient = clients.find((c) => c.id === selectedClientId)
  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()))
  const handleAddClient = (data: Omit<Client, "id" | "images">) => { addClient({ ...data, images: [] }); setAddDialogOpen(false) }
  const handleEditClient = (data: Omit<Client, "id" | "images">) => { if (selectedClientId) { updateClient(selectedClientId, data); setEditDialogOpen(false) } }
  const handleDeleteClient = (id: string) => { deleteClient(id); if (selectedClientId === id) setSelectedClientId(null) }
  const clientAppointments = selectedClient ? appointments.filter((a) => a.clientId === selectedClient.id) : []

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Clients</h2>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild><Button size="sm" className="bg-primary text-primary-foreground"><Plus className="h-3.5 w-3.5 mr-1" />Add</Button></DialogTrigger>
              <DialogContent className="max-w-lg bg-card text-foreground"><DialogHeader><DialogTitle className="text-foreground">Add New Client</DialogTitle></DialogHeader><ClientForm onSubmit={handleAddClient} onCancel={() => setAddDialogOpen(false)} submitLabel="Add Client" /></DialogContent>
            </Dialog>
          </div>
          <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        </div>
        <div className="flex-1 overflow-auto px-2 pb-2">
          {filtered.map((client) => (
            <button type="button" key={client.id} onClick={() => setSelectedClientId(client.id)}
              className={`w-full text-left rounded-lg p-3 mb-1 transition-colors ${selectedClientId === client.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted border border-transparent"}`}>
              <div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground truncate">{client.name}</p><ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" /></div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{client.address}, {client.city}, {client.state}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No clients found.</p>}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {selectedClient ? (
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground text-balance">{selectedClient.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedClient.address}, {selectedClient.city}, {selectedClient.state} {selectedClient.zip}</p>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline" size="sm" className="text-foreground gap-1.5 bg-transparent"><Pencil className="h-3.5 w-3.5" />Edit</Button></DialogTrigger>
                  <DialogContent className="max-w-lg bg-card text-foreground"><DialogHeader><DialogTitle className="text-foreground">Edit Client</DialogTitle></DialogHeader><ClientForm initial={selectedClient} onSubmit={handleEditClient} onCancel={() => setEditDialogOpen(false)} submitLabel="Save Changes" /></DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 bg-transparent hover:bg-destructive/10" onClick={() => handleDeleteClient(selectedClient.id)}><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</Button>
                <Badge variant="outline" className="text-primary border-primary">{selectedClient.state === "MO" ? "Missouri" : "Kansas"}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="border-border"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Contact</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-foreground"><Phone className="h-4 w-4 text-muted-foreground" />{selectedClient.phone}</div>
                  <div className="flex items-center gap-2 text-sm text-foreground"><Mail className="h-4 w-4 text-muted-foreground" />{selectedClient.email}</div>
                  <div className="flex items-center gap-2 text-sm text-foreground"><MapPin className="h-4 w-4 text-muted-foreground" />{selectedClient.city}, {selectedClient.state} {selectedClient.zip}</div>
                </CardContent>
              </Card>
              <Card className="border-border"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Property</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-foreground"><Ruler className="h-4 w-4 text-muted-foreground" />{selectedClient.sqft.toLocaleString()} sq ft</div>
                  <div className="flex items-center gap-2 text-sm text-foreground"><BedDouble className="h-4 w-4 text-muted-foreground" />{selectedClient.bedrooms} Bedroom{selectedClient.bedrooms !== 1 ? "s" : ""}</div>
                  <div className="flex items-center gap-2 text-sm text-foreground"><Bath className="h-4 w-4 text-muted-foreground" />{selectedClient.bathrooms} Bathroom{selectedClient.bathrooms !== 1 ? "s" : ""}</div>
                </CardContent>
              </Card>
              <Card className="border-border"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Care Instructions</CardTitle></CardHeader>
                <CardContent><div className="flex items-start gap-2"><AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground leading-relaxed">{selectedClient.careInstructions || "No special instructions."}</p></div></CardContent>
              </Card>
            </div>
            <ImageGallery clientId={selectedClient.id} />
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Appointment History</CardTitle></CardHeader>
              <CardContent>
                {clientAppointments.length === 0 ? <p className="text-sm text-muted-foreground">No appointments yet.</p> : (
                  <div className="flex flex-col gap-2">
                    {clientAppointments.slice(0, 10).map((apt) => {
                      const crew = getCrew(apt.crewId)
                      return (
                        <div key={apt.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{apt.date} - {formatTime(apt.startHour, apt.startMinute)}</p>
                            <p className="text-xs text-muted-foreground">{crew?.name || "Unknown"} &middot; {apt.durationMinutes} min</p>
                          </div>
                          <Badge variant="outline" className={apt.status === "completed" ? "text-accent border-accent" : apt.status === "in-progress" ? "text-primary border-primary" : "text-muted-foreground"}>{apt.status}</Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">Select a client to view details</div>
        )}
      </div>
    </div>
  )
}
