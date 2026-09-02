import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../../middlewares/errorHandler";
import {
  buscarUsuarioPorCorreo,
  crearUsuario,
  RolUsuario,
  UsuarioPublico,
} from "../models/usuario.model";

interface ResultadoLogin {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: RolUsuario;
  };
}

export async function autenticarUsuario(
  correo: string,
  password: string
): Promise<ResultadoLogin> {
  const usuario = await buscarUsuarioPorCorreo(correo);

  if (!usuario) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const passwordValida = bcrypt.compareSync(password, usuario.password_hash);
  if (!passwordValida) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  if (!usuario.activo) {
    throw new AppError("Usuario desactivado. Contacta al administrador.", 403);
  }

  const token = jwt.sign(
    { 
      id: usuario.id, 
      correo: usuario.correo, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2m" } as jwt.SignOptions
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

// Solo admin puede crear usuarios
export async function registrarUsuarioAdmin(
  nombre: string,
  correo: string,
  password: string,
  rol: RolUsuario = "user"
): Promise<UsuarioPublico> {
  // Verificar si el correo ya existe
  const existe = await buscarUsuarioPorCorreo(correo);
  if (existe) {
    throw new AppError("El correo ya está registrado", 400);
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  return await crearUsuario(nombre, correo, passwordHash, rol);
}