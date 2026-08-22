//http://localhost:4200/veterinaria/26/sucursal/20/dashboard/clientes
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule
  ],
  template: `
    <div class="app-fondo">
      <div class="app-contenido">
        <mat-card>
          <h2>Clientes de la Sucursal</h2>

          <div class="acciones">
            <button mat-raised-button color="primary" (click)="abrirFormulario()">+ Nuevo Cliente</button>
            <button mat-stroked-button color="accent" (click)="volverASucursales()">← Volver a Sucursales</button>
          </div>

          <table mat-table [dataSource]="clientes" class="mat-elevation-z8" *ngIf="clientes.length">
            <ng-container matColumnDef="cliente_nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_nombre }} {{ c.cliente_apellido }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente_cedula">
              <th mat-header-cell *matHeaderCellDef>Cédula</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_cedula }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente_direccion">
              <th mat-header-cell *matHeaderCellDef>Dirección</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_direccion }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente_telefono">
              <th mat-header-cell *matHeaderCellDef>Teléfono</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_telefono }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente_email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_email }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente_detalles">
              <th mat-header-cell *matHeaderCellDef>Detalles</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_detalles }}</td>
            </ng-container>

            <ng-container matColumnDef="cliente_estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let c">{{ c.cliente_estado }}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let c">
                <button mat-icon-button color="accent" (click)="verDetalleCliente(c.cliente_id)">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="primary" (click)="abrirFormulario(c)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarCliente(c.cliente_id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnas"></tr>
            <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
          </table>

          <p *ngIf="clientes.length === 0">No hay clientes registrados.</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .app-fondo {
      background-image: url('/assets/fondos/fondo-huskyvet.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      min-height: 100vh;
      padding: 20px;
    }

    .app-contenido {
      background-color: rgba(255, 255, 255, 0.85);
      border-radius: 12px;
      padding: 20px;
    }

    .acciones {
      margin-bottom: 15px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    mat-card {
      padding: 24px;
    }
  `]
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  columnas: string[] = [
    'cliente_nombre',
    'cliente_cedula',
    'cliente_direccion',
    'cliente_telefono',
    'cliente_email',
    'cliente_detalles',
    'cliente_estado',
    'acciones'
  ];
  sucursalId!: number;
  veterinariaId!: number;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(params => {
      this.sucursalId = Number(params.get('sucursalId'));
      this.veterinariaId = Number(params.get('veterinariaId'));
      this.obtenerClientes();
    });
  }

  obtenerClientes() {
    this.clienteService.getClientesPorSucursal(this.sucursalId).subscribe({
      next: (res: any) => this.clientes = res,
      error: err => console.error('Error al obtener clientes', err)
    });
  }

  abrirFormulario(cliente: any = null) {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
      width: '400px',
      data: {
        cliente,
        sucursal_id: this.sucursalId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created' || result === 'updated') {
        this.obtenerClientes();
      }
    });
  }

  eliminarCliente(id: number) {
    const confirmado = confirm('¿Estás seguro de eliminar este cliente?');
    if (confirmado) {
      this.clienteService.deleteCliente(id).subscribe(() => {
        this.obtenerClientes();
      });
    }
  }

  verDetalleCliente(clienteId: number) {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'clientes',
      clienteId,
      'detalle'
    ]);
  }

  volverASucursales() {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'admin'
    ]);
  }
}

