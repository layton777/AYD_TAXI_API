import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Chip, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Refresh, AttachMoney } from '@mui/icons-material';
import { tarifasService, Tarifa } from '../services/api';

export default function TarifasPage() {
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  const [zonas, setZonas] = useState<string[]>([]);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const [tarifasRes, zonasRes] = await Promise.all([tarifasService.getAll(), tarifasService.getZonas()]);
      setTarifas(Array.isArray(tarifasRes.data) ? tarifasRes.data : (tarifasRes.data as any)?.results || []);
      setZonas(zonasRes.data.zonas || []);
    } catch { setError('Error al cargar tarifas'); }
  };

  useEffect(() => { cargar(); }, []);

  const formatCOP = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>💰 Tarifas por Zona</Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={cargar}>Actualizar</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Alert severity="info" sx={{ mb: 2 }}>Tarifas para el Valle de Ubaté. Zonas: {zonas.join(', ')}</Alert>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9A825' }}>
              {['Origen', 'Destino', 'Base', '$/Km', 'Nocturno', 'Festivo'].map(h => (
                <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tarifas.map((t) => (
              <TableRow key={t.id_tarifa} hover>
                <TableCell><Chip label={t.zona_origen} color="primary" size="small" /></TableCell>
                <TableCell><Chip label={t.zona_destino} size="small" /></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCOP(t.precio_base)}</TableCell>
                <TableCell>{formatCOP(t.precio_por_km)}</TableCell>
                <TableCell>{t.recargo_nocturno}%</TableCell>
                <TableCell>{t.recargo_festivo}%</TableCell>
              </TableRow>
            ))}
            {tarifas.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No hay tarifas configuradas</Typography>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
