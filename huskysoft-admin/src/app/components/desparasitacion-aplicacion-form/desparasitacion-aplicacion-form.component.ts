import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { AplicacionDesparasitanteService } from '../../services/aplicacion-desparasitante.service';
import { DesparasitanteService } from '../../services/desparasitante.service';

@Component({
  selector: 'app-desparasitacion-aplicacion-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ titulo }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()" class="form-dialog" mat-dialog-content>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Desparasitante</mat-label>
        <mat-select formControlName="desparasitante_id" required>
          <mat-option *ngFor="let d of desparasitantes" [value]="d.desparasitante_id">
            {{ d.nombre_desparasitante || d.desparasitante_nombre }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Fecha de aplicación</mat-label>
        <input matInput type="date" formControlName="fecha_aplicacion">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Dosis</mat-label>
        <input matInput formControlName="dosis">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Lote</mat-label>
        <input matInput formControlName="lote">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Próxima dosis</mat-label>
        <input matInput type="date" formControlName="proxima_dosis">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Observaciones</mat-label>
        <textarea matInput rows="3" formControlName="observaciones"></textarea>
      </mat-form-field>

    </form>

    <div mat-dialog-actions align="end">
      <button mat-stroked-button (click)="cancelar()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="guardar()" [disabled]="form.invalid">
        Guardar
      </button>
    </div>
  `,
  styles: [`
    .form-dialog {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 350px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class DesparasitacionAplicacionFormComponent implements OnInit {

  form!: FormGroup;
  desparasitantes: any[] = [];
  titulo = 'Aplicar Desparasitación';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DesparasitacionAplicacionFormComponent>,
    private aplicacionService: AplicacionDesparasitanteService,
    private desparasitanteService: DesparasitanteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      desparasitante_id: [this.data?.aplicacion?.desparasitante_id || '', Validators.required],
      fecha_aplicacion: [
        this.data?.aplicacion?.fecha_aplicacion || new Date().toISOString().slice(0, 10),
        Validators.required
      ],
      dosis: [this.data?.aplicacion?.dosis || ''],
      lote: [this.data?.aplicacion?.lote || ''],
      responsable_id: [this.data?.usuarioId],
      proxima_dosis: [this.data?.aplicacion?.proxima_dosis || ''],
      observaciones: [this.data?.aplicacion?.observaciones || '']
    });

    // Catálogo de desparasitantes
    this.desparasitanteService.getDesparasitantes().subscribe({
      next: (rows: any[]) => this.desparasitantes = rows,
      error: (err: any) => console.error('Error al cargar desparasitantes', err)
    });

    if (this.data?.aplicacion) {
      this.titulo = 'Editar Desparasitación';
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      mascota_id: this.data.mascotaId
    };

    if (this.data?.aplicacion) {
      this.aplicacionService.update(this.data.aplicacion.aplicacionDesparasitante_id, payload)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error al actualizar desparasitación', err)
        });
    } else {
      this.aplicacionService.create(payload)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err: any) => console.error('Error al aplicar desparasitación', err)
        });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
