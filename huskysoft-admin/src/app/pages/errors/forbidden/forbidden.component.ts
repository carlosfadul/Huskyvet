// src/app/pages/errors/forbidden/forbidden.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  template: `
    <div class="container">
      <mat-icon class="icon">block</mat-icon>
      <h1>Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta sección.</p>

      <button mat-raised-button color="primary" (click)="volver()">
        <mat-icon>arrow_back</mat-icon>
        Volver
      </button>
    </div>
  `,
  styles: [`
    .container {
      text-align: center;
      padding: 40px;
      max-width: 500px;
      margin: 60px auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.12);
    }

    .icon {
      font-size: 80px;
      color: #d32f2f;
      margin-bottom: 20px;
    }

    h1 {
      margin: 10px 0;
      font-size: 28px;
      font-weight: 600;
    }

    p {
      color: #555;
      margin-bottom: 25px;
      font-size: 16px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class ForbiddenComponent {
  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
