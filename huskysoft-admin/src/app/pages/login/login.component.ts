// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;

    // getRawValue para evitar null/undefined en username/password
    const { username, password } = this.form.getRawValue() as {
      username: string;
      password: string;
      remember: boolean;
    };

    this.authService.login({ username, password }).subscribe({
      next: (resp: any) => {
        // 🔐 Guardar token si viene en la respuesta
        if (resp && resp.token) {
          localStorage.setItem('token', resp.token);
        }

        // 🎯 Intentar obtener el rol del usuario desde distintas posibles estructuras
        const role =
          resp?.usuario_tipo ??
          resp?.usuario?.usuario_tipo ??
          resp?.user?.role ??
          resp?.role;

        if (role) {
          localStorage.setItem('role', role);
        }

        // Redirección (respeta parámetro redirect si viene en la URL)
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigateByUrl(redirect || '/dashboard');

        this.loading = false;
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.snackBar.open(
          'No fue posible iniciar sesión. Verifica tus datos.',
          'Cerrar',
          { duration: 3000 }
        );
        this.loading = false; // 👈 Importante: liberar el botón en caso de error
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}

