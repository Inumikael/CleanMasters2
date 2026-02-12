import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 1. Mapa de traducción (Español -> Base de Datos)
const ROLE_MAPPING: Record<string, string> = {
  'Lider': 'LEADER',
  'Líder': 'LEADER',
  'Leader': 'LEADER',
  'Asistente': 'ASSISTANT',
  'Assistant': 'ASSISTANT',
  'Conductor': 'DRIVER',
  'Driver': 'DRIVER',
  'Limpiador': 'CLEANER',
  'Cleaner': 'CLEANER'
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    console.log("📝 Solicitud de nuevo miembro:", body.name)
    console.log("🎭 Rol recibido:", body.role)

    // 2. Validación y Traducción del Rol
    let dbRole = ROLE_MAPPING[body.role] || body.role.toUpperCase();
    
    // Si la traducción falló o no existe, forzamos un valor seguro
    const validRoles = ['LEADER', 'ASSISTANT', 'DRIVER', 'CLEANER'];
    if (!validRoles.includes(dbRole)) {
       console.warn(`⚠️ Rol desconocido "${body.role}", asignando ASSISTANT por defecto.`);
       dbRole = 'ASSISTANT';
    }

    const experienceInt = parseInt(body.experience?.toString() || '0', 10)

    const member = await prisma.crewMember.create({
      data: {
        crewId: id,
        name: body.name,
        role: dbRole, // <--- Usamos el rol traducido
        phone: body.phone || null,
        email: body.email || null,
        experience: experienceInt,
        isActive: true,
        photoUrl: body.photoUrl || null
      }
    })

    console.log("✅ Miembro contratado:", member.id)
    return NextResponse.json(member, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error al guardar miembro:', error.message)
    return NextResponse.json(
      { error: 'Error: ' + error.message },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const members = await prisma.crewMember.findMany({
      where: { crewId: id },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}