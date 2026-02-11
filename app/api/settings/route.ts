import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET() {
  return NextResponse.json(store.getSettings())
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const updated = store.updateSettings(body)
  return NextResponse.json(updated)
}
