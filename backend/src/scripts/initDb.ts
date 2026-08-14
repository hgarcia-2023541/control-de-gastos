// Uso: npm run db:init
// Lee db/schema.sql y lo ejecuta contra la base de datos configurada
// en DATABASE_URL para crear las tablas necesarias.
import "dotenv/config";
import fs from "fs";
import path from "path";
import { pool } from "../config/db";

async function main() {
  const rutaSchema = path.join(__dirname, "../../db/schema.sql");
  const sql = fs.readFileSync(rutaSchema, "utf-8");

  await pool.query(sql);
  console.log("✅ Tablas creadas o verificadas correctamente");
}

main()
  .catch((error) => {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
