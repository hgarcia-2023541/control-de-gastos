import { pool } from "../../../config/db";

export interface Ingreso {
  id: number;
  usuario_id: number;
  descripcion: string;
  fuente: string;
  categoria: string;
  monto: string; // NUMERIC llega como string desde pg; se castea en el service
  fecha: string; // DATE llega como "yyyy-mm-dd"
  creado_en: Date;
}

export interface FiltrosIngreso {
  busqueda?: string;
  fechaInicio?: string;
  fechaFin?: string;
  categoria?: string;
  periodo?: string; // <-- AGREGAR ESTA LÍNEA
}

export interface DatosIngreso {
  descripcion: string;
  fuente: string;
  categoria: string;
  monto: number;
  fecha: string;
}

// SIEMPRE recibe el usuarioId del usuario autenticado (nunca del body
// que manda el frontend), así cada usuario solo ve/edita/elimina sus
// propios ingresos.
export async function listarIngresosPorUsuario(
  usuarioId: number,
  filtros: FiltrosIngreso = {}
): Promise<Ingreso[]> {
  const condiciones: string[] = ["usuario_id = $1"];
  const valores: unknown[] = [usuarioId];

  if (filtros.busqueda) {
    valores.push(`%${filtros.busqueda}%`);
    const idx = valores.length;
    condiciones.push(
      `(descripcion ILIKE $${idx} OR fuente ILIKE $${idx} OR categoria ILIKE $${idx})`
    );
  }

  if (filtros.fechaInicio) {
    valores.push(filtros.fechaInicio);
    condiciones.push(`fecha >= $${valores.length}`);
  }

  if (filtros.fechaFin) {
    valores.push(filtros.fechaFin);
    condiciones.push(`fecha <= $${valores.length}`);
  }

  if (filtros.categoria) {
    valores.push(filtros.categoria);
    condiciones.push(`categoria = $${valores.length}`);
  }

  if (filtros.periodo) {
    // Asumiendo que el período viene como "Septiembre 2026"
    // Necesitas parsearlo a mes/año
    const [mes, anio] = filtros.periodo.split(' ');
    const meses = {
      'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
      'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
      'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
    };
    const mesNumero = meses[mes as keyof typeof meses];
    
    if (mesNumero && anio) {
      valores.push(anio);
      valores.push(mesNumero);
      const idxAnio = valores.length - 1;
	const idxMes = valores.length;
      condiciones.push(
        `EXTRACT(YEAR FROM fecha) = $${idxAnio} AND EXTRACT(MONTH FROM fecha) = $${idxMes}`
      );
    }
  }

  const resultado = await pool.query<Ingreso>(
    `SELECT id, usuario_id, descripcion, fuente, categoria, monto, fecha, creado_en
    FROM ingresos
    WHERE ${condiciones.join(" AND ")}
    ORDER BY fecha DESC, creado_en DESC`,
    valores
  );

  return resultado.rows;
}

export async function obtenerIngresoPorId(
  id: number,
  usuarioId: number
): Promise<Ingreso | null> {
  const resultado = await pool.query<Ingreso>(
    `SELECT id, usuario_id, descripcion, fuente, categoria, monto, fecha, creado_en
     FROM ingresos
     WHERE id = $1 AND usuario_id = $2`,
    [id, usuarioId]
  );

  return resultado.rows[0] ?? null;
}

export async function crearIngreso(
  usuarioId: number,
  datos: DatosIngreso
): Promise<Ingreso> {
  const resultado = await pool.query<Ingreso>(
    `INSERT INTO ingresos (usuario_id, descripcion, fuente, categoria, monto, fecha)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, usuario_id, descripcion, fuente, categoria, monto, fecha, creado_en`,
    [usuarioId, datos.descripcion, datos.fuente, datos.categoria, datos.monto, datos.fecha]
  );

  return resultado.rows[0];
}

// Actualiza SOLO si el ingreso pertenece al usuario (WHERE usuario_id).
// Si no pertenece o no existe, devuelve null y el controller responde 404.
export async function actualizarIngreso(
  id: number,
  usuarioId: number,
  datos: DatosIngreso
): Promise<Ingreso | null> {
  const resultado = await pool.query<Ingreso>(
    `UPDATE ingresos
     SET descripcion = $1, fuente = $2, categoria = $3, monto = $4, fecha = $5
     WHERE id = $6 AND usuario_id = $7
     RETURNING id, usuario_id, descripcion, fuente, categoria, monto, fecha, creado_en`,
    [datos.descripcion, datos.fuente, datos.categoria, datos.monto, datos.fecha, id, usuarioId]
  );

  return resultado.rows[0] ?? null;
}

export async function eliminarIngreso(id: number, usuarioId: number): Promise<boolean> {
  const resultado = await pool.query(
    `DELETE FROM ingresos WHERE id = $1 AND usuario_id = $2`,
    [id, usuarioId]
  );

  return (resultado.rowCount ?? 0) > 0;
}
