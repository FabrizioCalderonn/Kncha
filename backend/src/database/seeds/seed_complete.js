const pool = require('../../config/database');
const bcrypt = require('bcryptjs');

/**
 * Script completo de seed para poblar la base de datos con datos de prueba
 * Incluye: usuarios, venues, fields y bookings de ejemplo
 */

const seedComplete = async () => {
  try {
    console.log('🌱 Iniciando seed completo de la base de datos...\n');

    // Contraseña común para todos los usuarios de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ==========================================
    // 1. CREAR USUARIOS
    // ==========================================
    console.log('👥 Creando usuarios...');

    // Admin
    await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@canchalavista.com', hashedPassword, 'Admin Sistema', '2222-2222', 'admin']
    );

    // Owners (dueños de canchas)
    const owner1Result = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET id = users.id
       RETURNING id`,
      ['juan.perez@example.com', hashedPassword, 'Juan Pérez', '7777-8888', 'owner']
    );
    const owner1Id = owner1Result.rows[0]?.id;

    const owner2Result = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET id = users.id
       RETURNING id`,
      ['maria.lopez@example.com', hashedPassword, 'María López', '7777-9999', 'owner']
    );
    const owner2Id = owner2Result.rows[0]?.id;

    const owner3Result = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET id = users.id
       RETURNING id`,
      ['carlos.garcia@example.com', hashedPassword, 'Carlos García', '7777-0000', 'owner']
    );
    const owner3Id = owner3Result.rows[0]?.id;

    // Clients (usuarios que reservan)
    const client1Result = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET id = users.id
       RETURNING id`,
      ['cliente1@example.com', hashedPassword, 'Ana Martínez', '6666-7777', 'client']
    );
    const client1Id = client1Result.rows[0]?.id;

    const client2Result = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET id = users.id
       RETURNING id`,
      ['cliente2@example.com', hashedPassword, 'Roberto Flores', '6666-8888', 'client']
    );
    const client2Id = client2Result.rows[0]?.id;

    await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['cliente3@example.com', hashedPassword, 'Laura Ramírez', '6666-9999', 'client']
    );

    console.log('✅ 9 usuarios creados\n');

    // ==========================================
    // 2. CREAR VENUES (Complejos deportivos)
    // ==========================================
    console.log('🏟️  Creando venues...');

    // Venue 1: Complejo de fútbol
    const venue1Result = await pool.query(
      `INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        owner1Id,
        'Estadio Municipal San Salvador',
        'Complejo deportivo con canchas de fútbol profesionales. Césped sintético de última generación, iluminación LED y estacionamiento amplio.',
        'Boulevard del Hipódromo, San Salvador, El Salvador',
        13.6929,
        -89.2182,
        '2222-3333',
        [
          'https://images.unsplash.com/photo-1529900748604-07564a03e7a6',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018'
        ]
      ]
    );
    const venue1Id = venue1Result.rows[0].id;

    // Venue 2: Complejo multi-deporte
    const venue2Result = await pool.query(
      `INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        owner2Id,
        'Polideportivo Santa Tecla',
        'Instalaciones completas para fútbol, básquetbol y voleibol. Canchas techadas y al aire libre.',
        'Santa Tecla, La Libertad, El Salvador',
        13.6776,
        -89.2897,
        '2222-4444',
        [
          'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0',
          'https://images.unsplash.com/photo-1519766304817-4f37bce9b1d9'
        ]
      ]
    );
    const venue2Id = venue2Result.rows[0].id;

    // Venue 3: Centro de básquetbol
    const venue3Result = await pool.query(
      `INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        owner3Id,
        'Arena Basketball La Libertad',
        'Canchas profesionales de básquetbol con tableros de vidrio y superficie de madera.',
        'La Libertad, El Salvador',
        13.4888,
        -89.3222,
        '2222-5555',
        [
          'https://images.unsplash.com/photo-1546519638-68e109498ffc'
        ]
      ]
    );
    const venue3Id = venue3Result.rows[0].id;

    // Venue 4: Canchas de barrio
    const venue4Result = await pool.query(
      `INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        owner1Id,
        'Canchas El Pulgarcito',
        'Canchas comunitarias para fútbol 5 y 7. Ambiente familiar y precios accesibles.',
        'Soyapango, San Salvador, El Salvador',
        13.7104,
        -89.1388,
        '2222-6666',
        []
      ]
    );
    const venue4Id = venue4Result.rows[0].id;

    console.log('✅ 4 venues creados\n');

    // ==========================================
    // 3. CREAR FIELDS (Canchas individuales)
    // ==========================================
    console.log('⚽ Creando fields...');

    // Fields para Venue 1 (Estadio Municipal)
    const field1Result = await pool.query(
      `INSERT INTO fields (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
       VALUES
       ($1, 'Cancha Principal', 'Fútbol 11', 'Césped sintético premium', '100x64m', 22, 50.00, true, false),
       ($1, 'Cancha Secundaria', 'Fútbol 7', 'Césped sintético', '60x40m', 14, 30.00, true, false)
       RETURNING id`,
      [venue1Id]
    );
    const field1Id = field1Result.rows[0].id;
    const field2Id = field1Result.rows[1].id;

    // Fields para Venue 2 (Polideportivo)
    const field3Result = await pool.query(
      `INSERT INTO fields (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
       VALUES
       ($1, 'Cancha Fútbol A', 'Fútbol 7', 'Césped sintético', '60x40m', 14, 25.00, true, false),
       ($1, 'Cancha Básquetbol Techada', 'Básquetbol', 'Duela de madera', '28x15m', 10, 20.00, true, true),
       ($1, 'Cancha Voleibol', 'Voleibol', 'Cemento pulido', '18x9m', 12, 15.00, true, true)
       RETURNING id`,
      [venue2Id]
    );
    const field3Id = field3Result.rows[0].id;
    const field4Id = field3Result.rows[1].id;
    const field5Id = field3Result.rows[2].id;

    // Fields para Venue 3 (Arena Basketball)
    await pool.query(
      `INSERT INTO fields (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
       VALUES
       ($1, 'Cancha Pro 1', 'Básquetbol', 'Duela profesional', '28x15m', 10, 35.00, true, true),
       ($1, 'Cancha Pro 2', 'Básquetbol', 'Duela profesional', '28x15m', 10, 35.00, true, true)`,
      [venue3Id]
    );

    // Fields para Venue 4 (Canchas El Pulgarcito)
    await pool.query(
      `INSERT INTO fields (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
       VALUES
       ($1, 'Cancha Fútbol 5 A', 'Fútbol 5', 'Cemento', '40x20m', 10, 12.00, true, false),
       ($1, 'Cancha Fútbol 5 B', 'Fútbol 5', 'Cemento', '40x20m', 10, 12.00, true, false),
       ($1, 'Cancha Fútbol 7', 'Fútbol 7', 'Tierra', '60x40m', 14, 18.00, false, false)`,
      [venue4Id]
    );

    console.log('✅ 10 fields creados\n');

    // ==========================================
    // 4. CREAR BOOKINGS (Reservas de ejemplo)
    // ==========================================
    console.log('📅 Creando bookings de ejemplo...');

    // Obtener fecha de hoy y mañana
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    // Reservas confirmadas
    if (client1Id && field1Id) {
      await pool.query(
        `INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          client1Id,
          field1Id,
          formatDate(tomorrow),
          '14:00',
          '16:00',
          2,
          100.00,
          'credit_card',
          'confirmed',
          'Partido amistoso - Equipos locales'
        ]
      );
    }

    if (client2Id && field3Id) {
      await pool.query(
        `INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          client2Id,
          field3Id,
          formatDate(tomorrow),
          '16:00',
          '18:00',
          2,
          50.00,
          'transfer',
          'confirmed',
          'Entrenamiento semanal'
        ]
      );
    }

    // Reserva pendiente
    if (client1Id && field4Id) {
      await pool.query(
        `INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          client1Id,
          field4Id,
          formatDate(nextWeek),
          '18:00',
          '20:00',
          2,
          40.00,
          'pending',
          'pending',
          'Torneo mensual'
        ]
      );
    }

    // Reserva para hoy (completed)
    if (client2Id && field2Id) {
      await pool.query(
        `INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          client2Id,
          field2Id,
          formatDate(today),
          '08:00',
          '10:00',
          2,
          60.00,
          'cash',
          'completed',
          'Partido matutino'
        ]
      );
    }

    // Reservas futuras
    if (client1Id && field5Id) {
      await pool.query(
        `INSERT INTO bookings (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          client1Id,
          field5Id,
          formatDate(nextWeek),
          '20:00',
          '22:00',
          2,
          30.00,
          'cash',
          'confirmed',
          'Práctica de voleibol'
        ]
      );
    }

    console.log('✅ 5 bookings creados\n');

    // ==========================================
    // RESUMEN
    // ==========================================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡Seed completado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 DATOS CREADOS:');
    console.log('   • 9 Usuarios (1 admin, 3 owners, 5 clients)');
    console.log('   • 4 Venues (complejos deportivos)');
    console.log('   • 10 Fields (canchas individuales)');
    console.log('   • 5 Bookings (reservas de ejemplo)\n');

    console.log('🔑 CREDENCIALES DE PRUEBA:');
    console.log('   ┌─────────────────────────────────────────────┐');
    console.log('   │ ADMIN                                       │');
    console.log('   │ Email: admin@canchalavista.com              │');
    console.log('   │ Pass:  password123                          │');
    console.log('   ├─────────────────────────────────────────────┤');
    console.log('   │ OWNERS (Dueños de canchas)                  │');
    console.log('   │ • juan.perez@example.com / password123      │');
    console.log('   │ • maria.lopez@example.com / password123     │');
    console.log('   │ • carlos.garcia@example.com / password123   │');
    console.log('   ├─────────────────────────────────────────────┤');
    console.log('   │ CLIENTS (Usuarios)                          │');
    console.log('   │ • cliente1@example.com / password123        │');
    console.log('   │ • cliente2@example.com / password123        │');
    console.log('   │ • cliente3@example.com / password123        │');
    console.log('   └─────────────────────────────────────────────┘\n');

    console.log('💡 PRÓXIMOS PASOS:');
    console.log('   1. Inicia el servidor: npm run dev');
    console.log('   2. Prueba el login con cualquier credencial');
    console.log('   3. Explora los venues y realiza reservas\n');

    process.exit(0);
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR en el seed:', error.message);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(error);
    process.exit(1);
  }
};

// Ejecutar seed
seedComplete();
