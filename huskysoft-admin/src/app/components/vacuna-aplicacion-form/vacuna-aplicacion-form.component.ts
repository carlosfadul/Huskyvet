// src/app/components/vacuna-aplicacion-form/vacuna-aplicacion-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { AplicacionVacunaService } from '../../services/aplicacion-vacuna.service';
import { VacunaService } from '../../services/vacuna.service';

@Component({
  selector: 'app-vacuna-aplicacion-form',
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
  templateUrl: './vacuna-aplicacion-form.component.html',
  styleUrls: ['./vacuna-aplicacion-form.component.scss']
})
export class VacunaAplicacionFormComponent implements OnInit {

  form!: FormGroup;
  vacunas: any[] = [];
  titulo = 'Aplicar Vacuna';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VacunaAplicacionFormComponent>,
    private aplicacionService: AplicacionVacunaService,
    private vacunaService: VacunaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      vacuna_id: [this.data?.aplicacion?.vacuna_id || '', Validators.required],
      fecha_aplicacion: [
        this.data?.aplicacion?.fecha_aplicacion || new Date().toISOString().slice(0, 10),
        Validators.required
      ],
      lote: [this.data?.aplicacion?.lote || ''],
      dosis: [this.data?.aplicacion?.dosis || ''],
      responsable_id: [this.data?.usuarioId],
      proxima_dosis: [this.data?.aplicacion?.proxima_dosis || ''],
      observaciones: [this.data?.aplicacion?.observaciones || '']
    });

    // Cargar vacunas disponibles
    this.vacunaService.getVacunas().subscribe({
      next: (vs: any[]) => this.vacunas = vs,
      error: (err: any) => console.error('Error al cargar vacunas', err)
    });

    if (this.data?.aplicacion) {
      this.titulo = 'Editar Aplicación de Vacuna';
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      mascota_id: this.data.mascotaId
    };

    if (this.data?.aplicacion) {
      this.aplicacionService.update(this.data.aplicacion.aplicacionVacuna_id, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error('Error al actualizar vacuna aplicada', err)
      });
    } else {
      this.aplicacionService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: any) => console.error('Error al aplicar vacuna', err)
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
