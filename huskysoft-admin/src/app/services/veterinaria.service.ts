import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VeterinariaService {
  private baseUrl = 'http://localhost:3000/api/veterinarias';

  constructor(private http: HttpClient) { }

  getVeterinarias() {
    return this.http.get(`${this.baseUrl}`, { headers: { 'Cache-Control': 'no-cache' } });
  }
  
  createVeterinaria(data: any) {
    return this.http.post(this.baseUrl, data);
  }
  
  updateVeterinaria(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteVeterinaria(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
