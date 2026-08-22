// src/app/services/remision.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemisionService {

  private apiUrl = `${environment.apiUrl}/remisiones`;

  constructor(private http: HttpClient) {}

  getRemisionesPorMascota(mascotaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mascota/${mascotaId}`);
  }

  createRemision(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateRemision(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteRemision(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
