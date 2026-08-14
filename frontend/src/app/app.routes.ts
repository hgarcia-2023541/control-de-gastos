import { Routes } from "@angular/router";
import { authGuard } from "./core/services/auth.guard";

// loadComponent = lazy loading: el código de cada componente solo se
// descarga cuando el usuario navega a esa ruta.
export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },

  {
    path: "login",
    loadComponent: () =>
      import("./features/login/login.component").then((m) => m.LoginComponent),
  },

  // Ruta protegida de ejemplo: solo se puede entrar con sesión iniciada.
  // Aquí se irán agregando las pantallas reales del módulo de gastos.
  {
    path: "inicio",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/inicio/inicio.component").then((m) => m.InicioComponent),
  },

  { path: "**", redirectTo: "login" },
];
