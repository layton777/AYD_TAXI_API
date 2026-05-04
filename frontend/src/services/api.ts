import api from './axiosConfig';

// ============================================================
// Interfaces que reflejan los modelos del backend AYD TAXI
// ============================================================

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string | null;
  codigo_pais: string;
  direccion: string | null;
  rol: 'admin' | 'pasajero' | 'conductor';
  is_superuser: boolean;
  fecha_creacion: string;
  is_active: boolean;
  foto_url: string | null;
  calificacion_promedio: number;
  licencia: string | null;
  disponible: boolean;
  latitud: number | null;
  longitud: number | null;
  total_viajes: number;
}

export interface Vehiculo {
  id_vehiculo: number;
  conductor: number;
  conductor_nombre: string;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anio: number;
  tipo: 'sedan' | 'camioneta' | 'van' | 'suv';
  foto_url: string | null;
  activo: boolean;
  fecha_registro: string;
}

export interface Viaje {
  id_viaje: number;
  pasajero: number;
  pasajero_nombre: string;
  conductor: number | null;
  conductor_nombre: string | null;
  origen_direccion: string;
  origen_lat: number;
  origen_lng: number;
  destino_direccion: string;
  destino_lat: number;
  destino_lng: number;
  estado: 'solicitado' | 'aceptado' | 'en_curso' | 'completado' | 'cancelado';
  estado_display: string;
  tarifa_estimada: number;
  tarifa_final: number | null;
  distancia_km: number;
  duracion_min: number;
  metodo_pago: 'efectivo' | 'nequi' | 'daviplata';
  fecha_solicitud: string;
  fecha_aceptado: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  observaciones: string | null;
  motivo_cancelacion: string | null;
}

export interface Tarifa {
  id_tarifa: number;
  zona_origen: string;
  zona_destino: string;
  precio_base: number;
  precio_por_km: number;
  recargo_nocturno: number;
  recargo_festivo: number;
  activo: boolean;
  fecha_actualizacion: string;
}

export interface Calificacion {
  id_calificacion: number;
  viaje: number;
  calificador: number;
  calificador_nombre: string;
  calificado: number;
  calificado_nombre: string;
  puntuacion: number;
  comentario: string | null;
  fecha: string;
}

export interface DashboardStats {
  total_viajes: number;
  viajes_completados: number;
  viajes_en_curso: number;
  viajes_pendientes: number;
  viajes_cancelados: number;
  ingresos_totales: number;
  tarifa_promedio: number;
  total_pasajeros: number;
  total_conductores: number;
  conductores_disponibles: number;
  total_vehiculos: number;
  calificacion_promedio: number;
  distancia_total_km: number;
}

// ============================================================
// Servicios de autenticación
// ============================================================
export const authService = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/token/', credentials),
  refreshToken: (refresh: string) =>
    api.post('/token/refresh/', { refresh }),
};

// ============================================================
// Servicios de vehículos
// ============================================================
export const vehiculosService = {
  getAll: () => api.get<Vehiculo[]>('/vehiculos/'),
  getById: (id: number) => api.get<Vehiculo>(`/vehiculos/${id}/`),
  create: (data: Partial<Vehiculo>) => api.post<Vehiculo>('/vehiculos/', data),
  update: (id: number, data: Partial<Vehiculo>) => api.patch<Vehiculo>(`/vehiculos/${id}/`, data),
  delete: (id: number) => api.delete(`/vehiculos/${id}/`),
};

