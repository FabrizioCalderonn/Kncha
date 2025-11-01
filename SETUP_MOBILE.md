# Configuración y Build de la App Móvil

## Generar APK con EAS Build

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login en Expo

```bash
eas login
```

### 3. Configurar el proyecto

```bash
cd frontend
eas build:configure
```

### 4. Generar APK para Android

```bash
# Build de desarrollo
eas build --platform android --profile development

# Build de producción (APK)
eas build --platform android --profile production
```

El APK estará listo para descargar en aproximadamente 10-15 minutos.

## Configurar Assets

La app necesita 3 imágenes:

### 1. Icon (icon.png)
- Tamaño: 1024x1024px
- Formato: PNG sin transparencia
- Ubicación: `frontend/assets/icon.png`

### 2. Splash Screen (splash.png)
- Tamaño: 1284x2778px
- Formato: PNG
- Ubicación: `frontend/assets/splash.png`

### 3. Adaptive Icon (Android)
- Tamaño: 1024x1024px
- Formato: PNG con transparencia
- Ubicación: `frontend/assets/adaptive-icon.png`

## Modificar Configuración

Edita `frontend/app.json`:

```json
{
  "expo": {
    "name": "Tu Nombre de App",
    "slug": "tu-slug",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "android": {
      "package": "com.tuempresa.tuapp",
      "versionCode": 1
    }
  }
}
```

## Cambiar API URL

En `frontend/src/config/api.js`:

```javascript
const API_URL = __DEV__
  ? 'http://localhost:5000/api/v1'  // Desarrollo
  : 'https://tu-app.railway.app/api/v1';  // Producción
```

## Probar el APK

1. Descarga el APK de la URL proporcionada por EAS
2. Transfiérelo a tu teléfono Android
3. Instálalo (permite "Fuentes desconocidas" en Ajustes)
4. Abre la app

## Publicar en Play Store

### 1. Generar AAB (Android App Bundle)

Edita `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

```bash
eas build --platform android --profile production
```

### 2. Subir a Play Store

1. Ve a [Google Play Console](https://play.google.com/console)
2. Crea una nueva aplicación
3. Sube el AAB generado
4. Completa la información requerida
5. Publica

## iOS (opcional)

Para iOS necesitas:
- Una Mac
- Cuenta de Apple Developer ($99/año)

```bash
eas build --platform ios --profile production
```

## Troubleshooting

### Error: "SDK version mismatch"
```bash
cd frontend
npm install expo@latest
```

### Error al construir
```bash
eas build --platform android --profile production --clear-cache
```

### APK muy grande
- Reduce el tamaño de las imágenes en `assets/`
- Usa formato WEBP en lugar de PNG cuando sea posible
