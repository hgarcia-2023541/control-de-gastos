-- Tabla de usuarios del sistema.
-- El campo "rol" solo acepta dos valores: admin y user (por defecto user)
CREATE TABLE IF NOT EXISTS usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(150) NOT NULL,
  correo         VARCHAR(150) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  rol            VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
  creado_en      TIMESTAMP NOT NULL DEFAULT now(),
  activo         BOOLEAN NOT NULL DEFAULT true
);

-- Índice para búsquedas rápidas por correo
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);

-- Tabla de ingresos. Cada ingreso pertenece a un único usuario
-- (usuario_id); el backend siempre filtra/asocia por el usuario
-- autenticado (req.usuario.id), nunca por un id que mande el frontend.
CREATE TABLE IF NOT EXISTS ingresos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  descripcion VARCHAR(200) NOT NULL,
  fuente      VARCHAR(100) NOT NULL,
  categoria   VARCHAR(100) NOT NULL,
  monto       NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  fecha       DATE NOT NULL,
  creado_en   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingresos_usuario ON ingresos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON ingresos(fecha);