import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../config/db";

async function crearUsuario(
  nombre: string,
  correo: string,
  password: string,
  rol: "admin" | "user"
) {
  const passwordHash = bcrypt.hashSync(password, 10);

  await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (correo) DO NOTHING`,
    [nombre, correo, passwordHash, rol]
  );

  console.log(`👤 Usuario: ${correo} / ${password} (${rol})`);
}

async function main() {
  // Usuario admin
  await crearUsuario(
    "Administrador",
    "admin@controldegastos.com",
    "Admin123",
    "admin"
  );

  // Usuarios normales
  await crearUsuario(
    "Usuario de prueba",
    "user@controldegastos.com",
    "User123",
    "user"
  );

  // Usuario normal adicional
  await crearUsuario(
    "María González",
    "maria@controldegastos.com",
    "Maria123",
    "user"
  );

  console.log("✅ Usuarios de prueba insertados");
  console.log("📝 Roles: admin puede crear usuarios, user es el rol por defecto");
}

main()
  .catch((error) => {
    console.error("❌ Error al insertar usuarios de prueba:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });