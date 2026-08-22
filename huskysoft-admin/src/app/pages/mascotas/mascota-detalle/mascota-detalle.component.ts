// src/app/pages/mascotas/mascota-detalle/mascota-detalle.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { MascotaService } from '../../../services/mascota.service';
import { AtencionService } from '../../../services/atencion.service';
import { AplicacionVacunaService } from '../../../services/aplicacion-vacuna.service';
import { AplicacionDesparasitanteService } from '../../../services/aplicacion-desparasitante.service';
import { AtencionFormComponent } from '../../../components/atencion-form/atencion-form.component';
import { VacunaAplicacionFormComponent } from '../../../components/vacuna-aplicacion-form/vacuna-aplicacion-form.component';
import { DesparasitacionAplicacionFormComponent } from '../../../components/desparasitacion-aplicacion-form/desparasitacion-aplicacion-form.component';
import { MascotaTratamientoService } from '../../../services/mascota-tratamiento.service';
import { TratamientoService } from '../../../services/tratamiento.service';
import { RemisionService } from '../../../services/remision.service';
import { RemisionFormComponent } from '../../../components/remision-form/remision-form.component';

@Component({
  selector: 'app-mascota-detalle-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './mascota-detalle.component.html',
  styleUrls: ['./mascota-detalle.component.scss']
})
export class MascotaDetalleComponent implements OnInit {

  veterinariaId!: number;
  sucursalId!: number;
  mascotaId!: number;

  mascota: any;

  // --- Atenciones ---
  atenciones: any[] = [];
  columnasAtenciones: string[] = [
    'fecha',
    'motivo',
    'diagnostico',
    'tratamiento',
    'observaciones',
    'acciones'
  ];


  // --- Vacunas / Desparasitaciones ---
  vacunasAplicadas: any[] = [];
  desparasitacionesAplicadas: any[] = [];
  enfermedadesMascota: any[] = [];
  //---------------------------------------------
  columnasVacunas: string[] = ['fecha', 'vacuna', 'lote', 'acciones'];

  columnasEnfermedades: string[] = ['fecha', 'enfermedad', 'estado', 'acciones'];
  columnasRemisiones: string[] = ['fecha', 'aliado', 'servicios', 'estado', 'acciones'];

  //---------------------------


  desparasitaciones: any[] = [];
  columnasDesparasitaciones: string[] = ['fecha', 'producto', 'dosis', 'acciones'];

  // --- Remisiones ---
  remisiones: any[] = [];

  // --- Tratamientos de mascota ---
  tratamientosMascota: any[] = [];
  catalogoTratamientos: any[] = [];
  mostrandoFormTratamiento = false;
  nuevoTratamiento: any = {
    tratamiento_id: null,
    dosis: '',
    frecuencia: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activo',
    observaciones: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private atencionService: AtencionService,
    private aplicacionVacunaService: AplicacionVacunaService,
    private aplicacionDesparasitanteService: AplicacionDesparasitanteService,
    private mascotaTratamientoService: MascotaTratamientoService,
    private tratamientoService: TratamientoService,
    private remisionService: RemisionService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.paramMap;
    this.veterinariaId = Number(params.get('veterinariaId'));
    this.sucursalId = Number(params.get('sucursalId'));
    this.mascotaId = Number(params.get('mascotaId'));

    this.cargarMascota();
    this.cargarAtenciones();
    this.cargarVacunas();
    this.cargarDesparasitaciones();
    this.cargarTratamientosMascota();
    this.cargarCatalogoTratamientos();
    this.cargarRemisiones();
  }

  // ---------- Mascota ----------
  cargarMascota(): void {
    this.mascotaService.getMascotaById(this.mascotaId).subscribe({
      next: (m: any) => (this.mascota = m),
      error: (err: any) => console.error('Error al cargar mascota', err)
    });
  }

  // ---------- Atenciones ----------
  cargarAtenciones(): void {
    this.atencionService.getByMascota(this.mascotaId).subscribe({
      next: (ats: any[]) => (this.atenciones = ats),
      error: (err: any) => console.error('Error al cargar atenciones', err)
    });
  }

