//http://localhost:4200/dashboard
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
  <h1>Bienvenido al panel de control</h1>
  <p *ngIf="usuario">👋 Hola, {{ usuario.nombre }}</p>

  <div class="acciones">
    <button mat-raised-button color="primary" (click)="irAVeterinarias()">Gestionar Veterinarias</button>
  </div>
  <br>

  <button mat-raised-button color="warn" (click)="logout()">Cerrar sesión</button>
`,

})
export class DashboardComponent {

  usuario: any = null; // ✅ AQUI VA

  constructor(private authService: AuthService, private router: Router) {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
  irAVeterinarias() {
    this.router.navigate(['/veterinarias']);
  }
  
}
