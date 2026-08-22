// src/app/components/enfermedad-form/enfermedad-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EnfermedadService } from '../../services/enfermedad.service';

@Component({
  selector: 'app-enfermedad-form',
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
    <h2 mat-dialog-title>{{ data?.enfermedad_id ? 'Editar Enfermedad' : 'Nueva Enfermedad' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre_enfermedad" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="descripcion_enfermedad"></textarea>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Categoría</mat-label>
        <mat-select formControlName="categoria" required>
          <mat-option value="infecciosa">Infecciosa</mat-option>
          <mat-option value="parasitaria">Parasitaria</mat-option>
          <mat-option value="metabólica">Metabólica</mat-option>
          <mat-option value="congénita">Congénita</mat-option>
          <mat-option value="traumática">Traumática</mat-option>
          <mat-option value="neoplásica">Neoplásica</mat-option>
          <mat-option value="otra">Otra</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Especie Afectada</mat-label>
        <mat-select formControlName="especie_afectada" multiple required>
          <mat-option value="canino">Canino</mat-option>
          <mat-option value="felino">Felino</mat-option>
          <mat-option value="ave">Ave</mat-option>
          <mat-option value="roedor">Roedor</mat-option>
          <mat-option value="reptil">Reptil</mat-option>
          <mat-option value="otro">Otro</mat-option>
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
export class EnfermedadFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private enfermedadService: EnfermedadService,
    public dialogRef: MatDialogRef<EnfermedadFormComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_enfermedad: [this.data?.nombre_enfermedad || '', Validators.required],
      descripcion_enfermedad: [this.data?.descripcion_enfermedad || ''],
      categoria: [this.data?.categoria || '', Validators.required],
      especie_afectada: [this.data?.especie_afectada?.split(',') || [], Validators.required]
    });
  }

  guardar() {
    const enfermedadData = {
      ...this.form.value,
      especie_afectada: this.form.value.especie_afectada.join(',') // convertir a cadena SET
    };

    const request = this.data?.enfermedad_id
      ? this.enfermedadService.actualizarEnfermedad(this.data.enfermedad_id, enfermedadData)
      : this.enfermedadService.crearEnfermedad(enfermedadData);

    request.subscribe(() => this.dialogRef.close(true));
  }
}