  nuevaAtencion(): void {
    const ref = this.dialog.open(AtencionFormComponent, {
      width: '700px',
      data: {
        veterinariaId: this.veterinariaId,
        sucursalId: this.sucursalId,
        mascotaId: this.mascotaId
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) this.cargarAtenciones();
    });
  }

  editarAtencion(atencion: any): void {
    const ref = this.dialog.open(AtencionFormComponent, {
      width: '700px',
      data: {
        veterinariaId: this.veterinariaId,
        sucursalId: this.sucursalId,
        mascotaId: this.mascotaId,
        atencion
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) this.cargarAtenciones();
    });
  }

  eliminarAtencion(atencion: any): void {
    if (!confirm('¿Eliminar esta atención?')) return;

    this.atencionService.deleteAtencion(atencion.atencion_id).subscribe({
      next: () => this.cargarAtenciones(),
      error: (err: any) => console.error('Error al eliminar atención', err)
    });
  }

  verDetalleAtencion(atencion: any) {
    const lineas: string[] = [];

    lineas.push(`Fecha: ${(atencion.atencion_fecha || atencion.fecha_atencion)}`);
    if (atencion.atencion_motivo) {
      lineas.push(`Motivo: ${atencion.atencion_motivo}`);
    }
    if (atencion.atencion_detalle) {
      lineas.push(`Detalle: ${atencion.atencion_detalle}`);
    }
    if (atencion.diagnostico) {
      lineas.push(`Diagnóstico: ${atencion.diagnostico}`);
    }
    if (atencion.tratamiento) {
      lineas.push(`Tratamiento: ${atencion.tratamiento}`);
    }
    if (atencion.observaciones) {
      lineas.push(`Observaciones: ${atencion.observaciones}`);
    }

    const texto = lineas.join('\n\n');

    // Mostramos primero los datos
    alert(texto);

    // 👀 Si hay archivo adjunto, preguntamos si quiere verlo
    if (atencion.atencion_archivoAdjunto) {
      const abrir = confirm(
        'Esta atención tiene un archivo adjunto.\n¿Quieres abrirlo en una nueva pestaña?'
      );

      if (abrir) {
        const url = `http://localhost:3000/api/atencion/${atencion.atencion_id}/archivoAdjunto`;
        console.log('Abriendo archivo de atención:', url);
        window.open(url, '_blank');
      }
    }
  }


  // ---------- Vacunas ----------
  cargarVacunas(): void {
    this.aplicacionVacunaService.getPorMascota(this.mascotaId).subscribe({
      next: (rows: any[]) => (this.vacunasAplicadas = rows),
      error: (err: any) => console.error('Error al obtener vacunas', err)
    });
  }

  nuevaVacuna(): void {
    const ref = this.dialog.open(VacunaAplicacionFormComponent, {
      width: '650px',
      data: {
        mascotaId: this.mascotaId,
        usuarioId: 1
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) this.cargarVacunas();
    });
  }

  editarVacuna(v: any): void {
    const ref = this.dialog.open(VacunaAplicacionFormComponent, {
      width: '650px',
      data: {
        mascotaId: this.mascotaId,
        usuarioId: 1,
        aplicacion: v
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) this.cargarVacunas();
    });
  }

  eliminarVacuna(v: any): void {
    if (!confirm('¿Eliminar vacuna aplicada?')) return;

    this.aplicacionVacunaService.delete(v.aplicacionVacuna_id).subscribe({
      next: () => this.cargarVacunas(),
      error: (err: any) => console.error('Error al eliminar vacuna aplicada', err)
    });
  }

  // ---------- Desparasitaciones ----------
  cargarDesparasitaciones(): void {
    this.aplicacionDesparasitanteService.getPorMascota(this.mascotaId).subscribe({
      next: (rows: any[]) => (this.desparasitaciones = rows),
      error: (err: any) => console.error('Error al obtener desparasitaciones', err)
    });
  }

  nuevaDesparasitacion(): void {
    const ref = this.dialog.open(DesparasitacionAplicacionFormComponent, {
      width: '650px',
      data: {
        mascotaId: this.mascotaId,
        usuarioId: 1
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) this.cargarDesparasitaciones();
    });
  }

