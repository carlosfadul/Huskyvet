// src/app/pages/aliados/aliados.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AliadoService } from '../../services/aliado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AliadoFormComponent } from '../../components/aliado-form/aliado-form.component';

@Component({
  selector: 'app-aliados',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './aliados.component.html',
  styleUrls: ['./aliados.component.scss']
})
export class AliadosComponent implements OnInit {

  private aliadoService = inject(AliadoService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  aliados: any[] = [];

  columnas: string[] = [
    'nombre_aliado',
    'direccion_aliado',
    'telefono_aliado',
    'email_aliado',
    'nit_aliado',
    'aliado_estado',
    'acciones'
  ];

  veterinariaId!: string;
  sucursalId!: string;

  ngOnInit(): void {

    const r = this.route.parent ?? this.route;

    this.veterinariaId = r.snapshot.paramMap.get('veterinariaId')!;
    this.sucursalId = r.snapshot.paramMap.get('sucursalId')!;

    console.log('🟢 VeterinariaId:', this.veterinariaId);
    console.log('🟢 sucursalId:', this.sucursalId);

    if (!this.sucursalId) {
      console.error('⛔ ERROR: sucursalId es requerido');
      return;
    }

    this.cargarAliados();
  }

  cargarAliados(): void {
    this.aliadoService.getAliadosPorSucursal(this.sucursalId).subscribe({
      next: (data) => this.aliados = data,
      error: (err) => console.error('Error cargando aliados', err)
    });
  }

  abrirFormulario(aliado?: any): void {
    const dialogRef = this.dialog.open(AliadoFormComponent, {
      width: '600px',
      data: {
        ...aliado,
        sucursal_id: this.sucursalId
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.cargarAliados();
    });
  }

  eliminarAliado(id: number): void {
    if (!confirm('¿Eliminar este aliado?')) return;

    this.aliadoService.eliminarAliado(id).subscribe({
      next: () => this.cargarAliados(),
      error: (err) => console.error('Error eliminando aliado', err)
    });
  }

  irServiciosAliado(aliadoId: number): void {
    this.router.navigate([
      '/veterinaria', this.veterinariaId,
      'sucursal', this.sucursalId,
      'dashboard', 'aliados',
      aliadoId, 'servicios'
    ]);
  }

  volver(): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard/configuracion'
    ]);
  }
}
