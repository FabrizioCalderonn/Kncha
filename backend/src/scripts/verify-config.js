#!/usr/bin/env node

/**
 * Script para verificar la configuración antes de desplegar
 * Verifica variables de entorno y conexión a base de datos
 *
 * Uso: node src/scripts/verify-config.js
 */

require('dotenv').config();
const pool = require('../config/database');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const checkmark = '✅';
const crossmark = '❌';
const warning = '⚠️';

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let errorCount = 0;
let warningCount = 0;

// 1. Verificar variables de entorno críticas
console.log('1️⃣  Variables de Entorno Críticas\n');

const criticalVars = [
  { name: 'DB_HOST', description: 'Host de la base de datos' },
  { name: 'DB_PORT', description: 'Puerto de la base de datos' },
  { name: 'DB_NAME', description: 'Nombre de la base de datos' },
  { name: 'DB_USER', description: 'Usuario de la base de datos' },
  { name: 'DB_PASSWORD', description: 'Contraseña de la base de datos' },
  { name: 'JWT_SECRET', description: 'Secret para JWT' },
];

criticalVars.forEach(({ name, description }) => {
  const value = process.env[name];
  if (value) {
    console.log(`   ${checkmark} ${name.padEnd(20)} - ${description}`);
  } else {
    console.log(`   ${crossmark} ${name.padEnd(20)} - ${colors.red}NO CONFIGURADA${colors.reset}`);
    errorCount++;
  }
});

console.log('\n2️⃣  Variables de Entorno Opcionales\n');

const optionalVars = [
  { name: 'NODE_ENV', description: 'Entorno (development/production)', default: 'development' },
  { name: 'PORT', description: 'Puerto del servidor', default: '5000' },
  { name: 'API_VERSION', description: 'Versión del API', default: 'v1' },
  { name: 'CORS_ORIGIN', description: 'Orígenes permitidos CORS', default: '*' },
  { name: 'CLOUDINARY_CLOUD_NAME', description: 'Cloudinary cloud name' },
  { name: 'CLOUDINARY_API_KEY', description: 'Cloudinary API key' },
  { name: 'CLOUDINARY_API_SECRET', description: 'Cloudinary API secret' },
];

optionalVars.forEach(({ name, description, default: defaultValue }) => {
  const value = process.env[name];
  if (value) {
    console.log(`   ${checkmark} ${name.padEnd(30)} - ${description}`);
  } else if (defaultValue) {
    console.log(`   ${warning} ${name.padEnd(30)} - ${colors.yellow}Usando default: ${defaultValue}${colors.reset}`);
    warningCount++;
  } else {
    console.log(`   ${warning} ${name.padEnd(30)} - ${colors.yellow}No configurada (opcional)${colors.reset}`);
    warningCount++;
  }
});

// 2. Verificar formato de variables
console.log('\n3️⃣  Validación de Formato\n');

// Verificar DB_HOST de Supabase
if (process.env.DB_HOST) {
  if (process.env.DB_HOST.includes('supabase.co')) {
    console.log(`   ${checkmark} DB_HOST es de Supabase`);

    // Verificar que no tenga https://
    if (process.env.DB_HOST.startsWith('http')) {
      console.log(`   ${crossmark} ${colors.red}DB_HOST no debe incluir https://${colors.reset}`);
      console.log(`      Actual: ${process.env.DB_HOST}`);
      console.log(`      Correcto: ${process.env.DB_HOST.replace(/https?:\/\//, '')}`);
      errorCount++;
    }

    // Verificar que no tenga puerto
    if (process.env.DB_HOST.includes(':')) {
      console.log(`   ${crossmark} ${colors.red}DB_HOST no debe incluir puerto${colors.reset}`);
      console.log(`      Usa la variable DB_PORT por separado`);
      errorCount++;
    }
  } else if (process.env.DB_HOST === 'localhost') {
    console.log(`   ${warning} ${colors.yellow}DB_HOST es localhost (modo desarrollo)${colors.reset}`);
    warningCount++;
  }
}

// Verificar DB_PORT
if (process.env.DB_PORT && process.env.DB_PORT !== '5432') {
  console.log(`   ${warning} ${colors.yellow}DB_PORT no es el puerto estándar de PostgreSQL (5432)${colors.reset}`);
  warningCount++;
}

// Verificar JWT_SECRET
if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length < 32) {
    console.log(`   ${crossmark} ${colors.red}JWT_SECRET es muy corto (mínimo 32 caracteres)${colors.reset}`);
    errorCount++;
  } else if (process.env.JWT_SECRET.includes('change_this') || process.env.JWT_SECRET.includes('your_')) {
    console.log(`   ${warning} ${colors.yellow}JWT_SECRET parece ser un placeholder - cámbialo en producción${colors.reset}`);
    warningCount++;
  } else {
    console.log(`   ${checkmark} JWT_SECRET tiene longitud adecuada (${process.env.JWT_SECRET.length} chars)`);
  }
}

