// src/app/pages/enfermedades/enfermedades.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfermedadService } from '../../services/enfermedad.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EnfermedadFormComponent } from '../../components/enfermedad-form/enfermedad-form.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enfermedades',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <button mat-button (click)="volver()">← Volver</button>
    <h2>Enfermedades</h2>
    <button mat-raised-button color="primary" (click)="abrirFormulario()">+ Nueva Enfermedad</button>

    <table mat-table [dataSource]="enfermedades" class="mat-elevation-z8">
      <ng-container matColumnDef="nombre_enfermedad">
        <th mat-header-cell *matHeaderCellDef> Nombre </th>
        <td mat-cell *matCellDef="let e"> {{e.nombre_enfermedad}} </td>
      </ng-container>

      <ng-container matColumnDef="descripcion_enfermedad">
        <th mat-header-cell *matHeaderCellDef> Descripción </th>
        <td mat-cell *matCellDef="let e"> {{e.descripcion_enfermedad}} </td>
      </ng-container>

      <ng-container matColumnDef="categoria">
        <th mat-header-cell *matHeaderCellDef> Categoría </th>
        <td mat-cell *matCellDef="let e"> {{e.categoria}} </td>
      </ng-container>

      <ng-container matColumnDef="especie_afectada">
        <th mat-header-cell *matHeaderCellDef> Especies </th>
        <td mat-cell *matCellDef="let e"> {{e.especie_afectada}} </td>
      </ng-container>

      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef> Acciones </th>
        <td mat-cell *matCellDef="let e">
          <button mat-icon-button (click)="abrirFormulario(e)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="eliminarEnfermedad(e.enfermedad_id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnas"></tr>
      <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
})
export class EnfermedadesComponent implements OnInit {
  private enfermedadService = inject(EnfermedadService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  enfermedades: any[] = [];
  columnas: string[] = ['nombre_enfermedad', 'descripcion_enfermedad', 'categoria', 'especie_afectada', 'acciones'];

  ngOnInit(): void {
    this.cargarEnfermedades();
  }

  cargarEnfermedades() {
    this.enfermedadService.getEnfermedades().subscribe(data => {
      this.enfermedades = data;
    });
  }

  abrirFormulario(enfermedad?: any) {
    const dialogRef = this.dialog.open(EnfermedadFormComponent, { data: enfermedad });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarEnfermedades();
    });
  }

  eliminarEnfermedad(id: number) {
    if (confirm('¿Estás seguro de eliminar esta enfermedad?')) {
      this.enfermedadService.eliminarEnfermedad(id).subscribe(() => this.cargarEnfermedades());
    }
  }

  volver() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
