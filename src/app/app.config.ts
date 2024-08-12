import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from '@core/auth/interceptors/auth.interceptor';
import { AuthService } from '@core/auth/services/auth.service';
import { initializeAuth } from '@core/auth/services/initialize-auth';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
// import { StreamingPlugin } from 'chartjs-plugin-streaming';
import 'chartjs-adapter-luxon'; // Need for provide date adapter

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
    provideCharts(withDefaultRegisterables([
      CandlestickController,
      CandlestickElement,
      // StreamingPlugin
    ])),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    },
  ]
};
