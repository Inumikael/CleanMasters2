import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET() {
  return NextResponse.json(store.getUsers())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const user = store.createUser(body)
  if (!user) return NextResponse.json({ error: "Email ya existe" }, { status: 400 })
  return NextResponse.json(user, { status: 201 })
}
