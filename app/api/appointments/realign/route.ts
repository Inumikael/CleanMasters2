// ============================================
// APP/API/APPOINTMENTS/REALIGN/ROUTE.TS
// ============================================
// 🔄 REEMPLAZAR existente
// Ubicación: CleanMasters2/app/api/appointments/realign/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOptimalSchedule } from '@/lib/time-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, crewId } = body

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const settings = await prisma.settings.findUnique({
      where: { id: 'singleton' }
    })
    const bufferMinutes = settings?.bufferMinutes || 30

    const targetDate = new Date(date)
    const where: any = {
      scheduledDate: {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999))
      },
      status: { in: ['SCHEDULED'] },
      isLocked: false
    }

    if (crewId) {
      where.crewId = crewId
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [
        { zone: 'asc' },
        { startTime: 'asc' }
      ]
    })

    if (appointments.length === 0) {
      return NextResponse.json({
        message: 'No appointments to realign',
        count: 0
      })
    }

    const optimized = calculateOptimalSchedule(
      appointments.map(apt => ({
        id: apt.id,
        startTime: apt.startTime,
        endTime: apt.endTime,
        durationMinutes: apt.durationMinutes,
        zone: apt.zone,
        address: apt.address
      })),
      bufferMinutes
    )

    const updates = optimized.map(opt => {
      return prisma.appointment.update({
        where: { id: opt.id },
        data: {
          startTime: opt.startTime,
          endTime: opt.endTime
        }
      })
    })

    await Promise.all(updates)

    const historyEntries = optimized.map(opt => {
      const original = appointments.find(a => a.id === opt.id)!
      return prisma.appointmentHistory.create({
        data: {
          appointmentId: opt.id,
          action: 'realigned',
          previousValue: `${original.startTime} - ${original.endTime}`,
          newValue: `${opt.startTime} - ${opt.endTime}`,
          performedBy: 'System',
          notes: `Auto-realigned with ${bufferMinutes}min buffer`
        }
      })
    })

    await Promise.all(historyEntries)

    return NextResponse.json({
      message: 'Schedule realigned successfully',
      count: optimized.length,
      bufferMinutes,
      appointments: optimized
    })
  } catch (error) {
    console.error('Realign error:', error)
    return NextResponse.json({ error: 'Failed to realign schedule' }, { status: 500 })
  }
}
