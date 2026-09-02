import { Router } from "express";
import { actualizar, crear, eliminar, listar } from "../controllers/ingreso.controller";
import { verificarToken } from "../../../middlewares/auth.middleware";

const router = Router();

// Todas requieren sesión iniciada; el usuario se identifica por el
// token, nunca por un id que mande el frontend.
router.get("/", verificarToken, listar);
router.post("/", verificarToken, crear);
router.put("/:id", verificarToken, actualizar);
router.delete("/:id", verificarToken, eliminar);

export default router;
