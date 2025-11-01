# Cancha a la Vista - Backend

Backend API para el sistema de reservas de canchas deportivas.

## Tecnologías

- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- Cloudinary (imágenes)
- Helmet + CORS (seguridad)

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` basado en `.env.example` con tus credenciales.

## Comandos

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run migrate  # Ejecutar migraciones
npm run seed     # Cargar datos de prueba
npm run setup    # Verificar conexión Supabase
```

## Endpoints

- `/api/v1/auth` - Autenticación
- `/api/v1/venues` - Canchas
- `/api/v1/fields` - Campos deportivos
- `/api/v1/bookings` - Reservas
- `/api/v1/admin` - Administración
- `/api/v1/payments` - Pagos
- `/api/v1/upload` - Subida de imágenes
