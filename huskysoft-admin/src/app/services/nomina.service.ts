import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Nomina {
  nomina_id?: number;
  sucursal_id: number;
  usuario_id?: number;
  nomina_fecha: string;
  nomina_periodo_inicio: string;
  nomina_periodo_fin: string;
  nomina_estado: string;
  total_nomina: number;
  observaciones?: string;
}

@Injectable({ providedIn: 'root' })
export class NominaService {
  private baseUrl = 'http://localhost:3000/api/nomina';

  constructor(private http: HttpClient) {}

  getNominasPorSucursal(sucursalId: number): Observable<Nomina[]> {
    return this.http.get<Nomina[]>(`${this.baseUrl}/sucursal/${sucursalId}`);
  }

  createNomina(data: Nomina): Observable<any> {
    console.log('📤 Enviando al backend:', data);
    return this.http.post(this.baseUrl, data);
  }
  

  updateNomina(id: number, data: Nomina): Observable<any> {
    console.log('📤 Enviando al backend:', data);
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteNomina(id: number): Observable<any> {
    console.log('📡 [Servicio] Enviando DELETE para nómina ID:', id);
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => console.log('✅ [Servicio] DELETE exitoso para ID:', id)),
      catchError(err => {
        console.error('❌ [Servicio] Error en DELETE:', err);
        throw err;
      })
    );
  }

  getNominaById(id: number): Observable<Nomina> {
    return this.http.get<Nomina>(`${this.baseUrl}/${id}`);
  }
}

