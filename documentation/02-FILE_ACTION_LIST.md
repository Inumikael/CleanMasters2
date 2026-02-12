# 📋 FILE ACTION LIST - Qué Hacer con Cada Archivo

## 🎯 INSTRUCCIONES SUPER CLARAS

Esta guía te dice **EXACTAMENTE** qué hacer con cada archivo que te voy a dar.

**FORMATO:**
- 🆕 = NUEVO - Crear este archivo (no existe)
- 🔄 = REEMPLAZAR - Ya existe, reemplazar con nueva versión
- 📝 = ACTUALIZAR - Existe, agregar contenido
- 📚 = DOCUMENTACIÓN - Solo para leer

---

## 📁 SECCIÓN 1: ARCHIVOS DE BASE DE DATOS

### 🆕 `database/reset-database.sql`
**ACCIÓN:** Crear carpeta `database/` en la raíz y copiar archivo
**UBICACIÓN:** `CleanMasters2/database/reset-database.sql`
**CUÁNDO USAR:** ANTES de correr Prisma migrations
```bash
psql -U postgres -f database/reset-database.sql
```

### 🆕 `database/seed.sql`
**ACCIÓN:** Copiar a carpeta `database/`
**UBICACIÓN:** `CleanMasters2/database/seed.sql`
**CUÁNDO USAR:** DESPUÉS de correr Prisma migrations
```bash
psql -U postgres -d allclean_erp -f database/seed.sql
```

---

## 📁 SECCIÓN 2: PRISMA SCHEMA

### 🆕 `prisma/schema.prisma`
**ACCIÓN:** Crear carpeta `prisma/` en la raíz y copiar archivo
**UBICACIÓN:** `CleanMasters2/prisma/schema.prisma`
**NOTA:** Este es el schema completo de la base de datos

**DESPUÉS DE COPIARLO:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 📁 SECCIÓN 3: CORE LIBRARIES (Carpeta lib/)

### 🆕 `lib/prisma.ts`
**ACCIÓN:** Copiar a carpeta `lib/`
**UBICACIÓN:** `CleanMasters2/lib/prisma.ts`
**QUÉ ES:** Cliente de Prisma para conexión a DB

### 🆕 `lib/time-utils.ts`
**ACCIÓN:** Copiar a carpeta `lib/`
**UBICACIÓN:** `CleanMasters2/lib/time-utils.ts`
**QUÉ ES:** Lógica del smart calendar (15-min window, auto-realign)

### 🆕 `lib/import-utils.ts`
**ACCIÓN:** Copiar a carpeta `lib/`
**UBICACIÓN:** `CleanMasters2/lib/import-utils.ts`
**QUÉ ES:** Parsers para CSV y Outlook (.ics)

### 🆕 `lib/email-service.ts`
**ACCIÓN:** Copiar a carpeta `lib/`
**UBICACIÓN:** `CleanMasters2/lib/email-service.ts`
**QUÉ ES:** Sistema de emails con Nodemailer

### 🆕 `lib/crew-recommendation.ts`
**ACCIÓN:** Copiar a carpeta `lib/`
**UBICACIÓN:** `CleanMasters2/lib/crew-recommendation.ts`
**QUÉ ES:** Algoritmo de IA para recomendar crews

### ⚠️ `lib/server-store.ts`
**ACCIÓN:** **NO BORRAR TODAVÍA** (por si necesitas volver atrás)
**NOTA:** Una vez que todo funcione, puedes borrarlo

---

## 📁 SECCIÓN 4: API ROUTES - NUEVOS

Estos archivos **NO EXISTEN** en tu proyecto. Créalos.

### 🆕 `app/api/appointments/[id]/complete/route.ts`
**ACCIÓN:** Crear carpeta `complete/` dentro de `app/api/appointments/[id]/`
**UBICACIÓN:** `CleanMasters2/app/api/appointments/[id]/complete/route.ts`
**QUÉ HACE:** Marca appointment como completado y envía emails

