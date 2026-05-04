import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Alert } from '@mui/material';
import { DirectionsCar, People, AttachMoney, Star, LocalTaxi, CheckCircle, HourglassEmpty, Cancel, TrendingUp, Speed } from '@mui/icons-material';
import { dashboardService, DashboardStats } from '../services/api';

const StatCard = ({ title, value, icon, color, subtitle }: { title: string; value: string | number; icon: JSX.Element; color: string; subtitle?: string }) => (
  <Card sx={{ height: '100%', borderLeft: `4px solid ${color}`, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" fontWeight={700}>{value}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{ bgcolor: `${color}20`, borderRadius: 2, p: 1, display: 'flex' }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await dashboardService.getStats();
        setStats(res.data);
      } catch { setError('Error al cargar estadísticas'); }
    };
    cargar();
  }, []);

  const formatCOP = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);

  if (!stats) return <Box p={3}><Typography>Cargando dashboard...</Typography></Box>;

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>📊 Dashboard AYD TAXI</Typography>
        <Typography variant="body2" color="text.secondary">Panel de administración — Valle de Ubaté, Cundinamarca</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats principales */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Viajes" value={stats.total_viajes} icon={<LocalTaxi sx={{ color: '#F9A825' }} />} color="#F9A825" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Viajes Completados" value={stats.viajes_completados} icon={<CheckCircle sx={{ color: '#4caf50' }} />} color="#4caf50" subtitle={`${stats.viajes_en_curso} en curso`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Ingresos Totales" value={formatCOP(stats.ingresos_totales)} icon={<AttachMoney sx={{ color: '#2196f3' }} />} color="#2196f3" subtitle={`Promedio: ${formatCOP(stats.tarifa_promedio)}`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Calificación Promedio" value={stats.calificacion_promedio.toFixed(1)} icon={<Star sx={{ color: '#ff9800' }} />} color="#ff9800" subtitle="de 5.0 estrellas" />
        </Grid>
      </Grid>

      {/* Stats secundarias */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pasajeros" value={stats.total_pasajeros} icon={<People sx={{ color: '#9c27b0' }} />} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Conductores" value={stats.total_conductores} icon={<DirectionsCar sx={{ color: '#00897b' }} />} color="#00897b" subtitle={`${stats.conductores_disponibles} disponibles`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Vehículos" value={stats.total_vehiculos} icon={<DirectionsCar sx={{ color: '#5c6bc0' }} />} color="#5c6bc0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Distancia Total" value={`${stats.distancia_total_km.toFixed(0)} km`} icon={<Speed sx={{ color: '#ef5350' }} />} color="#ef5350" />
        </Grid>
      </Grid>

      {/* Estado de viajes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Estado de Viajes</Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip icon={<HourglassEmpty />} label="Pendientes" color="warning" size="small" />
                  <Typography fontWeight={700}>{stats.viajes_pendientes}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip icon={<DirectionsCar />} label="En Curso" color="info" size="small" />
                  <Typography fontWeight={700}>{stats.viajes_en_curso}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip icon={<CheckCircle />} label="Completados" color="success" size="small" />
                  <Typography fontWeight={700}>{stats.viajes_completados}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip icon={<Cancel />} label="Cancelados" color="error" size="small" />
                  <Typography fontWeight={700}>{stats.viajes_cancelados}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>📍 Valle de Ubaté</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                AYD TAXI opera en los municipios del Valle de Ubaté: Ubaté, Cucunubá, Sutatausa, Tausa, Fúquene, Susa, Simijaca, Carmen de Carupa, Guachetá y Lenguazaque.
              </Typography>
              <Grid container spacing={1}>
                {['Ubaté', 'Cucunubá', 'Sutatausa', 'Tausa', 'Fúquene', 'Susa', 'Simijaca', 'Carmen de Carupa', 'Guachetá', 'Lenguazaque'].map(zona => (
                  <Grid item key={zona}><Chip label={zona} variant="outlined" size="small" /></Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}