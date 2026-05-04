import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Alert, 
    Chip,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    AdminPanelSettings as AdminIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import authService from '../services/authService';

interface Usuario {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telefono?: string;
    direccion?: string;
    rol: 'admin' | 'viewer';
    fecha_creacion: string;
    is_active: boolean;
}

const UsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [esAdmin, setEsAdmin] = useState(false);
    
    // Estados para el diálogo de edición
    const [openDialog, setOpenDialog] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        telefono: '',
        direccion: '',
        rol: 'viewer' as 'admin' | 'viewer'
    });

    // Estado para confirmación de eliminación
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

    useEffect(() => {
        verificarPermisos();
        cargarUsuarios();
    }, []);

    const verificarPermisos = async () => {
        try {
            const perfil = await authService.obtenerPerfil();
            const esAdministrador = perfil.rol === 'admin' || perfil.is_superuser;
            setEsAdmin(esAdministrador);
            if (!esAdministrador) {
                setError('No tienes permisos para acceder a esta página');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            setError('Error al verificar permisos');
            setLoading(false);
        }
    };

    const cargarUsuarios = async () => {
        try {
            const data = await authService.obtenerUsuarios();
            // Validar que data sea un array
            if (Array.isArray(data)) {
                setUsuarios(data);
            } else {
                console.warn('Los datos recibidos no son un array:', data);
                setUsuarios([]);
                setError('Error en el formato de datos recibidos del servidor');
            }
        } catch (error: any) {
            console.error('Error al cargar usuarios:', error);
            setError(error.detail || error.message || 'Error al cargar usuarios');
            setUsuarios([]); // Asegurar que usuarios sea un array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    const handleEditarUsuario = (usuario: Usuario) => {
        setUsuarioEditando(usuario);
        setFormData({
            username: usuario.username,
            email: usuario.email,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            telefono: usuario.telefono || '',
            direccion: usuario.direccion || '',
            rol: usuario.rol
        });
        setOpenDialog(true);
    };

    const handleGuardarUsuario = async () => {
        if (!usuarioEditando) return;

        try {
            await authService.actualizarUsuario(usuarioEditando.id, formData);
            setSuccess('Usuario actualizado exitosamente');
            setOpenDialog(false);
            cargarUsuarios();
        } catch (error: any) {
            setError(error.detail || 'Error al actualizar usuario');
        }
    };

    const handleEliminarUsuario = (usuario: Usuario) => {
        setUsuarioAEliminar(usuario);
        setOpenDeleteDialog(true);
    };

    const confirmarEliminacion = async () => {
        if (!usuarioAEliminar) return;

        try {
            await authService.eliminarUsuario(usuarioAEliminar.id);
            setSuccess('Usuario eliminado exitosamente');
            setOpenDeleteDialog(false);
            cargarUsuarios();
        } catch (error: any) {
            setError(error.detail || 'Error al eliminar usuario');
        }
    };

    const getRolChip = (rol: string) => {
        return (
            <Chip
                icon={rol === 'admin' ? <AdminIcon /> : <ViewIcon />}
                label={rol === 'admin' ? 'Administrador' : 'Visualizador'}
                color={rol === 'admin' ? 'primary' : 'default'}
                size="small"
            />
        );
    };

    // Mostrar loading mientras se cargan los datos
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    // Mostrar error de permisos si no es admin
    if (!esAdmin) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">
                    No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Gestión de Usuarios
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Administra los usuarios del sistema
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {usuarios.length === 0 && !error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No hay usuarios para mostrar
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Nombre Completo</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Fecha Registro</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((usuario) => (
                            <TableRow key={usuario.id}>
                                <TableCell>{usuario.username}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>
                                    {`${usuario.first_name} ${usuario.last_name}`.trim() || '-'}
                                </TableCell>
                                <TableCell>{getRolChip(usuario.rol)}</TableCell>
                                <TableCell>
                                    {new Date(usuario.fecha_creacion).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Editar usuario">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditarUsuario(usuario)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar usuario">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleEliminarUsuario(usuario)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            )}

            {/* Diálogo de edición */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Nombre de usuario"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Nombre"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Apellido"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Teléfono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Dirección"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            multiline
                            rows={2}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Rol</InputLabel>
                            <Select
                                value={formData.rol}
                                label="Rol"
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'viewer' })}
                            >
                                <MenuItem value="viewer">Visualizador</MenuItem>
                                <MenuItem value="admin">Administrador</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleGuardarUsuario} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar al usuario <strong>{usuarioAEliminar?.username}</strong>?
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button onClick={confirmarEliminacion} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UsuariosPage;
