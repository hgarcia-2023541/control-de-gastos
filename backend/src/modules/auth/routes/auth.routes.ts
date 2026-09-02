import { Router } from "express";
import {
  login,
  registrar,
  listar,
  actualizarRol,
  desactivar,
} from "../controllers/auth.controller";
import { verificarToken } from "../../../middlewares/auth.middleware";

const router = Router();

// Pública: cualquiera puede intentar iniciar sesión.
router.post("/login", login);

// Protegidas: requieren un token válido. Cada controlador verifica
// además que el usuario autenticado tenga rol "admin" antes de
// continuar (ver auth.controller.ts).
router.post("/registrar", verificarToken, registrar);
router.get("/usuarios", verificarToken, listar);
router.patch("/usuarios/:id/rol", verificarToken, actualizarRol);
router.patch("/usuarios/:id/desactivar", verificarToken, desactivar);

export default router;
