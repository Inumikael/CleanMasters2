// ============================================
// APP/API/CREWS/ROUTE.TS
// ============================================
// 🔄 REEMPLAZAR existente
// Ubicación: CleanMasters2/app/api/crews/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const includeMembers = searchParams.get('includeMembers') === 'true'
    const includeStats = searchParams.get('includeStats') === 'true'

    const crews = await prisma.crew.findMany({
      include: {
        members: includeMembers,
        ...(includeStats && {
          appointments: {
            where: { status: 'COMPLETED' },
            select: { id: true }
          }
        })
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(crews)
  } catch (error) {
    console.error('GET crews error:', error)
    return NextResponse.json({ error: 'Failed to fetch crews' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const crew = await prisma.crew.create({
      data: {
        name: body.name,
        color: body.color || '#3B82F6',
        isActive: body.isActive !== false
      },
      include: {
        members: true
      }
    })

    return NextResponse.json(crew, { status: 201 })
  } catch (error) {
    console.error('POST crew error:', error)
    return NextResponse.json({ error: 'Failed to create crew' }, { status: 500 })
  }
}
