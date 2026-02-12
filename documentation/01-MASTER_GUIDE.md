# 🚀 GUÍA MAESTRA - AllClean ERP con PostgreSQL

## ⚠️ LEE ESTO PRIMERO, ELIO

Esta guía te va a explicar **EXACTAMENTE** qué hacer con cada archivo.
**TIEMPO ESTIMADO: 20 minutos**

---

## 📊 RESUMEN RÁPIDO

Voy a darte 3 tipos de archivos:

1. **🆕 NUEVOS** - No existen en tu proyecto, solo copiarlos
2. **🔄 REEMPLAZAR** - Ya existen, debes reemplazarlos
3. **📚 DOCUMENTACIÓN** - Guías de referencia

---

## 🗂️ ESTRUCTURA COMPLETA DE LO QUE VOY A GENERAR

```
📁 AllClean-PostgreSQL/
│
├── 📁 01-DOCUMENTACION/
│   ├── MASTER_GUIDE.md          ← Estás aquí
│   ├── INSTALLATION_STEPS.md    ← Sigue esto paso a paso
│   ├── FILE_ACTION_LIST.md      ← Lista de qué hacer con cada archivo
│   └── TROUBLESHOOTING.md       ← Si algo falla
│
├── 📁 02-DATABASE/
│   ├── 01-reset-database.sql    ← 🆕 NUEVO - Resetea la DB
│   ├── 02-seed-data.sql         ← 🆕 NUEVO - Datos de prueba
│   └── INSTALL_DB.md            ← Instrucciones
│
├── 📁 03-PRISMA/
│   └── schema.prisma            ← 🆕 NUEVO - Schema de DB
│
├── 📁 04-CORE-LIBRARIES/
│   ├── prisma.ts                ← 🆕 NUEVO
│   ├── time-utils.ts            ← 🆕 NUEVO - Lógica 15-min
│   ├── import-utils.ts          ← 🆕 NUEVO - CSV/ICS import
│   ├── email-service.ts         ← 🆕 NUEVO - Emails
│   └── crew-recommendation.ts   ← 🆕 NUEVO - AI recommendations
│
├── 📁 05-API-ROUTES/
│   ├── 📁 NUEVOS/
│   │   ├── appointments-[id]-complete-route.ts
│   │   ├── appointments-[id]-evidence-route.ts
│   │   ├── appointments-import-route.ts
│   │   └── crews-recommend-route.ts
│   └── 📁 REEMPLAZAR/
│       ├── appointments-route.ts
│       ├── appointments-[id]-route.ts
│       ├── appointments-realign-route.ts
│       └── crews-route.ts
│
├── 📁 06-COMPONENTS/
│   └── work-order-print.tsx     ← 🆕 NUEVO
│
├── 📁 07-CONFIG/
│   ├── .env                     ← 🆕 NUEVO
│   ├── .gitignore              ← 🔄 ACTUALIZAR
│   └── package.json            ← 🔄 ACTUALIZAR
│
└── 📁 08-QUICK-REFERENCE/
    ├── API_REFERENCE.md
    ├── COMMANDS_CHEATSHEET.md
    └── FEATURES_LIST.md
```

---

## 🎯 TU PLAN DE ACCIÓN (En Orden)

### PASO 1: Preparación (5 min)
- [ ] Hacer backup del proyecto actual
- [ ] Crear nueva rama de Git
- [ ] Verificar que PostgreSQL esté corriendo

### PASO 2: Leer Documentación (5 min)
- [ ] Leer esta guía completa
- [ ] Leer FILE_ACTION_LIST.md
- [ ] Entender qué archivos van dónde

### PASO 3: Base de Datos (5 min)
- [ ] Resetear PostgreSQL database
- [ ] Correr seed data
- [ ] Verificar tablas creadas

### PASO 4: Instalar Dependencias (3 min)
- [ ] npm install de paquetes nuevos
- [ ] Verificar package.json

