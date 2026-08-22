// src/app/pages/veterinaria-admin/veterinaria-admin.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SucursalService } from '../../services/sucursal.service';
import { SucursalFormComponent } from '../../components/sucursal-form/sucursal-form.component';

@Component({
  selector: 'app-veterinaria-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './veterinaria-admin.component.html',
  styleUrl: './veterinaria-admin.component.scss'
})
export class VeterinariaAdminComponent implements OnInit {
  veterinariaId!: number;
  sucursales: any[] = [];
  columnas: string[] = ['logo', 'nombre', 'direccion', 'telefono', 'estado', 'acciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sucursalService: SucursalService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.veterinariaId = Number(this.route.snapshot.paramMap.get('veterinariaId'));
    this.obtenerSucursales();
  }

  obtenerSucursales() {
    this.sucursalService.getSucursalesPorVeterinaria(this.veterinariaId).subscribe({
      next: (res: any) => this.sucursales = res,
      error: (err) => console.error('Error al obtener sucursales', err)
    });
  }

  crearSucursal() {
    const dialogRef = this.dialog.open(SucursalFormComponent, {
      width: '500px',
      data: { veterinaria_id: this.veterinariaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.obtenerSucursales();
    });
  }

  editarSucursal(sucursal: any) {
    const dialogRef = this.dialog.open(SucursalFormComponent, {
      width: '500px',
      data: {
        veterinaria_id: this.veterinariaId,
        sucursal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.obtenerSucursales();
    });
  }

  eliminarSucursal(id: number) {
    const confirmado = confirm('Seguro que deseas eliminar esta sucursal?');
    if (confirmado) {
      this.sucursalService.deleteSucursal(id).subscribe(() => this.obtenerSucursales());
    }
  }

  irADashboard(sucursal: any) {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      sucursal.sucursal_id,
      'dashboard',
      'clientes'
    ]);
  }

  volverAVeterinarias() {
    this.router.navigate(['/veterinarias']);
  }
}
