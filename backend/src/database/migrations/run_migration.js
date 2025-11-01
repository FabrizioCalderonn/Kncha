const pool = require('../../config/database');
const fs = require('fs');
const path = require('path');

const runMigration = async () => {
  try {
    console.log('Running migration: add_payment_method.sql...');

    const migrationPath = path.join(__dirname, 'add_payment_method.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await pool.query(sql);

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration();
