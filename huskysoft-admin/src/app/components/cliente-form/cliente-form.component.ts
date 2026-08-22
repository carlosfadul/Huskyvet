
// src/app/components/cliente-form/cliente-form.component.ts

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.cliente ? 'Editar' : 'Nuevo' }} Cliente</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Cédula</mat-label>
        <input matInput formControlName="cliente_cedula" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="cliente_nombre" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Apellido</mat-label>
        <input matInput formControlName="cliente_apellido" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Dirección</mat-label>
        <input matInput formControlName="cliente_direccion">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="cliente_telefono" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Email</mat-label>
        <input matInput formControlName="cliente_email" type="email">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Detalles</mat-label>
        <textarea matInput formControlName="cliente_detalles"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="cliente_estado">
          <mat-option value="activo">Activo</mat-option>
          <mat-option value="inactivo">Inactivo</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="acciones">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    .acciones {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class ClienteFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    public dialogRef: MatDialogRef<ClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      cliente_cedula: [data?.cliente?.cliente_cedula || '', Validators.required],
      cliente_nombre: [data?.cliente?.cliente_nombre || '', Validators.required],
      cliente_apellido: [data?.cliente?.cliente_apellido || '', Validators.required],
      cliente_direccion: [data?.cliente?.cliente_direccion || ''],
      cliente_telefono: [data?.cliente?.cliente_telefono || '', Validators.required],
      cliente_email: [data?.cliente?.cliente_email || ''],
      cliente_detalles: [data?.cliente?.cliente_detalles || ''],
      cliente_estado: [data?.cliente?.cliente_estado || 'activo']
      
    });
    console.log('DATA DEL DIALOGO:', data); // ✅ Agrega esto
  }

  guardar() {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        sucursal_id: this.data.sucursal_id  // ✅ Asegúrate de que llegue correctamente desde el dialog
      };
  
      if (this.data?.cliente) {
        this.clienteService.updateCliente(this.data.cliente.cliente_id, payload)
          .subscribe(() => this.dialogRef.close('updated'));
      } else {
        this.clienteService.createCliente(payload)
          .subscribe(() => this.dialogRef.close('created'));
      }
    }
  }
  
}
