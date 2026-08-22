import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // ✅ Import necesario para [ngValue]
import { HttpClient, HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DetalleNominaService } from '../../../services/detalle-nomina.service';
import { environment } from '../../../../environments/environment';

type Detalle = {
  detalleNomina_id: number;
  nomina_id: number;
  empleado_id: number;
  cantidad_horas: number;
  valor_hora: number;
  horas_extras?: number;
  valor_horas_extras?: number;
  bonificaciones?: number;
  descuentos?: number;
  subtotal?: number;
  empleado_nombre?: string;
  empleado_apellido?: string;
  empleado_cedula?: string;
};

type EmpleadoLite = {
  empleado_id: number;
  empleado_nombre: string;
  empleado_apellido: string;
  empleado_cedula?: string;
};

@Component({
  selector: 'app-detalle-nomina',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // ✅ Soluciona el error de [ngValue]
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './detalle-nomina.component.html',
  styleUrls: ['./detalle-nomina.component.scss']
})
export class DetalleNominaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private http = inject(HttpClient);
  private detalleSrv = inject(DetalleNominaService);

  veterinariaId!: number;
  sucursalId!: number;
  nominaId!: number;

  cargando = signal(false);
  detalles = signal<Detalle[]>([]);
  empleados = signal<EmpleadoLite[]>([]);
  columnas = [
    'empleado',
    'cantHoras',
    'valorHora',
    'extras',
    'valorExtras',
    'bonif',
    'desc',
    'subtotal',
    'acciones'
  ];

  form: FormGroup = this.fb.group({
    empleado_id: [null, Validators.required],
    cantidad_horas: [0, [Validators.required, Validators.min(0)]],
    valor_hora: [0, [Validators.required, Validators.min(0.01)]],
    horas_extras: [0, [Validators.min(0)]],
    valor_horas_extras: [0, [Validators.min(0)]],
    bonificaciones: [0, [Validators.min(0)]],
    descuentos: [0, [Validators.min(0)]]
  });

  editRowId: number | null = null;
  editForms: Record<number, FormGroup> = {};
  private baseApi = environment.apiUrl || 'http://localhost:3000/api';
  private location = inject(Location);


  ngOnInit(): void {
    this.veterinariaId = Number(
      this.route.snapshot.paramMap.get('veterinariaId') ??
        this.route.snapshot.paramMap.get('vId')
    );
    this.sucursalId = Number(
      this.route.snapshot.paramMap.get('sucursalId') ??
        this.route.snapshot.paramMap.get('sId')
    );
    this.nominaId = Number(this.route.snapshot.paramMap.get('nominaId'));

    this.cargarEmpleados();
    this.cargarDetalles();
  }

  cargarEmpleados(q?: string) {
    const id = Number(this.sucursalId);
    const base = this.baseApi;

    const normalize = (arr: any[] = []) =>
      (arr || [])
        .map(e => ({
          empleado_id: Number(e.empleado_id ?? e.id ?? e.empleadoID),
          empleado_nombre: String(e.empleado_nombre ?? e.nombre ?? ''),
          empleado_apellido: String(e.empleado_apellido ?? e.apellido ?? ''),
          empleado_cedula: e.empleado_cedula ?? e.cedula ?? null,
          sucursal_id: Number(e.sucursal_id ?? e.sucursalId ?? e.sucursal)
        }))
        .filter(e => !isNaN(e.empleado_id));

    let params = new HttpParams().set('sucursal_id', id);
    if (q && q.trim()) params = params.set('q', q.trim());

    this.http.get<any[]>(`${base}/empleados`, { params }).subscribe({
      next: data => {
        let list = normalize(data);
        list = list.filter(e => e.sucursal_id === id);
        if (list.length > 0) {
          this.empleados.set(list);
          return;
        }
        this.http.get<any[]>(`${base}/empleados/por-sucursal/${id}`).subscribe({
          next: data2 => {
            let list2 = normalize(data2).filter(e => e.sucursal_id === id);
            if (list2.length > 0) {
              this.empleados.set(list2);
              return;
            }
            this.http.get<any[]>(`${base}/empleados`).subscribe({
              next: all => {
                const list3 = normalize(all).filter(e => e.sucursal_id === id);
                this.empleados.set(list3);
              },
              error: () =>
                this.snack.open(
                  'No se pudieron cargar empleados (fallback all)',
                  'Cerrar',
                  { duration: 2500 }
                )
            });
          },
          error: () => {
            this.http.get<any[]>(`${base}/empleados`).subscribe({
              next: all => {
                const list3 = normalize(all).filter(e => e.sucursal_id === id);
                this.empleados.set(list3);
              },
              error: () =>
                this.snack.open(
                  'No se pudieron cargar empleados',
                  'Cerrar',
                  { duration: 2500 }
                )
            });
          }
        });
      },
      error: () => {
        this.http.get<any[]>(`${base}/empleados/por-sucursal/${id}`).subscribe({
          next: data2 => {
            let list2 = normalize(data2).filter(e => e.sucursal_id === id);
            if (list2.length > 0) {
              this.empleados.set(list2);
              return;
            }
            this.http.get<any[]>(`${base}/empleados`).subscribe({
              next: all => {
                const list3 = normalize(all).filter(e => e.sucursal_id === id);
                this.empleados.set(list3);
              },
              error: () =>
                this.snack.open('No se pudieron cargar empleados', 'Cerrar', {
                  duration: 2500
                })
            });
          },
          error: () =>
            this.snack.open('No se pudieron cargar empleados', 'Cerrar', {
              duration: 2500
            })
        });
      }
    });
  }

  cargarDetalles() {
    this.cargando.set(true);
    this.detalleSrv.getDetallesPorNomina(this.nominaId).subscribe({
      next: data => {
        const arr = data || [];
        this.detalles.set(arr);
        this.editForms = {};
        arr.forEach(
          d =>
            (this.editForms[d.detalleNomina_id] = this.buildEditForm(
              d
            ))
        );
      },
      error: e =>
        this.snack.open(
          e?.error?.message || 'Error cargando detalles',
          'Cerrar',
          { duration: 2500 }
        ),
      complete: () => this.cargando.set(false)
    });
  }

  buildEditForm(d: Detalle) {
    return this.fb.group({
      empleado_id: [d.empleado_id, Validators.required],
      cantidad_horas: [d.cantidad_horas, [Validators.required, Validators.min(0)]],
      valor_hora: [d.valor_hora, [Validators.required, Validators.min(0.01)]],
      horas_extras: [d.horas_extras ?? 0, [Validators.min(0)]],
      valor_horas_extras: [d.valor_horas_extras ?? 0, [Validators.min(0)]],
      bonificaciones: [d.bonificaciones ?? 0, [Validators.min(0)]],
      descuentos: [d.descuentos ?? 0, [Validators.min(0)]]
    });
  }

  crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.form.value, nomina_id: this.nominaId };
    this.cargando.set(true);
    this.detalleSrv.crearDetalle(payload).subscribe({
      next: () => {
        this.snack.open('Detalle creado', 'Cerrar', { duration: 1800 });
        this.form.reset({
          empleado_id: null,
          cantidad_horas: 0,
          valor_hora: 0,
          horas_extras: 0,
          valor_horas_extras: 0,
          bonificaciones: 0,
          descuentos: 0
        });
        this.cargarDetalles();
      },
      error: e =>
        this.snack.open(e?.error?.message || 'Error creando detalle', 'Cerrar', {
          duration: 2500
        }),
      complete: () => this.cargando.set(false)
    });
  }

  editarFila(id: number) {
    this.editRowId = id;
  }

  cancelarEdicion() {
    this.editRowId = null;
  }

  guardarEdicion(row: Detalle) {
    const fg = this.editForms[row.detalleNomina_id];
    if (!fg || fg.invalid) {
      fg?.markAllAsTouched();
      return;
    }
    const payload = fg.value;
    this.cargando.set(true);
    this.detalleSrv.actualizarDetalle(row.detalleNomina_id, payload).subscribe({
      next: () => {
        this.snack.open('Detalle actualizado', 'Cerrar', { duration: 1800 });
        this.editRowId = null;
        this.cargarDetalles();
      },
      error: e =>
        this.snack.open(e?.error?.message || 'Error actualizando detalle', 'Cerrar', {
          duration: 2500
        }),
      complete: () => this.cargando.set(false)
    });
  }

  eliminar(row: Detalle) {
    if (!confirm('¿Eliminar este detalle?')) return;
    this.cargando.set(true);
    this.detalleSrv.eliminarDetalle(row.detalleNomina_id).subscribe({
      next: () => {
        this.snack.open('Detalle eliminado', 'Cerrar', { duration: 1800 });
        this.cargarDetalles();
      },
      error: e =>
        this.snack.open(e?.error?.message || 'Error eliminando detalle', 'Cerrar', {
          duration: 2500
        }),
      complete: () => this.cargando.set(false)
    });
  }

  volver() {
  this.router
    .navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'nomina'  // 👈 singular
    ])
    .catch(() => this.location.back());
}


  nombreEmpleado(id: number) {
    const e = this.empleados().find(x => x.empleado_id === id);
    return e ? `${e.empleado_nombre} ${e.empleado_apellido}` : `#${id}`;
  }
}
