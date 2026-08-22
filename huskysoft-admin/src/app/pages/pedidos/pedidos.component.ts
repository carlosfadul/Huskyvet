// src/app/pages/pedidos/pedidos.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PedidoService, Pedido } from '../../services/pedido.service';
import { PedidoFormComponent } from '../../components/pedido-form/pedido-form.component';

@Component({
  selector: 'app-pedidos',
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
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit {
  sucursalId!: number;
  veterinariaId!: number;

  dataSource = new MatTableDataSource<Pedido>([]);
  displayedColumns: string[] = [
    'pedido_id',
    'pedido_fecha',
    'proveedor_id',
    'total',
    'pedido_estado',
    'acciones'
  ];

  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  this.route.parent?.paramMap.subscribe(params => {
    this.sucursalId = Number(params.get('sucursalId'));
    this.veterinariaId = Number(params.get('veterinariaId'));
    this.cargarPedidos();
  });
}

  cargarPedidos(): void {
    if (!this.sucursalId) return;

    this.cargando = true;
    this.pedidoService.getPedidosPorSucursal(this.sucursalId).subscribe({
      next: pedidos => {
        this.dataSource.data = pedidos;
      },
      error: err => {
        console.error('Error al obtener pedidos', err);
        this.snackBar.open('Error al obtener los pedidos', 'Cerrar', {
          duration: 3000
        });
      },
      complete: () => (this.cargando = false)
    });
  }

  nuevoPedido(): void {
    const dialogRef = this.dialog.open(PedidoFormComponent, {
      width: '500px',
      data: {
        sucursalId: this.sucursalId,
        veterinariaId: this.veterinariaId,
        pedido: null
      }
    });

    dialogRef.afterClosed().subscribe(guardado => {
      if (guardado) {
        this.cargarPedidos();
      }
    });
  }

  editarPedido(pedido: Pedido): void {
    const dialogRef = this.dialog.open(PedidoFormComponent, {
      width: '500px',
      data: {
        sucursalId: this.sucursalId,
        veterinariaId: this.veterinariaId,
        pedido
      }
    });

    dialogRef.afterClosed().subscribe(guardado => {
      if (guardado) {
        this.cargarPedidos();
      }
    });
  }

  eliminarPedido(pedido: Pedido): void {
    const confirmado = confirm(
      `¿Seguro que deseas eliminar el pedido #${pedido.pedido_id}?`
    );
    if (!confirmado) return;

    this.pedidoService.deletePedido(pedido.pedido_id).subscribe({
      next: () => {
        this.snackBar.open('Pedido eliminado', 'Cerrar', { duration: 2000 });
        this.cargarPedidos();
      },
      error: err => {
        console.error('Error al eliminar pedido', err);
        this.snackBar.open('Error al eliminar el pedido', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

 volverASucursales(): void {
  this.router.navigate(['/veterinaria', this.veterinariaId, 'admin'], { replaceUrl: true });
}

}
