// src/app/components/venta-form/venta-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {
  VentaService,
  Venta,
  VentaCompletaRequest,
} from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { ProductoService } from '../../services/producto.service';

// Tipos locales
interface Cliente {
  cliente_id: number;
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_cedula: string;
}

interface Producto {
  producto_id: number;
  nombre_producto: string;
  precioVenta_producto: number;
  cantidad_producto: number;
}

interface ItemLinea {
  producto_id: number | null;
  cantidad: number;
  descuento: number;
  precio: number;
  subtotal: number;
}

export interface VentaFormData {
  veterinariaId: number;
  sucursalId: number;
  venta: Venta | null;
}

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,               // 👈 necesario para [(ngModel)]
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './venta-form.component.html',
  styles: [
    `
      .form-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
      }

      .full-width {
        width: 100%;
      }

      .totales {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      @media (max-width: 600px) {
        .totales {
          grid-template-columns: 1fr;
        }
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
      }

      .items-table th,
      .items-table td {
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 4px 8px;
        font-size: 13px;
      }

      .items-table th {
        background: rgba(0, 0, 0, 0.04);
      }

      .items-acciones {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
      }

      .resumen-totales {
        margin-top: 8px;
        text-align: right;
        font-size: 14px;
      }
    `,
  ],
})
export class VentaFormComponent implements OnInit {
  form: FormGroup;
  titulo = 'Nueva venta';
  guardando = false;

  estados = ['pendiente', 'completada', 'cancelada'];
  metodosPago = ['efectivo', 'tarjeta', 'transferencia', 'otro'];

  clientes: Cliente[] = [];
  productos: Producto[] = [];

  items: ItemLinea[] = [];

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private dialogRef: MatDialogRef<VentaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VentaFormData
  ) {
    this.form = this.fb.group({
      cliente_id: [null, Validators.required],
      venta_fecha: [new Date(), Validators.required],
      venta_estado: ['completada', Validators.required],
      metodo_pago: ['efectivo', Validators.required],
      venta_detalles: [''],
      subtotal: [0],
      impuestos: [0],
      descuentos: [0],
      total: [0],
    });

    if (data.venta) {
      this.titulo = `Editar venta #${data.venta.venta_id}`;
      this.form.patchValue({
        ...data.venta,
        venta_fecha: data.venta.venta_fecha
          ? new Date(data.venta.venta_fecha)
          : new Date(),
      });
    }
  }

  ngOnInit(): void {
    // Clientes de la sucursal
    this.clienteService.getClientesPorSucursal(this.data.sucursalId).subscribe({
      next: (clientes: any) => (this.clientes = clientes as Cliente[]),
      error: (err: any) =>
        console.error('Error al cargar clientes para venta', err),
    });

    // Productos (globales por ahora; si luego los separas por sucursal, cambiamos aquí)
    this.productoService.getProductos().subscribe({
      next: (productos: any) => (this.productos = productos as Producto[]),
      error: (err: any) =>
        console.error('Error al cargar productos para venta', err),
    });

    // Para nueva venta, iniciamos con una línea vacía
    if (!this.data.venta) {
      this.agregarItem();
    }
  }

  // 👉 Manejo de líneas de productos

  agregarItem(): void {
    this.items.push({
      producto_id: null,
      cantidad: 1,
      descuento: 0,
      precio: 0,
      subtotal: 0,
    });
  }

  eliminarItem(index: number): void {
    this.items.splice(index, 1);
    this.calcularTotales();
  }

  onProductoChange(item: ItemLinea): void {
    if (!item.producto_id) return;
    const prod = this.productos.find(
      (p) => p.producto_id === item.producto_id
    );
    if (!prod) return;

    item.precio = Number(prod.precioVenta_producto) || 0;
    if (!item.cantidad || item.cantidad <= 0) {
      item.cantidad = 1;
    }
    this.calcularSubtotalItem(item);
  }

  onCantidadOrDescuentoChange(item: ItemLinea): void {
    if (item.cantidad <= 0) {
      item.cantidad = 1;
    }
    this.calcularSubtotalItem(item);
  }

  private calcularSubtotalItem(item: ItemLinea): void {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 0;
    const descuento = Number(item.descuento) || 0;

    const lineaBruta = precio * cantidad;
    const valorDesc = (lineaBruta * descuento) / 100;
    item.subtotal = lineaBruta - valorDesc;

    this.calcularTotales();
  }

  private calcularTotales(): void {
    const subtotal = this.items.reduce(
      (acc, it) => acc + (Number(it.subtotal) || 0),
      0
    );

    const impuestos = 0; // por ahora
    const descuentos = 0; // los manejamos por línea
    const total = subtotal + impuestos;

    this.form.patchValue({
      subtotal,
      impuestos,
      descuentos,
      total,
    });
  }

  // 👉 Guardar

  guardar(): void {
    if (this.form.invalid || this.guardando) return;

    const itemsValidos = this.items.filter(
      (it) => it.producto_id && it.cantidad > 0
    );
    if (itemsValidos.length === 0) {
      alert('Debe agregar al menos un producto a la venta');
      return;
    }

    this.guardando = true;
    const formValue = this.form.value;

    if (this.data.venta && this.data.venta.venta_id) {
      // Edición simple de cabecera
      const ventaActualizada: Venta = {
        ...this.data.venta,
        ...formValue,
        sucursal_id: this.data.sucursalId,
      };

      this.ventaService
        .updateVenta(this.data.venta.venta_id, ventaActualizada)
        .subscribe({
          next: () => {
            this.guardando = false;
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Error al actualizar venta', err);
            this.guardando = false;
          },
        });
    } else {
      // Nueva venta -> crear venta completa (venta + detalles + stock)
      const payload: VentaCompletaRequest = {
        cliente_id: formValue.cliente_id,
        sucursal_id: this.data.sucursalId,
        usuario_id: null, // luego lo podemos sacar del token
        venta_estado: formValue.venta_estado,
        venta_detalles: formValue.venta_detalles,
        metodo_pago: formValue.metodo_pago,
        items: itemsValidos.map((it) => ({
          producto_id: it.producto_id as number,
          cantidad: it.cantidad,
          descuento: it.descuento || 0,
        })),
      };

      this.ventaService.createVentaCompleta(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al crear venta completa', err);
          this.guardando = false;
        },
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
