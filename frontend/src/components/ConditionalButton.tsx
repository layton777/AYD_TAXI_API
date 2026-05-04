import React from 'react';
import { Button, IconButton, Tooltip, ButtonProps, IconButtonProps } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { usePermissions, UserPermissions } from '../hooks/usePermissions';

interface ConditionalButtonProps extends Omit<ButtonProps, 'onClick'> {
  permission?: keyof UserPermissions;
  requiredRole?: 'admin' | 'viewer';
  onClick?: () => void;
  children: React.ReactNode;
  showDisabled?: boolean;
  disabledTooltip?: string;
}

interface ConditionalIconButtonProps extends Omit<IconButtonProps, 'onClick'> {
  permission?: keyof UserPermissions;
  requiredRole?: 'admin' | 'viewer';
  onClick?: () => void;
  children: React.ReactNode;
  showDisabled?: boolean;
  disabledTooltip?: string;
}

export const ConditionalButton: React.FC<ConditionalButtonProps> = ({
  permission,
  requiredRole,
  onClick,
  children,
  showDisabled = true,
  disabledTooltip = "No tienes permisos para esta acción",
  ...buttonProps
}) => {
  const userRole = usePermissions();

  if (!userRole) return null;

  const hasPermission = permission ? userRole.permissions[permission] : true;
  const hasRole = requiredRole ? (userRole.role === requiredRole || userRole.isAdmin) : true;
  const canAccess = hasPermission && hasRole;

  if (!canAccess && !showDisabled) {
    return null;
  }

  const button = (
    <Button
      {...buttonProps}
      disabled={!canAccess || buttonProps.disabled}
      onClick={canAccess ? onClick : undefined}
      startIcon={!canAccess ? <LockIcon /> : buttonProps.startIcon}
    >
      {children}
    </Button>
  );

  if (!canAccess && showDisabled) {
    return (
      <Tooltip title={disabledTooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

export const ConditionalIconButton: React.FC<ConditionalIconButtonProps> = ({
  permission,
  requiredRole,
  onClick,
  children,
  showDisabled = true,
  disabledTooltip = "No tienes permisos para esta acción",
  ...buttonProps
}) => {
  const userRole = usePermissions();

  if (!userRole) return null;

  const hasPermission = permission ? userRole.permissions[permission] : true;
  const hasRole = requiredRole ? (userRole.role === requiredRole || userRole.isAdmin) : true;
  const canAccess = hasPermission && hasRole;

  if (!canAccess && !showDisabled) {
    return null;
  }

  const button = (
    <IconButton
      {...buttonProps}
      disabled={!canAccess || buttonProps.disabled}
      onClick={canAccess ? onClick : undefined}
    >
      {!canAccess ? <LockIcon /> : children}
    </IconButton>
  );

  if (!canAccess && showDisabled) {
    return (
      <Tooltip title={disabledTooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};
