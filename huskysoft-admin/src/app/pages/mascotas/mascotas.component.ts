// http://localhost:4200/veterinaria/26/sucursal/20/dashboard/mascotas
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MascotaService } from '../../services/mascota.service';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MascotaFormComponent } from '../../components/mascota-form/mascota-form.component';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  template: `
    <div class="app-fondo">
      <div class="app-contenido">
        <mat-card>
          <div class="header">
            <h2>Mascotas de la Sucursal</h2>

            <div class="acciones-header">
              <button
                mat-flat-button
                color="primary"
                (click)="nuevaMascota()">
                <mat-icon>add</mat-icon>
                Nueva Mascota
              </button>

              <button
                mat-stroked-button
                color="accent"
                (click)="volverASucursales()">
                ← Volver a Sucursales
              </button>
            </div>
          </div>

          <table
            mat-table
            [dataSource]="mascotas"
            class="mat-elevation-z8"
            *ngIf="mascotas.length">

            <!-- Foto -->
            <ng-container matColumnDef="foto">
              <th mat-header-cell *matHeaderCellDef>Foto</th>
              <td mat-cell *matCellDef="let m">
                <img
                  [src]="'http://localhost:3000/api/mascotas/' + m.mascota_id + '/foto'"
                  width="50"
                  height="50"
                  style="object-fit: cover; border-radius: 8px;"
                  *ngIf="m.mascota_foto">
              </td>
            </ng-container>

            <!-- Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let m">{{ m.mascota_nombre }}</td>
            </ng-container>

            <!-- Especie -->
            <ng-container matColumnDef="especie">
              <th mat-header-cell *matHeaderCellDef>Especie</th>
              <td mat-cell *matCellDef="let m">{{ m.mascota_especie }}</td>
            </ng-container>

            <!-- Sexo -->
            <ng-container matColumnDef="sexo">
              <th mat-header-cell *matHeaderCellDef>Sexo</th>
              <td mat-cell *matCellDef="let m">{{ m.mascota_sexo }}</td>
            </ng-container>

            <!-- Estado -->
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let m">{{ m.mascota_estado }}</td>
            </ng-container>

            <!-- Dueño -->
            <ng-container matColumnDef="dueno">
              <th mat-header-cell *matHeaderCellDef>Dueño</th>
              <td mat-cell *matCellDef="let m">
                {{ m.cliente_nombre }} {{ m.cliente_apellido }} ({{ m.cliente_cedula }})
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let m">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="verMascota(m)">
                  <mat-icon>visibility</mat-icon>
                </button>

                <button
                  mat-icon-button
                  color="accent"
                  (click)="editarMascota(m)">
                  <mat-icon>edit</mat-icon>
                </button>

                <button
                  mat-icon-button
                  color="warn"
                  (click)="eliminarMascota(m.mascota_id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columnas"></tr>
            <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
          </table>

          <p *ngIf="mascotas.length === 0">
            No hay mascotas registradas.
          </p>
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

    mat-card {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .acciones-header {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    table {
      width: 100%;
    }
  `]
})
export class MascotasComponent implements OnInit {
  mascotas: any[] = [];
  columnas: string[] = ['foto', 'nombre', 'especie', 'sexo', 'estado', 'dueno', 'acciones'];
  sucursalId!: number;
  veterinariaId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const parentParams = this.route.parent?.snapshot.paramMap;
    this.sucursalId = Number(parentParams?.get('sucursalId'));
    this.veterinariaId = Number(parentParams?.get('veterinariaId'));
    this.obtenerMascotas();
  }

  obtenerMascotas(): void {
    this.mascotaService.getMascotasPorSucursal(this.sucursalId).subscribe({
      next: (res: any) => this.mascotas = res,
      error: (err: any) => console.error('Error al obtener mascotas', err)
    });
  }

  nuevaMascota(): void {
    this.abrirFormularioMascota();
  }

  editarMascota(mascota: any): void {
    this.abrirFormularioMascota(mascota);
  }

  private abrirFormularioMascota(mascota?: any): void {
    const dialogRef = this.dialog.open(MascotaFormComponent, {
      width: '600px',
      data: {
        mascota,
        clienteId: mascota?.cliente_id || null,
        sucursalId: this.sucursalId,
        veterinariaId: this.veterinariaId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.obtenerMascotas();
      }
    });
  }

  verMascota(mascota: any): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'mascotas',
      mascota.mascota_id,
      'detalle'
    ]);
  }

  eliminarMascota(id: number): void {
    const confirmado = confirm('¿Estás seguro de eliminar esta mascota?');
    if (!confirmado) { return; }

    this.mascotaService.deleteMascota(id).subscribe({
      next: () => this.obtenerMascotas(),
      error: (err: any) => console.error('Error al eliminar mascota', err)
    });
  }

  volverASucursales(): void {
    this.router.navigate(['/veterinaria', this.veterinariaId, 'admin']);
  }
}
