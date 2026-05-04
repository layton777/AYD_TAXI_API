import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    CalendarToday as CalendarIcon,
    Security as SecurityIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';
import authService from '../services/authService';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telefono?: string;
    direccion?: string;
    rol: 'admin' | 'viewer';
    is_superuser: boolean;
    fecha_creacion: string;
    is_active: boolean;
}

const UserProfileCard: React.FC = () => {
    const [perfil, setPerfil] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const data = await authService.obtenerPerfil();
                setPerfil(data);
            } catch (error) {
                console.error('Error al cargar perfil:', error);
            } finally {
                setLoading(false);
            }
        };
        cargarPerfil();
    }, []);

    if (loading || !perfil) {
        return null;
    }

    const esAdmin = perfil.rol === 'admin' || perfil.is_superuser;
    const nombreCompleto = `${perfil.first_name} ${perfil.last_name}`.trim() || perfil.username;

    return (
        <Card sx={{ 
            maxWidth: 400, 
            background: esAdmin 
                ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(21, 101, 192, 0.05) 100%)',
            border: esAdmin 
                ? '2px solid rgba(255, 193, 7, 0.2)'
                : '2px solid rgba(33, 150, 243, 0.2)',
            boxShadow: esAdmin
                ? '0 8px 32px rgba(255, 193, 7, 0.15)'
                : '0 8px 32px rgba(33, 150, 243, 0.15)'
        }}>
            <CardContent>
                {/* Header con avatar y rol */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mr: 2,
                        background: esAdmin 
                            ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
                            : 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        {esAdmin ? (
                            <AdminIcon sx={{ fontSize: 30 }} />
                        ) : (
                            <PersonIcon sx={{ fontSize: 30 }} />
                        )}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {nombreCompleto}
                        </Typography>
                        <Chip
                            icon={esAdmin ? <AdminIcon /> : <PersonIcon />}
                            label={esAdmin ? 'Administrador' : 'Usuario'}
                            color={esAdmin ? 'warning' : 'primary'}
                            size="small"
                            sx={{ 
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                    fontSize: '16px'
                                }
                            }}
                        />
                        {perfil.is_superuser && (
                            <Chip
                                icon={<SecurityIcon />}
                                label="Superusuario"
                                color="error"
                                size="small"
                                sx={{ ml: 1, fontWeight: 600 }}
                            />
                        )}
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Información del usuario */}
                <List dense>
                    <ListItem>
                        <ListItemIcon>
                            <PersonIcon color="action" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Usuario" 
                            secondary={perfil.username}
                        />
                    </ListItem>
                    
                    <ListItem>
                        <ListItemIcon>
                            <EmailIcon color="action" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Email" 
                            secondary={perfil.email}
                        />
                    </ListItem>

                    {perfil.telefono && (
                        <ListItem>
                            <ListItemIcon>
                                <PhoneIcon color="action" />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Teléfono" 
                                secondary={perfil.telefono}
                            />
                        </ListItem>
                    )}

                    {perfil.direccion && (
                        <ListItem>
                            <ListItemIcon>
                                <LocationIcon color="action" />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Dirección" 
                                secondary={perfil.direccion}
                            />
                        </ListItem>
                    )}

                    <ListItem>
                        <ListItemIcon>
                            <CalendarIcon color="action" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Fecha de registro" 
                            secondary={new Date(perfil.fecha_creacion).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <VerifiedIcon color={perfil.is_active ? 'success' : 'error'} />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Estado" 
                            secondary={
                                <Chip 
                                    label={perfil.is_active ? 'Activo' : 'Inactivo'}
                                    color={perfil.is_active ? 'success' : 'error'}
                                    size="small"
                                />
                            }
                            secondaryTypographyProps={{ component: 'div' } as any}
                        />
                    </ListItem>
                </List>

                {/* Permisos especiales para administradores */}
                {esAdmin && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            background: 'rgba(255, 193, 7, 0.1)',
                            border: '1px solid rgba(255, 193, 7, 0.2)'
                        }}>
                            <Typography variant="subtitle2" sx={{ 
                                fontWeight: 700, 
                                mb: 1,
                                color: '#f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <AdminIcon fontSize="small" />
                                Permisos de Administrador
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Gestionar usuarios del sistema<br/>
                                • Editar y eliminar perfiles<br/>
                                • Acceso completo a todas las funciones<br/>
                                • Configuración del sistema
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;