### PASO 5: Agregar Archivos Nuevos (5 min)
- [ ] Copiar prisma/schema.prisma
- [ ] Copiar lib/*.ts (5 archivos)
- [ ] Copiar nuevas API routes
- [ ] Copiar componentes

### PASO 6: Reemplazar Archivos (3 min)
- [ ] Backup archivos originales
- [ ] Reemplazar API routes específicas
- [ ] Actualizar .env y .gitignore

### PASO 7: Configurar Prisma (3 min)
- [ ] npx prisma generate
- [ ] npx prisma migrate dev

### PASO 8: Testing (5 min)
- [ ] npm run dev
- [ ] Login con admin@allclean.com
- [ ] Verificar funcionalidades

---

## 📋 CHECKLIST PRE-INSTALACIÓN

Antes de empezar, verifica:

```bash
# 1. Node.js instalado
node --version
# Necesitas: v18.0.0 o superior

# 2. PostgreSQL instalado y corriendo
psql --version
# Necesitas: PostgreSQL 14 o superior

# 3. PostgreSQL corriendo
# Windows: Servicios → PostgreSQL
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# 4. Puedes conectarte a PostgreSQL
psql -U postgres
# Si pide contraseña, necesitas saberla
```

---

## 🚨 IMPORTANTE: Backup Primero

**NO HAGAS NADA HASTA HACER ESTO:**

```bash
cd /ruta/a/tu/proyecto/CleanMasters2

# Commit cambios actuales
git add .
git commit -m "Estado actual antes de PostgreSQL migration"

# Crear rama de backup
git checkout -b backup/antes-postgresql
git push origin backup/antes-postgresql

# Crear rama de trabajo
git checkout main
git checkout -b feature/postgresql-erp-system

# Verificar que estás en la rama correcta
git branch
# Debe mostrar: * feature/postgresql-erp-system
```

---

## 📖 SIGUIENTES PASOS

Una vez que hayas:
- ✅ Leído esta guía completa
- ✅ Hecho el backup
- ✅ Verificado pre-requisitos
- ✅ Creado la rama de trabajo

**Ve al siguiente documento:**

👉 **FILE_ACTION_LIST.md** 

Ese documento te dirá EXACTAMENTE qué hacer con cada archivo que te voy a generar.

---

## 💡 CONSEJOS

1. **Lee TODO primero** - No empieces a copiar archivos sin leer
2. **Un paso a la vez** - No te adelantes
3. **Si algo falla** - PARA y consulta TROUBLESHOOTING.md
4. **Guarda este documento** - Lo vas a consultar varias veces

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Voy a perder mi código actual?**
R: NO. Hiciste backup. Puedes volver con: `git checkout backup/antes-postgresql`

**P: ¿Cuánto tiempo toma?**
R: 20-30 minutos siguiendo los pasos en orden.

**P: ¿Qué pasa con mis datos actuales?**
R: Los datos en memoria se perderán, pero tendrás datos de prueba nuevos.

**P: ¿Necesito saber Prisma o PostgreSQL?**
R: NO. Todo está pre-configurado.

**P: ¿Qué si me equivoco?**
R: Git te protege. Solo haz `git checkout .` para deshacer cambios.

---

## 🎯 OBJETIVO FINAL

Al terminar tendrás:
- ✅ PostgreSQL database funcionando
- ✅ Smart calendar con lock de 15 minutos
- ✅ Auto-realignment con buffers de 30 min
- ✅ Sistema de crews con XP tracking
- ✅ Upload de evidencia (fotos antes/después)
- ✅ Emails automáticos
- ✅ Import de CSV/Outlook
- ✅ Work orders imprimibles
- ✅ Todo 100% funcional

---

**¿Listo para continuar?**

Lee el siguiente documento: **FILE_ACTION_LIST.md**

---

*Creado para Elio - AllClean ERP PostgreSQL Migration*
*Última actualización: 2026-02-11*
