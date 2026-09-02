import { Request, Response } from "express";
import { z } from "zod";
import { catchAsync } from "../../../middlewares/errorHandler";
import { 
  autenticarUsuario, 
  registrarUsuarioAdmin 
} from "../services/auth.service";
import { RequestConUsuario } from "../../../middlewares/auth.middleware";
import { listarUsuarios, actualizarRolUsuario, desactivarUsuario } from "../models/usuario.model";

const loginSchema = z.object({
  correo: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const registroSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  correo: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: z.enum(["admin", "user"]).default("user"),
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const datos = loginSchema.parse(req.body);

  const resultado = await autenticarUsuario(datos.correo, datos.password);

  res.json({
    ok: true,
    mensaje: "Inicio de sesión exitoso",
    data: resultado,
  });
});

// Solo admin puede registrar nuevos usuarios
export const registrar = catchAsync(async (req: RequestConUsuario, res: Response) => {
  // Verificar que sea admin
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos para realizar esta acción",
    });
  }

  const datos = registroSchema.parse(req.body);

  const nuevoUsuario = await registrarUsuarioAdmin(
    datos.nombre,
    datos.correo,
    datos.password,
    datos.rol
  );

  res.json({
    ok: true,
    mensaje: "Usuario registrado exitosamente",
    data: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol,
    },
  });
});

// Listar usuarios (solo admin)
export const listar = catchAsync(async (req: RequestConUsuario, res: Response) => {
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos para realizar esta acción",
    });
  }

  const usuarios = await listarUsuarios();

  res.json({
    ok: true,
    data: usuarios,
  });
});

// Actualizar rol (solo admin)
export const actualizarRol = catchAsync(async (req: RequestConUsuario, res: Response) => {
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos para realizar esta acción",
    });
  }

  const { id } = req.params;
  const { rol } = z.object({ rol: z.enum(["admin", "user"]) }).parse(req.body);

  const usuarioActualizado = await actualizarRolUsuario(parseInt(id), rol);

  if (!usuarioActualizado) {
    return res.status(404).json({
      ok: false,
      mensaje: "Usuario no encontrado",
    });
  }

  res.json({
    ok: true,
    mensaje: "Rol actualizado exitosamente",
    data: usuarioActualizado,
  });
});

// Desactivar usuario (solo admin)
export const desactivar = catchAsync(async (req: RequestConUsuario, res: Response) => {
  if (!req.usuario || req.usuario.rol !== "admin") {
    return res.status(403).json({
      ok: false,
      mensaje: "No tienes permisos para realizar esta acción",
    });
  }

  const { id } = req.params;

  // No permitir desactivarse a sí mismo
  if (parseInt(id) === req.usuario.id) {
    return res.status(400).json({
      ok: false,
      mensaje: "No puedes desactivar tu propia cuenta",
    });
  }

  const desactivado = await desactivarUsuario(parseInt(id));

  if (!desactivado) {
    return res.status(404).json({
      ok: false,
      mensaje: "Usuario no encontrado",
    });
  }

  res.json({
    ok: true,
    mensaje: "Usuario desactivado exitosamente",
  });
});