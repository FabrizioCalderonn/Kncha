const { Pool } = require('pg');

// Configuración para Railway y Supabase
const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Si tenemos DATABASE_URL (Railway), usarla
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  poolConfig.ssl = { rejectUnauthorized: false };
} else {
  // Configuración manual para desarrollo/Supabase
  poolConfig.host = process.env.DB_HOST;
  poolConfig.port = process.env.DB_PORT || 5432;
  poolConfig.database = process.env.DB_NAME;
  poolConfig.user = process.env.DB_USER;
  poolConfig.password = process.env.DB_PASSWORD;

  // SSL solo para Supabase
  if (process.env.DB_HOST?.includes('supabase')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
