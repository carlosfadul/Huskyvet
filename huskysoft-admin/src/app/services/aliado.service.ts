// src/app/services/aliado.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AliadoService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/aliados';

  // ✅ Obtener aliados por sucursal
  getAliadosPorSucursal(sucursalId: string): Observable<any[]> {
    if (!sucursalId) {
      throw new Error('El ID de sucursal es requerido');
    }
    return this.http.get<any[]>(`${this.apiUrl}/sucursal/${sucursalId}`);
  }

  // ✅ Crear nuevo aliado
  crearAliado(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // ✅ Actualizar aliado existente
  actualizarAliado(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Eliminar aliado
  eliminarAliado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // ✅ Obtener aliado por ID
  getAliadoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
