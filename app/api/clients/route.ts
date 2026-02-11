import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET() {
  return NextResponse.json(store.getClients())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const client = store.createClient(body)
  return NextResponse.json(client, { status: 201 })
}
