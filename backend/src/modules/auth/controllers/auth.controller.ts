import { Request, Response } from "express";
import { z } from "zod";
import { catchAsync } from "../../../middlewares/errorHandler";
import { autenticarUsuario } from "../services/auth.service";

// zod valida en tiempo de EJECUCIÓN la forma del body que llega en la
// petición (TypeScript solo valida en tiempo de compilación, por eso
// necesitamos algo como zod para datos que vienen de fuera).
const loginSchema = z.object({
  correo: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
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