// Verificar NODE_ENV
if (process.env.NODE_ENV === 'production') {
  console.log(`   ${checkmark} NODE_ENV está en modo producción`);

  // Verificaciones adicionales para producción
  if (process.env.DB_HOST === 'localhost') {
    console.log(`   ${crossmark} ${colors.red}En producción no debes usar localhost${colors.reset}`);
    errorCount++;
  }
} else {
  console.log(`   ${warning} ${colors.yellow}NODE_ENV está en modo desarrollo${colors.reset}`);
}

// 3. Verificar conexión a base de datos
console.log('\n4️⃣  Conexión a Base de Datos\n');

const testDatabaseConnection = async () => {
  try {
    console.log('   🔌 Intentando conectar a la base de datos...');

    const result = await pool.query('SELECT NOW(), version()');

    console.log(`   ${checkmark} ${colors.green}Conexión exitosa${colors.reset}`);
    console.log(`   ${checkmark} Servidor: ${result.rows[0].version.split(',')[0]}`);
    console.log(`   ${checkmark} Hora del servidor: ${result.rows[0].now}`);

    // Verificar tablas
    console.log('\n5️⃣  Verificación de Tablas\n');

    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log(`   ${crossmark} ${colors.red}No hay tablas en la base de datos${colors.reset}`);
      console.log(`   ${warning} Ejecuta: npm run setup`);
      errorCount++;
    } else {
      console.log(`   ${checkmark} ${tables.rows.length} tablas encontradas:`);
      tables.rows.forEach(row => {
        console.log(`      • ${row.table_name}`);
      });

      // Verificar tablas específicas
      const requiredTables = ['users', 'venues', 'fields', 'bookings'];
      const foundTables = tables.rows.map(r => r.table_name);

      const missingTables = requiredTables.filter(t => !foundTables.includes(t));
      if (missingTables.length > 0) {
        console.log(`\n   ${crossmark} ${colors.red}Faltan tablas requeridas: ${missingTables.join(', ')}${colors.reset}`);
        console.log(`   ${warning} Ejecuta: npm run setup`);
        errorCount++;
      }
    }

    // Verificar datos
    if (tables.rows.length > 0) {
      console.log('\n6️⃣  Verificación de Datos\n');

      try {
        const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
        const venueCount = await pool.query('SELECT COUNT(*) as count FROM venues');
        const fieldCount = await pool.query('SELECT COUNT(*) as count FROM fields');
        const bookingCount = await pool.query('SELECT COUNT(*) as count FROM bookings');

        console.log(`   ${userCount.rows[0].count > 0 ? checkmark : warning} Usuarios: ${userCount.rows[0].count}`);
        console.log(`   ${venueCount.rows[0].count > 0 ? checkmark : warning} Venues: ${venueCount.rows[0].count}`);
        console.log(`   ${fieldCount.rows[0].count > 0 ? checkmark : warning} Fields: ${fieldCount.rows[0].count}`);
        console.log(`   ${bookingCount.rows[0].count > 0 ? checkmark : warning} Bookings: ${bookingCount.rows[0].count}`);

        if (userCount.rows[0].count === 0) {
          console.log(`\n   ${warning} ${colors.yellow}No hay datos en la base de datos${colors.reset}`);
          console.log(`   ${warning} Ejecuta: npm run seed:complete`);
          warningCount++;
        }
      } catch (err) {
        console.log(`   ${warning} ${colors.yellow}No se pudieron verificar los datos${colors.reset}`);
      }
    }

  } catch (error) {
    console.log(`   ${crossmark} ${colors.red}Error al conectar a la base de datos${colors.reset}`);
    console.log(`\n   ${colors.red}Error:${colors.reset} ${error.message}`);

    if (error.code) {
      console.log(`   ${colors.red}Código:${colors.reset} ${error.code}`);
    }

    console.log('\n   💡 Soluciones posibles:');
    console.log('      1. Verifica que las credenciales sean correctas');
    console.log('      2. Verifica que el host sea accesible');
    console.log('      3. Verifica que el firewall/VPN no esté bloqueando la conexión');
    console.log('      4. Si usas Supabase, verifica que SSL esté habilitado');

    errorCount++;
  }
};

// Ejecutar verificación de DB
(async () => {
  await testDatabaseConnection();

  // Cerrar pool
  await pool.end();

  // Resumen final
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 RESUMEN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (errorCount === 0 && warningCount === 0) {
    console.log(`   ${checkmark} ${colors.green}TODO ESTÁ PERFECTO${colors.reset}`);
    console.log('   Tu aplicación está lista para desplegar\n');
    process.exit(0);
  } else {
    if (errorCount > 0) {
      console.log(`   ${crossmark} ${colors.red}${errorCount} error(es) crítico(s) encontrado(s)${colors.reset}`);
      console.log('   Debes resolver estos errores antes de desplegar\n');
    }

    if (warningCount > 0) {
      console.log(`   ${warning} ${colors.yellow}${warningCount} advertencia(s) encontrada(s)${colors.reset}`);
      console.log('   Puedes desplegar, pero revisa las advertencias\n');
    }

    process.exit(errorCount > 0 ? 1 : 0);
  }
})();
