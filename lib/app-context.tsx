"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

// ---- Types ----

export type CrewMember = {
  id: string
  name: string
  role: "Lider" | "Empleado General"
  phone: string
  avatar?: string | null
  documents: string[]
}

export type Crew = {
  id: string
  name: string
  members: CrewMember[]
  color: string
}

export type Client = {
  id: string
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: "KS" | "MO"
  zip: string
  sqft: number
  bedrooms: number
  bathrooms: number
  careInstructions: string
  images: string[]
}

export type AppointmentTask = { id?: string; label: string; done: boolean }

function toDateOnly(date: string | Date): string {
  if (typeof date === "string") return date.split("T")[0]
  return date.toISOString().split("T")[0]
}

export type Appointment = {
  id: string
  clientId: string
  crewId: string
  date: string
  startHour: number
  startMinute: number
  durationMinutes: number
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  tasks: AppointmentTask[]
  notes: string
}

export type AppSettings = {
  businessName: string
  phone: string
  email: string
  serviceArea: string
  bufferMinutes: number
  autoOptimize: boolean
  workStartHour: number
  workEndHour: number
  notifyNewBooking: boolean
  notifyCrewStatus: boolean
  notifyConflicts: boolean
}

export type User = {
  id: string
  email: string
  name: string
  role: string
}

