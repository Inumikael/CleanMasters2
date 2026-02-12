-- ============================================
-- AllClean ERP - Seed Data
-- ============================================
-- 🆕 NUEVO - Ubicación: CleanMasters2/database/seed.sql
--
-- Este script inserta datos de prueba en la database
-- Incluye: usuarios, clientes, crews, miembros, appointments
--
-- IMPORTANTE: Correr DESPUÉS de las migraciones de Prisma
--
-- CÓMO USAR:
-- psql -U postgres -d allclean_erp -f database/seed.sql

-- ============================================
-- USERS (Sistema de Login)
-- ============================================
-- Password para todos: admin123
-- Hash bcrypt: $2a$10$YourHashHere (debes generar uno real)

INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt") VALUES
('user_admin', 'admin@allclean.com', '$2a$10$Eq5Z3YqXqX4Z9gQZ9gQZ9.Z9gQZ9gQZ9gQZ9gQZ9gQZ9gQZ9gQZ9e', 'Admin User', 'ADMIN', NOW(), NOW()),
('user_manager', 'manager@allclean.com', '$2a$10$Eq5Z3YqXqX4Z9gQZ9gQZ9.Z9gQZ9gQZ9gQZ9gQZ9gQZ9gQZ9gQZ9e', 'Manager User', 'MANAGER', NOW(), NOW()),
('user_regular', 'user@allclean.com', '$2a$10$Eq5Z3YqXqX4Z9gQZ9gQZ9.Z9gQZ9gQZ9gQZ9gQZ9gQZ9gQZ9gQZ9e', 'Regular User', 'USER', NOW(), NOW());

-- ============================================
-- SETTINGS
-- ============================================

INSERT INTO settings (id, "companyName", "companyEmail", "companyPhone", "companyAddress", "defaultStartHour", "defaultEndHour", "bufferMinutes", "minAppointmentMinutes", "maxAppointmentMinutes", "updatedAt") VALUES
('singleton', 'AllClean Services', 'info@allclean.com', '+1 (555) 123-4567', '123 Business St, Austin, TX 78701', 6, 20, 30, 60, 480, NOW());

-- ============================================
-- CLIENTS
-- ============================================

INSERT INTO clients (id, name, email, phone, address, city, state, "zipCode", zone, notes, "createdAt", "updatedAt") VALUES
('client_001', 'Starbucks Downtown', 'manager@starbucks-dtx.com', '+1 (555) 234-5678', '123 Main St', 'Austin', 'TX', '78701', 'CENTRAL', 'Daily cleaning required, eco-friendly products only', NOW(), NOW()),
('client_002', 'Tech Office North', 'facilities@technorth.com', '+1 (555) 345-6789', '456 North Ave', 'Austin', 'TX', '78758', 'NORTH', 'Weekly deep cleaning, modern office space', NOW(), NOW()),
('client_003', 'Retail Store South', 'manager@retailsouth.com', '+1 (555) 456-7890', '789 South Blvd', 'Austin', 'TX', '78745', 'SOUTH', 'Bi-weekly service, after hours only', NOW(), NOW()),
('client_004', 'Corporate East', 'ops@corpeast.com', '+1 (555) 567-8901', '321 East St', 'Austin', 'TX', '78721', 'EAST', 'Large office complex, 5 floors', NOW(), NOW()),
('client_005', 'Restaurant West', 'owner@restwest.com', '+1 (555) 678-9012', '654 West Way', 'Austin', 'TX', '78733', 'WEST', 'Kitchen deep clean specialist needed', NOW(), NOW()),
('client_006', 'Medical Clinic Central', 'admin@medcentral.com', '+1 (555) 789-0123', '987 Center Dr', 'Austin', 'TX', '78701', 'CENTRAL', 'Medical-grade cleaning required', NOW(), NOW());

-- ============================================
-- CREWS
-- ============================================

INSERT INTO crews (id, name, color, "isActive", "createdAt", "updatedAt") VALUES
('crew_alpha', 'Alpha Team', '#3B82F6', true, NOW(), NOW()),
('crew_beta', 'Beta Team', '#10B981', true, NOW(), NOW()),
('crew_gamma', 'Gamma Team', '#F59E0B', true, NOW(), NOW());

