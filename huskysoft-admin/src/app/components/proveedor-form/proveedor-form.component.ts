import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre_proveedor" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Dirección</mat-label>
        <input matInput formControlName="direccion_proveedor" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="telefono_proveedor" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email_proveedor">
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>NIT</mat-label>
        <input matInput formControlName="nit_proveedor" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Detalles</mat-label>
        <textarea matInput formControlName="detalles_proveedor"></textarea>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="proveedor_estado">
          <mat-option value="activo">Activo</mat-option>
          <mat-option value="inactivo">Inactivo</mat-option>
        </mat-select>
      </mat-form-field>

      <div style="text-align: right;">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class ProveedorFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    public dialogRef: MatDialogRef<ProveedorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre_proveedor: [data?.nombre_proveedor || '', Validators.required],
      direccion_proveedor: [data?.direccion_proveedor || '', Validators.required],
      telefono_proveedor: [data?.telefono_proveedor || '', Validators.required],
      email_proveedor: [data?.email_proveedor || ''],
      nit_proveedor: [data?.nit_proveedor || '', Validators.required],
      detalles_proveedor: [data?.detalles_proveedor || ''],
      proveedor_estado: [data?.proveedor_estado || 'activo']
    });
  }

  guardar() {
    const proveedorData = this.form.value;

    const request = this.data?.proveedor_id
      ? this.proveedorService.actualizarProveedor(this.data.proveedor_id, proveedorData)
      : this.proveedorService.crearProveedor(proveedorData);

    request.subscribe(() => this.dialogRef.close(true));
  }
}
