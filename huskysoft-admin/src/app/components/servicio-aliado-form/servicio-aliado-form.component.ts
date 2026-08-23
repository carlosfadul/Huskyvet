import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServicioAliadoService } from '../../services/servicio-aliado.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-servicio-aliado-form',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './servicio-aliado-form.component.html',
  styles: [`
    :host { display: block; color: #16324f; }
    [mat-dialog-title] { margin: 0; padding: 4px 4px 18px; font-size: 23px; font-weight: 700; }
    [mat-dialog-content] { padding: 0 4px 8px; }
    .form-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(150px, .8fr); gap: 14px; }
    .full-width { width: 100%; }
    .detalles { grid-column: 1 / -1; }
    [mat-dialog-actions] { gap: 10px; padding: 14px 4px 4px; border-top: 1px solid #e5ebef; }
    @media (max-width: 540px) { .form-grid { grid-template-columns: 1fr; } .detalles { grid-column: auto; } }
  `],
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
