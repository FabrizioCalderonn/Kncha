const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * Script de configuración de base de datos
 * Crea el schema completo en Supabase o PostgreSQL local
 */

const setupDatabase = async () => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 CONFIGURACIÓN DE BASE DE DATOS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. Test connection
    console.log('📡 Probando conexión a la base de datos...');
    const result = await pool.query('SELECT NOW(), version()');
    console.log('✅ Conexión exitosa');
    console.log(`   Servidor: ${result.rows[0].version.split(',')[0]}`);
    console.log(`   Hora del servidor: ${result.rows[0].now}\n`);

    // 2. Check database info
    console.log('📊 Información de la base de datos:');
    const dbInfo = await pool.query(`
      SELECT current_database() as database,
             current_user as user,
             inet_server_addr() as host
    `);
    console.log(`   Base de datos: ${dbInfo.rows[0].database}`);
    console.log(`   Usuario: ${dbInfo.rows[0].user}`);
    console.log(`   Host: ${dbInfo.rows[0].host || 'localhost'}\n`);

    // 3. Read and execute schema
    console.log('📝 Creando schema de base de datos...');
    const schemaPath = path.join(__dirname, 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Schema creado exitosamente\n');

    // 4. Verify tables
    console.log('🔍 Verificando tablas creadas...');
    const tablesResult = await pool.query(`
      SELECT
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      throw new Error('No se crearon tablas. Verifica el schema.sql');
    }

    console.log(`✅ ${tablesResult.rows.length} tablas creadas:\n`);
    tablesResult.rows.forEach(row => {
      console.log(`   📋 ${row.table_name.padEnd(20)} (${row.column_count} columnas)`);
    });

    // 5. Verify indexes
    console.log('\n🔍 Verificando índices...');
    const indexesResult = await pool.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname NOT LIKE '%pkey'
      ORDER BY indexname
    `);

    if (indexesResult.rows.length > 0) {
      console.log(`✅ ${indexesResult.rows.length} índices creados\n`);
    }

    // 6. Verify triggers
    console.log('🔍 Verificando triggers...');
    const triggersResult = await pool.query(`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `);

    if (triggersResult.rows.length > 0) {
      console.log(`✅ ${triggersResult.rows.length} triggers creados\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📋 PRÓXIMOS PASOS:\n');
    console.log('   1️⃣  Poblar la base de datos:');
    console.log('       npm run seed              (datos básicos)');
    console.log('       npm run seed:complete     (datos completos para pruebas)\n');
    console.log('   2️⃣  Iniciar el servidor:');
    console.log('       npm run dev               (desarrollo)');
    console.log('       npm start                 (producción)\n');
    console.log('   3️⃣  Resetear todo (schema + seed):');
    console.log('       npm run db:reset\n');

    process.exit(0);
  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR EN LA CONFIGURACIÓN');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`\n${error.message}\n`);

    if (error.code) {
      console.error(`Código de error: ${error.code}`);
    }

    console.error('\n💡 SOLUCIONES POSIBLES:');
    console.error('   1. Verifica tu archivo .env');
    console.error('   2. Confirma que las credenciales sean correctas');
    console.error('   3. Verifica que la base de datos esté accesible');
    console.error('   4. Si usas Supabase, verifica que SSL esté habilitado\n');

    console.error('Stack trace completo:');
    console.error(error);

    process.exit(1);
  }
};

setupDatabase();
