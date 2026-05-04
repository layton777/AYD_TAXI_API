# AYD TAXI API

Sistema de transporte de taxis para la provincia del Valle de Ubaté, Cundinamarca. Aplicativo móvil en tiempo real que facilita el transporte de ciudadanos en taxi.

## ¿Qué es AYD TAXI?

AYD TAXI es una plataforma que permite conectar pasajeros con conductores de taxi en tiempo real en la provincia del Valle de Ubaté. El sistema incluye:

- 🚕 Solicitud de viajes en tiempo real
- 📍 Seguimiento GPS del recorrido
- 💰 Tarifas configurables por zona (Ubaté, Cucunubá, Sutatausa, etc.)
- ⭐ Sistema de calificaciones bidireccional
- 🚗 Registro y gestión de vehículos
- 📊 Dashboard administrativo con estadísticas
- 👤 Roles: Pasajero, Conductor, Administrador

## Tecnologías

**Backend (API REST):**
- Python con Django y Django REST Framework
- PostgreSQL como base de datos
- Autenticación con JWT (SimpleJWT)

**Frontend Web (Panel Admin):**
- React con TypeScript
- Material UI para los componentes
- Vite como bundler
- Axios para las peticiones HTTP

**Frontend Móvil:**
- Flutter (Dart) — Proyecto separado en `AYD_TAXI/`

## Requisitos

- Python 3.8 o superior
- Node.js 18 o superior
- PostgreSQL
- Git

## Instalación

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # En Windows

pip install -r requirements.txt
```

Crear el archivo `.env` en la carpeta `backend/`:

```
SECRET_KEY=tu_clave_secreta
DEBUG=True
DB_NAME=AYD_DB
DB_USER=postgres
DB_PASSWORD=2026
DB_HOST=localhost
DB_PORT=5432
```

Ejecutar migraciones:

```bash
python manage.py makemigrations authentication vehiculos viajes tarifas calificaciones dashboard
python manage.py migrate
python manage.py createsuperuser
```

### 2. Frontend

```bash
cd frontend
npm install
```

## Cómo ejecutar

**Terminal 1 — Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

El panel admin corre en `http://localhost:3000` y la API en `http://localhost:8000`.

## Estructura del proyecto

```
Aspersax_api-main/
├── backend/
│   ├── aspersax_api/        # Configuración de Django
│   ├── authentication/      # Login, registro, JWT, roles
│   ├── vehiculos/           # CRUD de vehículos
│   ├── viajes/              # Solicitud y gestión de viajes
│   ├── tarifas/             # Tarifas por zona
│   ├── calificaciones/      # Rating de usuarios
│   └── dashboard/           # Estadísticas
├── frontend/
│   └── src/
│       ├── components/      # Componentes reutilizables
│       ├── pages/           # Páginas del panel admin
│       └── services/        # Llamadas a la API
└── README.md
```

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/token/` | Obtener token JWT |
| POST | `/api/token/refresh/` | Refrescar token |
| POST | `/api/auth/registro/` | Registrar usuario |
| GET | `/api/auth/perfil/` | Ver/editar perfil |
| GET | `/api/auth/conductores/disponibles/` | Conductores disponibles |
| POST | `/api/auth/conductor/ubicacion/` | Actualizar GPS conductor |
| GET | `/api/vehiculos/` | Listar vehículos |
| POST | `/api/vehiculos/` | Registrar vehículo |
| GET | `/api/viajes/` | Listar viajes |
| POST | `/api/viajes/solicitar/` | Solicitar viaje |
| POST | `/api/viajes/{id}/aceptar/` | Aceptar viaje |
| POST | `/api/viajes/{id}/iniciar/` | Iniciar viaje |
| POST | `/api/viajes/{id}/completar/` | Completar viaje |
| POST | `/api/viajes/{id}/cancelar/` | Cancelar viaje |
| GET | `/api/tarifas/` | Listar tarifas |
| POST | `/api/tarifas/calcular/` | Calcular tarifa |
| POST | `/api/calificaciones/crear/` | Crear calificación |
| GET | `/api/dashboard/stats/` | Estadísticas |

## Zonas de Operación

Ubaté • Cucunubá • Sutatausa • Tausa • Fúquene • Susa • Simijaca • Carmen de Carupa • Guachetá • Lenguazaque

## Autores

Proyecto AYD TAXII — Desarrollo de un aplicativo móvil en tiempo real que facilite el transporte de ciudadanos en taxi en la provincia del Valle de Ubaté.
