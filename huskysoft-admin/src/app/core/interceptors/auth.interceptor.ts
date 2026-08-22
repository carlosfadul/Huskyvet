// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'auth_token'; // <-- usa la misma clave que guardas tras el login
const API_URL = environment.apiUrl?.replace(/\/+$/, '') || '';

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No adjuntar token a assets ni a URLs externas que no sean del backend
  const isAssets = req.url.startsWith('./') || req.url.startsWith('/assets') || req.url.includes('assets/');
  const isApiRequest =
    API_URL && (req.url.startsWith(API_URL) || req.url.startsWith('/api') || req.url.startsWith('api/'));

  if (!isApiRequest || isAssets) {
    return next(req);
  }

  const token = getToken();
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
