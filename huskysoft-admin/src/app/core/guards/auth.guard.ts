// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

const TOKEN_KEY = 'auth_token';

function isLoggedIn(): boolean {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token; // si quieres validar expiración, aquí puedes decodificar JWT
  } catch {
    return false;
  }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (isLoggedIn()) return true;

  // Redirigir a /login y conservar a dónde iba el usuario
  const tree: UrlTree = router.createUrlTree(['/login'], {
    queryParams: { redirect: location.pathname + location.search },
  });
  return tree;
};
