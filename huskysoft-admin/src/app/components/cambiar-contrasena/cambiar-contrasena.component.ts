import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>Cambiar contraseña</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <div mat-dialog-content class="contenido">
        <mat-form-field appearance="outline">
          <mat-label>Contraseña actual</mat-label>
          <input matInput type="password" formControlName="currentPassword" autocomplete="current-password">
          <mat-error>Ingresa tu contraseña actual</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Nueva contraseña</mat-label>
          <input matInput type="password" formControlName="newPassword" autocomplete="new-password">
          <mat-hint>Mínimo 8 caracteres</mat-hint>
          <mat-error>Usa entre 8 y 72 caracteres</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Confirmar nueva contraseña</mat-label>
          <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password">
          <mat-error>Las contraseñas no coinciden</mat-error>
        </mat-form-field>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="guardando || form.invalid">
          {{ guardando ? 'Guardando...' : 'Actualizar contraseña' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .contenido { display: grid; gap: 12px; min-width: min(420px, 72vw); }
    mat-form-field { width: 100%; }
    @media (max-width: 520px) { .contenido { min-width: 0; } }
  `]
})
export class CambiarContrasenaComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  dialogRef = inject(MatDialogRef<CambiarContrasenaComponent>);
  guardando = false;

  form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirmPassword: ['', Validators.required]
  });

  guardar(): void {
    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();
    if (this.form.invalid || newPassword !== confirmPassword || this.guardando) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: error => {
        this.guardando = false;
        this.snackBar.open(error?.error?.message || 'No fue posible cambiar la contraseña', 'Cerrar', { duration: 3500 });
      }
    });
  }
}