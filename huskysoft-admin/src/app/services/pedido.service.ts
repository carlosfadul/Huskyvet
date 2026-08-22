import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pedido {
  pedido_id: number;
  sucursal_id: number;
  proveedor_id: number | null;
  proveedor_nombre?: string;
  pedido_fecha: string;
  pedido_estado: string;
  pedido_detalles?: string;
  subtotal?: number;
  impuestos?: number;
  descuentos?: number;
  total?: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  getPedidosPorSucursal(sucursalId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/sucursal/${sucursalId}`);
  }

  createPedido(data: Partial<Pedido>): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, data);
  }

  updatePedido(id: number, data: Partial<Pedido>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
