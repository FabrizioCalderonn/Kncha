const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const setupDatabase = async () => {
  try {
    console.log('Setting up Supabase database...\n');

    // Test connection
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log(`   Server time: ${result.rows[0].now}\n`);

    // Read and execute schema
    console.log('Creating database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('✅ Database schema created successfully\n');

    // Verify tables
    console.log('Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('✅ Tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run seed (to add sample data)');
    console.log('2. Run: npm run dev (to start the server)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
