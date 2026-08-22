import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mascota-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="detalle-panel">
      <h3 class="titulo">Detalles de la Mascota</h3>

      <div class="info">
        <p><strong>Nombre:</strong> {{ data?.mascota_nombre }}</p>
        <p><strong>Especie:</strong> {{ data?.mascota_especie }}</p>
        <p><strong>Raza:</strong> {{ data?.mascota_raza || 'Sin raza' }}</p>
        <p><strong>Sexo:</strong> {{ data?.mascota_sexo }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ data?.mascota_fecha_nac | date }}</p>
        <p><strong>Color:</strong> {{ data?.mascota_color }}</p>
        <p><strong>Peso:</strong> {{ data?.mascota_peso }} kg</p>
        <p><strong>Estado:</strong> {{ data?.mascota_estado }}</p>

        <p><strong>Dueño:</strong> 
          {{ data?.cliente_nombre }} {{ data?.cliente_apellido }}
          ({{ data?.cliente_cedula }})
        </p>
      </div>

      <div class="foto" *ngIf="data?.mascota_foto">
        <img 
          [src]="'http://localhost:3000/api/mascotas/' + data?.mascota_id + '/foto'"
          alt="Foto de mascota"
          class="foto-mascota"
        >
      </div>

      <div class="acciones">
        <button mat-stroked-button (click)="cerrar()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [`
    .detalle-panel {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      max-width: 420px;
      margin: auto;
      box-shadow: 0 6px 14px rgba(0,0,0,0.15);
      text-align: center;
    }

    .titulo {
      margin-bottom: 16px;
      font-size: 20px;
      font-weight: 600;
    }

    .info p {
      margin: 6px 0;
      text-align: left;
    }

    .foto {
      margin: 15px 0;
    }

    .foto-mascota {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 12px;
      border: 3px solid #ddd;
    }

    .acciones {
      margin-top: 20px;
    }
  `]
})
export class MascotaDetalleComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MascotaDetalleComponent>
  ) {}

  cerrar() {
    this.dialogRef.close();
  }
}

