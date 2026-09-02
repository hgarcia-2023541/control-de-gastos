import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

// TODO: una vez existan GastosService e IngresosService reales, combinar
// esos datos por período aquí (o reutilizar DashboardService si conviene)
// para mostrar comparativas, totales y exportación de reportes.
@Component({
  selector: "app-reportes",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./reportes.component.html",
  styleUrl: "./reportes.component.css",
})
export class ReportesComponent {}
