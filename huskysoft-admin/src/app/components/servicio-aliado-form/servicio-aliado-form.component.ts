import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServicioAliadoService } from '../../services/servicio-aliado.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-servicio-aliado-form',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './servicio-aliado-form.component.html',
})
export class ServicioAliadoFormComponent {

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ServicioAliadoFormComponent>);
  private service = inject(ServicioAliadoService);

  form = this.fb.group({
    aliado_id: [null],
    nombre_servicioAliado: ['', Validators.required],
    detalle_servicioAliado: [''],
    precio_servicio: [0, Validators.required],
    servicio_estado: ['activo']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.servicio) this.form.patchValue(data.servicio);
    else this.form.patchValue({ aliado_id: data.aliadoId });
  }

  guardar() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.data.servicio) {
      // edit
      this.service.update(this.data.servicio.servicioAliado_id, payload)
        .subscribe(() => this.dialogRef.close(true));
    } else {
      // create
      this.service.create(payload)
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
