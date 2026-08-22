// src/app/pages/proveedores/proveedores.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProveedorService } from '../../services/proveedor.service';
import { ProveedorFormComponent } from '../../components/proveedor-form/proveedor-form.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <button mat-button class="white-button" routerLink="../">← Volver</button>
    <h2>Proveedores</h2>
    <button mat-raised-button color="primary" (click)="abrirFormulario()">+ Nuevo Proveedor</button>

    <table mat-table [dataSource]="proveedores" class="mat-elevation-z8">

      <ng-container matColumnDef="nombre_proveedor">
        <th mat-header-cell *matHeaderCellDef> Nombre </th>
        <td mat-cell *matCellDef="let p"> {{ p.nombre_proveedor }} </td>
      </ng-container>

      <ng-container matColumnDef="telefono_proveedor">
        <th mat-header-cell *matHeaderCellDef> Teléfono </th>
        <td mat-cell *matCellDef="let p"> {{ p.telefono_proveedor }} </td>
      </ng-container>

      <ng-container matColumnDef="email_proveedor">
        <th mat-header-cell *matHeaderCellDef> Email </th>
        <td mat-cell *matCellDef="let p"> {{ p.email_proveedor }} </td>
      </ng-container>

      <ng-container matColumnDef="nit_proveedor">
        <th mat-header-cell *matHeaderCellDef> NIT </th>
        <td mat-cell *matCellDef="let p"> {{ p.nit_proveedor }} </td>
      </ng-container>

      <ng-container matColumnDef="proveedor_estado">
        <th mat-header-cell *matHeaderCellDef> Estado </th>
        <td mat-cell *matCellDef="let p"> {{ p.proveedor_estado }} </td>
      </ng-container>

      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef> Acciones </th>
        <td mat-cell *matCellDef="let p">
          <button mat-icon-button (click)="abrirFormulario(p)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="eliminarProveedor(p.proveedor_id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnas"></tr>
      <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `
})
export class ProveedoresComponent implements OnInit {
  private proveedorService = inject(ProveedorService);
  private dialog = inject(MatDialog);

  proveedores: any[] = [];
  columnas: string[] = [
    'nombre_proveedor',
    'telefono_proveedor',
    'email_proveedor',
    'nit_proveedor',
    'proveedor_estado',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  abrirFormulario(proveedor?: any) {
    const dialogRef = this.dialog.open(ProveedorFormComponent, {
      data: proveedor
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarProveedores();
    });
  }

  eliminarProveedor(id: number) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => this.cargarProveedores());
    }
  }
}
