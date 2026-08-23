// src/app/pages/ventas/detalle-venta/detalle-venta.component.ts

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { VentaService, Venta, DetalleVenta } from '../../../services/venta.service';
import { ProductoService } from '../../../services/producto.service';
import { MatSelectModule } from '@angular/material/select';

interface ProductoOption {
  producto_id: number;
  nombre_producto: string;
  precioVenta_producto: number;
  cantidad_producto: number;
}

@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './detalle-venta.component.html',
  styles: [`
    .acciones {
      margin-bottom: 16px;
    }

    .full-width-table {
      width: 100%;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class DetalleVentaComponent implements OnInit {

  veterinariaId!: number;
  sucursalId!: number;
  ventaId!: number;

  venta: Venta | null = null;
  productos: ProductoOption[] = [];

  columnas: string[] = [
    'detalleVenta_id',
    'nombre_producto',
    'detalleVenta_cantidad',
    'detalleVenta_precio',
    'descuento',
    'subtotal',
    'acciones'
  ];

  dataSource = new MatTableDataSource<DetalleVenta>([]);
  loading = false;

  detalleForm!: FormGroup;
  dialogRef?: MatDialogRef<any>;
  editandoDetalle: DetalleVenta | null = null;

  @ViewChild('detalleFormTemplate') detalleFormTemplate!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.veterinariaId = Number(this.route.parent?.snapshot.paramMap.get('veterinariaId'));
    this.sucursalId = Number(this.route.parent?.snapshot.paramMap.get('sucursalId'));
    this.ventaId = Number(this.route.snapshot.paramMap.get('ventaId'));

    this.detalleForm = this.fb.group({
      producto_id: [null, Validators.required],
      detalleVenta_cantidad: [1, [Validators.required, Validators.min(1)]],
      detalleVenta_precio: [0, [Validators.required, Validators.min(0)]],
      descuento: [0]
    });

    this.cargarVenta();
    this.cargarProductos();
    this.cargarDetalles();
  }

  volverAVentas(): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'ventas'
    ]);
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos: any) => this.productos = productos as ProductoOption[],
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  onProductoChange(): void {
    const id = this.detalleForm.value.producto_id;
    const prod = this.productos.find(p => p.producto_id === id);
    if (prod) {
      this.detalleForm.patchValue({ detalleVenta_precio: prod.precioVenta_producto });
    }
  }

  cargarVenta(): void {
    this.ventaService.getVentaById(this.ventaId).subscribe({
      next: (v) => this.venta = v,
      error: (err) => console.error('Error al obtener venta', err)
    });
  }

  cargarDetalles(): void {
    this.loading = true;
    this.ventaService.getDetalleVentaPorVenta(this.ventaId).subscribe({
      next: (detalles) => {
        this.dataSource.data = detalles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener detalle de venta', err);
        this.snackBar.open('Error al obtener el detalle de la venta', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  abrirFormularioDetalle(detalle?: DetalleVenta): void {
    this.editandoDetalle = detalle || null;

    if (detalle) {
      this.detalleForm.patchValue({
        producto_id: detalle.producto_id,
        detalleVenta_cantidad: detalle.detalleVenta_cantidad,
        detalleVenta_precio: detalle.detalleVenta_precio,
        descuento: detalle.descuento ?? 0
      });
    } else {
      this.detalleForm.reset({
        producto_id: null,
        detalleVenta_cantidad: 1,
        detalleVenta_precio: 0,
        descuento: 0
      });
    }

    this.dialogRef = this.dialog.open(this.detalleFormTemplate, {
      width: '400px'
    });
  }

  guardarDetalle(): void {
    if (this.detalleForm.invalid) return;

    const formValue = this.detalleForm.value;

    const detalle: DetalleVenta = {
      venta_id: this.ventaId,
      producto_id: formValue.producto_id,
      detalleVenta_cantidad: formValue.detalleVenta_cantidad,
      detalleVenta_precio: formValue.detalleVenta_precio,
      descuento: formValue.descuento ?? 0
    };

    let peticion$;

    if (this.editandoDetalle && this.editandoDetalle.detalleVenta_id) {
      peticion$ = this.ventaService.updateDetalleVenta(this.editandoDetalle.detalleVenta_id, detalle);
    } else {
      peticion$ = this.ventaService.createDetalleVenta(detalle);
    }

    peticion$.subscribe({
      next: () => {
        this.snackBar.open('Detalle guardado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef?.close();
        this.cargarDetalles();
      },
      error: (err) => {
        console.error('Error al guardar detalle', err);
        this.snackBar.open('Error al guardar el detalle', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarDetalle(detalle: DetalleVenta): void {
    if (!detalle.detalleVenta_id) return;
    const confirmado = confirm('¿Seguro que deseas eliminar este detalle?');
    if (!confirmado) return;

    this.ventaService.deleteDetalleVenta(detalle.detalleVenta_id).subscribe({
      next: () => {
        this.snackBar.open('Detalle eliminado', 'Cerrar', { duration: 3000 });
        this.cargarDetalles();
      },
      error: (err) => {
        console.error('Error al eliminar detalle', err);
        this.snackBar.open('Error al eliminar el detalle', 'Cerrar', { duration: 3000 });
      }
    });
  }
}

