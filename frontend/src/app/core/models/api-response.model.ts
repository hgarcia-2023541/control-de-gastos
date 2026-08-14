// Interfaz genérica: <T> se reemplaza por el tipo real al usarla,
// ej: ApiResponse<{ token: string }>
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  mensaje?: string;
}
