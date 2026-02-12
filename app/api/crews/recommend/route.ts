// ============================================
// APP/API/CREWS/RECOMMEND/ROUTE.TS
// ============================================
// 🆕 NUEVO - Crear carpeta recommend/
// Ubicación: CleanMasters2/app/api/crews/recommend/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { recommendCrewMembers, suggestCrewImprovements } from '@/lib/crew-recommendation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { crewId, requiredRoles } = body

    let currentMembers: any[] = []
    if (crewId) {
      const crew = await prisma.crew.findUnique({
        where: { id: crewId },
        include: { members: true }
      })
      currentMembers = crew?.members || []
    }

    const unassignedMembers = await prisma.crewMember.findMany({
      where: {
        crewId: null,
        isActive: true
      }
    })

    const recommendation = recommendCrewMembers(unassignedMembers, requiredRoles)
    const suggestions = crewId 
      ? suggestCrewImprovements(currentMembers, unassignedMembers)
      : []

    return NextResponse.json({
      recommendation,
      suggestions,
      availableCount: unassignedMembers.length,
      currentCount: currentMembers.length
    })
  } catch (error) {
    console.error('Crew recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}
