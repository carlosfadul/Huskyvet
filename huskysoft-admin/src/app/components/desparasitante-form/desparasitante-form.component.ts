// src/app/components/desparasitante-form/desparasitante-form.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { DesparasitanteService } from '../../services/desparasitante.service';

@Component({
  selector: 'app-desparasitante-form',
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
  templateUrl: './desparasitante-form.component.html',
  styleUrls: ['./desparasitante-form.component.scss']
})
export class DesparasitanteFormComponent {

  form: FormGroup;
  titulo = 'Nuevo Desparasitante';

  tipos = ['interno', 'externo', 'combinado'];
  especies = ['canino', 'felino', 'ave', 'roedor', 'reptil', 'otro'];

  constructor(
    private fb: FormBuilder,
    private desparasitanteService: DesparasitanteService,
    private dialogRef: MatDialogRef<DesparasitanteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      desparasitante_nombre: ['', Validators.required],
      desparasitante_laboratorio: ['', Validators.required],
      desparasitante_detalles: [''],
      tipo: [null],
      especie_destinada: [[]],                 // multi-select
      edad_minima_semanas: [null],
      peso_minimo: [null],
      peso_maximo: [null]
    });

    if (data && data.desparasitante) {
      this.titulo = 'Editar Desparasitante';
      const d = data.desparasitante;

      this.form.patchValue({
        desparasitante_nombre: d.desparasitante_nombre,
        desparasitante_laboratorio: d.desparasitante_laboratorio,
        desparasitante_detalles: d.desparasitante_detalles,
        tipo: d.tipo,
        // SET viene como 'canino,felino'; lo pasamos a array
        especie_destinada: d.especie_destinada ? d.especie_destinada.split(',') : [],
        edad_minima_semanas: d.edad_minima_semanas,
        peso_minimo: d.peso_minimo,
        peso_maximo: d.peso_maximo
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;

    const payload = {
      ...raw,
      // Para MySQL SET, mandamos string con valores separados por coma
      especie_destinada: (raw.especie_destinada || []).join(',')
    };

    if (this.data && this.data.desparasitante) {
      this.desparasitanteService
        .updateDesparasitante(this.data.desparasitante.desparasitante_id, payload)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error al actualizar desparasitante', err)
        });
    } else {
      this.desparasitanteService.createDesparasitante(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error al crear desparasitante', err)
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

