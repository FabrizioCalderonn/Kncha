// Script temporal para ejecutar seed desde Railway
require('dotenv').config();

const runSeed = async () => {
  console.log('Ejecutando setup y seed...\n');

  // Ejecutar setup
  console.log('1. Creando schema...');
  await require('./src/database/setup_supabase');

  // Esperar un poco
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Ejecutar seed
  console.log('\n2. Poblando datos...');
  await require('./src/database/seeds/seed_complete');
};

runSeed();
