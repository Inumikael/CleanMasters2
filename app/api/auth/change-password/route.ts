import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword, userId } = await req.json()
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
  const ok = store.changePassword(userId, currentPassword, newPassword)
  if (!ok) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 })
  return NextResponse.json({ success: true })
}
