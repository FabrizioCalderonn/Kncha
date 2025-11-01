# Guía de Deployment en Railway

## Paso 1: Crear Proyecto en Railway

1. Ve a https://railway.app
2. Haz clic en **"Login"** (puedes usar GitHub)
3. Una vez dentro, haz clic en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Autoriza a Railway para acceder a tus repositorios
6. Busca y selecciona tu repositorio **"cancha-a-la-vista"** (o el nombre que le pusiste)
7. Railway detectará automáticamente que es un proyecto Node.js

## Paso 2: Configurar el Root Directory

Railway intentará deployar todo el proyecto, pero nosotros solo queremos deployar el backend:

1. En el dashboard de Railway, haz clic en tu servicio
2. Ve a la pestaña **"Settings"**
3. Busca la sección **"Root Directory"**
4. Cambia el valor a: `backend`
5. Guarda los cambios

## Paso 3: Configurar Variables de Entorno

En la pestaña **"Variables"** de Railway, agrega las siguientes variables:

```
NODE_ENV=production
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
JWT_REFRESH_EXPIRE=30d

# CORS (Railway te dará una URL, agrégala después)
CORS_ORIGIN=*

# Cloudinary
CLOUDINARY_CLOUD_NAME=dhscqymsx
CLOUDINARY_API_KEY=875545465688675
CLOUDINARY_API_SECRET=BFRwBbWfiOyUzCmwDhXurfUp8Ec

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Cómo agregar variables:

1. Haz clic en **"New Variable"**
2. Escribe el nombre (ejemplo: `DB_HOST`)
3. Escribe el valor (ejemplo: `db.xsnpxvtweofdahnhwiyi.supabase.co`)
4. Haz clic en **"Add"**
5. Repite para cada variable

## Paso 4: Deploy

1. Una vez configuradas las variables, Railway deployará automáticamente
2. Espera 2-3 minutos mientras se construye y deploya
3. Verás logs en tiempo real en la pestaña **"Deployments"**

## Paso 5: Obtener la URL de tu API

1. En la pestaña **"Settings"**
2. Busca la sección **"Domains"**
3. Haz clic en **"Generate Domain"**
4. Railway te dará una URL como: `https://cancha-a-la-vista-production.up.railway.app`
5. Copia esta URL

## Paso 6: Actualizar CORS

1. Regresa a **"Variables"**
2. Edita la variable `CORS_ORIGIN`
3. Cambia el valor de `*` a tu URL de Railway
4. Ejemplo: `https://cancha-a-la-vista-production.up.railway.app`

## Paso 7: Configurar Base de Datos

Desde tu computadora local, conecta a la base de datos en Railway para crear las tablas:

```bash
cd backend

# Configurar temporalmente las variables de entorno para apuntar a Supabase
# (ya están en tu .env local)

# Crear tablas
npm run setup

# Cargar datos de prueba
npm run seed
```

## Paso 8: Actualizar el Frontend

Edita `frontend/src/config/api.js`:

```javascript
const API_URL = __DEV__
  ? 'http://localhost:5000/api/v1'
  : 'https://TU-URL-DE-RAILWAY.up.railway.app/api/v1';
```

Reemplaza `TU-URL-DE-RAILWAY` con la URL que Railway te dio.

## Paso 9: Verificar el Deployment

Abre en tu navegador:
```
https://TU-URL-DE-RAILWAY.up.railway.app/
```

Deberías ver:
```json
{
  "success": true,
  "message": "Cancha a la Vista API",
  "version": "v1",
  "endpoints": {
    "auth": "/api/v1/auth",
    "venues": "/api/v1/venues",
    ...
  }
}
```

## Paso 10: Commit y Push

Sube los cambios del frontend a GitHub:

```bash
git add .
git commit -m "Update API URL for production"
git push
```

## Troubleshooting

### El deploy falla

**Revisa los logs en Railway:**
- Pestaña "Deployments" → Haz clic en el deployment
- Lee los errores en los logs

**Errores comunes:**
1. **"Cannot find module"** → Asegúrate que el Root Directory sea `backend`
2. **"Database connection failed"** → Verifica las variables de DB en Railway
3. **"Port already in use"** → Railway asigna el puerto automáticamente, usa `process.env.PORT`

### La base de datos no conecta

1. Verifica que Supabase permita conexiones desde Railway
2. Ve a Supabase → Settings → Database → Connection pooling
3. Asegúrate que esté habilitado

### CORS errors en el frontend

1. Verifica que `CORS_ORIGIN` en Railway incluya tu dominio de Railway
2. O usa `*` para permitir todos los orígenes (solo en desarrollo)

## Costos

Railway ofrece:
- **$5 USD de crédito gratis al mes**
- Suficiente para este proyecto en fase de prueba
- Después de los $5, pagas por uso

## Próximos Pasos

1. ✅ Backend deployado
2. Actualizar frontend con la URL de producción
3. Generar APK de producción con EAS Build
4. Probar la app con el backend en producción
