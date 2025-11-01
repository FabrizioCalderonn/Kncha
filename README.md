# Cancha a la Vista

Sistema de reservas de canchas deportivas en El Salvador.

## Descripción

Cancha a la Vista es una aplicación móvil que conecta a jugadores con dueños de canchas deportivas, facilitando el proceso de reserva y pago.

## Tecnologías

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- Cloudinary (imágenes)
- Helmet + CORS (seguridad)

### Frontend
- React Native con Expo
- React Navigation
- Axios
- Expo Location + React Native Maps
- Expo Image Picker

## Características

- ✅ Sistema de autenticación (JWT)
- ✅ 3 roles: Cliente, Dueño, Administrador
- ✅ Exploración de canchas (lista y mapa)
- ✅ Sistema de reservas
- ✅ Gestión de canchas (owners)
- ✅ Panel administrativo
- ✅ Sistema de pago híbrido (transferencia/efectivo)
- ✅ Upload de imágenes (Cloudinary)
- ✅ Geolocalización

## Estructura del Proyecto

```
Kncha/
├── backend/           # API REST con Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── database/
│   │   └── server.js
│   └── package.json
├── frontend/          # App móvil con React Native
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── context/
│   │   └── config/
│   ├── App.js
│   └── package.json
└── README.md
```

## Instalación Rápida

Ver [QUICKSTART.md](QUICKSTART.md) para instrucciones detalladas.

### Backend

```bash
cd backend
npm install
# Configurar .env con tus credenciales
npm run setup    # Crear tablas
npm run seed     # Cargar datos de prueba
npm run dev      # Iniciar servidor
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Configuración

### Backend (.env)

```env
# Database (Supabase)
DB_HOST=db.xsnpxvtweofdahnhwiyi.supabase.co
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secreto_seguro

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Frontend (src/config/api.js)

```javascript
const API_URL = 'https://tu-app.railway.app/api/v1';
```

## Despliegue

### Backend (Railway)

1. Crear proyecto en Railway
2. Conectar con GitHub
3. Configurar variables de entorno
4. Deploy automático

### Frontend (EAS Build)

```bash
cd frontend
npx eas build --platform android
```

## Credenciales de Prueba

```
Admin: admin@canchalavista.com / password123
Owner: owner@canchalavista.com / password123
Client: cliente@example.com / password123
```

## Licencia

MIT

## Contacto

Para preguntas o soporte, contacta a: tu-email@example.com
