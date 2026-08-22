import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/api/proveedores';

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearProveedor(proveedor: any): Observable<any> {
    return this.http.post(this.apiUrl, proveedor);
  }

  actualizarProveedor(id: number, proveedor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proveedor);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
