import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Chip, Button, Rating } from '@mui/material';
import { Star, Refresh } from '@mui/icons-material';
import { calificacionesService, Calificacion } from '../services/api';

export default function CalificacionesPage() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const res = await calificacionesService.getAll();
      setCalificaciones(Array.isArray(res.data) ? res.data : (res.data as any)?.results || []);
    } catch { setError('Error al cargar calificaciones'); }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>⭐ Calificaciones</Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={cargar}>Actualizar</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9A825' }}>
              {['Viaje', 'De', 'Para', 'Puntuación', 'Comentario', 'Fecha'].map(h => (
                <TableCell key={h} sx={{ color: '#fff', fontWeight: 700 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {calificaciones.map((c) => (
              <TableRow key={c.id_calificacion} hover>
                <TableCell>#{c.viaje}</TableCell>
                <TableCell>{c.calificador_nombre}</TableCell>
                <TableCell>{c.calificado_nombre}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Rating value={c.puntuacion} readOnly size="small" />
                    <Typography variant="body2" fontWeight={600}>({c.puntuacion})</Typography>
                  </Box>
                </TableCell>
                <TableCell>{c.comentario || '—'}</TableCell>
                <TableCell>{new Date(c.fecha).toLocaleDateString('es-CO')}</TableCell>
              </TableRow>
            ))}
            {calificaciones.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">No hay calificaciones</Typography>
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
