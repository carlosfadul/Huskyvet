import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TratamientoFormComponent } from '../../components/tratamiento-form/tratamiento-form.component';
import { TratamientoService } from '../../services/tratamiento.service';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <button mat-button (click)="abrirFormulario()">+ Nuevo Tratamiento</button>
    <table mat-table [dataSource]="tratamientos" class="mat-elevation-z8">

      <ng-container matColumnDef="nombre_tratamiento">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let t">{{ t.nombre_tratamiento }}</td>
      </ng-container>

      <ng-container matColumnDef="descripcion_tratamiento">
        <th mat-header-cell *matHeaderCellDef>Descripción</th>
        <td mat-cell *matCellDef="let t">{{ t.descripcion_tratamiento }}</td>
      </ng-container>

      <ng-container matColumnDef="tipo_tratamiento">
        <th mat-header-cell *matHeaderCellDef>Tipo</th>
        <td mat-cell *matCellDef="let t">{{ t.tipo_tratamiento }}</td>
      </ng-container>

      <ng-container matColumnDef="duracion_recomendada">
        <th mat-header-cell *matHeaderCellDef>Duración</th>
        <td mat-cell *matCellDef="let t">{{ t.duracion_recomendada }}</td>
      </ng-container>

      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let t">
          <button mat-icon-button (click)="abrirFormulario(t)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="eliminar(t.tratamiento_id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnas"></tr>
      <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `
})
export class TratamientosComponent implements OnInit {
  tratamientos: any[] = [];
  columnas: string[] = ['nombre_tratamiento', 'descripcion_tratamiento', 'tipo_tratamiento', 'duracion_recomendada', 'acciones'];

  private servicio = inject(TratamientoService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.cargarTratamientos();
  }

  cargarTratamientos() {
    this.servicio.getTratamientos().subscribe(data => this.tratamientos = data);
  }

  abrirFormulario(tratamiento?: any) {
    const ref = this.dialog.open(TratamientoFormComponent, { data: tratamiento });
    ref.afterClosed().subscribe(result => {
      if (result) this.cargarTratamientos();
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este tratamiento?')) {
      this.servicio.eliminarTratamiento(id).subscribe(() => this.cargarTratamientos());
    }
  }
}
