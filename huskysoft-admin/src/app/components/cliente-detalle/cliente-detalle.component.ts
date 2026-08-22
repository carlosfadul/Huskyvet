//http://localhost:4200/veterinaria/26/sucursal/20/dashboard/clientes/9/detalle
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MascotaService } from '../../services/mascota.service';
import { ClienteService } from '../../services/cliente.service';
import { MascotaFormComponent } from '../mascota-form/mascota-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MascotaDetalleComponent } from '../mascota-detalle/mascota-detalle.component';

@Component({
  selector: 'app-cliente-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="app-contenido">
      <mat-card>
        <h2>Detalle del Cliente</h2>

        <div class="acciones">
          <button mat-stroked-button color="accent" (click)="volverAClientes()">← Volver a Clientes</button>
          <button mat-raised-button color="primary" (click)="abrirFormularioMascota()">+ Nueva Mascota</button>
        </div>

        <p><strong>Cédula:</strong> {{ cliente?.cliente_cedula }}</p>
        <p><strong>Nombre:</strong> {{ cliente?.cliente_nombre }} {{ cliente?.cliente_apellido }}</p>
        <p><strong>Dirección:</strong> {{ cliente?.cliente_direccion }}</p>
        <p><strong>Teléfono:</strong> {{ cliente?.cliente_telefono }}</p>
        <p><strong>Email:</strong> {{ cliente?.cliente_email }}</p>
        <p><strong>Detalles:</strong> {{ cliente?.cliente_detalles }}</p>
        <p><strong>Estado:</strong> {{ cliente?.cliente_estado }}</p>

        <hr>
        <h3>Mascotas del Cliente</h3>

        <table mat-table [dataSource]="mascotas" class="mat-elevation-z8" *ngIf="mascotas.length">

          <ng-container matColumnDef="foto">
            <th mat-header-cell *matHeaderCellDef>Foto</th>
            <td mat-cell *matCellDef="let m">
              <img [src]="'http://localhost:3000/api/mascotas/' + m.mascota_id + '/foto'" width="50" height="50"
                style="object-fit: cover; border-radius: 8px;" *ngIf="m.mascota_foto">
            </td>
          </ng-container>

          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_nombre }}</td>
          </ng-container>

          <ng-container matColumnDef="especie">
            <th mat-header-cell *matHeaderCellDef>Especie</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_especie }}</td>
          </ng-container>

          <ng-container matColumnDef="raza">
            <th mat-header-cell *matHeaderCellDef>Raza</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_raza }}</td>
          </ng-container>

          <ng-container matColumnDef="sexo">
            <th mat-header-cell *matHeaderCellDef>Sexo</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_sexo }}</td>
          </ng-container>

          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef>Nacimiento</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_fecha_nac }}</td>
          </ng-container>

          <ng-container matColumnDef="color">
            <th mat-header-cell *matHeaderCellDef>Color</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_color }}</td>
          </ng-container>

          <ng-container matColumnDef="peso">
            <th mat-header-cell *matHeaderCellDef>Peso</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_peso }} kg</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let m">{{ m.mascota_estado }}</td>
          </ng-container>

          <ng-container matColumnDef="dueno">
            <th mat-header-cell *matHeaderCellDef>Dueño</th>
            <td mat-cell *matCellDef="let m">
              {{ m.cliente_nombre }} {{ m.cliente_apellido }} ({{ m.cliente_cedula }})
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let m">
              <button mat-icon-button color="accent" (click)="verMascota(m)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="editarMascota(m)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="eliminarMascota(m.mascota_id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnasMascota"></tr>
          <tr mat-row *matRowDef="let row; columns: columnasMascota;"></tr>
        </table>

        <p *ngIf="!mascotas.length">Este cliente no tiene mascotas registradas.</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .app-contenido {
      padding: 20px;
    }

    mat-card {
      padding: 24px;
      border-radius: 12px;
    }

    .acciones {
      margin-bottom: 15px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  `]
})
export class ClienteDetalleComponent implements OnInit {
  veterinariaId!: number;
  sucursalId!: number;
  clienteId!: number;
  cliente: any;
  mascotas: any[] = [];

  columnasMascota: string[] = [
    'foto',
    'nombre',
    'especie',
    'raza',
    'sexo',
    'fecha',
    'color',
    'peso',
    'estado',
    'dueno',
    'acciones'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const parentParams = this.route.parent?.parent?.snapshot.paramMap;
    const currentParams = this.route.snapshot.paramMap;

    this.veterinariaId = Number(parentParams?.get('veterinariaId'));
    this.sucursalId = Number(parentParams?.get('sucursalId'));
    this.clienteId = Number(currentParams.get('clienteId'));

    this.obtenerCliente();
    this.obtenerMascotas();
  }

  obtenerCliente() {
    this.clienteService.getClienteById(this.clienteId).subscribe({
      next: (res) => this.cliente = res,
      error: (err) => console.error('Error al obtener cliente', err)
    });
  }

  obtenerMascotas() {
    this.mascotaService.getMascotasPorCliente(this.clienteId).subscribe({
      next: (res: any) => this.mascotas = res,
      error: err => console.error('Error al obtener mascotas', err)
    });
  }

  abrirFormularioMascota() {
    const dialogRef = this.dialog.open(MascotaFormComponent, {
      width: '500px',
      data: { cliente_id: this.clienteId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created' || result === 'updated') {
        this.obtenerMascotas();
      }
    });
  }

  verMascota(mascota: any) {
    this.dialog.open(MascotaDetalleComponent, {
      width: '400px',
      data: mascota
    });
  }

  editarMascota(mascota: any) {
    const dialogRef = this.dialog.open(MascotaFormComponent, {
      width: '500px',
      data: { mascota, cliente_id: this.clienteId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.obtenerMascotas();
      }
    });
  }

  eliminarMascota(id: number) {
    const confirmado = confirm('¿Estás seguro de eliminar esta mascota?');
    if (confirmado) {
      this.mascotaService.deleteMascota(id).subscribe(() => {
        this.obtenerMascotas();
      });
    }
  }

  volverAClientes() {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'clientes'
    ]);
  }
}
