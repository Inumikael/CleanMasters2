-- ============================================
-- AllClean ERP - PostgreSQL Database Reset
-- ============================================
-- 🆕 NUEVO - Ubicación: CleanMasters2/database/reset-database.sql
--
-- IMPORTANTE: Este script BORRA la base de datos existente
-- y crea una nueva desde cero.
--
-- CÓMO USAR:
-- psql -U postgres -f database/reset-database.sql

-- Step 1: Terminar conexiones activas
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'allclean_erp'
  AND pid <> pg_backend_pid();

-- Step 2: Borrar database si existe
DROP DATABASE IF EXISTS allclean_erp;

-- Step 3: Crear nueva database
CREATE DATABASE allclean_erp
  WITH 
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TEMPLATE = template0;

-- Step 4: Conectar a la nueva database
\c allclean_erp

-- Step 5: Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto

-- Success message
SELECT 'Database allclean_erp has been reset successfully!' as message;
SELECT 'Next step: Run Prisma migrations with: npx prisma migrate dev' as next_step;
