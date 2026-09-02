const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function parsearPeriodo(periodo: string): { anio: number; mes: number } {
  const [nombreMes, anioTexto] = periodo.trim().toLowerCase().split(" ");
  const mes = MESES.indexOf(nombreMes);
  const anio = parseInt(anioTexto, 10);
  const ahora = new Date();
  return {
    anio: Number.isNaN(anio) ? ahora.getFullYear() : anio,
    mes: mes >= 0 ? mes : ahora.getMonth(),
  };
}

// true si la fecha (yyyy-mm-dd) cae dentro del mes/año del período dado
export function fechaEnPeriodo(fechaIso: string, periodo: string): boolean {
  const { anio, mes } = parsearPeriodo(periodo);
  const fecha = new Date(fechaIso + "T00:00:00");
  return fecha.getFullYear() === anio && fecha.getMonth() === mes;
}

export function periodoActual(): string {
  const ahora = new Date();
  const nombre = MESES[ahora.getMonth()];
  const capitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
  return `${capitalizado} ${ahora.getFullYear()}`;
}
