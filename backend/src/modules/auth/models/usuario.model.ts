import { pool } from "../../../config/db";

export type RolUsuario = "admin" | "normal";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  rol: RolUsuario;
}

// Busca un usuario por su correo. Devuelve null si no existe.
export async function buscarUsuarioPorCorreo(
  correo: string
): Promise<Usuario | null> {
  const resultado = await pool.query<Usuario>(
    `SELECT id, nombre, correo, password_hash, rol
     FROM usuarios
     WHERE correo = $1`,
    [correo]
  );

  return resultado.rows[0] ?? null;
}
