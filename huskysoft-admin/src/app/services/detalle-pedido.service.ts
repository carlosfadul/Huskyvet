// src/app/services/detalle-pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DetallePedido {
  detallePedido_id?: number;
  pedido_id: number;
  producto_id: number;
  detallePedido_cantidad: number;
  detallePedido_precio: number;
  cantidad_recibida: number;
}

@Injectable({
  providedIn: 'root'
})
export class DetallePedidoService {
  private apiUrl = `${environment.apiUrl}/detalle-pedido`;

  constructor(private http: HttpClient) {}

  // 🔹 Detalles de un pedido
  getPorPedido(pedidoId: number): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(`${this.apiUrl}/pedido/${pedidoId}`);
  }

  crear(detalle: DetallePedido): Observable<any> {
    return this.http.post(this.apiUrl, detalle);
  }

  actualizar(id: number, detalle: DetallePedido): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, detalle);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
