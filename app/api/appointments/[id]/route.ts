// ============================================
// APP/API/APPOINTMENTS/[ID]/ROUTE.TS
// ============================================
// 🔄 REEMPLAZAR - Backup primero
// Ubicación: CleanMasters2/app/api/appointments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { shouldBeLocked, isWithinEditWindow } from '@/lib/time-utils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        crew: {
          include: {
            members: true
          }
        },
        evidence: {
          orderBy: { uploadedAt: 'desc' }
        },
        history: {
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Auto-lock if needed
    if (!appointment.isLocked && shouldBeLocked(appointment.scheduledDate, appointment.startTime)) {
      await prisma.appointment.update({
        where: { id },
        data: {
          isLocked: true,
          lockedAt: new Date(),
          status: appointment.status === 'SCHEDULED' ? 'IN_PROGRESS' : appointment.status
        }
      })
      appointment.isLocked = true
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('GET appointment error:', error)
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const existing = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Check locking
    const now = new Date()
    const isLocked = existing.isLocked || shouldBeLocked(existing.scheduledDate, existing.startTime, now)
    const withinWindow = isWithinEditWindow(existing.scheduledDate, existing.startTime, now)

    if (isLocked && !withinWindow) {
      return NextResponse.json(
        { error: 'Appointment is locked. Cannot edit after 15-minute window.' },
        { status: 403 }
      )
    }

    let endTime = body.endTime
    if (body.startTime && body.durationMinutes) {
      const [hours, minutes] = body.startTime.split(':').map(Number)
      const totalMinutes = hours * 60 + minutes + body.durationMinutes
      const endHours = Math.floor(totalMinutes / 60)
      const endMinutes = totalMinutes % 60
      endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(body.clientId && { clientId: body.clientId }),
        ...(body.crewId !== undefined && { crewId: body.crewId }),
        ...(body.scheduledDate && { scheduledDate: new Date(body.scheduledDate) }),
        ...(body.startTime && { startTime: body.startTime }),
        ...(endTime && { endTime }),
        ...(body.durationMinutes && { durationMinutes: body.durationMinutes }),
        ...(body.address && { address: body.address }),
        ...(body.city && { city: body.city }),
        ...(body.zone && { zone: body.zone }),
        ...(body.status && { status: body.status }),
        ...(body.serviceType !== undefined && { serviceType: body.serviceType }),
        ...(body.tasks && { tasks: body.tasks }),
        ...(body.specialNotes !== undefined && { specialNotes: body.specialNotes }),
        ...(body.estimatedCost !== undefined && { estimatedCost: body.estimatedCost }),
      },
      include: {
        client: true,
        crew: {
          include: {
            members: true
          }
        },
        evidence: true
      }
    })

    await prisma.appointmentHistory.create({
      data: {
        appointmentId: id,
        action: 'updated',
        performedBy: body.updatedBy || 'User',
        notes: 'Appointment details updated'
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT appointment error:', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    if (appointment.status === 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Cannot delete an in-progress appointment' },
        { status: 403 }
      )
    }

    if (appointment.status === 'COMPLETED') {
      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      })
      return NextResponse.json({ success: true, appointment: updated })
    }

    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE appointment error:', error)
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
