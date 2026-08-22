// src/app/components/sucursal-form/sucursal-form.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { SucursalService } from '../../services/sucursal.service';

@Component({
  selector: 'app-sucursal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.sucursal ? 'Editar' : 'Nueva' }} Sucursal</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" enctype="multipart/form-data">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="sucursal_nombre" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>NIT</mat-label>
        <input matInput formControlName="sucursal_nit">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Dirección</mat-label>
        <input matInput formControlName="sucursal_direccion">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="sucursal_telefono">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="sucursal_estado">
          <mat-option value="activa">Activa</mat-option>
          <mat-option value="inactiva">Inactiva</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="full-width">
        <label>Logo:</label><br>
        <button mat-stroked-button color="primary" type="button" (click)="fileInput.click()">Seleccionar imagen</button>
        <input type="file" #fileInput hidden accept="image/*" (change)="onFileSelected($event)" />
      </div>

      <div class="full-width" *ngIf="logoPreview">
        <label>Vista previa:</label><br>
        <img [src]="logoPreview" alt="Vista previa del logo" width="100" height="100" style="object-fit: cover; border-radius: 8px;">
      </div>

      <div class="acciones">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .acciones {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class SucursalFormComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    public dialogRef: MatDialogRef<SucursalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      sucursal_nombre: [data?.sucursal?.sucursal_nombre || '', Validators.required],
      sucursal_nit: [data?.sucursal?.sucursal_nit || ''],
      sucursal_direccion: [data?.sucursal?.sucursal_direccion || ''],
      sucursal_telefono: [data?.sucursal?.sucursal_telefono || ''],
      sucursal_estado: [data?.sucursal?.sucursal_estado || 'activa']
    });

    if (data?.sucursal?.sucursal_id) {
      this.logoPreview = `http://localhost:3000/api/sucursales/${data.sucursal.sucursal_id}/logo`;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido.');
      this.selectedFile = null;
      this.logoPreview = null;
    }
  }

  guardar() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('sucursal_nombre', this.form.value.sucursal_nombre);
      formData.append('sucursal_nit', this.form.value.sucursal_nit);
      formData.append('sucursal_direccion', this.form.value.sucursal_direccion);
      formData.append('sucursal_telefono', this.form.value.sucursal_telefono);
      formData.append('sucursal_estado', this.form.value.sucursal_estado);
      formData.append('veterinaria_id', this.data.veterinaria_id);

      if (this.selectedFile) {
        formData.append('sucursal_logo', this.selectedFile);
      }

      if (this.data?.sucursal) {
        this.sucursalService.updateSucursal(this.data.sucursal.sucursal_id, formData)
          .subscribe(() => this.dialogRef.close('updated'));
      } else {
        this.sucursalService.createSucursal(formData)
          .subscribe(() => this.dialogRef.close('created'));
      }
    }
  }
}

