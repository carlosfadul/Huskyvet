// src/app/components/aliado-form/aliado-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AliadoService } from '../../services/aliado.service';

@Component({
  selector: 'app-aliado-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.aliado_id ? 'Editar Aliado' : 'Nuevo Aliado' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre_aliado" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Dirección</mat-label>
        <input matInput formControlName="direccion_aliado" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="telefono_aliado" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email_aliado">
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>NIT</mat-label>
        <input matInput formControlName="nit_aliado" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Detalles</mat-label>
        <textarea matInput formControlName="aliado_detalles"></textarea>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="aliado_estado">
          <mat-option value="activo">Activo</mat-option>
          <mat-option value="inactivo">Inactivo</mat-option>
        </mat-select>
      </mat-form-field>

      <input type="hidden" formControlName="sucursal_id">

      <div style="text-align: right;">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class AliadoFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private aliadoService: AliadoService,
    public dialogRef: MatDialogRef<AliadoFormComponent>
  ) {}

  ngOnInit(): void {
    console.log('📦 Datos recibidos en el diálogo:', this.data);

    this.form = this.fb.group({
      nombre_aliado: [this.data?.nombre_aliado || '', Validators.required],
      direccion_aliado: [this.data?.direccion_aliado || '', Validators.required],
      telefono_aliado: [this.data?.telefono_aliado || '', Validators.required],
      email_aliado: [this.data?.email_aliado || ''],
      nit_aliado: [this.data?.nit_aliado || '', Validators.required],
      aliado_detalles: [this.data?.aliado_detalles || ''],
      aliado_estado: [this.data?.aliado_estado || 'activo'],
      sucursal_id: [this.data?.sucursal_id || '', Validators.required]
    });

    if (!this.data?.sucursal_id) {
      console.warn('⚠️ No se recibió sucursal_id');
    }

    console.log('📝 Formulario inicializado:', this.form.value);
  }

  guardar() {
    let aliadoData = this.form.value;

    // Seguridad extra: aseguramos que sucursal_id esté presente
    if (!aliadoData.sucursal_id && this.data?.sucursal_id) {
      aliadoData = { ...aliadoData, sucursal_id: this.data.sucursal_id };
    }

    console.log('📤 Datos enviados al backend:', aliadoData);

    const request = this.data?.aliado_id
      ? this.aliadoService.actualizarAliado(this.data.aliado_id, aliadoData)
      : this.aliadoService.crearAliado(aliadoData);

    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('❌ Error al guardar aliado:', err)
    });
  }
}
