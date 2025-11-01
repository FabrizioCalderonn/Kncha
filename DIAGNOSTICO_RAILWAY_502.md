# 🔧 Diagnóstico de Error 502 en Railway

Un error 502 (Bad Gateway) significa que Railway no puede comunicarse con tu aplicación. Sigue esta guía paso a paso para resolverlo.

---

## ✅ Cambios Realizados

He actualizado el código para resolver los problemas comunes:

1. **✅ Servidor escucha en 0.0.0.0** - Railway requiere esto
2. **✅ El servidor no crashea si la DB falla** - Ahora inicia de todos modos
3. **✅ Logging mejorado** - Para diagnosticar problemas
4. **✅ Endpoint de health check** - `/health` para verificar estado

---

## 🚀 PASO 1: Commitear y Push de los Cambios

Primero necesitas subir los cambios que acabo de hacer:

```bash
# Desde la raíz del proyecto
git add .
git commit -m "Fix: Configurar servidor para Railway (escuchar en 0.0.0.0 y mejor logging)"
git push origin main
```

Railway detectará el push y redesplegará automáticamente.

---

## 🔍 PASO 2: Verificar los Logs en Railway

Los logs te dirán exactamente qué está fallando.

### Cómo ver los logs:

1. Ve a tu proyecto en https://railway.app/
2. Click en tu servicio (backend)
3. Click en la pestaña **"Deployments"**
4. Click en el deployment más reciente
5. Click en **"View Logs"**

### ¿Qué buscar en los logs?

#### ✅ LOGS BUENOS (funcionando):
```
🔌 Testing database connection...
✅ Database connection verified
   Server time: 2024-01-15T10:30:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SERVER STARTED SUCCESSFULLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Environment: production
   Host: 0.0.0.0
   Port: 8080
   API Version: v1
```

#### ❌ LOGS MALOS (problemas):

**Problema 1: Base de datos no conecta**
```
⚠️  Database connection failed: Connection timeout
   The server will start anyway, but database operations will fail
```
**Solución**: Verificar variables de entorno de Supabase (ver PASO 3)

**Problema 2: Variables no configuradas**
```
❌ not set
DB_HOST: ❌ not set
DB_PASSWORD: ❌ not set
```
**Solución**: Configurar variables de entorno (ver PASO 3)

**Problema 3: Error de módulos**
```
Error: Cannot find module 'express'
```
**Solución**: Problema con el build, verificar que `buildCommand` esté correcto

**Problema 4: Puerto incorrecto**
```
Error: listen EADDRINUSE :::5000
```
**Solución**: Railway asigna el puerto automáticamente, no hardcodees el puerto

---

## ⚙️ PASO 3: Verificar Variables de Entorno en Railway

### Variables OBLIGATORIAS para que funcione:

1. Ve a tu proyecto en Railway
2. Click en tu servicio
3. Ve a la pestaña **"Variables"**
4. **Asegúrate de tener TODAS estas variables configuradas:**

#### Variables Críticas (SIN ESTAS NO FUNCIONA):

```bash
# Database (Supabase) - CRÍTICO
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_de_supabase

# JWT - CRÍTICO
JWT_SECRET=un_string_largo_y_secreto_aqui
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Environment
NODE_ENV=production
API_VERSION=v1
```

#### Variables Opcionales (pero recomendadas):

```bash
# CORS
CORS_ORIGIN=https://tu-app.up.railway.app

# Cloudinary (para subir imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### ⚠️ IMPORTANTE: NO configures la variable PORT

Railway asigna automáticamente el puerto. NO agregues `PORT` en las variables.

---

## 🔌 PASO 4: Verificar Conexión a Supabase

### Obtener las credenciales correctas de Supabase:

1. Ve a https://supabase.com/
2. Selecciona tu proyecto
3. Ve a **Settings** → **Database**
4. En "Connection Info" verás:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [la que configuraste al crear el proyecto]
   ```

### Verificar que el formato sea EXACTO:

❌ **INCORRECTO:**
```bash
DB_HOST=https://db.xxxxx.supabase.co  # NO incluir https://
DB_HOST=db.xxxxx.supabase.co:5432     # NO incluir puerto en el host
DB_PORT=6543                           # Puerto incorrecto
```

✅ **CORRECTO:**
```bash
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_exacto
```

### Probar la conexión localmente (opcional):

Antes de redeplegar, puedes probar localmente con las credenciales de Supabase:

```bash
cd backend

# Edita tu .env local con las credenciales de Supabase
# DB_HOST=db.xxxxx.supabase.co
# DB_PASSWORD=...

npm run setup    # Crear schema
npm run dev      # Iniciar servidor
```

Si funciona localmente, funcionará en Railway.

---

## 🏗️ PASO 5: Verificar Configuración de Build en Railway

1. Ve a tu proyecto en Railway
2. Click en tu servicio
3. Ve a **Settings** → **Build**

### Configuración correcta:

| Setting | Valor |
|---------|-------|
| **Root Directory** | `backend` ó déjalo vacío |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Watch Paths** | (dejar vacío) |

