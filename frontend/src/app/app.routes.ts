import { Routes } from "@angular/router";
import { authGuard } from "./core/services/auth.guard";

// loadComponent = lazy loading: el código de cada componente solo se
// descarga cuando el usuario navega a esa ruta.
export const routes: Routes = [
  // Ruta raíz → página de bienvenida (landing)
  { path: "", pathMatch: "full", redirectTo: "landing" },

  {
    path: "landing",
    loadComponent: () =>
      import("./features/landing/landing.component").then((m) => m.LandingComponent),
  },

  {
    path: "login",
    loadComponent: () =>
      import("./features/login/login.component").then((m) => m.LoginComponent),
  },

  // Página informativa: el registro real solo lo hace un administrador.
  {
    path: "registro",
    loadComponent: () =>
      import("./features/registro/registro.component").then((m) => m.RegistroComponent),
  },

  // Ruta protegida: solo se puede entrar con sesión iniciada.
  {
    path: "inicio",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/inicio/inicio.component").then((m) => m.InicioComponent),
  },

  // Secciones del sidebar: cada una vive en su propia carpeta bajo
  // features/, ya conectada al menú y a la navegación, lista para
  // completarse cuando el backend correspondiente esté disponible
  // (ver el comentario TODO dentro de cada *.component.ts).
  {
    path: "gastos",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/gastos/gastos.component").then((m) => m.GastosComponent),
  },
  {
    path: "ingresos",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/ingresos/ingresos.component").then((m) => m.IngresosComponent),
  },
  {
    path: "reportes",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/reportes/reportes.component").then((m) => m.ReportesComponent),
  },
  {
    path: "categorias",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/categorias/categorias.component").then((m) => m.CategoriasComponent),
  },
  {
    path: "configuracion",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/configuracion/configuracion.component").then((m) => m.ConfiguracionComponent),
  },

  { path: "**", redirectTo: "landing" },
];
