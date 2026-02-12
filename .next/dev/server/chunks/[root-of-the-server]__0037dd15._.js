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
"[project]/lib/server-store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Server-side in-memory data store (singleton)
__turbopack_context__.s([
    "store",
    ()=>store
]);
// --------------- Seed Data ---------------
const today = new Date();
const todayStr = today.toISOString().split("T")[0];
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const dayAfterStr = dayAfter.toISOString().split("T")[0];
const defaultTasks = [
    {
        label: "Vacuum all rooms",
        done: false
    },
    {
        label: "Mop floors",
        done: false
    },
    {
        label: "Clean bathrooms",
        done: false
    },
    {
        label: "Dust surfaces",
        done: false
    },
    {
        label: "Kitchen deep clean",
        done: false
    },
    {
        label: "Empty trash cans",
        done: false
    }
];
class DataStore {
    users = [
        {
            id: "user-1",
            email: "admin@allclean.com",
            name: "Admin Principal",
            password: "admin123",
            role: "super_admin",
            status: "active",
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
        }
    ];
    crews = [
        {
            id: "crew-1",
            name: "Alpha Team",
            members: [
                {
                    id: "m-1",
                    name: "Maria Garcia",
                    role: "Lider",
                    phone: "(816) 555-1001",
                    avatar: null,
                    documents: []
                },
                {
                    id: "m-2",
                    name: "James Wilson",
                    role: "Empleado General",
                    phone: "(816) 555-1002",
                    avatar: null,
                    documents: []
                }
            ],
            color: "hsl(224, 58%, 33%)"
        },
        {
            id: "crew-2",
            name: "Beta Team",
            members: [
                {
                    id: "m-3",
                    name: "Sarah Johnson",
                    role: "Lider",
                    phone: "(913) 555-2001",
                    avatar: null,
                    documents: []
                },
                {
                    id: "m-4",
                    name: "Mike Brown",
                    role: "Empleado General",
                    phone: "(913) 555-2002",
                    avatar: null,
                    documents: []
                }
            ],
            color: "hsl(160, 84%, 39%)"
        },
        {
            id: "crew-3",
            name: "Gamma Team",
            members: [
                {
                    id: "m-5",
                    name: "Lisa Chen",
                    role: "Lider",
                    phone: "(816) 555-3001",
                    avatar: null,
                    documents: []
                },
                {
                    id: "m-6",
                    name: "Tom Davis",
                    role: "Empleado General",
                    phone: "(816) 555-3002",
                    avatar: null,
                    documents: []
                }
            ],
            color: "hsl(197, 60%, 45%)"
        }
    ];
    clients = [
        {
            id: "client-1",
            name: "Thompson Residence",
            phone: "(816) 555-0142",
            email: "thompson@email.com",
            address: "1234 Oak Street",
            city: "Kansas City",
            state: "MO",
            zip: "64108",
            sqft: 2400,
            bedrooms: 4,
            bathrooms: 3,
            careInstructions: "Use eco-friendly products only. Dog in backyard.",
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: "client-2",
            name: "Miller Home",
            phone: "(913) 555-0278",
            email: "miller@email.com",
            address: "5678 Elm Avenue",
            city: "Overland Park",
            state: "KS",
            zip: "66204",
            sqft: 1800,
            bedrooms: 3,
            bathrooms: 2,
            careInstructions: "Alarm code: 4521. Key under mat.",
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: "client-3",
            name: "Davis Office",
            phone: "(816) 555-0391",
            email: "davis@email.com",
            address: "910 Main Street, Suite 200",
            city: "Kansas City",
            state: "MO",
            zip: "64105",
            sqft: 3200,
            bedrooms: 0,
            bathrooms: 2,
            careInstructions: "Commercial space. Clean after 6 PM only.",
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: "client-4",
            name: "Park Residence",
            phone: "(913) 555-0456",
            email: "park@email.com",
            address: "2210 Maple Drive",
            city: "Lenexa",
            state: "KS",
            zip: "66215",
            sqft: 2800,
            bedrooms: 5,
            bathrooms: 3,
            careInstructions: "Hardwood floors only - no wet mopping in living room.",
            images: [],
            createdAt: new Date().toISOString()
        },
        {
            id: "client-5",
            name: "Rivera Condo",
            phone: "(816) 555-0633",
            email: "rivera@email.com",
            address: "401 Grand Blvd, Unit 12B",
            city: "Kansas City",
            state: "MO",
            zip: "64106",
            sqft: 1200,
            bedrooms: 2,
            bathrooms: 1,
            careInstructions: "Condo rules: no vacuuming before 9 AM. Use service elevator.",
            images: [],
            createdAt: new Date().toISOString()
        }
    ];
    appointments = [
        {
            id: "apt-1",
            clientId: "client-1",
            crewId: "crew-1",
            date: todayStr,
            startHour: 8,
            startMinute: 0,
            durationMinutes: 120,
            status: "scheduled",
            tasks: defaultTasks.map((t)=>({
                    ...t
                })),
            notes: "",
            createdAt: new Date().toISOString()
        },
        {
            id: "apt-2",
            clientId: "client-2",
            crewId: "crew-1",
            date: todayStr,
            startHour: 11,
            startMinute: 0,
            durationMinutes: 90,
            status: "scheduled",
            tasks: defaultTasks.map((t)=>({
                    ...t
                })),
            notes: "",
            createdAt: new Date().toISOString()
        },
        {
            id: "apt-3",
            clientId: "client-3",
            crewId: "crew-2",
            date: todayStr,
            startHour: 9,
            startMinute: 0,
            durationMinutes: 150,
            status: "in-progress",
            tasks: defaultTasks.map((t)=>({
                    ...t
                })),
            notes: "",
            createdAt: new Date().toISOString()
        },
        {
            id: "apt-4",
            clientId: "client-4",
            crewId: "crew-2",
            date: tomorrowStr,
            startHour: 8,
            startMinute: 30,
            durationMinutes: 120,
            status: "scheduled",
            tasks: defaultTasks.map((t)=>({
                    ...t
                })),
            notes: "",
            createdAt: new Date().toISOString()
        },
        {
            id: "apt-5",
            clientId: "client-5",
            crewId: "crew-3",
            date: todayStr,
            startHour: 10,
            startMinute: 0,
            durationMinutes: 60,
            status: "completed",
            tasks: defaultTasks.map((t)=>({
                    ...t,
                    done: true
                })),
            notes: "",
            createdAt: new Date().toISOString()
        },
        {
            id: "apt-6",
            clientId: "client-1",
            crewId: "crew-3",
            date: tomorrowStr,
            startHour: 13,
            startMinute: 0,
            durationMinutes: 120,
            status: "scheduled",
            tasks: defaultTasks.map((t)=>({
                    ...t
                })),
            notes: "",
            createdAt: new Date().toISOString()
        },
        {
            id: "apt-7",
            clientId: "client-3",
            crewId: "crew-1",
            date: dayAfterStr,
            startHour: 9,
            startMinute: 0,
            durationMinutes: 180,
            status: "scheduled",
            tasks: defaultTasks.map((t)=>({
                    ...t
                })),
            notes: "",
            createdAt: new Date().toISOString()
        }
    ];
    settings = {
        businessName: "AllClean Masters",
        phone: "(816) 555-CLEAN",
        email: "info@allcleanmasters.com",
        serviceArea: "Kansas City Metro (KS & MO)",
        bufferMinutes: 30,
        autoOptimize: true,
        workStartHour: 6,
        workEndHour: 20,
        notifyNewBooking: true,
        notifyCrewStatus: true,
        notifyConflicts: true
    };
    nextId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    }
    // ---- Auth ----
    login(email, password) {
        const u = this.users.find((u)=>u.email === email && u.password === password && u.status === "active");
        if (!u) return null;
        u.lastLogin = new Date().toISOString();
        const { password: _, ...safe } = u;
        return {
            user: safe,
            token: `token-${u.id}-${Date.now()}`
        };
    }
    // ---- Users ----
    getUsers() {
        return this.users.map(({ password: _, ...u })=>u);
    }
    getUser(id) {
        const u = this.users.find((u)=>u.id === id);
        if (!u) return null;
        const { password: _, ...safe } = u;
        return safe;
    }
    createUser(data) {
        if (this.users.find((u)=>u.email === data.email)) return null;
        const user = {
            id: this.nextId("user"),
            email: data.email,
            name: data.name,
            password: data.password,
            role: data.role,
            status: "active",
            createdAt: new Date().toISOString()
        };
        this.users.push(user);
        const { password: _, ...safe } = user;
        return safe;
    }
    updateUser(id, data) {
        const idx = this.users.findIndex((u)=>u.id === id);
        if (idx === -1) return null;
        if (data.name) this.users[idx].name = data.name;
        if (data.role) this.users[idx].role = data.role;
        if (data.status) this.users[idx].status = data.status;
        const { password: _, ...safe } = this.users[idx];
        return safe;
    }
    deleteUser(id) {
        const idx = this.users.findIndex((u)=>u.id === id);
        if (idx === -1) return false;
        this.users.splice(idx, 1);
        return true;
    }
    changePassword(userId, currentPassword, newPassword) {
        const u = this.users.find((u)=>u.id === userId);
        if (!u || u.password !== currentPassword) return false;
        u.password = newPassword;
        return true;
    }
    // ---- Appointments ----
    getAppointments(filters) {
        let result = [
            ...this.appointments
        ];
        if (filters?.date) result = result.filter((a)=>a.date === filters.date);
        if (filters?.crewId) result = result.filter((a)=>a.crewId === filters.crewId);
        if (filters?.clientId) result = result.filter((a)=>a.clientId === filters.clientId);
        if (filters?.status) result = result.filter((a)=>a.status === filters.status);
        return result.sort((a, b)=>{
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute);
        });
    }
    getAppointment(id) {
        return this.appointments.find((a)=>a.id === id) || null;
    }
    createAppointment(data) {
        const apt = {
            ...data,
            id: this.nextId("apt"),
            createdAt: new Date().toISOString()
        };
        this.appointments.push(apt);
        return apt;
    }
    updateAppointment(id, data) {
        const idx = this.appointments.findIndex((a)=>a.id === id);
        if (idx === -1) return null;
        this.appointments[idx] = {
            ...this.appointments[idx],
            ...data
        };
        return this.appointments[idx];
    }
    deleteAppointment(id) {
        const idx = this.appointments.findIndex((a)=>a.id === id);
        if (idx === -1) return false;
        this.appointments.splice(idx, 1);
        return true;
    }
    cancelAppointment(id) {
        const apt = this.appointments.find((a)=>a.id === id);
        if (!apt || apt.status === "in-progress") return null;
        apt.status = "cancelled";
        return apt;
    }
    realignSchedule(date) {
        const dates = date ? [
            date
        ] : [
            ...new Set(this.appointments.map((a)=>a.date))
        ];
        for (const d of dates){
            for (const crew of this.crews){
                const crewApts = this.appointments.filter((a)=>a.date === d && a.crewId === crew.id && a.status !== "cancelled").sort((a, b)=>a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute));
                if (crewApts.length <= 1) continue;
                let nextAvailable = crewApts[0].startHour * 60 + crewApts[0].startMinute + crewApts[0].durationMinutes + this.settings.bufferMinutes;
                for(let i = 1; i < crewApts.length; i++){
                    const apt = crewApts[i];
                    if (apt.status === "in-progress" || apt.status === "completed") {
                        nextAvailable = apt.startHour * 60 + apt.startMinute + apt.durationMinutes + this.settings.bufferMinutes;
                        continue;
                    }
                    const currentStart = apt.startHour * 60 + apt.startMinute;
                    if (currentStart > nextAvailable) {
                        const idx = this.appointments.findIndex((a)=>a.id === apt.id);
                        if (idx !== -1) {
                            this.appointments[idx] = {
                                ...this.appointments[idx],
                                startHour: Math.floor(nextAvailable / 60),
                                startMinute: nextAvailable % 60
                            };
                        }
                        nextAvailable = nextAvailable + apt.durationMinutes + this.settings.bufferMinutes;
                    } else {
                        nextAvailable = currentStart + apt.durationMinutes + this.settings.bufferMinutes;
                    }
                }
            }
        }
        return true;
    }
    // ---- Clients ----
    getClients() {
        return [
            ...this.clients
        ];
    }
    getClient(id) {
        return this.clients.find((c)=>c.id === id) || null;
    }
    createClient(data) {
        const client = {
            ...data,
            id: this.nextId("client"),
            images: data.images || [],
            createdAt: new Date().toISOString()
        };
        this.clients.push(client);
        return client;
    }
    updateClient(id, data) {
        const idx = this.clients.findIndex((c)=>c.id === id);
        if (idx === -1) return null;
        this.clients[idx] = {
            ...this.clients[idx],
            ...data
        };
        return this.clients[idx];
    }
    deleteClient(id) {
        const idx = this.clients.findIndex((c)=>c.id === id);
        if (idx === -1) return false;
        this.clients.splice(idx, 1);
        return true;
    }
    // ---- Crews ----
    getCrews() {
        return [
            ...this.crews
        ];
    }
    getCrew(id) {
        return this.crews.find((c)=>c.id === id) || null;
    }
    createCrew(data) {
        const crew = {
            id: this.nextId("crew"),
            name: data.name,
            color: data.color,
            members: data.members || []
        };
        this.crews.push(crew);
        return crew;
    }
    updateCrew(id, data) {
        const idx = this.crews.findIndex((c)=>c.id === id);
        if (idx === -1) return null;
        this.crews[idx] = {
            ...this.crews[idx],
            ...data
        };
        return this.crews[idx];
    }
    deleteCrew(id) {
        const idx = this.crews.findIndex((c)=>c.id === id);
        if (idx === -1) return false;
        this.crews.splice(idx, 1);
        return true;
    }
    addCrewMember(crewId, member) {
        const crew = this.crews.find((c)=>c.id === crewId);
        if (!crew) return null;
        // Only 1 Lider per crew
        if (member.role === "Lider" && crew.members.some((m)=>m.role === "Lider")) {
            // Demote existing leader
            crew.members = crew.members.map((m)=>m.role === "Lider" ? {
                    ...m,
                    role: "Empleado General"
                } : m);
        }
        const newMember = {
            ...member,
            id: this.nextId("m")
        };
        crew.members.push(newMember);
        return crew;
    }
    updateCrewMember(memberId, data) {
        for (const crew of this.crews){
            const idx = crew.members.findIndex((m)=>m.id === memberId);
            if (idx !== -1) {
                // If updating to Lider, demote existing leader
                if (data.role === "Lider") {
                    crew.members = crew.members.map((m, i)=>i !== idx && m.role === "Lider" ? {
                            ...m,
                            role: "Empleado General"
                        } : m);
                }
                crew.members[idx] = {
                    ...crew.members[idx],
                    ...data
                };
                return crew.members[idx];
            }
        }
        return null;
    }
    deleteCrewMember(memberId) {
        for (const crew of this.crews){
            const idx = crew.members.findIndex((m)=>m.id === memberId);
            if (idx !== -1) {
                crew.members.splice(idx, 1);
                return true;
            }
        }
        return false;
    }
    /** Get or create the "Sin asignar" crew for CSV imports */ getUnassignedCrew() {
        let crew = this.crews.find((c)=>c.name === "Sin asignar");
        if (!crew) {
            crew = {
                id: this.nextId("crew"),
                name: "Sin asignar",
                color: "#888888",
                members: []
            };
            this.crews.push(crew);
        }
        return crew;
    }
    // ---- Settings ----
    getSettings() {
        return {
            ...this.settings
        };
    }
    updateSettings(data) {
        this.settings = {
            ...this.settings,
            ...data
        };
        return this.settings;
    }
}
// Singleton
const globalForStore = globalThis;
const store = globalForStore.store ?? new DataStore();
if ("TURBOPACK compile-time truthy", 1) globalForStore.store = store;
}),
"[project]/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server-store.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    const { email, password } = await req.json();
    const result = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].login(email, password);
    if (!result) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Credenciales incorrectas"
        }, {
            status: 401
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0037dd15._.js.map