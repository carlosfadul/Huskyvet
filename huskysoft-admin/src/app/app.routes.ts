// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // Raíz -> login/auth
  { path: '', pathMatch: 'full', redirectTo: 'auth' },

  // Auth (lazy)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },

  // Dashboard principal (privado)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },

  // Listado de Veterinarias
  {
    path: 'veterinarias',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/veterinarias/veterinarias.component')
        .then(m => m.VeterinariasComponent),
  },

  // Panel admin de una veterinaria (superadmin/admin)
  {
    path: 'veterinaria/:veterinariaId/admin',
    canActivate: [roleGuard],
    data: { roles: ['superadmin', 'admin'] },
    loadComponent: () =>
      import('./pages/veterinaria-admin/veterinaria-admin.component').then(
        m => m.VeterinariaAdminComponent
      ),
  },

  // Sucursales por veterinaria
  {
    path: 'veterinaria/:id/sucursales',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/sucursales/sucursales.component')
        .then(m => m.SucursalesComponent),
  },

  // Dashboard operativo de una sucursal (con sus rutas hijas)
  {
    path: 'veterinaria/:veterinariaId/sucursal/:sucursalId/dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/sucursal-dashboard/sucursal-dashboard.routes')
        .then(m => m.sucursalDashboardRoutes),
  },

  // ================== CONFIGURACIÓN DE LA SUCURSAL ==================
  {
    path: 'veterinaria/:veterinariaId/sucursal/:sucursalId/dashboard/configuracion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/configuracion/configuracion.component')
        .then(m => m.ConfiguracionComponent),
    children: [
      {
        path: 'usuarios',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component')
            .then(m => m.UsuariosComponent),
      },
      {
        path: 'empleados',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/empleados/empleados.component')
            .then(m => m.EmpleadosComponent),
      },
      {
        path: 'aliados',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/aliados/aliados.component')
            .then(m => m.AliadosComponent),
      },
      
      {
        path: 'veterinaria/:veterinariaId/sucursal/:sucursalId/dashboard/aliados/:aliadoId/servicios',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/aliados/servicios-aliado/servicios-aliado.component')
            .then(m => m.ServiciosAliadoComponent),
      },

      {
        path: 'tratamientos',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/tratamientos/tratamientos.component')
            .then(m => m.TratamientosComponent),
      },
      {
        path: 'enfermedades',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/enfermedades/enfermedades.component')
            .then(m => m.EnfermedadesComponent),
      },
      {
        path: 'servicios',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/servicios/servicios.component')
            .then(m => m.ServiciosComponent),
      },
      {
        path: 'proveedores',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/proveedores/proveedores.component')
            .then(m => m.ProveedoresComponent),
      },
      {
        path: 'productos',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/productos/productos.component')
            .then(m => m.ProductosComponent),
      },
      // 👉 NUEVOS: VACUNAS Y DESPARASITANTES DENTRO DE CONFIGURACIÓN
      {
        path: 'vacunas',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/configuracion/vacunas/vacunas.component')
            .then(m => m.VacunasComponent),
      },
      {
        path: 'desparasitantes',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/configuracion/desparasitantes/desparasitantes.component')
            .then(m => m.DesparasitantesComponent),
      },

      // default de configuración -> usuarios
      { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
    ],
  },

  // ================== NÓMINA ==================
  {
    path: 'veterinaria/:veterinariaId/sucursal/:sucursalId/nomina/:nominaId/detalle',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/nomina/detalle-nomina/detalle-nomina.component')
        .then(m => m.DetalleNominaComponent),
  },
  {
    path: 'veterinaria/:veterinariaId/sucursal/:sucursalId/dashboard/nomina/:nominaId/detalle',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/nomina/detalle-nomina/detalle-nomina.component')
        .then(m => m.DetalleNominaComponent),
  },

  // ================== MASCOTA DETALLE ==================
  {
    path: 'veterinaria/:veterinariaId/sucursal/:sucursalId/dashboard/mascotas/:mascotaId/detalle',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mascotas/mascota-detalle/mascota-detalle.component')
        .then(m => m.MascotaDetalleComponent),
  },



  // ================== ERRORES / WILDCARD ==================
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./pages/errors/forbidden/forbidden.component')
        .then(m => m.ForbiddenComponent),
  },

  // Cualquier ruta desconocida -> forbidden (luego podrías cambiar a 404)
  { path: '**', redirectTo: 'forbidden' },
];
