// ============================================
// APP/API/APPOINTMENTS/[ID]/COMPLETE/ROUTE.TS
// ============================================
// 🆕 NUEVO - Crear carpeta complete/ dentro de [id]/
// Ubicación: CleanMasters2/app/api/appointments/[id]/complete/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCompletionEmail } from '@/lib/email-service'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const appointment = await prisma.appointment.findUnique({
      where: { id },
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

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    if (appointment.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Appointment already completed' }, { status: 400 })
    }

    const completed = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        isLocked: true,
        lockedAt: new Date()
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

    // Update crew member experience
    if (completed.crew) {
      const memberIds = completed.crew.members.map(m => m.id)
      await prisma.crewMember.updateMany({
        where: { id: { in: memberIds } },
        data: {
          experience: {
            increment: 1
          }
        }
      })
    }

    await prisma.appointmentHistory.create({
      data: {
        appointmentId: id,
        action: 'completed',
        previousValue: appointment.status,
        newValue: 'COMPLETED',
        performedBy: body.completedBy || 'System',
        notes: 'Service completed successfully'
      }
    })

    // Send email if configured
    if (completed.client.email) {
      const settings = await prisma.settings.findUnique({
        where: { id: 'singleton' }
      })

      if (settings?.smtpHost && settings?.smtpUser && settings?.smtpPassword) {
        try {
          await sendCompletionEmail(completed as any, {
            host: settings.smtpHost,
            port: settings.smtpPort || 587,
            user: settings.smtpUser,
            password: settings.smtpPassword,
            from: settings.emailFromAddress || `AllClean <${settings.smtpUser}>`
          })

          await prisma.appointmentHistory.create({
            data: {
              appointmentId: id,
              action: 'email_sent',
              performedBy: 'System',
              notes: 'Completion email sent to client'
            }
          })
        } catch (emailError) {
          console.error('Email error:', emailError)
        }
      }
    }

    return NextResponse.json(completed)
  } catch (error) {
    console.error('Complete appointment error:', error)
    return NextResponse.json({ error: 'Failed to complete appointment' }, { status: 500 })
  }
}
