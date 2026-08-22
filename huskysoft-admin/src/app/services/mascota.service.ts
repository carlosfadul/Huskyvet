
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private baseUrl = 'http://localhost:3000/api/mascotas';

  constructor(private http: HttpClient) {}

  // Obtener mascotas por cliente
  getMascotasPorCliente(clienteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cliente/${clienteId}`);
  }

  // Obtener mascota por ID
  getMascotaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Crear mascota (formData con foto)
  createMascota(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Actualizar mascota
  updateMascota(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar mascota
  deleteMascota(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getMascotasPorSucursal(sucursalId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/mascotas/sucursal/${sucursalId}`);
  }
  
}
