// src/app/services/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

export interface LoginDto { username: string; password: string; }
export interface LoginRes { token: string; /* opcional: user, roles, etc. */ }

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  login(data: LoginDto) {
    return this.http.post<LoginRes>(`${environment.apiUrl}/auth/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem(TOKEN_KEY, res.token);
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  get token(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }
}
