import axios from './axiosConfig';
import { LoginCredentials, LoginResponse } from '../interfaces/User';

const API_URL = '/auth';

class AuthService {
    async register(userData: any): Promise<any> {
        try {
            console.log('Intentando registrar usuario con datos:', userData);
            const response = await axios.post(`${API_URL}/registro/`, userData);
            console.log('Respuesta del servidor:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error en el registro:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async login(credentials: LoginCredentials): Promise<any> {
        try {
            console.log('Intentando login con credenciales:', credentials);
            const response = await axios.post<LoginResponse>('/token/', credentials);
            console.log('Respuesta del login:', response.data);
            
            if (response.data.access) {  // JWT devuelve 'access' y 'refresh'
                const userData = {
                    token: response.data.access,
                    refresh: response.data.refresh,
                    user: credentials.username
                };
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', response.data.access); // También guardar como 'token' para compatibilidad
                console.log('Token guardado en localStorage:', response.data.access);
                return userData;
            }
            throw new Error('Token no recibido');
        } catch (error: any) {
            console.error('Error en el login:', error.response?.data || error);
            console.error('Error completo:', error);
            // Asegurar que se propague el mensaje específico del backend
            if (error.response?.data?.detail) {
                throw { detail: error.response.data.detail };
            }
            throw error.response?.data || { detail: 'Error de conexión' };
        }
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }

    getCurrentUser(): any {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            return userData;
        }
        return null;
    }

    isAuthenticated(): boolean {
        const user = this.getCurrentUser();
        console.log('Verificando autenticación, usuario:', user);
        return user !== null;
    }

    // Métodos para recuperación de contraseña
    async enviarCodigoRecuperacion(email: string): Promise<any> {
        try {
            console.log('Enviando código de recuperación a:', email);
            const response = await axios.post(`${API_URL}/enviar-codigo-recuperacion/`, { email });
            return response.data;
        } catch (error: any) {
            console.error('Error al enviar código:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async verificarCodigoRecuperacion(email: string, codigo: string): Promise<any> {
        try {
            console.log('Verificando código para:', email);
            const response = await axios.post(`${API_URL}/verificar-codigo-recuperacion/`, { email, codigo });
            return response.data;
        } catch (error: any) {
            console.error('Error al verificar código:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async cambiarPasswordConCodigo(email: string, codigo: string, nuevaPassword: string): Promise<any> {
        try {
            console.log('Cambiando contraseña con código');
            const response = await axios.post(`${API_URL}/cambiar-password-con-codigo/`, {
                email,
                codigo,
                nueva_password: nuevaPassword
            });
            return response.data;
        } catch (error: any) {
            console.error('Error al cambiar contraseña:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async solicitarPermisosAdmin(motivo: string): Promise<any> {
        try {
            console.log('Solicitando permisos de administrador');
            const response = await axios.post(`${API_URL}/solicitar-admin/`, {
                motivo
            });
            return response.data;
        } catch (error: any) {
            console.error('Error al solicitar permisos:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async verificarCodigoAdmin(codigo: string): Promise<any> {
        try {
            console.log('Verificando código de administrador');
            const response = await axios.post(`${API_URL}/verificar-admin/`, {
                codigo
            });
            return response.data;
        } catch (error: any) {
            console.error('Error al verificar código:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    // Métodos para gestión de usuarios (solo administradores)
    async obtenerUsuarios(): Promise<any[]> {
        try {
            const response = await axios.get(`${API_URL}/usuarios/`);
            const data = response.data;
            // Asegurar que siempre devolvemos un array
            if (Array.isArray(data)) {
                return data;
            } else if (data && Array.isArray(data.results)) {
                // Si la respuesta tiene paginación
                return data.results;
            } else {
                console.warn('Respuesta inesperada del servidor:', data);
                return [];
            }
        } catch (error: any) {
            console.error('Error al obtener usuarios:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async obtenerUsuario(id: number): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}/usuarios/${id}/`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener usuario:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async actualizarUsuario(id: number, userData: any): Promise<any> {
        try {
            const response = await axios.put(`${API_URL}/usuarios/${id}/`, userData);
            return response.data;
        } catch (error: any) {
            console.error('Error al actualizar usuario:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async eliminarUsuario(id: number): Promise<any> {
        try {
            const response = await axios.delete(`${API_URL}/usuarios/${id}/`);
            return response.data;
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    async obtenerPerfil(): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}/perfil/`);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener perfil:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    // Actualizar perfil propio
    async actualizarPerfil(userData: any): Promise<any> {
        try {
            const response = await axios.put(`${API_URL}/perfil/`, userData);
            return response.data;
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error.response?.data || error);
            throw error.response?.data || error;
        }
    }

    // Verificar si el usuario actual es administrador
    async esAdministrador(): Promise<boolean> {
        try {
            const perfil = await this.obtenerPerfil();
            return perfil.rol === 'admin' || perfil.is_superuser;
        } catch (error) {
            return false;
        }
    }
}

export default new AuthService(); 