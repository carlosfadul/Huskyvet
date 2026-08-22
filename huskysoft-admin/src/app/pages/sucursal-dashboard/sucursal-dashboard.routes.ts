// src/app/pages/sucursal-dashboard/sucursal-dashboard.routes.ts
import { Routes } from '@angular/router';
import { SucursalDashboardComponent } from './sucursal-dashboard.component';

export const sucursalDashboardRoutes: Routes = [
  {
    path: '',
    component: SucursalDashboardComponent,
    children: [
      // Ruta por defecto dentro del dashboard de sucursal
      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full'
      },

      // Clientes
      {
        path: 'clientes',
        loadComponent: () =>
          import('../clientes/clientes.component').then(m => m.ClientesComponent)
      },
      {
        path: 'clientes/:clienteId/detalle',
        loadComponent: () =>
          import('../../components/cliente-detalle/cliente-detalle.component')
            .then(m => m.ClienteDetalleComponent)
      },

      // Mascotas
      {
        path: 'mascotas',
        loadComponent: () =>
          import('../mascotas/mascotas.component').then(m => m.MascotasComponent)
      },

      // Nómina
      {
        path: 'nomina',
        loadComponent: () =>
          import('../nomina/nomina.component').then(m => m.NominaComponent)
      },

      // ✅ Ventas (lista)
      {
        path: 'ventas',
        loadComponent: () =>
          import('../ventas/ventas.component').then(m => m.VentasComponent)
      },

      // ✅ Detalle de una venta
      {
        path: 'venta/:ventaId/detalle',
        loadComponent: () =>
          import('../ventas/detalle-venta/detalle-venta.component')
            .then(m => m.DetalleVentaComponent)
      },

      // ✅ Pedidos (lista de compras)
      {
        path: 'pedidos',
        loadComponent: () =>
          import('../pedidos/pedidos.component').then(m => m.PedidosComponent)
      },

      // ✅ Detalle de un pedido (líneas de compra)
      {
        path: 'pedidos/:pedidoId/detalle',
        loadComponent: () =>
          import('../pedidos/detalle-pedido/detalle-pedido.component')
            .then(m => m.DetallePedidoComponent)
      }
    ]
  }
];
