import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnfermedadService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/enfermedades';

  // Obtener todas las enfermedades
  getEnfermedades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener una enfermedad por ID
  getEnfermedadById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva enfermedad
  crearEnfermedad(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualizar enfermedad
  actualizarEnfermedad(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar enfermedad
  eliminarEnfermedad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
