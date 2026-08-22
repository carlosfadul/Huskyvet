
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private baseUrl = 'http://localhost:3000/api/sucursales';

  constructor(private http: HttpClient) {}

  // Obtener todas las sucursales de una veterinaria
  getSucursalesPorVeterinaria(veterinariaId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/sucursales?veterinaria_id=${veterinariaId}`);
  }
  

  // Crear una nueva sucursal
  createSucursal(data: FormData | any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Actualizar una sucursal
  updateSucursal(id: number, data: FormData | any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar una sucursal
  deleteSucursal(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  
  
    

  // Obtener una sucursal por ID
  getSucursalById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  
}
