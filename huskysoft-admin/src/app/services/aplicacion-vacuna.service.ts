import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AplicacionVacunaService {

  private apiUrl = `${environment.apiUrl}/aplicacion-vacuna`;

  constructor(private http: HttpClient) {}

  getPorMascota(mascotaId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/mascota/${mascotaId}`);
  }

  create(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
