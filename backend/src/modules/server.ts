import "dotenv/config";
import { app } from "./app";
import { verificarConexionBD } from "../config/db";

const PORT = process.env.PORT || 3000;

async function iniciar() {
  await verificarConexionBD();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}

iniciar().catch((error) => {
  console.error("❌ No se pudo iniciar el servidor:", error);
  process.exit(1);
});
