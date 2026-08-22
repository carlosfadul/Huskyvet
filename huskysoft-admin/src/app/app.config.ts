// src/app/app.config.ts
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors /*, withFetch */ } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';

import { routes } from './app.routes';

// ⬇️ Interceptores (asegúrate de tener los archivos en src/app/core/interceptors/)
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(localeEsCO); // ✅ Pipes y formatos en es-CO

export const appConfig: ApplicationConfig = {
  providers: [
    // Rendimiento
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router + scroll al inicio en cada navegación
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),

    // HTTP Client
    provideHttpClient(
      // withFetch(), // <- opcional si prefieres fetch bajo el capó
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    // Animaciones (Angular Material)
    provideAnimations(),

    // Formato de fechas con NativeDateAdapter en español Colombia
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },

    // Localización global de la app
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
};
