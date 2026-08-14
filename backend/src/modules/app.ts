import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { errorHandler } from "../middlewares/errorHandler";
import authRoutes from "./auth/routes/auth.routes";
// La próxima semana se agregará aquí el módulo de expenses:
// import expensesRoutes from "./expenses/routes/expenses.routes";

export const app = express();

// --- Middlewares globales ---
app.use(cors()); // permite que Angular (otro puerto/origen) consuma la API
app.use(express.json()); // parsea el body de las peticiones como JSON

// --- Ruta de salud (útil para probar que el server está vivo) ---
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, mensaje: "API Control de Gastos funcionando" });
});

// --- Registro de rutas de cada módulo ---
app.use("/api/auth", authRoutes);
// app.use("/api/expenses", expensesRoutes);

// --- Middleware de errores: SIEMPRE al final, después de las rutas ---
app.use(errorHandler);
