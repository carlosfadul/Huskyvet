// src/app/components/mascota-form/mascota-form.component.ts

import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-form',
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
    <h2 mat-dialog-title>{{ data?.mascota ? 'Editar' : 'Nueva' }} Mascota</h2>
    <div class="formulario-panel">
  
    <form [formGroup]="form" (ngSubmit)="guardar()" enctype="multipart/form-data">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="mascota_nombre" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Especie</mat-label>
        <mat-select formControlName="mascota_especie" required>
          <mat-option value="canino">Canino</mat-option>
          <mat-option value="felino">Felino</mat-option>
          <mat-option value="ave">Ave</mat-option>
          <mat-option value="roedor">Roedor</mat-option>
          <mat-option value="reptil">Reptil</mat-option>
          <mat-option value="otro">Otro</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Raza</mat-label>
        <input matInput formControlName="mascota_raza">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Sexo</mat-label>
        <mat-select formControlName="mascota_sexo">
          <mat-option value="macho">Macho</mat-option>
          <mat-option value="hembra">Hembra</mat-option>
          <mat-option value="desconocido">Desconocido</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Fecha de Nacimiento</mat-label>
        <input matInput type="date" formControlName="mascota_fecha_nac">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Color</mat-label>
        <input matInput formControlName="mascota_color">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Peso (kg)</mat-label>
        <input matInput type="number" formControlName="mascota_peso">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="mascota_estado">
          <mat-option value="vivo">Vivo</mat-option>
          <mat-option value="fallecido">Fallecido</mat-option>
          <mat-option value="perdido">Perdido</mat-option>
          <mat-option value="dado en adopción">Dado en adopción</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="full-width">
        <label>Foto:</label><br>
        <input type="file" accept="image/*" (change)="onFileSelected($event)">
      </div>

      <div class="full-width" *ngIf="fotoPreview">
        <label>Vista previa:</label><br>
        <img [src]="fotoPreview" alt="Vista previa" width="100" height="100" style="object-fit: cover; border-radius: 8px;">
      </div>

      <div class="acciones">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    .acciones {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class MascotaFormComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  fotoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    public dialogRef: MatDialogRef<MascotaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      mascota_nombre: [data?.mascota?.mascota_nombre || '', Validators.required],
      mascota_especie: [data?.mascota?.mascota_especie || '', Validators.required],
      mascota_raza: [data?.mascota?.mascota_raza || ''],
      mascota_sexo: [data?.mascota?.mascota_sexo || 'desconocido'],
      mascota_fecha_nac: [data?.mascota?.mascota_fecha_nac || ''],
      mascota_color: [data?.mascota?.mascota_color || ''],
      mascota_peso: [data?.mascota?.mascota_peso || ''],
      mascota_estado: [data?.mascota?.mascota_estado || 'vivo']
    });

    if (data?.mascota?.mascota_id) {
      this.fotoPreview = `http://localhost:3000/api/mascotas/${data.mascota.mascota_id}/foto`;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.fotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      alert('Selecciona un archivo de imagen válido.');
      this.selectedFile = null;
      this.fotoPreview = null;
    }
  }

  guardar() {
    if (this.form.valid) {
      const formData = new FormData();
      Object.entries(this.form.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      

      if (this.selectedFile) {
        formData.append('mascota_foto', this.selectedFile);
      }

      formData.append('cliente_id', this.data.cliente_id);

      if (this.data?.mascota) {
        this.mascotaService.updateMascota(this.data.mascota.mascota_id, formData)
          .subscribe(() => this.dialogRef.close('updated'));
      } else {
        this.mascotaService.createMascota(formData)
          .subscribe(() => this.dialogRef.close('created'));
      }
    }
  }
}
