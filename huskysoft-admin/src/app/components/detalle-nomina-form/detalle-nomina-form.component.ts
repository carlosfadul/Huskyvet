// src/app/components/detalle-nomina-form/detalle-nomina-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DetalleNominaService } from '../../services/detalle-nomina.service';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-detalle-nomina-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.detalle ? 'Editar Detalle' : 'Agregar Detalle' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Empleado</mat-label>
        <mat-select formControlName="empleado_id" required>
          <mat-option *ngFor="let emp of empleados" [value]="emp.empleado_id">
            {{ emp.empleado_nombre }} {{ emp.empleado_apellido }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Horas</mat-label>
        <input matInput type="number" formControlName="cantidad_horas">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Valor Hora</mat-label>
        <input matInput type="number" formControlName="valor_hora">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Horas Extras</mat-label>
        <input matInput type="number" formControlName="horas_extras">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Valor Horas Extras</mat-label>
        <input matInput type="number" formControlName="valor_horas_extras">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Bonificaciones</mat-label>
        <input matInput type="number" formControlName="bonificaciones">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Descuentos</mat-label>
        <input matInput type="number" formControlName="descuentos">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Anotaciones</mat-label>
        <textarea matInput formControlName="anotaciones"></textarea>
      </mat-form-field>

      <div style="text-align: right; margin-top: 20px;">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class DetalleNominaFormComponent implements OnInit {
  form!: FormGroup;
  empleados: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private detalleService: DetalleNominaService,
    private empleadoService: EmpleadoService,
    public dialogRef: MatDialogRef<DetalleNominaFormComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      empleado_id: [this.data?.detalle?.empleado_id || '', Validators.required],
      cantidad_horas: [this.data?.detalle?.cantidad_horas || 0],
      valor_hora: [this.data?.detalle?.valor_hora || 0],
      horas_extras: [this.data?.detalle?.horas_extras || 0],
      valor_horas_extras: [this.data?.detalle?.valor_horas_extras || 0],
      bonificaciones: [this.data?.detalle?.bonificaciones || 0],
      descuentos: [this.data?.detalle?.descuentos || 0],
      anotaciones: [this.data?.detalle?.anotaciones || '']
    });

    this.empleadoService.getEmpleadosPorSucursal(this.data.nomina_id).subscribe(res => {
      this.empleados = res;
    });
  }

  guardar() {
    const detalle = { ...this.form.value, nomina_id: this.data.nomina_id };
    const request = this.data?.detalle?.detalleNomina_id
      ? this.detalleService.actualizarDetalle(this.data.detalle.detalleNomina_id, detalle)
      : this.detalleService.crearDetalle(detalle);

    request.subscribe(() => this.dialogRef.close(this.data?.detalle ? 'updated' : 'created'));
  }
}
