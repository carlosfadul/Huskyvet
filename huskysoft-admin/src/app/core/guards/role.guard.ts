// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

function decodeToken(token: string): any | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const json = atob(payloadBase64);
    return JSON.parse(json);
  } catch (e) {
    console.error('Error decodificando token JWT', e);
    return null;
  }
}

// 🔎 Función helper: intenta sacar el rol del objeto usuario
function getRoleFromUsuario(u: any): string | null {
  if (!u) return null;

  // Probamos varios nombres posibles de campo
  return (
    u.tipo ??            // ej: "superadmin"
    u.usuario_tipo ??    // coincide con tu columna de BD
    u.tipo_usuario ??    // variante
    u.rol ??             // ej: "admin"
    u.role ??            // ej: "admin"
    u.userRole ??        // otra variante
    null
  );
}

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  const requiredRoles = (route.data['roles'] as string[]) || [];

  let usuario: any = null;
  let userRole: string | null = null;

  // 1️⃣ Intentamos leer usuario desde localStorage
  const rawUsuario = localStorage.getItem('usuario');
  if (rawUsuario) {
    try {
      usuario = JSON.parse(rawUsuario);
      userRole = getRoleFromUsuario(usuario);
    } catch (e) {
      console.error('Error parseando usuario de localStorage', e);
    }
  }

  // 2️⃣ Si no hay rol aún, intentamos sacarlo del token
  if (!userRole) {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        usuario = payload;
        userRole = getRoleFromUsuario(payload);
      }
    }
  }

  // Logs de ayuda
  console.log('RAW USUARIO COMPLETO ====>', usuario);
  console.log(
    'roleGuard -> requiredRoles:',
    requiredRoles,
    'userRole:',
    userRole,
    'rawUsuario:',
    usuario
  );

  // Si la ruta no define roles, dejamos pasar
  if (!requiredRoles.length) {
    return true;
  }

  // Si no hay usuario/rol → bloqueamos
  if (!userRole) {
    router.navigate(['/forbidden'], { queryParams: { redirect: state.url } });
    return false;
  }

  // Superadmin entra a todo
  if (userRole === 'superadmin') {
    return true;
  }

  // Si el rol del usuario está permitido, pasa
  if (requiredRoles.includes(userRole)) {
    return true;
  }

  // Caso contrario → acceso denegado
  router.navigate(['/forbidden'], { queryParams: { redirect: state.url } });
  return false;
};
