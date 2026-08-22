// src/app/components/producto-form/producto-form.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.producto_id ? 'Editar Producto' : 'Nuevo Producto' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()" enctype="multipart/form-data">
      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Proveedor</mat-label>
        <mat-select formControlName="proveedor_id" required>
          <mat-option *ngFor="let p of proveedores" [value]="p.proveedor_id">
            {{ p.nombre_proveedor }} ({{ p.nit_proveedor }})
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre_producto" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Categoría</mat-label>
        <mat-select formControlName="categoria_producto" required>
          <mat-option value="medicamento">Medicamento</mat-option>
          <mat-option value="alimento">Alimento</mat-option>
          <mat-option value="accesorio">Accesorio</mat-option>
          <mat-option value="higiene">Higiene</mat-option>
          <mat-option value="otro">Otro</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Código de Barras</mat-label>
        <input matInput formControlName="codigoBarras_producto">
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Unidades</mat-label>
        <input matInput formControlName="unidades_producto" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Cantidad</mat-label>
        <input matInput type="number" formControlName="cantidad_producto">
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Precio Compra</mat-label>
        <input matInput type="number" formControlName="precioCompra_producto" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Precio Venta</mat-label>
        <input matInput type="number" formControlName="precioVenta_producto" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Marca</mat-label>
        <input matInput formControlName="marca_producto" required>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="descripcion_producto"></textarea>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="producto_estado">
          <mat-option value="activo">Activo</mat-option>
          <mat-option value="inactivo">Inactivo</mat-option>
          <mat-option value="agotado">Agotado</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full-width" appearance="fill">
        <mat-label>Fecha Vencimiento</mat-label>
        <input matInput type="date" formControlName="fecha_vencimiento">
      </mat-form-field>

      <div class="full-width">
        <label>Foto del producto:</label>
        <input type="file" (change)="onFileSelected($event)">
      </div>

      <div *ngIf="previewUrl" class="full-width">
        <img [src]="previewUrl" alt="Foto" height="80">
      </div>

      <div style="text-align: right; margin-top: 20px;">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class ProductoFormComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  proveedores: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    public dialogRef: MatDialogRef<ProductoFormComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      proveedor_id: [this.data?.proveedor_id || '', Validators.required],
      categoria_producto: [this.data?.categoria_producto || '', Validators.required],
      nombre_producto: [this.data?.nombre_producto || '', Validators.required],
      codigoBarras_producto: [this.data?.codigoBarras_producto || ''],
      cantidad_producto: [this.data?.cantidad_producto || 0],
      unidades_producto: [this.data?.unidades_producto || '', Validators.required],
      precioCompra_producto: [this.data?.precioCompra_producto || '', Validators.required],
      precioVenta_producto: [this.data?.precioVenta_producto || '', Validators.required],
      marca_producto: [this.data?.marca_producto || '', Validators.required],
      descripcion_producto: [this.data?.descripcion_producto || ''],
      producto_estado: [this.data?.producto_estado || 'activo'],
      fecha_vencimiento: [this.data?.fecha_vencimiento || '']
    });

    if (this.data?.foto_producto) {
      this.previewUrl = this.data.foto_producto;
    }

    this.proveedorService.getProveedores().subscribe(data => {
      this.proveedores = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  guardar() {
    const formData = new FormData();
    for (const key in this.form.value) {
      if (this.form.value[key] !== null && this.form.value[key] !== '') {
        formData.append(key, this.form.value[key]);
      }
    }

    if (this.selectedFile) {
      formData.append('foto_producto', this.selectedFile);
    }

    const request = this.data?.producto_id
      ? this.productoService.actualizarProducto(this.data.producto_id, formData)
      : this.productoService.crearProducto(formData);

    request.subscribe(() => this.dialogRef.close(true));
  }
}


