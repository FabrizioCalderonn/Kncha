const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const pool = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const venueRoutes = require('./routes/venueRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde'
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'checking...'
  };

  try {
    await pool.query('SELECT 1');
    healthCheck.database = 'connected';
  } catch (error) {
    healthCheck.database = 'disconnected';
    healthCheck.dbError = error.message;
  }

  const httpCode = healthCheck.database === 'connected' ? 200 : 503;
  res.status(httpCode).json(healthCheck);
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cancha a la Vista API',
    version: API_VERSION,
    endpoints: {
      health: '/health',
      auth: `/api/${API_VERSION}/auth`,
      venues: `/api/${API_VERSION}/venues`,
      fields: `/api/${API_VERSION}/fields`,
      bookings: `/api/${API_VERSION}/bookings`,
      admin: `/api/${API_VERSION}/admin`
    }
  });
});

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/venues`, venueRoutes);
app.use(`/api/${API_VERSION}/fields`, fieldRoutes);
app.use(`/api/${API_VERSION}/bookings`, bookingRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Railway necesita 0.0.0.0

const startServer = async () => {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connection verified');
    console.log(`   Server time: ${dbTest.rows[0].now}`);
  } catch (error) {
    console.error('⚠️  Database connection failed:', error.message);
    console.error('   The server will start anyway, but database operations will fail');
    console.error('   Please check your database configuration');
  }

  // Start server even if DB fails (Railway needs the server running)
  app.listen(PORT, HOST, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 SERVER STARTED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Host: ${HOST}`);
    console.log(`   Port: ${PORT}`);
    console.log(`   API Version: ${API_VERSION}`);
    console.log(`   Time: ${new Date().toISOString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Log environment variables (sin valores sensibles)
    console.log('\n📋 Configuration Check:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    console.log(`   DB_HOST: ${process.env.DB_HOST ? '✅ set' : '❌ not set'}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME ? '✅ set' : '❌ not set'}`);
    console.log(`   DB_USER: ${process.env.DB_USER ? '✅ set' : '❌ not set'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '✅ set' : '❌ not set'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ set' : '❌ not set'}`);
    console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN || '❌ not set (using *)'}`);
    console.log('');
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Promise Rejection:', err);
  console.error('   Stack:', err.stack);
  // No exit en producción - dejar que la app continúe
});

// Prevenir que el proceso termine
process.on('SIGTERM', () => {
  console.log('⚠️  Received SIGTERM - Railway is trying to kill the server');
  console.log('   Ignoring SIGTERM to keep server alive');
  // No hacer nada - mantener el servidor corriendo
});

process.on('SIGINT', () => {
  console.log('⚠️  Received SIGINT');
  console.log('   Ignoring SIGINT to keep server alive');
  // No hacer nada - mantener el servidor corriendo
});

// Mantener el proceso vivo
setInterval(() => {
  // Este interval evita que Node.js termine si no hay nada más que hacer
}, 60000); // Cada minuto

module.exports = app;
