import { NextResponse } from "next/server"
import { store } from "@/lib/server-store"

export async function GET() {
  const crew = store.getUnassignedCrew()
  return NextResponse.json(crew)
}
