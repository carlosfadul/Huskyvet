// src/app/pages/ventas/ventas.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { VentaService, Venta } from '../../services/venta.service';
import { VentaFormComponent } from '../../components/venta-form/venta-form.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './ventas.component.html',
  styles: [`
    .page-container {
      padding: 24px;
      min-height: 100vh;
      background-color: #f0f4f5;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 28px;
      gap: 16px;
      flex-wrap: wrap;
    }
    .page-title-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .page-title-group h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }
    .page-subtitle {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }
    .header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-back {
      border-radius: 10px !important;
      border-color: #d1d5db !important;
      color: #4b5563 !important;
      height: 42px !important;
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }
    .btn-primary {
      background-color: #00a896 !important;
      color: #fff !important;
      border-radius: 10px !important;
      padding: 0 20px !important;
      height: 42px !important;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .table-card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }
    .full-width-table {
      width: 100%;
    }
    .cell-strong {
      font-weight: 600;
      color: #1f2937;
    }
    .actions-header {
      width: 140px;
      text-align: right;
    }
    .actions-cell {
      display: flex;
      gap: 4px;
      justify-content: flex-end;
    }
    .estado-pendiente {
      color: #b45309;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 999px;
      background-color: rgba(245, 158, 11, 0.12);
      font-size: 12px;
      display: inline-block;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px 20px;
      text-align: center;
    }
    .empty-state mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #d1d5db;
      margin-bottom: 16px;
    }
    .empty-state p {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #374151;
    }
    .empty-state span {
      font-size: 14px;
      color: #9ca3af;
    }
  `]
})
export class VentasComponent implements OnInit {
  sucursalId!: number;
  veterinariaId!: number;

  dataSource = new MatTableDataSource<Venta>([]);
  displayedColumns: string[] = [
    'venta_id',
    'cliente_id',
    'venta_fecha',
    'venta_estado',
    'total',
    'metodo_pago',
    'acciones'
  ];

  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ventaService: VentaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  
  //---------------
  ngOnInit(): void {
  this.route.parent?.paramMap.subscribe(params => {
    this.sucursalId = Number(params.get('sucursalId'));
    this.veterinariaId = Number(params.get('veterinariaId'));
    this.cargarVentas();
  });
}

  cargarVentas(): void {
    if (!this.sucursalId) return;

    this.cargando = true;
    this.ventaService.getVentasPorSucursal(this.sucursalId).subscribe({
      next: ventas => {
        this.dataSource.data = ventas;
      },
      error: err => {
        console.error('Error al obtener las ventas', err);
        this.snackBar.open('Error al obtener las ventas', 'Cerrar', {
          duration: 3000
        });
      },
      complete: () => (this.cargando = false)
    });
  }

  nuevaVenta(): void {
    const dialogRef = this.dialog.open(VentaFormComponent, {
      width: '800px',
      data: {
        sucursalId: this.sucursalId,
        veterinariaId: this.veterinariaId,
        venta: null
      }
    });

    dialogRef.afterClosed().subscribe(guardado => {
      if (guardado) {
        this.cargarVentas();
      }
    });
  }

  editarVenta(venta: Venta): void {
    const dialogRef = this.dialog.open(VentaFormComponent, {
      width: '800px',
      data: {
        sucursalId: this.sucursalId,
        veterinariaId: this.veterinariaId,
        venta
      }
    });

    dialogRef.afterClosed().subscribe(guardado => {
      if (guardado) {
        this.cargarVentas();
      }
    });
  }

  eliminarVenta(venta: Venta): void {
    const confirmado = confirm(
      `¿Seguro que deseas eliminar la venta #${venta.venta_id}?`
    );
    if (!confirmado) return;

    this.ventaService.deleteVenta(venta.venta_id!).subscribe({
      next: () => {
        this.snackBar.open('Venta eliminado', 'Cerrar', { duration: 2000 });
        this.cargarVentas();
      },
      error: err => {
        console.error('Error al eliminar la venta', err);
        this.snackBar.open('Error al eliminar la venta', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  // 👉 método usado internamente
  private verDetalleVenta(venta: Venta): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'venta',
      venta.venta_id!,
      'detalle'
    ]);
  }

  // 👉 alias para coincidir con el template (verDetalle(v))
  verDetalle(venta: Venta): void {
    this.verDetalleVenta(venta);
  }

  volverASucursales(): void {
  this.router.navigate(['/veterinaria', this.veterinariaId, 'admin'], { replaceUrl: true });
}

}
