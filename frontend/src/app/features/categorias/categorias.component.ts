import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

// TODO: crear un CategoriasService con obtenerCategorias(), crearCategoria(),
// actualizarCategoria(id), eliminarCategoria(id). Las categorías que ya se
// usan como demo están en dashboard.service.ts (obtenerGastosPorCategoria).
@Component({
  selector: "app-categorias",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./categorias.component.html",
  styleUrl: "./categorias.component.css",
})
export class CategoriasComponent {}