### ⚠️ Si usaste Root Directory = "backend":

Entonces los comandos serían:

| Setting | Valor |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

---

## 🧪 PASO 6: Probar el Deployment

Después de que Railway termine de desplegar (2-5 minutos):

### 1. Probar el endpoint raíz:

Abre en tu navegador:
```
https://tu-app.up.railway.app/
```

Deberías ver:
```json
{
  "success": true,
  "message": "Cancha a la Vista API",
  "version": "v1",
  "endpoints": {
    "health": "/health",
    "auth": "/api/v1/auth",
    ...
  }
}
```

### 2. Probar el health check:

```
https://tu-app.up.railway.app/health
```

**Si todo está bien** (código 200):
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected"
}
```

**Si la DB no conecta** (código 503):
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "disconnected",
  "dbError": "Connection timeout"
}
```

Si ves "database": "disconnected", el problema está en las credenciales de Supabase.

---

## 🗄️ PASO 7: Poblar la Base de Datos (Solo Primera Vez)

Una vez que el servidor esté funcionando y la DB conectada:

### Opción 1: Usando Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Vincular proyecto
railway link

# Crear el schema
railway run npm run setup

# Poblar con datos
railway run npm run seed:complete
```

### Opción 2: Desde tu máquina local

```bash
cd backend

# Asegúrate de que tu .env tenga las credenciales de Supabase
npm run setup
npm run seed:complete
```

---

## 🔴 ERRORES COMUNES Y SOLUCIONES

### Error 1: "502 Bad Gateway" persiste

**Causas:**
- El servidor está crasheando al iniciar
- Railway no puede alcanzar tu app

**Soluciones:**
1. Verificar logs (PASO 2)
2. Asegurar que el servidor escuche en 0.0.0.0 (ya lo arreglé)
3. No hardcodear el puerto, usar `process.env.PORT`

---

### Error 2: "Database connection failed"

**Causas:**
- Credenciales de Supabase incorrectas
- Host mal escrito
- Password con caracteres especiales sin escapar

**Soluciones:**
1. Copiar las credenciales exactas de Supabase
2. Verificar que el host sea: `db.xxxxx.supabase.co` (sin https://)
3. Si el password tiene `%`, `@`, `&`, etc., ponerlo entre comillas en Railway

---

### Error 3: "Cannot find module 'xxx'"

**Causas:**
- npm install no se ejecutó correctamente
- package.json no está en la ubicación correcta

**Soluciones:**
1. Verificar que `buildCommand` incluya `npm install`
2. Verificar que el `Root Directory` sea correcto
3. Asegurar que `package.json` esté en `backend/package.json`

---

### Error 4: El servidor inicia pero no responde

**Causas:**
- El servidor escucha en localhost en vez de 0.0.0.0
- CORS bloqueando peticiones

**Soluciones:**
1. Ya lo arreglé - ahora escucha en 0.0.0.0
2. Verificar que CORS_ORIGIN incluya el dominio de Railway

---

### Error 5: "This site can't be reached"

**Causas:**
- El deployment todavía está en progreso
- El dominio de Railway está mal

**Soluciones:**
1. Esperar 2-5 minutos después del deploy
2. Verificar en Railway → Settings → Domains que el dominio esté activo
3. Railway genera un dominio automáticamente: `xxx.up.railway.app`

---

## 📋 CHECKLIST COMPLETO

Usa este checklist para verificar todo:

- [ ] Código actualizado con los cambios (git push)
- [ ] Logs muestran "SERVER STARTED SUCCESSFULLY"
- [ ] Logs muestran "Database connection verified"
- [ ] Variable DB_HOST configurada en Railway
- [ ] Variable DB_PASSWORD configurada en Railway
- [ ] Variable JWT_SECRET configurada en Railway
- [ ] Variable NODE_ENV=production en Railway
- [ ] Root Directory correcto en Railway Settings
- [ ] Start Command correcto en Railway Settings
- [ ] Endpoint `/` responde con JSON
- [ ] Endpoint `/health` responde con "database": "connected"
- [ ] Schema creado en Supabase (npm run setup)
- [ ] Base de datos poblada (npm run seed:complete)

---

## 🆘 Necesitas más ayuda?

Si después de seguir todos estos pasos el error 502 persiste:

1. **Copia los logs de Railway** (últimas 50 líneas)
2. **Toma screenshot** de tus Variables en Railway (oculta los valores sensibles)
3. **Verifica** que el deployment diga "Success" en Railway

Y compárteme esa información para ayudarte mejor.

---

## 📚 Recursos Útiles

- [Railway Docs - Deployment](https://docs.railway.app/deploy/deployments)
- [Railway Docs - Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Logs](https://docs.railway.app/develop/logs)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

## ✅ Próximos Pasos Después de Resolver el 502

Una vez que el servidor esté funcionando:

1. Actualizar el frontend con la URL de Railway
2. Configurar CORS para permitir tu app móvil
3. Cambiar las contraseñas de los usuarios de prueba
4. Configurar Cloudinary para subir imágenes
5. (Opcional) Configurar un dominio personalizado en Railway
