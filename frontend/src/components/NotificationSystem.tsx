import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  Typography,
  Box,
  Button,
  Chip,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Update as UpdateIcon,
  Build as MaintenanceIcon,
  PersonAdd as NewUserIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon
} from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';
import { notificacionesService } from '../services/api';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  leida: boolean;
  fecha_creacion: string;
  para_admin: boolean;
  para_usuario: boolean;
}

const NotificationSystem: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userRole = usePermissions();

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      // Como el backend aún no tiene la app de notificaciones, usamos solo el modo demo por ahora
      // const response = await notificacionesService.getAll();
      // const notificacionesFiltradas = response.data.filter((notif: Notification) => {
      //   if (userRole?.isAdmin) {
      //     return notif.para_admin || notif.para_usuario;
      //   }
      //   return notif.para_usuario;
      // });
      // setNotifications(notificacionesFiltradas);
      
      // Iniciar directamente con las notificaciones demo
      setNotifications(notificacionesDemo);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const marcarComoLeida = async (id: number) => {
    try {
      // Usar solo lógica local por ahora (demo mode)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
      // await notificacionesService.markAsRead(id);
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      // Usar solo lógica local por ahora (demo mode)
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      );
      // await notificacionesService.markAllAsRead();
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
    }
  };

  const getIconForType = (tipo: string, titulo: string) => {
    // Iconos específicos basados en el título
    if (titulo.toLowerCase().includes('actualizado') || titulo.toLowerCase().includes('update')) {
      return <UpdateIcon sx={{ color: '#4caf50' }} fontSize="small" />;
    }
    if (titulo.toLowerCase().includes('mantenimiento') || titulo.toLowerCase().includes('maintenance')) {
      return <MaintenanceIcon sx={{ color: '#ff9800' }} fontSize="small" />;
    }
    if (titulo.toLowerCase().includes('usuario') || titulo.toLowerCase().includes('registrado')) {
      return <NewUserIcon sx={{ color: '#2196f3' }} fontSize="small" />;
    }
    
    // Iconos por tipo
    switch (tipo) {
      case 'warning': return <WarningIcon sx={{ color: '#ff9800' }} fontSize="small" />;
      case 'error': return <ErrorIcon sx={{ color: '#f44336' }} fontSize="small" />;
      case 'success': return <SuccessIcon sx={{ color: '#4caf50' }} fontSize="small" />;
      default: return <InfoIcon sx={{ color: '#2196f3' }} fontSize="small" />;
    }
  };

  const open = Boolean(anchorEl);

  // Notificaciones simuladas para demostración
  const notificacionesDemo: Notification[] = [
    {
      id: 1,
      titulo: 'Sistema Actualizado',
      mensaje: 'El sistema ha sido actualizado con nuevas funcionalidades',
      tipo: 'success',
      leida: false,
      fecha_creacion: new Date().toISOString(),
      para_admin: true,
      para_usuario: true
    },
    {
      id: 2,
      titulo: 'Mantenimiento Programado',
      mensaje: 'Mantenimiento del sistema programado para mañana a las 2:00 AM',
      tipo: 'warning',
      leida: false,
      fecha_creacion: new Date(Date.now() - 3600000).toISOString(),
      para_admin: true,
      para_usuario: true
    },
    {
      id: 3,
      titulo: 'Nuevo Usuario Registrado',
      mensaje: 'Un nuevo usuario se ha registrado y requiere aprobación',
      tipo: 'info',
      leida: true,
      fecha_creacion: new Date(Date.now() - 7200000).toISOString(),
      para_admin: true,
      para_usuario: false
    }
  ];

  // Usar notificaciones del estado
  const notificacionesFiltradas = notifications.filter(notif => {
    if (userRole?.isAdmin) {
      return notif.para_admin || notif.para_usuario;
    }
    return notif.para_usuario;
  });

  const unreadCountFinal = notificacionesFiltradas.filter(n => !n.leida).length;

  return (
    <>
      <Zoom in={true}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ 
            color: 'white',
            position: 'relative',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          <Badge 
            badgeContent={unreadCountFinal} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                animation: unreadCountFinal > 0 ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                  '100%': { transform: 'scale(1)' }
                }
              }
            }}
          >
            <NotificationsIcon sx={{
              animation: unreadCountFinal > 0 ? 'shake 0.5s ease-in-out' : 'none',
              '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '25%': { transform: 'translateX(-2px)' },
                '75%': { transform: 'translateX(2px)' }
              }
            }} />
          </Badge>
        </IconButton>
      </Zoom>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 450,
            overflow: 'hidden',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ 
          p: 2.5, 
          borderBottom: '1px solid #e0e0e0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon />
              Notificaciones
            </Typography>
            <Chip 
              icon={userRole?.isAdmin ? <AdminIcon /> : <UserIcon />}
              label={userRole?.isAdmin ? 'Admin' : 'Usuario'}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {unreadCountFinal} sin leer de {notificacionesFiltradas.length}
            </Typography>
            {unreadCountFinal > 0 && (
              <Button 
                size="small" 
                onClick={marcarTodasComoLeidas}
                startIcon={<MarkReadIcon />}
                sx={{ 
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
                variant="outlined"
              >
                Marcar todas como leídas
              </Button>
            )}
          </Box>
        </Box>

        {notificacionesFiltradas.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              No hay notificaciones
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Cuando tengas nuevas notificaciones aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 320, overflow: 'auto', p: 1 }}>
            {notificacionesFiltradas.map((notification, index) => (
              <Slide 
                key={notification.id} 
                direction="left" 
                in={true} 
                timeout={300 + (index * 100)}
              >
                <Card
                  onClick={() => !notification.leida && marcarComoLeida(notification.id)}
                  sx={{
                    mb: 1,
                    cursor: notification.leida ? 'default' : 'pointer',
                    backgroundColor: notification.leida ? '#fafafa' : '#fff',
                    border: notification.leida ? '1px solid #e0e0e0' : '1px solid #2196f3',
                    borderLeft: `4px solid ${notification.leida ? '#e0e0e0' : '#2196f3'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: notification.leida ? '#e0e0e0' : '#2196f3' 
                      }}>
                        {getIconForType(notification.tipo, notification.titulo)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: notification.leida ? 500 : 700,
                              color: notification.leida ? 'text.secondary' : 'text.primary',
                              flex: 1
                            }}
                          >
                            {notification.titulo}
                          </Typography>
                          {!notification.leida && (
                            <Zoom in={true}>
                              <Box 
                                sx={{ 
                                  width: 10, 
                                  height: 10, 
                                  borderRadius: '50%', 
                                  backgroundColor: '#2196f3',
                                  ml: 1,
                                  flexShrink: 0,
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 }
                                  }
                                }} 
                              />
                            </Zoom>
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4 }}>
                          {notification.mensaje}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
                            {new Date(notification.fecha_creacion).toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {notification.para_admin && (
                              <Chip 
                                label="Admin" 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.65rem', 
                                  height: 18,
                                  backgroundColor: '#fff3e0',
                                  color: '#f57c00',
                                  border: '1px solid #ffcc02'
                                }}
                              />
                            )}
                            {notification.para_usuario && (
                              <Chip 
                                label="Usuario" 
                                size="small" 
                                sx={{ 
                                  fontSize: '0.65rem', 
                                  height: 18,
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  border: '1px solid #2196f3'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            ))}
          </Box>
        )}

        {notificacionesFiltradas.length > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid #e0e0e0', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}>
            <Button 
              size="small" 
              onClick={handleClose}
              startIcon={<CloseIcon />}
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.05)'
                }
              }}
            >
              Cerrar notificaciones
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationSystem;
