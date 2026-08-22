import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { DesparasitanteService } from '../../../services/desparasitante.service';
import { DesparasitanteFormComponent } from '../../../components/desparasitante-form/desparasitante-form.component';

@Component({
  selector: 'app-desparasitantes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './desparasitantes.component.html',
  styleUrls: ['./desparasitantes.component.scss']
})
export class DesparasitantesComponent implements OnInit {

  displayedColumns: string[] = [
    'nombre',
    'laboratorio',
    'tipo',
    'especie',
    'peso',
    'acciones'
  ];

  desparasitantes: any[] = [];
  veterinariaId!: number;
  sucursalId!: number;

  constructor(
    private desparasitanteService: DesparasitanteService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.veterinariaId = Number(this.route.snapshot.paramMap.get('veterinariaId'));
    this.sucursalId = Number(this.route.snapshot.paramMap.get('sucursalId'));
    this.cargarDesparasitantes();
  }

  cargarDesparasitantes(): void {
    this.desparasitanteService.getDesparasitantes().subscribe({
      next: (rows: any[]) => (this.desparasitantes = rows),
      error: (err: any) =>
        console.error('Error al obtener desparasitantes', err)
    });
  }

  volver(): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'configuracion'
    ]);
  }

  abrirForm(desparasitante?: any): void {
    const ref = this.dialog.open(DesparasitanteFormComponent, {
      width: '600px',
      data: { desparasitante }
    });

    ref.afterClosed().subscribe((guardado: boolean) => {
      if (guardado) {
        this.cargarDesparasitantes();
      }
    });
  }

  eliminar(desparasitante: any): void {
    if (!confirm('¿Eliminar este desparasitante?')) return;

    this.desparasitanteService
      .deleteDesparasitante(desparasitante.desparasitante_id)
      .subscribe({
        next: () => this.cargarDesparasitantes(),
        error: (err: any) =>
          console.error('Error al eliminar desparasitante', err)
      });
  }
}
