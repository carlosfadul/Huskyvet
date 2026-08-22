// src/app/pages/veterinarias/veterinarias.component.ts
// http://localhost:4200/veterinarias

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { VeterinariaService } from '../../services/veterinaria.service';
import { VeterinariaFormComponent } from '../../components/veterinaria-form/veterinaria-form.component';

@Component({
  selector: 'app-veterinarias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './veterinarias.component.html',
  styleUrl: './veterinarias.component.scss'
})
export class VeterinariasComponent implements OnInit {
  veterinarias = new MatTableDataSource<any>();
  columnas: string[] = [
    'veterinaria_logo',
    'veterinaria_nombre',
    'veterinaria_nit',
    'veterinaria_telefono',
    'veterinaria_estado',
    'acciones'
  ];

  constructor(
    private veterinariaService: VeterinariaService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerVeterinarias();
  }

  obtenerVeterinarias() {
    this.veterinariaService.getVeterinarias().subscribe({
      next: (res: any) => {
        this.veterinarias = new MatTableDataSource(res);
        console.log('Veterinarias actualizadas:', this.veterinarias.data);
      },
      error: (err) => {
        console.error('Error al obtener veterinarias ❌', err);
      }
    });
  }

  // 🔹 Abrir panel / módulo principal de la veterinaria
  abrirVeterinaria(veterinaria: any) {
    console.log('Abriendo veterinaria', veterinaria.veterinaria_id);

    // ⬇️ Ajusta esta ruta a lo que tengas definido en tu app
    // Ejemplos:
    // this.router.navigate(['/veterinaria', veterinaria.veterinaria_id, 'admin']);
    // this.router.navigate(['/veterinaria', veterinaria.veterinaria_id, 'sucursales']);
    this.router.navigate(['/veterinaria', veterinaria.veterinaria_id, 'admin']);
  }

  editarVeterinaria(veterinaria: any) {
    this.abrirFormulario(veterinaria);
  }

  eliminarVeterinaria(id: number) {
    const confirmado = confirm('¿Estás seguro de eliminar esta veterinaria?');
    if (confirmado) {
      this.veterinariaService.deleteVeterinaria(id).subscribe(() => {
        console.log('Veterinaria eliminada con éxito ✅');
        this.obtenerVeterinarias();
      });
    }
  }

  abrirFormulario(veterinaria: any = null) {
    const dialogRef = this.dialog.open(VeterinariaFormComponent, {
      width: '400px',
      data: { veterinaria }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.obtenerVeterinarias();
      }
    });
  }
}
