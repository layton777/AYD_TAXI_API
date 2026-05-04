import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Alert,
    Avatar,
    Divider,
    InputAdornment,
    CircularProgress,
    Fade,
    Skeleton,
} from '@mui/material';
import {
    Person,
    Email,
    Home,
    Save,
    Edit,
    Group,
    AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import CountryPhoneSelector from '../components/CountryPhoneSelector';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telefono: string;
    codigo_pais: string;
    direccion: string;
    rol: string;
    is_superuser: boolean;
    fecha_creacion: string;
    is_active: boolean;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        telefono: '',
        codigo_pais: 'CO',
        direccion: '',
    });

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        try {
            const data = await authService.obtenerPerfil();
            setProfile(data);
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                email: data.email || '',
                telefono: data.telefono || '',
                codigo_pais: data.codigo_pais || 'CO',
                direccion: data.direccion || '',
            });
        } catch (error: any) {
            console.error('Error al cargar perfil:', error);
            setError('Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCountryChange = (countryCode: string) => {
        setFormData(prev => ({
            ...prev,
            codigo_pais: countryCode
        }));
    };

    const handlePhoneChange = (phoneNumber: string) => {
        setFormData(prev => ({
            ...prev,
            telefono: phoneNumber
        }));
    };

    const handleSave = async () => {
        if (!profile) return;
        
        setSaving(true);
        setError(null);
        
        try {
            await authService.actualizarPerfil(formData);
            setSuccess('Perfil actualizado exitosamente');
            setEditing(false);
            await cargarPerfil(); // Recargar datos actualizados
        } catch (error: any) {
            setError(error.detail || error.message || 'Error al actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };


    const getRolDisplay = (rol: string, is_superuser: boolean) => {
        if (is_superuser) return 'Super Administrador';
        return rol === 'admin' ? 'Administrador' : 'Usuario';
    };

    const getRolColor = (rol: string, is_superuser: boolean) => {
        if (is_superuser) return '#d32f2f';
        return rol === 'admin' ? '#1976d2' : '#388e3c';
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Header Skeleton */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Skeleton variant="circular" width={80} height={80} sx={{ mr: 3 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width={150} height={20} />
                        </Box>
                        <Skeleton variant="rectangular" width={140} height={48} sx={{ borderRadius: 2 }} />
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Form Skeleton */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                            <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                        </Box>
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
                    </Box>
                </Paper>
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    No se pudo cargar la información del perfil
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Fade in timeout={800}>
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    {/* Header del perfil */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                mr: 3,
                                background: `linear-gradient(135deg, ${getRolColor(profile.rol, profile.is_superuser)} 0%, ${getRolColor(profile.rol, profile.is_superuser)}cc 100%)`,
                                fontSize: '2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {profile.first_name?.[0]?.toUpperCase() || profile.username[0]?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                {profile.first_name && profile.last_name 
                                    ? `${profile.first_name} ${profile.last_name}`
                                    : profile.username
                                }
                            </Typography>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    color: getRolColor(profile.rol, profile.is_superuser),
                                    fontWeight: 600
                                }}
                            >
                                {getRolDisplay(profile.rol, profile.is_superuser)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Miembro desde {new Date(profile.fecha_creacion).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Button
                            variant={editing ? "outlined" : "contained"}
                            startIcon={editing ? <Save /> : <Edit />}
                            onClick={() => editing ? handleSave() : setEditing(true)}
                            disabled={saving}
                            sx={{
                                minWidth: 140,
                                background: editing ? 'transparent' : 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
                                transition: 'all 0.3s ease-in-out',
                                transform: editing ? 'scale(1.05)' : 'scale(1)',
                                '&:hover': {
                                    background: editing ? 'rgba(69, 185, 57, 0.1)' : 'linear-gradient(135deg, #2e7d32 0%, #1a9f0b 100%)',
                                    transform: 'scale(1.05)',
                                    boxShadow: editing ? '0 4px 20px rgba(69, 185, 57, 0.3)' : '0 4px 20px rgba(46, 125, 50, 0.4)',
                                }
                            }}
                        >
                            {saving ? <CircularProgress size={20} color="inherit" /> : (editing ? 'Guardar' : 'Editar Perfil')}
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Panel de administración */}
                    {(profile.rol === 'admin' || profile.is_superuser) && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AdminPanelSettings sx={{ color: '#1976d2' }} />
                                Panel de Administración
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Group />}
                                    onClick={() => navigate('/usuarios')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                                        }
                                    }}
                                >
                                    Gestionar Usuarios
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                            {success}
                        </Alert>
                    )}

                    {/* Formulario de perfil */}
                    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    fullWidth
                                    label="Apellido"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Box>
                            
                            <TextField
                                fullWidth
                                label="Nombre de Usuario"
                                value={profile.username}
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: 'action.active' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                                helperText="El nombre de usuario no se puede modificar"
                            />
                            
                            <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            
                            <Box>
                                <CountryPhoneSelector
                                    countryCode={formData.codigo_pais}
                                    phoneNumber={formData.telefono}
                                    onCountryChange={handleCountryChange}
                                    onPhoneChange={handlePhoneChange}
                                    required={false}
                                />
                                {!editing && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Teléfono con prefijo del país
                                    </Typography>
                                )}
                            </Box>
                            
                            <TextField
                                fullWidth
                                label="Dirección"
                                name="direccion"
                                multiline
                                rows={3}
                                value={formData.direccion}
                                onChange={handleChange}
                                disabled={!editing}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Home sx={{ color: 'action.active' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default ProfilePage;
