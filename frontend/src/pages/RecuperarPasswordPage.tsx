import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Alert,
    InputAdornment, Grid, useTheme
} from '@mui/material';
import {
    Person, LocalTaxi, ArrowBack
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const RecuperarPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [username, setUsername] = useState('');
    const [step, setStep] = useState(1);
    const [codigo, setCodigo] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSolicitar = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setIsLoading(true);
        try {
            await authService.solicitarRecuperacion(username);
            setSuccess('Se ha enviado un código de recuperación a tu correo electrónico.');
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al solicitar recuperación. Verifica el usuario.');
        } finally { setIsLoading(false); }
    };

    const handleRestablecer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess(''); setIsLoading(true);
        try {
            await authService.restablecerPassword({ username, codigo, new_password: newPassword });
            setSuccess('Contraseña actualizada correctamente. Redirigiendo...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Código inválido o error al restablecer.');
        } finally { setIsLoading(false); }
    };

    return (
        <Grid container sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
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
                        Recuperación segura<span style={{ color: theme.palette.primary.main }}>.</span>
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#aaa', fontWeight: 400, lineHeight: 1.6 }}>
                        Protegemos tu cuenta de AYD TAXI. Sigue los pasos para restablecer tu acceso rápidamente.
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12} sm={8} md={6} lg={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, width: '100%', maxWidth: 480, borderRadius: 4, backgroundColor: '#ffffff', border: '1px solid #eaeaea', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
                    <Button startIcon={<ArrowBack />} onClick={() => navigate('/login')} sx={{ mb: 4, color: 'text.secondary', textTransform: 'none' }}>Volver al login</Button>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>Restablecer clave</Typography>
                        <Typography variant="body1" color="text.secondary">Ingresa tu usuario para recibir las instrucciones</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

                    {step === 1 ? (
                        <Box component="form" onSubmit={handleSolicitar}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Usuario</Typography>
                            <TextField fullWidth placeholder="Tu nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }} sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                            <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.8, borderRadius: 2, fontSize: '1rem', fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}>{isLoading ? 'Enviando...' : 'Enviar Código'}</Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleRestablecer}>
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Código de verificación</Typography>
                            <TextField fullWidth placeholder="Ingresa el código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                            <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Nueva contraseña</Typography>
                            <TextField fullWidth type="password" placeholder="Tu nueva clave segura" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f9fafb' } }} />
                            <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.8, borderRadius: 2, fontSize: '1rem', fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}>{isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}</Button>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default RecuperarPasswordPage;
