//http://localhost:4200/dashboard
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CambiarContrasenaComponent } from '../../components/cambiar-contrasena/cambiar-contrasena.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
  <h1>Bienvenido al panel de control</h1>
  <p *ngIf="usuario">👋 Hola, {{ usuario.nombre }}</p>

  <div class="acciones">
    <button mat-raised-button color="primary" (click)="irAVeterinarias()">Gestionar Veterinarias</button>
    <button mat-stroked-button type="button" (click)="abrirCambioContrasena()">Cambiar contraseña</button>
  </div>
  <br>

  <button mat-raised-button color="warn" (click)="logout()">Cerrar sesión</button>
`,

})
export class DashboardComponent {

  usuario: any = null; // ✅ AQUI VA
  private dialog = inject(MatDialog);

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

  abrirCambioContrasena(): void {
    this.dialog.open(CambiarContrasenaComponent, { width: 'min(480px, calc(100vw - 32px))' });
  }
  
}
