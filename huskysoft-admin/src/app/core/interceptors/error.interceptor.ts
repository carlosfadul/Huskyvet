// src/app/core/interceptors/error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

function extractMessage(error: any): string {
  // Intenta leer mensaje de distintas formas comunes de API
  if (!error) return 'Error desconocido';

  if (typeof error === 'string') return error;

  if (error.message) return error.message;

  if (error.error) {
    if (typeof error.error === 'string') return error.error;
    if (error.error.message) return error.error.message;
    if (error.error.error) return error.error.error;
    try {
      return JSON.stringify(error.error);
    } catch {}
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Ha ocurrido un error';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Sin conexión o CORS
      if (err.status === 0) {
        snack.open('Sin conexión con el servidor. Verifica tu red o el backend.', 'Cerrar', { duration: 3500 });
        return throwError(() => err);
      }

      // 401/403 -> sesión inválida/expirada
      if (err.status === 401 || err.status === 403) {
        snack.open('Tu sesión ha expirado. Inicia sesión nuevamente.', 'Cerrar', { duration: 3000 });
        try {
          localStorage.removeItem('auth_token');
        } catch {}
        // Redireccionar a login (evitar loops si ya estamos en /login)
        if (!req.url.includes('/auth/login')) {
          router.navigateByUrl('/login');
        }
        return throwError(() => err);
      }

      // Otros errores: mostrar mensaje amigable
      const msg = extractMessage(err);
      snack.open(msg, 'Cerrar', { duration: 4000 });

      return throwError(() => err);
    })
  );
};
