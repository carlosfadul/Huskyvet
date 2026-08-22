import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicioAliadoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/servicios-aliado';

  getByAliado(aliadoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${aliadoId}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

