import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FinancialBackground } from '../../shared/components/financial-background/financial-background';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { Subscription } from "rxjs";


@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FinancialBackground],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscription?: Subscription;

  cargando = false;
  errorMensaje = "";
  mensajeExpiracion: string | null = null;

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

  ngOnInit(): void {
    // Verificar si hay mensaje de expiración en el state
    const state = history.state as { mensajeExpiracion?: string };
    if (state?.mensajeExpiracion) {
      this.mensajeExpiracion = state.mensajeExpiracion;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  // El usuario cierra el aviso de sesión expirada a propósito (con un
  // clic) y de ahí lo mandamos a la página de bienvenida.
  aceptarMensajeExpiracion(): void {
    this.mensajeExpiracion = null;
    this.router.navigate(["/landing"]);
  }

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMensaje = "";
    this.mensajeExpiracion = null;
    const { correo, password } = this.formulario.value;

    // Verificar que los valores no sean null o undefined
    if (!correo || !password) {
      this.cargando = false;
      this.errorMensaje = "Por favor, complete todos los campos";
      return;
    }

    this.subscription = this.authService.login(correo, password).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.ok) {
          console.log('✅ Redirigiendo a inicio...');
          this.router.navigate(["/inicio"]);
        } else {
          this.errorMensaje = response.mensaje || "Error al iniciar sesión";
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('❌ Error en login:', err);
        this.errorMensaje = err.error?.mensaje || "No se pudo iniciar sesión. Verifique sus credenciales.";
      },
    });
  }
}