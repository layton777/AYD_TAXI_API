import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Tooltip, Alert, SelectChangeEvent
} from '@mui/material';
import {
  DirectionsCar, CheckCircle, Cancel, HourglassEmpty,
  Search, Visibility, FilterList, Refresh
} from '@mui/icons-material';
import { viajesService, Viaje } from '../services/api';

const estadoColor: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  solicitado: 'warning',
  aceptado: 'info',
  en_curso: 'info',
  completado: 'success',
  cancelado: 'error',
};

const estadoIcon: Record<string, JSX.Element> = {
  solicitado: <HourglassEmpty fontSize="small" />,
  aceptado: <DirectionsCar fontSize="small" />,
  en_curso: <DirectionsCar fontSize="small" />,
  completado: <CheckCircle fontSize="small" />,
  cancelado: <Cancel fontSize="small" />,
};

export default function ViajesPage() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [selectedViaje, setSelectedViaje] = useState<Viaje | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarViajes = async () => {
    setLoading(true);
    try {
      const res = await viajesService.getAll(filtroEstado || undefined);
      setViajes(Array.isArray(res.data) ? res.data : (res.data as any)?.results || []);
      setError('');
    } catch (err: any) {
      setError('Error al cargar viajes');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { cargarViajes(); }, [filtroEstado]);

  const viajesFiltrados = viajes.filter(v =>
    v.origen_direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.destino_direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.pasajero_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.conductor_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  };

  const formatMoneda = (valor: number | null) => {
    if (!valor) return '—';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>🚕 Gestión de Viajes</Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={cargarViajes}>Actualizar</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filtros */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth size="small" placeholder="Buscar por dirección, pasajero o conductor..."
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select value={filtroEstado} label="Estado" onChange={(e: SelectChangeEvent) => setFiltroEstado(e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="solicitado">Solicitado</MenuItem>
                <MenuItem value="aceptado">Aceptado</MenuItem>
                <MenuItem value="en_curso">En Curso</MenuItem>
                <MenuItem value="completado">Completado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              {viajesFiltrados.length} viajes encontrados
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9A825' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Pasajero</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Conductor</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Origen → Destino</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Tarifa</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Fecha</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viajesFiltrados.map((viaje) => (
              <TableRow key={viaje.id_viaje} hover>
                <TableCell>{viaje.id_viaje}</TableCell>
                <TableCell>{viaje.pasajero_nombre}</TableCell>
                <TableCell>{viaje.conductor_nombre || '—'}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {viaje.origen_direccion} → {viaje.destino_direccion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={estadoIcon[viaje.estado]}
                    label={viaje.estado_display}
                    color={estadoColor[viaje.estado]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatMoneda(viaje.tarifa_final || viaje.tarifa_estimada)}</TableCell>
                <TableCell>{formatFecha(viaje.fecha_solicitud)}</TableCell>
                <TableCell>
                  <Tooltip title="Ver detalle">
                    <IconButton size="small" onClick={() => setSelectedViaje(viaje)}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {viajesFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No se encontraron viajes</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog detalle */}
      <Dialog open={!!selectedViaje} onClose={() => setSelectedViaje(null)} maxWidth="sm" fullWidth>
        {selectedViaje && (
          <>
            <DialogTitle sx={{ bgcolor: '#F9A825', color: '#fff' }}>
              🚕 Viaje #{selectedViaje.id_viaje}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Pasajero</Typography>
                  <Typography fontWeight={600}>{selectedViaje.pasajero_nombre}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Conductor</Typography>
                  <Typography fontWeight={600}>{selectedViaje.conductor_nombre || 'Sin asignar'}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">Origen</Typography>
                  <Typography>{selectedViaje.origen_direccion}</Typography></Grid>
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">Destino</Typography>
                  <Typography>{selectedViaje.destino_direccion}</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">Distancia</Typography>
                  <Typography fontWeight={600}>{selectedViaje.distancia_km} km</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">Duración</Typography>
                  <Typography fontWeight={600}>{selectedViaje.duracion_min} min</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">Pago</Typography>
                  <Typography fontWeight={600}>{selectedViaje.metodo_pago}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Tarifa Estimada</Typography>
                  <Typography fontWeight={600}>{formatMoneda(selectedViaje.tarifa_estimada)}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2" color="text.secondary">Tarifa Final</Typography>
                  <Typography fontWeight={600}>{formatMoneda(selectedViaje.tarifa_final)}</Typography></Grid>
                <Grid item xs={12}>
                  <Chip icon={estadoIcon[selectedViaje.estado]} label={selectedViaje.estado_display}
                    color={estadoColor[selectedViaje.estado]} />
                </Grid>
                {selectedViaje.observaciones && (
                  <Grid item xs={12}><Typography variant="body2" color="text.secondary">Observaciones</Typography>
                    <Typography>{selectedViaje.observaciones}</Typography></Grid>
                )}
                {selectedViaje.motivo_cancelacion && (
                  <Grid item xs={12}><Alert severity="error">Motivo cancelación: {selectedViaje.motivo_cancelacion}</Alert></Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedViaje(null)}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
