import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const updated = store.updateCrewMember(id, body)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  store.deleteCrewMember(id)
  return NextResponse.json({ success: true })
}
