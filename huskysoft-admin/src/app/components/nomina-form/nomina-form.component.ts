import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NominaService } from '../../services/nomina.service';

@Component({
  selector: 'app-nomina-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './nomina-form.component.html',
})
export class NominaFormComponent implements OnInit {
  form!: FormGroup;
  estados = ['borrador', 'calculada', 'pagada', 'cancelada'];

  constructor(
    private fb: FormBuilder,
    private nominaService: NominaService,
    public dialogRef: MatDialogRef<NominaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sucursal_id: [this.data?.sucursal_id || '', Validators.required],
      usuario_id: [this.data?.usuario_id || null],
      nomina_fecha: [this.toDate(this.data?.nomina?.nomina_fecha), Validators.required],
      nomina_periodo_inicio: [this.toDate(this.data?.nomina?.nomina_periodo_inicio), Validators.required],
      nomina_periodo_fin: [this.toDate(this.data?.nomina?.nomina_periodo_fin), Validators.required],
      nomina_estado: [this.data?.nomina?.nomina_estado || 'borrador', Validators.required],
      total_nomina: [this.data?.nomina?.total_nomina ?? 0, [Validators.required, Validators.min(0)]],
      observaciones: [this.data?.nomina?.observaciones || '']
    });
  }

  private toDate(value: any): Date | null {
    return value ? new Date(value) : null;
  }

  guardar(): void {
    if (this.form.invalid) {
      console.warn('Formulario inválido:', this.form.value);
      return;
    }

    const payload = this.form.value;
    console.log('📤 Enviando payload:', payload);

    const request = this.data?.nomina?.nomina_id
      ? this.nominaService.updateNomina(this.data.nomina.nomina_id, payload)
      : this.nominaService.createNomina(payload);

    const resultado = this.data?.nomina?.nomina_id ? 'updated' : 'created';

    request.subscribe({
      next: () => {
        console.log('✅ Operación exitosa:', resultado);
        this.dialogRef.close(resultado);
      },
      error: (error) => {
        console.error('❌ Error en guardar nómina:', error);
        this.dialogRef.close(false);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}

