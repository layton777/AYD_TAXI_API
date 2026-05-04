import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Alert,
    InputAdornment, IconButton, Grid, useTheme, Avatar
} from '@mui/material';
import {
    Visibility, VisibilityOff, Person, Lock, LocalTaxi, ArrowForward
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authService.login({ username, password });
            navigate('/dashboard');
        } catch (err: any) {
            const errorMessage = err.detail || err.message || 'Usuario o contraseña incorrectos';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            {/* PANEL IZQUIERDO - BRANDING (Oculto en móviles) */}
            <Grid item xs={0} sm={4} md={6} lg={7} sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #111111 0%, #212121 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                px: { sm: 4, md: 8, lg: 12 }
            }}>
                {/* Elementos decorativos de fondo */}
                <Box sx={{
                    position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%',
                    background: 'radial-gradient(circle, rgba(249,168,37,0.15) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%', zIndex: 0
                }} />
                <Box sx={{
                    position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%',
                    background: 'radial-gradient(circle, rgba(249,168,37,0.1) 0%, rgba(0,0,0,0) 70%)',
                    borderRadius: '50%', zIndex: 0
                }} />
                
                {/* Contenido branding */}
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
                    <Box sx={{ 
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: theme.palette.primary.main, color: '#111', 
                        borderRadius: 3, p: 2, mb: 4, boxShadow: '0 8px 24px rgba(249, 168, 37, 0.4)'
                    }}>
                        <LocalTaxi sx={{ fontSize: 48 }} />
                    </Box>
                    <Typography variant="h2" fontWeight={800} sx={{ mb: 2, fontFamily: '"Outfit", "Inter", sans-serif', letterSpacing: '-0.5px' }}>
                        AYD TAXI<span style={{ color: theme.palette.primary.main }}>.</span>
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#aaa', fontWeight: 400, lineHeight: 1.6, mb: 4 }}>
                        El sistema definitivo de transporte para el Valle de Ubaté. Gestiona conductores, tarifas y viajes en tiempo real.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 3, mt: 8 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={700} color="primary">10</Typography>
                            <Typography variant="body2" color="text.secondary">Municipios</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700} color="primary">24/7</Typography>
                            <Typography variant="body2" color="text.secondary">Soporte</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700} color="primary">GPS</Typography>
                            <Typography variant="body2" color="text.secondary">Rastreo</Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>

            {/* PANEL DERECHO - FORMULARIO LOGIN */}
            <Grid item xs={12} sm={8} md={6} lg={5} sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4
            }}>
                <Paper elevation={0} sx={{
                    p: { xs: 4, md: 6 }, width: '100%', maxWidth: 480,
                    borderRadius: 4, backgroundColor: '#ffffff',
                    border: '1px solid #eaeaea',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)'
                }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            Bienvenido de nuevo
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Ingresa a tu panel de control de AYD TAXI
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Usuario</Typography>
                        <TextField
                            fullWidth
                            id="username"
                            placeholder="Ej. admin_ubate"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>,
                            }}
                            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary">Contraseña</Typography>
                            <Link to="/recuperar-password" style={{ color: theme.palette.primary.dark, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Box>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            endIcon={!isLoading && <ArrowForward />}
                            sx={{ 
                                py: 1.8, borderRadius: 2, fontSize: '1rem', fontWeight: 700,
                                textTransform: 'none', boxShadow: 'none',
                                '&:hover': { boxShadow: '0 4px 12px rgba(249, 168, 37, 0.3)' }
                            }}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Ingresar al sistema'}
                        </Button>
                        
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                ¿Nuevo en la plataforma? {' '}
                                <Link to="/registro" style={{ color: '#212121', textDecoration: 'none', fontWeight: 700 }}>
                                    Crea una cuenta
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LoginPage;