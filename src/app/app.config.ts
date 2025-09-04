import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LoginRoutes } from './pages/login/login.routes';
import {
  provideHttpClient,
  withInterceptors,
  HttpInterceptorFn,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter([...routes, ...LoginRoutes]),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) =>
          inject(AuthInterceptor).intercept(req, {
            handle: (req) => next(req),
          }),
      ])
    ),
  ],
};
