import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const apt = store.getAppointment(id)
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(apt)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const updated = store.updateAppointment(id, body)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const apt = store.getAppointment(id)
  if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (apt.status === "in-progress") return NextResponse.json({ error: "Cannot delete an in-progress job" }, { status: 400 })
  store.deleteAppointment(id)
  return NextResponse.json({ success: true })
}
