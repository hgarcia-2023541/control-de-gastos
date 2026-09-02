import { pool } from "../../../config/db";

export type RolUsuario = "admin" | "user";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  rol: RolUsuario;
  activo: boolean;
  creado_en: Date;
}

// Versión del usuario sin password_hash, para devolver en respuestas
// de la API sin exponer la contraseña encriptada.
export type UsuarioPublico = Omit<Usuario, "password_hash">;

export async function buscarUsuarioPorCorreo(
  correo: string
): Promise<Usuario | null> {
  const resultado = await pool.query<Usuario>(
    `SELECT id, nombre, correo, password_hash, rol, activo, creado_en
     FROM usuarios
     WHERE correo = $1 AND activo = true`,
    [correo]
  );

  return resultado.rows[0] ?? null;
}

export async function crearUsuario(
  nombre: string,
  correo: string,
  passwordHash: string,
  rol: RolUsuario = "user"
): Promise<UsuarioPublico> {
  const resultado = await pool.query<UsuarioPublico>(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, correo, rol, activo, creado_en`,
    [nombre, correo, passwordHash, rol]
  );

  return resultado.rows[0];
}

export async function listarUsuarios(): Promise<UsuarioPublico[]> {
  const resultado = await pool.query<UsuarioPublico>(
    `SELECT id, nombre, correo, rol, activo, creado_en
     FROM usuarios
     ORDER BY creado_en DESC`
  );

  return resultado.rows;
}

export async function actualizarRolUsuario(
  id: number,
  rol: RolUsuario
): Promise<UsuarioPublico | null> {
  const resultado = await pool.query<UsuarioPublico>(
    `UPDATE usuarios
     SET rol = $1
     WHERE id = $2
     RETURNING id, nombre, correo, rol, activo, creado_en`,
    [rol, id]
  );

  return resultado.rows[0] ?? null;
}

export async function desactivarUsuario(id: number): Promise<boolean> {
  const resultado = await pool.query(
    `UPDATE usuarios SET activo = false WHERE id = $1`,
    [id]
  );

  return (resultado.rowCount ?? 0) > 0;
}
