// ============================================
// LIB/IMPORT-UTILS.TS
// ============================================
// 🆕 NUEVO - Copiar a: CleanMasters2/lib/import-utils.ts

import { parse as parseCSV } from 'papaparse'
import ICAL from 'ical.js'
import { format } from 'date-fns'

export interface ImportedAppointment {
  clientName: string
  clientEmail?: string
  clientPhone?: string
  address: string
  city?: string
  zone?: string
  scheduledDate: Date
  startTime: string
  endTime?: string
  durationMinutes: number
  serviceType?: string
  tasks?: string[]
  specialNotes?: string
}

export async function parseCSVFile(fileContent: string): Promise<{
  appointments: ImportedAppointment[]
  errors: string[]
}> {
  const errors: string[] = []
  const appointments: ImportedAppointment[] = []

  return new Promise((resolve) => {
    parseCSV(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row: any, index: number) => {
          try {
            if (!row.clientName || !row.address || !row.scheduledDate || !row.startTime) {
              errors.push(`Row ${index + 2}: Missing required fields`)
              return
            }

            const scheduledDate = new Date(row.scheduledDate)
            if (isNaN(scheduledDate.getTime())) {
              errors.push(`Row ${index + 2}: Invalid date`)
              return
            }

            let durationMinutes = parseInt(row.durationMinutes) || 120
            let endTime = row.endTime
            if (!endTime) {
              const [hours, minutes] = row.startTime.split(':').map(Number)
              const totalMinutes = hours * 60 + minutes + durationMinutes
              const endHours = Math.floor(totalMinutes / 60)
              const endMinutes = totalMinutes % 60
              endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
            }

            const tasks = row.tasks ? row.tasks.split(';').map((t: string) => t.trim()) : []

            appointments.push({
              clientName: row.clientName.trim(),
              clientEmail: row.clientEmail?.trim(),
              clientPhone: row.clientPhone?.trim(),
              address: row.address.trim(),
              city: row.city?.trim(),
              zone: row.zone?.toUpperCase(),
              scheduledDate,
              startTime: row.startTime.trim(),
              endTime: endTime.trim(),
              durationMinutes,
              serviceType: row.serviceType?.trim(),
              tasks: tasks.length > 0 ? tasks : undefined,
              specialNotes: row.notes?.trim() || row.specialNotes?.trim(),
            })
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        })
        resolve({ appointments, errors })
      },
      error: (error) => {
        errors.push(`CSV Parse Error: ${error.message}`)
        resolve({ appointments, errors })
      }
    })
  })
}

export function parseICSFile(fileContent: string): {
  appointments: ImportedAppointment[]
  errors: string[]
} {
  const errors: string[] = []
  const appointments: ImportedAppointment[] = []

  try {
    const jcalData = ICAL.parse(fileContent)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents('vevent')

    vevents.forEach((vevent, index) => {
      try {
        const event = new ICAL.Event(vevent)
        const summary = event.summary || 'Untitled Event'
        const description = event.description || ''
        const location = event.location || ''
        const startDate = event.startDate.toJSDate()
        const endDate = event.endDate.toJSDate()
        const durationMs = endDate.getTime() - startDate.getTime()
        const durationMinutes = Math.round(durationMs / (1000 * 60))
        const startTime = format(startDate, 'HH:mm')
        const endTime = format(endDate, 'HH:mm')

        appointments.push({
          clientName: summary,
          address: location || 'No address provided',
          scheduledDate: startDate,
          startTime,
          endTime,
          durationMinutes,
          serviceType: 'Imported from Calendar',
          specialNotes: description,
        })
      } catch (error) {
        errors.push(`Event ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })
  } catch (error) {
    errors.push(`ICS Parse Error: ${error instanceof Error ? error.message : 'Invalid ICS file'}`)
  }

  return { appointments, errors }
}

export function generateCSVTemplate(): string {
  const headers = [
    'clientName',
    'clientEmail',
    'clientPhone',
    'address',
    'city',
    'zone',
    'scheduledDate',
    'startTime',
    'endTime',
    'durationMinutes',
    'serviceType',
    'tasks',
    'notes'
  ]

  const sampleRow = [
    'Starbucks Downtown',
    'downtown@starbucks.com',
    '+1 (555) 123-4567',
    '123 Main St',
    'Austin',
    'CENTRAL',
    '2026-02-15',
    '08:00',
    '10:00',
    '120',
    'Daily Maintenance',
    'Floor mopping; Bathroom cleaning; Trash removal',
    'Use eco-friendly products'
  ]

  return headers.join(',') + '\n' + sampleRow.join(',')
}
