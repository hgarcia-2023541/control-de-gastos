import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

// TODO: cuando el backend tenga el módulo de gastos implementado
// (backend/src/modules/expenses/), crear un GastosService siguiendo
// el mismo patrón que DashboardService, con métodos como:
//   obtenerGastos(), crearGasto(), actualizarGasto(id), eliminarGasto(id)
// y reemplazar este contenido por el listado/formulario real.
@Component({
  selector: "app-gastos",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./gastos.component.html",
  styleUrl: "./gastos.component.css",
})
export class GastosComponent {}
