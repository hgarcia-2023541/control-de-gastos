import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, tap, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { LoginResponse, RolUsuario, Usuario } from "../models/usuario.model";
import { Router } from "@angular/router";

const MENSAJE_EXPIRACION =
  "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "cdg_token";
  private readonly USUARIO_KEY = "cdg_usuario";
  private readonly TOKEN_EXPIRY_KEY = "cdg_token_expiry";
  private router = inject(Router);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient) {
    // Al recargar la página, si ya había una sesión, retomamos el
    // temporizador con el tiempo que le quede.
    this.configurarTimerExpiracion();
  }

  login(correo: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, {
        correo,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.ok && res.data) {
            localStorage.setItem(this.TOKEN_KEY, res.data.token);
            localStorage.setItem(this.USUARIO_KEY, JSON.stringify(res.data.usuario));

            // El momento exacto en que expira el token viene dentro del
            // propio JWT (el campo "exp"), así que lo leemos de ahí en
            // vez de asumir un número de minutos fijo en el frontend.
            const expiraEn =
              this.leerExpiracionDelToken(res.data.token) ?? Date.now() + 2 * 60 * 1000;
            localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiraEn.toString());

            this.configurarTimerExpiracion();
          }
        }),
        catchError((error) => throwError(() => error))
      );
  }

  // Cierra la sesión. Si se pasa un mensaje (por ejemplo, que la sesión
  // expiró), se lo pasamos al login para que lo muestre en pantalla.
  logout(mensaje?: string): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.router.navigate(["/login"], {
      state: { mensajeExpiracion: mensaje },
    });
  }

  // Decodifica el "payload" del JWT (la parte de en medio) para leer
  // su fecha de expiración, sin necesidad de ninguna librería extra.
  private leerExpiracionDelToken(token: string): number | null {
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson) as { exp?: number };
      return typeof payload.exp === "number" ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  private configurarTimerExpiracion(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return;

    const tiempoRestante = parseInt(expiry, 10) - Date.now();

    if (tiempoRestante <= 0) {
      this.logout(MENSAJE_EXPIRACION);
      return;
    }

    this.timer = setTimeout(() => {
      this.logout(MENSAJE_EXPIRACION);
    }, tiempoRestante);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  obtenerUsuario(): Usuario | null {
    const datos = localStorage.getItem(this.USUARIO_KEY);
    return datos ? (JSON.parse(datos) as Usuario) : null;
  }

  // Consulta pura: solo revisa si hay una sesión vigente, sin cerrar
  // sesión ni navegar. Quien llame a este método decide qué hacer si
  // devuelve false (ver auth.guard.ts).
  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      return false;
    }

    return true;
  }

  tieneRol(rol: RolUsuario): boolean {
    return this.obtenerUsuario()?.rol === rol;
  }
}