  editarDesparasitacion(d: any): void {
    const ref = this.dialog.open(DesparasitacionAplicacionFormComponent, {
      width: '650px',
      data: {
        mascotaId: this.mascotaId,
        usuarioId: 1,
        aplicacion: d
      }
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) this.cargarDesparasitaciones();
    });
  }

  eliminarDesparasitacion(d: any): void {
    if (!confirm('¿Eliminar desparasitación aplicada?')) return;

    this.aplicacionDesparasitanteService.delete(d.aplicacionDesparasitante_id).subscribe({
      next: () => this.cargarDesparasitaciones(),
      error: (err: any) => console.error('Error al eliminar desparasitación', err)
    });
  }

  // ---------- Tratamientos de la mascota ----------
  cargarTratamientosMascota(): void {
    this.mascotaTratamientoService.getPorMascota(this.mascotaId).subscribe({
      next: (res: any[]) => this.tratamientosMascota = res,
      error: (err: any) => console.error('Error al obtener tratamientos de la mascota', err)
    });
  }

  cargarCatalogoTratamientos(): void {
    this.tratamientoService.getTratamientos().subscribe({
      next: (res: any[]) => this.catalogoTratamientos = res,
      error: (err: any) => console.error('Error al obtener catálogo de tratamientos', err)
    });
  }

  toggleFormTratamiento(): void {
    this.mostrandoFormTratamiento = !this.mostrandoFormTratamiento;
    if (!this.mostrandoFormTratamiento) {
      this.nuevoTratamiento = {
        tratamiento_id: null,
        dosis: '',
        frecuencia: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'activo',
        observaciones: ''
      };
    }
  }

  guardarTratamiento(): void {
    if (!this.nuevoTratamiento.tratamiento_id) {
      return;
    }

    const payload = {
      mascota_id: this.mascotaId,
      tratamiento_id: this.nuevoTratamiento.tratamiento_id,
      dosis: this.nuevoTratamiento.dosis,
      frecuencia: this.nuevoTratamiento.frecuencia,
      fecha_inicio: this.nuevoTratamiento.fecha_inicio || null,
      fecha_fin: this.nuevoTratamiento.fecha_fin || null,
      estado: this.nuevoTratamiento.estado,
      observaciones: this.nuevoTratamiento.observaciones
    };

    this.mascotaTratamientoService.create(payload).subscribe({
      next: () => {
        this.toggleFormTratamiento();
        this.cargarTratamientosMascota();
      },
      error: (err: any) => console.error('Error al guardar tratamiento de mascota', err)
    });
  }

  eliminarTratamiento(id: number): void {
    const confirmado = confirm('¿Eliminar este tratamiento de la mascota?');
    if (!confirmado) return;

    this.mascotaTratamientoService.delete(id).subscribe({
      next: () => this.cargarTratamientosMascota(),
      error: (err: any) => console.error('Error al eliminar tratamiento de mascota', err)
    });
  }

  // ---------- Remisiones ----------
  cargarRemisiones() {
    if (!this.mascotaId) { return; }

    this.remisionService.getRemisionesPorMascota(this.mascotaId).subscribe({
      next: (data) => this.remisiones = data,
      error: (err) => console.error('Error al obtener remisiones de la mascota', err)
    });
  }



  // ---------- ENFERMEDADES ----------
  registrarEnfermedad() {
    console.warn("⚠ registrarEnfermedad(): falta implementar");
  }

  editarEnfermedad(enfermedad: any) {
    console.warn("⚠ editarEnfermedad(): falta implementar", enfermedad);
  }

  eliminarEnfermedad(enfermedad: any) {
    if (!confirm("¿Eliminar esta enfermedad?")) return;
    console.warn("⚠ eliminarEnfermedad(): falta implementar", enfermedad);
  }


  // ---------- REMISIONES ----------
  nuevaRemision() {
    console.warn("⚠ nuevaRemision(): falta implementar");
  }

  editarRemision(remision: any) {
    console.warn("⚠ editarRemision(): falta implementar", remision);
  }

  eliminarRemision(remision: any) {
    if (!confirm("¿Eliminar esta remisión?")) return;
    console.warn("⚠ eliminarRemision(): falta implementar", remision);
  }


  // ---------- Navegación ----------
  volver(): void {
    this.router.navigate([
      '/veterinaria',
      this.veterinariaId,
      'sucursal',
      this.sucursalId,
      'dashboard',
      'mascotas'
    ]);
  }

}


