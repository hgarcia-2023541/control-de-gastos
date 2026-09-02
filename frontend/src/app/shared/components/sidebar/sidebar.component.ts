import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

interface ItemMenu {
  etiqueta: string;
  ruta: string;
  icono: "inicio" | "gastos" | "ingresos" | "reportes" | "categorias" | "configuracion";
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
  private authService = inject(AuthService);

  usuario = this.authService.obtenerUsuario();

  // Rutas reales: "inicio" ya existía (es el Dashboard). Las demás son
  // páginas "próximamente" mientras no exista el módulo expenses en el
  // backend (ver ProximamenteComponent y DashboardService).
  items: ItemMenu[] = [
    { etiqueta: "Inicio", ruta: "/inicio", icono: "inicio" },
    { etiqueta: "Gastos", ruta: "/gastos", icono: "gastos" },
    { etiqueta: "Ingresos", ruta: "/ingresos", icono: "ingresos" },
    { etiqueta: "Reportes", ruta: "/reportes", icono: "reportes" },
    { etiqueta: "Categorías", ruta: "/categorias", icono: "categorias" },
    { etiqueta: "Configuración", ruta: "/configuracion", icono: "configuracion" },
  ];

  cerrarSesion(): void {
    this.authService.logout();
  }
}
