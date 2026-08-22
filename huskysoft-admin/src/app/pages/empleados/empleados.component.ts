
// empleados.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../services/empleado.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmpleadoFormComponent } from './empleado-form.component';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  template: `
    <button mat-button class="white-button" (click)="volver()">← Volver</button>
    <h2>Empleados</h2>
    <button mat-raised-button color="primary" (click)="abrirFormulario()">+ Nuevo Empleado</button>

    <table mat-table [dataSource]="empleados" class="mat-elevation-z8">
      <ng-container matColumnDef="empleado_foto">
        <th mat-header-cell *matHeaderCellDef> Foto </th>
        <td mat-cell *matCellDef="let empleado">
          <img *ngIf="empleado.empleado_foto" [src]="empleado.empleado_foto" alt="Foto" width="40" height="40" style="border-radius: 50%;">
        </td>
      </ng-container>

      <ng-container matColumnDef="empleado_nombre">
        <th mat-header-cell *matHeaderCellDef> Nombre </th>
        <td mat-cell *matCellDef="let empleado"> {{empleado.empleado_nombre}} {{empleado.empleado_apellido}} </td>
      </ng-container>

      <ng-container matColumnDef="empleado_cedula">
        <th mat-header-cell *matHeaderCellDef> Cédula </th>
        <td mat-cell *matCellDef="let empleado"> {{empleado.empleado_cedula}} </td>
      </ng-container>

      <ng-container matColumnDef="empleado_rol">
        <th mat-header-cell *matHeaderCellDef> Rol </th>
        <td mat-cell *matCellDef="let empleado"> {{empleado.empleado_rol}} </td>
      </ng-container>

      <ng-container matColumnDef="empleado_estado">
        <th mat-header-cell *matHeaderCellDef> Estado </th>
        <td mat-cell *matCellDef="let empleado"> {{empleado.empleado_estado}} </td>
      </ng-container>

      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef> Acciones </th>
        <td mat-cell *matCellDef="let empleado">
          <button mat-icon-button (click)="abrirFormulario(empleado)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="eliminarEmpleado(empleado.empleado_id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnas"></tr>
      <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `
})
export class EmpleadosComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  empleados: any[] = [];
  columnas: string[] = ['empleado_foto', 'empleado_nombre', 'empleado_cedula', 'empleado_rol', 'empleado_estado', 'acciones'];

  veterinariaId!: string;
  sucursalId!: string;

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.veterinariaId = params.get('veterinariaId')!;
      this.sucursalId = params.get('sucursalId')!;
      console.log('✅ sucursalId desde parent.paramMap:', this.sucursalId);
      this.cargarEmpleados();
    });
  }
  
  

  cargarEmpleados() {
    this.empleadoService.getEmpleadosPorSucursal(this.sucursalId).subscribe(data => {
      this.empleados = data;
    });
  }

  abrirFormulario(empleado?: any) {
    const dialogRef = this.dialog.open(EmpleadoFormComponent, {
      data: {
        ...empleado,
        sucursal_id: this.sucursalId // Asegúrate que esto está después de asignar sucursalId en ngOnInit()
      }
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarEmpleados();
    });
  }
  
  

  eliminarEmpleado(id: number) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(id).subscribe(() => this.cargarEmpleados());
    }
  }

  volver() {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard/configuracion'
    ]);
  }
}
