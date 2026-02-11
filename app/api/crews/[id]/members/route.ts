import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const crew = store.addCrewMember(id, body)
  if (!crew) return NextResponse.json({ error: "Crew not found" }, { status: 404 })
  return NextResponse.json(crew, { status: 201 })
}
