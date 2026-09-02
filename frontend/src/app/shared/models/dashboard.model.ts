// Tipos compartidos por el Dashboard. Se separan del backend real
// porque ese módulo (expenses) todavía no existe; en cuanto exista,
// estos mismos tipos deberían coincidir con lo que devuelva la API.

export interface ResumenFinanciero {
  ingresos: number;
  gastos: number;
}

export interface PuntoSerieMensual {
  etiqueta: string; // ej. "1", "3", "5"... (día del período)
  ingresos: number;
  gastos: number;
}

export interface CategoriaGasto {
  nombre: string;
  porcentaje: number;
  color: string;
}

export interface GastoReciente {
  id: number;
  descripcion: string;
  categoria: string;
  icono: string;
  fecha: string; // ISO (yyyy-mm-dd)
  monto: number;
}
