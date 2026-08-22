import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  templateUrl: './empleado-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class EmpleadoFormComponent {
  private fb = inject(FormBuilder);
  private empleadoService = inject(EmpleadoService);

  empleadoForm: FormGroup;
  fotoSeleccionada: File | null = null;
  fotoPreview: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<EmpleadoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.empleadoForm = this.fb.group({
      empleado_nombre: [data?.empleado_nombre || '', Validators.required],
      empleado_apellido: [data?.empleado_apellido || '', Validators.required],
      empleado_cedula: [data?.empleado_cedula || '', Validators.required],
      empleado_rol: [data?.empleado_rol || '', Validators.required],
      empleado_direccion: [data?.empleado_direccion || '', Validators.required],
      empleado_telefono: [data?.empleado_telefono || '', Validators.required],
      empleado_email: [data?.empleado_email || ''],
      empleado_fecha_nac: [data?.empleado_fecha_nac || ''],
      empleado_genero: [data?.empleado_genero || ''],
      empleado_detalles: [data?.empleado_detalles || ''],
      empleado_estado: [data?.empleado_estado || 'activo'],
      fecha_contratacion: [data?.fecha_contratacion || '', Validators.required],
      fecha_terminacion: [data?.fecha_terminacion || '']
    });

    // Mostrar la imagen actual si existe
    if (data?.empleado_foto) {
      this.fotoPreview = data.empleado_foto;
    }
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoSeleccionada = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.fotoSeleccionada);
    }
  }

  guardar() {
    if (this.empleadoForm.invalid) return;

    const formData = new FormData();
    const sucursalId = this.data?.sucursal_id;

    if (!sucursalId || isNaN(Number(sucursalId))) {
      alert('Error: sucursal_id no está definido o no es válido');
      return;
    }

    formData.append('sucursal_id', String(sucursalId));

    Object.entries(this.empleadoForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (this.fotoSeleccionada) {
      formData.append('empleado_foto', this.fotoSeleccionada);
    }

    const request = this.data?.empleado_id
      ? this.empleadoService.actualizarEmpleado(this.data.empleado_id, formData)
      : this.empleadoService.crearEmpleado(formData);

    request.subscribe(() => this.dialogRef.close(true));
  }

  cancelar() {
    this.dialogRef.close();
  }
}
