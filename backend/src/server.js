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

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cancha a la Vista API',
    version: API_VERSION,
    endpoints: {
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

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection verified');

    app.listen(PORT, () => {
      console.log('🚀 Server running in', process.env.NODE_ENV || 'development', 'mode');
      console.log(`🌐 Server listening on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;
