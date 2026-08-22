// src/app/components/servicio-form/servicio-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-servicio-form',
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
    <h2 mat-dialog-title>{{ data?.servicio_id ? 'Editar Servicio' : 'Nuevo Servicio' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Nombre del Servicio</mat-label>
        <input matInput formControlName="servicio_nombre" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Tipo</mat-label>
        <mat-select formControlName="servicio_tipo" required>
          <mat-option value="consulta">Consulta</mat-option>
          <mat-option value="cirugía">Cirugía</mat-option>
          <mat-option value="laboratorio">Laboratorio</mat-option>
          <mat-option value="estética">Estética</mat-option>
          <mat-option value="vacunación">Vacunación</mat-option>
          <mat-option value="hospitalización">Hospitalización</mat-option>
          <mat-option value="otro">Otro</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Detalle</mat-label>
        <textarea matInput formControlName="servicio_detalle"></textarea>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Precio ($)</mat-label>
        <input matInput type="number" formControlName="servicio_precio" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Duración estimada (minutos)</mat-label>
        <input matInput type="number" formControlName="servicio_duracion">
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="servicio_estado">
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
export class ServicioFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private servicioService: ServicioService,
    public dialogRef: MatDialogRef<ServicioFormComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      servicio_nombre: [this.data?.servicio_nombre || '', Validators.required],
      servicio_tipo: [this.data?.servicio_tipo || '', Validators.required],
      servicio_detalle: [this.data?.servicio_detalle || ''],
      servicio_precio: [this.data?.servicio_precio || '', Validators.required],
      servicio_duracion: [this.data?.servicio_duracion || ''],
      servicio_estado: [this.data?.servicio_estado || 'activo']
    });
  }

  guardar() {
    const servicio = this.form.value;

    const request = this.data?.servicio_id
      ? this.servicioService.actualizarServicio(this.data.servicio_id, servicio)
      : this.servicioService.crearServicio(servicio);

    request.subscribe(() => this.dialogRef.close(true));
  }
}
