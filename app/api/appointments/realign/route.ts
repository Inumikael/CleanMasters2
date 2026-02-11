import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  store.realignSchedule(body.date)
  return NextResponse.json({ success: true })
}
