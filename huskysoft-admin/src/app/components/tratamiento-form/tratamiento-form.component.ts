import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TratamientoService } from '../../services/tratamiento.service';

@Component({
  selector: 'app-tratamiento-form',
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
    <h2 mat-dialog-title>{{ data?.tratamiento_id ? 'Editar Tratamiento' : 'Nuevo Tratamiento' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre_tratamiento" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="descripcion_tratamiento"></textarea>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Tipo</mat-label>
        <mat-select formControlName="tipo_tratamiento" required>
          <mat-option value="medicamento">Medicamento</mat-option>
          <mat-option value="terapia">Terapia</mat-option>
          <mat-option value="cirugía">Cirugía</mat-option>
          <mat-option value="dieta">Dieta</mat-option>
          <mat-option value="otro">Otro</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Duración recomendada</mat-label>
        <input matInput formControlName="duracion_recomendada">
      </mat-form-field>

      <div style="text-align: right;">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class TratamientoFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private tratamientoService: TratamientoService,
    public dialogRef: MatDialogRef<TratamientoFormComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_tratamiento: [this.data?.nombre_tratamiento || '', Validators.required],
      descripcion_tratamiento: [this.data?.descripcion_tratamiento || ''],
      tipo_tratamiento: [this.data?.tipo_tratamiento || '', Validators.required],
      duracion_recomendada: [this.data?.duracion_recomendada || '']
    });
  }

  guardar() {
    const tratamientoData = this.form.value;
    const request = this.data?.tratamiento_id
      ? this.tratamientoService.actualizarTratamiento(this.data.tratamiento_id, tratamientoData)
      : this.tratamientoService.crearTratamiento(tratamientoData);

    request.subscribe(() => this.dialogRef.close(true));
  }
}
