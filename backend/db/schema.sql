-- Tabla de usuarios del sistema.
-- El campo "rol" solo acepta dos valores: admin y normal.
CREATE TABLE IF NOT EXISTS usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(150) NOT NULL,
  correo         VARCHAR(150) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  rol            VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'normal')),
  creado_en      TIMESTAMP NOT NULL DEFAULT now()
);
