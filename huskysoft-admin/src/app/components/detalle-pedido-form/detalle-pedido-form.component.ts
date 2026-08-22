// src/app/components/detalle-pedido-form/detalle-pedido-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { DetallePedido, DetallePedidoService } from '../../services/detalle-pedido.service';
import { ProductoService } from '../../services/producto.service';

interface Producto {
  producto_id: number;
  nombre_producto: string;
  precioCompra_producto: number;
  precioVenta_producto: number;
  cantidad_producto: number;
}



export interface DetallePedidoFormData {
  pedidoId: number;
  detalle?: DetallePedido | null;
}

@Component({
  selector: 'app-detalle-pedido-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './detalle-pedido-form.component.html'
})
export class DetallePedidoFormComponent implements OnInit {
  form!: FormGroup;
  titulo = 'Agregar producto al pedido';
  productos: Producto[] = [];
  guardando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DetallePedidoFormData,
    private dialogRef: MatDialogRef<DetallePedidoFormComponent>,
    private fb: FormBuilder,
    private detallePedidoService: DetallePedidoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    // Cargar productos (por ahora todos)
    this.productoService.getProductos().subscribe({
      next: (productos) => (this.productos = productos),
      error: (err) => console.error('Error al cargar productos', err)
    });

    this.form = this.fb.group({
      producto_id: [this.data.detalle?.producto_id || null, Validators.required],
      detallePedido_cantidad: [
        this.data.detalle?.detallePedido_cantidad || 1,
        [Validators.required, Validators.min(1)]
      ],
      cantidad_recibida: [
        this.data.detalle?.cantidad_recibida ?? 0,
        [Validators.min(0)]
      ],
      detallePedido_precio: [
        this.data.detalle?.detallePedido_precio || 0,
        [Validators.required, Validators.min(0)]
      ]
    });

    if (this.data.detalle?.detallePedido_id) {
      this.titulo = `Editar ítem #${this.data.detalle.detallePedido_id}`;
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    if (this.form.invalid || this.guardando) return;

    this.guardando = true;

    const payload: DetallePedido = {
      ...(this.data.detalle || {}),
      ...this.form.value,
      pedido_id: this.data.pedidoId
    };

    const peticion = this.data.detalle?.detallePedido_id
      ? this.detallePedidoService.actualizar(this.data.detalle.detallePedido_id!, payload)
      : this.detallePedidoService.crear(payload);

    peticion.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Error al guardar detalle de pedido', err);
        this.guardando = false;
      }
    });
  }

  get subtotal(): number {
    const cantidad = this.form.get('detallePedido_cantidad')?.value || 0;
    const precio = this.form.get('detallePedido_precio')?.value || 0;
    return cantidad * precio;
  }
}
