// src/app/pages/usuarios/usuario-form.component.ts
import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { EmpleadoService } from '../../services/empleado.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usuario-form',
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
    <h2 mat-dialog-title>{{ data?.usuario_id ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

    <form [formGroup]="form" (ngSubmit)="guardar()" enctype="multipart/form-data">
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Empleado</mat-label>
        <mat-select formControlName="empleado_id" required>
          <mat-option *ngFor="let emp of empleados" [value]="emp.empleado_id">
            {{ emp.empleado_nombre }} {{ emp.empleado_apellido }} ({{ emp.empleado_cedula }})
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width" *ngIf="false">
        <mat-label>Sucursal ID</mat-label>
        <input matInput type="number" formControlName="sucursal_id">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width" *ngIf="false">
        <mat-label>Veterinaria ID</mat-label>
        <input matInput type="number" formControlName="veterinaria_id">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Username</mat-label>
        <input matInput formControlName="usuario_username" required>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Contraseña</mat-label>
        <input matInput type="password" formControlName="usuario_password" [required]="!data?.usuario_id">
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Tipo de Usuario</mat-label>
        <mat-select formControlName="usuario_tipo" required>
          <mat-option value="superadmin">Superadmin</mat-option>
          <mat-option value="admin">Admin</mat-option>
          <mat-option value="veterinario">Veterinario</mat-option>
          <mat-option value="asistente">Asistente</mat-option>
          <mat-option value="recepcionista">Recepcionista</mat-option>
          <mat-option value="inventario">Inventario</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="usuario_estado">
          <mat-option value="activo">Activo</mat-option>
          <mat-option value="inactivo">Inactivo</mat-option>
          <mat-option value="suspendido">Suspendido</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Último Login</mat-label>
        <input matInput type="datetime-local" formControlName="ultimo_login">
      </mat-form-field>

      <div class="full-width">
        <label>Foto del Usuario:</label>
        <input type="file" (change)="onFileSelected($event)">
      </div>

      <div *ngIf="previewUrl" class="full-width">
        <label>Vista previa:</label><br>
        <img [src]="previewUrl" alt="Preview" width="80" height="80" style="border-radius: 50%;">
      </div>

      <div style="text-align: right; margin-top: 20px;">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
  `]
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  empleados: any[] = [];
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private empleadoService: EmpleadoService,
    public dialogRef: MatDialogRef<UsuarioFormComponent>
  ) {}

  ngOnInit(): void {
    const sucursalId = this.data?.sucursal_id;
    const veterinariaId = this.data?.veterinaria_id;

    this.form = this.fb.group({
      empleado_id: [this.data?.empleado_id || '', Validators.required],
      sucursal_id: [sucursalId || '', Validators.required],
      veterinaria_id: [veterinariaId || '', Validators.required],
      usuario_username: [this.data?.usuario_username || '', Validators.required],
      usuario_password: ['', this.data?.usuario_id ? [] : Validators.required],
      usuario_tipo: [this.data?.usuario_tipo || '', Validators.required],
      usuario_estado: [this.data?.usuario_estado || 'activo'],
      ultimo_login: [this.data?.ultimo_login ? this.data.ultimo_login.substring(0, 16) : '']
    });

    if (this.data?.usuario_foto) {
      this.previewUrl = this.data.usuario_foto;
    }

    if (sucursalId) {
      this.empleadoService.getEmpleadosSinUsuarioPorSucursal(sucursalId)
        .subscribe(emp => {
          if (this.data?.empleado_id) {
            const yaIncluido = emp.some((e: any) => e.empleado_id === this.data.empleado_id);
            if (!yaIncluido) {
              emp.unshift({
                empleado_id: this.data.empleado_id,
                empleado_nombre: this.data.empleado_nombre || '(Empleado asignado)',
                empleado_apellido: '',
                empleado_cedula: ''
              });
            }
          }
          this.empleados = emp;
        });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
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
      formData.append('usuario_foto', this.selectedFile);
    }
  
    const request = this.data?.usuario_id
      ? this.usuarioService.actualizarUsuario(this.data.usuario_id, formData)
      : this.usuarioService.crearUsuario(formData);
  
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: (error) => {
        console.error('❌ Error al guardar el usuario:', error);
        if (error.status === 400 || error.status === 409) {
          alert(error.error?.message || 'El nombre de usuario ya existe.');
        } else {
          alert('Ocurrió un error al guardar el usuario.');
        }
      }
    });
  }
  
}