-- ============================================
-- CREW MEMBERS (Con Experience Points)
-- ============================================

-- Alpha Team
INSERT INTO crew_members (id, "crewId", name, phone, email, "photoUrl", role, experience, "isActive", "createdAt", "updatedAt") VALUES
('member_001', 'crew_alpha', 'John Smith', '+1 (555) 111-1111', 'john@allclean.com', NULL, 'SUPERVISOR', 150, true, NOW(), NOW()),
('member_002', 'crew_alpha', 'Maria Garcia', '+1 (555) 222-2222', 'maria@allclean.com', NULL, 'TEAM_LEADER', 85, true, NOW(), NOW()),
('member_003', 'crew_alpha', 'David Lee', '+1 (555) 333-3333', 'david@allclean.com', NULL, 'MEMBER', 45, true, NOW(), NOW()),
('member_004', 'crew_alpha', 'Sarah Johnson', '+1 (555) 444-4444', 'sarah@allclean.com', NULL, 'MEMBER', 30, true, NOW(), NOW());

-- Beta Team
INSERT INTO crew_members (id, "crewId", name, phone, email, "photoUrl", role, experience, "isActive", "createdAt", "updatedAt") VALUES
('member_005', 'crew_beta', 'Michael Brown', '+1 (555) 555-5555', 'michael@allclean.com', NULL, 'SUPERVISOR', 120, true, NOW(), NOW()),
('member_006', 'crew_beta', 'Ana Rodriguez', '+1 (555) 666-6666', 'ana@allclean.com', NULL, 'TEAM_LEADER', 70, true, NOW(), NOW()),
('member_007', 'crew_beta', 'James Wilson', '+1 (555) 777-7777', 'james@allclean.com', NULL, 'MEMBER', 25, true, NOW(), NOW()),
('member_008', 'crew_beta', 'Emily Chen', '+1 (555) 888-8888', 'emily@allclean.com', NULL, 'MEMBER', 40, true, NOW(), NOW());

-- Gamma Team  
INSERT INTO crew_members (id, "crewId", name, phone, email, "photoUrl", role, experience, "isActive", "createdAt", "updatedAt") VALUES
('member_009', 'crew_gamma', 'Robert Taylor', '+1 (555) 999-9999', 'robert@allclean.com', NULL, 'SUPERVISOR', 95, true, NOW(), NOW()),
('member_010', 'crew_gamma', 'Lisa Martinez', '+1 (555) 000-0000', 'lisa@allclean.com', NULL, 'TEAM_LEADER', 55, true, NOW(), NOW()),
('member_011', 'crew_gamma', 'Tom Harris', '+1 (555) 121-2121', 'tom@allclean.com', NULL, 'MEMBER', 15, true, NOW(), NOW());

-- Unassigned Members (para el sistema de recomendaciones)
INSERT INTO crew_members (id, "crewId", name, phone, email, "photoUrl", role, experience, "isActive", "createdAt", "updatedAt") VALUES
('member_012', NULL, 'Jennifer Clark', '+1 (555) 232-3232', 'jennifer@allclean.com', NULL, 'MEMBER', 8, true, NOW(), NOW()),
('member_013', NULL, 'Carlos Diaz', '+1 (555) 343-4343', 'carlos@allclean.com', NULL, 'MEMBER', 5, true, NOW(), NOW());

-- ============================================
-- APPOINTMENTS (Smart Calendar con Locking)
-- ============================================

