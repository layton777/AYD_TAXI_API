import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Alert,
    InputAdornment, IconButton, Grid, useTheme, Select, MenuItem, FormControl
} from '@mui/material';
import {
    Visibility, VisibilityOff, Person, Lock, LocalTaxi, Email, Phone, Home, Badge
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', first_name: '', last_name: '',
        telefono: '', direccion: '', rol: 'pasajero'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authService.register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Error al registrar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            <Grid item xs={12} sm={8} md={6} lg={5} sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4
            }}>
                <Paper elevation={0} sx={{
                    p: { xs: 4, md: 5 }, width: '100%', maxWidth: 500,
                    borderRadius: 4, backgroundColor: '#ffffff',
                    border: '1px solid #eaeaea',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
                }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            Crea tu cuenta
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Únete a la plataforma líder de transporte
                        </Typography>
                    </Box>

                    {success ? (
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            ¡Registro exitoso! Redirigiendo al login...
                        </Alert>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit}>
                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField fullWidth name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }}>
                                        <Select name="rol" value={formData.rol} onChange={(e) => handleChange({ target: { name: 'rol', value: e.target.value } } as any)}>
                                            <MenuItem value="pasajero">Pasajero</MenuItem>
                                            <MenuItem value="conductor">Conductor</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth type={showPassword ? 'text' : 'password'} name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} size="small">{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                                </Grid>
                            </Grid>

                            <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.8, borderRadius: 2, fontSize: '1rem', fontWeight: 700, textTransform: 'none', boxShadow: 'none', mt: 2, '&:hover': { boxShadow: '0 4px 12px rgba(249, 168, 37, 0.3)' } }}>
                                {isLoading ? 'Registrando...' : 'Crear cuenta'}
                            </Button>
                            
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    ¿Ya tienes cuenta? {' '}
                                    <Link to="/login" style={{ color: '#212121', textDecoration: 'none', fontWeight: 700 }}>Inicia sesión</Link>
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={0} sm={4} md={6} lg={7} sx={{
                display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', justifyContent: 'center',
                background: 'linear-gradient(135deg, #111111 0%, #212121 100%)', color: '#fff',
                position: 'relative', overflow: 'hidden', px: { sm: 4, md: 8, lg: 12 }
            }}>
                <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(249,168,37,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.primary.main, color: '#111', borderRadius: 3, p: 2, mb: 4, boxShadow: '0 8px 24px rgba(249, 168, 37, 0.4)' }}>
                        <LocalTaxi sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h2" fontWeight={800} sx={{ mb: 2, fontFamily: '"Outfit", "Inter", sans-serif', letterSpacing: '-0.5px' }}>
                        Sé parte del equipo<span style={{ color: theme.palette.primary.main }}>.</span>
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#aaa', fontWeight: 400, lineHeight: 1.6 }}>
                        Ya sea que busques viajar o conducir, AYD TAXI te conecta con la provincia del Valle de Ubaté.
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default RegisterPage;