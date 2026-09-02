import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export type RolUsuario = "admin" | "user";

export interface UsuarioToken {
  id: number;
  correo: string;
  rol: RolUsuario;
}

export interface RequestConUsuario extends Request {
  usuario?: UsuarioToken;
}

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
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Token inválido. Por favor, inicie sesión nuevamente.", 401);
    }
    throw new AppError("Error de autenticación. Por favor, inicie sesión nuevamente.", 401);
  }
}

export function autorizarRoles(...rolesPermitidos: RolUsuario[]) {
  return (req: RequestConUsuario, _res: Response, next: NextFunction) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      throw new AppError("No tiene permisos para realizar esta acción", 403);
    }
    next();
  };
}