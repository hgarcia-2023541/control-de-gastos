import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  let request = req;

  if (token) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(request).pipe(
    catchError((error) => {
      // Solo manejar errores 401 que NO sean del endpoint de login
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        const mensaje = error.error?.mensaje || "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";
        console.log(`🔴 ${mensaje}`);
        authService.logout(mensaje);
      }
      return throwError(() => error);
    })
  );
};