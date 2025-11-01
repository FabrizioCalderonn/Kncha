# Guía de Inicio Rápido

Esta guía te ayudará a poner en marcha el proyecto en menos de 10 minutos.

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Cuenta en Supabase (gratis)
- Cuenta en Cloudinary (gratis)

## Paso 1: Configurar el Backend

### 1.1 Instalar dependencias

```bash
cd backend
npm install
```

### 1.2 Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database (Supabase)
DB_HOST=db.xsnpxvtweofdahnhwiyi.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Kncha2023%

# JWT
JWT_SECRET=b45d7e26c631c47a125776696ee9f9687245cb38b8ca3a9102e91c3c3fc9a6862fc812e914bcf73be3a95c2c3dbcf77343ba1cfe00fc8f3ff2d4226230a7f130
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:19006,http://localhost:19000

# Cloudinary
CLOUDINARY_CLOUD_NAME=dhscqymsx
CLOUDINARY_API_KEY=875545465688675
CLOUDINARY_API_SECRET=BFRwBbWfiOyUzCmwDhXurfUp8Ec

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.3 Configurar la base de datos

```bash
# Crear tablas
npm run setup

# Cargar datos de prueba
npm run seed
```

### 1.4 Iniciar el servidor

```bash
npm run dev
```

El servidor estará en: `http://localhost:5000`

## Paso 2: Configurar el Frontend

### 2.1 Instalar dependencias

```bash
cd frontend
npm install
```

### 2.2 Iniciar Expo

```bash
npm start
```

### 2.3 Probar en tu dispositivo

1. Instala "Expo Go" en tu teléfono (Android/iOS)
2. Escanea el código QR que aparece en la terminal
3. La app se abrirá en Expo Go

## Paso 3: Probar la Aplicación

### Credenciales de prueba:

- **Cliente**: `cliente@example.com` / `password123`
- **Dueño**: `owner@canchalavista.com` / `password123`
- **Admin**: `admin@canchalavista.com` / `password123`

## Solución de Problemas

### El backend no se conecta a la base de datos

Verifica que:
- Las credenciales de Supabase sean correctas
- Tu IP esté permitida en Supabase
- El servidor de Supabase esté activo

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en `http://localhost:5000`
2. Revisa la configuración de `API_URL` en `frontend/src/config/api.js`
3. Si estás usando un teléfono físico, cambia `localhost` por tu IP local

### Expo no inicia

```bash
# Limpiar cache
expo start -c
```

## Siguientes Pasos

- Ver [SETUP_MOBILE.md](SETUP_MOBILE.md) para configurar el build de producción
- Configurar tus propias credenciales de Supabase y Cloudinary
- Personalizar los colores y temas en `frontend/src/context/ThemeContext.js`
