# Control de Gastos

Proyecto base con arquitectura orientada a componentes, separado en `frontend/` (Angular) y `backend/` (Node.js + Express + TypeScript + PostgreSQL). Esta semana solo está implementado el **login con JWT**, con dos tipos de usuario: `admin` y `normal`.

## Estructura

```
control-de-gastos/
├── backend/
│   └── src/
│       ├── config/          # conexión a PostgreSQL
│       ├── middlewares/     # manejo de errores y verificación de JWT/roles
│       ├── modules/
│       │   ├── app.ts       # configuración de Express
│       │   ├── server.ts    # arranque del servidor
│       │   ├── auth/        # módulo de login (controllers, services, models, routes)
│       │   └── expenses/    # carpetas listas para la próxima semana
│       └── scripts/         # scripts para crear tablas e insertar usuarios de prueba
└── frontend/
    └── src/app/
        ├── core/             # modelos y servicios compartidos (auth, guard, interceptor)
        └── features/
            ├── login/        # pantalla de inicio de sesión
            └── inicio/       # pantalla de ejemplo después de iniciar sesión
```

## Backend

1. Entra a la carpeta:
   ```
   cd backend
   pnpm install
   ```
2. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` con tus datos de PostgreSQL:
   ```
   cp .env.example .env
   ```
3. Crea la base de datos en PostgreSQL (una vez, desde psql o pgAdmin):
   ```
   CREATE DATABASE control_de_gastos;
   ```
4. Crea las tablas:
   ```
   pnpm db:init
   ```
5. Inserta los usuarios de prueba (uno admin y uno normal):
   ```
   pnpm db:seed
   ```
6. Levanta el servidor en modo desarrollo:
   ```
   pnpm dev
   ```
   La API queda disponible en `http://localhost:3000/api`.

### Usuarios de prueba

| Correo                        | Contraseña  | Rol    |
|--------------------------------|-------------|--------|
| admin@controldegastos.com      | Admin123    | admin  |
| usuario@controldegastos.com    | Usuario123  | normal |

### Endpoint de login

```
POST /api/auth/login
Body: { "correo": "admin@controldegastos.com", "password": "Admin123" }
```

Responde con `{ ok, mensaje, data: { token, usuario } }`. El token debe enviarse en las siguientes peticiones protegidas como `Authorization: Bearer <token>`.

## Frontend

1. Entra a la carpeta:
   ```
   cd frontend
   pnpm install
   ```
2. Levanta el proyecto:
   ```
   pnpm start
   ```
3. Abre `http://localhost:4200`. La pantalla de login consume la API en `http://localhost:3000/api` (configurado en `src/environments/environment.ts`).

Al iniciar sesión correctamente, se guarda el token JWT y los datos del usuario en `localStorage`, y se redirige a `/inicio`, donde se muestra el nombre y el rol del usuario autenticado.

## Próximos pasos

- Completar el módulo `expenses` en el backend (controllers, services, models, routes) siguiendo el mismo patrón usado en `auth`.
- Agregar las pantallas de gastos en `frontend/src/app/features/`.
- Usar el middleware `autorizarRoles("admin")` en las rutas que solo debe poder usar el administrador.