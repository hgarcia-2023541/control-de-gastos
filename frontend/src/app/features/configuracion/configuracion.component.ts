import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

// TODO: agregar un formulario para actualizar nombre/correo (llamando a un
// endpoint tipo PATCH /api/auth/usuarios/:id) y cambio de contraseña.
// AuthService.obtenerUsuario() ya da acceso a los datos actuales del usuario.
@Component({
  selector: "app-configuracion",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./configuracion.component.html",
  styleUrl: "./configuracion.component.css",
})
export class ConfiguracionComponent {}
