// ============================================
// APP/API/APPOINTMENTS/IMPORT/ROUTE.TS
// ============================================
// 🆕 NUEVO - Crear carpeta import/
// Ubicación: CleanMasters2/app/api/appointments/import/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseCSVFile, parseICSFile } from '@/lib/import-utils'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const importedBy = formData.get('importedBy') as string || 'User'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileType = file.name.endsWith('.csv') ? 'CSV' : 
                     file.name.endsWith('.ics') ? 'ICS' : null

    if (!fileType) {
      return NextResponse.json(
        { error: 'Invalid file type. Only .csv and .ics files are supported.' },
        { status: 400 }
      )
    }

    const importLog = await prisma.importLog.create({
      data: {
        fileName: file.name,
        fileType,
        status: 'PENDING',
        importedBy
      }
    })

    try {
      const fileContent = await file.text()

      let parseResult
      if (fileType === 'CSV') {
        parseResult = await parseCSVFile(fileContent)
      } else {
        parseResult = parseICSFile(fileContent)
      }

      const { appointments, errors } = parseResult

      if (errors.length > 0 && appointments.length === 0) {
        await prisma.importLog.update({
          where: { id: importLog.id },
          data: {
            status: 'FAILED',
            errorLog: errors.join('\n'),
            completedAt: new Date()
          }
        })
        return NextResponse.json({
          success: false,
          errors,
          message: 'Import failed'
        }, { status: 400 })
      }

      const created = []
      const failed = []

      for (const apt of appointments) {
        try {
          let client = await prisma.client.findFirst({
            where: {
              OR: [
                { email: apt.clientEmail || undefined },
                { name: apt.clientName }
              ]
            }
          })

          if (!client) {
            client = await prisma.client.create({
              data: {
                name: apt.clientName,
                email: apt.clientEmail,
                phone: apt.clientPhone,
                address: apt.address,
                city: apt.city,
                zone: (apt.zone as any) || 'NORTH'
              }
            })
          }

          const appointment = await prisma.appointment.create({
            data: {
              clientId: client.id,
              scheduledDate: apt.scheduledDate,
              startTime: apt.startTime,
              endTime: apt.endTime || apt.startTime,
              durationMinutes: apt.durationMinutes,
              address: apt.address,
              city: apt.city,
              zone: (apt.zone as any) || client.zone,
              status: 'SCHEDULED',
              isLocked: false,
              serviceType: apt.serviceType,
              tasks: apt.tasks || [],
              specialNotes: apt.specialNotes
            }
          })

          await prisma.appointmentHistory.create({
            data: {
              appointmentId: appointment.id,
              action: 'imported',
              performedBy: importedBy,
              notes: `Imported from ${fileType} file: ${file.name}`
            }
          })

          created.push(appointment)
        } catch (error) {
          failed.push({
            appointment: apt,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      await prisma.importLog.update({
        where: { id: importLog.id },
        data: {
          status: failed.length > 0 ? 'PARTIAL' : 'SUCCESS',
          recordCount: created.length,
          errorLog: failed.length > 0 
            ? failed.map(f => `${f.appointment.clientName}: ${f.error}`).join('\n')
            : null,
          completedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        imported: created.length,
        failed: failed.length,
        errors: [...errors, ...failed.map(f => f.error)],
        appointments: created
      })
    } catch (error) {
      await prisma.importLog.update({
        where: { id: importLog.id },
        data: {
          status: 'FAILED',
          errorLog: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        }
      })
      throw error
    }
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    )
  }
}
