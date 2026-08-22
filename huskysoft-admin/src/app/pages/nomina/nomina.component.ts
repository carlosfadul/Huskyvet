import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NominaService, Nomina } from '../../services/nomina.service';
import { NominaFormComponent } from '../../components/nomina-form/nomina-form.component';

@Component({
  selector: 'app-nomina',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule
  ],
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {
  nominas: MatTableDataSource<Nomina> = new MatTableDataSource<Nomina>([]);
  columnas = [
    'nomina_fecha',
    'nomina_periodo_inicio',
    'nomina_periodo_fin',
    'nomina_estado',
    'observaciones',
    'total_nomina',
    'acciones'
  ];

  sucursalId!: number;
  veterinariaId!: number;

  @ViewChild(MatTable) tablaNominas!: MatTable<any>; // 👈 permite forzar renderizado

  constructor(
    private route: ActivatedRoute,
    private nominaService: NominaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.sucursalId = Number(params.get('sucursalId'));
      this.veterinariaId = Number(params.get('veterinariaId'));
      this.obtenerNominas();
    });
  }

  obtenerNominas(): void {
    if (!this.sucursalId) return;
    console.log('📥 Consultando nóminas para sucursal:', this.sucursalId);
    this.nominaService.getNominasPorSucursal(this.sucursalId).subscribe({
      next: (data) => {
        console.log('✅ Nóminas recibidas:', data);
        this.nominas.data = data;
        setTimeout(() => this.tablaNominas?.renderRows()); // 👈 asegura el renderizado
      },
      error: (err) => console.error('❌ Error al obtener nóminas:', err)
    });
  }

  abrirFormulario(nomina?: Nomina): void {
    const ref = this.dialog.open(NominaFormComponent, {
      width: '600px',
      data: {
        nomina: nomina ?? null,
        sucursal_id: this.sucursalId,
        usuario_id: 1
      }
    });

    ref.afterClosed().subscribe(resultado => {
      console.log('📤 Resultado del formulario:', resultado);
      if (resultado === 'created' || resultado === 'updated') {
        this.obtenerNominas();
      }
    });
  }

  eliminarNomina(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta nómina?')) return;
    this.nominaService.deleteNomina(id).subscribe({
      next: () => {
        console.log('✅ Nómina eliminada correctamente');
        this.obtenerNominas();
      },
      error: (err) => {
        console.error('❌ Error al eliminar la nómina:', err);
        alert('Hubo un error al intentar eliminar la nómina. Por favor, intenta de nuevo.');
      }
    });
  }

  verDetalleNomina(nomina: Nomina): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'nomina',
      nomina.nomina_id,
      'detalle'
    ]);
  }

  volverASucursales(): void {
  this.router.navigate([
    '/veterinaria',
    this.veterinariaId,
    'admin'
  ]);
}


  trackByNominaId(index: number, item: Nomina): number {
    return item.nomina_id!;
  }
}


