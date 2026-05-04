import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Interceptor: Token encontrado:', token ? 'SÍ' : 'NO');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor: Header Authorization agregado');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo redirigir si no estamos en la página de login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/registro' && currentPath !== '/recuperar-password') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 