import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export type RolUsuario = "admin" | "normal";

export interface UsuarioToken {
  id: number;
  correo: string;
  rol: RolUsuario;
}

// Extendemos el tipo Request de Express para poder guardar el usuario
// autenticado dentro de req.usuario en las siguientes rutas.
export interface RequestConUsuario extends Request {
  usuario?: UsuarioToken;
}

// Verifica que la petición traiga un token JWT válido en el header
// Authorization: "Bearer <token>".
export function verificarToken(
  req: RequestConUsuario,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("No se proporcionó un token de acceso", 401);
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UsuarioToken;
    req.usuario = payload;
    next();
  } catch (error) {
    throw new AppError("Token inválido o expirado", 401);
  }
}

// Middleware adicional para restringir rutas según el rol del usuario.
// Uso: router.get("/ruta", verificarToken, autorizarRoles("admin"), controlador)
export function autorizarRoles(...rolesPermitidos: RolUsuario[]) {
  return (req: RequestConUsuario, _res: Response, next: NextFunction) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      throw new AppError("No tienes permisos para realizar esta acción", 403);
    }
    next();
  };
}
