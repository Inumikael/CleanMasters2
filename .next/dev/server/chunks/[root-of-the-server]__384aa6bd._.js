module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
// ============================================
// LIB/PRISMA.TS
// ============================================
// 🆕 NUEVO - Copiar a: CleanMasters2/lib/prisma.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/app/api/appointments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
// ============================================
// APP/API/APPOINTMENTS/ROUTE.TS
// ============================================
// 🔄 REEMPLAZAR - Backup primero el existente
// Ubicación: CleanMasters2/app/api/appointments/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/time-utils'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
async function GET(req) {
    try {
        const { searchParams } = req.nextUrl;
        const date = searchParams.get('date');
        const crewId = searchParams.get('crewId');
        const clientId = searchParams.get('clientId');
        const status = searchParams.get('status');
        const where = {};
        if (date) {
            const targetDate = new Date(date);
            where.scheduledDate = {
                gte: new Date(targetDate.setHours(0, 0, 0, 0)),
                lt: new Date(targetDate.setHours(23, 59, 59, 999))
            };
        }
        if (crewId) where.crewId = crewId;
        if (clientId) where.clientId = clientId;
        if (status) where.status = status;
        const appointments = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].appointment.findMany({
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
                    orderBy: {
                        timestamp: 'desc'
                    },
                    take: 10
                }
            },
            orderBy: [
                {
                    scheduledDate: 'asc'
                },
                {
                    startTime: 'asc'
                }
            ]
        });
        // Auto-lock check
        const now = new Date();
        const updates = [];
        appointments.forEach((apt)=>{
            if (!apt.isLocked && shouldBeLocked(apt.scheduledDate, apt.startTime, now)) {
                updates.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].appointment.update({
                    where: {
                        id: apt.id
                    },
                    data: {
                        isLocked: true,
                        lockedAt: now,
                        status: apt.status === 'SCHEDULED' ? 'IN_PROGRESS' : apt.status
                    }
                }));
            }
        });
        if (updates.length > 0) {
            await Promise.all(updates);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(appointments);
    } catch (error) {
        console.error('GET appointments error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch appointments'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        if (!body.clientId || !body.scheduledDate || !body.startTime || !body.durationMinutes) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        const [hours, minutes] = body.startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + body.durationMinutes;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
        let address = body.address;
        let city = body.city;
        let zone = body.zone;
        if (!address || !zone) {
            const client = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].client.findUnique({
                where: {
                    id: body.clientId
                }
            });
            if (client) {
                address = address || client.address || 'No address';
                city = city || client.city;
                zone = zone || client.zone;
            }
        }
        const appointment = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].appointment.create({
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
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].appointmentHistory.create({
            data: {
                appointmentId: appointment.id,
                action: 'created',
                newValue: 'SCHEDULED',
                performedBy: 'System',
                notes: 'Appointment created'
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(appointment, {
            status: 201
        });
    } catch (error) {
        console.error('POST appointment error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create appointment'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__384aa6bd._.js.map