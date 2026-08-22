// src/app/pages/configuracion/vacunas/vacunas.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { VacunaService } from '../../../services/vacuna.service';
import { VacunaFormComponent } from '../../../components/vacuna-form/vacuna-form.component';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule          // 👈 IMPORTANTE para que funcione [routerLink]
  ],
  templateUrl: './vacunas.component.html',
  styleUrls: ['./vacunas.component.scss']
})
export class VacunasComponent implements OnInit {

  vacunas: any[] = [];

  displayedColumns: string[] = [
    'nombre',
    'laboratorio',
    'especies',
    'frecuencia',
    'detalles',
    'acciones'
  ];

  private vacunaService = inject(VacunaService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.cargarVacunas();
  }

  cargarVacunas(): void {
    this.vacunaService.getVacunas().subscribe({
      next: (rows: any[]) => (this.vacunas = rows),
      error: (err: any) => console.error('Error al obtener vacunas', err)
    });
  }

  nuevaVacuna(): void {
    const ref = this.dialog.open(VacunaFormComponent, {
      width: '600px',
      data: null
    });

    ref.afterClosed().subscribe((recargar: boolean) => {
      if (recargar) {
        this.cargarVacunas();
      }
    });
  }

  editarVacuna(vacuna: any): void {
    const ref = this.dialog.open(VacunaFormComponent, {
      width: '600px',
      data: { vacuna }
    });

    ref.afterClosed().subscribe((recargar: boolean) => {
      if (recargar) {
        this.cargarVacunas();
      }
    });
  }

  eliminarVacuna(vacuna: any): void {
    const ok = confirm(`¿Eliminar la vacuna "${vacuna.vacuna_nombre}"?`);
    if (!ok) return;

    this.vacunaService.eliminarVacuna(vacuna.vacuna_id).subscribe({
      next: () => this.cargarVacunas(),
      error: (err: any) => console.error('Error al eliminar vacuna', err)
    });
  }
}



