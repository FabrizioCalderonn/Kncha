# 🚀 Guía de Deployment: Railway + Supabase

Esta guía te ayudará a deployar tu backend en Railway y configurar tu base de datos en Supabase de forma segura.

---

## 📋 Prerrequisitos

- [ ] Cuenta en [Railway](https://railway.app/)
- [ ] Cuenta en [Supabase](https://supabase.com/)
- [ ] Cuenta en [Cloudinary](https://cloudinary.com/) (para imágenes)
- [ ] Git instalado
- [ ] Repositorio del proyecto en GitHub

---

## 🗄️ PARTE 1: Configurar Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com/ y crea una cuenta
2. Click en "New Project"
3. Completa la información:
   - **Name**: cancha-a-la-vista
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: US West (o el más cercano a El Salvador)
4. Espera 2-3 minutos a que se cree el proyecto

### Paso 2: Obtener Credenciales de Conexión

1. En tu proyecto de Supabase, ve a **Settings** → **Database**
2. En la sección "Connection Info", encontrarás:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [tu contraseña de arriba]
   ```
3. **IMPORTANTE**: Guarda estos datos en un lugar seguro (NO en GitHub)

### Paso 3: Configurar Database Localmente (Opcional)

Si quieres probar la conexión a Supabase localmente primero:

1. Copia tu archivo `.env.example` a `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edita el archivo `.env` y actualiza estas líneas:
   ```bash
   # Comenta la configuración local
   # DB_HOST=localhost
   # DB_NAME=cancha_a_la_vista

   # Descomenta y actualiza con tus credenciales de Supabase
   DB_HOST=db.xxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=TU_PASSWORD_DE_SUPABASE_AQUI
   ```

3. Crea el schema en Supabase:
   ```bash
   npm run setup
   ```

4. Popula la base de datos con datos de prueba:
   ```bash
   npm run seed:complete
   ```

5. Verifica que todo funciona:
   ```bash
   npm run dev
   ```

---

## 🚂 PARTE 2: Configurar Railway

### Paso 1: Crear Proyecto en Railway

1. Ve a https://railway.app/ y crea una cuenta (puedes usar GitHub)
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza a Railway para acceder a tu repositorio
5. Selecciona tu repositorio `Kncha`

### Paso 2: Configurar Variables de Entorno

⚠️ **MUY IMPORTANTE**: Las variables de entorno se configuran en Railway, NO en GitHub.

1. En tu proyecto de Railway, ve a la pestaña **Variables**
2. Agrega las siguientes variables una por una:

#### Variables Básicas
```
NODE_ENV=production
PORT=5000
API_VERSION=v1
```

#### Database (Supabase)
```
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_SUPABASE
```

#### JWT (genera uno nuevo)
Para generar un JWT_SECRET seguro, ejecuta esto localmente:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Luego agrega:
```
JWT_SECRET=el_hash_generado_arriba
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
```

#### CORS
⚠️ **Importante**: Después del primer deploy, Railway te dará una URL. Actualiza esto:
```
CORS_ORIGIN=https://tu-app.up.railway.app,exp://tu-ip:8081
```

Por ahora, deja:
```
CORS_ORIGIN=*
```

#### Cloudinary
Obtén tus credenciales en https://cloudinary.com/console
```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

#### Wompi (Opcional - para pagos)
```
WOMPI_APP_ID=tu_app_id
WOMPI_API_SECRET=tu_api_secret
WOMPI_PUBLIC_KEY=pub_test_xxxxx
WOMPI_PRIVATE_KEY=prv_test_xxxxx
WOMPI_EVENTS_SECRET=tu_events_secret
WOMPI_ENVIRONMENT=test
```

#### Rate Limiting
```
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Paso 3: Configurar Build

1. En Railway, ve a **Settings**
2. En "Build Command", deja vacío (o usa `cd backend && npm install`)
3. En "Start Command", pon:
   ```
   cd backend && npm start
   ```
4. En "Root Directory", pon:
   ```
   backend
   ```

### Paso 4: Deploy

1. Railway automáticamente hará deploy cuando hagas push a `main`
2. O manualmente: Click en **Deploy** → **Deploy Now**
3. Espera 2-5 minutos
4. Cuando termine, Railway te dará una URL: `https://tu-app.up.railway.app`

### Paso 5: Poblar la Base de Datos en Producción

⚠️ **Solo hazlo una vez**, después del primer deploy exitoso.

Opción 1: Usando Railway CLI
```bash
# Instala Railway CLI
npm i -g @railway/cli

# Loguéate
railway login

# Vincula tu proyecto
railway link

# Ejecuta el seed
railway run npm run seed:complete
```

Opción 2: Desde tu máquina local
```bash
# Asegúrate de que tu .env tenga las credenciales de Supabase
cd backend
npm run seed:complete
```

---

## ✅ PARTE 3: Verificar que Todo Funciona

### Probar el API

1. Abre tu navegador o Postman
2. Ve a: `https://tu-app.up.railway.app/`
3. Deberías ver:
   ```json
   {
     "status": "ok",
     "message": "Cancha a la Vista API v1",
     "endpoints": { ... }
   }
   ```

### Probar Login

Endpoint: `POST https://tu-app.up.railway.app/api/v1/auth/login`

Body (JSON):
```json
{
  "email": "admin@canchalavista.com",
  "password": "password123"
}
```

Deberías recibir:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Usuarios de Prueba

Después del seed, tendrás estos usuarios:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@canchalavista.com | password123 |
| Owner | juan.perez@example.com | password123 |
| Owner | maria.lopez@example.com | password123 |
| Owner | carlos.garcia@example.com | password123 |
| Client | cliente1@example.com | password123 |
| Client | cliente2@example.com | password123 |
| Client | cliente3@example.com | password123 |

---

## 📱 PARTE 4: Conectar el Frontend

### Actualizar la URL del API

1. Abre `frontend/src/config/api.js`
2. Actualiza la URL de producción con tu URL de Railway:
   ```javascript
   const API_URL = __DEV__
     ? 'http://localhost:5000/api/v1'
     : 'https://TU-APP.up.railway.app/api/v1';
   ```

### Actualizar CORS en Railway

1. Ve a Railway → Variables
2. Actualiza `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://tu-app.up.railway.app,exp://192.168.1.100:8081
   ```
   (Reemplaza la IP con la tuya)

3. Railway redesplegará automáticamente

---

## 🔒 SEGURIDAD - MUY IMPORTANTE

### ✅ LO QUE DEBES HACER:

1. **NUNCA** subas archivos `.env` a GitHub
2. **VERIFICA** que `.gitignore` incluye:
   ```
   .env
   .env.*
   **/.env
   **/.env.*
   ```
3. **USA** variables de entorno de Railway para producción
4. **GENERA** un nuevo JWT_SECRET para producción (no uses el del ejemplo)
5. **CAMBIA** las contraseñas de los usuarios de prueba en producción
6. **RESTRINGE** CORS solo a tus dominios (no uses `*` en producción)

### ❌ LO QUE NO DEBES HACER:

1. NO hardcodees credenciales en el código
2. NO compartas tu archivo `.env` por email/chat
3. NO uses las mismas credenciales para dev y producción
4. NO dejes los usuarios de prueba con `password123` en producción

---

## 🛠️ Comandos Útiles

### Backend (Local)
```bash
npm run dev              # Servidor de desarrollo
npm run start            # Servidor de producción
npm run setup            # Crear schema en la DB
npm run seed             # Seed básico
npm run seed:complete    # Seed completo
npm run db:reset         # Resetear DB (schema + seed)
npm run migrate          # Ejecutar migraciones
```

### Railway CLI
```bash
railway login            # Login a Railway
railway link             # Vincular proyecto
railway run <command>    # Ejecutar comando en Railway
railway logs             # Ver logs
railway status           # Ver estado del proyecto
railway variables        # Ver variables de entorno
```

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Verifica que las credenciales de Supabase sean correctas
- Verifica que el host incluya `.supabase.co`
- Asegúrate de que el password no tenga caracteres especiales sin escapar

### Error: "CORS policy"
- Actualiza `CORS_ORIGIN` en Railway con tu dominio
- Verifica que el frontend esté usando la URL correcta

### Error: "Cannot find module"
- Verifica que el `Root Directory` en Railway sea `backend`
- Verifica que el `Start Command` sea `cd backend && npm start`

### No aparecen datos en la app
- Verifica que hayas ejecutado el seed: `npm run seed:complete`
- Verifica la conexión a la DB desde Railway logs

### Railway no despliega automáticamente
- Ve a Settings → Triggers
- Verifica que "Deploy on Git Push" esté habilitado

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Express.js Docs](https://expressjs.com/)

---

## 🎉 ¡Listo!

Ahora tu backend debería estar corriendo en Railway, conectado a Supabase, y listo para que tu app móvil lo use.

Si tienes problemas, revisa los logs en Railway: **Deployments** → Click en el deployment → **View Logs**
