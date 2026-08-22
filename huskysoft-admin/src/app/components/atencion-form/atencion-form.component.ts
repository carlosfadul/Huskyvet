import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AtencionService } from '../../services/atencion.service';
import { ServicioService } from '../../services/servicio.service';
import { TratamientoService } from '../../services/tratamiento.service';

export interface AtencionFormData {
  veterinariaId: number;
  sucursalId: number;
  mascotaId: number;
  usuarioId?: number;   // veterinario logueado (más adelante lo puedes rellenar desde el auth)
  atencion?: any;       // si viene, es edición
}

@Component({
  selector: 'app-atencion-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './atencion-form.component.html',
})
export class AtencionFormComponent implements OnInit {

  titulo = 'Nueva Atención / Consulta';
  form!: FormGroup;

  servicios: any[] = [];
  tratamientos: any[] = [];

  archivoSeleccionado: File | null = null;

  constructor(
    private fb: FormBuilder,
    private atencionService: AtencionService,
    private servicioService: ServicioService,
    private tratamientoService: TratamientoService,
    private dialogRef: MatDialogRef<AtencionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AtencionFormData
  ) {}

  ngOnInit(): void {
    if (this.data.atencion?.atencion_id) {
      this.titulo = 'Editar Atención / Consulta';
    }

    this.form = this.fb.group({
      servicio_id: [this.data.atencion?.servicio_id || null, Validators.required],
      atencion_fecha: [
        this.data.atencion?.atencion_fecha
          ? new Date(this.data.atencion.atencion_fecha)
          : new Date(),
        Validators.required
      ],
      atencion_cantidad: [
        this.data.atencion?.atencion_cantidad ?? 1,
        [Validators.required, Validators.min(1)]
      ],
      atencion_precio: [
        this.data.atencion?.atencion_precio ?? 0,
        [Validators.required, Validators.min(0)]
      ],
      atencion_motivo: [this.data.atencion?.atencion_motivo || '', Validators.required],
      atencion_detalle: [this.data.atencion?.atencion_detalle || ''],
      diagnostico: [this.data.atencion?.diagnostico || ''],
      tratamiento_id: [null], // se rellena con la tabla Tratamiento
      tratamiento_texto: [this.data.atencion?.tratamiento || ''],
      observaciones: [this.data.atencion?.observaciones || ''],
      atencion_estado: [this.data.atencion?.atencion_estado || 'completada', Validators.required],
      atencion_archivoAdjunto: [null]
    });

    this.cargarServicios();
    this.cargarTratamientos();
  }

  cargarServicios(): void {
    this.servicioService.getServicios().subscribe({
      next: (rows: any[]) => (this.servicios = rows),
      error: (err) => console.error('Error al cargar servicios', err)
    });
  }

  cargarTratamientos(): void {
    this.tratamientoService.getTratamientos().subscribe({
      next: (rows: any[]) => (this.tratamientos = rows),
      error: (err) => console.error('Error al cargar tratamientos', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.archivoSeleccionado = input.files[0];
    } else {
      this.archivoSeleccionado = null;
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    // Si seleccionó un tratamiento de la lista, usamos su nombre para el campo TEXT "tratamiento"
    let tratamientoTexto = value.tratamiento_texto;
    if (value.tratamiento_id) {
      const seleccionado = this.tratamientos.find(
        (t) => t.tratamiento_id === value.tratamiento_id
      );
      if (seleccionado) {
        tratamientoTexto = seleccionado.tratamiento_nombre;
      }
    }

    // Preparamos FormData para enviar archivo + campos
    const fd = new FormData();
    fd.append('mascota_id', String(this.data.mascotaId));
    fd.append('servicio_id', String(value.servicio_id));
    if (this.data.usuarioId) {
      fd.append('usuario_id', String(this.data.usuarioId));
    }
    fd.append('atencion_fecha', this.formatFecha(value.atencion_fecha));
    fd.append('atencion_cantidad', String(value.atencion_cantidad));
    fd.append('atencion_precio', String(value.atencion_precio));
    fd.append('atencion_motivo', value.atencion_motivo || '');
    fd.append('atencion_detalle', value.atencion_detalle || '');
    fd.append('diagnostico', value.diagnostico || '');
    fd.append('tratamiento', tratamientoTexto || '');
    fd.append('observaciones', value.observaciones || '');
    fd.append('atencion_estado', value.atencion_estado || 'pendiente');

    if (this.archivoSeleccionado) {
      fd.append('archivo', this.archivoSeleccionado); // 👈 nombre de campo para multer
    }

    const peticion$ = this.data.atencion?.atencion_id
      ? this.atencionService.update(this.data.atencion.atencion_id, fd)
      : this.atencionService.create(fd);

    peticion$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Error al guardar atención', err)
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  private formatFecha(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    // MySQL DATETIME
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
}
