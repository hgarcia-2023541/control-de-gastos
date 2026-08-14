import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { LoginResponse, RolUsuario, Usuario } from "../models/usuario.model";

// @Injectable({ providedIn: 'root' }) registra el servicio en el
// inyector raíz de Angular: una sola instancia (singleton) para toda
// la aplicación, sin necesidad de declararlo en un módulo manualmente.
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "cdg_token";
  private readonly USUARIO_KEY = "cdg_usuario";

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, {
        correo,
        password,
      })
      .pipe(
        // tap() ejecuta un efecto secundario (guardar el token y el
        // usuario) sin modificar el valor que sigue fluyendo por el observable.
        tap((res) => {
          if (res.data) {
            localStorage.setItem(this.TOKEN_KEY, res.data.token);
            localStorage.setItem(this.USUARIO_KEY, JSON.stringify(res.data.usuario));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  obtenerUsuario(): Usuario | null {
    const datos = localStorage.getItem(this.USUARIO_KEY);
    return datos ? (JSON.parse(datos) as Usuario) : null;
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  tieneRol(rol: RolUsuario): boolean {
    return this.obtenerUsuario()?.rol === rol;
  }
}
