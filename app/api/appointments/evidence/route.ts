// ============================================
// APP/API/APPOINTMENTS/[ID]/EVIDENCE/ROUTE.TS
// ============================================
// 🆕 NUEVO - Crear carpeta evidence/ dentro de [id]/
// Ubicación: CleanMasters2/app/api/appointments/[id]/evidence/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(
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

    const formData = await req.formData()
    const type = formData.get('type') as string
    const description = formData.get('description') as string || undefined
    const files = formData.getAll('files') as File[]

    if (!type || !['BEFORE', 'AFTER', 'DAMAGE', 'EXTRA'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid evidence type. Must be BEFORE, AFTER, DAMAGE, or EXTRA' },
        { status: 400 }
      )
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'evidence', id)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const evidenceRecords = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Max 5MB.` },
          { status: 400 }
        )
      }

      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const extension = file.name.split('.').pop()
      const filename = `${type.toLowerCase()}_${timestamp}_${randomStr}.${extension}`
      const filepath = join(uploadDir, filename)

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      const photoUrl = `/uploads/evidence/${id}/${filename}`
      const evidence = await prisma.appointmentEvidence.create({
        data: {
          appointmentId: id,
          type: type as any,
          photoUrl,
          description
        }
      })

      evidenceRecords.push(evidence)
    }

    await prisma.appointmentHistory.create({
      data: {
        appointmentId: id,
        action: 'evidence_uploaded',
        performedBy: 'User',
        notes: `${evidenceRecords.length} ${type} photo(s) uploaded`
      }
    })

    return NextResponse.json({
      success: true,
      count: evidenceRecords.length,
      evidence: evidenceRecords
    })
  } catch (error) {
    console.error('Evidence upload error:', error)
    return NextResponse.json({ error: 'Failed to upload evidence' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const evidence = await prisma.appointmentEvidence.findMany({
      where: { appointmentId: id },
      orderBy: { uploadedAt: 'desc' }
    })

    const grouped = {
      before: evidence.filter(e => e.type === 'BEFORE'),
      after: evidence.filter(e => e.type === 'AFTER'),
      damage: evidence.filter(e => e.type === 'DAMAGE'),
      extra: evidence.filter(e => e.type === 'EXTRA')
    }

    return NextResponse.json({ all: evidence, grouped })
  } catch (error) {
    console.error('Get evidence error:', error)
    return NextResponse.json({ error: 'Failed to fetch evidence' }, { status: 500 })
  }
}
