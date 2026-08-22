import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VacunaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vacunas`;

  getVacunas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVacunaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearVacuna(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  actualizarVacuna(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  eliminarVacuna(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

