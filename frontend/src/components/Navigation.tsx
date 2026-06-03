import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Divider, Avatar, Chip } from '@mui/material';
import { Dashboard, DirectionsCar, LocalTaxi, AttachMoney, Star, People, Person, Logout, AdminPanelSettings, ChatBubble } from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Viajes', icon: <LocalTaxi />, path: '/viajes' },
  { text: 'Vehículos', icon: <DirectionsCar />, path: '/vehiculos' },
  { text: 'Tarifas', icon: <AttachMoney />, path: '/tarifas' },
  { text: 'Calificaciones', icon: <Star />, path: '/calificaciones' },
  { text: 'Usuarios', icon: <People />, path: '/usuarios' },
  { text: 'Mi Perfil', icon: <Person />, path: '/perfil' },
  { text: 'Asistente IA', icon: <ChatBubble />, path: '/chatbot' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Admin';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #212121 0%, #1a1a1a 100%)',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2.5, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#F9A825', letterSpacing: 1 }}>
          🚕 AYD TAXI
        </Typography>
        <Typography variant="caption" sx={{ color: '#aaa' }}>
          Panel de Administración
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: '#333' }} />

      {/* User info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#F9A825', color: '#212121', width: 36, height: 36, fontWeight: 700 }}>
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>{username}</Typography>
          <Chip label="Admin" size="small" sx={{ bgcolor: '#F9A825', color: '#212121', height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#333' }} />

      {/* Menu */}
      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  bgcolor: isActive ? '#F9A82520' : 'transparent',
                  borderLeft: isActive ? '3px solid #F9A825' : '3px solid transparent',
                  '&:hover': { bgcolor: '#F9A82515' },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#F9A825' : '#888', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#F9A825' : '#ccc',
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#333' }} />

      {/* Solicitar admin */}
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/solicitar-admin')} sx={{ borderRadius: 2, mx: 0.5, '&:hover': { bgcolor: '#F9A82515' } }}>
            <ListItemIcon sx={{ color: '#888', minWidth: 40 }}><AdminPanelSettings /></ListItemIcon>
            <ListItemText primary="Solicitar Admin" primaryTypographyProps={{ color: '#ccc', fontSize: '0.85rem' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, mx: 0.5, '&:hover': { bgcolor: '#ef535020' } }}>
            <ListItemIcon sx={{ color: '#ef5350', minWidth: 40 }}><Logout /></ListItemIcon>
            <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ color: '#ef5350', fontSize: '0.85rem' }} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Footer */}
      <Box sx={{ p: 1.5, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#555' }}>
          Valle de Ubaté © 2026
        </Typography>
      </Box>
    </Drawer>
  );
}