import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET() {
  return NextResponse.json(store.getCrews())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const crew = store.createCrew(body)
  return NextResponse.json(crew, { status: 201 })
}
