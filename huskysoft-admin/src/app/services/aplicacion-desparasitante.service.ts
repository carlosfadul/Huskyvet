import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AplicacionDesparasitanteService {

  private apiUrl = `${environment.apiUrl}/aplicacion-desparasitante`;

  constructor(private http: HttpClient) {}

  getPorMascota(mascotaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mascota/${mascotaId}`);
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
