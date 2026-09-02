import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

const MENSAJE_EXPIRACION =
  "Su sesión ha expirado. Por favor, inicie sesión nuevamente.";

// Guard funcional: Angular lo ejecuta ANTES de activar una ruta.
// Si devuelve false, la navegación se cancela.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Si había un token pero ya venció, mostramos el aviso de expiración.
  // Si nunca hubo sesión, simplemente lo mandamos al login sin mensaje.
  if (authService.obtenerToken()) {
    authService.logout(MENSAJE_EXPIRACION);
  } else {
    router.navigate(["/login"]);
  }

  return false;
};
