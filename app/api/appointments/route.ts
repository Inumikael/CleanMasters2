import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const date = searchParams.get("date") || undefined
  const crewId = searchParams.get("crewId") || undefined
  const clientId = searchParams.get("clientId") || undefined
  const status = searchParams.get("status") || undefined
  const appointments = store.getAppointments({ date, crewId, clientId, status })
  const crews = store.getCrews()
  const clients = store.getClients()
  const enriched = appointments.map((a) => ({
    ...a,
    clientName: clients.find((c) => c.id === a.clientId)?.name || "Unknown",
    crewName: crews.find((c) => c.id === a.crewId)?.name || "Unknown",
    crewColor: crews.find((c) => c.id === a.crewId)?.color || "#888",
  }))
  return NextResponse.json(enriched)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const apt = store.createAppointment(body)
  return NextResponse.json(apt, { status: 201 })
}
