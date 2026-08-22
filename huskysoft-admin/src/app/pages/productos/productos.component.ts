// src/app/pages/productos/productos.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';
import { ProductoFormComponent } from '../../components/producto-form/producto-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'] // Opcional si quieres estilos personalizados
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);
  private dialog = inject(MatDialog);

  productos: any[] = [];
  columnas: string[] = [
    'foto_producto',
    'nombre_producto',
    'categoria_producto',
    'precioVenta_producto',
    'producto_estado',
    'acciones'
  ];

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  abrirFormulario(producto?: any) {
    const dialogRef = this.dialog.open(ProductoFormComponent, {
      data: producto
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarProductos();
    });
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => this.cargarProductos());
    }
  }
}
