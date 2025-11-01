const pool = require('../../config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    console.log('Starting database seeding...');

    // Crear usuarios de ejemplo
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Admin
    await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@canchalavista.com', hashedPassword, 'Admin', '22334455', 'admin']
    );

    // Owner
    const ownerResult = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET id = users.id
       RETURNING id`,
      ['owner@canchalavista.com', hashedPassword, 'Juan Pérez', '77889900', 'owner']
    );
    const ownerId = ownerResult.rows[0]?.id;

    // Client
    await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ['cliente@example.com', hashedPassword, 'María González', '66778899', 'client']
    );

    console.log('✅ Users seeded');

    // Crear venues de ejemplo
    if (ownerId) {
      const venueResult = await pool.query(
        `INSERT INTO venues (owner_id, name, description, address, latitude, longitude, phone, images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          ownerId,
          'Estadio Municipal',
          'Complejo deportivo con canchas de fútbol y básquetbol',
          'San Salvador, Centro Histórico',
          13.6929, -89.2182,
          '22334455',
          ['https://res.cloudinary.com/demo/image/upload/sample.jpg']
        ]
      );
      const venueId = venueResult.rows[0].id;

      console.log('✅ Venues seeded');

      // Crear fields de ejemplo
      await pool.query(
        `INSERT INTO fields (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
         VALUES
         ($1, 'Cancha de Fútbol 1', 'Fútbol', 'Césped sintético', '50x30m', 22, 25.00, true, false),
         ($1, 'Cancha de Básquetbol', 'Básquetbol', 'Cemento', '28x15m', 10, 15.00, true, true)`,
        [venueId]
      );

      console.log('✅ Fields seeded');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@canchalavista.com / password123');
    console.log('Owner: owner@canchalavista.com / password123');
    console.log('Client: cliente@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
