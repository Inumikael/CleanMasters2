import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const apt = store.cancelAppointment(id)
  if (!apt) return NextResponse.json({ error: "Cannot cancel" }, { status: 400 })
  return NextResponse.json(apt)
}
