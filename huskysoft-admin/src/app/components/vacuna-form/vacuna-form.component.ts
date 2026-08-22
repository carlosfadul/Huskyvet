// src/app/components/vacuna-form/vacuna-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { VacunaService } from '../../services/vacuna.service';

@Component({
  selector: 'app-vacuna-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './vacuna-form.component.html',
  styleUrls: ['./vacuna-form.component.scss']
})
export class VacunaFormComponent implements OnInit {

  titulo = 'Nueva Vacuna';
  especies = ['canino', 'felino', 'ave', 'roedor', 'reptil', 'otro'];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vacunaService: VacunaService,
    private dialogRef: MatDialogRef<VacunaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacuna?: any }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      vacuna_nombre: ['', Validators.required],
      vacuna_laboratorio: ['', Validators.required],
      vacuna_detalles: [''],
      especie_destinada: [[] as string[]],
      edad_minima_semanas: [null as number | null],
      frecuencia_meses: [null as number | null]
    });

    if (this.data?.vacuna) {
      this.titulo = 'Editar Vacuna';
      const v = this.data.vacuna;

      this.form.patchValue({
        vacuna_nombre: v.vacuna_nombre,
        vacuna_laboratorio: v.vacuna_laboratorio,
        vacuna_detalles: v.vacuna_detalles || '',
        especie_destinada: v.especie_destinada
          ? String(v.especie_destinada).split(',').map((s: string) => s.trim())
          : [],
        edad_minima_semanas: v.edad_minima_semanas ?? null,
        frecuencia_meses: v.frecuencia_meses ?? null
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;

    const payload = {
      vacuna_nombre: raw.vacuna_nombre,
      vacuna_laboratorio: raw.vacuna_laboratorio,
      vacuna_detalles: raw.vacuna_detalles,
      especie_destinada: (raw.especie_destinada || []).join(','),
      edad_minima_semanas: raw.edad_minima_semanas || null,
      frecuencia_meses: raw.frecuencia_meses || null
    };

    if (this.data?.vacuna) {
      this.vacunaService.actualizarVacuna(this.data.vacuna.vacuna_id, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error al actualizar vacuna', err)
      });
    } else {
      this.vacunaService.crearVacuna(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error al crear vacuna', err)
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

