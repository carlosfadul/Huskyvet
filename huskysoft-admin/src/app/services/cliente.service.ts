
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) { }

  // Obtener clientes por sucursal
  getClientesPorSucursal(sucursalId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/sucursal/${sucursalId}`);
  }

  // Crear nuevo cliente
  createCliente(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // Actualizar cliente
  updateCliente(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar cliente
  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Obtener cliente por ID
  getClienteById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
