// src/app/services/detalle-nomina.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DetalleNominaService {
  private http = inject(HttpClient);

  // Usa environment.apiUrl si existe, o localhost por defecto
  private baseUrl = environment.apiUrl || 'http://localhost:3000/api';
  private detalleUrl = `${this.baseUrl}/detalle-nomina`;
  private nominaUrl = `${this.baseUrl}/nominas`;

  /**
   * Obtener todos los detalles de una nómina
   * Ejemplo: GET /api/nominas/12/detalles
   */
  getDetallesPorNomina(nominaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.nominaUrl}/${nominaId}/detalles`);
  }

  /**
   * Crear un nuevo detalle de nómina
   * Ejemplo: POST /api/detalle-nomina
   */
  crearDetalle(data: any): Observable<any> {
    return this.http.post<any>(this.detalleUrl, data);
  }

  /**
   * Actualizar un detalle por ID
   * Ejemplo: PUT /api/detalle-nomina/:id
   */
  actualizarDetalle(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.detalleUrl}/${id}`, data);
  }

  /**
   * Eliminar un detalle por ID
   * Ejemplo: DELETE /api/detalle-nomina/:id
   */
  eliminarDetalle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.detalleUrl}/${id}`);
  }

  /**
   * Obtener un detalle específico por ID
   * Ejemplo: GET /api/detalle-nomina/:id
   */
  getDetalleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.detalleUrl}/${id}`);
  }
}
