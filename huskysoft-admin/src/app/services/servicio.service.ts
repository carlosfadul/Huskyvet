import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/servicios';

  getServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getServicioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearServicio(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarServicio(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
