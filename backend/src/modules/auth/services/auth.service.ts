import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../../middlewares/errorHandler";
import { buscarUsuarioPorCorreo } from "../models/usuario.model";

interface ResultadoLogin {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: "admin" | "normal";
  };
}

export async function autenticarUsuario(
  correo: string,
  password: string
): Promise<ResultadoLogin> {
  const usuario = await buscarUsuarioPorCorreo(correo);

  // Por seguridad usamos el mismo mensaje sin importar si falló el
  // correo o la contraseña, para no revelar cuál de los dos es incorrecto.
  if (!usuario) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const passwordValida = bcrypt.compareSync(password, usuario.password_hash);
  if (!passwordValida) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" } as jwt.SignOptions
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    },
  };
}
