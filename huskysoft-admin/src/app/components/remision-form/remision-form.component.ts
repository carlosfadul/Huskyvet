// src/app/components/remision-form/remision-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { RemisionService } from '../../services/remision.service';
import { AliadoService } from '../../services/aliado.service';

@Component({
  selector: 'app-remision-form',
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
  template: `
    <h2 mat-dialog-title>Nueva remisión</h2>

    <div mat-dialog-content [formGroup]="form" class="remision-form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Aliado / Clínica destino</mat-label>
        <mat-select formControlName="aliado_id" required>
          <mat-option *ngFor="let aliado of aliados" [value]="aliado.aliado_id">
            {{ aliado.nombre_aliado }}
          </mat-option>
        </mat-select>
        <mat-error *ngIf="form.get('aliado_id')?.hasError('required')">
          Selecciona un aliado
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Diagnóstico / Motivo de remisión</mat-label>
        <textarea matInput rows="3" formControlName="remision_diagnostico"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Observaciones adicionales</mat-label>
        <textarea matInput rows="3" formControlName="remision_observaciones"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="remision_estado">
          <mat-option value="pendiente">Pendiente</mat-option>
          <mat-option value="aceptada">Aceptada</mat-option>
          <mat-option value="rechazada">Rechazada</mat-option>
          <mat-option value="completada">Completada</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">
        Guardar
      </button>
    </div>
  `,
  styles: [`
    .remision-form {
      min-width: 400px;
      max-width: 600px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
  `]
})
export class RemisionFormComponent implements OnInit {

  form: FormGroup;
  aliados: any[] = [];

  // data: { mascotaId: number; sucursalId: number }
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RemisionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mascotaId: number; sucursalId: number },
    private remisionService: RemisionService,
    private aliadoService: AliadoService
  ) {
    this.form = this.fb.group({
      aliado_id: [null, Validators.required],
      remision_diagnostico: [''],
      remision_observaciones: [''],
      remision_estado: ['pendiente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarAliados();
  }

  cargarAliados(): void {
  // Usa el método que ya tengas; este es el más común en tu app
  this.aliadoService.getAliadosPorSucursal(String(this.data.sucursalId)).subscribe({
    next: (resp: any[]) => this.aliados = resp,
    error: (err: any) => console.error('Error al cargar aliados', err)
  });
}


  guardar(): void {
    if (this.form.invalid) return;

    const payload = {
      sucursal_id: this.data.sucursalId,
      mascota_id: this.data.mascotaId,
      aliado_id: this.form.value.aliado_id,
      remision_diagnostico: this.form.value.remision_diagnostico,
      remision_observaciones: this.form.value.remision_observaciones,
      remision_estado: this.form.value.remision_estado
      // usuario_id lo dejamos NULL por ahora, más adelante lo llenamos desde el token
    };

    this.remisionService.createRemision(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        console.error('Error al crear remisión', err);
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
