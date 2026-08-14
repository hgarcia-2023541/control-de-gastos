export type RolUsuario = "admin" | "normal";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
