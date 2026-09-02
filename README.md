# Control de Gastos

Aplicación web para el control de gastos e ingresos personales, con arquitectura orientada a componentes, separada en `frontend/` (Angular) y `backend/` (Node.js + Express + TypeScript + PostgreSQL).

## Estado actual

- ✅ **Login** con JWT, dos roles (`admin` / `user`).
- ✅ **Dashboard** con tarjetas, gráfico de ingresos vs. gastos y gráfico de categorías.
- ✅ **Ingresos**: CRUD completo conectado a PostgreSQL, filtros (búsqueda, fecha, categoría), gráfico de fuentes de ingreso — todo real, sin datos quemados.
- 🕓 **Gastos**: todavía con datos de demostración (próxima etapa).
- 🕓 Reportes, Categorías y Configuración: pantallas "próximamente".

## Estructura

```
control-de-gastos/
├── backend/
│   └── src/
│       ├── config/          # conexión a PostgreSQL
│       ├── middlewares/     # manejo de errores y verificación de JWT/roles
│       └── modules/
│           ├── app.ts       # configuración de Express
│           ├── server.ts    # arranque del servidor
│           ├── auth/        # login (controllers, services, models, routes)
│           ├── ingresos/    # CRUD de ingresos (mismo patrón que auth)
│           └── expenses/    # carpetas listas para la siguiente etapa (gastos)
└── frontend/
    └── src/app/
        ├── core/             # servicios compartidos (auth, dashboard, ingresos)
        ├── shared/           # sidebar, gráficos (línea/dona), modelos, utils
        └── features/
            ├── landing/      # página de bienvenida
            ├── login/        # inicio de sesión
            ├── registro/     # pantalla informativa (el alta real la hace un admin)
            ├── inicio/       # Dashboard
            ├── ingresos/     # gestión de ingresos
            └── gastos, reportes, categorias, configuracion/  # próximamente
```

## Backend

1. Entra a la carpeta e instala dependencias:
   ```
   cd backend
   pnpm install
   ```
2. Copia `.env.example` a `.env` y ajusta `DATABASE_URL` con tus datos de PostgreSQL:
   ```
   cp .env.example .env
   ```
3. Crea la base de datos en PostgreSQL (una vez, desde psql o pgAdmin):
   ```sql
   CREATE DATABASE control_de_gastos;
   ```
4. Crea/actualiza las tablas (es seguro correrlo aunque ya existan datos, usa `CREATE TABLE IF NOT EXISTS`):
   ```
   pnpm db:init
   ```
5. Inserta los usuarios de prueba:
   ```
   pnpm db:seed
   ```
6. Levanta el servidor en modo desarrollo:
   ```
   pnpm dev
   ```
   La API queda disponible en `http://localhost:3010/api`.

### Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| admin@controldegastos.com | Admin123 | admin |
| user@controldegastos.com | User123 | user |
| maria@controldegastos.com | Maria123 | user |

### Endpoints principales

```
POST   /api/auth/login          Iniciar sesión

GET    /api/ingresos            Listar ingresos del usuario autenticado
                                 (query params: busqueda, fechaInicio, fechaFin, categoria)
POST   /api/ingresos            Crear ingreso
PUT    /api/ingresos/:id        Editar ingreso
DELETE /api/ingresos/:id        Eliminar ingreso
```
Todas las rutas de `/api/ingresos` requieren el header `Authorization: Bearer <token>` y solo devuelven/afectan datos del usuario autenticado.

## Frontend

1. Entra a la carpeta e instala dependencias:
   ```
   cd frontend
   pnpm install
   ```
2. Levanta el proyecto:
   ```
   pnpm start
   ```
3. Abre `http://localhost:4200`.

## Próximos pasos

- Implementar el módulo `expenses` en el backend siguiendo el mismo patrón que `ingresos` (las carpetas ya están creadas y vacías).
- Conectar la pantalla de Gastos a datos reales, igual que se hizo con Ingresos.
- Ir completando Reportes, Categorías y Configuración.
