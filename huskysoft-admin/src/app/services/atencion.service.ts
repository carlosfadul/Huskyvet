// src/app/services/atencion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtencionService {

  // 👉 Debe coincidir con app.js: app.use(`${API}/atenciones`, atencionRoutes);
  private baseUrl = `${environment.apiUrl}/atenciones`;

  constructor(private http: HttpClient) {}

  // Atenciones por mascota
  getByMascota(mascotaId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/mascota/${mascotaId}`);
  }

  // Crear atención (FormData porque puede llevar archivo)
  create(fd: FormData) {
    return this.http.post(`${this.baseUrl}`, fd);
  }

  // Actualizar atención
  update(id: number, fd: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, fd);
  }

  // Eliminar atención
  deleteAtencion(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // URL directa para ver/descargar el archivo adjunto
  getArchivoAdjuntoUrl(id: number): string {
    return `${this.baseUrl}/${id}/archivoAdjunto`;
  }
}


