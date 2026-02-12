# 🚀 INSTALACIÓN COMPLETA - AllClean ERP PostgreSQL

## ✅ PASO A PASO SUPER SIMPLE

**TIEMPO TOTAL: 20 minutos**

---

## 📋 ANTES DE EMPEZAR

### 1. Verificar que tienes instalado:
```bash
node --version  # Debe ser v18+
psql --version  # Debe ser PostgreSQL 14+
git --version   # Cualquier versión
```

### 2. PostgreSQL debe estar corriendo
```bash
# Windows: Verifica en Servicios
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

### 3. Debes saber tu password de PostgreSQL
(La que usas para conectarte con `psql -U postgres`)

---

## 🔥 PASOS DE INSTALACIÓN

### PASO 1: Backup y Branch (2 min)

```bash
cd /ruta/a/tu/CleanMasters2

# Commit todo lo actual
git add .
git commit -m "Pre-PostgreSQL state"

# Crear backup
git checkout -b backup/pre-postgresql
git push origin backup/pre-postgresql

# Crear rama de trabajo
git checkout main  
git checkout -b feature/postgresql-system
```

---

### PASO 2: Descargar Archivos (1 min)

Descarga todos los archivos que te generé y tenlos en una carpeta aparte.
Los vamos a copiar uno por uno según las instrucciones.

---

### PASO 3: Instalar Dependencias (2 min)

```bash
# En la carpeta de tu proyecto
npm install @prisma/client prisma papaparse ical.js date-fns nodemailer bcryptjs
npm install -D @types/papaparse @types/nodemailer @types/bcryptjs
```

---

### PASO 4: Agregar Archivos NUEVOS (5 min)

Estos archivos NO existen, solo cópialos:

```bash
# 1. Crear carpetas
mkdir database
mkdir prisma

# 2. Copiar archivos de database
cp [descarga]/database-reset.sql database/reset-database.sql
cp [descarga]/database-seed.sql database/seed.sql

# 3. Copiar Prisma schema
cp [descarga]/prisma-schema.prisma prisma/schema.prisma

# 4. Copiar librerías nuevas (a carpeta lib/)
cp [descarga]/lib-prisma.ts lib/prisma.ts
cp [descarga]/lib-time-utils.ts lib/time-utils.ts
cp [descarga]/lib-import-utils.ts lib/import-utils.ts
cp [descarga]/lib-email-service.ts lib/email-service.ts
cp [descarga]/lib-crew-recommendation.ts lib/crew-recommendation.ts

# 5. Copiar componente nuevo
cp [descarga]/work-order-print.tsx components/work-order-print.tsx

# 6. Crear carpetas para nuevas API routes
mkdir -p app/api/appointments/\[id\]/complete
mkdir -p app/api/appointments/\[id\]/evidence
mkdir -p app/api/appointments/import
mkdir -p app/api/crews/recommend

# 7. Copiar nuevas API routes
cp [descarga]/api-appointments-complete.ts app/api/appointments/\[id\]/complete/route.ts
cp [descarga]/api-appointments-evidence.ts app/api/appointments/\[id\]/evidence/route.ts
cp [descarga]/api-appointments-import.ts app/api/appointments/import/route.ts
cp [descarga]/api-crews-recommend.ts app/api/crews/recommend/route.ts
```

---

### PASO 5: REEMPLAZAR Archivos Existentes (3 min)

```bash
# Hacer backup primero
cp app/api/appointments/route.ts app/api/appointments/route.ts.backup
cp app/api/appointments/\[id\]/route.ts app/api/appointments/\[id\]/route.ts.backup
cp app/api/appointments/realign/route.ts app/api/appointments/realign/route.ts.backup
cp app/api/crews/route.ts app/api/crews/route.ts.backup

# Ahora reemplazar
cp [descarga]/api-appointments-route-NEW.ts app/api/appointments/route.ts
cp [descarga]/api-appointments-id-route-NEW.ts app/api/appointments/\[id\]/route.ts
cp [descarga]/api-appointments-realign-NEW.ts app/api/appointments/realign/route.ts
cp [descarga]/api-crews-route-NEW.ts app/api/crews/route.ts
```

---

### PASO 6: Configurar .env (2 min)

```bash
# Copiar archivo .env
cp [descarga]/.env .env

# IMPORTANTE: Editar .env y cambiar TU password de PostgreSQL
nano .env
# o
code .env
```

En el archivo .env, cambiar esta línea:
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/allclean_erp?schema=public"
```

---

### PASO 7: Resetear Database (2 min)

```bash
# Resetear database
psql -U postgres -f database/reset-database.sql

# Deberías ver: "Database allclean_erp has been reset successfully!"
```

---

### PASO 8: Prisma Setup (3 min)

```bash
# Generar Prisma Client
npx prisma generate

# Crear y aplicar migraciones
npx prisma migrate dev --name init

# Cuando pregunte nombre, puedes dejar "init" presionando Enter
```

---

### PASO 9: Seed Database (1 min)

```bash
# Insertar datos de prueba
psql -U postgres -d allclean_erp -f database/seed.sql

# Deberías ver el mensaje de éxito con la info de login
```

---

### PASO 10: Iniciar Aplicación (1 min)

```bash
npm run dev
```

Deberías ver:
```
✓ Ready in XX ms
⚡ Local: http://localhost:3000
```

---

### PASO 11: Probar Login (1 min)

1. Ir a: http://localhost:3000/login
2. Email: `admin@allclean.com`
3. Password: `admin123`
4. Click Login

Si entras → ¡ÉXITO! 🎉

---

## 🎯 VERIFICACIONES POST-INSTALACIÓN

### Verifica que todo funcione:

```bash
# 1. Abrir Prisma Studio para ver la DB
npx prisma studio

# 2. En el navegador verifica:
- Login funciona ✓
- Calendar carga ✓
- Puedes ver clients ✓
- Puedes ver crews ✓
- Appointments aparecen ✓
```

---

## ❌ SI ALGO FALLA

### Error: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Error: "Database does not exist"
```bash
psql -U postgres -f database/reset-database.sql
```

### Error: "Table does not exist"
```bash
npx prisma migrate dev --name init
```

### Error: "No data showing"
```bash
psql -U postgres -d allclean_erp -f database/seed.sql
```

### Error: "Port 3000 already in use"
```bash
# Mata el proceso
# Windows: taskkill /F /IM node.exe
# Mac/Linux: killall node
```

---

## 📚 COMANDOS ÚTILES

```bash
# Ver database en navegador
npx prisma studio

# Reset completo (SI ALGO SALE MAL)
npx prisma migrate reset
psql -U postgres -d allclean_erp -f database/seed.sql

# Ver logs de PostgreSQL
# Mac: tail -f /usr/local/var/postgres/server.log
# Linux: tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🎉 ¡LISTO!

Si llegaste hasta aquí y todo funciona:
- ✅ PostgreSQL configurado
- ✅ Prisma funcionando
- ✅ App corriendo
- ✅ Puedes hacer login
- ✅ Datos de prueba cargados

**Siguiente paso:** Lee la documentación de las nuevas features en los archivos .md

---

## 🆘 AYUDA ADICIONAL

Si necesitas help:
1. Lee TROUBLESHOOTING.md
2. Revisa los errores en la consola
3. Verifica que PostgreSQL esté corriendo
4. Confirma que el .env tenga la password correcta

---

**¡Felicidades Elio! Ya tienes el sistema completo funcionando con PostgreSQL! 🚀**
