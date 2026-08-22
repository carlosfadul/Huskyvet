import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Importa tu servicio y el DTO que ya tienes definido
import { AuthService, LoginDto } from '../../services/auth.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage: string | null = null;

  // 👁‍🗨 Para mostrar/ocultar la contraseña (lo pide tu HTML)
  hide = true;

  // 👇 nonNullable para que los valores siempre sean string (no null/undefined)
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // getRawValue() devuelve el tipo correcto (no null)
    const { username, password } = this.loginForm.getRawValue();

    const credentials: LoginDto = { username, password };

    this.authService.login(credentials).subscribe({
      next: (resp: any) => {
        if (resp && resp.token) {
          localStorage.setItem('token', resp.token);
        }

        this.loading = false;
        this.router.navigate(['/dashboard']); // ajusta la ruta si usas otra
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else {
          this.errorMessage = 'Ocurrió un error al iniciar sesión. Intenta nuevamente.';
        }

        console.error('Error al iniciar sesión:', error);
      }
    });
  }
}
