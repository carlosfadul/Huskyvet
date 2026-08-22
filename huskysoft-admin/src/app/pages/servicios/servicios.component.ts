// src/app/pages/servicios/servicios.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { ServicioService } from '../../services/servicio.service';
import { ServicioFormComponent } from '../../components/servicio-form/servicio-form.component';

@Component({
  selector: 'app-servicios',
  standalone: true,
  templateUrl: './servicios.component.html',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class ServiciosComponent implements OnInit {
  private servicioService = inject(ServicioService);
  private dialog = inject(MatDialog);

  servicios: any[] = [];
  columnas: string[] = [
    'servicio_nombre',
    'servicio_tipo',
    'servicio_precio',
    'servicio_duracion',
    'servicio_estado',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioService.getServicios().subscribe((data: any[]) => {
      this.servicios = data;
    });
  }

  abrirFormulario(servicio?: any): void {
    const dialogRef = this.dialog.open(ServicioFormComponent, {
      data: servicio
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) this.cargarServicios();
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe(() => this.cargarServicios());
    }
  }
}