### 🆕 `app/api/appointments/[id]/evidence/route.ts`
**ACCIÓN:** Crear carpeta `evidence/` dentro de `app/api/appointments/[id]/`
**UBICACIÓN:** `CleanMasters2/app/api/appointments/[id]/evidence/route.ts`
**QUÉ HACE:** Sube fotos de evidencia (before/after)

### 🆕 `app/api/appointments/import/route.ts`
**ACCIÓN:** Crear carpeta `import/` dentro de `app/api/appointments/`
**UBICACIÓN:** `CleanMasters2/app/api/appointments/import/route.ts`
**QUÉ HACE:** Importa appointments desde CSV o Outlook

### 🆕 `app/api/crews/recommend/route.ts`
**ACCIÓN:** Crear carpeta `recommend/` dentro de `app/api/crews/`
**UBICACIÓN:** `CleanMasters2/app/api/crews/recommend/route.ts`
**QUÉ HACE:** Genera recomendaciones de crew con IA

---

## 📁 SECCIÓN 5: API ROUTES - REEMPLAZAR

Estos archivos **YA EXISTEN**. Debes reemplazarlos.

### 🔄 `app/api/appointments/route.ts`
**ACCIÓN:** REEMPLAZAR el archivo existente
**BACKUP PRIMERO:**
```bash
cp app/api/appointments/route.ts app/api/appointments/route.ts.backup
```
**DESPUÉS:** Copiar la nueva versión
**CAMBIO PRINCIPAL:** Ahora usa Prisma en vez de server-store

### 🔄 `app/api/appointments/[id]/route.ts`
**ACCIÓN:** REEMPLAZAR el archivo existente
**BACKUP PRIMERO:**
```bash
cp app/api/appointments/[id]/route.ts app/api/appointments/[id]/route.ts.backup
```
**CAMBIO PRINCIPAL:** Implementa locking de 15 minutos

### 🔄 `app/api/appointments/realign/route.ts`
**ACCIÓN:** REEMPLAZAR el archivo existente
**BACKUP PRIMERO:**
```bash
cp app/api/appointments/realign/route.ts app/api/appointments/realign/route.ts.backup
```
**CAMBIO PRINCIPAL:** Auto-realignment con zonas y buffers

### 🔄 `app/api/crews/route.ts`
**ACCIÓN:** REEMPLAZAR el archivo existente
**BACKUP PRIMERO:**
```bash
cp app/api/crews/route.ts app/api/crews/route.ts.backup
```
**CAMBIO PRINCIPAL:** Soporte para recommendations

### ⚠️ OTROS API ROUTES (NO TOCAR)
Estos NO se modifican:
- `app/api/appointments/[id]/cancel/route.ts` → NO CAMBIAR
- `app/api/auth/**` → NO CAMBIAR
- `app/api/clients/**` → NO CAMBIAR
- `app/api/crew-members/**` → NO CAMBIAR
- `app/api/settings/**` → NO CAMBIAR
- `app/api/users/**` → NO CAMBIAR

**PERO:** Debes actualizar sus imports eventualmente para usar Prisma

---

## 📁 SECCIÓN 6: COMPONENTES

### 🆕 `components/work-order-print.tsx`
**ACCIÓN:** Copiar a carpeta `components/`
**UBICACIÓN:** `CleanMasters2/components/work-order-print.tsx`
**QUÉ ES:** Componente para imprimir work orders

---

## 📁 SECCIÓN 7: ARCHIVOS DE CONFIGURACIÓN

### 🆕 `.env`
**ACCIÓN:** Crear en la raíz del proyecto
**UBICACIÓN:** `CleanMasters2/.env`
**IMPORTANTE:** Actualizar con TU password de PostgreSQL
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/allclean_erp"
```

### 📝 `.gitignore`
**ACCIÓN:** ACTUALIZAR (agregar líneas, no reemplazar todo)
**UBICACIÓN:** `CleanMasters2/.gitignore`
**AGREGAR ESTAS LÍNEAS:**
```
# Environment
.env
.env.local
.env.*.local

