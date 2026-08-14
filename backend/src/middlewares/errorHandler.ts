import { NextFunction, Request, Response } from "express";

// Clase de error personalizada: permite lanzar errores con un código
// HTTP específico desde cualquier controlador o servicio.
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware de errores de Express: siempre recibe 4 parámetros
// (err, req, res, next). Express lo detecta por esa firma y lo ejecuta
// cuando algo llama a next(error) o se lanza una excepción dentro de
// una ruta async envuelta en catchAsync.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      mensaje: err.message,
    });
  }

  return res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor",
  });
}

// Helper para no repetir try/catch en cada controlador async.
export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