// ---- Fetch helpers ----

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Error ${res.status}`)
  }
  return res.json()
}

// ---- Context ----

type AppState = {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  crews: Crew[]
  clients: Client[]
  appointments: Appointment[]
  settings: AppSettings | null
  fetchCrews: () => Promise<void>
  fetchClients: () => Promise<void>
  fetchAppointments: (filters?: Record<string, string>) => Promise<void>
  fetchSettings: () => Promise<void>
  addCrew: (crew: Omit<Crew, "id">) => Promise<void>
  updateCrew: (id: string, data: Partial<Crew>) => Promise<void>
  deleteCrew: (id: string) => Promise<void>
  addCrewMember: (crewId: string, data: Omit<CrewMember, "id">) => Promise<void>
  updateCrewMember: (id: string, data: Partial<CrewMember>) => Promise<void>
  deleteCrewMember: (id: string) => Promise<void>
  addClient: (client: Omit<Client, "id">) => Promise<Client | undefined>
  updateClient: (id: string, data: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  addClientImage: (clientId: string, imageUrl: string) => Promise<void>
  removeClientImage: (clientId: string, imageIndex: number) => Promise<void>
  addAppointment: (apt: Omit<Appointment, "id">) => Promise<void>
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  cancelAppointment: (id: string) => Promise<void>
  realignSchedule: () => Promise<void>
  updateSettings: (data: Partial<AppSettings>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  getClient: (id: string) => Client | undefined
  getCrew: (id: string) => Crew | undefined
  getUnassignedCrew: () => Promise<Crew>
  getAppointment: (id: string) => Appointment | undefined
}

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [crews, setCrews] = useState<Crew[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const fetchCrews = useCallback(async () => {
    try { setCrews(await api("/api/crews")) } catch { /* ignore */ }
  }, [])

  const fetchClients = useCallback(async () => {
    try { setClients(await api("/api/clients")) } catch { /* ignore */ }
  }, [])

  const fetchAppointments = useCallback(async (filters?: Record<string, string>) => {
    try {
      const params = filters ? `?${new URLSearchParams(filters)}` : ""
      const data = await api(`/api/appointments${params}`)
      setAppointments((Array.isArray(data) ? data : []).map((a: Appointment & { date?: string | Date }) => ({
        ...a,
        date: toDateOnly(a.date ?? new Date()),
      })))
    } catch { /* ignore */ }
  }, [])

  const fetchSettings = useCallback(async () => {
    try { setSettings(await api("/api/settings")) } catch { /* ignore */ }
  }, [])

  // Load data when user is set
  useEffect(() => {
    if (user) {
      fetchCrews()
      fetchClients()
      fetchAppointments()
      fetchSettings()
    }
  }, [user, fetchCrews, fetchClients, fetchAppointments, fetchSettings])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user: userData } = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido"
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("user")
    setUser(null)
    setCrews([])
    setClients([])
    setAppointments([])
    setSettings(null)
  }, [])

  const addCrew = useCallback(async (crew: Omit<Crew, "id">) => {
    await api("/api/crews", { method: "POST", body: JSON.stringify(crew) })
    await fetchCrews()
  }, [fetchCrews])

  const updateCrew = useCallback(async (id: string, data: Partial<Crew>) => {
    await api(`/api/crews/${id}`, { method: "PUT", body: JSON.stringify(data) })
    await fetchCrews()
  }, [fetchCrews])

  const deleteCrew = useCallback(async (id: string) => {
    await api(`/api/crews/${id}`, { method: "DELETE" })
    await fetchCrews()
  }, [fetchCrews])

  const addCrewMember = useCallback(async (crewId: string, data: Omit<CrewMember, "id">) => {
    await api(`/api/crews/${crewId}/members`, { method: "POST", body: JSON.stringify(data) })
    await fetchCrews()
  }, [fetchCrews])

  const updateCrewMember = useCallback(async (id: string, data: Partial<CrewMember>) => {
    await api(`/api/crew-members/${id}`, { method: "PUT", body: JSON.stringify(data) })
    await fetchCrews()
  }, [fetchCrews])

  const deleteCrewMember = useCallback(async (id: string) => {
    await api(`/api/crew-members/${id}`, { method: "DELETE" })
    await fetchCrews()
  }, [fetchCrews])

  const addClient = useCallback(async (client: Omit<Client, "id">) => {
    try {
      const created = await api("/api/clients", { method: "POST", body: JSON.stringify(client) })
      await fetchClients()
      return created as Client
    } catch { return undefined }
  }, [fetchClients])

  const updateClient = useCallback(async (id: string, data: Partial<Client>) => {
    await api(`/api/clients/${id}`, { method: "PUT", body: JSON.stringify(data) })
    await fetchClients()
  }, [fetchClients])

  const deleteClient = useCallback(async (id: string) => {
    await api(`/api/clients/${id}`, { method: "DELETE" })
    await fetchClients()
  }, [fetchClients])

  const addClientImage = useCallback(async (clientId: string, imageUrl: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client) return
    await api(`/api/clients/${clientId}`, { method: "PUT", body: JSON.stringify({ images: [...(client.images || []), imageUrl] }) })
    await fetchClients()
  }, [clients, fetchClients])

  const removeClientImage = useCallback(async (clientId: string, imageIndex: number) => {
    const client = clients.find((c) => c.id === clientId)
    if (!client?.images?.[imageIndex]) return
    const newImages = client.images.filter((_, i) => i !== imageIndex)
    await api(`/api/clients/${clientId}`, { method: "PUT", body: JSON.stringify({ images: newImages }) })
    await fetchClients()
  }, [clients, fetchClients])

  const addAppointment = useCallback(async (apt: Omit<Appointment, "id">) => {
    await api("/api/appointments", { method: "POST", body: JSON.stringify(apt) })
    await fetchAppointments()
  }, [fetchAppointments])

  const updateAppointment = useCallback(async (id: string, data: Partial<Appointment>) => {
    await api(`/api/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) })
    await fetchAppointments()
  }, [fetchAppointments])

  const deleteAppointment = useCallback(async (id: string) => {
    await api(`/api/appointments/${id}`, { method: "DELETE" })
    await fetchAppointments()
  }, [fetchAppointments])

  const cancelAppointment = useCallback(async (id: string) => {
    await api(`/api/appointments/${id}/cancel`, { method: "POST" })
    await fetchAppointments()
  }, [fetchAppointments])

  const realignSchedule = useCallback(async () => {
    await api("/api/appointments/realign", { method: "POST", body: JSON.stringify({}) })
    await fetchAppointments()
  }, [fetchAppointments])

  const updateSettingsAction = useCallback(async (data: Partial<AppSettings>) => {
    await api("/api/settings", { method: "PUT", body: JSON.stringify(data) })
    await fetchSettings()
  }, [fetchSettings])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await api("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword, userId: user?.id }),
    })
  }, [user])

  const getClient = useCallback((id: string) => clients.find((c) => c.id === id), [clients])
  const getCrew = useCallback((id: string) => crews.find((c) => c.id === id), [crews])
  const getUnassignedCrew = useCallback(async () => {
    const crew = await api("/api/crews/unassigned")
    await fetchCrews()
    return crew as Crew
  }, [fetchCrews])
  const getAppointment = useCallback((id: string) => appointments.find((a) => a.id === id), [appointments])

  const value: AppState = {
    user, isLoading, error, login, logout,
    crews, clients, appointments, settings,
    fetchCrews, fetchClients, fetchAppointments, fetchSettings,
    addCrew, updateCrew, deleteCrew,
    addCrewMember, updateCrewMember, deleteCrewMember,
    addClient, updateClient, deleteClient, addClientImage, removeClientImage,
    addAppointment, updateAppointment, deleteAppointment, cancelAppointment, realignSchedule,
    updateSettings: updateSettingsAction,
    changePassword,
    getClient, getCrew, getUnassignedCrew, getAppointment,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppState debe ser usado dentro de AppProvider")
  return context
}

export const defaultTasks: AppointmentTask[] = [
  { label: "Vacuum all rooms", done: false },
  { label: "Mop floors", done: false },
  { label: "Clean bathrooms", done: false },
  { label: "Dust surfaces", done: false },
  { label: "Kitchen deep clean", done: false },
  { label: "Empty trash cans", done: false },
]