# Prisma
prisma/*.db
prisma/*.db-journal

# Uploads
/public/uploads/*
!/public/uploads/.gitkeep
```

### 🔄 `package.json`
**ACCIÓN:** ACTUALIZAR dependencias
**IMPORTANTE:** NO reemplaces todo, solo actualiza las secciones que te indique

**AGREGAR A dependencies:**
```json
"@prisma/client": "^6.1.0",
"papaparse": "^5.4.1",
"ical.js": "^2.1.0",
"nodemailer": "^6.9.16",
"bcryptjs": "^2.4.3"
```

**AGREGAR A devDependencies:**
```json
"prisma": "^6.1.0",
"@types/papaparse": "^5.3.15",
"@types/nodemailer": "^6.4.17",
"@types/bcryptjs": "^2.4.6"
```

**AGREGAR A scripts:**
```json
"db:studio": "prisma studio",
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:reset": "prisma migrate reset",
"db:seed": "psql -U postgres -d allclean_erp -f database/seed.sql"
```

---

## 📁 SECCIÓN 8: DOCUMENTACIÓN (Solo Leer)

Estos archivos son para tu referencia:

### 📚 `INSTALLATION_STEPS.md`
**QUÉ ES:** Guía paso a paso de instalación

### 📚 `TROUBLESHOOTING.md`
**QUÉ ES:** Soluciones a problemas comunes

### 📚 `API_REFERENCE.md`
**QUÉ ES:** Documentación de todos los endpoints

### 📚 `QUICK_COMMANDS.md`
**QUÉ ES:** Comandos útiles de referencia rápida

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de copiar todos los archivos, verifica:

### Estructura de Carpetas:
```
CleanMasters2/
├── database/
│   ├── reset-database.sql ✓
│   └── seed.sql ✓
├── prisma/
│   └── schema.prisma ✓
├── lib/
│   ├── prisma.ts ✓
│   ├── time-utils.ts ✓
│   ├── import-utils.ts ✓
│   ├── email-service.ts ✓
│   ├── crew-recommendation.ts ✓
│   └── server-store.ts (mantener por ahora)
├── app/api/appointments/
│   ├── route.ts (reemplazado) ✓
│   ├── [id]/
│   │   ├── route.ts (reemplazado) ✓
│   │   ├── complete/route.ts (nuevo) ✓
│   │   └── evidence/route.ts (nuevo) ✓
│   ├── import/route.ts (nuevo) ✓
│   └── realign/route.ts (reemplazado) ✓
├── app/api/crews/
│   ├── route.ts (reemplazado) ✓
│   └── recommend/route.ts (nuevo) ✓
├── components/
│   └── work-order-print.tsx ✓
├── .env ✓
├── .gitignore (actualizado) ✓
└── package.json (actualizado) ✓
```

---

## 🚀 ORDEN DE EJECUCIÓN

Una vez que tengas todos los archivos en su lugar:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Resetear database:**
   ```bash
   psql -U postgres -f database/reset-database.sql
   ```

3. **Generar Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Correr migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed database:**
   ```bash
   psql -U postgres -d allclean_erp -f database/seed.sql
   ```

6. **Iniciar app:**
   ```bash
   npm run dev
   ```

---

## 💡 NOTAS IMPORTANTES

1. **Backups de archivos reemplazados:**
   - Antes de reemplazar, haz backup con `.backup` al final
   - Ejemplo: `route.ts.backup`

2. **No borres `server-store.ts` todavía:**
   - Espera a que todo funcione
   - Luego puedes borrarlo

3. **`.env` es secreto:**
   - NO lo subas a Git
   - Ya está en `.gitignore`

4. **Si algo falla:**
   - Para inmediatamente
   - Lee TROUBLESHOOTING.md
   - No sigas copiando archivos

---

**¿Listo?** 

Siguiente paso: **INSTALLATION_STEPS.md** para comenzar la instalación.

---

*Para Elio - Guía detallada de archivos*
*Fecha: 2026-02-11*
