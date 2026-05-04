import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecuperarPasswordPage from './pages/RecuperarPasswordPage';
import SolicitarAdminPage from './pages/SolicitarAdminPage';
import DashboardPage from './pages/DashboardPage';
import ViajesPage from './pages/ViajesPage';
import VehiculosPage from './pages/VehiculosPage';
import TarifasPage from './pages/TarifasPage';
import CalificacionesPage from './pages/CalificacionesPage';
import UsuariosPage from './pages/UsuariosPage';
import ProfilePage from './pages/ProfilePage';

// Tema AYD TAXI — Amarillo, Negro, Blanco
const theme = createTheme({
  palette: {
    primary: {
      main: '#F9A825',
      dark: '#F57F17',
      light: '#FDD835',
    },
    secondary: {
      main: '#212121',
      dark: '#000000',
      light: '#484848',
    },
    info: {
      main: '#0288d1',
      dark: '#01579b',
      light: '#03a9f4',
    },
    success: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#4caf50',
    },
    warning: {
      main: '#ed6c02',
      dark: '#e65100',
      light: '#ff9800',
    },
    error: {
      main: '#d32f2f',
      dark: '#c62828',
      light: '#ef5350',
    },
    background: {
      default: '#FAFAFA',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px 0 rgb(0 0 0 / 0.08), 0 1px 4px -1px rgb(0 0 0 / 0.06)',
          borderRadius: 12,
        },
      },
    },
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Navigation />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        ml: '260px',
        width: 'calc(100% - 260px)',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {children}
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
          
          {/* Ruta raíz redirige a /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Solicitar admin */}
          <Route 
            path="/solicitar-admin" 
            element={
              <ProtectedRoute>
                <Layout>
                  <SolicitarAdminPage />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/viajes" element={
            <ProtectedRoute><Layout><ViajesPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/vehiculos" element={
            <ProtectedRoute><Layout><VehiculosPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/tarifas" element={
            <ProtectedRoute><Layout><TarifasPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/calificaciones" element={
            <ProtectedRoute><Layout><CalificacionesPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/usuarios" element={
            <ProtectedRoute><Layout><UsuariosPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/perfil" element={
            <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;