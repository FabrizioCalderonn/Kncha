-- Seed SQL para Supabase
-- Ejecuta esto en el SQL Editor de Supabase después de crear el schema

-- Limpiar datos existentes (opcional)
-- DELETE FROM bookings;
-- DELETE FROM fields;
-- DELETE FROM venues;
-- DELETE FROM users;

-- Usuarios (password: password123 hasheado con bcrypt)
INSERT INTO users (email, password, name, phone, role) VALUES
('admin@canchalavista.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'Admin Sistema', '2222-2222', 'admin'),
('juan.perez@example.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'Juan Pérez', '7777-8888', 'owner'),
('maria.lopez@example.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'María López', '7777-9999', 'owner'),
('carlos.garcia@example.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'Carlos García', '7777-0000', 'owner'),
('cliente1@example.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'Ana Martínez', '6666-7777', 'client'),
('cliente2@example.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'Roberto Flores', '6666-8888', 'client'),
('cliente3@example.com', '$2a$10$qQ0MPJhkXF1UNy1q7hG.r.s4JT6s0VqOSTnh6obNy2/7p7QqUP3tC', 'Laura Ramírez', '6666-9999', 'client')
ON CONFLICT (email) DO NOTHING;

-- Venues (usar IDs de los owners)
INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
SELECT
  (SELECT id FROM users WHERE email = 'juan.perez@example.com'),
  'Estadio Municipal San Salvador',
  'Complejo deportivo con canchas de fútbol profesionales. Césped sintético de última generación, iluminación LED y estacionamiento amplio.',
  'Boulevard del Hipódromo, San Salvador, El Salvador',
  13.6929, -89.2182,
  '2222-3333',
  ARRAY['https://images.unsplash.com/photo-1529900748604-07564a03e7a6']::TEXT[];

INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
SELECT
  (SELECT id FROM users WHERE email = 'maria.lopez@example.com'),
  'Polideportivo Santa Tecla',
  'Instalaciones completas para fútbol, básquetbol y voleibol. Canchas techadas y al aire libre.',
  'Santa Tecla, La Libertad, El Salvador',
  13.6776, -89.2897,
  '2222-4444',
  ARRAY['https://images.unsplash.com/photo-1608245449230-4ac19066d2d0']::TEXT[];

INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
SELECT
  (SELECT id FROM users WHERE email = 'carlos.garcia@example.com'),
  'Arena Basketball La Libertad',
  'Canchas profesionales de básquetbol con tableros de vidrio y superficie de madera.',
  'La Libertad, El Salvador',
  13.4888, -89.3222,
  '2222-5555',
  ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc']::TEXT[];

INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
SELECT
  (SELECT id FROM users WHERE email = 'juan.perez@example.com'),
  'Canchas El Pulgarcito',
  'Canchas comunitarias para fútbol 5 y 7. Ambiente familiar y precios accesibles.',
  'Soyapango, San Salvador, El Salvador',
  13.7104, -89.1388,
  '2222-6666',
  ARRAY[]::TEXT[];

-- Fields para cada venue
INSERT INTO fields (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
SELECT
  (SELECT id FROM venues WHERE name = 'Estadio Municipal San Salvador'),
  'Cancha Principal', 'Fútbol 11', 'Césped sintético premium', '100x64m', 22, 50.00, true, false
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Estadio Municipal San Salvador'),
  'Cancha Secundaria', 'Fútbol 7', 'Césped sintético', '60x40m', 14, 30.00, true, false
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Polideportivo Santa Tecla'),
  'Cancha Fútbol A', 'Fútbol 7', 'Césped sintético', '60x40m', 14, 25.00, true, false
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Polideportivo Santa Tecla'),
  'Cancha Básquetbol Techada', 'Básquetbol', 'Duela de madera', '28x15m', 10, 20.00, true, true
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Polideportivo Santa Tecla'),
  'Cancha Voleibol', 'Voleibol', 'Cemento pulido', '18x9m', 12, 15.00, true, true
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Arena Basketball La Libertad'),
  'Cancha Pro 1', 'Básquetbol', 'Duela profesional', '28x15m', 10, 35.00, true, true
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Arena Basketball La Libertad'),
  'Cancha Pro 2', 'Básquetbol', 'Duela profesional', '28x15m', 10, 35.00, true, true
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Canchas El Pulgarcito'),
  'Cancha Fútbol 5 A', 'Fútbol 5', 'Cemento', '40x20m', 10, 12.00, true, false
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Canchas El Pulgarcito'),
  'Cancha Fútbol 5 B', 'Fútbol 5', 'Cemento', '40x20m', 10, 12.00, true, false
UNION ALL SELECT
  (SELECT id FROM venues WHERE name = 'Canchas El Pulgarcito'),
  'Cancha Fútbol 7', 'Fútbol 7', 'Tierra', '60x40m', 14, 18.00, false, false;

-- Bookings de ejemplo
INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, status, notes)
SELECT
  (SELECT id FROM users WHERE email = 'cliente1@example.com'),
  (SELECT id FROM fields WHERE name = 'Cancha Principal' LIMIT 1),
  CURRENT_DATE + INTERVAL '1 day',
  '14:00'::TIME, '16:00'::TIME, 2, 100.00, 'credit_card', 'confirmed', 'Partido amistoso - Equipos locales'
UNION ALL SELECT
  (SELECT id FROM users WHERE email = 'cliente2@example.com'),
  (SELECT id FROM fields WHERE name = 'Cancha Fútbol A' LIMIT 1),
  CURRENT_DATE + INTERVAL '1 day',
  '16:00'::TIME, '18:00'::TIME, 2, 50.00, 'transfer', 'confirmed', 'Entrenamiento semanal'
UNION ALL SELECT
  (SELECT id FROM users WHERE email = 'cliente1@example.com'),
  (SELECT id FROM fields WHERE name = 'Cancha Básquetbol Techada' LIMIT 1),
  CURRENT_DATE + INTERVAL '7 days',
  '18:00'::TIME, '20:00'::TIME, 2, 40.00, 'pending', 'pending', 'Torneo mensual'
UNION ALL SELECT
  (SELECT id FROM users WHERE email = 'cliente2@example.com'),
  (SELECT id FROM fields WHERE name = 'Cancha Secundaria' LIMIT 1),
  CURRENT_DATE,
  '08:00'::TIME, '10:00'::TIME, 2, 60.00, 'cash', 'completed', 'Partido matutino'
UNION ALL SELECT
  (SELECT id FROM users WHERE email = 'cliente1@example.com'),
  (SELECT id FROM fields WHERE name = 'Cancha Voleibol' LIMIT 1),
  CURRENT_DATE + INTERVAL '7 days',
  '20:00'::TIME, '22:00'::TIME, 2, 30.00, 'cash', 'confirmed', 'Práctica de voleibol';

-- Verificar datos
SELECT 'Users:' as tabla, COUNT(*) as cantidad FROM users
UNION ALL
SELECT 'Venues:', COUNT(*) FROM venues
UNION ALL
SELECT 'Fields:', COUNT(*) FROM fields
UNION ALL
SELECT 'Bookings:', COUNT(*) FROM bookings;