-- Today's appointments
INSERT INTO appointments (id, "clientId", "crewId", "scheduledDate", "startTime", "endTime", "durationMinutes", address, city, zone, status, "isLocked", tasks, "serviceType", "specialNotes", "estimatedCost", "createdAt", "updatedAt") VALUES
('appt_001', 'client_001', 'crew_alpha', CURRENT_DATE, '08:00', '10:00', 120, '123 Main St', 'Austin', 'CENTRAL', 'SCHEDULED', false, ARRAY['Floor mopping', 'Bathroom cleaning', 'Trash removal', 'Window cleaning'], 'Daily Maintenance', 'Use eco-friendly products', 150.00, NOW(), NOW()),
('appt_002', 'client_002', 'crew_beta', CURRENT_DATE, '09:00', '11:30', 150, '456 North Ave', 'Austin', 'NORTH', 'SCHEDULED', false, ARRAY['Office desks', 'Conference rooms', 'Kitchen area', 'Restrooms'], 'Office Cleaning', NULL, 200.00, NOW(), NOW()),
('appt_003', 'client_003', 'crew_gamma', CURRENT_DATE, '14:00', '16:00', 120, '789 South Blvd', 'Austin', 'SOUTH', 'SCHEDULED', false, ARRAY['Store floor', 'Windows', 'Restrooms', 'Display cases'], 'Retail Cleaning', 'After 6 PM only', 175.00, NOW(), NOW());

-- Tomorrow's appointments
INSERT INTO appointments (id, "clientId", "crewId", "scheduledDate", "startTime", "endTime", "durationMinutes", address, city, zone, status, "isLocked", tasks, "serviceType", "specialNotes", "estimatedCost", "createdAt", "updatedAt") VALUES
('appt_004', 'client_004', 'crew_alpha', CURRENT_DATE + INTERVAL '1 day', '08:00', '10:30', 150, '321 East St', 'Austin', 'EAST', 'SCHEDULED', false, ARRAY['Open office space', 'Break rooms', 'Bathrooms', 'Server room'], 'Corporate Cleaning', 'Be careful around tech equipment', 225.00, NOW(), NOW()),
('appt_005', 'client_005', 'crew_beta', CURRENT_DATE + INTERVAL '1 day', '10:00', '13:00', 180, '654 West Way', 'Austin', 'WEST', 'SCHEDULED', false, ARRAY['Kitchen deep clean', 'Dining area', 'Grease traps', 'Walk-in fridges'], 'Restaurant Deep Clean', 'Heavy duty required', 350.00, NOW(), NOW()),
('appt_006', 'client_006', 'crew_gamma', CURRENT_DATE + INTERVAL '1 day', '15:00', '17:00', 120, '987 Center Dr', 'Austin', 'CENTRAL', 'SCHEDULED', false, ARRAY['Exam rooms', 'Waiting area', 'Medical equipment', 'Floors'], 'Medical Facility', 'Medical-grade disinfectants required', 275.00, NOW(), NOW());

-- Day after tomorrow
INSERT INTO appointments (id, "clientId", "crewId", "scheduledDate", "startTime", "endTime", "durationMinutes", address, city, zone, status, "isLocked", tasks, "serviceType", "specialNotes", "estimatedCost", "createdAt", "updatedAt") VALUES
('appt_007', 'client_001', 'crew_alpha', CURRENT_DATE + INTERVAL '2 days', '08:00', '10:00', 120, '123 Main St', 'Austin', 'CENTRAL', 'SCHEDULED', false, ARRAY['Floor mopping', 'Bathroom cleaning', 'Trash removal'], 'Daily Maintenance', NULL, 150.00, NOW(), NOW()),
('appt_008', 'client_002', 'crew_beta', CURRENT_DATE + INTERVAL '2 days', '11:00', '13:30', 150, '456 North Ave', 'Austin', 'NORTH', 'SCHEDULED', false, ARRAY['Deep carpet clean', 'Window washing', 'Air vents'], 'Deep Cleaning', 'Quarterly service', 400.00, NOW(), NOW());

-- Success messages
SELECT 'Seed data inserted successfully!' as message;
SELECT 'Created:' as summary;
SELECT '  - 3 Users (admin, manager, user)' as users;
SELECT '  - 6 Clients across all zones' as clients;
SELECT '  - 3 Crews (Alpha, Beta, Gamma)' as crews;
SELECT '  - 13 Crew Members (with XP tracking)' as members;
SELECT '  - 8 Appointments (today + next 2 days)' as appointments;
SELECT '' as blank;
SELECT 'Login credentials:' as login_info;
SELECT '  Email: admin@allclean.com' as admin_email;
SELECT '  Password: admin123' as admin_password;
SELECT '' as blank2;
SELECT '⚠️  IMPORTANT: Change default password immediately!' as warning;
