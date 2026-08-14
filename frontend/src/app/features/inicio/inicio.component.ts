import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

// Pantalla mínima para comprobar que el login funciona y que el rol
// del usuario viaja correctamente en el token. Las próximas semanas
// aquí se irá construyendo el módulo de gastos.
@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./inicio.component.html",
  styleUrl: "./inicio.component.css",
})
export class InicioComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = this.authService.obtenerUsuario();

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
