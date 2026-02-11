import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const result = store.login(email, password)
  if (!result) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
  }
  return NextResponse.json(result)
}
