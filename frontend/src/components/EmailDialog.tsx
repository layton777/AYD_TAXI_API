import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import {
    Email as EmailIcon,
    Person as PersonIcon,
    Subject as SubjectIcon,
    Message as MessageIcon,
    Add as AddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

interface EmailDialogProps {
    open: boolean;
    onClose: () => void;
    onSend: (emailData: EmailData) => Promise<void>;
    reportType: string;
    reportData: any;
}

interface EmailData {
    destinatarios: string[];
    asunto: string;
    mensaje: string;
    incluirPDF: boolean;
    incluirExcel: boolean;
}

const EmailDialog: React.FC<EmailDialogProps> = ({
    open,
    onClose,
    onSend,
    reportType,
    reportData
}) => {
    const [emailData, setEmailData] = useState<EmailData>({
        destinatarios: [],
        asunto: `Reporte ${reportType} - ${new Date().toLocaleDateString()}`,
        mensaje: `Estimado/a,\n\nAdjunto encontrará el reporte ${reportType} generado el ${new Date().toLocaleDateString()}.\n\nSaludos cordiales,\nSistema ASPERSAX`,
        incluirPDF: true,
        incluirExcel: false,
    });
    
    const [nuevoEmail, setNuevoEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emailsComunes = [
        'admin@aspersax.com',
        'gerencia@aspersax.com',
        'operaciones@aspersax.com',
        'reportes@aspersax.com'
    ];

    const handleAddEmail = () => {
        const emailTrimmed = nuevoEmail.trim();
        if (emailTrimmed && isValidEmail(emailTrimmed)) {
            if (!emailData.destinatarios.includes(emailTrimmed)) {
                setEmailData({
                    ...emailData,
                    destinatarios: [...emailData.destinatarios, emailTrimmed]
                });
                setNuevoEmail('');
                setError('');
            } else {
                setError('Este email ya está en la lista');
            }
        } else {
            setError('Ingrese un email válido (ejemplo: usuario@dominio.com)');
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setEmailData({
            ...emailData,
            destinatarios: emailData.destinatarios.filter(email => email !== emailToRemove)
        });
    };

    const handleQuickAddEmail = (email: string) => {
        if (!emailData.destinatarios.includes(email)) {
            setEmailData({
                ...emailData,
                destinatarios: [...emailData.destinatarios, email]
            });
        }
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    };

    const handleSend = async () => {
        if (emailData.destinatarios.length === 0) {
            setError('Debe agregar al menos un destinatario');
            return;
        }

        if (!emailData.asunto.trim()) {
            setError('El asunto es requerido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSend(emailData);
            onClose();
            // Reset form
            setEmailData({
                destinatarios: [],
                asunto: `Reporte ${reportType} - ${new Date().toLocaleDateString()}`,
                mensaje: `Estimado/a,\n\nAdjunto encontrará el reporte ${reportType} generado el ${new Date().toLocaleDateString()}.\n\nSaludos cordiales,\nSistema ASPERSAX`,
                incluirPDF: true,
                incluirExcel: false,
            });
        } catch (err: any) {
            setError(err.message || 'Error al enviar el email');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && nuevoEmail) {
            e.preventDefault();
            handleAddEmail();
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }
            }}
        >
            <DialogTitle sx={{ 
                pb: 2, 
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <EmailIcon color="primary" />
                <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
                    Enviar Reporte por Email
                </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Destinatarios */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Destinatarios
                    </Typography>
                    
                    {/* Emails comunes */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                            Emails frecuentes:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {emailsComunes.map((email) => (
                                <Chip
                                    key={email}
                                    label={email}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleQuickAddEmail(email)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'white'
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Input para nuevo email */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Agregar email"
                            value={nuevoEmail}
                            onChange={(e) => setNuevoEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: 'action.active' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddEmail}
                            sx={{ 
                                minWidth: 'auto',
                                px: 2,
                                borderRadius: 2
                            }}
                        >
                            <AddIcon />
                        </Button>
                    </Box>

                    {/* Lista de destinatarios */}
                    {emailData.destinatarios.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {emailData.destinatarios.map((email) => (
                                <Chip
                                    key={email}
                                    label={email}
                                    onDelete={() => handleRemoveEmail(email)}
                                    color="primary"
                                    deleteIcon={<CloseIcon />}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* Asunto */}
                <TextField
                    fullWidth
                    label="Asunto"
                    value={emailData.asunto}
                    onChange={(e) => setEmailData({ ...emailData, asunto: e.target.value })}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SubjectIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Mensaje */}
                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Mensaje"
                    value={emailData.mensaje}
                    onChange={(e) => setEmailData({ ...emailData, mensaje: e.target.value })}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                <MessageIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Opciones de adjuntos */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Adjuntos
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Incluir PDF</InputLabel>
                            <Select
                                value={emailData.incluirPDF ? 'true' : 'false'}
                                onChange={(e) => setEmailData({ ...emailData, incluirPDF: e.target.value === 'true' })}
                                label="Incluir PDF"
                            >
                                <MenuItem value="true">Sí</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Incluir Excel</InputLabel>
                            <Select
                                value={emailData.incluirExcel ? 'true' : 'false'}
                                onChange={(e) => setEmailData({ ...emailData, incluirExcel: e.target.value === 'true' })}
                                label="Incluir Excel"
                            >
                                <MenuItem value="true">Sí</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {/* Información del reporte */}
                <Box sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.50', 
                    borderRadius: 2,
                    border: '1px solid #e5e7eb'
                }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                        Información del reporte:
                    </Typography>
                    <Typography variant="body2">
                        <strong>Tipo:</strong> {reportType}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Fecha de generación:</strong> {new Date().toLocaleString()}
                    </Typography>
                    {reportData && (
                        <Typography variant="body2">
                            <strong>Registros incluidos:</strong> {
                                reportData.productividad ? reportData.productividad.length : 0
                            } elementos
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
                <Button 
                    onClick={onClose} 
                    disabled={loading}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSend} 
                    variant="contained" 
                    disabled={loading || emailData.destinatarios.length === 0}
                    startIcon={loading ? <CircularProgress size={20} /> : <EmailIcon />}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2e7d32 0%, #1a9f0b 100%)',
                        }
                    }}
                >
                    {loading ? 'Enviando...' : 'Enviar Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailDialog;
