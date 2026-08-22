// src/app/services/tratamiento.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TratamientoService {
  private http = inject(HttpClient);
  // Usamos la URL base del environment (ej: http://localhost:3000/api)
  private apiUrl = `${environment.apiUrl}/tratamientos`;

  getTratamientos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearTratamiento(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  actualizarTratamiento(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  eliminarTratamiento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getTratamientoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
