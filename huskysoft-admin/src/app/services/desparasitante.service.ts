import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DesparasitanteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/desparasitantes`;

  getDesparasitantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDesparasitanteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createDesparasitante(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  updateDesparasitante(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  deleteDesparasitante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}




