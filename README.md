# PsychoWay — Diario de Emociones

Plataforma para el registro y seguimiento de emociones con roles de usuario (Aprendiz, Psicólogo, Administrador). Backend en Django REST Framework + Frontend en React con Vite.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Backend** | Python 3.13, Django 6.0, Django REST Framework |
| **Autenticación** | JWT (SimpleJWT) — access token 60min, refresh 1 día |
| **Base de datos** | MySQL |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 |
| **Librerías clave** | Axios, framer-motion, lucide-react, react-router-dom v7 |

## Arquitectura

```
diario-emociones/
├── psychoway_emotional_diary_api/   # Config Django (settings, urls raíz)
├── user_auth/                       # App de usuarios y autenticación
│   ├── models.py                    # User (AbstractBaseUser), Rol
│   ├── serializer.py                # UserSerializer con lógica de roles
│   ├── permissions.py               # UserResourcePermission
│   └── views.py                     # UserView (CRUD completo)
├── emotional_diary/                 # App del diario emocional
│   ├── models.py                    # Diary, Emotion, DiaryEntry, Objective
│   ├── serializer.py                # Serializers con emotion_detail anidado
│   ├── permissions.py               # Permisos por rol
│   └── views.py                     # CRUD con filtrado por usuario/rol
└── frontend/                        # React + Vite
    └── src/
        ├── components/              # ProtectedRoute (guard de rutas)
        ├── config/                  # roles.js (mapeo ID → nombre de rol)
        ├── context/                 # AuthContext (login, JWT, sesión)
        ├── layouts/                 # AppLayout (navbar, sidebar por rol, footer)
        ├── pages/                   # Login, Register, Diary, Gestion, GestionMod
        └── services/                # api.js (Axios con interceptors JWT)
```

## Roles del sistema

| Rol | Acceso |
|-----|--------|
| **Administrador** | CRUD de usuarios, gestión completa |
| **Psicólogo** | Visualización de diarios y seguimiento de pacientes |
| **Aprendiz** | Registro de emociones, entradas y objetivos personales |

Los roles se resuelven en el frontend mediante `src/config/roles.js`. Si los IDs no coinciden con tu base de datos, ajustalos ahí.

## Setup

### Requisitos

- Python 3.13+
- Node.js 20+
- pnpm (o npm/yarn)
- MySQL

### Backend

```bash
# Clonar y entrar
cd diario-emociones

# Entorno virtual
python -m venv .venv
.venv\Scripts\activate    # Windows

# Dependencias
pip install -r requirements.txt

# Variables de entorno — creá un .env en la raíz:
# DB_NAME=psychoway
# USER_DB=root
# PASSWORD_DB=...
# DB_HOST=localhost
# DB_PORT=3306
# JWT_KEY=tu-clave-secreta
# LOCALHOST_FRONT_V1=http://localhost:5173

# Migraciones
python manage.py migrate

# Superusuario
python manage.py createsuperuser

# Servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Dependencias
pnpm install

# Variables de entorno — creá frontend/.env:
# VITE_API_URL=http://127.0.0.1:8000

# Desarrollo
pnpm dev
# → http://localhost:5173
```

## API endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/token/` | Login (document + password) → JWT |
| POST | `/api/auth/token/refresh/` | Refrescar access token |

### Usuarios

| Método | Endpoint | Permiso | Descripción |
|--------|----------|---------|-------------|
| POST | `/api/auth/users/` | Público | Registro (público → rol Aprendiz; admin → cualquier rol) |
| GET | `/api/auth/users/` | Admin/Psicólogo | Listar todos |
| GET | `/api/auth/users/:id/` | Dueño/Admin/Psicólogo | Detalle |
| PUT/PATCH | `/api/auth/users/:id/` | Dueño/Admin | Actualizar |
| DELETE | `/api/auth/users/:id/` | Dueño/Admin | Eliminar |

### Diario emocional

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/diary/emotions/` | Listar emociones disponibles |
| GET | `/api/diary/my-diary/` | Obtener el diario del usuario |
| GET | `/api/diary/my-entries/` | Entradas del diario (filtradas por rol) |
| POST | `/api/diary/my-entries/` | Crear entrada (`emotion`, `description`, `diary`) |
| GET | `/api/diary/my-objectives/` | Objetivos del usuario |
| POST | `/api/diary/my-objectives/` | Crear objetivo |
| PUT/PATCH | `/api/diary/my-objectives/:id/` | Actualizar objetivo |
| DELETE | `/api/diary/my-objectives/:id/` | Eliminar objetivo |

## Frontend — rutas protegidas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Login | Público |
| `/registro` | Registro | Público |
| `/diario` | Diario de emociones | Autenticado |
| `/gestion` | Crear usuarios | Admin |
| `/gestion-mod` | Modificar/Eliminar usuarios | Admin |

## Commits convencionales

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
build:    Cambios en build/dependencias
chore:    Tareas de mantenimiento
docs:     Documentación
```

## Licencia

Proyecto académico — SENA, Análisis y Desarrollo de Software.
