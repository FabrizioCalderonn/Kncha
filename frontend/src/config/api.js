import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL - cambiar según el entorno
const API_URL = __DEV__
  ? 'http://localhost:5000/api/v1'  // Desarrollo local
  : 'https://tu-app.railway.app/api/v1';  // Producción en Railway

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Aquí podrías redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;
