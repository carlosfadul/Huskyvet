// src/app/services/venta.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Venta {
  venta_id?: number;
  cliente_id: number;
  sucursal_id: number;
  usuario_id?: number | null;
  venta_fecha?: string | Date;
  venta_estado?: 'pendiente' | 'completada' | 'cancelada';
  venta_detalles?: string | null;
  subtotal?: number | null;
  impuestos?: number | null;
  descuentos?: number | null;
  total?: number | null;
  metodo_pago?: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro' | string;
}

export interface DetalleVenta {
  detalleVenta_id?: number;
  venta_id: number;
  producto_id: number;
  detalleVenta_cantidad: number;
  detalleVenta_precio: number;
  descuento?: number | null;
  subtotal?: number | null; // calculado en BD
}

// 🔹 Body para crear venta completa (venta + detalles)
export interface VentaCompletaRequest {
  cliente_id: number;
  sucursal_id: number;
  usuario_id?: number | null;
  venta_estado?: 'pendiente' | 'completada' | 'cancelada';
  venta_detalles?: string | null;
  metodo_pago: string;
  items: {
    producto_id: number;
    cantidad: number;
    descuento?: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // ej: http://localhost:3000/api

  // 🔹 Lista de ventas por sucursal
  getVentasPorSucursal(sucursalId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas/sucursal/${sucursalId}`);
  }

  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas`);
  }

  getVentaById(ventaId: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/ventas/${ventaId}`);
  }

  createVenta(data: Venta): Observable<Venta> {
    return this.http.post<Venta>(`${this.apiUrl}/ventas`, data);
  }

  updateVenta(id: number, data: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/ventas/${id}`, data);
  }

  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ventas/${id}`);
  }

  // 🔹 DetalleVenta
  getDetalleVentaPorVenta(ventaId: number): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/detalle-venta/venta/${ventaId}`);
  }

  createDetalleVenta(data: DetalleVenta): Observable<DetalleVenta> {
    return this.http.post<DetalleVenta>(`${this.apiUrl}/detalle-venta`, data);
  }

  updateDetalleVenta(id: number, data: DetalleVenta): Observable<DetalleVenta> {
    return this.http.put<DetalleVenta>(`${this.apiUrl}/detalle-venta/${id}`, data);
  }

  deleteDetalleVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/detalle-venta/${id}`);
  }

  // ✅ NUEVO: crear venta completa (venta + detalles + actualizar inventario)
  createVentaCompleta(data: VentaCompletaRequest): Observable<{ message: string; venta_id: number }> {
    return this.http.post<{ message: string; venta_id: number }>(
      `${this.apiUrl}/ventas/completa`,
      data
    );
  }
}
