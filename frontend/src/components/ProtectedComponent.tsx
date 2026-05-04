import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { usePermissions, UserPermissions } from '../hooks/usePermissions';

interface ProtectedComponentProps {
  children: React.ReactNode;
  permission?: keyof UserPermissions;
  requiredRole?: 'admin' | 'viewer';
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  permission,
  requiredRole,
  fallback,
  showFallback = true
}) => {
  const userRole = usePermissions();

  if (!userRole) {
    return null; // Loading state
  }

  // Check role-based access
  if (requiredRole && userRole.role !== requiredRole && !userRole.isAdmin) {
    return showFallback ? (
      fallback || (
        <Alert severity="warning" sx={{ m: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon />
            <Typography variant="body2">
              Acceso restringido. Se requieren permisos de {requiredRole === 'admin' ? 'administrador' : 'usuario'}.
            </Typography>
          </Box>
        </Alert>
      )
    ) : null;
  }

  // Check permission-based access
  if (permission && !userRole.permissions[permission]) {
    return showFallback ? (
      fallback || (
        <Alert severity="info" sx={{ m: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon />
            <Typography variant="body2">
              No tienes permisos para ver este contenido.
            </Typography>
          </Box>
        </Alert>
      )
    ) : null;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
