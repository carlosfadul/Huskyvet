import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Configuración de la aplicación
const bootstrapConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      HttpClientModule
    )
  ]
};

// Inicialización de la aplicación
bootstrapApplication(AppComponent, bootstrapConfig)
  .catch(err => console.error('Error al inicializar la aplicación:', err));