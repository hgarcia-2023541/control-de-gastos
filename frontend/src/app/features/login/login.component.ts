import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  cargando = false;
  errorMensaje = "";

  // FormBuilder.group crea un FormGroup: agrupa varios FormControl y
  // permite validar todo el formulario en conjunto.
  formulario = this.fb.group({
    correo: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  get correo() {
    return this.formulario.get("correo")!;
  }
  get password() {
    return this.formulario.get("password")!;
  }

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // fuerza a mostrar los errores de validación
      return;
    }

    this.cargando = true;
    this.errorMensaje = "";
    const { correo, password } = this.formulario.value;

    this.authService.login(correo!, password!).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(["/inicio"]);
      },
      error: (err) => {
        this.cargando = false;
        this.errorMensaje = err.error?.mensaje || "No se pudo iniciar sesión";
      },
    });
  }
}
