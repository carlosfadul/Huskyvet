import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PedidoService, Pedido } from '../../services/pedido.service';
import { ProveedorService } from '../../services/proveedor.service';

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
    MatSnackBarModule
  ],
  templateUrl: './pedido-form.component.html'
})
export class PedidoFormComponent implements OnInit {
  form!: FormGroup;
  titulo = 'Nuevo pedido';
  guardando = false;

  proveedores: any[] = [];
  estados: string[] = ['pendiente', 'recibido', 'cancelado'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { sucursalId: number; veterinariaId: number; pedido: Pedido | null },
    private dialogRef: MatDialogRef<PedidoFormComponent>,
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      proveedor_id: [null, Validators.required],
      pedido_fecha: [new Date(), Validators.required],
      pedido_estado: ['pendiente', Validators.required],
      pedido_detalles: ['']
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
  }

  guardar(): void {
    if (this.form.invalid || this.guardando) return;
    this.guardando = true;

    const raw = this.form.value;

    const payload: Partial<Pedido> = {
      sucursal_id: this.data.sucursalId,
      proveedor_id: raw.proveedor_id,
      pedido_fecha:
        raw.pedido_fecha instanceof Date
          ? raw.pedido_fecha.toISOString().substring(0, 10)
          : raw.pedido_fecha,
      pedido_estado: raw.pedido_estado,
      pedido_detalles: raw.pedido_detalles
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