// ============================================================
// Servicios de viajes
// ============================================================
export const viajesService = {
  getAll: (estado?: string) => api.get<Viaje[]>(`/viajes/${estado ? `?estado=${estado}` : ''}`),
  getById: (id: number) => api.get<Viaje>(`/viajes/${id}/`),
  solicitar: (data: {
    origen_direccion: string;
    origen_lat: number;
    origen_lng: number;
    destino_direccion: string;
    destino_lat: number;
    destino_lng: number;
    metodo_pago?: string;
    observaciones?: string;
  }) => api.post<Viaje>('/viajes/solicitar/', data),
  aceptar: (id: number) => api.post<Viaje>(`/viajes/${id}/aceptar/`),
  iniciar: (id: number) => api.post<Viaje>(`/viajes/${id}/iniciar/`),
  completar: (id: number, tarifa_final?: number) => api.post<Viaje>(`/viajes/${id}/completar/`, { tarifa_final }),
  cancelar: (id: number, motivo?: string) => api.post<Viaje>(`/viajes/${id}/cancelar/`, { motivo }),
  activos: () => api.get<Viaje[]>('/viajes/activos/'),
  pendientes: () => api.get<Viaje[]>('/viajes/pendientes/'),
  historial: (params?: { estado?: string; fecha_desde?: string; fecha_hasta?: string }) => {
    const query = new URLSearchParams();
    if (params?.estado) query.set('estado', params.estado);
    if (params?.fecha_desde) query.set('fecha_desde', params.fecha_desde);
    if (params?.fecha_hasta) query.set('fecha_hasta', params.fecha_hasta);
    return api.get<Viaje[]>(`/viajes/historial/?${query.toString()}`);
  },
};

// ============================================================
// Servicios de tarifas
// ============================================================
export const tarifasService = {
  getAll: () => api.get<Tarifa[]>('/tarifas/'),
  getById: (id: number) => api.get<Tarifa>(`/tarifas/${id}/`),
  create: (data: Partial<Tarifa>) => api.post<Tarifa>('/tarifas/', data),
  update: (id: number, data: Partial<Tarifa>) => api.patch<Tarifa>(`/tarifas/${id}/`, data),
  delete: (id: number) => api.delete(`/tarifas/${id}/`),
  calcular: (data: { zona_origen: string; zona_destino: string; distancia_km?: number; es_nocturno?: boolean; es_festivo?: boolean }) =>
    api.post('/tarifas/calcular/', data),
  getZonas: () => api.get<{ zonas: string[] }>('/tarifas/zonas/'),
};

// ============================================================
// Servicios de calificaciones
// ============================================================
export const calificacionesService = {
  getAll: () => api.get<Calificacion[]>('/calificaciones/'),
  crear: (data: { viaje_id: number; puntuacion: number; comentario?: string }) =>
    api.post<Calificacion>('/calificaciones/crear/', data),
  misCalificaciones: () => api.get('/calificaciones/mis-calificaciones/'),
  deUsuario: (userId: number) => api.get(`/calificaciones/usuario/${userId}/`),
};

// ============================================================
// Servicios de dashboard
// ============================================================
export const dashboardService = {
  getStats: (start?: string, end?: string) => {
    let url = '/dashboard/stats/';
    if (start && end) url += `?start_date=${start}&end_date=${end}`;
    return api.get<DashboardStats>(url);
  },
  getActivity: (start?: string, end?: string) => {
    let url = '/dashboard/activity/';
    if (start && end) url += `?start_date=${start}&end_date=${end}`;
    return api.get(url);
  },
  getConductorStats: () => api.get('/dashboard/conductores/'),
  getZonasPopulares: () => api.get('/dashboard/zonas/'),
  getViajesRecientes: () => api.get<Viaje[]>('/dashboard/viajes-recientes/'),
};

// ============================================================
// Servicios de conductores
// ============================================================
export const conductoresService = {
  getAll: () => api.get<Usuario[]>('/auth/conductores/'),
  getDisponibles: () => api.get<Usuario[]>('/auth/conductores/disponibles/'),
  actualizarUbicacion: (data: { latitud: number; longitud: number; disponible?: boolean }) =>
    api.post('/auth/conductor/ubicacion/', data),
  toggleDisponibilidad: () => api.post('/auth/conductor/disponibilidad/'),
};

// ============================================================
// Servicios de usuarios
// ============================================================
export const usuariosService = {
  getAll: () => api.get<Usuario[]>('/auth/usuarios/'),
  getById: (id: number) => api.get<Usuario>(`/auth/usuarios/${id}/`),
  update: (id: number, data: Partial<Usuario>) => api.patch<Usuario>(`/auth/usuarios/${id}/`, data),
  delete: (id: number) => api.delete(`/auth/usuarios/${id}/`),
  getPerfil: () => api.get<Usuario>('/auth/perfil/'),
  updatePerfil: (data: Partial<Usuario>) => api.patch<Usuario>('/auth/perfil/', data),
};

export default api;