// Creamos UN solo Pool de conexiones y lo reutilizamos en toda la app.
// Un Pool administra varias conexiones a PostgreSQL y las reparte entre
// las consultas, en vez de abrir una conexión nueva cada vez.
import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pequeña ayuda para probar la conexión al iniciar el servidor.
export async function verificarConexionBD(): Promise<void> {
  const cliente = await pool.connect();
  try {
    await cliente.query("SELECT 1");
    console.log("🗄️  Conexión a PostgreSQL exitosa");
  } finally {
    cliente.release();
  }
}
