# Cancha a la Vista - Frontend

Aplicación móvil para reservar canchas deportivas en El Salvador.

## Tecnologías

- React Native con Expo
- React Navigation
- Axios
- Expo Location
- React Native Maps
- Expo Image Picker

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz con:

```
API_URL=http://localhost:5000/api/v1
```

## Comandos

```bash
npm start        # Iniciar Expo
npm run android  # Ejecutar en Android
npm run ios      # Ejecutar en iOS (solo Mac)
npm run web      # Ejecutar en navegador
```

## Estructura

- `/src/screens` - Pantallas de la app
- `/src/components` - Componentes reutilizables
- `/src/navigation` - Configuración de navegación
- `/src/services` - Servicios de API
- `/src/context` - Context providers (Auth, Theme)
- `/src/config` - Configuración de la app

## Roles

- **Cliente**: Explorar y reservar canchas
- **Dueño**: Gestionar canchas y reservas
- **Admin**: Panel de administración
