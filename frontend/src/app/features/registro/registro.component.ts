import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FinancialBackground } from '../../shared/components/financial-background/financial-background';
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-registro",
  standalone: true,
  imports: [CommonModule, RouterLink, FinancialBackground],
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent {
  // Página informativa - El registro solo lo hace el admin
}