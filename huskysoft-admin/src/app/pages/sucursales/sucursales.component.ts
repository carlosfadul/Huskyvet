import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalService } from '../../services/sucursal.service';
import { SucursalFormComponent } from '../../components/sucursal-form/sucursal-form.component';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    SucursalFormComponent
  ],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'sucursal_logo',
    'sucursal_nombre',
    'sucursal_nit',
    'sucursal_direccion',
    'sucursal_telefono',
    'sucursal_estado',
    'acciones'
  ];
  
  dataSource = new MatTableDataSource<any>([]);
  veterinariaId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sucursalService: SucursalService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.veterinariaId = Number(params.get('veterinariaId'));
      this.obtenerSucursales();
    });
  }

  obtenerSucursales(): void {
    if (!this.veterinariaId) return;

    this.sucursalService.getSucursalesPorVeterinaria(this.veterinariaId)
      .subscribe({
        next: (res: any) => {
          this.dataSource.data = res || [];
        },
        error: err => {
          console.error('Error al obtener sucursales', err);
        }
      });
  }

  nuevaSucursal(): void {
    const dialogRef = this.dialog.open(SucursalFormComponent, {
      width: '600px',
      data: { veterinariaId: this.veterinariaId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.obtenerSucursales();
      }
    });
  }

  editarSucursal(sucursal: any): void {
    const dialogRef = this.dialog.open(SucursalFormComponent, {
      width: '600px',
      data: { 
        sucursal: sucursal,
        veterinariaId: this.veterinariaId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.obtenerSucursales();
      }
    });
  }

  eliminarSucursal(sucursal: any): void {
    const confirmado = confirm(`¿Estás seguro de eliminar la sucursal ${sucursal.sucursal_nombre}?`);
    if (!confirmado) return;

    this.sucursalService.deleteSucursal(sucursal.sucursal_id).subscribe({
      next: () => this.obtenerSucursales(),
      error: err => console.error('Error al eliminar sucursal', err)
    });
  }

  volverAlPanelVeterinaria(): void {
    this.router.navigate(['/veterinarias']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}