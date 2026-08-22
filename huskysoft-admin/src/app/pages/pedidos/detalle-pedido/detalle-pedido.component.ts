// src/app/pages/pedidos/detalle-pedido/detalle-pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  DetallePedido,
  DetallePedidoService
} from '../../../services/detalle-pedido.service';
import { DetallePedidoFormComponent } from '../../../components/detalle-pedido-form/detalle-pedido-form.component';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './detalle-pedido.component.html'
})
export class DetallePedidoComponent implements OnInit {
  veterinariaId!: number;
  sucursalId!: number;
  pedidoId!: number;

  dataSource = new MatTableDataSource<DetallePedido>([]);
  displayedColumns: string[] = [
    'detallePedido_id',
    'producto_id',
    'detallePedido_cantidad',
    'cantidad_recibida',
    'detallePedido_precio',
    'subtotal',
    'acciones'
  ];

  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detallePedidoService: DetallePedidoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.veterinariaId = Number(this.route.snapshot.paramMap.get('veterinariaId'));
    this.sucursalId = Number(this.route.snapshot.paramMap.get('sucursalId'));
    this.pedidoId = Number(this.route.snapshot.paramMap.get('pedidoId'));

    this.cargarDetalles();
  }

  cargarDetalles(): void {
    this.cargando = true;
    this.detallePedidoService.getPorPedido(this.pedidoId).subscribe({
      next: (detalles) => {
        this.dataSource.data = detalles;
      },
      error: (err) => {
        console.error('Error al obtener detalles del pedido', err);
        this.snackBar.open('Error al obtener los detalles del pedido', 'Cerrar', {
          duration: 3000
        });
      },
      complete: () => (this.cargando = false)
    });
  }

  volver(): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'pedidos'
    ]);
  }

  nuevoItem(): void {
    const dialogRef = this.dialog.open(DetallePedidoFormComponent, {
      width: '600px',
      data: {
        pedidoId: this.pedidoId,
        detalle: null
      }
    });

    dialogRef.afterClosed().subscribe((guardado) => {
      if (guardado) this.cargarDetalles();
    });
  }

  editarItem(detalle: DetallePedido): void {
    const dialogRef = this.dialog.open(DetallePedidoFormComponent, {
      width: '600px',
      data: {
        pedidoId: this.pedidoId,
        detalle
      }
    });

    dialogRef.afterClosed().subscribe((guardado) => {
      if (guardado) this.cargarDetalles();
    });
  }

  eliminarItem(detalle: DetallePedido): void {
    const confirmado = confirm(
      `¿Seguro que deseas eliminar el ítem #${detalle.detallePedido_id}?`
    );
    if (!confirmado) return;

    this.detallePedidoService.eliminar(detalle.detallePedido_id!).subscribe({
      next: () => {
        this.snackBar.open('Ítem eliminado', 'Cerrar', { duration: 2000 });
        this.cargarDetalles();
      },
      error: (err) => {
        console.error('Error al eliminar detalle de pedido', err);
        this.snackBar.open('Error al eliminar el ítem', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  get totalPedido(): number {
    return this.dataSource.data.reduce(
      (acc, it) => acc + it.detallePedido_cantidad * it.detallePedido_precio,
      0
    );
  }
}
