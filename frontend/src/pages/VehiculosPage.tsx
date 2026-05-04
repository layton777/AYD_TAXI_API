import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Tooltip, Alert, Chip, Fab
} from '@mui/material';
import { Add, Edit, Delete, DirectionsCar, Refresh } from '@mui/icons-material';
import { vehiculosService, Vehiculo } from '../services/api';

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editVehiculo, setEditVehiculo] = useState<Vehiculo | null>(null);
  const [form, setForm] = useState({ placa: '', marca: '', modelo: '', color: '', anio: new Date().getFullYear(), tipo: 'sedan' as string });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await vehiculosService.getAll();
      setVehiculos(Array.isArray(res.data) ? res.data : (res.data as any)?.results || []);
      setError('');
    } catch { setError('Error al cargar vehículos'); }
    setLoading(false);
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async () => {
    try {
      if (editVehiculo) {
        await vehiculosService.update(editVehiculo.id_vehiculo, form);
      } else {
        await vehiculosService.create(form);
      }
      setOpenForm(false);
      setEditVehiculo(null);
      setForm({ placa: '', marca: '', modelo: '', color: '', anio: new Date().getFullYear(), tipo: 'sedan' });
      cargar();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar vehículo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este vehículo?')) return;
    try {
      await vehiculosService.delete(id);
      cargar();
    } catch { setError('Error al eliminar vehículo'); }
  };

  const handleEdit = (v: Vehiculo) => {
    setEditVehiculo(v);
    setForm({ placa: v.placa, marca: v.marca, modelo: v.modelo, color: v.color, anio: v.anio, tipo: v.tipo });
    setOpenForm(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>🚗 Vehículos Registrados</Typography>
        <Box>
          <Button startIcon={<Refresh />} variant="outlined" onClick={cargar} sx={{ mr: 1 }}>Actualizar</Button>
          <Button startIcon={<Add />} variant="contained" onClick={() => { setEditVehiculo(null); setForm({ placa: '', marca: '', modelo: '', color: '', anio: new Date().getFullYear(), tipo: 'sedan' }); setOpenForm(true); }}>
            Nuevo Vehículo
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9A825' }}>
              {['Placa', 'Marca', 'Modelo', 'Color', 'Año', 'Tipo', 'Conductor', 'Acciones'].map(h => (
                <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((v) => (
              <TableRow key={v.id_vehiculo} hover>
                <TableCell><Chip icon={<DirectionsCar />} label={v.placa} color="primary" variant="outlined" size="small" /></TableCell>
                <TableCell>{v.marca}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: v.color.toLowerCase(), border: '1px solid #ccc' }} />
                    {v.color}
                  </Box>
                </TableCell>
                <TableCell>{v.anio}</TableCell>
                <TableCell><Chip label={v.tipo} size="small" /></TableCell>
                <TableCell>{v.conductor_nombre}</TableCell>
                <TableCell>
                  <Tooltip title="Editar"><IconButton size="small" onClick={() => handleEdit(v)}><Edit /></IconButton></Tooltip>
                  <Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={() => handleDelete(v.id_vehiculo)}><Delete /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {vehiculos.length === 0 && (
              <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No hay vehículos registrados</Typography>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#F9A825', color: '#fff' }}>
          {editVehiculo ? '✏️ Editar Vehículo' : '🚗 Nuevo Vehículo'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={6}><TextField fullWidth label="Placa" value={form.placa} onChange={e => setForm({...form, placa: e.target.value})} placeholder="ABC-123" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Marca" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} placeholder="Kia" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Modelo" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} placeholder="Picanto" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="Amarillo" /></Grid>
            <Grid item xs={6}><TextField fullWidth type="number" label="Año" value={form.anio} onChange={e => setForm({...form, anio: parseInt(e.target.value)})} /></Grid>
            <Grid item xs={6}>
              <TextField fullWidth select label="Tipo" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="sedan">Sedán</option>
                <option value="camioneta">Camioneta</option>
                <option value="van">Van</option>
                <option value="suv">SUV</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>{editVehiculo ? 'Guardar Cambios' : 'Registrar'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
