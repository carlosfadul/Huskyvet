import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PedidoService, Pedido } from '../../services/pedido.service';
import { DetallePedido } from '../../services/pedido.service';
import { ProveedorService } from '../../services/proveedor.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './pedido-form.component.html',
  styles: [`
    :host {
      display: block;
      color: #16324f;
    }

    [mat-dialog-title] {
      margin: 0;
      padding: 4px 4px 18px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    [mat-dialog-content] {
      max-height: min(68vh, 620px);
      padding: 0 4px 8px;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .datos-pedido {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(170px, 0.8fr) minmax(150px, 0.7fr);
      gap: 12px;
    }

    .full-width {
      width: 100%;
    }

    .detalles-pedido {
      padding: 16px;
      border: 1px solid #d7e1e8;
      border-radius: 10px;
      background: #f7fafc;
    }

    .detalles-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
      color: #16324f;
    }

    .detalles-header strong {
      font-size: 15px;
    }

    .detalle-row {
      display: grid;
      grid-template-columns: minmax(0, 1.5fr) 110px minmax(140px, 0.8fr) 40px;
      align-items: start;
      gap: 10px;
      padding: 12px 0;
      border-top: 1px solid #e3ebf0;
    }

    .detalle-row:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .detalle-row button {
      margin-top: 2px;
      color: #b42318;
    }

    .subtotal-pedido {
      display: flex;
      justify-content: flex-end;
      padding-top: 14px;
      border-top: 1px solid #d7e1e8;
      color: #0b5d56;
      font-size: 16px;
      font-weight: 700;
    }

    [mat-dialog-actions] {
      gap: 10px;
      margin: 0;
      padding: 14px 4px 4px;
      border-top: 1px solid #e5ebef;
    }

    @media (max-width: 680px) {
      .datos-pedido,
      .detalle-row {
        grid-template-columns: 1fr;
      }

      .detalle-row button {
        justify-self: end;
        margin-top: -8px;
      }

      .detalles-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class PedidoFormComponent implements OnInit {
  form!: FormGroup;
  titulo = 'Nuevo pedido';
  guardando = false;

  proveedores: any[] = [];
  productos: any[] = [];
  estados: string[] = ['solicitado', 'recibido', 'cancelado'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { sucursalId: number; veterinariaId: number; pedido: Pedido | null },
    private dialogRef: MatDialogRef<PedidoFormComponent>,
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      proveedor_id: [null, Validators.required],
      pedido_fecha: [new Date(), Validators.required],
      pedido_estado: ['solicitado', Validators.required],
      pedido_detalles: [''],
      detalles: this.fb.array([this.crearDetalle()], Validators.minLength(1))
    });

    if (this.data?.pedido) {
      this.titulo = `Editar pedido #${this.data.pedido.pedido_id}`;
      this.form.patchValue({
        proveedor_id: this.data.pedido.proveedor_id,
        pedido_fecha: this.data.pedido.pedido_fecha
          ? new Date(this.data.pedido.pedido_fecha)
          : new Date(),
        pedido_estado: this.data.pedido.pedido_estado,
        pedido_detalles: this.data.pedido.pedido_detalles || ''
      });
    }

    // Cargar proveedores
    this.proveedorService.getProveedores().subscribe({
      next: (proveedores: any[]) => (this.proveedores = proveedores),
      error: err => {
        console.error('Error al cargar proveedores', err);
        this.snackBar.open('Error al cargar proveedores', 'Cerrar', {
          duration: 3000
        });
      }
    });

    this.productoService.getProductos().subscribe({
      next: productos => (this.productos = productos),
      error: err => console.error('Error al cargar productos', err)
    });
  }

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  private crearDetalle(): FormGroup {
    return this.fb.group({
      producto_id: [null, Validators.required],
      detallePedido_cantidad: [1, [Validators.required, Validators.min(1)]],
      detallePedido_precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  agregarDetalle(): void {
    this.detalles.push(this.crearDetalle());
  }

  quitarDetalle(indice: number): void {
    if (this.detalles.length > 1) this.detalles.removeAt(indice);
  }

  actualizarPrecio(detalle: AbstractControl): void {
    const producto = this.productos.find(
      item => item.producto_id === detalle.get('producto_id')?.value
    );
    if (producto) {
      detalle.patchValue({ detallePedido_precio: producto.precioCompra_producto });
    }
  }

  subtotalDetalles(): number {
    return this.detalles.controls.reduce((total, control) => {
      const cantidad = Number(control.get('detallePedido_cantidad')?.value || 0);
      const precio = Number(control.get('detallePedido_precio')?.value || 0);
      return total + cantidad * precio;
    }, 0);
  }

  guardar(): void {
    if (this.form.invalid || this.guardando || !this.detalles.length) return;
    this.guardando = true;

    const raw = this.form.value;

    const payload: Partial<Pedido> & { detalles: DetallePedido[] } = {
      sucursal_id: this.data.sucursalId,
      proveedor_id: raw.proveedor_id,
      pedido_fecha:
        raw.pedido_fecha instanceof Date
          ? raw.pedido_fecha.toISOString().substring(0, 10)
          : raw.pedido_fecha,
      pedido_estado: raw.pedido_estado,
      pedido_detalles: raw.pedido_detalles,
      detalles: this.detalles.getRawValue()
    };

    const obs = this.data.pedido
      ? this.pedidoService.updatePedido(this.data.pedido.pedido_id, payload)
      : this.pedidoService.createPedido(payload);

    obs.subscribe({
      next: () => {
        this.snackBar.open('Pedido guardado correctamente', 'Cerrar', {
          duration: 2500
        });
        this.dialogRef.close(true);
      },
      error: err => {
        console.error('Error al guardar pedido', err);
        this.snackBar.open('Error al guardar el pedido', 'Cerrar', {
          duration: 3000
        });
        this.guardando = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
