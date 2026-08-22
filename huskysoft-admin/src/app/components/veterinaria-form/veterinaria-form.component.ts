import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { VeterinariaService } from '../../services/veterinaria.service';

@Component({
  selector: 'app-veterinaria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.veterinaria ? 'Editar' : 'Nueva' }} Veterinaria</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()" enctype="multipart/form-data">

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="veterinaria_nombre" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>NIT</mat-label>
        <input matInput formControlName="veterinaria_nit">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="veterinaria_telefono">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Dirección</mat-label>
        <input matInput formControlName="veterinaria_direccion">
      </mat-form-field>

      <!-- Input de archivo fuera del mat-form-field -->
      <div class="full-width">
        <label>Logo:</label><br>
        <input type="file" accept="image/*" (change)="onFileSelected($event)">
      </div>

      <!-- Vista previa -->
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
export class VeterinariaFormComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VeterinariaFormComponent>,
    private veterinariaService: VeterinariaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      veterinaria_nombre: [data?.veterinaria?.veterinaria_nombre || '', Validators.required],
      veterinaria_nit: [data?.veterinaria?.veterinaria_nit || ''],
      veterinaria_telefono: [data?.veterinaria?.veterinaria_telefono || ''],
      veterinaria_direccion: [data?.veterinaria?.veterinaria_direccion || '']
    });

    // Vista previa desde backend
    if (data?.veterinaria?.veterinaria_id) {
      this.logoPreview = `http://localhost:3000/api/veterinarias/${data.veterinaria.veterinaria_id}/logo`;
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
      formData.append('veterinaria_nombre', this.form.value.veterinaria_nombre);
      formData.append('veterinaria_nit', this.form.value.veterinaria_nit);
      formData.append('veterinaria_telefono', this.form.value.veterinaria_telefono);
      formData.append('veterinaria_direccion', this.form.value.veterinaria_direccion);

      if (this.selectedFile) {
        formData.append('veterinaria_logo', this.selectedFile);
      }

      if (this.data?.veterinaria) {
        this.veterinariaService.updateVeterinaria(this.data.veterinaria.veterinaria_id, formData)
          .subscribe(() => this.dialogRef.close('updated'));
      } else {
        this.veterinariaService.createVeterinaria(formData)
          .subscribe(() => this.dialogRef.close('updated'));
      }
    }
  }
}

