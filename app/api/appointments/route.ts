// ============================================
// APP/API/APPOINTMENTS/ROUTE.TS
// ============================================
// 🔄 REEMPLAZAR - Backup primero el existente
// Ubicación: CleanMasters2/app/api/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shouldBeLocked } from '@/lib/time-utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const date = searchParams.get('date')
    const crewId = searchParams.get('crewId')
    const clientId = searchParams.get('clientId')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (date) {
      const targetDate = new Date(date)
      where.scheduledDate = {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    }
    
    if (crewId) where.crewId = crewId
    if (clientId) where.clientId = clientId
    if (status) where.status = status

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: true,
        crew: {
          include: {
            members: true
          }
        },
        evidence: true,
        history: {
          orderBy: { timestamp: 'desc' },
          take: 10
        }
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { startTime: 'asc' }
      ]
    })

    // Auto-lock check
    const now = new Date()
    const updates: Promise<any>[] = []
    
    appointments.forEach(apt => {
      if (!apt.isLocked && shouldBeLocked(apt.scheduledDate, apt.startTime, now)) {
        updates.push(
          prisma.appointment.update({
            where: { id: apt.id },
            data: { 
              isLocked: true,
              lockedAt: now,
              status: apt.status === 'SCHEDULED' ? 'IN_PROGRESS' : apt.status
            }
          })
        )
      }
    })

    if (updates.length > 0) {
      await Promise.all(updates)
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('GET appointments error:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.clientId || !body.scheduledDate || !body.startTime || !body.durationMinutes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const [hours, minutes] = body.startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + body.durationMinutes
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

    let address = body.address
    let city = body.city
    let zone = body.zone

    if (!address || !zone) {
      const client = await prisma.client.findUnique({
        where: { id: body.clientId }
      })

      if (client) {
        address = address || client.address || 'No address'
        city = city || client.city
        zone = zone || client.zone
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId: body.clientId,
        crewId: body.crewId || null,
        scheduledDate: new Date(body.scheduledDate),
        startTime: body.startTime,
        endTime,
        durationMinutes: body.durationMinutes,
        address,
        city,
        zone,
        status: 'SCHEDULED',
        isLocked: false,
        serviceType: body.serviceType,
        tasks: body.tasks || [],
        specialNotes: body.specialNotes,
        estimatedCost: body.estimatedCost
      },
      include: {
        client: true,
        crew: {
          include: {
            members: true
          }
        }
      }
    })

    await prisma.appointmentHistory.create({
      data: {
        appointmentId: appointment.id,
        action: 'created',
        newValue: 'SCHEDULED',
        performedBy: 'System',
        notes: 'Appointment created'
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('POST appointment error:', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 })
  }
}
