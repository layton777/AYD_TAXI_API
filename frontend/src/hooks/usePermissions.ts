import { useState, useEffect } from 'react';
import authService from '../services/authService';

export interface UserPermissions {
  canViewDashboard: boolean;
  canManageUsers: boolean;
  canControlRobots: boolean;
  canConfigureSystem: boolean;
  canCreateJornadas: boolean;
  canEditJornadas: boolean;
  canDeleteJornadas: boolean;
  canManageTanques: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canViewLogs: boolean;
  canManageMalezas: boolean;
  canViewAllUsers: boolean;
  canEditOwnProfile: boolean;
  canEditAnyProfile: boolean;
}

export interface UserRole {
  role: 'admin' | 'viewer';
  permissions: UserPermissions;
  isAdmin: boolean;
  isViewer: boolean;
}

const getPermissionsByRole = (role: string, isSuperuser: boolean): UserPermissions => {
  const isAdmin = role === 'admin' || isSuperuser;
  
  if (isAdmin) {
    // Permisos completos para administradores
    return {
      canViewDashboard: true,
      canManageUsers: true,
      canControlRobots: true,
      canConfigureSystem: true,
      canCreateJornadas: true,
      canEditJornadas: true,
      canDeleteJornadas: true,
      canManageTanques: true,
      canViewReports: true,
      canExportData: true,
      canViewLogs: true,
      canManageMalezas: true,
      canViewAllUsers: true,
      canEditOwnProfile: true,
      canEditAnyProfile: true,
    };
  } else {
    // Permisos limitados para usuarios normales
    return {
      canViewDashboard: true,
      canManageUsers: false,
      canControlRobots: false,
      canConfigureSystem: false,
      canCreateJornadas: false,
      canEditJornadas: false,
      canDeleteJornadas: false,
      canManageTanques: false,
      canViewReports: true, // Solo reportes básicos
      canExportData: false,
      canViewLogs: false,
      canManageMalezas: false,
      canViewAllUsers: false,
      canEditOwnProfile: true,
      canEditAnyProfile: false,
    };
  }
};

export const usePermissions = (): UserRole | null => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const profile = await authService.obtenerPerfil();
        console.log('Perfil obtenido:', profile); // Debug
        
        const permissions = getPermissionsByRole(profile.rol, profile.is_superuser);
        console.log('Permisos calculados:', permissions); // Debug
        
        const isAdmin = profile.rol === 'admin' || profile.is_superuser;
        console.log('Es admin:', isAdmin); // Debug
        
        setUserRole({
          role: isAdmin ? 'admin' : 'viewer',
          permissions,
          isAdmin,
          isViewer: !isAdmin
        });
      } catch (error) {
        console.error('Error loading permissions:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  return loading ? null : userRole;
};

export const useHasPermission = (permission: keyof UserPermissions): boolean => {
  const userRole = usePermissions();
  return userRole?.permissions[permission] || false;
};
