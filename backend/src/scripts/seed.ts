// Uso: npm run db:seed
// Inserta dos usuarios de prueba (uno admin y uno normal) para poder
// probar el login de inmediato. Si el correo ya existe, no hace nada.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../config/db";

async function crearUsuario(
  nombre: string,
  correo: string,
  password: string,
  rol: "admin" | "normal"
) {
  const passwordHash = bcrypt.hashSync(password, 10);

  await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (correo) DO NOTHING`,
    [nombre, correo, passwordHash, rol]
  );

  console.log(`👤 Usuario listo: ${correo} / ${password} (${rol})`);
}

async function main() {
  await crearUsuario(
    "Administrador",
    "admin@controldegastos.com",
    "Admin123",
    "admin"
  );

  await crearUsuario(
    "Usuario de prueba",
    "usuario@controldegastos.com",
    "Usuario123",
    "normal"
  );

  console.log("✅ Usuarios de prueba insertados");
}

main()
  .catch((error) => {
    console.error("❌ Error al insertar usuarios de prueba:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
