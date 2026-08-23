import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ServicioAliadoService } from '../../../services/servicio-aliado.service';
import { ServicioAliadoFormComponent } from '../../../components/servicio-aliado-form/servicio-aliado-form.component';

@Component({
  selector: 'app-servicios-aliado',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './servicios-aliado.component.html',
  styleUrls: ['./servicios-aliado.component.scss']
})
export class ServiciosAliadoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicioAliadoService = inject(ServicioAliadoService);
  private dialog = inject(MatDialog);

  aliadoId!: number;
  servicios: any[] = [];

  displayedColumns = ['nombre', 'detalle', 'precio', 'estado', 'acciones'];

  ngOnInit(): void {
    this.aliadoId = Number(this.route.snapshot.paramMap.get('aliadoId'));
    this.cargarServicios();
  }

  volverAAliados(): void {
    this.router.navigate([
      '/veterinaria',
      this.obtenerParametroRuta('veterinariaId'),
      'sucursal',
      this.obtenerParametroRuta('sucursalId'),
      'dashboard',
      'configuracion',
      'aliados'
    ]);
  }

  private obtenerParametroRuta(nombre: string): number {
    let ruta: ActivatedRoute | null = this.route;
    while (ruta) {
      const valor = ruta.snapshot.paramMap.get(nombre);
      if (valor !== null) return Number(valor);
      ruta = ruta.parent;
    }
    return 0;
  }

  cargarServicios(): void {
    this.servicioAliadoService.getByAliado(this.aliadoId).subscribe({
      next: (rows) => this.servicios = rows,
      error: (err) => console.error('Error al obtener servicios del aliado', err)
    });
  }

  nuevoServicio(): void {
    const ref = this.dialog.open(ServicioAliadoFormComponent, {
      width: 'min(680px, calc(100vw - 32px))',
      maxWidth: 'calc(100vw - 32px)',
      data: { aliadoId: this.aliadoId }
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.cargarServicios();
    });
  }

  editar(servicio: any): void {
    const ref = this.dialog.open(ServicioAliadoFormComponent, {
      width: 'min(680px, calc(100vw - 32px))',
      maxWidth: 'calc(100vw - 32px)',
      data: { servicio }
    });

    ref.afterClosed().subscribe(ok => {
      if (ok) this.cargarServicios();
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este servicio?')) return;

    this.servicioAliadoService.delete(id).subscribe({
      next: () => this.cargarServicios(),
      error: (err) => console.error('Error al eliminar servicio', err)
    });
  }
}
